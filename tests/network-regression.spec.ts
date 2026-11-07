import { test, expect } from "@playwright/test";
import { collectNetwork, assertNetworkHealthy } from "./network-diagnostics";

test("real aborted navigation and HTTP 503 still fail the strict network assertion", async ({ page, baseURL }) => {
  const diagnostics = collectNetwork(page, baseURL);
  await page.route("**/__failed-navigation__/", route => route.abort("aborted"));
  await expect(page.goto("/__failed-navigation__/")).rejects.toThrow();
  expect(diagnostics.failures.some(message => message.includes("__failed-navigation__"))).toBe(true);
  expect(() => assertNetworkHealthy(diagnostics.failures)).toThrow("Network failures");
  diagnostics.failures.length = 0;
  await page.route("**/__http-error__/?_rsc=real", route => route.fulfill({ status: 503, body: "Service unavailable" }));
  await page.goto("/__http-error__/?_rsc=real");
  expect(diagnostics.failures.some(message => message.startsWith("503 "))).toBe(true);
  expect(() => assertNetworkHealthy(diagnostics.failures)).toThrow("503");
  expect(diagnostics.cancellations).toEqual([]);
});
