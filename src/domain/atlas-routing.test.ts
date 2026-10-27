import { test } from "node:test";
import assert from "node:assert/strict";
import { isLegacyAtlasLink } from "./atlas-routing.ts";
import epochManifest from "./epochs.json" with { type: "json" };

test("tracking, unknown state and editorial anchors stay on the homepage", () => {
  for (const search of ["", "?utm_source=chatgpt.com", "?utm_medium=referral&gclid=123&fbclid=abc", "?unknown=1", "?from=jonah-3-mercy", "?explore=0", "?event=", "?place=unknown", "?lat=1&lng=2", "?lat=NaN&lng=2&zoom=3", "?lat=91&lng=2&zoom=3"]) {
    for (const hash of ["", "#main-content", "#nineveh-heading", "#nineveh-reading", "#city", "#mercy", "#anger/art", "#question/voices", "#unknown", "#exodus-unknown"]) {
      assert.equal(isLegacyAtlasLink(search, hash), false, search + hash);
    }
  }
});

test("supported atlas query selectors survive tracking parameters", () => {
  for (const search of ["?explore=1", "?event=0", "?event=creation", "?place=nineveh&from=jonah-3-mercy", "?place=joppa", "?lat=32&lng=35&zoom=6", "?lat=0&lng=0&zoom=0"]) {
    assert.equal(isLegacyAtlasLink(search + "&utm_source=chatgpt.com", "#anger"), true, search);
  }
});

test("manifest epoch links and their book filters remain compatible", () => {
  for (const hash of ["#creation", ...epochManifest.epochs.map(epoch => epoch.hash)]) {
    assert.equal(isLegacyAtlasLink("?utm_source=chatgpt.com", hash), true);
    assert.equal(isLegacyAtlasLink("", hash + "&book=EXO"), true);
  }
});
