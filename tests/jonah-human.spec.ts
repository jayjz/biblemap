import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { JONAH } from '../src/content/jonah';

test('a neutral entrance still leads through all thirteen scenes and exact pinned Scripture', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  await page.goto('/jonah/');
  await expect(page.locator('.story-root--human[data-reader-ready=true]')).toBeVisible();
  await expect(page.locator('.story-intro')).not.toContainText('Sometimes, leaving feels easier');
  await page.getByRole('link', { name: 'Begin reading' }).click();
  const observed = [];
  for (const [index, scene] of JONAH.scenes.entries()) {
    const article = page.locator(`#${scene.id}`);
    await expect(page.locator(`#${scene.id}-heading`)).toBeFocused();
    observed.push(...await article.locator('[data-reference]').evaluateAll(elements => elements.map(el => ({
      reference: el.getAttribute('data-reference'),
      text: [...el.childNodes].filter(node => node.nodeName !== 'SUP').map(node => node.textContent).join(''),
    }))));
    if (index < JONAH.scenes.length - 1) {
      await article.getByRole('link', { name: 'Continue', exact: false }).focus();
      await page.keyboard.press('Enter');
    }
  }
  expect(observed).toEqual(JONAH.passages.flatMap(p => p.verses.map(v => ({ reference: `${p.chapter}:${v.number}`, text: v.text }))));
  await expect(page.locator('.story-ending')).toContainText('A question, left open.');
  await expect(page.locator('.story-scene:visible')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('the dated record can be followed, shared, restored by history, and closed with keyboard focus', async ({ page }) => {
  await page.goto('/jonah/#jonah-3-mercy');
  const record = page.locator('.nineveh-record');
  const summary = record.locator('.nineveh-sale > summary');
  await expect(record).toContainText('692 BCE');
  await expect(record).toContainText('not an account of Jonah');
  await expect(record).toContainText('do not represent everyone');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\?record=sale#jonah-3-mercy$/);
  await expect(record.locator('dl')).toContainText('Mannu-ki-ahhe');
  await expect(record.locator('dl')).toContainText('one mina');
  await expect(record.getByRole('link', { name: 'Link to this reading' })).toHaveAttribute('href', '?record=sale#jonah-3-mercy');
  await page.reload();
  await expect(record.locator('.nineveh-sale')).toHaveAttribute('open', '');
  await record.getByRole('button', { name: 'Close the record' }).click();
  await expect(summary).toBeFocused();
  await expect(record.locator('.nineveh-sale')).not.toHaveAttribute('open');
  await page.goBack();
  await expect(record.locator('.nineveh-sale')).toHaveAttribute('open', '');
  await record.getByRole('button', { name: 'Close the record' }).click();
  await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('#jonah-4-anger .nineveh-record')).toHaveCount(0);
});

test('passage, history and later readings are distinguishable at four widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/jonah/#jonah-3-mercy');
    await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const passage = await page.locator('.reader-turn').boundingBox();
    const record = await page.locator('.nineveh-record').boundingBox();
    expect(passage && record).toBeTruthy();
    if (passage && record) {
      if (width <= 850) expect(record.y).toBeGreaterThanOrEqual(passage.y + passage.height);
      else expect(record.y + record.height).toBeLessThanOrEqual(passage.y);
    }
    await page.locator('.nineveh-jewish-reading > summary').click();
    await expect(page.locator('.nineveh-jewish-reading')).toContainText('Rabbinic Jewish interpretation');
    await expect(page.locator('.nineveh-jewish-reading')).toContainText('Study paraphrase');
    expect((await new AxeBuilder({ page }).include('#jonah-3-mercy').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
    await page.locator('.reader-margin summary').click();
    await expect(page.locator('.reader-margin')).toContainText('Medieval Catholic theology');
    expect((await new AxeBuilder({ page }).include('#jonah-4-anger').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
});

test('no JavaScript keeps the whole book and native documentary reading', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/jonah/');
    await expect(page.locator('.story-scene')).toHaveCount(13);
    await expect(page.locator('[data-reference]')).toHaveCount(48);
    await page.locator('.nineveh-sale > summary').click();
    await expect(page.locator('.nineveh-sale dl')).toBeVisible();
    await page.locator('.nineveh-record-sources > summary').click();
    await expect(page.getByRole('link', { name: 'Read the Akkadian edition and translation (new tab)' })).toHaveAttribute('href', /P335268/);
  } finally { await context.close(); }
});

test('image failure and malformed record links cannot take away Scripture or invent a selection', async ({ page }) => {
  await page.route('**/*.{jpg,jpeg,png,webp}', route => route.abort());
  await page.goto('/jonah/?record=unrecognized#jonah-3-mercy');
  await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
  await expect(page.locator('.nineveh-sale')).not.toHaveAttribute('open');
  await expect(page.locator('#jonah-3-mercy [data-reference="3:10"]')).toContainText('God saw their works');
  await expect(page.getByRole('img', { name: 'Nineveh beside the Tigris' })).toBeVisible();
  await page.goto('/jonah/?record=sale#jonah-4-anger');
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('.nineveh-sale')).not.toHaveAttribute('open');
});

test('chapter navigation cuts for reduced motion and progressively enhances when supported', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/jonah/#jonah-3-mercy');
  await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
  await page.evaluate(() => { document.startViewTransition = () => { throw new Error('Unexpected motion'); }; });
  await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await page.goBack();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
  await page.getByRole('link', { name: 'Read Jonah’s response' }).click();
  await expect(page.locator('#jonah-4-anger [data-reference="4:1"]')).toBeInViewport();
  await page.evaluate(async () => { await Promise.all(document.getAnimations().map(animation => animation.finished)); });
});
