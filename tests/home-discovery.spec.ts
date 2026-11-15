import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HOME_CURATION } from "../src/content/home-curation";
import { HOMEPAGE, HOMEPAGE_PATHS } from "../src/lib/homepage";

const selection = [HOME_CURATION.hero, ...HOME_CURATION.featured];

test("the living archive enters the actual V4 encounter and preserves the selected supporting lives", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The living archive.");
  await expect(page.locator("[data-home-entry]")).toHaveCount(4);
  expect(await page.locator("[data-home-entry]").evaluateAll(links => links.map(link => link.getAttribute("data-home-entry")))).toEqual(selection);
  for (const entry of [HOMEPAGE.hero, ...HOMEPAGE.featured]) {
    await expect(page.locator(`[data-home-entry="${entry.id}"]`)).toHaveAttribute("href", entry.href);
    expect((await request.get(entry.href.split("#")[0])).status()).toBe(200);
  }
  await page.getByRole("link", { name: "Enter Pliny’s world" }).click();
  await expect(page).toHaveURL(/\/human-story\/pliny\/$/);
  await expect(page.locator('[data-artifact="pliny-manuscript"]')).toBeVisible();
  await page.getByRole("link", { name: /Begin with the household letter/ }).click();
  await expect(page.locator("#pliny-household")).toBeInViewport();
  await page.goto("/");
  await page.getByRole("link", { name: "The encounters", exact: true }).click();
  await expect(page.locator("#encounters")).toBeFocused();
  await page.getByRole("link", { name: "Meet Perpetua & Felicity", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Scenes in Perpetua and Felicity" })).toBeVisible();
});

test("discovery retains every eligible reading without promoting other lives", async ({ page }) => {
  await page.goto("/#discover");
  await page.getByRole("button", { name: "Browse all 27 readings" }).click();
  await expect(page.locator("#discover article")).toHaveCount(HOMEPAGE.discovery.length);
  for (const entry of HOMEPAGE.discovery) await expect(page.locator(`#reading-${entry.id} h3 a`)).toHaveAttribute("href", entry.href);
  await expect(page.locator('[data-home-entry="romanus"], [data-home-entry="james"], [data-home-entry="lachish"]')).toHaveCount(0);
  await page.getByRole("searchbox").fill("no-matching-reading-9814");
  await expect(page.getByRole("heading", { name: "No readings match that search." })).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("searchbox").fill("Lachish");
  await page.locator("#reading-lachish h3 a").click();
  await expect(page).toHaveURL(/\/lachish\/$/);
});

test("discovery actions reflow, meet contrast checks and retain visible keyboard focus", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("searchbox")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const action of await page.locator("[data-home-entry]").all()) {
      const box = await action.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      await action.focus();
      expect(await action.evaluate(el => getComputedStyle(el).outlineWidth)).toBe("3px");
      await expect(action).toBeInViewport();
    }
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("source distinctions and historical limits remain available with a keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const manuscript = page.locator('[data-home-art="pliny"]');
  await manuscript.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(manuscript).toContainText("not 8.16 or 10.96–97");
  await expect(manuscript.getByRole("link", { name: "Source record & rights" })).toHaveAttribute("href", "https://www.themorgan.org/manuscript/110821");
  await page.getByText("How are these lives connected?", { exact: true }).click();
  await expect(page.getByText(/No direct causal connection between Pliny/)).toBeVisible();
});

test("legacy all-threads returns offer every eligible authored reading path", async ({ page, request }) => {
  await page.goto("/#paths");
  await page.getByText("All reading paths", { exact: true }).click();
  for (const path of HOMEPAGE_PATHS) {
    const link = page.locator("#paths").getByRole("link", { name: path.title, exact: true });
    await expect(link).toBeVisible();
    expect((await request.get(`/human-story/paths/${path.id}/`)).status()).toBe(200);
  }
  await page.locator("#paths").getByRole("link", { name: "A word crosses centuries", exact: true }).click();
  await page.getByRole("link", { name: "All threads", exact: true }).click();
  await expect(page).toHaveURL(/\/#paths$/);
  await page.getByText("All reading paths", { exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#paths").getByRole("link", { name: "A life in another life", exact: true })).toBeVisible();
});

test("delayed and failed historical media preserve dimensions, provenance and all entrances", async ({ page }) => {
  let releaseImage: (() => void) | undefined;
  const imageGate = new Promise<void>(resolve => { releaseImage = resolve; });
  await page.route("**/media/pliny-v4/manuscript-*.webp", async route => { await imageGate; await route.continue(); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const frame = page.locator('[data-home-art="pliny"] [data-media-state]');
  await expect(frame).toHaveAttribute("data-media-state", "loading");
  const before = await frame.boundingBox();
  if (!releaseImage) throw new Error("Missing image gate");
  releaseImage();
  await expect(frame).toHaveAttribute("data-media-state", "loaded");
  expect((await frame.boundingBox())?.height).toBe(before?.height);
  await page.unroute("**/media/pliny-v4/manuscript-*.webp");
  await page.route("**/media/**/*.webp", route => route.abort());
  await page.goto("/");
  for (const id of ["pliny", "perpetua", "jonah"]) {
    const art = page.locator(`[data-home-art="${id}"]`);
    await art.scrollIntoViewIfNeeded();
    await expect(art.getByRole("status")).toContainText("The image could not load.");
    await art.locator("summary").click();
    await expect(art.getByRole("link", { name: "Source record & rights" })).toBeVisible();
  }
  await page.getByRole("link", { name: "Enter Pliny’s world" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("A kind of commonwealth");
});

test("all selected entrances and broader discovery work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  for (const entry of [HOMEPAGE.hero, ...HOMEPAGE.featured]) {
    await page.goto(`${baseURL}/`);
    await page.locator(`[data-home-entry="${entry.id}"]`).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(entry.href.split("#")[0]);
  }
  await page.goto(`${baseURL}/`);
  await expect(page.locator("#discover article")).toHaveCount(HOMEPAGE.discovery.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
