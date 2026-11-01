import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("human story entrance has five worlds, Scripture access and an accessible reading order", async ({ page }) => {
  await page.goto("/human-story/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
  await expect(page.getByRole("navigation", { name: "Explore the five worlds" }).getByRole("link")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Or begin with the book of Jonah" })).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("human story remains readable without JavaScript and at 320px", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByText("About this exploration", { exact: true }).click();
  await expect(page.getByText(/This no-index design study/)).toBeVisible();
  await page.getByRole("link", { name: "Or begin with the book of Jonah" }).click();
  await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
  await context.close();
});
