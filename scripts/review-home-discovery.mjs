import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const phase = process.argv[2] ?? 'after';
if (!/^[a-z-]+$/.test(phase)) throw new Error('Invalid phase');
const base = process.argv[3] ?? 'http://127.0.0.1:4197';
const destination = new URL(`../artifacts/home-discovery/${phase}/`, import.meta.url);
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const observations = [];
try {
  for (const width of process.argv[4] === 'states-only' ? [] : [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__discoveryLab = { lcp: 0, layoutShiftSum: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__discoveryLab.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__discoveryLab.layoutShiftSum += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const [name, route] of [['home', '/'], ['saints', '/human-story/worlds/saints/']]) {
      const errors = [], failures = [];
      const onError = error => errors.push(error.message);
      const onConsole = message => { if (message.type() === 'error') errors.push(message.text()); };
      const onFail = request => failures.push(`${request.url()}: ${request.failure()?.errorText}`);
      const onResponse = response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); };
      page.on('pageerror', onError); page.on('console', onConsole); page.on('requestfailed', onFail); page.on('response', onResponse);
      await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      });
      await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode().catch(() => {}))));
      await page.evaluate(() => window.scrollTo(0, 0));
      if (name === 'home' && [1440, 390].includes(width)) await page.screenshot({ path: fileURLToPath(new URL(`viewport-${width}.jpg`, destination)), quality: 85 });
      await page.screenshot({ path: fileURLToPath(new URL(`${name}-${width}.jpg`, destination)), fullPage: true, quality: 80 });
      if (name === 'home') {
        for (const [section, selector] of [['opening', 'main > section:first-child'], ['encounters', 'main > section:nth-child(2)'], ['threads', '#paths'], ['worlds', 'section:has(#worlds-title)'], ['directory', '#discover']]) {
          if ([1440, 390].includes(width) || (section === 'worlds' && width === 768)) await page.locator(selector).screenshot({ path: fileURLToPath(new URL(`${section}-${width}.jpg`, destination)), quality: 85 });
        }
      }
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        height: document.documentElement.scrollHeight,
        targets: [...document.querySelectorAll('header a, main a, main button, main summary')].filter(el => el.getClientRects().length).map(el => {
          const rect = el.getBoundingClientRect(), css = getComputedStyle(el);
          return { text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 100), href: el.getAttribute('href'), x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height, fontSize: css.fontSize, color: css.color, background: css.backgroundColor, underline: css.textDecorationLine };
        }),
        brokenImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src),
        animations: document.getAnimations().length,
        lab: window.__discoveryLab,
      }));
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      observations.push({ name, width, url: page.url(), ...metrics, violations: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), errors, failures });
      page.off('pageerror', onError); page.off('console', onConsole); page.off('requestfailed', onFail); page.off('response', onResponse);
    }
    await context.close();
  }
  if (observations.length) await writeFile(new URL('observations.json', destination), JSON.stringify(observations, null, 2));
  if (phase !== 'before') {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base);
    await page.keyboard.press('Tab');
    const skipFocused = await page.getByRole('link', { name: 'Skip to content', exact: true }).evaluate(el => el === document.activeElement);
    await page.keyboard.press('Enter');
    const mainFocused = await page.locator('#main').evaluate(el => el === document.activeElement);
    await page.getByRole('link', { name: 'Enter the encounter', exact: true }).focus();
    const focus = await page.getByRole('link', { name: 'Enter the encounter', exact: true }).evaluate(el => ({ visible: el.matches(':focus-visible'), outline: getComputedStyle(el).outline, shadow: getComputedStyle(el).boxShadow }));
    await page.screenshot({ path: fileURLToPath(new URL('focus-390.jpg', destination)), quality: 85 });
    const preview = page.getByRole('button', { name: 'Show connections for Romanus: the voice they could not silence' });
    await preview.click();
    const selectionFocused = await page.getByRole('heading', { name: 'Connected to Romanus: the voice they could not silence' }).evaluate(el => el === document.activeElement);
    await page.locator('#connection-preview').screenshot({ path: fileURLToPath(new URL('selected-390.jpg', destination)), quality: 85 });
    await page.getByRole('button', { name: 'Close connection preview', exact: true }).click();
    const selectionRestored = await preview.evaluate(el => el === document.activeElement);
    await page.getByRole('searchbox').fill('no-matching-reading-9814');
    const emptyVisible = await page.getByRole('heading', { name: 'No readings match that search.' }).isVisible();
    await page.getByRole('button', { name: 'Clear search and filters' }).click();
    await page.route('**/media/**/*.webp', route => route.abort());
    await page.goto(new URL('/#encounters', base).href);
    await page.reload();
    await page.locator('#encounters [role="status"]').first().waitFor();
    await page.locator('#encounters').screenshot({ path: fileURLToPath(new URL('fallback-390.jpg', destination)), quality: 85 });
    const fallbackCount = await page.locator('#encounters [role="status"]').count();
    await writeFile(new URL('interaction-checks.json', destination), JSON.stringify({ skipFocused, mainFocused, focus, selectionFocused, selectionRestored, emptyVisible, fallbackCount }, null, 2));
    await context.close();
    const runtime = ['HumanStoryHome.tsx', 'FeaturedEncounters.tsx', 'ConnectedExplorer.tsx', 'EntryCards.tsx', 'PathPreview.tsx', 'WorldOpening.tsx', 'InteriorEncounters.tsx', 'human-story.module.css', 'interior.module.css', 'discovery.module.css', 'action-link.module.css'];
    const sha256 = Object.fromEntries(await Promise.all(runtime.map(async name => [name, createHash('sha256').update(await readFile(new URL(`../src/features/human-story/${name}`, import.meta.url))).digest('hex')])));
    await writeFile(new URL('revision.json', destination), JSON.stringify({ capturedAt: new Date().toISOString(), sourceHead: execFileSync('git', ['rev-parse', 'HEAD'], { windowsHide: true, encoding: 'utf8' }).trim(), buildId: (await readFile(new URL('../.next/BUILD_ID', import.meta.url), 'utf8')).trim(), sha256 }, null, 2));
  }
  console.log(JSON.stringify(observations.map(({ name, width, height, overflow, violations, errors, failures }) => ({ name, width, height, overflow, violations: violations.map(v => v.id), errors, failures }))));
} finally { await browser.close(); }
