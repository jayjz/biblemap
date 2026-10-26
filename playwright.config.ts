import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4189);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid PLAYWRIGHT_PORT");
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests", fullyParallel: false, workers: 1, timeout: 45000,
  expect: { timeout: 12000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL, trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath: process.env.CHROME_PATH, args: ["--enable-unsafe-swiftshader"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" } },
  ],
  webServer: { command: process.env.PLAYWRIGHT_REVIEW_SERVER === "1" ? `node scripts/review-irreplaceable.mjs` : `python3 -m http.server ${port} --bind 127.0.0.1 --directory out`, env: process.env.PLAYWRIGHT_REVIEW_SERVER === "1" ? { EXPERIMENT_PORT: String(port) } : undefined, url: `${baseURL}/jonah/`, reuseExistingServer: !process.env.CI },
});
