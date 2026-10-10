import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("recognition leads to Scripture and curiosity before optional research", async ({ page }, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  const cancelledProbes: string[] = [];
  page.on("requestfailed", request => {
    const message = `${request.method()} ${request.url()}: ${request.failure()?.errorText}`;
    // Next cancels document/HEAD prefetch probes when the reader leaves home.
    if (request.failure()?.errorText === "net::ERR_ABORTED" && (request.isNavigationRequest() || request.method() === "HEAD")) cancelledProbes.push(message);
    else failures.push(message);
  });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Jonah: The Man Who Ran" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Which question stays with you?" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("home-recognition.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).include(".bm-home").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "Enter the story" }).click();
  await expect(page.locator("#jonah-1-calling-heading")).toBeFocused();
  await expect(page.locator("[data-scene='jonah-1-calling']")).toBeVisible();
  await expect(page.locator(".story-first-orientation")).toHaveCount(0);
  await expect(page.locator("[data-scene='jonah-1-calling'] .story-question")).toHaveCount(0);
  expect((await new AxeBuilder({ page }).include(".story-root").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await expect(page.locator("[data-scene='jonah-1-calling'] [data-verse]")).toHaveCount(2);
  await page.screenshot({ path: testInfo.outputPath("jonah-calling.png"), fullPage: true });
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page.locator("[data-scene='jonah-1-escape'] [data-verse='3']")).toBeVisible();
  await expect(page.locator(".story-first-perspectives")).toBeVisible();
  await expect(page.locator(".story-curiosity")).toHaveText("But what was Jonah really running from?");
  const verse = await page.locator("[data-scene='jonah-1-escape'] .story-verses").boundingBox();
  const question = await page.locator(".story-curiosity").boundingBox();
  expect(verse && question && question.y >= verse.y + verse.height).toBeTruthy();
  expect((await new AxeBuilder({ page }).include(".story-root").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("jonah-escape.png"), fullPage: true });
  await expect(page.getByText("Pascal examines")).not.toBeVisible();
  await page.getByText("Why do people run?", { exact: false }).click();
  for (const name of ["Blaise Pascal", "Friedrich Nietzsche", "Augustine of Hippo"]) {
    await expect(page.locator(".story-first-perspectives").getByRole("heading", { name: new RegExp(name) })).toBeVisible();
  }
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page.locator("[data-scene='jonah-1-storm-wind'] .story-question")).toHaveCount(0);
  await expect(page.locator("[data-reference='1:4']")).toBeVisible();
  expect(await page.locator("[data-scene='jonah-1-storm-wind']").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.screenshot({ path: testInfo.outputPath("jonah-storm.png"), fullPage: true });
  await testInfo.attach("cancelled-probes", { body: JSON.stringify(cancelledProbes), contentType: "application/json" });
  expect(failures).toEqual([]);
});

test("first encounter remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/jonah/`);
  await expect(page.getByText("Sometimes, leaving feels easier.")).toBeVisible();
  await expect(page.locator(".story-curiosity")).toHaveText("But what was Jonah really running from?");
  await expect(page.locator("[data-verse]")).toHaveCount(48);
  await context.close();
});
