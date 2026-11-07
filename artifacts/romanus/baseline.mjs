import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('artifacts/romanus/before', { recursive: true });
const server = spawn('python', ['-m', 'http.server', '4198', '--bind', '127.0.0.1', '--directory', 'out'], { windowsHide: true, stdio: 'ignore' });
let browser;
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch('http://127.0.0.1:4198/human-story/perpetua/')).ok) break; }
    catch (error) { if (i === 39) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const results = [];
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('http://127.0.0.1:4198/human-story/perpetua/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `artifacts/romanus/before/perpetua-${name}.png` });
    results.push({ name, title: await page.title(), headings: await page.locator('h1,h2').allTextContents() });
    await page.close();
  }
  await writeFile('artifacts/romanus/before/observations.json', JSON.stringify(results, null, 2));
} finally { await browser?.close(); server.kill(); }
