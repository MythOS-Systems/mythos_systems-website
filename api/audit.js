// Vercel serverless function: GET /api/audit?url=<site>
//
// The website-auditor lead magnet on /for-businesses. It does NOT just run
// Lighthouse, it fetches the prospect's page and scores it across five
// categories deliberately bent toward what MythOS sells:
//
//   1. AI & Agent Readability  (the differentiator, "future" highlight)
//   2. SEO                     (table stakes; uses PageSpeed for real signals)
//   3. AI Features On-Site     ("future" highlight; try-on scores ~0 for all)
//   4. Conversion & Lead Capture
//   5. Trust & Presence
//
// Each category returns a 0-100 score plus expandable findings. Performance /
// mobile signals come from Google PageSpeed Insights (PAGESPEED_API_KEY env,
// optional but recommended); everything else is parsed from the page HTML.

import * as cheerio from 'cheerio';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const UA =
  'Mozilla/5.0 (compatible; MythOSAuditBot/1.0; +https://mythosrebellion.com/for-businesses)';

/* ------------------------------------------------------------------ utils */

function normalizeUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes('.')) return null;
    // Light SSRF guard: refuse obviously-internal targets.
    const h = parsed.hostname.toLowerCase();
    if (
      h === 'localhost' ||
      h.endsWith('.local') ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h)
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchText(url, { timeout = 15_000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    });
    const body = await resp.text();
    return { ok: resp.ok, status: resp.status, finalUrl: resp.url || url, body, contentType: resp.headers.get('content-type') || '' };
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, body: '', contentType: '', error: err };
  } finally {
    clearTimeout(t);
  }
}

// status: 'pass' = 1, 'warn' = 0.5, 'fail' = 0. weight defaults to 1.
function finding(label, status, detail, weight = 1) {
  return { label, status, detail, weight };
}

function scoreCategory(findings) {
  const total = findings.reduce((s, f) => s + f.weight, 0) || 1;
  const got = findings.reduce(
    (s, f) => s + f.weight * (f.status === 'pass' ? 1 : f.status === 'warn' ? 0.5 : 0),
    0,
  );
  return Math.round((got / total) * 100);
}

const has = (hay, ...needles) => needles.some((n) => hay.includes(n));

/* ------------------------------------------------- vendor / keyword tables */

const CHAT_VENDORS = ['intercom', 'drift.com', 'tidio', 'crisp.chat', 'livechat', 'tawk.to', 'zopim', 'zendesk', 'hubspot', 'podium', 'gorgias', 'freshchat', 'olark', 'smartsupp', 'manychat', 'facebook.com/plugins/customerchat'];
const BOOKING_VENDORS = ['calendly', 'acuityscheduling', 'squareup.com/appointments', 'square.site', 'booksy', 'resy.com', 'opentable', 'mindbodyonline', 'vagaro', 'setmore', 'simplybook', 'schedulicity', 'fresha', 'housecallpro', 'getjobber', 'youcanbook.me', 'cal.com'];
const AI_VENDORS = ['intercom', 'ada.cx', 'drift', 'tidio', 'lyro', 'openai', 'dialogflow', 'voiceflow', 'chatbase', 'fin.ai'];
const AI_KEYWORDS = ['ai assistant', 'ai-powered chat', 'chatbot', 'ask our ai', 'virtual assistant'];
const AR_KEYWORDS = ['try-on', 'try on', 'tryon', 'virtual try', 'augmented reality', 'ar experience', 'model-viewer', '8thwall', 'see it on you', 'visual preview', 'vto'];
const SOCIAL = { Facebook: 'facebook.com', Instagram: 'instagram.com', 'X / Twitter': 'twitter.com', LinkedIn: 'linkedin.com', YouTube: 'youtube.com', TikTok: 'tiktok.com', Yelp: 'yelp.com', Pinterest: 'pinterest.com' };
const CTA_WORDS = ['book now', 'book online', 'schedule', 'get a quote', 'request a quote', 'get started', 'contact us', 'call now', 'order online', 'reserve', 'make an appointment', 'sign up', 'buy now', 'shop now'];

/* ----------------------------------------------------- JSON-LD extraction */

function collectJsonLdTypes($) {
  const types = new Set();
  let rating = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    let json;
    try {
      json = JSON.parse($(el).contents().text());
    } catch {
      return;
    }
    const nodes = [];
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (n && typeof n === 'object') {
        nodes.push(n);
        if (n['@graph']) walk(n['@graph']);
      }
    };
    walk(json);
    for (const n of nodes) {
      const t = n['@type'];
      if (typeof t === 'string') types.add(t);
      else if (Array.isArray(t)) t.forEach((x) => types.add(x));
      if (n.aggregateRating || (typeof t === 'string' && t === 'AggregateRating')) {
        const r = n.aggregateRating || n;
        rating = {
          value: r.ratingValue ?? null,
          count: r.reviewCount ?? r.ratingCount ?? null,
        };
      }
    }
  });
  return { types, rating };
}

const LOCAL_TYPES = ['LocalBusiness', 'Restaurant', 'Store', 'Dentist', 'MedicalBusiness', 'HealthAndBeautyBusiness', 'HomeAndConstructionBusiness', 'ProfessionalService', 'AutoRepair', 'BeautySalon', 'HairSalon', 'Plumber', 'Electrician', 'Organization'];

/* Run PageSpeed Insights and return both the data and a diagnostic so failures
 * are visible (in logs and the response) instead of silently swallowed. */
async function runPsi(url) {
  const params = new URLSearchParams({ url, strategy: 'mobile' });
  for (const c of ['PERFORMANCE', 'SEO', 'ACCESSIBILITY', 'BEST_PRACTICES']) params.append('category', c);
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.set('key', key);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 45_000);
  try {
    const resp = await fetch(`${PSI_ENDPOINT}?${params}`, { signal: controller.signal });
    if (!resp.ok) {
      let error = `HTTP ${resp.status}`;
      try {
        const b = await resp.json();
        if (b?.error?.message) error = b.error.message;
      } catch {}
      return { data: null, diag: { ok: false, status: resp.status, keyUsed: !!key, error } };
    }
    return { data: await resp.json(), diag: { ok: true, status: 200, keyUsed: !!key, error: null } };
  } catch (err) {
    const timeout = err?.name === 'AbortError';
    return { data: null, diag: { ok: false, status: 0, keyUsed: !!key, error: timeout ? 'timeout' : String(err?.message || err) } };
  } finally {
    clearTimeout(t);
  }
}

/* ----------------------------------------------------------- the handler  */

export default async function handler(req, res) {
  const url = normalizeUrl(req.query.url);
  if (!url) {
    res.status(400).json({ error: 'Please enter a valid website address.' });
    return;
  }
  const origin = new URL(url).origin;

  // Fire page fetch, llms.txt, and PageSpeed all at once.
  const [page, llms, psi] = await Promise.all([
    fetchText(url, { timeout: 15_000 }),
    fetchText(`${origin}/llms.txt`, { timeout: 8_000 }),
    runPsi(url),
  ]);
  if (!psi.diag.ok) console.error('[audit] PageSpeed failed:', JSON.stringify(psi.diag));

  if (!page.ok || !page.body) {
    res.status(422).json({
      error: "We couldn't load that site. Double-check the address and try again.",
    });
    return;
  }

  const $ = cheerio.load(page.body);
  const html = page.body.toLowerCase();
  const finalUrl = page.finalUrl || url;
  const isHttps = finalUrl.startsWith('https://');

  // Gather reusable signals.
  const { types: ldTypes, rating } = collectJsonLdTypes($);
  const meta = (sel) => ($(sel).attr('content') || '').trim();
  const ogTitle = meta('meta[property="og:title"]');
  const ogDesc = meta('meta[property="og:description"]');
  const ogImage = meta('meta[property="og:image"]');
  const metaDesc = meta('meta[name="description"]');
  const title = ($('title').first().text() || '').trim();
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const imgs = $('img');
  const imgsWithAlt = imgs.filter((_, el) => ($(el).attr('alt') || '').trim().length > 0).length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const noindex = /noindex/i.test($('meta[name="robots"]').attr('content') || '');
  const telLinks = $('a[href^="tel:"]').length;
  const forms = $('form').length;
  const emailInputs = $('input[type="email"], input[name*="email" i]').length;
  const mailtoLinks = $('a[href^="mailto:"]').length;
  // Forms are often embedded via a third-party iframe/script, so a raw <form>
  // count misses them. Detect the common providers too.
  const embeddedForm = /typeform\.com|jotform|docs\.google\.com\/forms|formstack|wufoo|hsforms\.|formspree|gravityforms|tally\.so|wpforms|contact-?form-?7/.test(html);
  // Any way at all for a customer to reach out from the page.
  const hasMessagePath = forms > 0 || emailInputs > 0 || mailtoLinks > 0 || embeddedForm || telLinks > 0;
  const hasAddressSchema = ldTypes.has('PostalAddress') || /"address"\s*:/.test(page.body);
  const hasOpeningHours = /openinghours/i.test(page.body) || has(html, 'hours of operation', 'business hours', 'opening hours');

  const llmsPresent =
    llms.ok && llms.status === 200 && !llms.body.trim().startsWith('<') && llms.body.trim().length > 0;

  // PSI-derived numbers (may be null if no key / failure).
  const lh = psi.data?.lighthouseResult;
  const psiPerf = lh?.categories?.performance?.score != null ? Math.round(lh.categories.performance.score * 100) : null;
  const psiA11y = lh?.categories?.accessibility?.score != null ? Math.round(lh.categories.accessibility.score * 100) : null;

  // Social link detection.
  const socialFound = Object.entries(SOCIAL).filter(([, dom]) => html.includes(dom)).map(([name]) => name);

  /* --------------------------------------- 1. AI & Agent Readability ----- */
  const localSchema = [...ldTypes].some((t) => LOCAL_TYPES.includes(t));
  const richSchema = ['Service', 'Product', 'Review', 'AggregateRating', 'FAQPage', 'Menu', 'Offer'].some((t) => ldTypes.has(t));
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  const extractable = [
    !!(title || ogTitle), // name
    hasAddressSchema || telLinks > 0, // location/contact
    hasOpeningHours, // hours
    BOOKING_VENDORS.some((v) => html.includes(v)) || has(html, 'book', 'appointment'), // booking
  ].filter(Boolean).length;
  const semanticTags = ['main', 'header', 'nav', 'footer', 'article', 'section'].filter((t) => $(t).length > 0).length;

  const aiReadability = [
    finding(
      'Structured data (JSON-LD schema)',
      ldTypes.size === 0 ? 'fail' : localSchema && richSchema ? 'pass' : 'warn',
      ldTypes.size === 0
        ? 'No schema markup found. AI agents and Google can\'t reliably identify your business, services, or reviews.'
        : localSchema
        ? `Found: ${[...ldTypes].slice(0, 6).join(', ')}.${richSchema ? '' : ' Missing Service/Product/Review schema that agents use to recommend you.'}`
        : `Some schema present (${[...ldTypes].slice(0, 4).join(', ')}) but no LocalBusiness type, so agents can\'t place you.`,
      1.5,
    ),
    finding(
      'Open Graph & meta tags',
      ogCount === 0 && !metaDesc ? 'fail' : ogCount >= 2 && metaDesc ? 'pass' : 'warn',
      ogCount === 0 && !metaDesc
        ? 'No Open Graph or description tags. LLMs and link previews can\'t parse what your business is.'
        : `${ogCount}/3 Open Graph tags${metaDesc ? ' + meta description' : ', no meta description'}.`,
    ),
    finding(
      'Machine-readable business info',
      extractable >= 3 ? 'pass' : extractable >= 1 ? 'warn' : 'fail',
      extractable >= 3
        ? 'An AI agent can extract most of your name, location, hours, and booking link.'
        : `Only ${extractable}/4 of name, location, hours, and booking are machine-readable. The rest is likely locked in images or JavaScript, invisible to AI.`,
      1.25,
    ),
    finding(
      'llms.txt file',
      llmsPresent ? 'pass' : 'fail',
      llmsPresent
        ? 'You publish an llms.txt, so you\'re already speaking the language AI agents read.'
        : 'No llms.txt. This emerging standard tells AI assistants how to understand and recommend your business. Almost no local business has one yet, this is your chance to lead.',
    ),
    finding(
      'Semantic HTML structure',
      semanticTags >= 4 && h1Count >= 1 ? 'pass' : semanticTags >= 2 ? 'warn' : 'fail',
      semanticTags >= 4
        ? 'Clean semantic structure that agents and screen readers can navigate.'
        : 'Mostly generic <div> soup. Machines have to guess at your page structure instead of reading it.',
    ),
  ];

  /* ------------------------------------------------------- 2. SEO -------- */
  const altRatio = imgs.length ? imgsWithAlt / imgs.length : 1;
  const seo = [
    finding(
      'Title tag',
      title && title.length >= 10 && title.length <= 65 ? 'pass' : title ? 'warn' : 'fail',
      title ? `"${title.slice(0, 70)}"${title.length > 65 ? ' (too long for search results)' : ''}` : 'Missing page title. Google has nothing to show in results.',
    ),
    finding(
      'Meta description',
      metaDesc && metaDesc.length >= 50 && metaDesc.length <= 165 ? 'pass' : metaDesc ? 'warn' : 'fail',
      metaDesc ? `${metaDesc.length} characters.${metaDesc.length > 165 ? ' Will be truncated in results.' : metaDesc.length < 50 ? ' Too short to be compelling.' : ''}` : 'No meta description. Google writes its own snippet, and it rarely sells.',
    ),
    finding(
      'Heading structure',
      h1Count === 1 && h2Count >= 1 ? 'pass' : h1Count >= 1 ? 'warn' : 'fail',
      h1Count === 0 ? 'No H1 heading. Search engines can\'t tell what the page is about.' : h1Count > 1 ? `${h1Count} H1 tags (should be one).` : `One H1, ${h2Count} subheadings.`,
    ),
    finding(
      'Image alt text',
      imgs.length === 0 ? 'warn' : altRatio >= 0.8 ? 'pass' : altRatio >= 0.4 ? 'warn' : 'fail',
      imgs.length === 0 ? 'No images detected.' : `${imgsWithAlt}/${imgs.length} images have alt text. Missing alt text is invisible to Google Images and screen readers.`,
    ),
    finding(
      'Mobile-friendly',
      hasViewport ? 'pass' : 'fail',
      hasViewport ? 'Viewport is configured for phones.' : 'No mobile viewport tag. The site likely looks shrunken or broken on phones, where most local searches happen.',
    ),
    finding(
      'Page speed',
      psiPerf == null ? 'warn' : psiPerf >= 80 ? 'pass' : psiPerf >= 50 ? 'warn' : 'fail',
      psiPerf == null ? 'Speed not measured.' : `Google PageSpeed score: ${psiPerf}/100 on mobile.${psiPerf < 50 ? ' Slow enough that visitors leave before it loads.' : ''}`,
    ),
    finding(
      'Indexable by Google',
      noindex ? 'fail' : 'pass',
      noindex ? 'This page is set to "noindex", actively telling Google to hide it from results.' : 'Page is open to search engines.',
    ),
    finding(
      'Local SEO signals (NAP)',
      telLinks > 0 && hasAddressSchema ? 'pass' : telLinks > 0 || hasAddressSchema ? 'warn' : 'fail',
      telLinks > 0 && hasAddressSchema ? 'Phone and address are present and structured.' : 'Name/Address/Phone aren\'t fully present or structured, which weakens local map rankings.',
    ),
  ];

  /* --------------------------------------------- 3. AI Features On-Site -- */
  const hasChat = CHAT_VENDORS.some((v) => html.includes(v));
  const hasBooking = BOOKING_VENDORS.some((v) => html.includes(v));
  const hasAiTool = AI_VENDORS.some((v) => html.includes(v)) || AI_KEYWORDS.some((k) => html.includes(k));
  const hasTryOn = AR_KEYWORDS.some((k) => html.includes(k));

  const aiFeatures = [
    finding(
      'Live chat / instant replies',
      hasChat ? 'pass' : hasMessagePath ? 'warn' : 'fail',
      hasChat
        ? 'A live chat widget is on the site, so customers can get answers instantly.'
        : hasMessagePath
        ? 'You have a contact method, but no live chat, so customers wait hours for a reply instead of an instant answer. Mylo responds in seconds, 24/7.'
        : 'No live chat or contact method on the page, so there\'s no quick way for a customer to reach you. Every after-hours question is a lost lead.',
    ),
    finding(
      'Online booking widget',
      hasBooking ? 'pass' : 'fail',
      hasBooking ? 'Customers can book directly on the site.' : 'No embedded booking. Customers have to call during business hours, so many never do.',
    ),
    finding(
      'AI assistant on-site',
      hasAiTool ? 'pass' : 'fail',
      hasAiTool ? 'Some AI-powered interaction detected.' : 'No AI handling questions, booking, or follow-up. This is exactly what Mylo does for you 24/7.',
    ),
    finding(
      'AI visual preview / try-on',
      hasTryOn ? 'pass' : 'fail',
      hasTryOn ? 'Visual preview / try-on technology detected.' : 'Right now your site makes customers guess. "See the after, before the after." Mylo lets them see the result before they ever book or buy, the single biggest thing keeping them from saying yes.',
    ),
  ];

  /* ------------------------------------------- 4. Conversion & Capture --- */
  const ctaFound = CTA_WORDS.filter((w) => html.includes(w));
  const reviewsShown = ldTypes.has('Review') || ldTypes.has('AggregateRating') || has(html, 'testimonial', 'reviews', 'what our customers');
  const conversion = [
    finding(
      'Contact / lead form',
      (forms > 0 && emailInputs > 0) || embeddedForm ? 'pass' : forms > 0 || mailtoLinks > 0 ? 'warn' : 'fail',
      (forms > 0 && emailInputs > 0) || embeddedForm
        ? 'A contact form is in place for visitors to reach you.'
        : forms > 0
        ? `${forms} form(s) detected, but none capture an email.`
        : mailtoLinks > 0
        ? 'Only a plain email link, no contact form, so you lose visitors who won\'t open their mail app.'
        : 'No contact form. Interested visitors have no easy way to reach you.',
    ),
    finding(
      'Online booking / scheduling',
      hasBooking ? 'pass' : 'fail',
      hasBooking ? 'Direct booking is available.' : 'No self-serve booking, the #1 conversion leak for local services.',
    ),
    finding(
      'Clear calls-to-action',
      ctaFound.length >= 2 ? 'pass' : ctaFound.length === 1 ? 'warn' : 'fail',
      ctaFound.length ? `CTAs found: ${ctaFound.slice(0, 3).join(', ')}.` : 'No obvious call-to-action. Visitors don\'t know what to do next.',
    ),
    finding(
      'Reviews / social proof shown',
      reviewsShown ? 'pass' : 'fail',
      reviewsShown ? 'Reviews or testimonials are displayed.' : 'No reviews or testimonials on the page. New customers have no proof you\'re trusted.',
    ),
    finding(
      'Click-to-call',
      telLinks > 0 ? 'pass' : 'fail',
      telLinks > 0 ? 'Phone number is tap-to-call on mobile.' : 'No tap-to-call link. Mobile visitors have to copy your number by hand, most won\'t.',
    ),
  ];

  /* ------------------------------------------------ 5. Trust & Presence -- */
  const hasFavicon = $('link[rel*="icon"]').length > 0;
  const trust = [
    finding(
      'Secure connection (HTTPS)',
      isHttps ? 'pass' : 'fail',
      isHttps ? 'Served securely over HTTPS.' : 'Not secure. Browsers flag the site "Not Secure", which scares customers off instantly.',
    ),
    finding(
      'Reviews & ratings',
      rating?.value ? 'pass' : reviewsShown ? 'warn' : 'fail',
      rating?.value ? `Structured rating: ${rating.value}${rating.count ? ` from ${rating.count} reviews` : ''}.` : reviewsShown ? 'Reviews shown but not structured for Google star ratings.' : 'No ratings, so no star snippet in search results.',
    ),
    finding(
      'Social profiles linked',
      socialFound.length >= 2 ? 'pass' : socialFound.length === 1 ? 'warn' : 'fail',
      socialFound.length ? `Linked: ${socialFound.join(', ')}.` : 'No social profiles linked. Customers can\'t verify you\'re active and real.',
    ),
    finding(
      'Brand basics',
      hasFavicon && ogImage ? 'pass' : hasFavicon || ogImage ? 'warn' : 'fail',
      hasFavicon && ogImage ? 'Favicon and share image are set.' : 'Missing a favicon or share image, the site looks unfinished when shared or bookmarked.',
    ),
  ];

  /* ------------------------------------------------------- assemble ------ */
  const categories = [
    { key: 'ai-readability', label: 'AI & Agent Readability', highlight: 'future', blurb: 'Can AI assistants and search engines actually understand and recommend your business?', findings: aiReadability },
    { key: 'seo', label: 'SEO', highlight: null, blurb: 'The fundamentals that decide whether you show up in search at all.', findings: seo },
    { key: 'ai-features', label: 'AI Features On-Site', highlight: 'future', blurb: 'The interactive tools that turn visitors into booked customers, the gap MythOS fills.', findings: aiFeatures },
    { key: 'conversion', label: 'Conversion & Lead Capture', highlight: null, blurb: 'Where interested visitors slip away instead of becoming customers.', findings: conversion },
    { key: 'trust', label: 'Trust & Presence', highlight: null, blurb: 'The signals that tell a first-time visitor you\'re legit.', findings: trust },
  ].map((c) => ({
    ...c,
    score: scoreCategory(c.findings),
    findings: c.findings.map(({ weight, ...f }) => f), // drop internal weight
  }));

  const overall = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  res.status(200).json({
    url,
    finalUrl,
    fetchedAt: lh?.fetchTime || null,
    overall,
    categories,
    psiAvailable: psiPerf != null,
    psi: psi.diag, // { ok, status, keyUsed, error } — diagnostic for the PageSpeed call
  });
}
