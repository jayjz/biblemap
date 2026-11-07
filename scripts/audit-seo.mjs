// Crawl the complete static export over HTTP with JavaScript disabled.
// Uses the already locked Playwright browser/parser; no SEO service or API key.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { once } from 'node:events';
import { createExportServer } from './serve-export.mjs';
import { CANONICAL_ORIGIN, routePolicy } from '../src/domain/seo.ts';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const scope = read('docs/release/publication-scope.json');
const decision = read('docs/release/publication-decision.json');
const preview = process.env.VERCEL_ENV === 'preview';
const sourceManifest = read('.next/server/app-paths-manifest.json');
const prerender = read('.next/prerender-manifest.json');
const errors = [], warnings = [], routes = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const hosting = read('vercel.json');
check(hosting.framework === null && hosting.outputDirectory === 'out' && hosting.buildCommand === 'npm run build' && hosting.installCommand === 'npm ci', 'hosting: Vercel must serve the exact postbuild-validated static export');
check(hosting.routes?.some(route => route.src === '^/404(?:\\.html)?/?$' && route.status === 404), 'hosting: reserved error URLs require the tested HTTP 404 rule');
const server = createExportServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const local = `http://127.0.0.1:${server.address().port}`;
const remote = process.env.SEO_BASE_URL;
const base = remote ?? local;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const parsed = new Map();
  const parseHTML = async html => {
    await page.setContent(html);
    return page.evaluate(() => ({
      titles: Array.from(document.querySelectorAll('head > title'), el => el.textContent.trim()),
      descriptions: Array.from(document.querySelectorAll('meta[name="description"]'), el => el.content),
      canonicals: Array.from(document.querySelectorAll('link[rel="canonical"]'), el => el.href),
      robots: Array.from(document.querySelectorAll('meta[name="robots"]'), el => el.content),
      og: Array.from(document.querySelectorAll('meta[property^="og:"]'), el => [el.getAttribute('property'), el.content]),
      twitter: Array.from(document.querySelectorAll('meta[name^="twitter:"]'), el => [el.name, el.content]),
      h1: Array.from(document.querySelectorAll('h1'), el => el.textContent.trim()),
      text: document.body.innerText.replace(/\s+/g, ' ').trim(),
      links: Array.from(document.querySelectorAll('a[href]'), el => ({ href: el.getAttribute('href'), text: el.textContent.trim() || el.getAttribute('aria-label') || '' })),
      ids: Array.from(document.querySelectorAll('[id]'), el => el.id),
      jsonld: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), el => el.textContent),
      images: Array.from(document.images, el => ({ src: el.getAttribute('src'), alt: el.getAttribute('alt'), width: el.getAttribute('width'), height: el.getAttribute('height') })),
    }));
  };
  const sourceFor = path => {
    const target = path === '/' ? '' : path.replace(/\/$/, '');
    const key = Object.keys(sourceManifest).sort((a, b) => Number(a.includes('[')) - Number(b.includes('['))).find(key => {
      const pattern = key.replace(/\/page$/, '').replace(/\[[^/]+\]/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(target);
    });
    return key ? `src/app${key}.tsx` : 'unknown';
  };
  for (const entry of scope.routes) {
    const path = entry.route;
    const policy = routePolicy(path, scope, decision, preview);
    const response = await context.request.get(`${base}${path}`, { maxRedirects: 0 });
    const html = await response.text();
    const data = await parseHTML(html);
    parsed.set(path, data);
    const reviewOnly = (path === '/experiments/nineveh/' && process.env.BIBLEMAP_NINEVEH_REVIEW === '1') || (path === '/demo/' && process.env.BIBLEMAP_INTERNAL_REVIEW === '1');
    const expectedStatus = policy.available || reviewOnly ? 200 : 404;
    check(response.status() === expectedStatus, `${path}: HTTP ${response.status()}, expected ${expectedStatus}`);
    const row = { pathname: path, source: sourceFor(path), staticallyGenerated: path.slice(0, -1) in prerender.routes || path === '/', publication: entry.maturity, indexable: policy.index, status: response.status(), canonical: data.canonicals, title: data.titles[0], description: data.descriptions[0], robots: data.robots, sitemap: false, incoming: [], jsonld: data.jsonld.length };
    routes.push(row);
    if (!policy.available) continue;
    check(data.canonicals.length === 1 && data.canonicals[0] === policy.canonical, `${path}: canonical mismatch (${JSON.stringify(data.canonicals)})`);
    check(data.titles.length === 1 && data.titles[0].length > 8, `${path}: missing/conflicting title`);
    check(data.descriptions.length === 1 && data.descriptions[0].length > 10, `${path}: missing/conflicting description`);
    check(data.robots.length === 1 && data.robots[0] === `${policy.index ? 'index' : 'noindex'}, ${policy.follow ? 'follow' : 'nofollow'}`, `${path}: robots mismatch ${data.robots}`);
    check(data.h1.length === 1 && data.text.length > 90, `${path}: meaningful initial HTML / single h1 missing`);
    const og = Object.fromEntries(data.og), twitter = Object.fromEntries(data.twitter);
    check(og['og:title'] === data.titles[0] && og['og:description'] === data.descriptions[0] && og['og:url'] === policy.canonical, `${path}: conflicting Open Graph metadata`);
    check(twitter['twitter:title'] === data.titles[0] && twitter['twitter:description'] === data.descriptions[0], `${path}: conflicting social metadata`);
    for (const raw of data.jsonld) {
      try {
        const schema = JSON.parse(raw);
        check(schema['@context'] === 'https://schema.org', `${path}: JSON-LD context`);
        check(schema['@type'] === 'WebSite' && schema.name === 'BibleMap' && schema.url === `${CANONICAL_ORIGIN}/`, `${path}: unsupported or mismatched structured data; extend validator for new types`);
      } catch { errors.push(`${path}: invalid JSON-LD syntax`); }
    }
    for (const image of data.images) {
      check(image.alt !== null, `${path}: image missing alt ${image.src}`);
      if (!image.width || !image.height) warnings.push(`${path}: image lacks intrinsic dimensions ${image.src}`);
    }
    for (const representation of [path === '/' ? '/index.html' : `${path.slice(0, -1)}`, path === '/' ? null : `${path}index.html`].filter(Boolean)) {
      const alt = await context.request.get(`${base}${representation}`, { maxRedirects: 0 });
      const location = alt.headers().location;
      const redirect = new URL(location ?? '/', base);
      check((representation.endsWith('/index.html') && alt.status() === 404) || ([301, 308].includes(alt.status()) && redirect.pathname === path && redirect.origin === new URL(base).origin), `${path}: ${representation} must redirect once to canonical path (HTTP ${alt.status()}, ${location})`);
    }
    const htmlAlternative = path === '/' ? '/index.html' : `${path.slice(0, -1)}.html`;
    const htmlResponse = await context.request.get(`${base}${htmlAlternative}`, { maxRedirects: 0 });
    check(htmlResponse.status() === 404 || ([301, 308].includes(htmlResponse.status()) && new URL(htmlResponse.headers().location ?? '/', base).href === `${base}${path}`), `${path}: competing HTML representation ${htmlAlternative}`);
    // Queries affect reader/map state only; the initial metadata stays canonical.
    const variant = await context.request.get(`${base}${path}?utm_source=seo-audit`);
    const variantData = await parseHTML(await variant.text());
    check(variant.status() === 200 && JSON.stringify(variantData.canonicals) === JSON.stringify(data.canonicals), `${path}: query representation competes with canonical`);
  }
  for (const field of ['title', 'description']) {
    const seen = new Map();
    for (const route of routes.filter(r => routePolicy(r.pathname, scope, decision, preview).available)) {
      check(!seen.has(route[field]), `${route.pathname}: duplicate ${field} with ${seen.get(route[field])}`);
      seen.set(route[field], route.pathname);
    }
  }
  const sitemapResponse = await context.request.get(`${base}/sitemap.xml`);
  check(sitemapResponse.status() === 200 && /xml/.test(sitemapResponse.headers()['content-type'] ?? ''), 'sitemap: HTTP/content type');
  const xml = await sitemapResponse.text();
  const sitemap = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return { valid: !doc.querySelector('parsererror') && doc.documentElement.localName === 'urlset' && doc.documentElement.namespaceURI === 'http://www.sitemaps.org/schemas/sitemap/0.9', urls: Array.from(doc.querySelectorAll('url > loc'), el => el.textContent), dates: doc.querySelectorAll('lastmod').length };
  }, xml);
  check(sitemap.valid, 'sitemap: invalid XML/namespace');
  check(new Set(sitemap.urls).size === sitemap.urls.length, 'sitemap: duplicate URLs');
  check(sitemap.dates === 0, 'sitemap: dates require trustworthy source evidence');
  for (const route of routes) {
    const policy = routePolicy(route.pathname, scope, decision, preview);
    route.sitemap = sitemap.urls.includes(policy.canonical) && policy.canonical === `${CANONICAL_ORIGIN}${route.pathname}`;
    check(route.sitemap === policy.index, `${route.pathname}: sitemap/indexability mismatch`);
  }
  for (const url of sitemap.urls) check(routes.some(r => r.indexable && `${CANONICAL_ORIGIN}${r.pathname}` === url), `sitemap: noncanonical/unclassified URL ${url}`);
  const robotsResponse = await context.request.get(`${base}/robots.txt`);
  const robots = await robotsResponse.text();
  check(robotsResponse.status() === 200 && /text\/plain/.test(robotsResponse.headers()['content-type'] ?? ''), 'robots: HTTP/content type');
  check(/^User-Agent: \*$/im.test(robots) && /^Allow: \/$/im.test(robots) && !/^Disallow: \/.+/im.test(robots) && !/^Disallow: \/$/im.test(robots), 'robots: crawler/assets/noindex pages blocked');
  check(robots.includes(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`), 'robots: sitemap origin');
  const assets = new Set();
  for (const [path, data] of parsed) {
    if (!routePolicy(path, scope, decision, preview).available) continue;
    for (const link of data.links) {
      const url = new URL(link.href, `${CANONICAL_ORIGIN}${path}`);
      if (url.origin !== CANONICAL_ORIGIN) continue;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) { assets.add(url.pathname); continue; }
      const target = routes.find(r => r.pathname === url.pathname);
      check(!!target, `${path}: nonexistent/noncanonical internal destination ${link.href}`);
      if (!target) continue;
      const policy = routePolicy(target.pathname, scope, decision, preview);
      check(policy.available, `${path}: link to unpublished route ${link.href}`);
      check(link.href.startsWith('#') || policy.canonical === `${CANONICAL_ORIGIN}${url.pathname}`, `${path}: link uses canonical alias ${link.href}`);
      check(!!link.text, `${path}: unnamed internal link ${link.href}`);
      target.incoming.push(path);
      if (routePolicy(path, scope, decision, preview).index && !policy.index) warnings.push(`${path}: indexable page links to noindex ${link.href}`);
    }
  }
  for (const asset of assets) check((await context.request.get(`${base}${asset}`)).status() === 200, `internal asset link: ${asset}`);
  for (const row of routes) {
    row.incoming = [...new Set(row.incoming)].sort();
    if (row.indexable) check(row.pathname === '/' || row.incoming.some(path => path !== row.pathname), `${row.pathname}: orphan indexable route`);
  }
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
  for (const file of walk('out').filter(file => file.endsWith('.html'))) {
    const path = file.replace(/^out/, '').replace(/index.html$/, '').replace(/\/404.html$/, '/404/');
    check(scope.routes.some(r => r.route === path) || ['/404/', '/_not-found/'].includes(path), `unclassified exported HTML: ${file}`);
  }
  for (const errorPath of ['/404.html', '/404/', '/_not-found/']) check((await context.request.get(`${base}${errorPath}`)).status() === 404, `${errorPath}: error representation must return HTTP 404`);
  check((await context.request.get(`${base}/__seo_unknown_route__/`)).status() === 404, 'unknown route: must return genuine HTTP 404');
  check((await context.request.get(`${base}/human-story/__unknown_entry__/`)).status() === 404, 'unknown dynamic route: must return genuine HTTP 404');
  const report = { schemaVersion: 1, base, canonicalOrigin: CANONICAL_ORIGIN, publicationDecision: decision.status, preview, routes, sitemap, robots, errors, warnings: [...new Set(warnings)] };
  mkdirSync('artifacts/seo-routing', { recursive: true });
  writeFileSync(process.env.SEO_REPORT ?? 'artifacts/seo-routing/routes.json', `${JSON.stringify(report, null, 2)}\n`);
  for (const row of routes) console.log(`${row.status} ${row.pathname} ${row.indexable ? 'index' : 'noindex'} canonical=${row.canonical.join(',')} incoming=${row.incoming.length}`);
  for (const error of errors) console.error(error);
  console.log(`SEO: ${routes.length} classified routes; ${sitemap.urls.length} sitemap URLs; ${errors.length} errors; ${report.warnings.length} observations.`);
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
