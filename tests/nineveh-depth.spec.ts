import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import chapter4 from "../src/content/scripture/web-jonah-4.json";

const route = "/experiments/nineveh/";

test("discoveries preserve Scripture, view, scroll, focus and history without external requests", async ({ page }, testInfo) => {
  const failures: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
  page.on("requestfailed", request => { if (request.failure()?.errorText !== "net::ERR_ABORTED") failures.push(request.url()); });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:")) external.push(request.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${route}#anger`);
  await expect(page.locator(".nineveh")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Pause motion" }).click();
  for (const [id, name] of [["world", "The world of Nineveh"], ["art", "Jonah through art"], ["voices", "The question across centuries"]]) {
    const opener = page.locator(`#discover-${id}`);
    await opener.scrollIntoViewIfNeeded();
    await opener.focus();
    const scroll = await page.evaluate(() => scrollY);
    const transform = await page.locator(".nineveh-world").evaluate(el => getComputedStyle(el).transform);
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name });
    await expect(dialog).toBeVisible();
    await expect(page.locator("#nineveh-discovery-title")).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`#anger/${id}$`));
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);
    // Native modal focus containment, including wrapping past the final control.
    await dialog.getByRole("button", { name: "Return to Jonah 4:1–4" }).focus();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Return to passage" })).toBeFocused();
    if (id !== "voices") {
      await expect(dialog.locator("img")).toBeVisible();
      await dialog.getByRole("button", { name: "Examine larger" }).click();
      await expect(dialog.getByRole("region", { name: "Enlarged object; scroll to examine" })).toBeVisible();
      await dialog.getByRole("button", { name: "Show whole object" }).click();
      await dialog.getByText("Object, provenance & image rights", { exact: true }).click();
      await expect(dialog).toContainText("not approved for publication");
      await expect(dialog).toContainText(id === "world" ? "CC BY-SA 3.0" : "CC0");
      if (id === "art") {
        await dialog.getByText("Read the moment ahead · Jonah 4:6", { exact: true }).click();
        await expect(dialog.locator('[data-reference="4:6"]')).toHaveText(chapter4.verses[5].text);
      }
    } else {
      await expect(dialog).toContainText("a good Nineveh built up");
      await dialog.getByRole("button", { name: "Pope Francis", exact: true }).click();
      await expect(dialog).toContainText("hardness that does not allow God’s mercy to enter");
      await dialog.getByText("Context, edition & quotation rights").click();
      await expect(dialog).toContainText("not a verbatim transcript");
      await expect(dialog.locator('[data-reference="4:4"]')).toHaveText(chapter4.verses[3].text);
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${id}.png`), fullPage: true });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    await expect(page).toHaveURL(/#anger$/);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    expect(await page.locator(".nineveh-world").evaluate(el => getComputedStyle(el).transform)).toBe(transform);
    await expect(page.locator(".nineveh")).toHaveAttribute("data-paused", "true");
    await expect(page.locator('.nineveh-reading [data-reference="4:2"]')).toHaveText(chapter4.verses[1].text);
    await page.goForward();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Return to passage" }).click();
    await expect(dialog).not.toBeVisible();
  }
  expect(failures).toEqual([]);
  expect(external).toEqual([]);
});

test("shared discovery reloads, direct close preserves beat, 320px reflow and touch", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const id of ["world", "art", "voices"]) {
    await page.goto(`${route}#question/${id}`);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.reload();
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await dialog.getByRole("button", { name: "Return to passage" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator(".nineveh")).toHaveAttribute("data-beat", "question");
    await expect(page.locator('.nineveh-reading [data-reference="4:4"]')).toHaveText(chapter4.verses[3].text);
  }
});

test("discovery entrances leave reconstruction and place labels unobscured", async ({ page }) => {
  await page.goto(`${route}#mercy`);
  const label = page.locator(".nineveh-landscape-caption");
  await expect(label).toBeInViewport();
  const clear = await label.evaluate(element => {
    const labelRect = element.getBoundingClientRect();
    const links = document.querySelector(".nineveh-discoveries")?.getBoundingClientRect();
    return !links || labelRect.right <= links.left || labelRect.left >= links.right || labelRect.bottom <= links.top || labelRect.top >= links.bottom;
  });
  expect(clear).toBe(true);
});

test("missing or restricted photographs retain object description, rights, source and Scripture", async ({ page }, testInfo) => {
  await page.route("**/review-assets/nineveh-depth/**", route => route.fulfill({ status: 403 }));
  for (const id of ["world", "art"]) {
    await page.goto(`${route}#mercy/${id}`);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Object image unavailable", { exact: true })).toBeVisible();
    await expect(dialog.locator("img")).toHaveCount(0);
    await dialog.getByText("Object, provenance & image rights", { exact: true }).click();
    await expect(dialog.getByRole("link", { name: "Image source record" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${id}-restricted.png`), fullPage: true });
    await dialog.getByRole("button", { name: "Return to passage" }).click();
    await expect(page.locator('.nineveh-reading [data-reference="3:10"]')).toBeVisible();
  }
});

test("text view omits image requests and retains all discoveries in either motion preference", async ({ page }) => {
  const images: string[] = [];
  page.on("request", request => { if (request.url().includes("/nineveh-depth/")) images.push(request.url()); });
  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.goto(`${route}#mercy`);
    await page.reload();
    await page.getByRole("button", { name: "Text view", exact: true }).click();
    for (const id of ["world", "art", "voices"]) {
      await page.locator(`#discover-${id}`).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByRole("dialog").locator("img")).toHaveCount(0);
      await page.getByRole("button", { name: "Return to passage" }).click();
      await expect(page.locator(".nineveh")).toHaveAttribute("data-plain", "true");
    }
  }
  expect(images).toEqual([]);
});
