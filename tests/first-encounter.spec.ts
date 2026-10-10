import { test, expect } from "@playwright/test";

test("new reader receives orientation before optional research", async ({ page }, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  page.on("requestfailed", request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto("/jonah/#jonah-1-calling");
  await expect(page.locator("[data-scene='jonah-1-calling']")).toBeVisible();
  await expect(page.getByText("A place to begin", { exact: true })).toBeVisible();
  await expect(page.locator("[data-scene='jonah-1-calling'] [data-verse]")).toHaveCount(2);
  await page.screenshot({ path: testInfo.outputPath("jonah-calling.png"), fullPage: true });
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page.locator("[data-scene='jonah-1-escape'] [data-verse='3']")).toBeVisible();
  await expect(page.locator(".story-first-perspectives")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("jonah-escape.png"), fullPage: true });
  await expect(page.getByText("Pascal examines")).not.toBeVisible();
  await page.getByText("Why do people run?", { exact: false }).click();
  for (const name of ["Blaise Pascal", "Friedrich Nietzsche", "Augustine of Hippo"]) {
    await expect(page.locator(".story-first-perspectives").getByRole("heading", { name: new RegExp(name) })).toBeVisible();
  }
  expect(failures).toEqual([]);
});

test("first encounter remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/jonah/`);
  await expect(page.getByText("A place to begin", { exact: true })).toBeVisible();
  await expect(page.locator("[data-verse]")).toHaveCount(48);
  await context.close();
});
