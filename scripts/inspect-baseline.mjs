// Read-only live browser comparison. No authentication material is persisted.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve('artifacts/irreplaceable/baseline');
mkdirSync(directory, { recursive: true });
const targets = [
  ['september', 'https://biblemap-2ninjk1d5-elliotandersons-projects.vercel.app'],
  ['october', 'https://biblemap-bho2je0q6-elliotandersons-projects.vercel.app'],
  ['production', 'https://biblemap-pink.vercel.app'],
];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const results = [];
try {
  for (const [name, origin] of targets) for (const [size, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: size === 'mobile', hasTouch: size === 'mobile' });
    const page = await context.newPage();
    const result = { name, size, origin, errors: [], failedRequests: [], httpErrors: [], observations: [] };
    page.on('pageerror', error => result.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') result.errors.push(message.text()); });
    page.on('requestfailed', request => result.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) result.httpErrors.push({ url: response.url(), status: response.status() }); });
    async function capture(label) {
      await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      await page.screenshot({ path: resolve(directory, `${name}-${size}-${label}.png`), fullPage: false });
      result.observations.push({ label, url: page.url(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 9000), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), state: await page.evaluate(() => window.__BIBLEMAP__ ?? null) });
    }
    try {
      await page.goto(origin, { waitUntil: 'networkidle', timeout: 45000 });
      await capture('home');
      if (new URL(page.url()).hostname === 'vercel.com') { result.protected = true; continue; }
      const enter = page.getByRole('link', { name: 'Enter the story' });
      if (await enter.count()) {
        await enter.click();
        await page.locator('[data-reader-ready=true]').waitFor();
        await capture('entry');
        await page.goto(`${origin}/jonah/#jonah-3-mercy`);
        await page.locator('[data-reader-ready=true]').waitFor();
        await capture('mercy');
        await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
        await page.waitForFunction(() => document.activeElement?.id === 'jonah-4-anger-heading');
        await page.locator('#jonah-4-anger-heading').scrollIntoViewIfNeeded();
        await page.evaluate(() => document.getElementById('jonah-4-anger-heading').scrollIntoView({ block: 'start', behavior: 'instant' }));
        await capture('anger');
        result.observations.push({ label: 'transition-geometry', verses: await page.locator('[data-reference="3:10"], [data-reference="4:1"]').evaluateAll(nodes => nodes.map(node => ({ reference: node.getAttribute('data-reference'), top: node.getBoundingClientRect().top, bottom: node.getBoundingClientRect().bottom, height: node.getBoundingClientRect().height }))) });
        await page.locator('[data-scene="jonah-4-anger"]').getByRole('link', { name: 'Explore Nineveh' }).click();
        await page.getByRole('heading', { name: 'Nineveh', exact: true }).waitFor();
        await capture('nineveh');
        result.observations.push({ label: 'nineveh-links', links: await page.getByRole('link').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent, href: node.getAttribute('href') }))) });
      }
      await page.goto(name === 'september' ? `${origin}/#exodus` : `${origin}/explore/#exodus`);
      await page.waitForFunction(() => window.__BIBLEMAP__?.ready, { timeout: 30000 });
      await capture('atlas');
      if (size === 'desktop') {
        await page.getByRole('button', { name: 'Exodus & Conquest', exact: true }).click();
        await page.waitForFunction(() => window.__BIBLEMAP__?.activeEpoch === 1);
        await page.getByRole('combobox', { name: 'Journey Mode' }).selectOption('exodus');
        await page.getByRole('button', { name: 'Pause journey' }).click();
        await page.getByRole('button', { name: 'Skip to next scene' }).click();
        await capture('exodus');
      }
    } catch (error) { result.interactionError = error.message; }
    finally { results.push(result); await context.close(); writeFileSync(resolve(directory, 'results.json'), JSON.stringify(results, null, 2)); }
  }
} finally { await browser.close(); }
console.log(JSON.stringify(results.map(({ name, size, protected: blocked, interactionError, errors, failedRequests, httpErrors, observations }) => ({ name, size, blocked, interactionError, errors, failedRequests, httpErrors, captures: observations.map(item => item.label) })), null, 2));
