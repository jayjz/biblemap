import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const directory = 'artifacts/immersive-reader';
const origin = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '4203'}`;
const phase = process.argv[2] ?? 'after';
if (!['before', 'after', 'iteration'].includes(phase)) throw new Error('Unknown capture phase');
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const [width, height] of [[1440, 1000], [820, 1180], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const scene of ['jonah-3-mercy', 'jonah-4-anger']) {
      await page.goto(`${origin}/jonah/#${scene}`);
      await page.locator('[data-reader-ready=true]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.locator(`#${scene} img:visible`).evaluateAll(images => Promise.all(images.map(image => image.decode())));
      // Screenshots show the composition, not the browser's programmatic focus outline.
      await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
      await page.locator(`#${scene}-heading`).scrollIntoViewIfNeeded();
      await page.locator(`#${scene}`).screenshot({ path: `${directory}/${phase}-${width}-${scene}.png` });
      await page.locator(`#${scene}-heading`).evaluate(heading => heading.scrollIntoView({ block: 'start' }));
      await page.screenshot({ path: `${directory}/${phase}-${width}-${scene}-viewport.png` });
      if (scene === 'jonah-3-mercy') {
        await page.locator('[data-reference="3:10"]').evaluate(verse => verse.scrollIntoView({ block: 'center' }));
        await page.screenshot({ path: `${directory}/${phase}-${width}-turn.png` });
      }
      results.push({ width, scene, errors: [...errors], overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    }
    if (phase !== 'before' && [1440, 390].includes(width)) {
      await page.goto(`${origin}/jonah/#jonah-3-mercy`);
      await page.getByRole('button', { name: 'Examine the Flood Tablet', exact: true }).click();
      await page.getByRole('dialog').locator('img').evaluate(image => image.decode());
      await page.getByRole('dialog').screenshot({ path: `${directory}/${phase}-${width}-object.png` });
      await page.keyboard.press('Escape');
    }
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${directory}/${phase}.json`, JSON.stringify(results, null, 2) + '\n');
if (results.some(result => result.errors.length || result.overflow)) throw new Error('Capture diagnostics failed');
if (phase === 'after') {
  const rows = [1440, 390].flatMap(width => ['jonah-3-mercy', 'jonah-4-anger'].map(scene => `<section><h2>${scene === 'jonah-3-mercy' ? 'Nineveh' : 'Jonah’s response'} · ${width}px</h2><div class="pair">${['before', 'after'].map(label => `<figure><figcaption>${label === 'before' ? 'Starting PR #34' : 'Clay, river, and the chapter break'}</figcaption><a href="${label}-${width}-${scene}.png"><img src="${label}-${width}-${scene}.png" alt="${label} ${scene} at ${width} pixels" loading="lazy"></a></figure>`).join('')}</div></section>`));
  writeFileSync(`${directory}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>BibleMap reader · design review</title><style>body{margin:2rem auto;padding:0 1.5rem;max-width:1400px;background:#14242a;color:#eee5d2;font:16px/1.6 Georgia,serif}a{color:inherit}h1{font-size:38px;font-weight:400}h2{font-size:25px;font-weight:400;margin-top:3rem}.pair{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start}figure{margin:0}figcaption{padding:1rem 0;font:14px/1.5 Arial,sans-serif}img{width:100%;height:auto;display:block}@media(max-width:700px){.pair{grid-template-columns:1fr}}a:focus-visible{outline:3px solid #eee5d2;outline-offset:5px}</style><h1>Clay, river, and the chapter break</h1><p>Actual Chrome rendering of the existing reader. Starting PR #34 (f71c644) compared with this revision. Draft design evidence; no production or editorial approval.</p><p><a href="${origin}/jonah/#jonah-3-mercy">Open the local reader</a> · <a href="after.json">Capture diagnostics</a></p>${rows.join('')}</html>`);
}
console.log(`Captured ${results.length} compositions; no browser errors or horizontal overflow.`);
