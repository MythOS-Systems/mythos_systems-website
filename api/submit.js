// Vercel serverless function: POST /api/submit
//
// Single front door for every website form. Forwards submissions into the
// MythOS Pro account via Pro's public ingest endpoints, so they show up in the
// account Nate logs into:
//
//   - kind === 'job-application'  ->  Pro /api/public/job-applications  (Careers tab)
//   - every other kind            ->  Pro /api/public/site-messages     (Comms Hub inbox)
//
// We forward server-side (not from the browser) so there is no CORS dance and
// no keys live in the client. The site_id below maps to the "MythOS Systems"
// shop's "MythOS Website" site in MythOS Pro; override via env if that changes.

const PRO_URL = (process.env.MYTHOS_PRO_URL || 'https://mythospro.ai').replace(/\/$/, '');
const SITE_ID = process.env.MYTHOS_PRO_SITE_ID || '1b893314-57ad-4f0e-b2f8-508f113d7f4f';

// For inbox forms: a human label plus which raw field carries the sender's
// name / email. Everything else the form collected is rendered into the
// message body and stashed in metadata.
const INBOX_KINDS = {
  'creator-affiliate':          { label: 'Affiliate application',         name: 'creator_name',  email: 'email' },
  'bid-chamber-partner':        { label: 'BID / Chamber partner inquiry',  name: 'contact_name',  email: 'contact_email' },
  'early-adopter-business':     { label: 'Founding partner application',   name: 'owner_name',    email: 'owner_email' },
  'investor-lead':              { label: 'Investor deck request',          name: 'full_name',     email: 'email' },
  'early-access':               { label: 'Early access signup',            name: null,            email: 'email' },
  'network-early-access':       { label: 'MythOS Network early access',    name: 'business_name', email: 'email' },
  'mythos-pro-early-access':    { label: 'MythOS Pro early access',        name: 'business_name', email: 'email' },
  'mylo-personal-early-access': { label: 'Mylo Personal early access',     name: null,            email: 'email' },
  'events-signup':              { label: 'Events page signup',             name: null,            email: 'email' },
  'website-audit-lead':         { label: 'Website audit lead',             name: 'business_name', email: 'email' },
};

const PHONE_KEYS = ['phone', 'owner_phone', 'contact_phone'];

// Inbox forms that should also email the owner (high-signal: partner + investor
// inquiries). Careers applications email separately via the job-applications
// endpoint. Everything else (early access, product, events, audit) is inbox-only.
const NOTIFY_KINDS = new Set([
  'investor-lead',
  'early-adopter-business',
  'bid-chamber-partner',
  'creator-affiliate',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const kind = body.kind;

  try {
    if (kind === 'job-application') {
      return await forward(res, '/api/public/job-applications', buildJobApplication(body));
    }
    const payload = buildSiteMessage(kind, body);
    if (!payload) return res.status(400).json({ error: `Unsupported form: ${kind || '(none)'}` });
    return await forward(res, '/api/public/site-messages', payload);
  } catch (err) {
    console.error('[submit] unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

async function forward(res, path, payload) {
  let upstream;
  try {
    upstream = await fetch(`${PRO_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: SITE_ID, ...payload }),
    });
  } catch (err) {
    console.error('[submit] could not reach MythOS Pro:', err);
    return res.status(502).json({ error: 'Could not reach MythOS Pro. Please try again.' });
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    console.error('[submit] MythOS Pro rejected submission:', upstream.status, data, 'payload:', payload);
    return res.status(502).json({ error: data.error || 'Submission was rejected. Please try again.' });
  }
  return res.status(200).json({ ok: true });
}

// ---- careers application -> job_applications (Careers tab) -----------------

function buildJobApplication(b) {
  const messageParts = [];
  if (b.why_mythos) messageParts.push(`Why MythOS:\n${b.why_mythos}`);
  if (b.experience_summary) messageParts.push(`Experience:\n${b.experience_summary}`);
  if (b.availability) messageParts.push(`Availability: ${b.availability}`);
  const loc = [b.location_city, b.location_state].filter(Boolean).join(', ');
  if (loc) messageParts.push(`Location: ${loc}`);
  if (b.linkedin_url) messageParts.push(`LinkedIn: ${b.linkedin_url}`);

  const payload = {
    applicant_name: str(b.full_name) || 'Unknown applicant',
    metadata: clean({
      source: 'website_careers',
      why_mythos: str(b.why_mythos) || undefined,
      experience_summary: str(b.experience_summary) || undefined,
      availability: str(b.availability) || undefined,
      location_city: str(b.location_city) || undefined,
      location_state: str(b.location_state) || undefined,
      linkedin_url: str(b.linkedin_url) || undefined,
    }),
  };
  const email = str(b.email);
  if (email) payload.email = email.slice(0, 320);
  const phone = str(b.phone);
  if (phone) payload.phone = phone.slice(0, 60);
  const position = str(b.position_applied_for);
  if (position) payload.position = position.slice(0, 200);
  if (messageParts.length) payload.message = messageParts.join('\n\n').slice(0, 10000);
  const portfolio = safeUrl(b.portfolio_url);
  if (portfolio) payload.portfolio_url = portfolio;
  return payload;
}

// ---- everything else -> comm_messages (Comms Hub inbox) --------------------

function buildSiteMessage(kind, b) {
  const cfg = INBOX_KINDS[kind];
  if (!cfg) return null;

  const email = str(b[cfg.email]) || str(b.email);
  if (!email) return null;
  const name = (cfg.name && str(b[cfg.name])) || str(b.name) || email;

  let phone = '';
  for (const k of PHONE_KEYS) { if (str(b[k])) { phone = str(b[k]); break; } }

  // Everything the form collected, minus routing noise, for the body + metadata.
  const fields = { ...b };
  delete fields.kind;
  delete fields.source;
  delete fields.site_id;

  const lines = [`New ${cfg.label.toLowerCase()} from the website.`, ''];
  for (const [k, v] of Object.entries(fields)) {
    const rendered = renderValue(v);
    if (rendered) lines.push(`${humanize(k)}: ${rendered}`);
  }

  return clean({
    name: name.slice(0, 200),
    email: email.slice(0, 320),
    phone: phone ? phone.slice(0, 60) : undefined,
    subject: cfg.label.slice(0, 200),
    message: (lines.join('\n').trim() || cfg.label).slice(0, 10000),
    notify_owner: NOTIFY_KINDS.has(kind) || undefined,
    metadata: { source: 'website_form', form_kind: kind, ...fields },
  });
}

// ---- helpers ---------------------------------------------------------------

function str(v) { return v == null ? '' : String(v).trim(); }

function clean(o) {
  for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k];
  return o;
}

function humanize(k) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderValue(v) {
  if (v == null || v === '') return '';
  if (typeof v === 'object') {
    return Object.entries(v)
      .filter(([, x]) => x != null && x !== '')
      .map(([k, x]) => `${humanize(k)}: ${x}`)
      .join(', ');
  }
  return String(v);
}

function safeUrl(v) {
  let s = str(v);
  if (!s) return undefined;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  try { return new URL(s).href.slice(0, 2000); } catch { return undefined; }
}
