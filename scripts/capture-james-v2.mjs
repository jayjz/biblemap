import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const phase = process.argv[2] ?? 'after';
const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4197';
const folder = `artifacts/james-v2/${phase}`;
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const observations = [];
for (const width of [1440, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}/human-story/james/`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${folder}/opening-${width}.jpg`, quality: 85 });
  for (const [index, id, label] of [[1,'brother','The brother'],[2,'appearance','The appearance'],[3,'jerusalem','Jerusalem'],[4,'record','The record'],[5,'remained','What remained']]) {
    await page.getByRole('link', { name: `${index} ${label}`, exact: true }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${folder}/${id}-${width}.jpg`, quality: 85 });
  }
  observations.push({ width, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile(`${folder}/observations.json`, JSON.stringify(observations, null, 2));
await browser.close();
