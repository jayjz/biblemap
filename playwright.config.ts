import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", fullyParallel: false, workers: 1, timeout: 45000,
  expect: { timeout: 12000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4189", trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath: process.env.CHROME_PATH, args: ["--enable-unsafe-swiftshader"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" } },
  ],
  webServer: { command: "python3 -m http.server 4189 --bind 127.0.0.1 --directory out", url: "http://127.0.0.1:4189/jonah/", reuseExistingServer: !process.env.CI },
});
