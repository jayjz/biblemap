import { test, expect } from "@playwright/test";
import { JONAH } from "../src/content/jonah";
import AxeBuilder from "@axe-core/playwright";

test("complete reader-controlled book, history, malformed links, and keyboard focus", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const network: string[] = [];
  const cancelledNavigations: string[] = [];
  page.on("requestfailed", request => {
    // Chrome cancels document navigation/Next HEAD probes when leaving a page.
    // Record those separately; failures of scripts, CSS, imagery, or data still fail.
    const message = `${request.method()} ${request.url()}: ${request.failure()?.errorText}`;
    if (request.failure()?.errorText === "net::ERR_ABORTED" && (request.isNavigationRequest() || request.method() === "HEAD")) cancelledNavigations.push(message);
    else network.push(message);
  });
  page.on("response", response => { if (response.status() >= 400) network.push(`${response.status()} ${response.url()}`); });
  await page.goto("/");
  await page.getByRole("link", { name: "Enter the story" }).click();
  await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("jonah-entry.png"), fullPage: true });
  const displayed: { reference: string; text: string }[] = [];
  for (const [index, scene] of JONAH.scenes.entries()) {
    const article = page.locator(`[data-scene="${scene.id}"]`);
    await expect(article).toBeVisible();
    if (index < 3) await expect(article.locator(".story-question")).toHaveCount(0);
    else await expect(article.locator(".story-question")).not.toContainText("Provisional");
    displayed.push(...await article.locator("[data-reference]").evaluateAll(elements => elements.map(element => ({
      reference: element.getAttribute("data-reference") ?? "",
      text: Array.from(element.childNodes).filter(node => node.nodeName !== "SUP").map(node => node.textContent).join(""),
    }))));
    await expect(page.locator(".story-scene:visible")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${scene.id}.png`), fullPage: true });
    await article.getByText("Pause with the passage", { exact: false }).click();
    await expect(article.locator(".story-companion[open]")).toContainText(scene.readingGuide?.context ?? "");
    if (index < JONAH.scenes.length - 1) {
      const next = page.getByRole("link", { name: "Continue" });
      await next.focus(); await page.keyboard.press("Enter");
      await expect(page.locator(`#${JONAH.scenes[index + 1].id}-heading`)).toBeFocused();
    }
  }
  expect(displayed).toEqual(JONAH.passages.flatMap(passage => passage.verses.map(verse => ({ reference: `${passage.chapter}:${verse.number}`, text: verse.text }))));
  await expect(page.locator('[data-reference="4:11"]')).toContainText(JONAH.passages.at(-1)?.verses[0].text ?? "");
  await expect(page.getByRole("link", { name: "Return to the stories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the atlas" })).toHaveAttribute("href", "/explore/");
  await page.goBack(); await expect(page.locator("[data-scene=jonah-4-shade]")).toBeVisible();
  await page.goForward(); await expect(page.locator("[data-scene=jonah-4-question]")).toBeVisible();
  await page.getByRole("link", { name: "Return to the stories" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  await page.goto("/jonah/#%E0%A4%A");
  await expect(page.locator("[data-scene=jonah-1-calling]")).toBeVisible();
  await page.goto("/jonah/#jonah-1-escape");
  await page.getByText("Explore the places in this passage", { exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole("img", { name: /Joppa, Tarshish/ })).toBeVisible();
  await expect(page.locator(".story-place-note").filter({ hasText: "Tarshish" })).toContainText("geographic identification is not established");
  await expect(page.locator(".story-root")).not.toContainText("[AUTHOR:");
  await expect(page.locator(".story-placeholder")).toHaveCount(0);
  // A timer crossing the legacy 9-second threshold cannot advance this reader.
  await page.clock.install(); await page.clock.fastForward(60000);
  await expect(page.locator("[data-scene=jonah-1-escape]")).toBeVisible();
  expect(errors).toEqual([]);
  await testInfo.attach("navigation-cancellations", { body: JSON.stringify(cancelledNavigations), contentType: "application/json" });
  expect(network).toEqual([]);
});

test("reflection stays in memory and clears on reload and exit", async ({ page }) => {
  const marker = "private-note-do-not-transmit-9437";
  const requests: string[] = [];
  page.on("request", r => requests.push(`${r.url()} ${r.postData() ?? ""}`));
  await page.goto("/jonah/");
  await page.getByText("Private reflection", { exact: false }).filter({ visible: true }).click();
  await page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true }).fill(marker);
  await page.getByRole("link", { name: "Continue" }).click();
  await page.getByRole("link", { name: "Previous" }).click();
  await expect(page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true })).toHaveValue(marker);
  expect(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, inspector: window.__BIBLEMAP__, url: location.href }))).not.toContain(marker);
  expect(requests.join("\n")).not.toContain(marker);
  await page.getByRole("button", { name: "Clear all reflections" }).filter({ visible: true }).click();
  await expect(page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true })).toHaveValue("");
  await page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true }).fill(marker);
  await page.reload();
  await page.getByText("Private reflection", { exact: false }).filter({ visible: true }).click();
  await expect(page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true })).toHaveValue("");
  await page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true }).fill(marker);
  // Exercise the actual page lifecycle without depending on explorer network services.
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
  await expect(page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true })).toHaveValue("");
  await page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true }).fill(marker);
  await page.getByRole("link", { name: "Exit to map" }).click();
  await expect(page).toHaveURL(/\/?\?explore=1$/);
  await page.goBack();
  await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  const disclosure = page.locator("article:not([hidden]) .story-reflection");
  if (!(await disclosure.getAttribute("open")) && await disclosure.getAttribute("open") !== "") await disclosure.locator("summary").click();
  await expect(page.getByRole("textbox", { name: "Your private notes" }).filter({ visible: true })).toHaveValue("");
});

test("accessible reduced-motion reader with no WebGL or third-party requests", async ({ page }, testInfo) => {
  const external: string[] = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { value: function (this: HTMLCanvasElement, contextId: string, options?: unknown) {
      if (contextId.includes("webgl")) return null;
      return Reflect.apply(original, this, [contextId, options]);
    } });
  });
  await page.route("**/*", route => {
    if (new URL(route.request().url()).hostname !== "127.0.0.1") { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.goto("/jonah/#jonah-1-storm-lots");
  await expect(page.locator("[data-scene=jonah-1-storm-lots]")).toBeVisible();
  await page.getByText("Translation, sources & notes", { exact: true }).filter({ visible: true }).click();
  await page.getByText("Private reflection", { exact: false }).filter({ visible: true }).click();
  expect(await page.locator("[data-scene=jonah-1-storm-lots]").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  expect((await new AxeBuilder({ page }).include(".story-root").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("jonah-320-reduced.png"), fullPage: true });
  // 200% desktop zoom equivalent: halve the CSS viewport dimensions.
  await page.setViewportSize({ width: 720, height: 500 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(external).toEqual([]);
});

test("without JavaScript all 48 verses and anchor navigation remain readable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/jonah/`);
  await expect(page.locator("[data-verse]")).toHaveCount(48);
  await expect(page.locator("[data-verse='17']")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Your private notes", includeHidden: true }).first()).toBeDisabled();
  await page.getByRole("link", { name: "Continue" }).first().click();
  await expect(page).toHaveURL(/#jonah-1-escape$/);
  await context.close();
});
