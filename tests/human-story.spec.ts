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

test("Scripture rooms retain exact Jonah, disclose source limits and connect into the Atlas", async ({ page }) => {
  await page.goto("/human-story/worlds/stories/");
  await page.getByRole("link", { name: "The prophet and the city", exact: true }).click();
  await expect(page.locator('[data-entry="jonah"]')).toBeVisible();
  await expect(page.locator("blockquote")).toContainText("Shouldn’t I be concerned");
  await expect(page.getByRole("link", { name: "Read the complete Jonah · pinned WEB text" })).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await page.getByRole("link", { name: "A city beyond its name", exact: true }).click();
  await expect(page.getByText(/This tablet does not name Jonah/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Locate Nineveh in the Atlas" })).toHaveAttribute("href", /place=nineveh/);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("witnesses distinguish disputed wording, James and scholarly transmission", async ({ page }) => {
  await page.goto("/human-story/worlds/witnesses/");
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByRole("row", { name: /The Testimonium/ }).getByRole("link").click();
  await expect(page.getByText(/How much of its wording belongs to Josephus is disputed/)).toBeVisible();
  await expect(page.getByText(/the full article requires access beyond its public abstract/)).toBeVisible();
  await page.getByRole("link", { name: "James in Josephus", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Two passages, two problems" })).toBeVisible();
  await page.goto("/human-story/suetonius/");
  await expect(page.getByText(/It does not explicitly identify Jesus/)).toBeVisible();
  await expect(page.getByText("Disputed connection", { exact: true })).toBeVisible();
});
