import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Romanus introduces the person and provides the complete source-separated journey", async ({ page }) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => failed.push(request.url()));
  page.on("response", response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.goto("/human-story/romanus/");
  await expect(page).toHaveTitle(/Romanus/);
  await expect(page.getByRole("heading", { name: "Romanus", exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to the story" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#romanus-main")).toBeFocused();
  await expect(page.locator("header").filter({ has: page.locator("h1") })).toContainText("Christian deacon");
  await page.getByRole("link", { name: "Begin with the person" }).click();
  await expect(page.locator("#romanus-world")).toBeFocused();
  for (const id of ["world", "refusal", "wound", "accounts", "memory"]) {
    await expect(page.locator(`#romanus-${id}`)).toBeAttached();
  }
  await page.getByRole("navigation", { name: "Movements in Romanus’s story" }).getByRole("link", { name: "The surviving voices" }).click();
  await expect(page.locator("#romanus-accounts")).toBeFocused();
  const short = page.locator('[class*="shortLeaf"]');
  await expect(short).toContainText("No further speech is reported");
  await expect(short).toContainText("neither narrates a miracle nor disproves one");
  for (const name of ["Open the longer Syriac account", "Open the preacher’s remembrance", "Open the poet’s invocation"]) {
    const summary = page.getByText(name, { exact: true });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(summary.locator("..")).toHaveAttribute("open", "");
    await expect(short).toBeAttached();
  }
  await expect(page.locator("#romanus-leaf-syriac")).toContainText("not an independent witness");
  await expect(page.locator("#romanus-leaf-chrysostom")).toContainText("not a directly inspected complete translation");
  await expect(page.locator("#romanus-leaf-prudentius")).toContainText("not a transcript");
  await page.getByRole("link", { name: "Source: Syriac text", exact: true }).click();
  await expect(page.locator("#romanus-research")).toHaveAttribute("open", "");
  await page.locator("#source-romanus-syriac > summary").click();
  await expect(page.locator("#source-romanus-syriac")).toContainText("not a separate eyewitness");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test("the story and its source comparison work without JavaScript at 320px", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 760 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/human-story/romanus/#romanus-accounts");
  await page.getByText("Open the longer Syriac account", { exact: true }).click();
  await expect(page.locator("#romanus-leaf-syriac")).toContainText("Romanus speaks through God");
  await page.getByRole("navigation").getByRole("link", { name: "Death and memory" }).click();
  await expect(page.locator("#romanus-memory")).toContainText("strangled");
  await expect(page.locator("#romanus-memory")).toContainText("how much of what survives is theirs");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Simple reading", exact: true }).click();
  await expect(page).toHaveURL(/romanus\/reading\/$/);
  await expect(page.getByRole("heading", { name: "His life ends in prison." })).toBeVisible();
  await page.getByText("Open the poet’s invocation", { exact: true }).click();
  await expect(page.locator("#romanus-leaf-prudentius")).toContainText("literary composition");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("reduced motion and missing artwork preserve the narrative, controls and ending", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/media/romanus/*.webp", route => route.abort());
  await page.goto("/human-story/romanus/#romanus-world");
  await expect(page.getByRole("status")).toContainText("The mosaic could not load");
  await expect(page.locator("#romanus-world")).toContainText("Neither account gives us a childhood");
  await page.getByRole("navigation").getByRole("link", { name: "Death and memory" }).click();
  await expect(page.locator("#romanus-memory")).toBeFocused();
  await expect(page.getByText("Read by us.", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the Saints collection gives Romanus a discoverable entrance", async ({ page }) => {
  await page.goto("/human-story/worlds/saints/");
  await page.getByRole("link", { name: /Romanus: the voice they could not silence/ }).click();
  await expect(page).toHaveURL(/\/human-story\/romanus\/$/);
});
