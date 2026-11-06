import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const phase = process.argv[2] ?? 'after';
if (!['before', 'after', 'study-b', 'enlarged'].includes(phase)) throw new Error('Invalid review phase');
const base = process.argv[3] ?? 'http://127.0.0.1:4189';
const destination = new URL(`../artifacts/thomas-homepage/${phase}/`, import.meta.url);
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const observations = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [], failures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      await Promise.all([...document.images].map(img => img.decode()));
    });
    if (phase === 'study-b') {
      const study = await readFile(new URL('../artifacts/thomas-homepage/study-b.html', import.meta.url), 'utf8');
      await page.locator('#thomas-invitation').evaluate((element, html) => { element.outerHTML = html; }, study);
    }
    if (phase === 'enlarged') {
      await page.locator('#thomas-invitation summary').click();
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    }
    await page.screenshot({ path: fileURLToPath(new URL(`home-${width}.jpg`, destination)), fullPage: true, quality: 78 });
    await page.locator('#encounters').screenshot({ path: fileURLToPath(new URL(`encounters-${width}.jpg`, destination)), quality: 85 });
    if (phase !== 'before') await page.locator('#thomas-invitation').screenshot({ path: fileURLToPath(new URL(`thomas-${width}.jpg`, destination)), quality: 88 });
    if ([1440, 390].includes(width)) await page.locator('#discover').screenshot({ path: fileURLToPath(new URL(`readings-${width}.jpg`, destination)), quality: 82 });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const overflowWithoutInvitation = phase === 'enlarged' ? await page.evaluate(() => {
      const invitation = document.querySelector('#thomas-invitation');
      const previous = invitation.style.display;
      invitation.style.display = 'none';
      const overflow = document.documentElement.scrollWidth > innerWidth;
      invitation.style.display = previous;
      return overflow;
    }) : undefined;
    observations.push({ width, errors, failures, overflowWithoutInvitation, violations: axe.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(n => n.target) })), ...await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      invitationTextOverflow: (() => {
        const invitation = document.querySelector('#thomas-invitation');
        if (!invitation) return [];
        const bounds = invitation.getBoundingClientRect(), walker = document.createTreeWalker(invitation, NodeFilter.SHOW_TEXT), found = [];
        while (walker.nextNode()) {
          const range = document.createRange(); range.selectNodeContents(walker.currentNode);
          const rect = range.getBoundingClientRect();
          if (rect.width && (rect.right > bounds.right + 1 || rect.left < bounds.left - 1)) found.push(walker.currentNode.textContent.slice(0, 80));
        }
        return found;
      })(),
      overflowingElements: [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 0.5).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent.slice(0, 80), right: element.getBoundingClientRect().right })),
      overflowingText: (() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), found = [];
        while (walker.nextNode()) {
          const range = document.createRange();
          range.selectNodeContents(walker.currentNode);
          const rect = range.getBoundingClientRect();
          if (rect.right > innerWidth + 0.5) found.push({ text: walker.currentNode.textContent.slice(0, 100), right: rect.right, parent: walker.currentNode.parentElement.className });
        }
        return found.slice(0, 10);
      })(),
      brokenImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src),
      images: [...document.images].filter(img => img.currentSrc.includes('/thomas/')).map(img => ({ src: img.currentSrc, width: img.clientWidth, height: img.clientHeight, objectPosition: getComputedStyle(img).objectPosition })),
      runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
    })) });
    await context.close();
  }
  const htmlRoutes = (await readdir(new URL('../out/', import.meta.url), { recursive: true })).filter(path => path.endsWith('.html')).sort();
  const sources = ['src/features/human-story/HumanStoryHome.tsx', 'src/features/human-story/FeaturedEncounters.tsx', 'src/features/human-story/ThomasInvitation.tsx', 'src/features/human-story/ConnectedExplorer.tsx', 'src/features/human-story/discovery.module.css', 'src/features/human-story/human-story.module.css'];
  const sourceHashes = Object.fromEntries(await Promise.all(sources.map(async path => [path, createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex')])));
  await writeFile(new URL('observations.json', destination), JSON.stringify({ capturedAt: new Date().toISOString(), buildId: (await readFile(new URL('../.next/BUILD_ID', import.meta.url), 'utf8')).trim(), sourceHashes, htmlRoutes, observations }, null, 2));
  console.log(JSON.stringify(observations));
  if (observations.some(o => o.overflow || o.invitationTextOverflow.length || o.errors.length || o.failures.length || o.violations.length || o.brokenImages.length)) process.exitCode = 1;
} finally { await browser.close(); }
