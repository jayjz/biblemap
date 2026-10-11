import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Nineveh encounter unfolds from Scripture to later context and back to verses', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const failedRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => failedRequests.push(request.url()));
  await page.goto('/jonah/#jonah-3-mercy');
  const scene = page.locator('[data-scene="jonah-3-mercy"]');
  await expect(scene.locator('[data-reference="3:5"]')).toContainText('The people of Nineveh believed God');
  await expect(scene.locator('[data-reference="3:10"]')).toContainText('God saw their works');
  await expect(scene.getByText('NINEVEH', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('city-opening.png') });

  await scene.getByText('See the place').click();
  await expect(scene.getByText('Interpretive schematic · not to scale.')).toBeVisible();
  await expect(scene.getByText('This later royal evidence does not date Jonah’s visit')).toBeVisible();
  await scene.getByText('Sources and limits').click();
  await expect(scene.getByRole('link', { name: 'ORACC · Sennacherib 226 (Q004031)' })).toHaveAttribute('href', 'https://oracc.museum.upenn.edu/rinap/rinap3/Q004031');
  await page.screenshot({ path: testInfo.outputPath('city-place.png'), fullPage: true });

  await scene.getByText('Return to the passage').click();
  await expect(scene.locator('.city-sequence li')).toHaveCount(3);
  await scene.getByRole('link', { name: 'Read verse 10' }).focus();
  await page.keyboard.press('Enter');
  await expect(scene.locator('[data-reference="3:10"]')).toBeFocused();
  await expect(scene.locator('[data-reference="3:10"]')).toContainText('God saw their works');
  await expect(scene.locator('[data-reference="3:5"]')).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 700 });
    await scene.locator('.city-encounter').scrollIntoViewIfNeeded();
    await expect(scene.locator('.city-encounter')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.screenshot({ path: testInfo.outputPath('city-320.png') });
  }
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('the encounter reads without JavaScript or image loading', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.route('**/*.{png,jpg,jpeg,webp}', route => route.abort());
  await page.goto('/jonah/#jonah-3-mercy');
  const scene = page.locator('[data-scene="jonah-3-mercy"]');
  await scene.getByText('See the place').click();
  await scene.getByText('Return to the passage').click();
  await scene.getByRole('link', { name: 'Read verses 6–9' }).click();
  await expect(scene.locator('[data-reference="3:6"]')).toBeVisible();
  await expect(scene.locator('[data-reference="3:10"]')).toBeVisible();
  await context.close();
});

test('reduced motion retains the same stages', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/jonah/#jonah-3-mercy');
  const scene = page.locator('[data-scene="jonah-3-mercy"]');
  await scene.getByText('See the place').click();
  await scene.getByText('Return to the passage').click();
  await expect(scene.getByText('God sees their conduct')).toBeVisible();
  await expect(scene).toHaveCSS('animation-name', 'none');
});
