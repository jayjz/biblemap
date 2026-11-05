import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PLAYWRIGHT_BASE_URL;
if (!base || new URL(base).protocol !== 'https:') throw new Error('Set PLAYWRIGHT_BASE_URL to the exact HTTPS preview origin');
const folder = 'artifacts/thomas/cinematic/hosted';
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const observations = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', hasTouch: width === 390 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => errors.push(`${r.url()}: ${r.failure()?.errorText}`));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    const response = await page.goto(`${base}/human-story/thomas/#${width === 1440 ? 'eight-days' : 'unless'}`);
    await page.evaluate(() => document.fonts.ready);
    const scene = page.locator(width === 1440 ? '#eight-days' : '#unless');
    await scene.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    if (width === 390) await page.getByRole('checkbox', { name: 'Hold the two voices together', exact: true }).check();
    await scene.screenshot({ path: `${folder}/${width === 1440 ? 'eight-days' : 'voices'}-${width}.jpg`, quality: 85 });
    const noindex = (await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex');
    await page.goto(`${base}/human-story/thomas/sayings/#witnesses`);
    await page.getByRole('radio', { name: /P.Oxy. 1 Greek/ }).check();
    await expect(page.locator('[data-witness="oxy1"]')).toBeVisible();
    if (width === 1440) await page.locator('[data-witness="oxy1"]').screenshot({ path: `${folder}/oxy1-1440.jpg`, quality: 85 });
    await page.getByText('Read the whole preserved saying 13', { exact: true }).click();
    if (width === 390) await page.locator('#saying-13').screenshot({ path: `${folder}/saying-13-390.jpg`, quality: 85 });
    observations.push({ base, width, status: response.status(), noindex, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(`${folder}/observations.json`, JSON.stringify(observations, null, 2) + '\n');
console.log(JSON.stringify(observations));
