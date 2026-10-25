import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = 'http://127.0.0.1:4191';
const directory = resolve('artifacts/irreplaceable/experiment');
mkdirSync(directory, { recursive: true });
const chapter3 = JSON.parse(readFileSync('src/content/scripture/web-jonah-3.json', 'utf8'));
const chapter4 = JSON.parse(readFileSync('src/content/scripture/web-jonah-4.json', 'utf8'));
const verses = [{ ...chapter3.verses[9], reference: '3:10' }, ...chapter4.verses.slice(0, 4).map(v => ({ ...v, reference: `4:${v.number}` }))];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const results = [];
async function screenshot(page, file) {
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
  await page.screenshot({ path: resolve(directory, file), fullPage: true });
}
try {
  for (const [size, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['narrow', 320, 700]]) {
    for (const treatment of ['a', 'b', 'c']) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: size !== 'desktop', hasTouch: size !== 'desktop' });
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
      const page = await context.newPage();
      const result = { treatment, size, errors: [], failedRequests: [], httpErrors: [], steps: [], metrics: null };
      page.on('pageerror', error => result.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') result.errors.push(message.text()); });
      page.on('requestfailed', request => result.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) result.httpErrors.push({ url: response.url(), status: response.status() }); });
      try {
        const started = performance.now();
        await page.goto(`${base}/experiment/?t=${treatment}`);
        await expect(page.locator('.experiment')).toHaveAttribute('data-step', '3:10');
        if (treatment === 'b') await expect(page.locator('.place')).toBeVisible();
        result.metrics = await page.evaluate(() => ({ navigationMs: performance.getEntriesByType('navigation')[0].duration, resourceBytes: performance.getEntriesByType('resource').reduce((total, entry) => total + entry.transferSize, 0), resources: performance.getEntriesByType('resource').map(entry => ({ name: entry.name, bytes: entry.transferSize })), externalRequests: performance.getEntriesByType('resource').filter(entry => new URL(entry.name).origin !== location.origin).length }));
        result.metrics.readyMs = performance.now() - started;
        await page.keyboard.press('Tab');
        await expect(page.getByRole('link', { name: 'Skip to Scripture' })).toBeFocused();
        await page.keyboard.press('Enter');
        for (let index = 0; index < verses.length; index++) {
          const verse = verses[index];
          if (index > 0) { await page.getByRole('button', { name: 'Next verse', exact: false }).focus(); await page.keyboard.press('Enter'); }
          await expect(page.locator('.experiment')).toHaveAttribute('data-step', verse.reference);
          await expect(page.locator(`[data-verse="${verse.reference}"] .scripture`).last()).toHaveText(verse.text);
          if (index > 0) await expect(page.getByRole('heading', { name: 'Jonah 3:10–4:4', exact: true })).toBeFocused();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'horizontal overflow');
          const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
          result.steps.push({ reference: verse.reference, violations: violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(n => n.target) })) });
          assert.deepEqual(violations, [], `${treatment}/${size}/${verse.reference}: accessibility`);
          if (index === 0 || index === 1 || index === 4) await screenshot(page, `${treatment}-${size}-${verse.reference.replace(':', '-')}.png`);
          if (treatment === 'b') await expect(page.getByRole('heading', { name: 'Nineveh', exact: true })).toBeVisible();
        }
        await page.goBack();
        await expect(page.locator('.experiment')).toHaveAttribute('data-step', '4:3');
        await page.reload();
        await expect(page.locator('.experiment')).toHaveAttribute('data-step', '4:3');
        if (treatment === 'a') {
          await page.getByRole('button', { name: 'Read this verse alone' }).click();
          await expect(page.locator('[data-verse="3:10"]')).toHaveCount(0);
          await page.getByRole('button', { name: 'Place 3:10 beside this verse' }).click();
          await expect(page.locator('[data-verse="3:10"]')).toBeVisible();
        }
        if (treatment === 'c') {
          await page.getByRole('button', { name: 'Wide composition' }).click();
          await expect(page.locator('.spatial')).toHaveClass(/wide/);
          await expect(page.locator('.city-text')).toBeVisible();
          assert.equal(await page.locator('.spatial').evaluate(node => getComputedStyle(node).transitionDuration), '0s');
          await screenshot(page, `${treatment}-${size}-wide.png`);
        }
        await page.getByText('Continue in Scripture · Jonah 4:5–11', { exact: true }).click();
        for (const verse of chapter4.verses.slice(4)) await expect(page.locator(`[data-continuation="4:${verse.number}"]`)).toHaveText(verse.text);
        await page.getByText('Sources & what this composition implies', { exact: true }).click();
        assert.deepEqual((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations, []);
        assert.deepEqual(result.errors, []); assert.deepEqual(result.failedRequests, []); assert.deepEqual(result.httpErrors, []);
      } catch (error) { result.failure = error.message; await screenshot(page, `${treatment}-${size}-failure.png`); }
      finally { await context.tracing.stop({ path: resolve(directory, `${treatment}-${size}.zip`) }); await context.close(); results.push(result); writeFileSync(resolve(directory, 'results.json'), JSON.stringify(results, null, 2)); }
      console.log(`${treatment}/${size}: ${result.failure ?? 'PASS'}`);
    }
  }
  // Live map: no routing stubs. Separate its costs and dependencies from default reading.
  for (const [size, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const live = { treatment: 'b-live-map', size, errors: [], requests: [] };
  page.on('pageerror', error => live.errors.push(error.message));
  page.on('requestfailed', request => live.requests.push({ url: request.url(), error: request.failure()?.errorText }));
  try {
    await page.goto(`${base}/experiment/?t=b#4:1`);
    await page.getByRole('button', { name: 'Open geographic map' }).click();
    await expect(page.locator('.place')).toHaveAttribute('data-map-state', 'ready', { timeout: 30000 });
    await screenshot(page, `b-${size}-live-map.png`);
    await page.getByRole('button', { name: 'See the wider region' }).click();
    await page.getByRole('button', { name: 'Return to the city' }).click();
    await page.getByRole('button', { name: 'Next verse' }).click();
    await expect(page.locator('.place')).toHaveAttribute('data-map-state', 'ready');
    live.resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({ name: entry.name, bytes: entry.transferSize })));
    live.violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }));
    assert.deepEqual(live.violations, []);
    await page.getByRole('button', { name: 'Use schematic' }).click();
    await page.route('https://basemaps.cartocdn.com/**', route => route.abort());
    await page.getByRole('button', { name: 'Open geographic map' }).click();
    await expect(page.locator('.place')).toHaveAttribute('data-map-state', 'error', { timeout: 20000 });
    await expect(page.getByText('Map unavailable.', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Next verse' }).click();
    await expect(page.locator('.experiment')).toHaveAttribute('data-step', '4:3');
    await screenshot(page, `b-${size}-map-failure.png`);
    live.deliberateMapFailure = 'PASS; expected blocked CARTO request recorded separately';
  } catch (error) { live.failure = error.message; }
  await context.close(); results.push(live);
  }
  const extras = { treatment: 'motion-and-no-js' };
  try {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(`${base}/experiment/?t=c#4:1`);
    assert.equal(await page.locator('.spatial').evaluate(node => getComputedStyle(node).transitionDuration), '0.5s');
    await page.getByRole('button', { name: 'Wide composition' }).click();
    await expect(page.getByRole('button', { name: 'Wide composition' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Close composition' }).click();
    await expect(page.getByRole('button', { name: 'Close composition' })).toHaveAttribute('aria-pressed', 'true');
    await context.close();
    const noScript = await browser.newContext({ javaScriptEnabled: false });
    const fallback = await noScript.newPage();
    await fallback.goto(`${base}/experiment/`);
    await fallback.getByRole('link', { name: 'Read the complete accessible Scripture reader' }).click();
    await expect(fallback.locator('[data-reference="4:11"]')).toBeVisible();
    await noScript.close();
  } catch (error) { extras.failure = error.message; }
  results.push(extras);
  // The fourth condition is the actual exported reader, not a simplified imitation.
  for (const [size, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const baseline = { treatment: 'd-reader', size };
    try {
      await page.goto(`${base}/jonah/#jonah-3-mercy`);
      await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
      await page.locator('[data-reference="3:10"]').scrollIntoViewIfNeeded();
      await screenshot(page, `d-${size}-3-10.png`);
      await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
      await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
      await screenshot(page, `d-${size}-4-1.png`);
      await expect(page.locator('[data-reference="3:10"]')).toBeHidden();
      baseline.previousVerseHidden = true;
      baseline.violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(v => v.id);
      baseline.metrics = await page.evaluate(() => ({ navigationMs: performance.getEntriesByType('navigation')[0].duration, resourceBytes: performance.getEntriesByType('resource').reduce((total, entry) => total + entry.transferSize, 0) }));
      assert.deepEqual(baseline.violations, []);
    } catch (error) { baseline.failure = error.message; }
    await context.close(); results.push(baseline);
  }
} finally { await browser.close(); writeFileSync(resolve(directory, 'results.json'), JSON.stringify(results, null, 2)); }
const failures = results.filter(result => result.failure);
const panels = [
  ['A', 'Words beside words', 'a-desktop-4-1.png', 'a-mobile-4-1.png', '/experiment/?t=a#3:10', 'Keep 3:10 beside each new verse, or remove it. The relationship is carried by the text.'],
  ['B', 'The city remains', 'b-desktop-live-map.png', 'b-mobile-4-1.png', '/experiment/?t=b#3:10', 'Nineveh stays in place as the words change. Open the geographic map, change extent, or stay with the schematic.'],
  ['C', 'A wider frame', 'c-desktop-wide.png', 'c-mobile-wide.png', '/experiment/?t=c#3:10', 'Change the relative space occupied by the city composition and the verse. Abstract artwork, not a reconstruction.'],
  ['D', 'Existing reader', 'd-desktop-4-1.png', 'd-mobile-4-1.png', '/jonah/#jonah-3-mercy', 'The existing static export, including its full journey, sources, artwork and scene navigation.'],
];
writeFileSync(resolve(directory, '../index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BibleMap · Compare the encounters</title><style>body{background:#111e21;color:#f1ead9;margin:0;font:16px/1.6 system-ui}main{max-width:1350px;margin:auto;padding:35px}h1,h2{font-family:Georgia,serif;font-weight:400}a{color:#e1bd7d}section{display:grid;grid-template-columns:1fr 1fr;gap:30px}article{border-top:1px solid #66736c;padding-top:20px}.images{display:flex;gap:10px;align-items:start}.desktop{width:73%}.mobile{width:25%}img{width:100%;height:auto}article p{max-width:60ch}.baseline{margin-top:50px}details{border-top:1px solid #66736c;margin-top:30px;padding-top:20px}summary{cursor:pointer}table{border-collapse:collapse}td,th{padding:12px;border-bottom:1px solid #66736c;text-align:left}@media(max-width:700px){section{grid-template-columns:1fr}main{padding:20px}}</style><main><p>LOCAL CREATIVE-DIRECTION CHECKPOINT</p><h1>The city is spared. The prophet is angry.</h1><p>Four working conditions for Jonah 3:10–4:4. No participant study has been conducted. Screenshots show browser output; they do not establish comprehension.</p><section>${panels.map(([id,title,desktop,mobile,href,description]) => `<article><h2>${id} · ${title}</h2><p>${description}</p><p><a href="${href}">Try this encounter →</a></p><div class="images"><a class="desktop" href="experiment/${desktop}"><img src="experiment/${desktop}" alt="${title}, desktop browser screenshot"></a><a class="mobile" href="experiment/${mobile}"><img src="experiment/${mobile}" alt="${title}, mobile browser screenshot"></a></div></article>`).join('')}</section><details><summary>Technical evidence and limits</summary><p>${results.length} experiment checks; ${failures.length} failures. The default treatments were checked at 1440, 390 and 320 pixels, all five verse steps, keyboard navigation, history, reload, exact Scripture, sources and continuation. Axe checks supplement manual review; they do not replace screen-reader or participant testing.</p><p>The optional map uses CARTO/OpenStreetMap; the default reading conditions make no external requests. Map failure retains the schematic and Scripture. Performance timings are single local runs, not device benchmarks.</p><p>The broader repository suite is reported separately in docs/jonah-irreplaceable.md. Passing this experiment suite does not imply the broader suite passed.</p></details><div class="baseline"><h2>Deployment baseline</h2><p>Reverified October 24: production now serves c0b00bf3. The September ea2365ac deployment remains available for comparison. No deployment was changed by this experiment.</p><section><article><h2>September · Atlas entry</h2><a href="baseline/september-desktop-home.png"><img src="baseline/september-desktop-home.png" alt="September atlas homepage"></a><a href="baseline/september-mobile-home.png">Mobile capture</a></article><article><h2>October · Story entry</h2><a href="baseline/production-desktop-home.png"><img src="baseline/production-desktop-home.png" alt="October story homepage"></a><a href="baseline/production-mobile-home.png">Mobile capture</a></article></section></div></main></html>`);
console.log(JSON.stringify({ runs: results.length, failures: failures.map(({ treatment, size, failure }) => ({ treatment, size, failure })) }, null, 2));
if (failures.length) process.exitCode = 1;
