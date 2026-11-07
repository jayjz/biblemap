import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HUMAN_GRAPH } from "../src/content/human-story";
import { HUMAN_PATHS } from "../src/content/human-story-paths";

test("all static reading rooms and paths load with provenance, local links and no page errors", async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  const failed: string[] = [];
  const hrefs = new Set<string>();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (item) =>
    failed.push(`${item.url()}: ${item.failure()?.errorText}`),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    ...HUMAN_GRAPH.entries.map((entry) => `/human-story/${entry.id}/`),
    ...HUMAN_PATHS.map((item) => `/human-story/paths/${item.id}/`),
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      ))
      hrefs.add(href.split("#")[0]);
    expect(
      await page
        .locator("main")
        .evaluate(
          (main) =>
            main
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length,
        ),
    ).toBe(0);
  }
  for (const href of hrefs)
    expect((await request.get(href)).status(), href).toBe(200);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test("five world destinations remain accessible and fit narrow and enlarged text layouts", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const world of ["stories", "witnesses", "saints", "atlas", "voices"]) {
    await page.goto(`/human-story/worlds/${world}/`);
    await page.setViewportSize({ width: 320, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      world,
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations, world).toEqual([]);
    await page.setViewportSize({ width: 820, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${world} at 200% text`,
    ).toBe(true);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
  }
});

test("keyboard selection exposes its connections, keeps focus visible and returns to a real card", async ({
  page,
}) => {
  await page.goto("/human-story/#discover");
  const search = page.getByRole("searchbox", {
    name: "Find a person, passage or place",
  });
  await search.fill("missing-reader-9381");
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(search).toBeFocused();
  const select = page.getByRole("button", {
    name: "Show connections for Augustine: a life reread",
  });
  await select.focus();
  await page.keyboard.press("Enter");
  const heading = page.getByRole("heading", {
    name: "Connected to Augustine: a life reread",
  });
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  expect(
    await heading.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  expect(
    await heading.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page
    .getByRole("link", { name: "Return to the selected reading" })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#reading-augustine")).toBeFocused();
  await page
    .getByRole("combobox", { name: "Explore a world" })
    .selectOption("witnesses");
  const returnHref = await page
    .getByRole("link", { name: "Return to the selected reading" })
    .getAttribute("href");
  expect(returnHref).toBeTruthy();
  await expect(page.locator(returnHref ?? "#missing")).toBeAttached();
});

test("no-JS exploration includes all readings, sources, artwork and authored paths", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/`);
  for (const entry of HUMAN_GRAPH.entries)
    await expect(page.locator(`#reading-${entry.id}`)).toBeAttached();
  await page.goto(`${baseURL}/human-story/paths/a-life-in-another-life/`);
  await page
    .locator("#stop-teresa")
    .getByRole("link", { name: "Open the reading & sources" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Teresa");
  await page.locator("#source-teresa-life summary").click();
  await expect(page.getByText(/David Lewis translation/)).toBeVisible();
  await context.close();
});
