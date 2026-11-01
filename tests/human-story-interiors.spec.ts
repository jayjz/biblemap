import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("a reader can compare the governor and emperor in place with the keyboard", async ({
  page,
}) => {
  await page.goto("/human-story/worlds/witnesses/");
  const reply = page.getByText("Read Trajan’s reply alongside it", {
    exact: true,
  });
  await expect(page.locator('[data-passage="pliny"]')).toBeVisible();
  await expect(page.locator('[data-passage="trajan"]')).toBeHidden();
  await reply.focus();
  await page.keyboard.press("Enter");
  await expect(reply).toBeFocused();
  await expect(page.locator('[data-passage="trajan"]')).toContainText(
    "they must be punished",
  );
  await expect(page.locator('[data-passage="trajanRepentance"]')).toBeVisible();
  await expect(page).toHaveURL(/\/worlds\/witnesses\/$/);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("the separation holds two source moments together without changing scenes", async ({
  page,
}) => {
  await page.goto("/human-story/perpetua/#perpetua-separation");
  const scene = page.locator('[data-scene="separation"]');
  await expect(scene.locator('[data-passage="childSeparation"]')).toContainText(
    "And even as God willed it",
  );
  await expect(
    scene.locator('[data-interior-art="perpetua-mosaic"]'),
  ).toBeVisible();
  await scene
    .getByText("Hold this beside the earlier passage", { exact: true })
    .click();
  await expect(scene.locator('[data-passage="childEarlier"]')).toBeVisible();
  await expect(page).toHaveURL(/#perpetua-separation$/);
  await expect(
    scene.getByText(
      /The father’s reason for refusing the request is not given/,
    ),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("new comparisons and image sources remain available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/human-story/worlds/witnesses/`);
    await page
      .getByText("Read Trajan’s reply alongside it", { exact: true })
      .click();
    await expect(
      page.locator('[data-passage="trajanRepentance"]'),
    ).toBeVisible();
    await page.goto(`${baseURL}/human-story/augustine/`);
    await page
      .getByText("Compare the words with the painting", { exact: true })
      .click();
    await expect(page.getByText(/Look at the heart in his hand/)).toBeVisible();
    await page
      .getByText("Look closer · image & source", { exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: "Source record", exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("a failed new image preserves the source, caption and reading", async ({
  page,
}) => {
  await page.route("**/media/human-story/augustine-painting.webp", (route) =>
    route.abort(),
  );
  await page.goto("/human-story/augustine/");
  await expect(page.getByRole("status")).toContainText(
    "The image could not load",
  );
  await page
    .getByText("Compare the words with the painting", { exact: true })
    .click();
  await expect(page.locator('[data-passage="augustine"]')).toBeVisible();
  await page.getByText("Look closer · image & source", { exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Source record", exact: true }),
  ).toBeVisible();
});
