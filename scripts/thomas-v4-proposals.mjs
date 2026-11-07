import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

// Review artifacts only. The passages come from the same offline pins as the experience.
const pin = JSON.parse(await readFile('src/content/scripture/thomas-quotes.json', 'utf8'));
const verses = pin.verses ?? pin;
const verse = id => {
  const item = Array.isArray(verses) ? verses.find(v => v.id === id) : verses[id];
  if (!item) throw new Error(`Missing pinned verse ${id}`);
  return item.text;
};
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const folder = 'artifacts/thomas-v4/proposals';
await mkdir(folder, { recursive: true });
const image = '../../../public/media/thomas/proximity-1536.webp';
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thomas V4 — two proposals</title><style>
*{box-sizing:border-box}body{margin:0;font:17px/1.65 Arial,sans-serif}h1,h2,p,blockquote{margin:0}h1{font:clamp(58px,9vw,130px)/1 Georgia,serif;letter-spacing:-.05em}h2{font:clamp(40px,6vw,85px)/1.1 Georgia,serif}small{display:block;font:14px/1.6 Arial,sans-serif}section{padding:60px 8%}blockquote{font:clamp(26px,3.5vw,52px)/1.3 Georgia,serif}header{padding:40px 8%}header p{margin-bottom:20px}.voices{display:grid;grid-template-columns:1fr 1fr;gap:12%;padding-block:60px}.voices p{font:clamp(24px,3vw,44px)/1.3 Georgia,serif}.voices small{margin-bottom:25px}.a{background:#17232a;color:#ede8de}.a .encounter{display:grid;grid-template-columns:1.2fr 1fr;gap:8%;align-items:center}.a img{width:100%;height:400px;object-fit:cover;object-position:70%}.a .pause{padding-block:100px;background:linear-gradient(90deg,#17232a 30%,#4a5660);text-align:center}.a .pause p{margin-top:65px}.a .answer{background:#f3f2ed;color:#17232a;padding-block:100px}.a .answer blockquote{max-width:800px;font-size:clamp(48px,7vw,100px);line-height:1.1;margin-top:40px}.b{background:#e1e6ed;color:#192d4d}.b header{border-bottom:8px solid #192d4d}.b .voices{grid-template-columns:1fr 1fr;gap:0;border:1px solid #192d4d;padding:0}.b .voices p{padding:45px 9%}.b .voices p+p{border-left:1px solid #192d4d}.b .pause{background:#c4d0e0;padding-block:65px;display:grid;grid-template-columns:1fr 1fr;gap:10%}.b .answer{max-width:1100px;margin:auto;padding-block:90px}.b .answer blockquote{font:clamp(40px,6vw,84px)/1.2 Georgia,serif;margin-top:40px}.source{font:14px/1.5 Arial,sans-serif;margin-top:30px}.proposal{margin-bottom:80px}.proposal>header>small{margin-top:30px}@media(max-width:600px){section,header{padding:40px 24px}.a .encounter{display:flex;flex-direction:column-reverse;gap:30px;align-items:stretch}.a img{height:260px}.voices{display:block}.voices p+p{margin:55px 0 0 15%;border-left:1px solid;padding-left:20px}.a .pause{padding-block:65px}.b .voices{display:block}.b .voices p+p{margin:0;border-left:0;border-top:1px solid}.b .pause{display:block}.b .pause p{margin-top:40px}}
</style>
<article id="a" class="proposal a"><header><p>Proposal A · distance, then address</p><h1>Thomas.<br>The human encounter.</h1><small>Spatial composition; existing AI-generated, imagined environment. No identified biblical figures.</small></header>
<section class="encounter"><div><small>Before the absence · John 11:16 / 14:5</small><blockquote>${escape(verse('jhn14-5'))}</blockquote><p class="source">World English Bible · public domain</p></div><img src="${image}" alt=""></section>
<section><h2>Their testimony.<br>His condition.</h2><div class="voices"><p><small>The other disciples</small>“We have seen the Lord!”</p><p><small>Thomas</small>“Unless I see…”</p></div><small>Study excerpts; the implemented scene retains all of John 20:25.</small></section>
<section class="pause"><h2>Eight days.</h2><p>The interval is named.<br>No intervening events are supplied.</p><small>Editorial study · John 20:26</small></section>
<section class="answer"><small>John 20:28 · World English Bible</small><blockquote>${escape(verse('jhn20-28'))}</blockquote></section></article>
<article id="b" class="proposal b"><header><p>Proposal B · the page and the reader</p><h1>Words<br>that reach us.</h1><small>A literary spread; typography and marginal references replace environmental imagery.</small></header>
<section><small>Thomas in John's account · 14:5</small><blockquote>${escape(verse('jhn14-5'))}</blockquote></section>
<section><div class="voices"><p><small>Witnessed</small>“We have seen the Lord!”</p><p><small>Received</small>“Unless I see…”</p></div><small>Study excerpts · John 20:25 · WEB</small></section>
<section class="pause"><h2>After<br>eight days</h2><p>A break in the written account.<br>A new paragraph. Thomas is with them.<br><small>Editorial study · John 20:26</small></p></section>
<section class="answer"><small>John 20:28 · World English Bible</small><blockquote>${escape(verse('jhn20-28'))}</blockquote></section></article></html>`;
await writeFile(`${folder}/index.html`, html);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
try {
  for (const width of [1440,390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(pathToFileURL(resolve(`${folder}/index.html`)).href);
    await page.locator('img').evaluate(img => img.decode());
    for (const id of ['a','b']) await page.locator(`#${id}`).screenshot({ path:`${folder}/${id}-${width}.jpg`, quality:80 });
    await page.close();
  }
} finally { await browser.close(); }
