import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import chapter4 from '../src/content/scripture/web-jonah-4.json';

const scene = '#jonah-4-question';
const verse = '[data-reference="4:11"]';
const finalUrl = '/jonah/#jonah-4-question';

test('final scene preserves the exact pinned verse and all thirteen navigation positions', async ({ page }) => {
  await page.goto('/jonah/#jonah-4-shade');
  await page.getByRole('link', { name: 'Continue', exact: false }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/#jonah-4-question$/);
  const text = await page.locator(verse).evaluate(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(''));
  expect(text).toBe(chapter4.verses.find(item => item.number === 11)?.text);
  await expect(page.locator('[data-scene]')).toHaveCount(13);
  await expect(page.locator(`${scene} .story-ending`)).toContainText('A question, left open.');
  await page.getByRole('link', { name: 'Previous', exact: false }).click();
  await expect(page).toHaveURL(/#jonah-4-shade$/);
  await page.getByRole('link', { name: 'Continue', exact: false }).filter({ visible: true }).click();
  await page.getByRole('link', { name: 'Read again', exact: false }).click();
  await expect(page).toHaveURL(/#jonah-1-calling$/);
});

test('house sale has exact attribution, dated evidence, keyboard focus and return to the same verse', async ({ page }) => {
  await page.goto('/jonah/?utm_source=review#jonah-4-question');
  const opener = page.getByText('Read a house sale', { exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'A house sale in Nineveh' });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/jonah411=house#jonah-4-question$/);
  await expect(dialog.getByRole('heading', { name: 'A house sale in Nineveh' })).toBeFocused();
  for (const value of ['692 BCE', 'Amat-Su’la', 'Ṣilli-Aššur', 'Egyptian scribe', 'Mannu-ki-ahhe', 'Ilu-issiya', 'traditional eighth-century']) await expect(dialog).toContainText(value);
  await expect(dialog.getByRole('link', { name: 'ORACC · SAA 6 142 / P335268' })).toHaveAttribute('href', 'https://oracc.museum.upenn.edu/saao/saa06/P335268/html');
  await expect(dialog.getByRole('link', { name: 'CDLI · the clay tablet P335268' })).toHaveAttribute('href', 'https://cdli.earth/artifacts/335268');
  await dialog.getByText('Edition, dating and rights', { exact: true }).click();
  await expect(dialog).toContainText('Kwasman and Simo Parpola');
  await expect(dialog).toContainText('CC BY-SA 3.0');
  await expect(dialog).toContainText('CC BY-NC-SA 4.0. Not reproduced');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#human-city-house-inline > summary')).toBeFocused();
  await expect(page).toHaveURL('/jonah/?utm_source=review#jonah-4-question');
  await opener.click();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Return to Jonah 4:11' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close discovery' })).toBeFocused();
  await page.getByRole('button', { name: 'Return to Jonah 4:11' }).click();
  await expect(page.locator(verse)).toBeFocused();
  await expect(page.locator(verse)).toBeInViewport();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('Rashi and Radak retain equal presentation, accurate citations and explicit translation limits', async ({ page }) => {
  await page.goto(finalUrl);
  await page.getByText('Read two interpretations', { exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Who is within the question?' });
  await expect(dialog).toContainText('Both readers identify children');
  await expect(dialog.getByRole('link', { name: 'Rashi · Commentary on Jonah 4:11' })).toHaveAttribute('href', 'https://www.sefaria.org/Rashi_on_Jonah.4.11');
  await expect(dialog.getByRole('link', { name: 'Radak · Commentary on Jonah 4:11' })).toHaveAttribute('href', 'https://www.sefaria.org/Radak_on_Jonah.4.11.3');
  await expect(dialog).toContainText('adults who do not recognize their Creator');
  await expect(dialog).toContainText('literal animals');
  await expect(dialog).toContainText('parents’ repentance');
  await expect(dialog).toContainText('Study paraphrases, not quotations');
  await dialog.getByText('Passage, edition and translation limits', { exact: true }).nth(1).click();
  await expect(dialog).toContainText('comment 3, beginning אשר לא ידע');
  await expect(dialog).toContainText('Specialist translation approval remains unresolved');
  await expect(dialog.getByRole('link', { name: 'Compare the Hebrew' })).toHaveAttribute('href', 'https://mg.alhatorah.org/Full/Yonah/4.11');
});

test('discoveries are shareable, reloadable and safe with back, invalid state and other scenes', async ({ page }) => {
  await page.goto(finalUrl);
  await page.getByText('Read a house sale', { exact: true }).click();
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Return to Jonah 4:11' }).click();
  await expect(page.locator(verse)).toBeFocused();
  await page.goto('/jonah/?jonah411=not-a-panel#jonah-4-question');
  await expect(page.locator(scene)).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/jonah/?jonah411=house#jonah-4-shade');
  await expect(page.locator('#jonah-4-shade')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('four viewport sizes, reduced motion and both dialogs remain accessible without overflow', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(finalUrl);
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const name of ['Read a house sale', 'Read two interpretations']) {
      await page.getByText(name, { exact: true }).click();
      const dialog = page.getByRole('dialog');
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect(await dialog.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
      if (width === 390) expect((await new AxeBuilder({ page }).include('.human-city-dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${width}-${name.includes('house') ? 'house' : 'voices'}.png`) });
      await page.keyboard.press('Escape');
    }
  }
  expect(errors).toEqual([]);
});

test('without JavaScript the exact verse and both documentary disclosures are readable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 740 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}${finalUrl}`);
  await expect(page.locator('[data-verse]')).toHaveCount(48);
  await page.getByText('Read a house sale', { exact: true }).click();
  await expect(page.locator('#human-city-house-inline')).toContainText('Mannu-ki-ahhe');
  await page.getByText('Read two interpretations', { exact: true }).click();
  await expect(page.locator('#human-city-voices-inline')).toContainText('literal animals');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#human-city-voices-inline').getByRole('link', { name: 'Return to Jonah 4:11' }).click();
  await expect(page).toHaveURL(/#jonah-4-question$/);
  await context.close();
});

test('image failures leave a complete text-only final encounter and no substituted artifact image', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'image' ? route.abort() : route.continue());
  await page.goto(finalUrl);
  await expect(page.locator(verse)).toBeVisible();
  await expect(page.locator(`${scene} img`)).toHaveCount(0);
  await page.getByText('Read a house sale', { exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('One mina of silver');
  await page.getByRole('button', { name: 'Return to Jonah 4:11' }).click();
  await expect(page.locator(verse)).toBeInViewport();
});
