import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PRISON_SCENES } from "../src/content/perpetua-encounter";

test("the prison encounter exposes human stakes and the changing source voice", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:"))
      external.push(request.url());
  });
  await page.goto("/human-story/perpetua/");
  await expect(page.locator("[data-prison-ready]")).toHaveAttribute(
    "data-prison-ready",
    "true",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Prison",
  );
  const child = page.locator('[data-scene="child"]');
  await expect(child).toContainText("her nursing child");
  await child.getByRole("button", { name: "Her family", exact: true }).click();
  await expect(
    child.getByRole("button", { name: "Her family", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(child.locator('[aria-live="polite"]')).toContainText(
    "mother and strengthening her brother",
  );
  const scenes = page.getByRole("navigation", { name: "Scenes in The Prison" });
  await scenes
    .getByRole("link", { name: "The separation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "She asks for her child." }),
  ).toBeFocused();
  await expect(page.locator('[data-scene="separation"]')).toContainText(
    "Her father will not give him back",
  );
  await page
    .locator('[data-scene="separation"]')
    .getByText("Inspect this passage", { exact: true })
    .click();
  await expect(
    page.getByText(/does not tell us the child's later life/),
  ).toBeVisible();
  await scenes.getByRole("link", { name: "The vision", exact: true }).click();
  const vision = page.locator('[data-scene="vision"]');
  await expect(vision).toContainText("A vision reported by Perpetua");
  await vision
    .getByRole("button", { name: "What it means to her", exact: true })
    .click();
  await expect(vision.locator('[aria-live="polite"]')).toContainText(
    "not asked to verify a supernatural scene",
  );
  await scenes.getByRole("link", { name: "Felicity", exact: true }).click();
  await expect(page.locator('[data-scene="felicity"]')).toContainText(
    "through the narrator's telling",
  );
  await scenes.getByRole("link", { name: "The ending", exact: true }).click();
  const ending = page.locator('[data-scene="handover"]');
  await expect(ending).toContainText("not Perpetua reporting her own death");
  await expect(
    ending.getByRole("heading", { name: /Whose voice survives/ }),
  ).toBeVisible();
  await page.locator("#source-passion-perpetua summary").click();
  await expect(page.getByText(/Shewring translation/)).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("scene links, history, keyboard relationships and full reading retain control", async ({
  page,
}) => {
  await page.goto("/human-story/perpetua/#perpetua-separation");
  await expect(page.locator('[data-scene="separation"]')).toBeVisible();
  const next = page.getByRole("link", {
    name: "Continue: The vision",
    exact: true,
  });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#perpetua-vision$/);
  await expect(
    page.getByRole("heading", { name: "The account changes register." }),
  ).toBeFocused();
  const meaning = page.getByRole("button", {
    name: "What it means to her",
    exact: true,
  });
  await meaning.focus();
  await page.keyboard.press("Space");
  await expect(meaning).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(page.locator('[data-scene="separation"]')).toBeVisible();
  await page.goForward();
  await expect(page.locator('[data-scene="vision"]')).toBeVisible();
  await page
    .getByRole("link", { name: "Read all six scenes", exact: true })
    .click();
  for (const scene of PRISON_SCENES)
    await expect(page.locator(`[data-scene="${scene.id}"]`)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The complete encounter" }),
  ).toBeFocused();
  for (const [fragment, scene] of [["prison", "child"], ["visions", "vision"], ["felicity", "felicity"]]) {
    await page.goto(`/human-story/perpetua/#${fragment}`);
    await expect(page.locator("[data-prison-ready]")).toHaveAttribute("data-prison-ready", "true");
    await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
  }
  await page.goto("/human-story/perpetua/#perpetua-missing");
  await expect(page.locator('[data-scene="child"]')).toBeVisible();
});

test("every scene supports reduced motion, narrow layouts, enlarged text and accessible controls", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const scene of PRISON_SCENES) {
    await page.goto(`/human-story/perpetua/#perpetua-${scene.id}`);
    await expect(page.locator(`[data-scene="${scene.id}"]`)).toBeVisible();
    await page.setViewportSize({ width: 320, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      scene.id,
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations, scene.id).toEqual([]);
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
    await page.setViewportSize({ width: 820, height: 1000 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${scene.id} at 200% text`,
    ).toBe(true);
  }
});

test("without JavaScript all scenes, people, provenance and onward routes remain available", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/human-story/perpetua/`);
  for (const scene of PRISON_SCENES)
    await expect(page.locator(`[data-scene="${scene.id}"]`)).toBeVisible();
  await page
    .getByRole("navigation", { name: "Scenes in The Prison" })
    .getByRole("link", { name: "Felicity", exact: true })
    .click();
  await page
    .locator('[data-scene="felicity"] details')
    .filter({ has: page.locator("summary", { hasText: /^Felicity$/ }) })
    .locator("summary")
    .click();
  await expect(
    page
      .locator('[data-scene="felicity"] details[open]')
      .getByText(/invented diary or interior monologue/),
  ).toBeVisible();
  await page.locator("#source-passion-perpetua summary").click();
  await expect(page.getByText(/restricts commercial reuse/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Orient to Carthage in the Atlas" }),
  ).toHaveAttribute("href", /lat=36.85306/);
  await page
    .getByRole("link", { name: "Pliny writes to an emperor", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Pliny");
  await context.close();
});

test("a failed script load retains the complete source-bounded reading", async ({
  page,
}) => {
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.goto("/human-story/perpetua/");
  for (const scene of PRISON_SCENES)
    await expect(page.locator(`[data-scene="${scene.id}"]`)).toBeVisible();
  await page
    .locator('[data-scene="child"]')
    .getByText("Inspect this passage", { exact: true })
    .click();
  await expect(
    page.getByText(/We possess the transmitted composite work/),
  ).toBeVisible();
  await expect(
    page
      .getByRole("link", { name: "Read the complete source at Fordham" })
      .first(),
  ).toHaveAttribute(
    "href",
    "https://sourcebooks.web.fordham.edu/source/perpetua.asp",
  );
});
