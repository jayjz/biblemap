import test from "node:test";
import assert from "node:assert/strict";
import { parseNinevehHash } from "./nineveh-navigation.ts";
import { mayReviewDepthImage } from "./nineveh-depth-media.ts";

test("Nineveh share links keep the passage and reject malformed or unknown discoveries", () => {
  assert.equal(parseNinevehHash("anger/art").beat.id, "anger");
  assert.equal(parseNinevehHash("anger/art").discovery, "art");
  assert.equal(parseNinevehHash("question").beat.id, "question");
  for (const hash of ["anger/unknown", "anger/art/extra", "%E0%A4%A", "unknown/art", "__proto__/art"]) {
    assert.equal(parseNinevehHash(hash).discovery, null);
  }
});

test("Nineveh local review refuses restricted, unverified, unattributed and unknown-license images", () => {
  const asset = { rightsStatus: "verified", license: "CC0-1.0", rightsVerifiedBy: "Source record inspected", sourceRecordUrl: "https://example.org/object", requiredAttribution: "Museum" };
  assert.equal(mayReviewDepthImage(asset), true);
  for (const changed of [{ rightsStatus: "restricted" }, { rightsStatus: "unresolved" }, { license: "CC-BY-NC-4.0" }, { rightsVerifiedBy: "" }, { requiredAttribution: "" }, { sourceRecordUrl: "" }]) {
    assert.equal(mayReviewDepthImage({ ...asset, ...changed }), false);
  }
});
