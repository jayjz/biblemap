import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import { readFileSync, readdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import catalog from "../docs/research/jonah-asset-candidates.json";

test("static export excludes held reproductions and local review routes", () => {
  const exported = readdirSync("out", { recursive: true }).map(String);
  for (const file of catalog.acquiredFiles) {
    const candidate = catalog.assets.find(asset => asset.id === file.matchedCandidateId);
    if (candidate?.productionReviewStatus !== "approved") expect(exported.some(path => path.endsWith(file.filename))).toBe(false);
  }
  expect(exported.some(path => /review-assets|jonah-review|publication-hold/.test(path))).toBe(false);
});

let bundle = "";
test.beforeAll(async () => {
  const result = await build({ entryPoints: ["tests/media-harness.tsx"], bundle: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
  bundle = result.outputFiles[0].text;
});

test("media failure preserves fallback; audio requires action and pauses on scene exit", async ({ page }) => {
  // Ten seconds of PCM silence; no external audio or rights assumptions.
  const wav = Buffer.alloc(44 + 8000 * 2 * 10);
  wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write("data", 36); wav.writeUInt32LE(wav.length - 44, 40);
  await page.route("**/media/test-silence.wav", route => route.fulfill({ contentType: "audio/wav", body: wav }));
  await page.route("**/media/test-missing.jpg", route => route.fulfill({ status: 404 }));
  await page.route("**/test-only-media-harness", route => route.fulfill({ contentType: "text/html", body: '<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="test-root"></div></body></html>' }));
  await page.goto("/test-only-media-harness");
  await page.addScriptTag({ content: bundle });
  await expect(page.getByText("Artwork unavailable. The passage remains readable.")).toBeVisible();
  expect(await page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.getByRole("button", { name: "Play narration", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause narration", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mute narration" }).click();
  expect(await page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);
  await page.getByRole("button", { name: "Pause narration", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play narration", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Replay narration" }).click();
  await expect(page.getByRole("button", { name: "Pause narration", exact: true })).toBeVisible();
  const audio = await page.locator("audio").elementHandle();
  await page.getByRole("button", { name: "Leave scene" }).click();
  expect(await audio?.evaluate((element: HTMLAudioElement) => element.paused)).toBe(true);
});

test("rejected playback remains recoverable without synthesis", async ({ page }) => {
  await page.route("**/test-only-media-harness", route => route.fulfill({ contentType: "text/html", body: '<html><body><div id="test-root"></div></body></html>' }));
  await page.route("**/media/test-missing.jpg", route => route.fulfill({ status: 404 }));
  await page.goto("/test-only-media-harness");
  await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Test autoplay denial", "NotAllowedError")); });
  await page.addScriptTag({ content: bundle });
  await page.getByRole("button", { name: "Play narration", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Audio unavailable");
  await page.getByText("Narration transcript", { exact: true }).click();
  await expect(page.getByText("Test transcript", { exact: true }).filter({ visible: true })).toBeVisible();
});

test("unapproved media makes no image request; approved fixture preserves composition and provenance after failure", async ({ page }, testInfo) => {
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url()));
  await page.route("**/test-only-media-harness", route => route.fulfill({ contentType: "text/html", body: '<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="test-root"></div></body></html>' }));
  await page.route("**/media/test-missing.jpg", route => route.fulfill({ status: 404 }));
  await page.route("**/media/test-reviewed-portrait.jpg", route => route.fulfill({ contentType: "image/jpeg", body: readFileSync("artifacts/jonah-image-review/nga-raphael-hosea-jonah.jpeg") }));
  await page.goto("/test-only-media-harness");
  const cssDir = "out/_next/static/css";
  await page.addStyleTag({ content: readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(`${cssDir}/${file}`, "utf8")).join("\n") });
  await page.addScriptTag({ content: bundle });
  await expect(page.getByText("Artwork unavailable. The passage remains readable.")).toBeVisible();
  await expect(page.getByTestId("unapproved-art").locator("img")).toHaveCount(0);
  await page.getByRole("button", { name: "Show test-approved portrait" }).click();
  const portrait = page.locator(".story-artwork img");
  await portrait.scrollIntoViewIfNeeded();
  await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(611);
  expect(await portrait.evaluate(img => getComputedStyle(img).objectFit)).toBe("contain");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByText("About this artwork & rights", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "The Prophets Hosea and Jonah" })).toBeVisible();
  await expect(page.locator(".story-artwork")).toContainText("National Gallery of Art");
  await expect(page.locator(".story-artwork")).toContainText("not archaeological evidence");
  const accessibility = await new AxeBuilder({ page }).include(".story-artwork").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("test-only-portrait-provenance.png"), fullPage: true });
  expect(requests.some(url => url.includes("test-unapproved.jpg"))).toBe(false);
});
