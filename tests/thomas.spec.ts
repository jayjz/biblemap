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
  await expect(page.locator('#before-thomas')).toBeFocused();
  const nav = page.getByRole('navigation', { name: 'Thomas movements' });
  await nav.getByRole('link', { name: 'II Unless I see', exact: true }).click();
  await expect(page.locator('#unless')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/#before-thomas$/);
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
  await page.getByRole('radio',{name:/P.Oxy. 654 Greek/}).check();
  await expect(page.locator('[data-witness="oxy654"]')).toBeVisible();
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

test('native voice comparison and manuscript exploration preserve source text with keyboard and no JavaScript', async ({ browser, baseURL }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  await page.goto(`${baseURL}/human-story/thomas/#unless`);
  const compare=page.getByRole('checkbox',{name:'Hold the two voices together',exact:true});
  await compare.focus(); await page.keyboard.press('Space');
  await expect(compare).toBeChecked();
  await expect(page.locator('[data-verse="jhn20-25"] blockquote')).toHaveCSS('display','grid');
  await expect(page.locator('[data-verse="jhn20-25"] blockquote')).toHaveText(thomasVerse('jhn20-25').text);
  await page.goto(`${baseURL}/human-story/thomas/sayings/#witnesses`);
  const witness=page.getByRole('radio',{name:/P.Oxy. 1 Greek/});
  await witness.focus(); await page.keyboard.press('Space');
  await expect(page.locator('[data-witness="oxy1"]')).toBeVisible();
  await expect(page.locator('[data-witness="oxy1"]')).toContainText('Ending only');
  await expect(page.locator('[data-witness="oxy1"]')).toContainText('Not preserved in this fragment');
  await page.goto(`${baseURL}/human-story/thomas/sayings/#saying-13`);
  await page.getByText('Read the whole preserved saying 13',{exact:true}).click();
  await expect(page.locator('[data-thomas-full-saying="13"]')).toContainText('told him three things');
  await expect(page.locator('#saying-13')).toContainText('does not give their content');
  await context.close();
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

test('image loading keeps the frame stable and the complete text available', async ({ page }) => {
  const gate=Promise.withResolvers<void>();
  await page.route(/\/media\/thomas\/threshold-\d+\.webp$/,async route=>{await gate.promise;await route.continue();});
  await page.goto('/human-story/thomas/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  const frame=page.locator('[data-cinematic-frame="threshold"]').first();
  await expect(frame).toHaveAttribute('data-media-state','loading');
  const before=await frame.boundingBox();
  await expect(page.locator('[data-verse="jhn20-29"] blockquote')).toHaveText(thomasVerse('jhn20-29').text);
  gate.resolve();
  await expect(frame).toHaveAttribute('data-media-state','loaded');
  expect(await frame.boundingBox()).toEqual(before);
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
  await expect(page.locator('[data-cinematic-frame]').first()).toHaveAttribute('data-media-state','unavailable');
  await expect(page.locator('[data-verse="jhn20-24"]')).toContainText(thomasVerse('jhn20-24').text);
  const primary = await page.getByRole('link', { name: 'Enter the account', exact: true }).boundingBox();
  expect(primary?.height).toBeGreaterThanOrEqual(44);
  for (const id of ['absent','unless','eight-days','confession','not-seen']) {
    await page.locator(`nav[aria-label="Thomas movements"] a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(await page.locator('[data-cinematic-frame]').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.addStyleTag({ content: 'p, a, summary, blockquote { font-size: 200% !important; }' });
  await page.getByText('Thomas before this moment', { exact: true }).click();
  await page.getByText('Sources, editions and limits', { exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/human-story/thomas/sayings/#comparison');
  await page.addStyleTag({ content: 'p, a, summary, blockquote { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
