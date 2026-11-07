import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HUMAN_GRAPH } from "../src/content/human-story";

test("Thomas has distinct narrative and sayings entrances without an invented graph entry", async ({ page }) => {
  expect(HUMAN_GRAPH.entries.some(entry => entry.id === "thomas")).toBe(false);
  await page.goto("/");
  const invitation = page.locator("#thomas-invitation");
  await expect(invitation).toContainText("separately attributed sayings collection");
  await invitation.getByRole("link", { name: "Enter Thomas’s story", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/thomas\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thomas");
  await expect(page.getByRole("navigation", { name: "Thomas movements" })).toBeVisible();
  await page.goto("/");
  await invitation.getByRole("link", { name: "Explore the sayings & manuscripts", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/thomas\/sayings\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thomas");
  await expect(page.getByText("NHC II,2", { exact: true }).first()).toBeVisible();
});

test("Thomas is a featured searchable reading; existing stories and discovery still work", async ({ page }) => {
  await page.goto("/");
  for (const id of ["jonah", "perpetua", "romanus", "james", "thomas"]) {
    await expect(page.locator(`#discover #reading-${id} h3 a`)).toHaveAttribute("href", `/human-story/${id}/`);
  }
  await expect(page.locator("#reading-thomas button")).toBeHidden();
  await page.getByRole("searchbox").fill("Thomas");
  await expect(page.locator("#reading-thomas")).toBeVisible();
  await page.locator("#reading-thomas h3 a").click();
  await expect(page).toHaveURL(/\/human-story\/thomas\/$/);
  await page.goto("/");
  await page.getByRole("searchbox").fill("no-matching-reading-9814");
  await expect(page.getByRole("heading", { name: "No readings match that search." })).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  const preview = page.getByRole("button", { name: "Show connections for Romanus: the voice they could not silence" });
  await preview.click();
  await expect(page.locator("#connection-preview h3")).toBeFocused();
  await page.getByRole("button", { name: "Close connection preview", exact: true }).click();
  await expect(preview).toBeFocused();
});

test("Thomas reflows at four widths, uses mobile artwork and retains accessible keyboard navigation", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const invitation = page.locator("#thomas-invitation");
    await invitation.scrollIntoViewIfNeeded();
    const image = invitation.locator("img");
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await image.evaluate(element => (element as HTMLImageElement).currentSrc)).toContain(width <= 650 ? "proximity-768.webp" : "proximity-1536.webp");
    for (const name of ["Enter Thomas’s story", "Explore the sayings & manuscripts"]) {
      const action = invitation.getByRole("link", { name, exact: true });
      await action.focus();
      await expect(action).toBeFocused();
      expect(await action.evaluate(element => getComputedStyle(element).outlineWidth)).toBe("3px");
      expect((await action.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
    const primary = invitation.getByRole("link", { name: "Enter Thomas’s story", exact: true });
    await primary.focus();
    await page.keyboard.press("Tab");
    await expect(invitation.getByText("About the AI-generated artwork", { exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(invitation.locator("details")).toHaveAttribute("open", "");
    await expect(invitation).toContainText("no biblical identities or event are reconstructed");
    expect((await new AxeBuilder({ page }).include("#thomas-invitation").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    expect(await invitation.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await invitation.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        const rect = range.getBoundingClientRect();
        if (rect.width && (rect.right > bounds.right + 1 || rect.left < bounds.left - 1)) return false;
      }
      return true;
    })).toBe(true);
  }
});

test("both Thomas entrances work without JavaScript or when scripts fail", async ({ browser, baseURL }) => {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 320, height: 900 } });
    if (javaScriptEnabled) await context.route("**/_next/static/**/*.js", route => route.abort());
    const page = await context.newPage();
    await page.goto(`${baseURL}/`);
    await page.locator("#thomas-invitation").getByRole("link", { name: "Enter Thomas’s story", exact: true }).click();
    await expect(page).toHaveURL(/\/human-story\/thomas\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Thomas");
    await page.goto(`${baseURL}/`);
    await page.locator("#thomas-invitation").getByRole("link", { name: "Explore the sayings & manuscripts", exact: true }).click();
    await expect(page).toHaveURL(/\/human-story\/thomas\/sayings\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Thomas");
    await context.close();
  }
});

test("delayed and missing invitation artwork preserves navigation and layout", async ({ page }) => {
  let releaseImage: (() => void) | undefined;
  const imageGate = new Promise<void>(resolve => { releaseImage = resolve; });
  await page.route("**/media/thomas/proximity-*.webp", async route => { await imageGate; await route.continue(); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const frame = page.locator('#thomas-invitation [data-cinematic-frame="proximity"]');
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute("data-media-state", "loading");
  const before = await frame.boundingBox();
  if (!releaseImage) throw new Error("Missing image gate");
  releaseImage();
  await expect(frame).toHaveAttribute("data-media-state", "loaded");
  expect((await frame.boundingBox())?.height).toBe(before?.height);
  await page.unroute("**/media/thomas/proximity-*.webp");
  await page.route("**/media/thomas/proximity-*.webp", route => route.abort());
  await page.goto("/");
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute("data-media-state", "unavailable");
  await page.locator("#thomas-invitation").getByRole("link", { name: "Enter Thomas’s story", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/thomas\/$/);
});
