import { test, expect } from "@playwright/test";

test("new reader receives orientation before optional research", async ({ page }) => {
  await page.goto("/jonah/#jonah-1-calling");
  await expect(page.locator("[data-scene='jonah-1-calling']")).toBeVisible();
  await expect(page.getByText("A place to begin", { exact: true })).toBeVisible();
  await expect(page.locator("[data-scene='jonah-1-calling'] [data-verse]")).toHaveCount(2);
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page.locator("[data-scene='jonah-1-escape'] [data-verse='3']")).toBeVisible();
  await expect(page.locator(".story-first-perspectives")).toBeVisible();
  await expect(page.getByText("Pascal examines")).not.toBeVisible();
  await page.getByText("Why do people run?", { exact: false }).click();
  for (const name of ["Blaise Pascal", "Friedrich Nietzsche", "Augustine of Hippo"]) {
    await expect(page.locator(".story-first-perspectives").getByRole("heading", { name: new RegExp(name) })).toBeVisible();
  }
});

test("first encounter remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/jonah/`);
  await expect(page.getByText("A place to begin", { exact: true })).toBeVisible();
  await expect(page.locator("[data-verse]")).toHaveCount(17);
  await context.close();
});
