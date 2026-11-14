import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { JONAH_LETTERS } from "../src/content/jonah-letters";
import chapter4 from "../src/content/scripture/web-jonah-4.json";
const shade = chapter4.verses.find((verse) => verse.number === 6);
if (!shade) throw new Error("Pinned Jonah 4:6 is missing");
const shadeText = shade.text;

test("a reader changes historical perspective beside unchanged Scripture using the keyboard", async ({ page, baseURL }) => {
  const errors: string[] = [];
  const failed: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => failed.push(request.url()));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL ?? "http://127.0.0.1:4189").origin) external.push(request.url());
  });
  await page.goto("/human-story/jerome/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("One word. A congregation.");
  await expect(page.getByText(/a bishop risks losing his congregation/)).toBeVisible();
  const scripture = page.locator('[data-source="web-jonah"] blockquote');
  await expect(scripture).toHaveText(shadeText);
  const report = page.locator('[data-letter="augustine-report"]');
  const reply = page.locator('[data-letter="jerome-translation"]');
  await expect(report.locator("blockquote")).toHaveText(JONAH_LETTERS[0].quote);
  await expect(reply.locator("blockquote")).toBeHidden();
  await reply.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(reply.locator("summary")).toBeFocused();
  await expect(report.locator("blockquote")).toBeHidden();
  await expect(reply.locator("blockquote")).toHaveText(JONAH_LETTERS[1].quote);
  await expect(scripture).toHaveText(shadeText);
  await reply.getByRole("link", { name: "Inspect this letter’s source" }).click();
  await expect(page.locator("#source-jerome-augustine")).toBeVisible();
  await expect(page.locator("#letters-sources")).toContainText("not independent witnesses");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(external).toEqual([]);
});

test("native reading, source deep links and both letters work with JavaScript disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/human-story/jerome/#jerome-translation`);
    await expect(page.locator("#jerome-translation blockquote")).toHaveText(JONAH_LETTERS[1].quote);
    await page.locator('[data-letter="augustine-report"] summary').click();
    await expect(page.locator("#augustine-report blockquote")).toHaveText(JONAH_LETTERS[0].quote);
    await page.goto(`${baseURL}/human-story/jerome/#source-augustine-jerome`);
    await expect(page.locator("#source-augustine-jerome")).toBeVisible();
    await expect(page.locator("#source-augustine-jerome")).toContainText("public domain");
  } finally { await context.close(); }
});

test("the encounter reflows at 320px and 200% text, preserves motion choices and passes axe", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/human-story/jerome/");
  await page.getByRole("link", { name: "Hear the letters" }).click();
  await expect(page.locator("#letters-exchange")).toBeFocused();
  await page.locator('[data-letter="jerome-translation"] summary').click();
  await expect(page.locator("#jerome-translation")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(await page.locator('[data-encounter="jonah-letters"]').evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test("Jonah's shade offers the exchange and the return keeps the reader in Jonah 4", async ({ page }) => {
  await page.goto("/jonah/#jonah-4-shade");
  await page.getByRole("link", { name: "When the plant’s name changed: Augustine and Jerome" }).click();
  await expect(page).toHaveURL(/\/human-story\/jerome\/$/);
  await page.getByRole("link", { name: "Continue Jonah 4" }).click();
  await expect(page).toHaveURL(/\/jonah\/#jonah-4-shade$/);
});
