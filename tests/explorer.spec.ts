import { test, expect } from "@playwright/test";

test("explorer baseline: data, filters, epochs, selection, journeys and fallback", async ({ page }, testInfo) => {
  // Existing explorer controls are off-canvas on mobile; baseline this legacy UI on desktop.
  test.skip(testInfo.project.name === "mobile", "Legacy explorer baseline is desktop; Jonah is tested on both sizes.");
  const diagnostics: string[] = [];
  page.on("pageerror", e => diagnostics.push(e.message));
  page.on("requestfailed", r => diagnostics.push(`${r.url()}: ${r.failure()?.errorText}`));
  // Deterministic basemap: tests do not depend on CARTO availability.
  await page.route("https://basemaps.cartocdn.com/**", route => route.fulfill({ json: { version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#101923" } }] } }));
  await page.goto("/#creation");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.ready)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("explorer-baseline.png"), fullPage: true });
  const search = page.getByPlaceholder("Search events (min 2 chars)");
  await search.fill("no-event-with-this-name-9381");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.visibleEventCount)).toBe(0);
  await search.fill("");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.visibleEventCount ?? 0)).toBeGreaterThan(0);
  const book = page.getByRole("combobox", { name: "Filter by book" });
  const option = await book.locator("option").nth(1).getAttribute("value");
  expect(option).toBeTruthy();
  await book.selectOption(option!); await expect(book).toHaveValue(option!);
  await book.selectOption("All");
  await page.getByRole("button", { name: "Exodus & Conquest", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeEpoch)).toBe(1);
  await expect(page).toHaveURL(/#exodus/);
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeEpoch)).toBe(1);
  await page.getByRole("combobox", { name: "Journey Mode" }).selectOption("exodus");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeScene)).toBe("exodus-egypt");
  await page.getByRole("button", { name: "Pause journey" }).click();
  await page.getByRole("button", { name: "Skip to next scene" }).click();
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.activeScene)).toBe("exodus-sea");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close focus mode" }).click();
  await page.goto("/?event=0");
  await expect.poll(() => page.evaluate(() => window.__BIBLEMAP__?.selectedEvent)).toBeTruthy();
  await expect(page.getByRole("dialog")).toBeVisible();
  await testInfo.attach("explorer-diagnostics", { body: diagnostics.join("\n") || "No runtime errors or failed requests.", contentType: "text/plain" });
});
