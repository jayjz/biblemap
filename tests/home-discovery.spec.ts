import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the homepage leads directly into both complete lives and their sources", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Meet Perpetua & Romanus", exact: true }).click();
  await expect(page.locator("#encounters")).toBeFocused();
  const entrances = page.getByRole("region", { name: "Two lives. Different voices." });
  await entrances.getByRole("link", { name: "Enter the encounter", exact: true }).click();
  await expect(page.locator("[data-prison-ready]")).toHaveAttribute("data-prison-ready", "true");
  const scenes = page.getByRole("navigation", { name: "Scenes in The Prison" });
  for (const link of await scenes.getByRole("link").all()) {
    await link.click();
    await expect(link).toHaveAttribute("aria-current", "step");
  }
  await page.locator("#ending-research > summary").click();
  await page.getByRole("link", { name: "Augustine: a life reread", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/augustine\/$/);
  await page.goto("/");
  await entrances.getByRole("link", { name: "Meet Romanus", exact: true }).click();
  await page.getByRole("link", { name: "Begin with the person" }).click();
  const movements = page.getByRole("navigation", { name: "Movements in Romanus’s story" });
  for (const link of await movements.getByRole("link").all()) await link.click();
  await expect(page.locator("#romanus-memory")).toBeFocused();
  await page.getByRole("link", { name: "Read this text’s provenance", exact: true }).click();
  await expect(page.locator("#romanus-research")).toHaveAttribute("open", "");
  await page.getByRole("link", { name: "Perpetua: another life, other voices" }).click();
  await expect(page).toHaveURL(/\/human-story\/perpetua\/$/);
});

test("discovery actions have measured contrast, large targets and visible keyboard focus", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const targets = page.locator('a[class*="action-link_action"], header nav a, header a[href="/explore/"]');
    for (const target of await targets.all()) {
      const box = await target.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    for (const label of ["Enter the encounter", "Meet Romanus"]) {
      const action = page.getByRole("link", { name: label, exact: true });
      const ratio = await action.evaluate(el => {
        const luminance = (color: string) => {
          const rgb = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
          if (!rgb || rgb.length !== 3) throw new Error(`Unexpected color: ${color}`);
          const values = rgb.map(n => n / 255).map(n => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
          return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
        };
        const css = getComputedStyle(el), a = luminance(css.color), b = luminance(css.backgroundColor);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      await action.focus();
      expect(await action.evaluate(el => getComputedStyle(el).outlineWidth)).toBe("3px");
      await expect(action).toBeInViewport();
    }
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  }
});

test("collection rows are full links; discovery survives enlarged text, missing images and no JavaScript", async ({ page, browser, baseURL }) => {
  await page.goto("/human-story/worlds/saints/");
  await page.getByRole("link", { name: "Choose a life to read" }).click();
  await expect(page.locator("#reading-index-title")).toBeFocused();
  const romanus = page.getByRole("link", { name: "Romanus: the voice they could not silence", exact: true });
  const box = await romanus.boundingBox();
  expect(box?.height).toBeGreaterThan(44);
  await romanus.click({ position: { x: 10, y: 10 } });
  await expect(page).toHaveURL(/\/human-story\/romanus\/$/);
  for (const route of ["/", "/human-story/worlds/saints/"]) {
    await page.setViewportSize({ width: 820, height: 900 });
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.route("**/media/**/*.webp", route => route.abort());
  await page.goto("/#encounters");
  await expect(page.locator("#encounters").getByRole("status")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Meet Romanus", exact: true })).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const noJS = await context.newPage();
  await noJS.goto(`${baseURL}/`);
  await noJS.getByRole("link", { name: "Meet Perpetua & Romanus", exact: true }).click();
  await noJS.getByRole("link", { name: "Meet Romanus", exact: true }).click();
  await expect(noJS.getByRole("heading", { name: "Romanus", exact: true })).toBeVisible();
  await context.close();
});
