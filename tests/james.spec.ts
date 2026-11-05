import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("James is discoverable and the five movements retain source distinctions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => errors.push(request.url()));
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto("/human-story/worlds/saints/");
  await page.getByRole("link", { name: "James: The Brother Who Remained", exact: true }).click();
  await expect(page).toHaveURL(/\/human-story\/james\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.getByRole("link", { name: "Begin with the brother", exact: true }).click();
  await expect(page.locator("#brother")).toBeFocused();
  for (const id of ["brother", "appearance", "jerusalem", "record", "remained"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await page.getByRole("link", { name: "2 The appearance", exact: true }).click();
  await expect(page.locator("#appearance")).toContainText("Then he appeared to James, then to all the apostles,");
  const compare = page.getByRole("button", { name: "Compare surviving witnesses", exact: true });
  await compare.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Josephus", exact: true }).click();
  await expect(dialog).toContainText("No account in the selected passages.");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(compare).toBeFocused();
  await expect(page).toHaveURL(/#appearance$/);
  await page.getByRole("link", { name: "3 Jerusalem", exact: true }).click();
  await compare.click();
  await page.getByRole("button", { name: "Paul", exact: true }).click();
  await expect(dialog).toContainText("Paul does not say that James ordered");
  await page.getByRole("button", { name: "Acts", exact: true }).click();
  await expect(dialog).toContainText("a different James");
  await page.getByRole("button", { name: "Later memory", exact: true }).click();
  await expect(dialog).toContainText("do not equal two independent eyewitnesses");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Return to the story", exact: true }).click();
  await page.getByRole("link", { name: "5 What remained", exact: true }).click();
  await expect(page.locator("#remained")).toContainText("not details supplied by Paul or confirmed by Josephus");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("keyboard-only comparison returns focus and narrative position", async ({ page }) => {
  await page.goto("/human-story/james/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to the story" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#james-main")).toBeFocused();
  const anchor = page.getByRole("link", { name: "4 The record", exact: true });
  await anchor.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#record")).toBeFocused();
  const compare = page.getByRole("button", { name: "Compare surviving witnesses", exact: true });
  await compare.focus();
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Return to the story", exact: true })).toBeFocused();
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Josephus", exact: true })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("dialog")).toContainText("Ananus loses office");
  await page.keyboard.press("Escape");
  await expect(compare).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(3);
});

test("tablet pointer comparison preserves the selected movement and scroll position", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/human-story/james/");
  await page.getByRole("link", { name: "3 Jerusalem", exact: true }).click();
  await expect(page.locator("aside > div > p").first()).toHaveText("Jerusalem");
  const bounds = await page.getByRole("button", { name: "Compare surviving witnesses", exact: true }).boundingBox();
  if (!bounds) throw new Error("Missing comparison control");
  expect(bounds.y).toBeGreaterThan(0);
  expect(bounds.y + bounds.height).toBeLessThan(1000);
  const position = await page.evaluate(() => scrollY);
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page.getByRole("dialog")).toContainText("Your place in the story: Jerusalem");
  await page.getByRole("button", { name: "Acts", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("a different James");
  await page.keyboard.press("Escape");
  expect(Math.abs(await page.evaluate(() => scrollY) - position)).toBeLessThan(3);
});

test("320px no-JS reading preserves every movement and comparison", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto("/human-story/james/");
  await page.getByRole("link", { name: "5 What remained", exact: true }).click();
  await expect(page.locator("#remained")).toContainText("Hegesippus");
  await page.getByText("Compare every witness, movement by movement", { exact: true }).click();
  await page.locator("#james-sources summary").filter({ hasText: /^The appearance$/ }).click();
  await expect(page.locator("#james-sources")).toContainText("No account in the selected passages.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Simple reading", exact: true }).click();
  await expect(page).toHaveURL(/james\/reading\/$/);
  await expect(page.locator("#record")).toContainText("Citizens object");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("reduced motion, unavailable images and enlarged text preserve the reading", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.route(/\.(png|jpg|webp|svg)(\?|$)/, route => route.abort());
  await page.goto("/human-story/james/#jerusalem");
  await expect(page.locator("#jerusalem")).toContainText("remember the poor");
  await page.getByRole("button", { name: "Compare surviving witnesses", exact: true }).click();
  await page.getByRole("button", { name: "Acts", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Your place in the story: Jerusalem");
  await expect(page.getByRole("dialog")).toContainText("James son of Zebedee");
  expect(await page.locator('[class*="actsLeaf"]').last().evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  await page.keyboard.press("Escape");
  await page.addStyleTag({ content: 'p, a, button, summary { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
