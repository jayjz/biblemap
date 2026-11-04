import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const phase = process.argv[2] ?? 'after';
if (!/^[a-z-]+$/.test(phase)) throw new Error('Invalid phase');
const remote = process.argv[3];
const base = remote ?? 'http://127.0.0.1:4198/human-story/perpetua/';
const destination = new URL(`../artifacts/perpetua-journey/${phase}/`, import.meta.url);
await mkdir(destination, { recursive: true });
const path = name => new URL(name, destination).pathname.replace(/^\/(?=[A-Z]:)/, '');
const server = remote ? undefined : spawn('python', ['-m', 'http.server', '4198', '--bind', '127.0.0.1', '--directory', 'out'], { windowsHide: true, stdio: 'ignore' });
let browser;
const observations = [];
try {
  if (server) for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) break; } catch (error) { if (i === 49) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: 'reduce' });
    const errors = [], failures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path(`${width}-entrance.png`) });
    const scenes = [];
    for (const id of ['child', 'tribunal', 'separation', 'vision', 'felicity', 'handover']) {
      await page.locator(`nav[aria-label="Scenes in The Prison"] a[href="#perpetua-${id}"]`).click();
      const scene = page.locator(`[data-scene="${id}"]`);
      await scene.waitFor();
      await page.locator(`#title-${id}`).focus();
      await scene.scrollIntoViewIfNeeded();
      await scene.screenshot({ path: path(`${width}-${id}.png`), animations: 'disabled' });
      await page.screenshot({ path: path(`${width}-${id}-viewport.png`), animations: 'disabled' });
      scenes.push({ id, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), box: await scene.boundingBox() });
      if (id === 'vision' && !remote && await scene.locator('[data-vision-moment]').count()) {
        for (const name of ['A changed body', 'On waking']) {
          await scene.getByRole('button', { name, exact: true }).click();
          await scene.screenshot({ path: path(`${width}-vision-${name === 'On waking' ? 'waking' : 'changed'}.png`), animations: 'disabled' });
        }
      }
      if (id === 'handover' && !remote) {
        const question = scene.getByRole('heading', { name: /Whose voice survives/ });
        await question.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.screenshot({ path: path(`${width}-last-frame.png`), animations: 'disabled' });
      }
    }
    observations.push({ width, url: page.url(), scenes, errors, failures });
    await page.close();
  }
  await writeFile(path('observations.json'), JSON.stringify(observations, null, 2));
  if (!remote) {
    const runtime = ['src/features/human-story/PerpetuaMovements.tsx', 'src/features/human-story/PerpetuaVision.tsx', 'src/features/human-story/PerpetuaContext.tsx', 'src/features/human-story/PrisonStage.tsx', 'src/features/human-story/PerpetuaEncounter.tsx', 'src/features/human-story/prison.module.css', 'src/content/perpetua-passages.ts', 'src/content/perpetua-encounter.ts', 'src/content/human-story-interior-media.json'];
    const sha256 = Object.fromEntries(await Promise.all(runtime.map(async item => [item, createHash('sha256').update(await readFile(new URL(`../${item}`, import.meta.url))).digest('hex')])));
    await writeFile(path('revision.json'), JSON.stringify({ capturedAt: new Date().toISOString(), sourceHead: execFileSync('git', ['rev-parse', 'HEAD'], { windowsHide: true, encoding: 'utf8' }).trim(), buildId: (await readFile(new URL('../.next/BUILD_ID', import.meta.url), 'utf8')).trim(), sha256 }, null, 2));
  }
  console.log(JSON.stringify(observations.map(({ width, scenes, errors, failures }) => ({ width, scenes: scenes.length, overflow: scenes.some(scene => scene.overflow), errors, failures }))));
} finally {
  await browser?.close();
  if (server) { const closed = once(server, 'exit'); server.kill(); await closed; }
}
