import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--enable-unsafe-swiftshader'] });
const results = [];
for (const [label, width, height] of [['320', 320, 740], ['390', 390, 844], ['tablet', 820, 1180], ['desktop', 1440, 1000]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  const consoleErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failedRequests.push({ url: request.url(), error: request.failure()?.errorText }); });
  page.on('response', response => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
  await page.goto('http://127.0.0.1:4195/jonah/#jonah-4-question');
  await page.locator('[data-reader-ready=true]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#jonah-4-question-heading').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/jonah-411-review/${phase}-${label}.png`, fullPage: true });
  await page.locator('#jonah-4-question').screenshot({ path: `artifacts/jonah-411-review/${phase}-scene-${label}.png` });
  if (phase === 'after') {
    for (const [panel, name] of [['house', 'Read a house sale'], ['voices', 'Read two interpretations']]) {
      await page.getByText(name, { exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.screenshot({ path: `artifacts/jonah-411-review/${phase}-${panel}-${label}.png` });
      await page.keyboard.press('Escape');
    }
  }
  results.push({ label, errors, consoleErrors, failedRequests, httpErrors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await browser.close();
await writeFile(`artifacts/jonah-411-review/${phase}-results.json`, JSON.stringify(results, null, 2) + '\n');
console.log(results);
