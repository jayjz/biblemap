import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] ?? 'after';
const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4197';
const folder = `artifacts/thomas-v4/${phase}`;
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const observations = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => errors.push(`${r.url()}: ${r.failure()?.errorText}`));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/human-story/thomas/`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').first().evaluate(img => img.decode());
    await page.screenshot({ path: `${folder}/opening-${width}.jpg`, quality: 82 });
    for (const id of ['absent', 'unless', 'eight-days', 'confession', 'not-seen']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.locator(`#${id} img`).evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      await page.locator(`#${id}`).screenshot({ path: `${folder}/${id}-${width}.jpg`, quality: 80 });
    }
    await page.goto(`${base}/human-story/thomas/reading/`);
    const readingOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.goto(`${base}/human-story/thomas/sayings/#witnesses`);
    await page.getByRole('radio', { name: /P.Oxy. 1 Greek/ }).check();
    await page.locator('#witnesses').screenshot({ path: `${folder}/witnesses-${width}.jpg`, quality: 82 });
    observations.push({ base, width, errors, readingOverflow, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(`${folder}/observations.json`, JSON.stringify(observations, null, 2) + '\n');
console.log(JSON.stringify(observations));
