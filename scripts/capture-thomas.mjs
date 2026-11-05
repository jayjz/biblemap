import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const phase = process.argv[2] ?? 'after';
const folder = `artifacts/thomas/${phase}`;
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const observations = [];
for (const width of phase === 'studies' ? [1440,390] : [1440,768,390,320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', hasTouch: width <= 390 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push(`${r.url()}: ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  if (phase === 'studies') {
    await page.goto(pathToFileURL(resolve('artifacts/thomas/prototypes.html')).href);
    for (const id of ['absence','presence','testimony']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.locator(`#${id}`).screenshot({ path: `${folder}/${id}-${width}.jpg`, quality: 85 });
    }
  } else {
    const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4189';
    if (phase === 'baseline') {
      await page.goto(`${base}/human-story/james/`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${folder}/james-${width}.jpg`, quality: 80 });
    } else {
      await page.goto(`${base}/human-story/thomas/`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${folder}/opening-${width}.jpg`, quality: 85 });
      for (const id of ['absent','unless','eight-days','confession','not-seen']) {
        await page.locator(`nav[aria-label="Thomas movements"] a[href="#${id}"]`).click();
        await page.screenshot({ path: `${folder}/${id}-${width}.jpg`, quality: 85 });
      }
      await page.goto(`${base}/human-story/thomas/sayings/#comparison`);
      await page.screenshot({ path: `${folder}/comparison-${width}.jpg`, quality: 85 });
    }
  }
  observations.push({ width, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile(`${folder}/observations.json`, JSON.stringify(observations,null,2));
await browser.close();
