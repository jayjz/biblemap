import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  await expect(page.locator("[data-scene=jonah-1-calling]")).toBeVisible();
  await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
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

const doors = [
  { question: "What do we do when we’d rather turn away?", invitation: "Jonah’s story begins with a call" },
  { question: "How do our choices affect others?", invitation: "A journey across the sea" },
  { question: "Why can forgiveness be so difficult?", invitation: "Mercy and resentment meet" },
];

for (const door of doors) {
  test(`optional question: ${door.question}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed", request => {
      if (request.failure()?.errorText !== "net::ERR_ABORTED") errors.push(request.url());
    });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto("/");
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(3);
    for (const radio of await radios.all()) await expect(radio).not.toBeChecked();
    // Wait for hydration by exercising two choices, ending on the requested one.
    await radios.last().check();
    await expect(radios.last()).toBeChecked();
    const requests: string[] = [];
    page.on("request", request => requests.push(request.url()));
    const initialState = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, url: location.href }));
    const radio = page.getByRole("radio", { name: door.question, exact: true });
    await radio.check();
    await expect(radio).toBeChecked();
    await expect(page.locator(".bm-invitation")).toContainText(door.invitation);
    expect(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, url: location.href }))).toBe(initialState);
    expect(requests).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("selected.png"), fullPage: true });
    await page.getByRole("link", { name: "Enter the story" }).click();
    await expect(page).toHaveURL(/\/jonah\/$/);
    await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
    await expect(page.locator("[data-scene=jonah-1-calling]")).toBeVisible();
    await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("question keyboard navigation, reset, and narrow mobile", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".bm-skip")).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const first = page.getByRole("radio").first();
  await expect(first).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath("keyboard-focus.png"), fullPage: true });
  await page.keyboard.press("Space");
  await expect(first).toBeChecked();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await expect(page.getByRole("radio").nth(1)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Enter the story" })).toBeFocused();
  await page.reload();
  for (const radio of await page.getByRole("radio").all()) await expect(radio).not.toBeChecked();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.screenshot({ path: testInfo.outputPath("narrow-default.png"), fullPage: true });
  for (const door of doors) {
    await page.getByRole("radio", { name: door.question, exact: true }).check();
    await expect(page.locator(".bm-invitation")).toContainText(door.invitation);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  }
  await page.screenshot({ path: testInfo.outputPath("narrow-selected.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).include(".bm-home").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("story entry remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.locator(".bm-invitation")).toContainText("Begin with Jonah");
  await page.getByRole("link", { name: "Enter the story" }).click();
  await expect(page).toHaveURL(/\/jonah\/$/);
  await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
  await context.close();
});
