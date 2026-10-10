import { test, expect } from "@playwright/test";

test("homepage introduces Jonah and clearly distinguishes future journeys", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", request => { if (new URL(request.url()).hostname !== "127.0.0.1") external.push(request.url()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Questions that stay with us.");
  await expect(page.getByRole("link", { name: "Enter the story" })).toHaveAttribute("href", "/jonah/");
  await expect(page.getByRole("link", { name: /Explore the biblical world/ }).first()).toHaveAttribute("href", "/explore/");
  await expect(page.getByText("Future journey · Not yet available")).toHaveCount(4);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
  await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  await page.getByRole("link", { name: "Enter the story" }).click();
  await expect(page).toHaveURL(/\/jonah\/$/);
  await expect(page.getByRole("heading", { name: /Jonah/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("homepage reflows and respects reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 840 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`homepage-${width}.png`), fullPage: true });
  }
  await page.keyboard.press("Tab");
  await expect(page.locator(".bm-skip")).toBeFocused();
});
