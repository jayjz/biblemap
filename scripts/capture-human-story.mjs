// Capture the exported review surface, never a remote deployment.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from '@playwright/test';

const phase = process.argv[2] ?? 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const root = resolve('out');
const destination = resolve('artifacts/human-story', phase);
await mkdir(destination, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, '.' + path);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
    response.end(await readFile(file));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(error);
    response.writeHead(404).end('Not found');
  }
});
await new Promise(resolveListening => server.listen(4196, '127.0.0.1', resolveListening));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  const errors = [], failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => failed.push({ url: request.url(), reason: request.failure()?.errorText }));
  const checks = [];
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:4196/human-story/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: resolve(destination, `portal-${width}.png`), fullPage: true });
    checks.push({ width, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  }
  if (phase === 'after') {
    for (const slug of ['jonah', 'tacitus', 'perpetua', 'augustine', 'jerome']) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`http://127.0.0.1:4196/human-story/${slug}/`);
      await page.screenshot({ path: resolve(destination, `${slug}-1440.png`), fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:4196/');
  await page.screenshot({ path: resolve(destination, 'nineveh-1440.png'), fullPage: true });
  const result = { phase, checks, errors, failed };
  await writeFile(resolve(destination, 'capture.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  server.close();
}
