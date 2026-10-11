import assert from "node:assert/strict";
import { test } from "node:test";
import { JONAH_VISUAL_REVIEW } from "../content/jonah-visual-review.ts";
import { canRenderMedia, isProductionReadyMedia, mayPublishMedia, publicationFlags, type CuratedMediaAsset } from "./media.ts";

function asset(overrides: Partial<CuratedMediaAsset> = {}): CuratedMediaAsset {
  return {
    id: "fixture", eventIds: [], journeyIds: [], class: "artistic-depiction",
    title: "Fixture", creator: "Maker", creationDate: "1900", depictedPeriod: "None",
    sourceInstitution: "Fixture", sourceRecordUrl: "https://example.test/record",
    originalAssetUrl: "https://example.test/original.jpg", license: "CC0-1.0",
    rightsStatement: "Open for the test", requiredAttribution: "Maker, Fixture",
    downloadedAt: "2026-10-11", checksum: `sha256:${"a".repeat(64)}`, localPath: "/media/jonah/fixture.jpg",
    altText: "A test image", caption: "Caption", historicalFit: "No claim",
    editorialReason: "Test", reviewStatus: "candidate", reviewedBy: "", rightsUse: "open",
    ...overrides,
  };
}

test("a valid open image renders and may be published without editorial approval", () => {
  const open = asset();
  assert.equal(isProductionReadyMedia(open), false);
  assert.equal(canRenderMedia(open), true);
  assert.equal(mayPublishMedia(open), true);
  assert.deepEqual(publicationFlags(open), []);
});

test("restricted rights do not render or publish", () => {
  const restricted = asset({ rightsUse: "restricted", license: "In Copyright" });
  assert.equal(canRenderMedia(restricted), false);
  assert.equal(mayPublishMedia(restricted), false);
  assert.ok(publicationFlags(restricted).includes("explicit-restriction"));
  assert.equal(canRenderMedia(asset({ reviewStatus: "rejected" })), false);
});

test("unresolved rights may render in review and must not publish", () => {
  const unresolved = asset({ rightsUse: "unresolved", license: "Public Domain", localPath: "artifacts/jonah-visual-review/withheld.jpg" });
  assert.equal(canRenderMedia(unresolved), true);
  assert.equal(mayPublishMedia(unresolved), false);
  assert.ok(publicationFlags(unresolved).includes("unresolved-rights"));
  assert.ok(JONAH_VISUAL_REVIEW.every(entry => canRenderMedia(entry.asset) && !mayPublishMedia(entry.asset) && !entry.asset.localPath.startsWith("/media/")));
});

test("missing source and attribution are visible as flags, not filled in", () => {
  const gaps = asset({ sourceRecordUrl: "", originalAssetUrl: "", creator: "", requiredAttribution: "", license: "" });
  const flags = publicationFlags(gaps);
  assert.ok(flags.includes("missing-source"));
  assert.ok(flags.includes("missing-attribution"));
  assert.ok(flags.includes("unresolved-rights"));
  assert.equal(mayPublishMedia(gaps), false);
});
