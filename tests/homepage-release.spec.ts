import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { WORLDS } from "../src/features/human-story/worlds";

test("both entrances render Human Story with canonical social metadata and publication safeguards", async ({ page }) => {
  for (const path of ["/", "/human-story/", "/?utm_source=release#paths", "/#unknown"]) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
    await expect(page.locator(".nineveh")).toHaveCount(0);
    await expect(page).toHaveTitle("The Human Story — BibleMap");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://biblemap-pink.vercel.app/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "The Human Story — BibleMap");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://biblemap-pink.vercel.app/");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "The Human Story — BibleMap");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  }
});

test("homepage and Nineveh support keyboard entry, motion preference and navigation in both directions", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  expect(await page.locator("main").evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("human-story-root.png"), fullPage: true });
  await page.getByRole("link", { name: "Return to Nineveh" }).click();
  await expect(page).toHaveURL(/\/nineveh\/$/);
  await expect(page.locator(".nineveh")).toHaveAttribute("data-published", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nineveh");
  await expect(page.locator(".nineveh-world")).toHaveAttribute("data-environment", "ready");
  await page.screenshot({ path: testInfo.outputPath("nineveh-preserved.png"), fullPage: true });
  await page.getByRole("link", { name: "BibleMap", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
  await page.goto("/#anger");
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await page.getByRole("link", { name: "BibleMap", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
  await page.goBack();
  await expect(page.locator(".nineveh")).toBeVisible();
});

test("five worlds and both principal lives remain reachable through the entrance", async ({ page }, testInfo) => {
  await page.goto("/");
  for (const world of WORLDS) {
    await page.getByRole("navigation", { name: "Explore the five worlds" }).getByRole("link", { name: world.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/human-story/worlds/${world.id}/$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Explore the five worlds" }).getByRole("link", { name: world.name, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await page.getByRole("link", { name: "BibleMap: The human story" }).click();
  await page.getByRole("link", { name: "Enter the encounter", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/perpetua\/$/);
  await expect(page.getByRole("navigation", { name: "Scenes in The Prison" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("perpetua-navigation.png"), fullPage: true });
  await page.getByRole("link", { name: "Augustine: a life reread", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/augustine\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("legacy Nineveh fragments preserve discoveries, focus, reload and Back/Forward", async ({ page }) => {
  await page.goto("/?utm_source=release#mercy");
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "mercy");
  await expect(page.locator("#nineveh-heading")).toBeFocused();
  await page.locator('.nineveh-beats a[href="#anger"]').click();
  await page.locator("#discover-art").click();
  await expect(page.getByRole("dialog", { name: "Jonah through art" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Jonah through art" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#discover-art")).toBeFocused();
  await page.goBack();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "mercy");
  await page.goForward();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await page.getByRole("link", { name: "BibleMap", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
});

test("root content and Scripture navigation survive absent or failed JavaScript", async ({ browser, baseURL }) => {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 320, height: 900 }, reducedMotion: "reduce" });
    if (javaScriptEnabled) await context.route("**/_next/static/**/*.js", route => route.abort());
    const page = await context.newPage();
    await page.goto(`${baseURL}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The humanstory.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Or begin with the book of Jonah" }).click();
    await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
    await context.close();
  }
});

for (const path of ["/", "/human-story/", "/nineveh/", "/jonah/", "/explore/", "/human-story/perpetua/", "/human-story/augustine/", "/human-story/worlds/witnesses/", "/human-story/worlds/saints/"]) {
  test(`release route ${path} has no unexpected errors, broken images or overflow`, async ({ page }) => {
    const failures: string[] = [];
    page.on("pageerror", error => failures.push(error.message));
    page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
    page.on("requestfailed", request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    // Established deterministic Atlas fixture; all local data/chunks still load.
    if (process.env.PLAYWRIGHT_LIVE_BASEMAP !== "1") {
      await page.route("https://basemaps.cartocdn.com/**", route => route.fulfill({ json: { version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#101923" } }] } }));
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect((await page.goto(path))?.status()).toBe(200);
    if (path === "/explore/") await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.ready)).toBe(true);
    else await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const image of await page.locator("img:visible").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(failures).toEqual([]);
  });
}

test("static export includes all published routes and server-rendered entrance metadata", () => {
  for (const path of ["", "human-story/", "nineveh/", "jonah/", "explore/", "human-story/perpetua/", "human-story/augustine/", ...WORLDS.map(world => `human-story/worlds/${world.id}/`)]) {
    const html = readFileSync(`out/${path}index.html`, "utf8");
    expect(html).toContain("<html");
    if (path === "" || path === "human-story/") {
      expect(html).toContain('<h1 id="portal-title">');
      expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
      expect(html).toContain('<link rel="canonical" href="https://biblemap-pink.vercel.app/"');
    }
    if (path === "nineveh/") expect(html).toContain('data-published="true"');
  }
});
