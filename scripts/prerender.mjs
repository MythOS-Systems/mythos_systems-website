/**
 * Post-build prerender.
 *
 * The site is a client-rendered Vite SPA with a custom state router (it reads
 * window.location.pathname on load), plus WebGL + browser-only libs that can't
 * be server-rendered. So instead of SSR we snapshot: serve the built `dist/`,
 * render each route in headless Chrome, and write the fully-rendered HTML to
 * `dist/<route>/index.html`. Crawlers/AI get real content in raw HTML; users
 * still boot the live React app (it re-renders into #root).
 *
 * Best-effort: if a browser can't launch, it logs and exits 0 so a deploy still
 * ships the working SPA rather than failing the build.
 */
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const DIST = resolve(process.cwd(), 'dist');
const PORT = 4188;

const ROUTES = [
  '/',
  '/products',
  '/for-businesses',
  '/manifesto',
  '/events',
  '/partner',
  '/investors',
  '/san-diego',
  '/dfw',
  '/faq',
];

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.map': 'application/json',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json',
};

const GL_ARGS = [
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--no-sandbox',
];

function findChrome() {
  if (process.env.PRERENDER_CHROME) return process.env.PRERENDER_CHROME;
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return undefined;
}

/**
 * Resolve how to launch Chromium.
 *  1. A real local Chrome (dev machines / PRERENDER_CHROME) — fastest, what we use locally.
 *  2. @sparticuz/chromium — a self-contained Chromium that runs in Vercel's Linux build
 *     container, which has no system Chrome and lacks the shared libs a normal headless
 *     Chrome needs. This is what makes prerender actually run on Vercel.
 *  3. playwright-core's own resolution (only works if `playwright install` ran).
 */
async function resolveLaunchOptions() {
  const local = findChrome();
  if (local) {
    console.log(`[prerender] using local Chrome: ${local}`);
    return { executablePath: local, args: GL_ARGS };
  }
  try {
    const mod = await import('@sparticuz/chromium');
    const sparticuz = mod.default ?? mod;
    // Enable swiftshader-backed WebGL so the 3D components don't throw mid-render.
    sparticuz.setGraphicsMode = true;
    const executablePath = await sparticuz.executablePath();
    if (executablePath) {
      console.log(`[prerender] using @sparticuz/chromium: ${executablePath}`);
      return { executablePath, args: [...sparticuz.args, ...GL_ARGS] };
    }
  } catch (err) {
    console.error(`[prerender] @sparticuz/chromium unavailable: ${err.message}`);
  }
  console.log('[prerender] falling back to playwright-core default chromium');
  return { args: GL_ARGS };
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html not found. Run `vite build` first.');
    process.exit(0);
  }

  // The SPA shell, served for every route so the client router renders that page.
  const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const ext = extname(urlPath);
    if (ext) {
      const filePath = join(DIST, urlPath);
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
        return;
      }
      res.writeHead(404);
      res.end('not found');
      return;
    }
    // Route path (no extension): serve the SPA shell.
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(shell);
  });

  await new Promise((r) => server.listen(PORT, r));

  let browser;
  try {
    browser = await chromium.launch(await resolveLaunchOptions());
  } catch (err) {
    console.error('[prerender] Could not launch a browser:', err.message);
    server.close();
    // Fail the build so we never silently ship an empty SPA shell with no SEO/agent
    // content. Vercel keeps the previous (good) deployment live when a build fails.
    process.exit(1);
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  let ok = 0;

  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load', timeout: 60000 });
      // Wait for the React app to paint content into #root.
      await page.waitForFunction(() => {
        const r = document.getElementById('root');
        return r && r.children.length > 0 && r.innerText.trim().length > 50;
      }, { timeout: 30000 });
      // Let mount animations / lazy content settle.
      await page.waitForTimeout(1400);
      // Scroll through to trigger whileInView reveals so all content is present.
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 70));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);

      const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
      const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route.replace(/^\//, ''), 'index.html');
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf8');
      ok += 1;
      console.log(`[prerender] ${route} -> ${outPath.replace(DIST, 'dist')}`);
    } catch (err) {
      console.error(`[prerender] failed ${route}: ${err.message} (SPA fallback remains)`);
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] done: ${ok}/${ROUTES.length} routes prerendered.`);
  // Browser launched but rendered nothing → something is broken; fail loudly rather
  // than ship an empty shell. Partial success still ships (some content beats none).
  process.exit(ok === 0 ? 1 : 0);
}

main();
