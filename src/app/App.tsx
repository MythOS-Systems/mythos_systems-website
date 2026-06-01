import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ForBusinessesPage } from './pages/ForBusinessesPage';
import { ManifestoPage } from './pages/ManifestoPage';
import { InvestorPage } from './components/InvestorPage';
import { FAQ } from './components/FAQ';
import { SanDiegoPage } from './pages/SanDiegoPage';
import { DFWPage } from './pages/DFWPage';
import { PartnerPage } from './pages/PartnerPage';
import { EventsPage } from './pages/EventsPage';
import { WebsiteAuditPage } from './pages/WebsiteAuditPage';

type PageType =
  | 'home'
  | 'products'
  | 'business'
  | 'manifesto'
  | 'investors'
  | 'faq'
  | 'sandiego'
  | 'dfw'
  | 'partner'
  | 'events'
  | 'websiteAudit';

/** Map state-routing page names → URL paths. Plain home stays at "/". */
const PATH_FOR: Record<PageType, string> = {
  home: '/',
  products: '/products',
  business: '/for-businesses',
  manifesto: '/manifesto',
  investors: '/investors',
  faq: '/faq',
  sandiego: '/san-diego',
  dfw: '/dfw',
  partner: '/partner',
  events: '/events',
  websiteAudit: '/website-audit',
};

const PAGE_FOR_PATH = (() => {
  const m: Record<string, PageType> = {};
  for (const k of Object.keys(PATH_FOR) as PageType[]) m[PATH_FOR[k]] = k;
  return m;
})();

function pageFromUrl(): PageType {
  if (typeof window === 'undefined') return 'home';
  return PAGE_FOR_PATH[window.location.pathname] ?? 'home';
}

/** Per-route title + description so each page gives crawlers/AI distinct metadata. */
const ROUTE_META: Record<PageType, { title: string; description: string }> = {
  home: {
    title: 'MythOS | The Fight for Local',
    description:
      'The operating system for local economies. Software, hardware, and payments that help local businesses fight back against Big Tech.',
  },
  products: {
    title: 'Products | MythOS',
    description:
      'MythOS Pro, The Network, and the Smart Mirror: the AI-powered tools rebuilding local commerce.',
  },
  business: {
    title: 'For Businesses | MythOS',
    description:
      'MythOS Pro is an AI business operating system for local businesses, handling customers, bookings, insights, and operations in one place.',
  },
  manifesto: {
    title: 'Manifesto | MythOS',
    description:
      "Big Tech took your Main Street. We're taking it back. The MythOS manifesto for local economies.",
  },
  investors: {
    title: 'For Investors | MythOS',
    description: 'The MythOS investment story: the operating system for local economies, built city by city.',
  },
  faq: {
    title: 'FAQ | MythOS',
    description: 'Answers about MythOS, MythOS Pro, The Network, and how we fight for local.',
  },
  sandiego: {
    title: 'San Diego | MythOS',
    description: 'MythOS in San Diego: rebuilding local economies, one city at a time.',
  },
  dfw: {
    title: 'Dallas / Fort Worth | MythOS',
    description: 'MythOS in Dallas and Fort Worth, where it all started.',
  },
  partner: {
    title: 'Become a Partner | MythOS',
    description:
      'Partner with MythOS: districts, chambers, small businesses, creators, and the team building the rebellion.',
  },
  events: {
    title: 'Events | MythOS',
    description:
      'MythOS events, headlined by Fight for Local: a championship fight night in Dallas / Fort Worth with a community hackathon.',
  },
  websiteAudit: {
    title: 'Website Audit | MythOS',
    description: 'Internal website audit tool.',
  },
};

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function applyRouteMeta(page: PageType) {
  const m = ROUTE_META[page] ?? ROUTE_META.home;
  document.title = m.title;
  setMetaTag('name', 'description', m.description);
  setMetaTag('property', 'og:title', m.title);
  setMetaTag('property', 'og:description', m.description);
  setMetaTag('name', 'twitter:title', m.title);
  setMetaTag('name', 'twitter:description', m.description);
  setMetaTag('property', 'og:url', `https://mythosrebellion.com${PATH_FOR[page] === '/' ? '' : PATH_FOR[page]}`);
  // Keep the internal audit tool out of search results; reset to indexable elsewhere.
  setMetaTag('name', 'robots', page === 'websiteAudit' ? 'noindex, nofollow' : 'index, follow');

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', `https://mythosrebellion.com${PATH_FOR[page]}`);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => pageFromUrl());

  // Make setCurrentPage available globally for navigation. The pushState
  // call is what lets the analytics tracker (getinfo.js) register an SPA
  // navigation as a page_view with the right url_path; without it every
  // event records as "/".
  useEffect(() => {
    (window as any).navigateTo = (page: PageType) => {
      const path = PATH_FOR[page] ?? '/';
      if (window.location.pathname !== path) {
        window.history.pushState({ page }, '', path);
      }
      setCurrentPage(page);
      window.scrollTo(0, 0);
    };

    // Honor back/forward by reading the URL.
    const onPop = () => setCurrentPage(pageFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Keep the document title / meta / canonical in sync with the current route.
  useEffect(() => {
    applyRouteMeta(currentPage);
  }, [currentPage]);

  // Render the appropriate page
  switch (currentPage) {
    case 'products':
      return <ProductsPage />;
    case 'business':
      return <ForBusinessesPage />;
    case 'manifesto':
      return <ManifestoPage />;
    case 'investors':
      return <InvestorPage />;
    case 'faq':
      return <FAQ />;
    case 'sandiego':
      return <SanDiegoPage />;
    case 'dfw':
      return <DFWPage />;
    case 'partner':
      return <PartnerPage />;
    case 'events':
      return <EventsPage />;
    case 'websiteAudit':
      return <WebsiteAuditPage />;
    default:
      return <HomePage />;
  }
}