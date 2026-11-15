import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import original from "../src/content/pliny-record.json";
import additional from "../src/content/pliny-v3-record.json";
import { PLINY_V3_EXCERPTS, PLINY_V3_PROSE } from "../src/content/pliny-v3";

test("a sentence can be kept, brought into the later account, and put down without losing the reading", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => errors.push(request.url()));
  await page.goto("/human-story/pliny/");
  await expect(page).toHaveTitle(/A kind of commonwealth/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("A kind of commonwealth");
  await expect(page.getByText(/Pliny the Younger, Roman governor of Bithynia-Pontus/)).toBeVisible();
  await expect(page.getByRole("navigation", { name: "The five movements" })).toHaveCount(0);
  const keep = page.getByRole("button", { name: "Keep this sentence", exact: true });
  await keep.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Sentence kept", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-encounter="pliny"]')).toHaveAttribute("data-kept", "true");
  await page.locator("header").getByRole("link", { name: "First letter kept" }).click();
  await expect(page).toHaveURL(/#pliny-comparison$/);
  await expect(page.locator("#pliny-comparison")).toBeFocused();
  await expect(page.locator('#pliny-comparison [data-passage="commands"] blockquote')).toHaveText(PLINY_V3_EXCERPTS.commands.text);
  await expect(page.locator('[data-passage="women"] blockquote')).toHaveText(PLINY_V3_EXCERPTS.women.text);
  await expect(page.locator('[data-passage="women"] blockquote')).toBeInViewport({ ratio: 1 });
  await expect(page.locator('#pliny-comparison [data-passage="commands"] blockquote')).toBeInViewport({ ratio: 1 });
  await expect(page.locator('aside[aria-label="Kept sentence from the letter to Paternus"]')).toBeHidden();
  await page.locator("#pliny-comparison").getByRole("button", { name: "Put the sentence down" }).click();
  await expect(page.locator('[data-encounter="pliny"]')).toHaveAttribute("data-kept", "false");
  await expect(page.locator("header").getByRole("link", { name: "Sources", exact: true })).toBeFocused();
  await page.locator('[data-passage="pardon"] figcaption a').click();
  await expect(page.locator("#pliny-text-trajan > p")).toHaveText(original.letters.trajan);
  await expect(page.locator("details").filter({ has: page.locator("#pliny-text-trajan") })).toHaveAttribute("open", "");
  await expect(page.locator('[data-prose="reply"]')).toHaveText(PLINY_V3_PROSE.reply.text);
  await expect(page.locator('[data-prose="pardon"]')).toHaveText(PLINY_V3_PROSE.pardon.text);
  await page.locator('[data-passage="commands"] figcaption a').first().click();
  await expect(page.locator("#pliny-text-household > p").first()).toHaveText(additional.letters.household);
  expect(errors).toEqual([]);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("reduced motion, enlarged text, keyboard focus and narrow reading preserve the source relationship", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/human-story/pliny/");
  await page.getByRole("button", { name: "Keep this sentence", exact: true }).click();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("header").getByRole("link", { name: "First letter kept" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
    expect(await page.locator('[data-encounter="pliny"]').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(page.locator("#pliny-comparison")).toBeFocused();
    const target = await page.locator("#pliny-comparison").boundingBox();
    const header = await page.locator("header").boundingBox();
    expect(target && header && target.y >= header.y + header.height, "focus below persistent header").toBe(true);
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.locator("header").getByRole("link", { name: "First letter kept" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "200% text at 320px").toBe(true);
  const bodySize = await page.locator('[data-prose="women"]').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(bodySize).toBeGreaterThanOrEqual(40);
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator('[data-encounter="pliny"]')).toHaveAttribute("data-motion", "off");
});

test("the complete narrative, local letters and comparison work without JavaScript or artwork", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route(/\/media\/pliny-v3\/.*\.webp/, route => route.abort());
    await page.goto(baseURL + "/human-story/pliny/#pliny-comparison");
    await expect(page.locator("#pliny-comparison")).toBeVisible();
    await expect(page.locator('#pliny-comparison [data-passage="commands"] blockquote')).toHaveText(PLINY_V3_EXCERPTS.commands.text);
    for (const [id, paragraph] of Object.entries(PLINY_V3_PROSE).filter(([id]) => id !== "reception")) {
      await expect(page.locator('[data-prose="' + id + '"]')).toHaveText(paragraph.text);
    }
    await expect(page.getByRole("button")).toHaveCount(0);
    await page.locator('[data-passage="pardon"] figcaption a').click();
    await expect(page.locator("#pliny-text-trajan > p")).toHaveText(original.letters.trajan);
    await page.getByText("Pliny to Paternus · complete 8.16", { exact: true }).click();
    await expect(page.locator("#pliny-text-household > p").first()).toHaveText(additional.letters.household);
    await page.getByText("Pliny and Trajan · complete 10.33–34", { exact: true }).click();
    await expect(page.locator("#pliny-text-fire > p")).toHaveText(additional.letters.fire);
    await expect(page.locator("#pliny-text-association > p")).toHaveText(additional.letters.association);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});

test("legacy fragments, source disclosures and no-index review boundaries remain intact", async ({ page }) => {
  for (const id of ["procedure", "practice", "reply", "source-pliny-letters", "source-pliny-melmoth"]) {
    await page.goto("/human-story/pliny/#" + id);
    await expect(page.locator("#" + id)).toBeAttached();
    expect(await page.locator("#" + id).evaluate(element => !element.closest("details") || element.closest("details")?.open)).toBe(true);
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const evidence = page.locator("details").filter({ has: page.getByText("Sources, translation and interpretive limits", { exact: true }) });
  if (await evidence.getAttribute("open") === null) await evidence.locator(":scope > summary").click();
  await expect(page.locator('[data-prose="reception"]')).toHaveText(PLINY_V3_PROSE.reception.text);
  await expect(page.getByText(/AI-authored historical and literary draft/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Artwork provenance and generation record" })).toHaveAttribute("href", "/media/pliny-v3/manifest.json");
});
