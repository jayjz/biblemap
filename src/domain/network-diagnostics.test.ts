import { test } from "node:test";
import assert from "node:assert/strict";
import { expectedRscCancellation } from "./network-diagnostics.ts";

test("only observed same-origin GET Flight fetch cancellations are classified", () => {
  const request = { url: "https://example.test/index.txt?_rsc=abc", method: "GET", resourceType: "fetch", errorText: "net::ERR_ABORTED" };
  const classify = (patch: Partial<typeof request>) => expectedRscCancellation({ ...request, ...patch }, "https://example.test");
  assert.equal(classify({}), true);
  for (const patch of [
    { url: "https://other.test/index.txt?_rsc=abc" }, { url: "https://example.test/index.txt" },
    { url: "https://example.test/index.txt?_rsc=" }, { url: "https://example.test/asset.js?_rsc=abc" },
    { method: "HEAD" }, { method: "POST" }, { resourceType: "document" },
    { resourceType: "script" }, { resourceType: "stylesheet" }, { errorText: "net::ERR_FAILED" },
  ]) assert.equal(classify(patch), false, JSON.stringify(patch));
});
