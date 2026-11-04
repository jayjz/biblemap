import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { ROMANUS_MEDIA } from "../content/romanus-media.ts";
import { ROMANUS_ENTRY, ROMANUS_LEAVES, ROMANUS_MOVEMENTS, ROMANUS_REVIEW, ROMANUS_SOURCES } from "../content/romanus.ts";
import { isProductionReadyMedia, validateMediaAsset } from "./media.ts";

test("every Romanus claim and expanded leaf keeps an identifiable source and locator", () => {
  const ids = new Set(ROMANUS_SOURCES.map(s => s.id));
  assert.equal(ids.size, ROMANUS_SOURCES.length);
  assert.equal(new Set(ROMANUS_MOVEMENTS.map(m => m.id)).size, ROMANUS_MOVEMENTS.length);
  for (const m of ROMANUS_MOVEMENTS) for (const p of m.paragraphs) {
    assert.ok(ids.has(p.sourceId), `${m.id}: ${p.sourceId}`);
    assert.ok(p.locator.trim(), `${m.id}: missing locator`);
  }
  for (const leaf of ROMANUS_LEAVES) {
    assert.ok(leaf.sourceIds.every(id => ids.has(id)));
    assert.ok(leaf.genre && leaf.date && leaf.locator && leaf.observation);
  }
  assert.equal(ROMANUS_REVIEW.status, "draft");
  assert.equal(ROMANUS_ENTRY.reviewStatus, "draft");
});

test("Romanus artwork retains verified rights, institutional provenance and exact local bytes", () => {
  for (const media of ROMANUS_MEDIA) {
    assert.deepEqual(validateMediaAsset(media).errors, []);
    assert.ok(isProductionReadyMedia(media));
    const bytes = readFileSync(`public${media.localPath}`);
    assert.equal(`sha256:${createHash("sha256").update(bytes).digest("hex")}`, media.checksum);
    assert.match(media.rightsStatement, /isPublicDomain:true/);
  }
  const registered = new Set(ROMANUS_MEDIA.map(m => m.localPath.split("/").at(-1)));
  assert.deepEqual(readdirSync("public/media/romanus").filter(f => !registered.has(f)), []);
});
