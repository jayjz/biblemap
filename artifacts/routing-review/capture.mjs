import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Supplemental live-basemap evidence. Regression tests use a deterministic map style.
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--enable-unsafe-swiftshader'] });
const diagnostics = [];
try {
  for (const [name, width, height, path] of [
    ['home-320', 320, 840, '/?utm_source=chatgpt.com'],
    ['home-desktop', 1440, 1000, '/?utm_source=chatgpt.com'],
    ['explore-desktop', 1440, 1000, '/explore/#exodus'],
    ['explore-mobile', 393, 851, '/explore/'],
    ['reader-mobile', 393, 851, '/jonah/#jonah-1-calling'],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', error => diagnostics.push({ name, kind: 'pageerror', message: error.message }));
    page.on('console', message => { if (message.type() === 'error') diagnostics.push({ name, kind: 'console', message: message.text() }); });
    page.on('requestfailed', request => diagnostics.push({ name, kind: 'network', url: request.url(), message: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) diagnostics.push({ name, kind: 'http', url: response.url(), status: response.status() }); });
    await page.goto(`http://127.0.0.1:4189${path}`);
    await page.evaluate(() => document.fonts.ready);
    if (path.startsWith('/?')) await page.locator('.nineveh-world[data-environment="ready"]').waitFor();
    else if (path.startsWith('/explore/')) {
      await page.waitForFunction(() => window.__BIBLEMAP__?.ready);
      await page.waitForTimeout(2000);
    } else await page.locator('[data-reader-ready="true"]').waitFor();
    await page.screenshot({ path: `artifacts/routing-review/${name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile('artifacts/routing-review/live-diagnostics.json', JSON.stringify(diagnostics, null, 2) + '\n');
}
