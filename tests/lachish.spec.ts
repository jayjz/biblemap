import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Lachish: enter the city, inspect a real relief and return from its spatial interpretation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const failed: string[] = [];
  page.on("requestfailed", request => failed.push(request.url()));
  await page.goto("/lachish/");
  await expect(page).toHaveTitle("Lachish: Before the Walls Fell | BibleMap");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Before the walls fell");
  await page.getByRole("link", { name: "Enter the city" }).click();
  await expect(page).toHaveURL(/#before-the-siege$/);
  await expect(page.locator("#before-the-siege")).toContainText("ordinary inhabitant");
  await page.getByRole("link", { name: "Examine the relief", exact: true }).click();
  const explorer = page.locator(".relief-explorer");
  await expect(explorer).toHaveAttribute("data-enhanced", "true");
  await explorer.locator(".relief-stage").scrollIntoViewIfNeeded();
  await expect(explorer.locator(".relief-photo img")).toHaveJSProperty("complete", true);
  expect(await explorer.locator(".relief-photo img").evaluate(image => image instanceof HTMLImageElement && image.naturalWidth > 0)).toBe(true);
  await explorer.getByRole("button", { name: "Examine the siege engine in the relief" }).click();
  await expect(explorer.locator(".relief-observation")).toContainText("projecting beam");
  await explorer.getByRole("button", { name: "Enlarge selected detail" }).click();
  await expect(explorer.locator(".relief-photo")).toHaveClass(/is-zoomed/);
  await explorer.getByRole("button", { name: "Open the spatial interpretation" }).click();
  await expect(explorer).toHaveAttribute("data-evidence-view", "landscape");
  await expect(page).toHaveURL(/detail=engine&evidence=landscape#the-walls$/);
  await expect(explorer.getByRole("img", { name: "How a ramp changes a siege" })).toBeVisible();
  await expect(explorer.getByRole("img", { name: "How a ramp changes a siege" })).toBeInViewport({ ratio: 0.5 });
  await expect(explorer.locator(".relief-observation")).toContainText("not recovered here");
  await explorer.getByRole("button", { name: "Compare the surviving ramp" }).click();
  await expect(explorer).toHaveAttribute("data-evidence-view", "site");
  await expect(explorer.locator(".relief-site img")).toBeVisible();
  await explorer.getByRole("button", { name: "Return to the original relief" }).click();
  await expect(explorer).toHaveAttribute("data-evidence-view", "artifact");
  await page.goBack();
  await expect(explorer).toHaveAttribute("data-evidence-view", "site");
  await page.reload();
  await expect(explorer).toHaveAttribute("data-evidence-view", "site");
  await expect(page.locator("body")).not.toContainText("Application error");
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test("Lachish: keyboard, reduced motion, source links and mobile layout", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lachish/?detail=defense&evidence=landscape#the-walls");
  const explorer = page.locator(".relief-explorer");
  await expect(explorer).toHaveAttribute("data-evidence-view", "landscape");
  const button = explorer.getByRole("button", { name: "The relief", exact: true });
  await button.focus(); await page.keyboard.press("Enter");
  await expect(explorer).toHaveAttribute("data-evidence-view", "artifact");
  const engine = explorer.locator(".relief-features").getByRole("button", { name: "02 The siege engine" });
  await engine.focus(); await page.keyboard.press("Space");
  await expect(engine).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".relief-photo").evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator("a[href='#source-bm-siege']").first().evaluate(element => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) if (parent instanceof HTMLDetailsElement) parent.open = true;
  });
  await page.locator("a[href='#source-bm-siege']").first().click();
  await expect(page.locator("#source-bm-siege")).toHaveAttribute("open", "");
  await expect(page.locator("#source-bm-siege")).toContainText("700–692 BC");
  const axe = await new AxeBuilder({ page }).include(".lachish").analyze();
  expect(axe.violations).toEqual([]);
  await page.goto("/lachish/");
  await page.locator(".lachish-city").waitFor();
  await expect(page.locator(".lachish-city")).toHaveJSProperty("complete", true);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `/tmp/lachish-${testInfo.project.name}-opening.png` });
  await page.locator("#the-walls").scrollIntoViewIfNeeded();
  await page.locator(".relief-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".relief-photo img")).toHaveJSProperty("complete", true);
  await page.screenshot({ path: `/tmp/lachish-${testInfo.project.name}-relief.png` });
});

test("Lachish: no-JavaScript encounter preserves all movements, evidence and complete passages", async ({ browser, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: viewport ?? { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto("/lachish/");
  await expect(page.getByRole("heading", { name: "Before it was a conquest, it was a city." })).toBeVisible();
  expect(await page.locator(".lachish-verses p").count()).toBe(167);
  await page.locator("#passage-2ki19 > summary").click();
  await expect(page.locator('[id="2ki19-v37"]')).toBeVisible();
  await expect(page.locator(".relief-static")).toContainText("The siege engine");
  await expect(page.locator("#jerusalem")).toContainText("The silver totals differ");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("Lachish: missing media keeps the narrative and evidence usable", async ({ page }) => {
  await page.route("**/media/lachish/siege-*.webp", route => route.abort());
  await page.goto("/lachish/#the-walls");
  await page.locator(".relief-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".relief-artifact-view .lachish-media-fallback")).toBeVisible();
  await expect(page.locator("#the-walls")).toContainText("The things left in the ground");
  await page.getByRole("button", { name: "Spatial interpretation", exact: true }).click();
  await expect(page.getByRole("img", { name: "How a ramp changes a siege" }).first()).toBeVisible();
});

test("Lachish: narrow-screen details stay reachable and enlargement does not cover a hotspot", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/lachish/#the-walls");
  const explorer = page.locator(".relief-explorer");
  await expect(explorer).toHaveAttribute("data-enhanced", "true");
  const zoom = explorer.getByRole("button", { name: "Enlarge selected detail" });
  for (const name of ["ramp", "siege engine", "defenses"]) {
    const hotspot = explorer.getByRole("button", { name: `Examine the ${name} in the relief` });
    await hotspot.scrollIntoViewIfNeeded();
    await hotspot.click();
    await expect(hotspot).toHaveAttribute("aria-pressed", "true");
    const overlaps = await hotspot.evaluate((element) => {
      const other = document.querySelector(".relief-zoom");
      if (!other) throw new Error("Enlargement control missing");
      const a = element.getBoundingClientRect(), b = other.getBoundingClientRect();
      return Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top);
    });
    expect(overlaps).toBe(false);
    await zoom.focus(); await page.keyboard.press("Enter");
    await expect(explorer.locator(".relief-hotspot:visible")).toHaveCount(1);
    expect(await hotspot.evaluate(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))).toEqual({ width: 44, height: 44 });
    await expect(explorer.locator(".relief-photo img")).toHaveAttribute("sizes", "1440px");
    const whole = explorer.getByRole("button", { name: "Show whole panel" });
    await expect(whole).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(explorer.locator(".relief-hotspot:visible")).toHaveCount(3);
  }
  await explorer.getByRole("button", { name: "Open the spatial interpretation" }).click();
  await explorer.getByRole("button", { name: "Compare the surviving ramp" }).click();
  await expect(explorer.locator(".relief-observation h3")).toHaveText("The excavated ramp");
  await expect(explorer.locator(".relief-view-heading")).toContainText("Excavated remains");
  // Choosing the current view must not insert a duplicate browser-history entry.
  await explorer.getByRole("button", { name: "The surviving site", exact: true }).click();
  await page.goBack();
  await expect(explorer).toHaveAttribute("data-evidence-view", "landscape");
  await page.goForward();
  await expect(explorer).toHaveAttribute("data-evidence-view", "site");
});

test("Lachish: household evidence leads into displacement and preserves the whole photograph", async ({ page }) => {
  await page.goto("/lachish/#before-the-siege");
  await expect(page.locator(".lachish-household-record")).toContainText("six-room dwelling");
  await page.locator("#before-the-siege .claim-notes > summary").click();
  await page.locator("#before-the-siege a[href='#source-fourth-expedition']").first().click();
  await expect(page.locator("#source-fourth-expedition")).toHaveAttribute("open", "");
  await expect(page.locator("#source-fourth-expedition")).toContainText("p. 448");
  await page.goto("/lachish/#the-fall");
  const photograph = page.locator(".lachish-whole-photograph");
  await photograph.locator("summary").click();
  await expect(photograph.getByRole("img")).toBeVisible();
  await expect(photograph.getByRole("img")).toHaveJSProperty("complete", true);
  await expect(page.locator(".lachish-look")).toContainText("cannot identify the same household");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
