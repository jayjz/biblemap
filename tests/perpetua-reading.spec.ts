import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { INTERIOR_PASSAGES } from "../src/content/human-story-interiors";
import { separationReadingText } from "../src/domain/separation-reading";

const text = separationReadingText(INTERIOR_PASSAGES.childEarlier.text, INTERIOR_PASSAGES.childSeparation.text);

test("the reader discovers presence, refusal and interpretation without a fictional reunion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/human-story/perpetua/#perpetua-separation");
  const scene = page.locator('[data-scene="separation"]');
  const heading = scene.getByRole("heading", { name: "She asks for her child.", exact: true });
  await expect(heading).toBeFocused();
  expect((await heading.boundingBox())?.y).toBeLessThan(40);
  const source = scene.locator("#separation-source-moment blockquote");
  await expect(source).toHaveText(text.presence);
  await expect(scene.getByText("He is allowed to stay with her.", { exact: true })).toBeVisible();
  const distance = () => scene.locator('[aria-hidden="true"] > span').evaluateAll(elements => {
    const labels = elements.filter(element => element.textContent === "Perpetua" || element.textContent === "Her child");
    return labels[1].getBoundingClientRect().left - labels[0].getBoundingClientRect().right;
  });
  const together = await distance();
  const next = scene.getByRole("button", { name: /^Read the later passage/ });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(source).toHaveText(text.refusal);
  await expect(scene.getByText("He is not returned to her.", { exact: true })).toBeVisible();
  await expect(scene.getByRole("complementary", { name: "Remember the earlier passage" })).toBeVisible();
  expect(INTERIOR_PASSAGES.childEarlier.text).toContain(await scene.locator("#separation-source-moment q").innerText());
  const apart = await distance();
  expect(apart).toBeGreaterThan(together + 40);
  const interpretation = scene.getByRole("button", { name: /^Read what she says next/ });
  await expect(scene.getByRole("figure", { name: "In the account: Perpetua and her child apart", exact: true })).toBeFocused();
  expect((await scene.getByRole("figure", { name: "In the account: Perpetua and her child apart", exact: true }).boundingBox())?.y).toBeLessThan(40);
  await page.keyboard.press("Tab");
  await expect(interpretation).toBeFocused();
  await page.keyboard.press("Space");
  await expect(source).toHaveText(text.relief);
  await expect(scene.getByRole("figure", { name: "In the account: Perpetua and her child apart", exact: true })).toBeFocused();
  expect(await distance()).toBe(apart);
  expect(INTERIOR_PASSAGES.childEarlier.text).toContain(await scene.locator("#separation-source-moment q").innerText());
  await expect(scene.getByText("Religious interpretation within the attributed account", { exact: true })).toBeVisible();
  await expect(scene.getByText(/explanation of God’s will belongs to the attributed account/)).toBeVisible();
  await expect(scene.locator("#separation-source-moment")).toContainText("does not tell us the child’s later life");
  await expect(page).toHaveURL(/#perpetua-separation$/);
  await scene.getByRole("button", { name: "Read both complete passages", exact: true }).click();
  await expect(scene.locator('[data-passage="childEarlier"] blockquote')).toHaveText(INTERIOR_PASSAGES.childEarlier.text);
  await expect(scene.locator('[data-passage="childSeparation"] blockquote')).toHaveText(INTERIOR_PASSAGES.childSeparation.text);
  await expect(scene.locator('[data-passage="childEarlier"]')).toBeVisible();
  await expect(scene.locator('[data-passage="childSeparation"]')).toBeVisible();
  await scene.getByRole("button", { name: "Return to the guided reading", exact: true }).click();
  await expect(source).toHaveText(text.relief);
  await scene.getByText("People and the account’s limits", { exact: true }).click();
  const father = scene.getByRole("button", { name: "Her father", exact: true });
  await father.focus();
  await page.keyboard.press("Space");
  await expect(father).toHaveAttribute("aria-pressed", "true");
  await expect(scene.locator('[aria-live="polite"]').filter({ hasText: "His refusal is reported" })).toBeVisible();
});

test("every source moment remains accessible at 320px with motion reduced", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/human-story/perpetua/#perpetua-separation");
  const scene = page.locator('[data-scene="separation"]');
  for (const label of ["Earlier", "After the sentence", "Continued"]) {
    await scene.getByRole("navigation", { name: "Moments in the separation passage" }).getByRole("button", { name: new RegExp(label) }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await scene.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
    expect((await new AxeBuilder({ page }).include('[data-scene="separation"]').withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  }
});

test("without scripts the complete source passages and reception details remain available", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 760 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/human-story/perpetua/#perpetua-separation`);
    const scene = page.locator('[data-scene="separation"]');
    await expect(scene.locator('[data-passage="childEarlier"] blockquote')).toHaveText(INTERIOR_PASSAGES.childEarlier.text);
    await expect(scene.locator('[data-passage="childSeparation"] blockquote')).toHaveText(INTERIOR_PASSAGES.childSeparation.text);
    await expect(scene.locator('[data-passage="childSeparation"]')).toBeVisible();
    await expect(scene.locator('[data-passage="childEarlier"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await scene.getByText("How a later image holds them together", { exact: true }).click();
    await expect(scene.locator('[data-interior-art="perpetua-mosaic"]')).toContainText("Devotional mosaic; artist and date unknown");
  } finally { await context.close(); }
});

test("optional reception art can fail without changing the source reading", async ({ page }) => {
  await page.route("**/media/human-story/perpetua-mosaic.webp", route => route.abort());
  await page.goto("/human-story/perpetua/#perpetua-separation");
  const scene = page.locator('[data-scene="separation"]');
  await scene.getByText("How a later image holds them together", { exact: true }).click();
  await expect(scene.getByRole("status")).toContainText("The image could not load");
  await expect(scene.locator("#separation-source-moment blockquote")).toHaveText(text.presence);
  await scene.getByText("Inspect this passage", { exact: true }).click();
  await expect(scene.getByText(/does not tell us the child's later life/)).toBeVisible();
});
