import { test } from "node:test";
import assert from "node:assert/strict";
import { isLegacyRootLink } from "./root-routing.ts";
import { NINEVEH_BEATS, NINEVEH_DISCOVERIES } from "./nineveh-navigation.ts";

test("old Nineveh beats, discoveries and accessibility anchors retain their entrance", () => {
  for (const beat of NINEVEH_BEATS) {
    assert.equal(isLegacyRootLink("?utm_source=release", `#${beat.id}`), true);
    for (const discovery of NINEVEH_DISCOVERIES) {
      assert.equal(isLegacyRootLink("", `#${beat.id}/${discovery}`), true);
    }
  }
  for (const hash of ["#main-content", "#nineveh-heading", "#nineveh-reading", "#exodus&book=EXO"]) {
    assert.equal(isLegacyRootLink("", hash), true);
  }
  assert.equal(isLegacyRootLink("?place=nineveh&from=jonah-3-mercy", ""), true);
});

test("Human Story anchors, tracking and unknown fragments do not select a legacy experience", () => {
  for (const hash of ["", "#main", "#paths", "#discover", "#saints", "#unknown", "#anger/unknown", "#anger/art/extra"]) {
    assert.equal(isLegacyRootLink("?utm_source=release&unknown=value", hash), false, hash);
  }
});
