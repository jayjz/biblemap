import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { CLAIMS, FEATURES, MOVEMENTS, readEvidenceState } from "../content/lachish/narrative.ts";

const registry = JSON.parse(readFileSync("src/content/lachish/sources.json", "utf8"));
const scripture = JSON.parse(readFileSync("src/content/lachish/scripture.json", "utf8"));
const media = JSON.parse(readFileSync("public/media/lachish/manifest.json", "utf8"));

test("Lachish claims retain evidence classification, limitations and existing sources", () => {
  const sourceIds = new Set(registry.sources.map((source: { id: string }) => source.id));
  assert.equal(sourceIds.size, registry.sources.length);
  for (const claim of Object.values(CLAIMS)) {
    assert.ok(claim.sourceIds.length, claim.id);
    for (const id of claim.sourceIds) assert.ok(sourceIds.has(id), `${claim.id}: ${id}`);
    assert.ok(claim.locator);
    assert.ok(["SUPPORTED", "INFERRED", "UNRESOLVED", "CONFLICTED"].includes(claim.state));
  }
  assert.equal(CLAIMS.survival.state, "UNRESOLVED");
  assert.equal(CLAIMS.tribute.state, "CONFLICTED");
  assert.equal(MOVEMENTS.length, 6);
  assert.equal(new Set(MOVEMENTS.map(movement => movement.id)).size, 6);
  for (const movement of MOVEMENTS) for (const id of movement.claims) assert.ok(CLAIMS[id]);
  for (const feature of FEATURES) for (const id of feature.sources) assert.ok(sourceIds.has(id));
  const kings = registry.sources.find((source: { id: string }) => source.id === "web-kings");
  const isaiah = registry.sources.find((source: { id: string }) => source.id === "web-isaiah");
  assert.equal(kings.family, isaiah.family, "Parallel texts must not be counted as independent witnesses");
});

test("Lachish offline pins preserve five complete WEB chapters and reproducible public evidence", () => {
  const checked = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/pin-lachish.mjs", "--check"], { encoding: "utf8" });
  assert.equal(checked.status, 0, checked.stderr);
  assert.deepEqual(scripture.chapters.map((chapter: { verses: unknown[] }) => chapter.verses.length), [37, 37, 22, 38, 33]);
  const text = scripture.chapters.flatMap((chapter: { verses: { text: string }[] }) => chapter.verses.map(verse => verse.text)).join(" ");
  assert.ok(!text.includes("A talent is about"), "Publisher footnotes must not be inserted into the verse");
  assert.ok(!/<[^>]+>|&#\d+;/.test(text));
});

test("Lachish visual derivatives retain verified rights, hashes and a bounded download size", () => {
  let total = 0;
  for (const asset of media.assets) {
    for (const field of ["creator", "sourceRecordUrl", "license", "requiredAttribution", "historicalFit", "reviewedBy"]) assert.ok(asset[field], `${asset.id}: ${field}`);
    assert.equal(asset.reviewStatus, "rights-verified");
    assert.ok(asset.knownUncertainties.length);
    for (const derivative of asset.derivatives) {
      const bytes = readFileSync(derivative.localPath);
      assert.equal(bytes.length, derivative.bytes);
      assert.equal(`sha256:${createHash("sha256").update(bytes).digest("hex")}`, derivative.checksum);
      assert.ok(bytes.length < 400_000, `Oversized derivative: ${derivative.localPath}`);
      total += bytes.length;
    }
  }
  assert.ok(total < 2_000_000);
  assert.equal(media.assets.find((asset: { id: string }) => asset.id === "city").class, "interpretive-reconstruction");
});

test("Lachish evidence URLs restore meaningful selections and reject unsupported values", () => {
  assert.deepEqual(readEvidenceState("?detail=engine&evidence=landscape"), { feature: "engine", view: "landscape" });
  assert.deepEqual(readEvidenceState("?detail=defense&evidence=site"), { feature: "defense", view: "site" });
  assert.deepEqual(readEvidenceState("?detail=%3Cscript%3E&evidence=unknown"), { feature: "ramp", view: "artifact" });
  assert.deepEqual(readEvidenceState(""), { feature: "ramp", view: "artifact" });
});
