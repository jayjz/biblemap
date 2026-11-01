import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("human story entrance has five worlds, Scripture access and an accessible reading order", async ({
  page,
}) => {
  await page.goto("/human-story/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The humanstory.",
  );
  await expect(
    page
      .getByRole("navigation", { name: "Explore the five worlds" })
      .getByRole("link"),
  ).toHaveCount(5);
  await expect(
    page.getByRole("link", { name: "Or begin with the book of Jonah" }),
  ).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("human story remains readable without JavaScript and at 320px", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByText("About this exploration", { exact: true }).click();
  await expect(page.getByText(/This no-index design study/)).toBeVisible();
  await page
    .getByRole("link", { name: "Or begin with the book of Jonah" })
    .click();
  await expect(page.locator('[data-reference="1:1"]')).toBeVisible();
  await context.close();
});

test("Scripture rooms retain exact Jonah, disclose source limits and connect into the Atlas", async ({
  page,
}) => {
  await page.goto("/human-story/worlds/stories/");
  await page
    .getByRole("link", { name: "The prophet and the city", exact: true })
    .click();
  await expect(page.locator('[data-entry="jonah"]')).toBeVisible();
  await expect(page.locator("blockquote")).toContainText(
    "Shouldn’t I be concerned",
  );
  await expect(
    page.getByRole("link", {
      name: "Read the complete Jonah · pinned WEB text",
    }),
  ).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  await page
    .getByRole("link", { name: "A city beyond its name", exact: true })
    .click();
  await expect(page.getByText(/This tablet does not name Jonah/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Locate Nineveh in the Atlas" }),
  ).toHaveAttribute("href", /place=nineveh/);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("witnesses distinguish disputed wording, James and scholarly transmission", async ({
  page,
}) => {
  await page.goto("/human-story/worlds/witnesses/");
  await expect(page.getByRole("table")).toBeVisible();
  await page
    .getByRole("row", { name: /The Testimonium/ })
    .getByRole("link")
    .click();
  await expect(
    page.getByText(/How much of its wording belongs to Josephus is disputed/),
  ).toBeVisible();
  await expect(
    page.getByText(
      /the full article requires access beyond its public abstract/,
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "James in Josephus", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Two passages, two problems" }),
  ).toBeVisible();
  await page.goto("/human-story/suetonius/");
  await expect(
    page.getByText(/It does not explicitly identify Jesus/),
  ).toBeVisible();
  await expect(
    page.getByText("Disputed connection", { exact: true }),
  ).toBeVisible();
});

test("saints keep autobiographical voice, editorial framing and legend distinct", async ({
  page,
}) => {
  await page.goto("/human-story/perpetua/");
  await expect(
    page.getByText(/We possess the transmitted composite work/),
  ).toBeVisible();
  await expect(
    page.getByText(
      /Felicity does not leave a corresponding first-person account/,
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Augustine: a life reread", exact: true })
    .click();
  await page
    .getByRole("link", {
      name: "Teresa: another reader in the garden",
      exact: true,
    })
    .click();
  await expect(page.getByText(/Life 9.8–10 recounts/)).toBeVisible();
  await page.goto("/human-story/francis/");
  await expect(
    page.getByText("Later tradition & legend", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText(/not Francis's own record/)).toBeVisible();
});

test("connected exploration searches, recovers from an empty result and previews relationships", async ({
  page,
}) => {
  await page.goto("/human-story/#discover");
  const search = page.getByRole("searchbox", {
    name: "Find a person, passage or place",
  });
  await search.fill("nothing-matches-9381");
  await expect(
    page.getByRole("heading", { name: "No readings match that search." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await page
    .getByRole("combobox", { name: "Explore a world" })
    .selectOption("saints");
  await page
    .getByRole("button", {
      name: "Show connections for Augustine: a life reread",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Connected to Augustine: a life reread",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("complementary", { name: "Preview connections" })
      .getByRole("link", {
        name: "Teresa: another reader in the garden",
        exact: true,
      }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Explore a world" })
    .selectOption("all");
  await search.fill("Carthage");
  await expect(
    page.locator('[class*="explorerEntry"]').filter({
      has: page.getByRole("heading", {
        name: "Perpetua & Felicity",
        exact: true,
      }),
    }),
  ).toBeVisible();
});

test("authored threads cross worlds and retain historical limits", async ({
  page,
}) => {
  await page.goto("/human-story/paths/a-word-crosses-centuries/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A word crosses centuries",
  );
  await expect(page.getByText(/not a historical itinerary/)).toBeVisible();
  await page
    .getByRole("navigation", { name: "Stops on this reading path" })
    .getByRole("link", { name: "One plant, a world of words" })
    .click();
  await expect(page.locator("#stop-jerome")).toBeInViewport();
  await page
    .locator("#stop-jerome")
    .getByRole("link", { name: "Open the reading & sources" })
    .click();
  await expect(
    page.getByRole("heading", { name: "A translator explains his decision" }),
  ).toBeVisible();
  await page.goto("/human-story/worlds/atlas/");
  await expect(
    page.getByRole("link", { name: "Orient to Carthage" }),
  ).toHaveAttribute("href", /lat=36.85306/);
});

test("rights-cleared media retains a useful fallback and attribution", async ({
  page,
}) => {
  await page.route(
    "**/media/approved/michelangelo-creation-of-adam.jpg",
    (route) => route.abort(),
  );
  await page.goto("/human-story/genesis-in-paint/");
  await page.locator("figure").first().scrollIntoViewIfNeeded();
  await expect(page.getByRole("status")).toContainText(
    "The image could not load.",
  );
  await page
    .getByText("Artwork description, provenance & rights", { exact: true })
    .click();
  await expect(
    page.getByText(/Michelangelo Buonarroti, The Creation of Adam/).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read Genesis 1 · World English Bible" }),
  ).toBeVisible();
});
