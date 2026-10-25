// Capture the opt-in static export served by review-irreplaceable.mjs on loopback.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = 'http://127.0.0.1:4191';
const directory = resolve('artifacts/nineveh-review');
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const failures = [];
try {
  for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['narrow', 320, 700]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
    page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    for (const beat of ['city', 'mercy', 'anger', 'question']) {
      await page.goto(`${base}/experiments/nineveh/#${beat}`);
      await page.locator('[data-environment="ready"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.nineveh-eyebrow').first().click();
      await page.screenshot({ path: resolve(directory, `${device}-${beat}.png`) });
      await page.screenshot({ path: resolve(directory, `${device}-${beat}-full.png`), fullPage: true });
    }
    if (device === 'mobile') {
      await page.goto(`${base}/experiments/nineveh/#anger`);
      await page.locator('[data-environment="ready"]').waitFor();
      await page.locator('[data-reference="4:3"]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(directory, 'mobile-anger-scrolled.png') });
    }
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(resolve(directory, 'capture-results.json'), JSON.stringify({ failures, viewports: ['1440×1000', '390×844', '320×700'], reducedMotion: true }, null, 2));
if (failures.length) throw new Error(JSON.stringify(failures));
writeFileSync(resolve(directory, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nineveh · Creative review</title><style>body{margin:0;background:#142326;color:#f4edda;font:16px/1.7 system-ui}main{max-width:1350px;margin:auto;padding:32px}h1,h2{font-family:Georgia,serif;font-weight:400}a{color:#d7bd88}section{display:grid;grid-template-columns:2fr 1fr;gap:24px;border-top:1px solid #76827c;margin-top:38px;padding-top:20px}section h2,section p{grid-column:1/-1;margin:0}img{width:100%;height:auto}figure{margin:0}figcaption{font-size:13px} .compare{grid-template-columns:repeat(3,1fr)}@media(max-width:700px){section,.compare{grid-template-columns:1fr}main{padding:20px}}</style><main><p>LOCAL CREATIVE REVIEW · ORIGINAL GENERATED LANDSCAPE</p><h1>Nineveh — The City Remains</h1><p><a href="/experiments/nineveh/">Open the working encounter →</a></p><p>Same city, four pauses. Exact pinned Scripture. The skyline, terrain and viewpoint are interpretive reconstruction; no historical scene or Jonah’s position is asserted. These are actual Chrome screenshots, not visitor-study results.</p>${['city','mercy','anger','question'].map(beat => `<section><h2>${beat[0].toUpperCase()+beat.slice(1)}</h2><figure><a href="desktop-${beat}-full.png"><img src="desktop-${beat}.png" alt="${beat}, desktop browser"></a><figcaption>1440 × 1000 · select for full page</figcaption></figure><figure><a href="mobile-${beat}-full.png"><img src="mobile-${beat}.png" alt="${beat}, mobile browser"></a><figcaption>390 × 844 · select for full page</figcaption></figure></section>`).join('')}<section class="compare"><h2>Before: reader, A and B</h2><p>The reader preserves the complete book; A makes textual juxtaposition immediate; B retains a schematic location. This encounter keeps an environmental view and the complete 4:1–4 prayer, with 3:10 optionally recalled. Presence and comprehension still require visitor observation.</p>${[['reader','Existing reader','/jonah/#jonah-4-anger'],['a','A · Literary juxtaposition','/experiment/?t=a#4:1'],['b','B · Original geography','/experiment/?t=b#4:1']].map(([id,label,url])=>`<figure><h3><a href="${url}">${label}</a></h3><a href="before-desktop-${id}.png"><img src="before-desktop-${id}.png" alt="${label} before implementation"></a><a href="before-mobile-${id}.png">Mobile before</a></figure>`).join('')}</section><p><a href="mobile-anger-scrolled.png">City retained while scrolling the prayer</a> · <a href="narrow-anger-full.png">320px layout</a></p></main></html>`);
console.log(`Captured 25 screenshots with no browser, console or network failures. ${directory}/index.html`);
