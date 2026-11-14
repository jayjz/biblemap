import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import record from "../src/content/pliny-record.json";

test("the five movements lead to the women, the complete ruling and its limits", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("requestfailed", request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.goto("/human-story/pliny/");
  await expect(page).toHaveTitle(/The names he did not write/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The nameshe didnot write.");
  await expect(page.locator('[data-movement]')).toHaveCount(5);
  await page.getByRole("link", { name: "Open the record" }).click();
  await expect(page).toHaveURL(/#pliny-procedure$/);
  await page.getByRole("link", { name: "III. The two women", exact: true }).click();
  await expect(page.locator("#pliny-women")).toBeFocused();
  await expect(page.locator('#pliny-women [data-passage="women"]')).toContainText("putting two female slaves to the torture");
  await page.locator("#pliny-women summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("ex duabus ancillis, quae ministrae dicebantur", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "IV. The emperor replies", exact: true }).click();
  await expect(page.locator('[data-passage="punishment"]')).toContainText("they must be punished");
  await expect(page.locator('[data-passage="pardon"]')).toContainText("invoking our gods");
  await expect(page.locator('[data-passage="anonymous"]')).toBeVisible();
  // Fragment navigation must reveal source content inside its native details.
  await page.locator('[data-passage="pursuit"] figcaption a').click();
  await expect(page.locator("details").filter({ has: page.locator("#pliny-text-trajan") })).toHaveAttribute("open", "");
  await expect(page.locator("#pliny-text-trajan > p").first()).toHaveText(record.letters.trajan);
  await page.getByRole("link", { name: "Sources", exact: true }).click();
  await page.getByText("Sources, translations & interpretive limits", { exact: true }).click();
  await expect(page.locator("#source-pliny-latin")).toContainText("does not explain these women’s duties");
  expect(errors).toEqual([]);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("motion can be stopped and reduced motion always preserves the whole reading", async ({ page }) => {
  await page.goto("/human-story/pliny/");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of ['[data-passage="persisted"]', '[data-passage="punishment"]']) {
      await page.locator(selector).evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight + 40));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px during motion`).toBe(true);
    }
  }
  await page.getByRole("button", { name: "Motion on", exact: true }).click();
  await expect(page.locator('[data-encounter="pliny"]')).toHaveAttribute("data-motion", "off");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Reduced motion", exact: true })).toBeDisabled();
  await page.getByRole("link", { name: "III. The two women", exact: true }).click();
  expect(await page.locator("#pliny-women").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "200% text reflow").toBe(true);
  await page.keyboard.press("Tab");
  await page.getByRole("link", { name: "III. The two women", exact: true }).click();
  const target = await page.locator("#pliny-women").boundingBox();
  const chrome = await page.getByRole("navigation", { name: "The five movements" }).boundingBox();
  expect(target && chrome && target.y >= chrome.y + chrome.height, "destination remains below sticky controls").toBe(true);
});

test("the complete encounter and evidence remain readable without JavaScript or media", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route(/\.(webp|png|jpe?g|mp3|mp4)(\?|$)/, route => route.abort());
    await page.goto(`${baseURL}/human-story/pliny/`);
    await expect(page.locator('[data-encounter="pliny"]')).toHaveAttribute("data-motion", "off");
    await page.getByRole("link", { name: "III. The two women", exact: true }).click();
    await expect(page.getByRole("heading", { name: /Two women\.\s*Neither named\./ })).toBeVisible();
    await page.locator("#pliny-women summary").click();
    await expect(page.getByText("ex duabus ancillis, quae ministrae dicebantur", { exact: true })).toBeVisible();
    await page.locator('#pliny-women [data-passage="women"] figcaption a').click();
    await expect(page.locator("details").filter({ has: page.locator("#pliny-text-pliny") })).toHaveAttribute("open", "");
    await expect(page.locator("#pliny-text-pliny > p").first()).toHaveText(record.letters.pliny);
    await page.getByText("Read Trajan’s complete reply · 10.97", { exact: true }).click();
    await expect(page.locator("#pliny-text-trajan > p").first()).toHaveText(record.letters.trajan);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: /Motion/ })).toHaveCount(0);
  } finally { await context.close(); }
});
