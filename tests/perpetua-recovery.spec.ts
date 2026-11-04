import { test, expect } from "@playwright/test";
import { PERPETUA_PASSAGES } from "../src/content/perpetua-passages";

test("vision reading keeps seeing, changed body and waking interpretation distinct", async ({ page }) => {
  await page.goto("/human-story/perpetua/#perpetua-vision");
  const vision = page.locator('[data-scene="vision"]');
  await expect(vision.locator('[data-vision-passage="expected"] blockquote')).toHaveText(PERPETUA_PASSAGES.expected.text);
  await expect(vision).toContainText("AI-generated artwork");
  await vision.getByRole("button", { name: "A changed body", exact: true }).click();
  await expect(vision.locator('#vision-source')).toBeFocused();
  await expect(vision.locator('[data-vision-passage="changed"] blockquote')).toHaveText(PERPETUA_PASSAGES.changed.text);
  await vision.getByRole("button", { name: "On waking", exact: true }).click();
  await expect(vision.locator('[data-vision-passage="waking"] blockquote')).toHaveText(PERPETUA_PASSAGES.waking.text);
  await expect(page).toHaveURL(/#perpetua-vision$/);
});

test("source links open the ending research without hiding it and restore scene history", async ({ page }) => {
  await page.goto("/human-story/perpetua/#perpetua-child");
  await page.locator('[data-scene="child"]').getByRole("link", { name: "Image & source", exact: true }).click();
  await expect(page.locator('#source-cassatt-art')).toBeVisible();
  await expect(page.locator('#ending-research')).toHaveAttribute('open', '');
  await expect(page.locator('#source-cassatt-art')).toHaveAttribute('open', '');
  await page.goBack();
  await expect(page.locator('[data-scene="child"]')).toBeVisible();
  await page.goto('/human-story/perpetua/#source-vision-art');
  await expect(page.locator('#source-vision-art')).toBeVisible();
  await expect(page.locator('#source-vision-art')).toHaveAttribute('open', '');
});

test("the last reading frame is the unanswered question, after research and controls", async ({ page }) => {
  await page.goto('/human-story/perpetua/#perpetua-handover');
  const ending = page.locator('[data-scene="handover"]');
  await expect(ending.locator('[data-perpetua-passage="standing"]')).toContainText('gave her her hand');
  const question = ending.getByRole('heading', { name: /Whose voice survives/ });
  const research = ending.locator('#ending-research');
  expect(await research.evaluate(element => {
    const question = Array.from(element.closest('[data-scene="handover"]')?.querySelectorAll('h3') ?? []).find(item => item.textContent?.startsWith('Whose voice survives'));
    return Boolean(question && (element.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await expect(page.locator('footer')).toHaveCount(0);
  await expect(question.locator('..').locator('a, button, details')).toHaveCount(0);
});

test("new artworks can fail while the vision and narrated childbirth remain readable", async ({ page }) => {
  await page.route('**/media/human-story/perpetua-vision.webp', route => route.abort());
  await page.route('**/media/human-story/kollwitz-mothers.webp', route => route.abort());
  await page.goto('/human-story/perpetua/#perpetua-vision');
  const vision = page.locator('[data-scene="vision"]');
  await expect(vision.getByRole('status')).toContainText('The image could not load');
  await expect(vision.locator('[data-vision-passage="expected"] blockquote')).toBeVisible();
  await page.getByRole('navigation', { name: 'Scenes in The Prison' }).getByRole('link', { name: 'Felicity', exact: true }).click();
  const felicity = page.locator('[data-scene="felicity"]');
  await expect(felicity.getByRole('status')).toBeVisible();
  await expect(felicity).toContainText('labour begins');
  await expect(felicity.locator('[data-perpetua-passage="daughter"] blockquote')).toBeVisible();
});

test("the reported vision has all three passages when JavaScript is disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/perpetua/#perpetua-vision`);
  for (const id of ['expected', 'changed', 'waking'] as const) {
    await expect(page.locator(`[data-vision-passage="${id}"] blockquote`)).toHaveText(PERPETUA_PASSAGES[id].text);
    await expect(page.locator(`[data-vision-passage="${id}"] blockquote`)).toBeVisible();
  }
  await context.close();
});
