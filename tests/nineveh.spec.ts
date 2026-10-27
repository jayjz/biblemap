import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import chapter3 from "../src/content/scripture/web-jonah-3.json";
import chapter4 from "../src/content/scripture/web-jonah-4.json";

const route = "/experiments/nineveh/";
const expected = (chapter: number, first: number, last: number) => (chapter === 3 ? chapter3 : chapter4).verses.filter(v => v.number >= first && v.number <= last).map(v => v.text);

test("four beats keep Nineveh present, exact Scripture, history, sources and reader continuation", async ({ page }, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
  page.on("requestfailed", request => { if (request.failure()?.errorText !== "net::ERR_ABORTED") failures.push(request.url()); });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.locator(".nineveh")).toHaveAttribute("data-ready", "true");
  await expect(page.locator('[data-environment="ready"]')).toBeVisible();
  const city = page.locator(".nineveh-city-mass");
  for (const [id, texts] of [
    ["city", []], ["mercy", expected(3, 10, 10)], ["anger", expected(4, 1, 4)], ["question", expected(4, 4, 4)],
  ] as const) {
    await page.locator(`.nineveh-beats a[href="#${id}"]`).click();
    await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", id);
    await expect(city).toBeInViewport();
    await expect(page.locator(".nineveh-reading > .nineveh-verses [data-reference]")).toHaveText([...texts]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${id}.png`), fullPage: true });
  }
  await page.locator(".nineveh-recall summary").click();
  await expect(page.locator('.nineveh-recall [data-reference="3:10"]')).toHaveText(expected(3, 10, 10)[0]);
  await page.locator(".nineveh-sources summary").click();
  await expect(page.getByRole("link", { name: "Pleiades · Nineveh" })).toHaveAttribute("href", "https://pleiades.stoa.org/places/874621");
  await expect(page.locator(".nineveh-sources")).toContainText("neither an archaeological reconstruction nor Jonah’s viewpoint");
  await page.goBack();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await expect(page.locator("h1")).toBeFocused();
  await page.reload();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await page.getByRole("link", { name: "Stay with the question" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "question");
  await page.getByRole("link", { name: "Continue · Jonah 4:5–11" }).click();
  await expect(page.locator('[data-scene="jonah-4-shade"]')).toBeVisible();
  // SSR intentionally exposes all scenes for no-JS reading. Wait for the reader's
  // existing hydration boundary before resolving its single active Continue link.
  await expect(page.locator('.story-root')).toHaveAttribute('data-reader-ready', 'true');
  await expect(page.locator('.story-scene:visible')).toHaveCount(1);
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await expect(page.locator('[data-reference="4:11"]')).toContainText(chapter4.verses[10].text);
  expect(failures).toEqual([]);
});

test("pause, reduced motion, text view, malformed links and no timed progression", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`${route}#mercy`);
  await expect(page.locator('[data-environment="ready"]')).toBeVisible();
  await page.getByRole("button", { name: "Pause motion" }).click();
  await page.locator('.nineveh-beats a[href="#anger"]').click();
  await expect.poll(() => page.locator(".nineveh-world").evaluate(el => el.getAnimations().map(a => a.playState))).toEqual(["paused"]);
  const transform = await page.locator(".nineveh-world").evaluate(el => getComputedStyle(el).transform);
  await page.clock.install();
  await page.clock.fastForward(60000);
  expect(await page.locator(".nineveh-world").evaluate(el => getComputedStyle(el).transform)).toBe(transform);
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "anger");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator(".nineveh-world").evaluate(el => el.getAnimations().length)).toBe(0);
  await page.getByRole("button", { name: "Text view", exact: true }).click();
  await expect(page.locator(".nineveh-world")).toHaveCount(0);
  await expect(page.locator('.nineveh-reading [data-reference="4:2"]')).toHaveText(chapter4.verses[1].text);
  await page.goto(`${route}#%E0%A4%A`);
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "city");
});

test("landscape loading and rejected chunk keep Scripture and controls available", async ({ page }, testInfo) => {
  const chunks = join(process.cwd(), "out/_next/static/chunks");
  const chunk = readdirSync(chunks).find(name => name.endsWith(".js") && readFileSync(join(chunks, name), "utf8").includes("nineveh-foreground"));
  expect(chunk).toBeTruthy();
  let release: () => void = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  const deliberateFailures: string[] = [];
  page.on("requestfailed", request => deliberateFailures.push(request.url()));
  await page.route(`**/_next/static/chunks/${chunk}`, async intercepted => { await held; await intercepted.abort("failed"); });
  await page.goto(`${route}#mercy`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Preparing the landscape. You can begin reading.")).toBeVisible();
  await expect(page.locator('.nineveh-reading [data-reference="3:10"]')).toHaveText(expected(3, 10, 10)[0]);
  await page.screenshot({ path: testInfo.outputPath("landscape-loading.png"), fullPage: true });
  release();
  await expect(page.getByText(/The landscape is unavailable/)).toBeVisible();
  await page.getByRole("link", { name: "Read Jonah’s response" }).click();
  await expect(page.locator('.nineveh-reading [data-reference="4:2"]')).toHaveText(chapter4.verses[1].text);
  await page.screenshot({ path: testInfo.outputPath("landscape-unavailable.png"), fullPage: true });
  expect(deliberateFailures.every(url => url.endsWith(chunk ?? ""))).toBe(true);
  await testInfo.attach("deliberately-blocked-landscape", { body: JSON.stringify(deliberateFailures), contentType: "application/json" });
});

test("no JavaScript retains complete Scripture and an exit", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: String(testInfo.project.use.baseURL) });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.locator(".nineveh-noscript [data-reference]")).toHaveText([...expected(3, 10, 10), ...expected(4, 1, 4)]);
  await page.locator(".nineveh-noscript a").click();
  await expect(page.locator('[data-scene="jonah-4-shade"]')).toBeVisible();
  await context.close();
});

test("missing image retains reading and explicit fallback", async ({ page }, testInfo) => {
  await page.route("**/review-assets/nineveh-landscape.webp", request => request.abort("failed"));
  await page.goto(`${route}#mercy`);
  await expect(page.getByText(/The landscape is unavailable/)).toBeVisible();
  await expect(page.locator('.nineveh-reading [data-reference="3:10"]')).toHaveText(expected(3, 10, 10)[0]);
  await page.getByRole("link", { name: "Read Jonah’s response" }).click();
  await expect(page.locator('.nineveh-reading [data-reference="4:2"]')).toHaveText(chapter4.verses[1].text);
  await page.screenshot({ path: testInfo.outputPath("image-fallback.png"), fullPage: true });
});

test("narrow viewport, touch and keyboard preserve the city while reading", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${route}#anger`);
  await expect(page.locator('[data-environment="ready"]')).toBeVisible();
  await page.locator('[data-reference="4:3"]').scrollIntoViewIfNeeded();
  await expect(page.locator(".nineveh-city-mass")).toBeInViewport();
  await expect(page.getByRole("button", { name: "Pause motion" })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("narrow-reading.png") });
  const questionLink = page.locator('.nineveh-beats a[href="#question"]');
  if (testInfo.project.name === "mobile") await questionLink.tap();
  else { await questionLink.focus(); await page.keyboard.press("Enter"); }
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "question");
  await page.keyboard.press("Tab");
  await expect(page.locator(".nineveh-recall summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('.nineveh-recall [data-reference="3:10"]')).toBeVisible();
  await page.getByRole("link", { name: "Exit to reader" }).click();
  await expect(page.locator('[data-scene="jonah-4-anger"]')).toBeVisible();
});
