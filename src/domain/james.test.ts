import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { JAMES_ENTRY, JAMES_MOVEMENTS, JAMES_QUOTES, JAMES_REVIEW, JAMES_SOURCES, JAMES_WITNESSES } from "../content/james.ts";

test("James quotations match the publisher snapshots, including verse-ending punctuation", () => {
  execFileSync(process.execPath, ["scripts/pin-james.mjs", "--check"]);
  const pinned: { id: keyof typeof JAMES_QUOTES; text: string; reference: string }[] = JSON.parse(readFileSync("src/content/scripture/james-quotes.json", "utf8"));
  assert.equal(pinned.length, Object.keys(JAMES_QUOTES).length);
  for (const record of pinned) {
    assert.equal(JAMES_QUOTES[record.id].text, record.text);
    assert.equal(JAMES_QUOTES[record.id].reference, record.reference);
  }
});

test("James claims and comparison layers retain provenance, genre, limits and draft status", () => {
  const sources = new Set(JAMES_SOURCES.map(s => s.id));
  assert.equal(sources.size, JAMES_SOURCES.length);
  assert.equal(new Set(JAMES_MOVEMENTS.map(m => m.id)).size, 5);
  for (const movement of JAMES_MOVEMENTS) for (const p of movement.paragraphs) {
    assert.ok(p.locator && p.sourceIds.length);
    assert.ok(p.sourceIds.every(id => sources.has(id)), movement.id);
  }
  for (const w of JAMES_WITNESSES) {
    assert.ok(w.genre && w.period && w.transmission);
    for (const [id, layer] of Object.entries(w.layers)) {
      assert.ok(JAMES_MOVEMENTS.some(m => m.id === id));
      assert.ok(layer.text && layer.limit && layer.sourceIds.length);
      assert.ok(layer.sourceIds.every(source => sources.has(source)));
    }
  }
  assert.equal(JAMES_REVIEW.status, "draft");
  assert.equal(JAMES_ENTRY.reviewStatus, "draft");
  assert.equal(JAMES_WITNESSES.find(w => w.id === "josephus")?.layers.appearance, undefined);
  assert.match(JAMES_WITNESSES.find(w => w.id === "paul")?.layers.jerusalem?.limit ?? "", /does not say that James ordered/);
  assert.match(JAMES_WITNESSES.find(w => w.id === "memory")?.transmission ?? "", /do not equal two independent eyewitnesses/);
});
