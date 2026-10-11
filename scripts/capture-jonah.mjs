// Run against npm run review:jonah after a production build. Evidence stays local.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = new URL(process.env.JONAH_REVIEW_URL ?? "http://127.0.0.1:4190/");
if (!["127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Scene capture requires a loopback review server");
const directory = new URL("../artifacts/jonah-scene-board/", import.meta.url);
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const results = [];
const failures = [];
try {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844], ["narrow", 320, 700]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce", isMobile: name !== "desktop", hasTouch: name !== "desktop" });
    const page = await context.newPage();
    page.on("pageerror", error => failures.push(error.message));
    page.on("requestfailed", request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()}: ${response.url()}`); });
    await page.goto(base.href);
    await page.locator("[data-reader-ready=true]").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: new URL(`${name}-opening.png`, directory).pathname });
    const ids = await page.locator("[data-scene]").evaluateAll(elements => elements.map(element => element.getAttribute("data-scene")));
    assert.equal(ids.length, 13);
    for (const id of ids) {
      await page.evaluate(id => { location.hash = id; }, id);
      const scene = page.locator(`[data-scene="${id}"]`);
      await scene.waitFor({ state: "visible" });
      for (const image of await scene.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(async image => { await image.decode(); });
        assert.equal(await image.evaluate(image => getComputedStyle(image).objectFit), "contain");
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} ${id}: horizontal overflow`);
      const file = `${name}-${id}.png`;
      await scene.screenshot({ path: new URL(file, directory).pathname });
      const violations = (await new AxeBuilder({ page }).include(`[data-scene="${id}"]`).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations;
      assert.deepEqual(violations, [], `${name} ${id}: accessibility violations`);
      results.push({ viewport: name, scene: id, file, accessibilityViolations: violations.length });
    }
    const aquinas = page.locator('[data-scene="jonah-4-anger"] .story-mercy-perspective');
    await page.evaluate(() => { location.hash = "jonah-4-anger"; });
    await aquinas.locator("summary").click();
    await aquinas.screenshot({ path: new URL(`${name}-aquinas-open.png`, directory).pathname });
    await context.close();
  }
  assert.deepEqual(failures, [], "Browser or network failures");
  writeFileSync(new URL("results.json", directory), JSON.stringify({ results, failures }, null, 2));
  writeFileSync(new URL("index.html", directory), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jonah local scene board</title><style>body{background:#131d20;color:#f1eadb;font:16px/1.5 system-ui;margin:2rem}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:2rem}img{width:100%;height:auto}a{color:inherit}figure{margin:0}h2{font-size:16px}</style><h1>Jonah · Local visual evidence</h1><p>Includes unresolved-rights mercy and anger artwork. Keep this board local.</p><section>${results.map(result => `<figure><h2>${result.viewport} · ${result.scene}</h2><a href="${result.file}"><img loading="lazy" src="${result.file}" alt="${result.viewport}: ${result.scene}"></a></figure>`).join("")}</section></html>`);
  console.log(`Captured ${results.length} scenes; no accessibility, overflow, browser or request failures. ${directory.pathname}`);
} finally { await browser.close(); }
