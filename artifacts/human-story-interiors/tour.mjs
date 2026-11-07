// Re-run after `npm run build`. Starts a local static server and captures actual UI use.
import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
const root = path.resolve("out");
const destination = path.resolve("artifacts/human-story-interiors/after");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};
const server = createServer(async (req, res) => {
  try {
    let file = path.resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await fs.stat(file)).isDirectory())
      file = path.join(file, "index.html");
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.end(await fs.readFile(file));
  } catch (error) {
    res.writeHead(error.code === "ENOENT" ? 404 : 500).end("Unavailable");
  }
});
(async () => {
  await fs.mkdir(destination, { recursive: true });
  await new Promise((resolve) => server.listen(4198, "127.0.0.1", resolve));
  const browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const record = {
    base: "207f395a669a2bf87182ef80de6d7dca669e000c",
    capturedAt: new Date().toISOString(),
    errors: [],
    failed: [],
    httpErrors: [],
    visits: [],
    interactions: [],
  };
  page.on("pageerror", (e) => record.errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") record.errors.push(m.text());
  });
  page.on("requestfailed", (r) =>
    record.failed.push({ url: r.url(), reason: r.failure()?.errorText }),
  );
  page.on("response", (r) => {
    if (r.status() >= 400)
      record.httpErrors.push({ url: r.url(), status: r.status() });
  });
  const visit = async (url) => {
    await page.goto("http://127.0.0.1:4198" + url, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    record.visits.push({
      url,
      width: page.viewportSize().width,
      images: await page.locator("main img").count(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  };
  const capture = async (name, target = page) =>
    target.screenshot({
      path: path.join(destination, name + ".png"),
      ...(target === page ? { fullPage: true } : {}),
    });
  try {
    for (const world of ["stories", "witnesses", "saints", "atlas", "voices"]) {
      await visit("/human-story/worlds/" + world + "/");
      if (world === "witnesses") {
        const reply = page.getByText("Read Trajan’s reply alongside it", {
          exact: true,
        });
        await reply.focus();
        await page.keyboard.press("Enter");
        if (
          !(await page.locator('[data-passage="trajanRepentance"]').isVisible())
        )
          throw new Error("Reply did not open");
        record.interactions.push("Keyboard: Pliny and Trajan compared inline");
        await capture("witnesses-desktop");
      }
      if (world === "saints") await capture("saints-desktop");
    }
    await visit("/human-story/pliny/");
    await page
      .getByText("Read Trajan’s reply alongside it", { exact: true })
      .click();
    record.interactions.push(
      "Pliny reading room: reply opened without navigation",
    );
    await visit("/human-story/augustine/");
    await page
      .getByText("Compare the words with the painting", { exact: true })
      .click();
    await capture("augustine-desktop");
    record.interactions.push("Augustine: text and later painting compared");
    await visit("/human-story/perpetua/#perpetua-separation");
    const scene = page.locator('[data-scene="separation"]');
    await scene
      .getByText("Hold this beside the earlier passage", { exact: true })
      .click();
    await capture("perpetua-desktop", scene);
    record.interactions.push(
      "Perpetua: sections 3 and 6 held together in the same scene",
    );
    await scene
      .getByRole("button", { name: "Her father", exact: true })
      .click();
    await scene
      .getByText("Look closer · image & source", { exact: true })
      .click();
    record.interactions.push(
      "Perpetua: father relationship and later-image provenance opened",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await visit("/human-story/worlds/saints/");
    await capture("saints-mobile");
    await visit("/human-story/augustine/");
    await page
      .getByText("Compare the words with the painting", { exact: true })
      .click();
    await capture("augustine-mobile");
    await visit("/human-story/perpetua/#perpetua-separation");
    await scene
      .getByText("Hold this beside the earlier passage", { exact: true })
      .click();
    await capture("perpetua-mobile", scene);
    await fs.writeFile(
      path.join(destination, "tour.json"),
      JSON.stringify(record, null, 2) + "\n",
    );
    console.log(JSON.stringify(record, null, 2));
    if (
      record.errors.length ||
      record.failed.length ||
      record.httpErrors.length ||
      record.visits.some((v) => v.overflow)
    )
      process.exitCode = 1;
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  server.close();
  process.exitCode = 1;
});
