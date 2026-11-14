import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import record from "../content/pliny-record.json" with { type: "json" };
import { PLINY_PASSAGES, PLINY_CLAIMS, PLINY_COPY, PLINY_REVIEW, PLINY_SOURCES } from "../content/pliny.ts";
import { HUMAN_GRAPH } from "../content/human-story.ts";

test("every Pliny quotation matches its pinned letter and retains a precise locator", () => {
  for (const [id, passage] of Object.entries(PLINY_PASSAGES)) {
    assert.ok(record.letters[passage.letter].includes(passage.text), id);
    assert.match(passage.locator, /^10\.(96\.\d+|97)$/);
  }
  assert.equal(createHash("sha256").update(readFileSync(new URL("../content/pliny-record.json", import.meta.url))).digest("hex"), "0290faf9341b2b609b9236854431cbb18e0187d26e93446c21214ef2ec7dd4cb");
});

test("all authored bridges have traceable source/locator coverage without claiming approval", () => {
  assert.equal(PLINY_REVIEW.status, "draft");
  assert.deepEqual(new Set(PLINY_CLAIMS.flatMap(claim => [...claim.fields])), new Set(Object.keys(PLINY_COPY)));
  for (const claim of PLINY_CLAIMS) {
    assert.ok(claim.locator && claim.evidenceClass);
    for (const id of claim.sourceIds) assert.ok(PLINY_SOURCES.some(source => source.id === id), id);
  }
  const entry = HUMAN_GRAPH.entries.find(entry => entry.id === "pliny");
  assert.equal(entry?.reviewStatus, "draft");
  for (const source of PLINY_SOURCES) {
    assert.ok(source.edition && source.locator && source.rights && source.limits && source.checkedAt, source.id);
    assert.ok(entry?.sourceIds.includes(source.id));
    assert.ok(HUMAN_GRAPH.sources.some(candidate => candidate.id === source.id));
  }
});

test("the selected ruling keeps punishment, pardon and rejection of anonymous accusations together", () => {
  assert.ok(record.letters.trajan.includes(PLINY_PASSAGES.punishment.text));
  assert.ok(record.letters.trajan.includes(PLINY_PASSAGES.pardon.text));
  assert.ok(record.letters.trajan.includes(PLINY_PASSAGES.anonymous.text));
  assert.match(PLINY_COPY.execution, /translation says ‘punished’/);
  assert.match(PLINY_COPY.womenAfter, /do not tell us what happened/);
});
