import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('sculpture study preserves the passage, traps focus, and returns on Escape', async ({ page }, testInfo) => {
  await page.goto('/jonah/#jonah-4-shade');
  const article = page.locator('[data-scene=jonah-4-shade]');
  const trigger = article.getByRole('button', { name: 'Look closely at the sculpture' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Jonah Under the Gourd Vine' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Return to the passage' })).toBeFocused();
  await expect(dialog.getByRole('img')).toHaveAttribute('src', '/media/jonah/cma-jonah-gourd-vine.jpg');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('sculpture-study.png') });
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(article.locator('[data-reference="4:10"]')).toBeVisible();
  await trigger.click();
  await dialog.getByRole('button', { name: 'Return to the passage' }).click();
  await expect(trigger).toBeFocused();
  await article.getByRole('link', { name: 'Continue' }).click();
  await expect(page.locator('[data-reference="4:11"]')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('three discoveries preserve Scripture, disclose sources, and remain readable at 320px', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const scene of ['jonah-1-escape', 'jonah-3-mercy', 'jonah-4-anger', 'jonah-4-shade']) {
    await page.goto(`/jonah/#${scene}`);
    await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
    const article = page.locator(`[data-scene=${scene}]`);
    await expect(article.locator('.scene-discovery')).toBeVisible();
    await expect(article.locator('.story-explore-further')).not.toHaveAttribute('open', '');
    await expect(article.locator('.story-reflection')).not.toBeVisible();
    const scripture = await article.locator('.story-verses').boundingBox();
    const discovery = await article.locator('.scene-discovery').boundingBox();
    expect(scripture && discovery && discovery.y >= scripture.y + scripture.height).toBeTruthy();
    await article.locator('.story-explore-further > summary').focus();
    await page.keyboard.press('Enter');
    await article.getByText('Translation, sources & notes', { exact: true }).click();
    await expect(article.getByRole('link', { name: 'Publisher’s rights statement' })).toBeVisible();
    await article.locator('.story-explore-further > summary').click();
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include('.story-root').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await article.screenshot({ path: testInfo.outputPath(`${scene}-320.png`) });
  }
  await page.getByText('Stay with the sculpture').click();
  await expect(page.getByRole('link', { name: /Cleveland Museum of Art · Jonah/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('passage opens Nineveh in the existing atlas and returns to the same passage', async ({ page }, testInfo) => {
  await page.goto('/jonah/#jonah-4-anger');
  await page.getByRole('link', { name: 'Explore Nineveh', exact: false }).click();
  await expect(page).toHaveURL(/place=nineveh&from=jonah-4-anger/);
  const panel = page.locator('[data-story-place=nineveh]');
  await expect(panel.getByRole('heading', { name: 'Nineveh', exact: true })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'A library in clay' })).toBeVisible();
  await expect(panel).toContainText('not a date for Jonah’s visit');
  await expect(panel.getByText('Early seventh century BCE')).toBeVisible();
  await panel.getByText('A flood story, pressed into clay').click();
  await expect(panel.getByRole('link', { name: /See the Flood Tablet/ })).toHaveAttribute(
    'href', 'https://www.britishmuseum.org/collection/search?keyword=K.3375'
  );
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.selectedPlace)).toBe('nineveh');
  const camera = await page.evaluate(() => window.__BIBLEMAP__?.placeCamera);
  expect(camera?.longitude).toBeCloseTo(43.159936889690734, 5);
  expect(camera?.latitude).toBeCloseTo(36.36076152375775, 5);
  await page.getByRole('button', { name: 'Zoom in on place' }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.placeCamera?.zoom)).toBe(7);
  await page.getByRole('button', { name: 'Recenter' }).click();
  const map = await page.locator('.story-place-map').boundingBox();
  const text = await panel.boundingBox();
  if (testInfo.project.name === 'mobile') expect(map && text && map.y + map.height <= text.y + 1).toBeTruthy();
  await panel.getByText('Sources & map attribution').click();
  await expect(panel.getByRole('link', { name: /Pleiades/ })).toHaveAttribute('href', 'https://pleiades.stoa.org/places/874621');
  expect((await new AxeBuilder({ page }).include('.story-place-panel').include('.story-place-map-controls').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('nineveh-atlas.png') });
  await panel.getByRole('link', { name: 'Return to the passage' }).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('[data-reference="4:1"]')).toBeVisible();
});

test('discovery artwork failure preserves passage and connections', async ({ page }) => {
  await page.route('**/media/jonah/*', route => route.abort());
  await page.goto('/jonah/#jonah-4-shade');
  const article = page.locator('[data-scene=jonah-4-shade]');
  await expect(article.getByText('Artwork unavailable. The passage remains readable.')).toBeVisible();
  await expect(article.locator('[data-reference="4:10"]')).toBeVisible();
  await article.getByRole('link', { name: 'Continue' }).click();
  await expect(page.locator('[data-reference="4:11"]')).toBeVisible();
  await expect(page.locator('[data-scene=jonah-4-question] .scene-discovery')).toHaveCount(0);
});

test('Joppa link and missing basemap retain sourced places and return navigation', async ({ page }) => {
  await page.route('https://basemaps.cartocdn.com/**', route => route.abort());
  await page.goto('/jonah/#jonah-1-escape');
  await page.getByRole('link', { name: 'Find Joppa in the atlas' }).click();
  const panel = page.locator('[data-story-place=joppa]');
  await expect(panel.getByRole('heading', { name: 'Joppa', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('map tiles could not load');
  await expect(panel).toContainText('Tarshish is left unmarked');
  await panel.getByRole('link', { name: 'Return to the passage' }).click();
  await expect(page.locator('#jonah-1-escape-heading')).toBeFocused();
});
