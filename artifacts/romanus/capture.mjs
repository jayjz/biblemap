import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const destination = 'artifacts/romanus/after';
await mkdir(destination, { recursive: true });
const server = spawn('python', ['-m', 'http.server', '4199', '--bind', '127.0.0.1', '--directory', 'out'], { windowsHide: true, stdio: 'ignore' });
let browser;
const report = { head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true }).trim(), buildId: (await readFile('.next/BUILD_ID', 'utf8')).trim(), sourceHashes: {}, views: [] };
for (const path of ['src/content/romanus.ts', 'src/features/human-story/romanus/RomanusEncounter.tsx', 'src/features/human-story/romanus/romanus.module.css']) report.sourceHashes[path] = createHash('sha256').update(await readFile(path)).digest('hex');
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch('http://127.0.0.1:4199/human-story/romanus/')).ok) break; }
    catch (error) { if (i === 39) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => failures.push(`${r.url()}: ${r.failure()?.errorText}`));
    page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
    await page.goto('http://127.0.0.1:4199/human-story/romanus/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${destination}/${name}-entrance.png` });
    await page.locator('#romanus-world img').scrollIntoViewIfNeeded();
    await page.locator('#romanus-world img').evaluate(image => image.decode());
    if (name === 'desktop') {
      await page.locator('#romanus-world').screenshot({ path: `${destination}/${name}-world.png` });
      await page.locator('#romanus-refusal').screenshot({ path: `${destination}/${name}-refusal.png` });
    }
    if (name === 'mobile') await page.screenshot({ path: `${destination}/${name}-complete.png`, fullPage: true });
    await page.getByText('Open the longer Syriac account', { exact: true }).click();
    await page.locator('#romanus-accounts').evaluate(section => section.scrollIntoView({ block: 'start' }));
    await page.locator('#romanus-accounts').screenshot({ path: `${destination}/${name}-accounts.png` });
    await page.locator('#romanus-memory').screenshot({ path: `${destination}/${name}-memory.png` });
    const images = await page.locator('picture img').evaluateAll(images => images.map(i => ({ src: i.currentSrc, loaded: i.complete && i.naturalWidth > 0 })));
    const contrast = await page.locator('h1').evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el.closest('main').parentElement).backgroundColor }));
    report.views.push({ name, width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), images, contrast, errors, failures });
    await page.close();
  }
  await writeFile(`${destination}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.views));
} finally { await browser?.close(); server.kill(); }
