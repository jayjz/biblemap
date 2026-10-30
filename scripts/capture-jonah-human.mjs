// Actual browser evidence; no visitor responses are inferred from these captures.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const phase = process.argv[2] ?? 'before';
if (!/^[a-z0-9-]+$/.test(phase)) throw new Error('Invalid capture phase');
const base = process.env.HUMAN_REVIEW_URL ?? 'http://127.0.0.1:4311';
const dir = `artifacts/jonah-human/${phase}`;
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const records = [{ phase, browser: browser.version(), node: process.version, base,
  sourceChecksums: Object.fromEntries(await Promise.all(['src/features/story/StoryReader.tsx', 'src/features/story/NinevehRecord.tsx', 'src/features/story/human-story.css', 'src/content/jonah-nineveh-record.ts'].map(async path => [path, createHash('sha256').update(await readFile(path)).digest('hex')]))),
}];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(`page: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    page.on('requestfailed', r => errors.push(`network: ${r.url()} ${r.failure()?.errorText}`));
    page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP: ${r.status()} ${r.url()}`); });
    await page.goto(`${base}/jonah/`);
    await page.locator('[data-reader-ready=true]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${dir}/${width}-entry.png` });
    const scenes = await page.locator('.story-scene').evaluateAll(items => items.map(el => el.id));
    for (const [index, id] of scenes.entries()) {
      if (index === 0) await page.getByRole('link', { name: 'Begin reading' }).click();
      else await page.locator('.story-scene:visible .story-scene-nav').getByRole('link', { name: 'Continue' }).click();
      await expect(page.locator(`#${id}-heading`)).toBeFocused();
      await page.locator(`#${id} img`).evaluateAll(async images => {
        for (const img of images) img.loading = 'eager';
        await Promise.all(images.map(img => img.decode()));
      });
      await page.locator(`#${id}-heading`).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.evaluate(() => document.activeElement?.blur());
      await page.screenshot({ path: `${dir}/${width}-${id}.png` });
      await page.locator(`#${id}`).screenshot({ path: `${dir}/${width}-${id}-full.png` });
      records.push({ width, id, heading: await page.locator(`#${id}-heading`).innerText(), verses: await page.locator(`#${id} [data-reference]`).count(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    }
    if (phase !== 'before') {
      await page.goto(`${base}/jonah/?record=sale#jonah-3-mercy`);
      await expect(page.locator('.nineveh-sale')).toHaveAttribute('open', '');
      await page.locator('.nineveh-record').screenshot({ path: `${dir}/${width}-record-open.png` });
      await page.getByRole('button', { name: 'Close the record' }).click();
      await page.locator('.nineveh-jewish-reading > summary').click();
      await page.locator('.reader-turn').screenshot({ path: `${dir}/${width}-turn-and-reading.png` });
      await page.locator('[data-reference="3:10"]').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.evaluate(() => document.activeElement?.blur());
      await page.screenshot({ path: `${dir}/${width}-chapter-turn.png` });
    }
    records.push({ width, errors });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(`${dir}/observations.json`, JSON.stringify(records, null, 2));
// One contact sheet makes the narrative rhythm inspectable without claiming a usability study.
const cards = [];
for (const [index, record] of records.filter(r => r.width === 1440 && r.id).entries()) {
  const input = await readFile(`${dir}/1440-${record.id}.png`);
  cards.push({ input: await sharp(input).resize(360, 250).toBuffer(), left: (index % 4) * 360, top: Math.floor(index / 4) * 250 });
}
await sharp({ create: { width: 1440, height: 1000, channels: 3, background: '#14242a' } }).composite(cards).png().toFile(`${dir}/complete-reader.png`);
console.log(JSON.stringify({ phase, scenes: records.filter(r => r.id).length, errors: records.filter(r => r.errors), overflow: records.filter(r => r.overflow) }, null, 2));
if (records.some(record => record.overflow || record.errors?.length)) throw new Error('Browser capture recorded errors or horizontal overflow; inspect observations.json');
