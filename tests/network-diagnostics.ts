import type { Page } from "@playwright/test";
import { expectedRscCancellation } from "../src/domain/network-diagnostics";

export function collectNetwork(page: Page, origin: string | undefined) {
  if (!origin) throw new Error("Network diagnostics require the configured baseURL");
  const failures: string[] = [];
  const cancellations: string[] = [];
  page.on("requestfailed", request => {
    const failed = { url: request.url(), method: request.method(), resourceType: request.resourceType(), errorText: request.failure()?.errorText };
    const message = `${failed.method} ${failed.url}: ${failed.errorText}`;
    (expectedRscCancellation(failed, origin) ? cancellations : failures).push(message);
  });
  page.on("response", response => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  return { failures, cancellations };
}
export function assertNetworkHealthy(failures: readonly string[]) {
  if (failures.length) throw new Error(`Network failures:\n${failures.join("\n")}`);
}
