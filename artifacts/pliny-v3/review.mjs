import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createExportServer } from '../../scripts/serve-export.mjs';

const phase = process.argv[2] ?? 'prototypes';
if (!['baseline', 'prototypes', 'draft', 'final'].includes(phase)) throw new Error('Unknown review phase');
const folder = new URL(phase === 'baseline' ? './before/' : `./${phase}/`, import.meta.url);
await mkdir(folder, { recursive: true });
let ownedServer;
let origin = process.env.PLINY_REVIEW_ORIGIN;
if (!origin && phase === 'draft') origin = 'http://localhost:4190';
if (!origin) {
  ownedServer = phase === 'prototypes' ? createExportServer(new URL('./lab', import.meta.url).pathname) : createExportServer();
  await new Promise(resolve => ownedServer.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${ownedServer.address().port}`;
}
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const observations = [];
try {
  for (const width of phase === 'final' ? [1440, 768, 390, 320] : [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width > 700 ? 1000 : 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    if (phase === 'prototypes') {
      for (const concept of ['carry', 'boundary', 'return']) {
        await page.goto(`${origin}/#${concept}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: new URL(`${concept}-opening-${width}.jpg`, folder).pathname, quality: 84 });
        await page.locator(`[data-concept="${concept}"] button`).first().click();
        await page.locator(`#${concept}-turn`).scrollIntoViewIfNeeded();
        await page.screenshot({ path: new URL(`${concept}-turn-${width}.jpg`, folder).pathname, quality: 84 });
        await page.locator(`#${concept}-ending`).scrollIntoViewIfNeeded();
        await page.screenshot({ path: new URL(`${concept}-ending-${width}.jpg`, folder).pathname, quality: 84 });
        observations.push({ concept, width, url: page.url(), title: await page.title(), state: await page.locator(`[data-concept="${concept}"]`).getAttribute('class'), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors: [...errors] });
      }
    } else {
      await page.goto(`${origin}/human-story/pliny/`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: new URL(`opening-${width}.jpg`, folder).pathname, quality: 86 });
      if (phase !== 'baseline') {
        await page.getByRole('button', { name: 'Keep this sentence' }).click();
        if (await page.locator('[data-encounter="pliny"]').getAttribute('data-kept') !== 'true') throw new Error('The quotation was not kept');
      }
      for (const id of phase === 'baseline' ? ['pliny-women', 'pliny-survives'] : ['pliny-communal', 'pliny-women', 'pliny-reply']) {
        await page.locator(`#${id}`).evaluate(element => element.scrollIntoView({ block: 'start' }));
        await page.screenshot({ path: new URL(`${id}-${width}.jpg`, folder).pathname, quality: 86 });
        if (phase === 'final' && id === 'pliny-women') {
          await page.locator('header').getByRole('link', { name: 'First letter kept' }).click();
          await page.screenshot({ path: new URL(`docked-${width}.jpg`, folder).pathname, quality: 86 });
        }
      }
      observations.push({ width, url: page.url(), title: await page.title(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
      if (phase === 'final' && width === 320) {
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        await page.locator('header').getByRole('link', { name: 'First letter kept' }).click();
        await page.screenshot({ path: new URL('text-200-320.jpg', folder).pathname, quality: 86 });
        observations.push({ width, textSize: '200%', overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
      }
    }
    await context.close();
  }
  if (phase === 'baseline' || phase === 'final') {
    const samples = [];
    for (let run = 0; run < 3; run++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Performance.enable');
      await page.goto(`${origin}/human-story/pliny/`, { waitUntil: 'networkidle' });
      const sample = await page.evaluate(() => ({ navigation: performance.getEntriesByType('navigation').map(e => ({ domContentLoaded: e.domContentLoadedEventEnd, load: e.loadEventEnd, transferSize: e.transferSize })), resources: performance.getEntriesByType('resource').map(e => ({ name: new URL(e.name).pathname, bytes: e.transferSize, duration: e.duration })), paints: performance.getEntriesByType('paint').map(e => ({ name: e.name, time: e.startTime })) }));
      const metrics = await cdp.send('Performance.getMetrics');
      sample.metrics = metrics.metrics.filter(m => ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'JSHeapUsedSize'].includes(m.name));
      samples.push(sample);
      await context.close();
    }
    await writeFile(new URL('performance.json', folder), JSON.stringify({ environment: 'Local static export, Chrome, 390×844, reduced motion; three fresh browser contexts; lab observations, not field Web Vitals', samples }, null, 2));
  }
} finally { await browser.close(); ownedServer?.close(); }
await writeFile(new URL('observations.json', folder), JSON.stringify(observations, null, 2));
console.log(JSON.stringify(observations.map(({ errors, ...entry }) => ({ ...entry, errors: errors.length }))));
