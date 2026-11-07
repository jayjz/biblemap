import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const baseline = process.argv.includes('--baseline');
const base = process.env.PLAYWRIGHT_BASE_URL ?? (baseline ? 'https://biblemap-pink.vercel.app' : 'http://127.0.0.1:4193');
const folder = 'artifacts/james';
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const observations = [];
for (const width of baseline ? [1440, 390] : [1440, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}${baseline ? '/human-story/worlds/saints/' : '/human-story/james/'}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${folder}/${baseline ? 'before-saints' : 'opening'}-${width}.png` });
  if (!baseline) {
    await page.getByRole('link', { name: 'Begin with the brother', exact: true }).click();
    await expect(page.locator('aside > div > p').first()).toHaveText('The brother');
    await page.screenshot({ path: `${folder}/brother-${width}.png` });
    await page.getByRole('link', { name: '3 Jerusalem', exact: true }).click();
    await expect(page.locator('aside > div > p').first()).toHaveText('Jerusalem');
    const compare = await page.getByRole('button', { name: 'Compare surviving witnesses', exact: true }).boundingBox();
    if (!compare || compare.y < 0 || compare.y + compare.height > 1000) throw new Error('Comparison control is outside the viewport');
    const position = await page.evaluate(() => scrollY);
    // Real pointer input avoids Chromium's protocol scrollIntoView recentering
    // an already-visible control inside the sticky column.
    await page.mouse.click(compare.x + compare.width / 2, compare.y + compare.height / 2);
    await page.getByRole('button', { name: 'Acts', exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('Your place in the story: Jerusalem');
    await expect(page.getByRole('dialog')).toContainText('a different James');
    await page.screenshot({ path: `${folder}/witnesses-${width}.png` });
    await page.getByRole('button', { name: 'Return to the story', exact: true }).click();
    expect(Math.abs(await page.evaluate(() => scrollY) - position)).toBeLessThan(3);
    await page.getByRole('link', { name: '5 What remained', exact: true }).click();
    await expect(page.locator('aside > div > p').first()).toHaveText('What remained');
    await page.screenshot({ path: `${folder}/ending-${width}.png` });
    if ([1440, 390].includes(width)) {
      for (const [anchor, label] of [['2 The appearance', 'The appearance'], ['4 The record', 'The record']]) {
        await page.getByRole('link', { name: anchor, exact: true }).click();
        await expect(page.locator('aside > div > p').first()).toHaveText(label);
        await page.screenshot({ path: `${folder}/${label === 'The record' ? 'record' : 'appearance'}-${width}.png` });
      }
    }
  }
  observations.push({ width, url: page.url(), errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile(`${folder}/${baseline ? 'baseline' : 'browser'}-observations.json`, JSON.stringify(observations, null, 2));
await browser.close();
