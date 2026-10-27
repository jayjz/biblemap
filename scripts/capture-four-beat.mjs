import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const phase = process.argv[2] ?? 'before';
const base = process.env.CAPTURE_BASE ?? 'http://127.0.0.1:4197';
const directory = 'artifacts/nineveh-four-beat';
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const [label, width, height] of [['desktop',1440,1000],['390',390,844],['320',320,740],['tablet',820,1180]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [], failedRequests = [], httpErrors = [], consoleErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('requestfailed', req => { if (req.failure()?.errorText !== 'net::ERR_ABORTED') failedRequests.push(req.url()); });
    page.on('response', res => { if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`); });
    for (const beat of ['city','mercy','anger','question']) {
      await page.goto(`${base}/${phase === 'before' ? '' : 'experiments/nineveh-four-beat/'}#${beat}`);
      await page.locator(phase === 'before' ? '.nineveh[data-ready=true]' : '.four-beat[data-ready=true]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (phase !== 'before') await page.locator('.fb-panorama[data-image-state=ready]').waitFor();
      await page.evaluate(() => window.scrollTo(0,0));
      await page.locator('img:visible').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      if (phase !== 'before') await page.locator('.fb-position:visible').click();
      await page.screenshot({ path: `${directory}/${phase}-${label}-${beat}.png`, fullPage: true });
    }
    if (phase === 'after' && ['desktop','390'].includes(label)) {
      for (const treatment of ['a','b','c']) {
        await page.goto(`${base}/experiments/nineveh-four-beat/?treatment=${treatment}#mercy`);
        await page.locator('.four-beat[data-ready=true]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => window.scrollTo(0,0));
        await page.locator('img:visible').evaluateAll(images => Promise.all(images.map(img => img.decode())));
        await page.locator('.fb-position:visible').click();
        await page.screenshot({ path: `${directory}/study-${treatment}-${label}.png`, fullPage: true });
      }
      for (const [beat,discovery] of [['mercy','world'],['anger','voices'],['question','art']]) {
        await page.goto(`${base}/experiments/nineveh-four-beat/#${beat}/${discovery}`);
        await page.locator('details.fb-discovery[open]').waitFor();
        await page.locator('details.fb-discovery[open]').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${directory}/discovery-${discovery}-${label}.png` });
      }
      await page.goto(`${base}/experiments/nineveh-four-beat/#question/ending`);
      await page.locator('#question [data-reference="4:11"]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${directory}/ending-${label}.png` });
    }
    results.push({ label, errors, consoleErrors, failedRequests, httpErrors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${directory}/${phase}-results.json`, JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
if (results.some(r => r.errors.length || r.consoleErrors.length || r.failedRequests.length || r.httpErrors.length || r.overflow)) process.exitCode = 1;
