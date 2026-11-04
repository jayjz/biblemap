import { chromium } from "@playwright/test";
import { spawn, execFileSync } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { once } from "node:events";

const phase = process.argv[2] ?? "final";
if (!/^[a-z0-9-]+$/.test(phase)) throw new Error("Use a simple evidence phase name");
const root = new URL("../", import.meta.url);
const destination = new URL(`artifacts/perpetua-immersive/${phase}/`, root);
await mkdir(destination, { recursive: true });
const port = 4196;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.platform === "win32" ? "python" : "python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", "out"], { cwd: root, windowsHide: true, stdio: "ignore" });
let browser;
const observations = { phase, sourceHead: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", windowsHide: true }).trim(), views: [] };
observations.buildId = (await readFile(new URL(".next/BUILD_ID", root), "utf8")).trim();
observations.runtimeSourceSha256 = Object.fromEntries(await Promise.all([
  "src/features/human-story/SeparationReading.tsx", "src/features/human-story/separation.module.css",
  "src/features/human-story/PrisonStage.tsx", "src/features/human-story/prison.module.css",
  "src/features/human-story/PerpetuaEncounter.tsx", "src/features/human-story/SourcePassage.tsx",
].map(async path => [path, createHash("sha256").update(await readFile(new URL(path, root))).digest("hex")])));
try {
  let listening = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { const response = await fetch(`${base}/human-story/perpetua/`); if (response.ok) { listening = true; break; } } catch (error) { if (attempt === 59) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!listening) throw new Error("Static server did not start");
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
  for (const [name, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844], ["narrow", 320, 760]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [], failures = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed", request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/human-story/perpetua/`);
    await page.locator('[data-prison-ready="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: new URL(`${name}-entrance.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, "") });
    await page.getByRole("navigation", { name: "Scenes in The Prison" }).getByRole("link", { name: "The separation", exact: true }).click();
    const scene = page.locator('[data-scene="separation"]');
    await scene.locator("h2").waitFor();
    await page.waitForFunction(() => document.activeElement?.id === "title-separation");
    const readingStates = { initial: await scene.boundingBox() };
    await page.screenshot({ path: new URL(`${name}-separation-viewport.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, "") });
    await scene.screenshot({ path: new URL(`${name}-separation.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, "") });
    const turn = scene.locator("[data-earlier-passage] summary");
    if (await turn.count()) {
      await turn.click();
      await scene.screenshot({ path: new URL(`${name}-comparison.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, "") });
    }
    const later = scene.getByRole("button", { name: /^Read the later passage/ });
    if (await later.count()) {
      await later.click();
      await scene.locator("figure[tabindex='-1']").waitFor();
      await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "In the account: Perpetua and her child apart");
      readingStates.refusal = await scene.boundingBox();
      await page.screenshot({ path: new URL(`${name}-refusal-viewport.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, ""), animations: "disabled" });
      await scene.screenshot({ path: new URL(`${name}-refusal.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, ""), animations: "disabled" });
      await scene.getByRole("button", { name: /^Read what she says next/ }).click();
      readingStates.interpretation = await scene.boundingBox();
      await scene.screenshot({ path: new URL(`${name}-interpretation.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, ""), animations: "disabled" });
      await scene.getByRole("button", { name: "Read both complete passages", exact: true }).click();
      await scene.screenshot({ path: new URL(`${name}-complete.png`, destination).pathname.replace(/^\/(?=[A-Z]:)/, ""), animations: "disabled" });
    }
    const sourceAssets = await page.evaluate(() => performance.getEntriesByType("resource").filter(entry => /\.(?:js|css|woff2)(?:\?|$)/.test(entry.name)).map(entry => ({ url: new URL(entry.name).pathname, bytes: entry.decodedBodySize })));
    observations.views.push({ name, width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), readingStates, completeSceneBox: await scene.boundingBox(), sourceAssets, errors, failures });
    await page.close();
  }
  if (process.argv.includes("--references")) {
    const refs = new URL("test-results/perpetua-reference-study/", root);
    await mkdir(refs, { recursive: true });
    for (const [name, url] of [["emergence", "https://emergencemagazine.org/essay/the-serviceberry/"], ["vermeer", "https://www.rijksmuseum.nl/en/stories/themes/vermeer/story/closer-to-johannes-vermeer"]]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        const rejectCookies = page.getByText("No, rather not", { exact: true });
        if (await rejectCookies.isVisible()) await rejectCookies.click();
        await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
        await page.evaluate(() => document.fonts.ready);
        // Let reference-site entrances settle; this is observation, not a test.
        await page.waitForTimeout(1800);
        await page.screenshot({ path: new URL(`${name}.png`, refs).pathname.replace(/^\/(?=[A-Z]:)/, "") });
        await page.evaluate(() => window.scrollBy(0, innerHeight));
        await page.screenshot({ path: new URL(`${name}-reading.png`, refs).pathname.replace(/^\/(?=[A-Z]:)/, "") });
        const typography = await page.locator("h1, main p").evaluateAll(elements => elements.slice(0, 7).map(element => ({ text: element.textContent?.slice(0, 80), family: getComputedStyle(element).fontFamily, size: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight })));
        await writeFile(new URL(`${name}.json`, refs), JSON.stringify({ url: page.url(), typography }, null, 2));
      } catch (error) { await writeFile(new URL(`${name}-unavailable.txt`, refs), String(error)); }
      await page.close();
    }
  }
  await writeFile(new URL("observations.json", destination), JSON.stringify(observations, null, 2) + "\n");
  if (observations.views.some(view => view.overflow || view.errors.length || view.failures.length)) throw new Error("Inspect recorded browser failures");
  console.log(`${phase}: 1440/390/320px captures complete; no overflow, console or network failures.`);
} finally {
  await browser?.close();
  const closed = once(server, "exit");
  server.kill();
  await closed;
}
