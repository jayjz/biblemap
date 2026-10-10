import { test, expect } from "@playwright/test";
import { build } from "esbuild";

test("visitor DOM omits slots and written drafts while author workspace retains them", async ({ page }) => {
  // Next's Link normally receives build-time env replacement from its bundler.
  const result = await build({ entryPoints: ["tests/authorship-harness.tsx"], bundle: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"', "process.env": "{}" } });
  await page.route("**/test-only-authorship", route => route.fulfill({ contentType: "text/html", body: '<html lang="en"><body><div id="test-root"></div></body></html>' }));
  await page.goto("/test-only-authorship");
  await page.addScriptTag({ content: result.outputFiles[0].text });
  await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  const reader = page.locator(".story-root");
  expect(await reader.textContent()).not.toMatch(/\[AUTHOR:|Unapproved .* fixture/);
  await expect(page.locator(".story-author-space, .story-placeholder")).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle author workspace" }).click();
  await expect(reader).toContainText("Unapproved narrative fixture");
  await expect(reader).toContainText("Unapproved geography fixture");
  await expect(reader).toContainText("Unapproved reflection fixture");
  await expect(reader).toContainText("Unapproved claim fixture");
  await expect(reader).toContainText("[AUTHOR:");
  await page.getByRole("button", { name: "Toggle author workspace" }).click();
  expect(await reader.textContent()).not.toMatch(/\[AUTHOR:|Unapproved .* fixture/);
});
