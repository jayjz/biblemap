// Capture the exported review surface, never a remote deployment.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { chromium } from "@playwright/test";

const phase = process.argv[2] ?? "after";
if (!["before", "after"].includes(phase))
  throw new Error("Use before or after");
const root = resolve("out");
const destination = resolve("artifacts/human-story", phase);
await mkdir(destination, { recursive: true });
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (path === "/review-storyboards/") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(
        await readFile(resolve("docs/storyboards/human-story-narratives.html")),
      );
      return;
    }
    let file = resolve(root, "." + path);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.setHeader(
      "Content-Type",
      types[extname(file)] ?? "application/octet-stream",
    );
    response.end(await readFile(file));
  } catch (error) {
    if (error.code !== "ENOENT") console.error(error);
    response.writeHead(404).end("Not found");
  }
});
await new Promise((resolveListening) =>
  server.listen(4196, "127.0.0.1", resolveListening),
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage();
  const errors = [],
    failed = [],
    httpErrors = [];
  page.on("pageerror", (error) =>
    errors.push({ route: page.url(), message: error.message }),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      errors.push({ route: page.url(), message: message.text() });
  });
  page.on("requestfailed", (request) =>
    failed.push({ url: request.url(), reason: request.failure()?.errorText }),
  );
  page.on("response", (response) => {
    if (response.status() >= 400)
      httpErrors.push({ url: response.url(), status: response.status() });
  });
  const checks = [];
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:4196/human-story/");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: resolve(destination, `portal-${width}.png`),
      fullPage: true,
    });
    await page.screenshot({
      path: resolve(destination, `portal-${width}-viewport.png`),
    });
    checks.push({
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  }
  if (phase === "after") {
    for (const slug of [
      "jonah",
      "tacitus",
      "perpetua",
      "augustine",
      "jerome",
    ]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`http://127.0.0.1:4196/human-story/${slug}/`);
      if (slug === "perpetua")
        await page.locator('[data-prison-ready="true"]').waitFor();
      await page.screenshot({
        path: resolve(destination, `${slug}-1440.png`),
        fullPage: true,
      });
    }
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const scene of [
        "child",
        "tribunal",
        "separation",
        "vision",
        "felicity",
        "handover",
      ]) {
        await page.goto(
          `http://127.0.0.1:4196/human-story/perpetua/#perpetua-${scene}`,
        );
        await page.locator('[data-prison-ready="true"]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: resolve(destination, `prison-${scene}-${width}.png`),
          fullPage: true,
        });
        if (scene === "child") {
          await page.goto("http://127.0.0.1:4196/human-story/perpetua/");
          await page.locator('[data-prison-ready="true"]').waitFor();
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({
            path: resolve(destination, `prison-opening-${width}-viewport.png`),
          });
          if (width === 1440) await writeFile(resolve(destination, "prison-accessibility-tree.yml"), await page.locator("main").ariaSnapshot());
        }
        checks.push({
          route: `perpetua/${scene}`,
          width,
          overflow: await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        });
      }
    }
    const noScriptContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 1000 },
    });
    const noScriptPage = await noScriptContext.newPage();
    await noScriptPage.goto("http://127.0.0.1:4196/human-story/perpetua/");
    await noScriptPage.screenshot({
      path: resolve(destination, "prison-no-js-390.png"),
      fullPage: true,
    });
    await noScriptContext.close();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:4196/review-storyboards/");
    for (const concept of ["prison", "garden", "rome"]) {
      await page.locator(`section.${concept}`).screenshot({
        path: resolve(destination, `storyboard-${concept}-1440.png`),
      });
    }
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [name, path] of [
        ["path", "/human-story/paths/a-word-crosses-centuries/"],
        ["atlas-world", "/human-story/worlds/atlas/"],
        ["jonah", "/human-story/jonah/"],
        ["genesis-art", "/human-story/genesis-in-paint/"],
      ]) {
        await page.goto(`http://127.0.0.1:4196${path}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: resolve(destination, `${name}-${width}.png`),
          fullPage: true,
        });
      }
      await page.goto("http://127.0.0.1:4196/human-story/#discover");
      await page.getByRole("searchbox").fill("no-reading-9381");
      await page.screenshot({
        path: resolve(destination, `empty-${width}.png`),
      });
      await page
        .getByRole("button", { name: "Clear search and filters" })
        .click();
      await page
        .getByRole("button", {
          name: "Show connections for Augustine: a life reread",
        })
        .click();
      await page.screenshot({
        path: resolve(destination, `selected-${width}.png`),
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4196/");
  await page.screenshot({
    path: resolve(destination, "nineveh-1440.png"),
    fullPage: true,
  });
  const result = { phase, checks, errors, failed, httpErrors };
  await writeFile(
    resolve(destination, "capture.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
  if (
    errors.length ||
    failed.length ||
    httpErrors.length ||
    checks.some((check) => check.overflow)
  )
    process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
