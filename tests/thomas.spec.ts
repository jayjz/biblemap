import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { THOMAS_MOVEMENTS, thomasVerse } from '../src/content/thomas';

test('Thomas preserves the whole account, source boundaries, navigation and a separate doorway', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto('/human-story/thomas/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Thomas');
  await page.getByRole('link', { name: 'Enter the account', exact: true }).click();
  await expect(page.locator('#absent')).toBeFocused();
  const nav = page.getByRole('navigation', { name: 'Thomas movements' });
  await nav.getByRole('link', { name: 'II Unless I see', exact: true }).click();
  await expect(page.locator('#unless')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/#absent$/);
  await page.goForward();
  await expect(page).toHaveURL(/#unless$/);
  const reveal = page.getByText('What had the others already seen?', { exact: true });
  if (isMobile) await reveal.tap(); else await reveal.click();
  await expect(page.locator('[data-verse="jhn20-20"]')).toBeVisible();
  for (const m of THOMAS_MOVEMENTS) for (const id of m.verseIds) await expect(page.locator(`[data-verse="${id}"] blockquote`)).toHaveText(thomasVerse(id).text);
  await expect(page.locator('#confession')).toContainText('does not describe Thomas reaching out');
  await expect(page.locator('#not-seen')).toContainText('Blessed are those who have not seen and have believed.');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.getByRole('link', { name: 'Explore the sayings and manuscripts', exact: true }).click();
  await expect(page).toHaveURL(/\/thomas\/sayings\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveText('The Gospel of Thomas');
  await expect(page.locator('#witnesses')).toContainText('250–299 CE');
  await expect(page.locator('[data-thomas-saying="26"]')).toContainText('Coptic NHC II,2');
  await page.getByText('What does the surviving Greek actually preserve?', { exact: true }).click();
  await expect(page.locator('#comparison')).toContainText('does not survive on this leaf');
  await page.getByText('Two approaches to the collection’s history', { exact: true }).click();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.getByRole('link', { name: 'Return to John’s ending', exact: true }).click();
  await expect(page).toHaveURL(/\/thomas\/#not-seen$/);
  expect(errors).toEqual([]);
});

test('keyboard-only entry, disclosures and deep links preserve a visible destination', async ({ page }) => {
  await page.goto('/human-story/thomas/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the reading' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#thomas-main')).toBeFocused();
  const nav = page.getByRole('navigation', { name: 'Thomas movements' });
  const target = nav.getByRole('link', { name: 'II Unless I see', exact: true });
  await target.focus();
  await expect(target).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('#unless')).toBeFocused();
  const summary = page.getByText('What had the others already seen?', { exact: true });
  await summary.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-verse="jhn20-20"]')).toBeVisible();
  await page.goto('/human-story/thomas/#confession');
  const box = await page.locator('#confession').boundingBox();
  expect(box?.y).toBeGreaterThanOrEqual(0);
  expect(box?.y).toBeLessThan(40);
});

test('no-JavaScript encounter, complete simple reading and saying comparison work at 320px', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/thomas/`);
  await page.getByRole('link', { name: 'Enter the account', exact: true }).click();
  await page.getByText('Thomas before this moment', { exact: true }).click();
  await expect(page.locator('[data-verse="jhn11-16"]')).toBeVisible();
  await page.getByRole('link', { name: 'Simple reading', exact: true }).click();
  await expect(page).toHaveURL(/\/thomas\/reading\/$/);
  for (const m of THOMAS_MOVEMENTS) for (const id of m.verseIds) await expect(page.locator(`[data-verse="${id}"] blockquote`)).toHaveText(thomasVerse(id).text);
  expect(await page.locator('[data-spatial-art]').count()).toBe(0);
  await page.getByText('Sources, editions and limits', { exact: true }).click();
  await expect(page.locator('#thomas-oxy654')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Explore the sayings and manuscripts', exact: true }).click();
  await expect(page.locator('[data-thomas-saying="26"] blockquote')).toContainText('speck');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

for (const width of [1440,768,390,320]) test(`Thomas reflows at ${width}px with enlarged text, reduced motion and unavailable imagery`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(/\.(png|jpg|jpeg|webp|avif|svg)(\?|$)/, route => route.abort());
  await page.goto('/human-story/thomas/');
  expect(await page.locator('img').count()).toBe(0);
  const primary = await page.getByRole('link', { name: 'Enter the account', exact: true }).boundingBox();
  expect(primary?.height).toBeGreaterThanOrEqual(44);
  for (const id of ['absent','unless','eight-days','confession','not-seen']) {
    await page.locator(`nav[aria-label="Thomas movements"] a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(await page.locator('[data-spatial-art]').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.addStyleTag({ content: 'p, a, summary, blockquote { font-size: 200% !important; }' });
  await page.getByText('Thomas before this moment', { exact: true }).click();
  await page.getByText('Sources, editions and limits', { exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/human-story/thomas/sayings/#comparison');
  await page.addStyleTag({ content: 'p, a, summary, blockquote { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
