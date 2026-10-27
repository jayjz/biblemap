import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.route("https://basemaps.cartocdn.com/**", route => route.fulfill({ json: { version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#101923" } }] } }));
});

test("tracking queries keep the Nineveh homepage and its section navigation", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/?utm_source=chatgpt.com&utm_medium=referral");
  await expect(page.locator(".nineveh")).toBeVisible();
  await expect(page.locator(".nineveh-world")).toHaveAttribute("data-environment", "ready");
  await page.locator('.nineveh-beats a[href="#mercy"]').click();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "mercy");
  await page.reload();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "mercy");
  await page.screenshot({ path: testInfo.outputPath("tracking-home.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("tracking queries preserve discoveries, keyboard entry and unknown anchors", async ({ page }) => {
  await page.goto("/?utm_source=chatgpt.com#anger/art");
  await expect(page.getByRole("dialog", { name: "Jonah through art" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await page.goto("/?gclid=abc&unknown=value#unknown-anchor");
  await expect(page.locator(".nineveh")).toBeVisible();
  // A fragment intentionally focuses the reading heading. Test initial Tab order
  // on a fresh tracking-only entry, after hydration has installed its handlers.
  await page.goto("/?gclid=abc&unknown=value");
  await expect(page.locator(".nineveh-world")).toHaveAttribute("data-environment", "ready");
  await page.keyboard.press("Tab");
  await expect(page.locator(".nineveh-skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#nineveh-heading")).toBeFocused();
});

test("homepage, atlas and reader have explicit return paths", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?utm_source=chatgpt.com");
  await expect(page.locator(".nineveh-world")).toHaveAttribute("data-environment", "ready");
  await expect(page.getByRole("link", { name: "Explore epochs" })).toHaveAttribute("href", "/explore/");
  await page.screenshot({ path: testInfo.outputPath("home-navigation.png"), fullPage: true });
  await page.getByRole("link", { name: "Explore epochs" }).click();
  await expect(page).toHaveURL(/\/explore\/$/);
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.ready)).toBe(true);
  await expect(page.getByRole("navigation", { name: "Atlas navigation" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open atlas controls" }).click();
    await expect(page.getByRole("button", { name: "Close atlas controls" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Close atlas controls" }).click();
  }
  await page.screenshot({ path: testInfo.outputPath("explore-navigation.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).include(".atlas-navigation").analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "BibleMap home" }).click();
  await expect(page.locator(".nineveh")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("navigation", { name: "Atlas navigation" })).toBeVisible();
  await page.getByRole("link", { name: "Read Jonah", exact: true }).click();
  await expect(page).toHaveURL(/\/jonah\/#jonah-1-calling$/);
  await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  await expect(page.getByRole("link", { name: "Exit to map" })).toHaveAttribute("href", "/explore/");
  await expect(page.getByRole("link", { name: "Explore the map" })).toHaveAttribute("href", "/explore/");
  await page.screenshot({ path: testInfo.outputPath("reader-navigation.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("legacy atlas links survive UTM parameters and reload", async ({ page }, testInfo) => {
  await page.goto("/?utm_source=chatgpt.com#exodus&book=EXO");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeEpoch)).toBe(1);
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeEpoch)).toBe(1);
  await page.goto("/?utm_source=chatgpt.com&place=nineveh&from=jonah-3-mercy");
  await expect(page.getByRole("link", { name: "Return to the passage" })).toHaveAttribute("href", "/jonah/#jonah-3-mercy");
  await page.goto("/?utm_source=chatgpt.com&event=0");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.selectedEvent)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath("legacy-event.png"), fullPage: true });
  await page.goto("/?explore=1&utm_source=chatgpt.com");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.ready)).toBe(true);
  await expect(page.locator(".nineveh")).toHaveCount(0);
});
