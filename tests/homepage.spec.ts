import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import chapter3 from "../src/content/scripture/web-jonah-3.json";
import chapter4 from "../src/content/scripture/web-jonah-4.json";

// 2026-10-25: "/" now opens the contextual Nineveh encounter, not the retired question-selector UI.
// Tests prove that visitors can still begin at Jonah 1:1 and finish at 4:11.
test("public homepage begins in Nineveh with real Scripture and a full-book entry", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const landing = page.locator(".nineveh");
  await expect(landing).toHaveAttribute("data-published", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nineveh");
  await expect(page.locator(".nineveh-world")).toHaveAttribute("data-environment", "ready");
  await expect(page.locator(".nineveh-illustration")).toBeVisible();
  await expect(page.getByRole("link", { name: "Begin at Jonah 1:1" })).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await expect(page.getByRole("link", { name: "Read Jonah" })).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await expect(page.locator(".nineveh-discoveries > a")).toHaveCount(3);
  await page.screenshot({ path: testInfo.outputPath("nineveh-home-desktop.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("Nineveh transition uses pinned verses, preserves history, and links to the ending", async ({ page }) => {
  await page.goto("/");
  await page.locator('.nineveh-beats a[href="#mercy"]').click();
  await expect(page.locator('.nineveh-reading [data-reference="3:10"]')).toHaveText(chapter3.verses[9].text);
  await page.locator('.nineveh-beats a[href="#anger"]').click();
  await expect(page.locator('.nineveh-reading [data-reference="4:2"]')).toHaveText(chapter4.verses[1].text);
  await page.goBack();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "mercy");
  await page.goto("/#question");
  await expect(page.locator('.nineveh-reading [data-reference="4:4"]')).toHaveText(chapter4.verses[3].text);
  await page.getByRole("link", { name: /Continue · Jonah 4:5–11/ }).click();
  await expect(page.locator('[data-scene="jonah-4-shade"]')).toBeVisible();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await expect(page.locator('[data-reference="4:11"]')).toContainText(chapter4.verses[10].text);
});

test("published discoveries contain locally served images, rights and context", async ({ page }) => {
  await page.goto("/#anger/world");
  const dialog = page.getByRole("dialog", { name: "The world of Nineveh" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("src", /\/media\/nineveh-depth\/flood-tablet\.webp$/);
  await expect.poll(() => dialog.locator("img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await dialog.getByText("Object, provenance & image rights").click();
  await expect(dialog).toContainText("CC BY-SA 3.0");
  await expect(dialog).toContainText("seventh-century BCE");
  await expect(dialog).toContainText("does not date or verify Jonah");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.goto("/#anger/art");
  const art = page.getByRole("dialog", { name: "Jonah through art" });
  await expect(art.locator("img")).toHaveAttribute("src", /\/media\/nineveh-depth\/jonah-vine\.webp$/);
  await expect.poll(() => art.locator("img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await art.getByText("Object, provenance & image rights").click();
  await expect(art).toContainText("CC0");
  await page.keyboard.press("Escape");
  await page.goto("/#question/voices");
  const voices = page.getByRole("dialog", { name: "The question across centuries" });
  await expect(voices).toContainText("Augustine");
  await voices.getByRole("button", { name: "Pope Francis" }).click();
  await expect(voices).toContainText("pastoral interpretation");
});

test("homepage remains readable at 320px and with reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 840 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("link", { name: "Begin at Jonah 1:1" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`nineveh-home-${width}.png`), fullPage: true });
  }
  await expect.poll(() => page.locator(".nineveh-world").evaluate(el => el.getAnimations().length)).toBe(0);
  expect((await new AxeBuilder({ page }).include(".nineveh").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("homepage keyboard skip-link and reader entry remain accessible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".nineveh-skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#nineveh-heading")).toBeFocused();
  await page.getByRole("link", { name: "Begin at Jonah 1:1" }).click();
  await expect(page).toHaveURL(/\/jonah\/#jonah-1-calling$/);
  await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  await expect(page.locator('[data-scene="jonah-1-calling"]')).toBeVisible();
});

test("no JavaScript still shows Nineveh Scripture and the whole-book exit", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.locator(".nineveh-noscript [data-reference]")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Begin at Jonah 1:1" })).toBeVisible();
  await page.getByRole("link", { name: "Begin at Jonah 1:1" }).click();
  await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
  await context.close();
});

test("legacy root map links still load the atlas rather than hijacking the Nineveh hash", async ({ page }) => {
  await page.goto("/?place=nineveh&from=jonah-3-mercy");
  await expect(page.locator(".nineveh")).toHaveCount(0);
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 20000 });
});

test("legacy skip fragment is treated as a homepage anchor", async ({ page }) => {
  await page.goto("/#main-content");
  await expect(page.locator(".nineveh")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nineveh");
});
