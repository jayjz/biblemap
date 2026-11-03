import assert from "node:assert/strict";
import { test } from "node:test";
import { artifactMatches, classifyReleaseErrors, createInventory } from "../../scripts/release-gate-inventory.ts";
import { JONAH } from "../content/jonah.ts";
import { HUMAN_GRAPH } from "../content/human-story.ts";
import { JONAH_PROVISIONAL_MEDIA } from "../content/jonah-media.ts";
import { validateHumanGraph } from "./human-story.ts";
import { isProductionReadyMedia } from "./media.ts";
import { validateStory } from "./story.ts";

test("triage accounts for every release error, including repeated scene IDs", () => {
  const items = classifyReleaseErrors(JONAH);
  assert.deepEqual(items.map(item => item.validationError).sort(), validateStory(JONAH, "release").sort());
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
  for (const scene of JONAH.scenes) {
    for (const field of ["title", "narrative", "readingGuide", "review"])
      assert.ok(items.some(item => item.sourcePath === `JONAH.scenes[${scene.id}].${field}`));
    assert.ok(items.some(item => item.validatorId === scene.reflections[0].id));
  }
  const invalid = structuredClone(JONAH);
  invalid.passages[0].rightsStatement = "";
  assert.throws(() => classifyReleaseErrors(invalid), /Unclassified release failures/);
});

test("artifact audit catches placeholders in markup, JSON, RSC, JS and alternate routes", () => {
  const probe = "creator narrative";
  const artifacts = [
    { path: "index.html", text: "<p>creator narrative</p>" },
    { path: "draft/data.json", text: JSON.stringify({ status: "placeholder", slot: probe }) },
    { path: "alternate/index.txt", text: `1:${JSON.stringify({ slot: probe })}` },
    { path: "_next/static/chunks/story.js", text: `const slot=${JSON.stringify(probe)}` },
    { path: "clean/index.html", text: "<p>Scripture</p>" },
  ];
  assert.deepEqual(artifactMatches(artifacts, probe), artifacts.slice(0, 4).map(item => item.path));
  assert.deepEqual(artifactMatches(artifacts, "private creator words"), []);
  assert.throws(() => artifactMatches(artifacts, ""), /empty probe/);
  assert.deepEqual(artifactMatches([{ path: "index.html", text: "Mother&#x27;s words" }], "Mother's words"), ["index.html"]);
});

test("inventory reports actual exported routes without granting draft publication", () => {
  const inventory = createInventory([{ path: "human-story/perpetua/index.html", text: "<p>Draft</p>" }]);
  assert.match(inventory.publicationDecision, /^BLOCKED/);
  assert.equal(inventory.humanStory.entries.find(entry => entry.id === "perpetua")?.exportedRoute, true);
  assert.equal(inventory.humanStory.entries.find(entry => entry.id === "augustine")?.exportedRoute, false);
  assert.ok(inventory.humanStory.entries.every(entry => entry.reviewStatus === "draft"));
});

test("full release rejects public scenes without approval and provisional companions", () => {
  const errors = validateStory(JONAH, "release");
  for (const scene of JONAH.scenes) {
    assert.ok(errors.includes(`${scene.id}: human approval required`));
    assert.ok(errors.includes(`${scene.id}: reading companion requires human approval`));
  }
  const malformed = structuredClone(JONAH);
  malformed.scenes[0].review = { status: "approved", reviewedBy: "", reviewedAt: "invalid" };
  assert.ok(validateStory(malformed, "release").includes(`${malformed.scenes[0].id}: approval requires reviewer and date`));
  const guide = malformed.scenes[0].readingGuide;
  assert.ok(guide);
  // Deliberately malformed runtime input; not an approval record.
  Object.assign(guide, { status: "approved" });
  assert.ok(validateStory(malformed, "release").includes(`${malformed.scenes[0].id}: incomplete reading companion`));
});

// These probes document acceptance gaps. A passing test here is NOT a passing
// publication gate. All synthetic changes stay in memory; no review is recorded.
test("adversarial probe: a plausible fabricated reviewer is not authenticated by validateStory", () => {
  const forged = structuredClone(JONAH);
  forged.scenes[0].review = { status: "approved", reviewedBy: "fabricated-test-reviewer-no-real-decision", reviewedAt: "2026-11-01" };
  const errors = validateStory(forged, "release");
  assert.equal(errors.length, validateStory(JONAH, "release").length - 1);
  assert.ok(!errors.includes(`${forged.scenes[0].id}: human approval required`));
});

test("adversarial probe: historical certainty is not semantically verified", () => {
  const story = structuredClone(JONAH);
  story.claims = [{
    id: "synthetic-contested-claim", statement: { status: "placeholder", slot: "TEST ONLY" },
    basis: "historical-evidence", certainty: "attested",
    evidence: [{ sourceId: "web-jonah-1", locator: "1:1", supports: "TEST ONLY: insufficient for historical certainty", doesNotEstablish: "Independent historical attestation" }],
  }];
  // A disputed value requires an uncertainty note. Calling it attested bypasses
  // that structural rule: the validator cannot determine the claim's truth.
  assert.deepEqual(validateStory(story), []);
  story.claims[0].certainty = "disputed";
  assert.ok(validateStory(story).some(error => error.includes("uncertainty required")));
});

test("source and translation rights are required; draft graph validation is not approval", () => {
  const story = structuredClone(JONAH);
  story.passages[0].rightsStatement = "";
  assert.ok(validateStory(story).some(error => error.includes("scripture provenance required")));
  const graph = structuredClone(HUMAN_GRAPH);
  graph.sources[0].rights = "";
  assert.ok(validateHumanGraph(graph).some(error => error.includes("incomplete provenance")));
  assert.deepEqual(validateHumanGraph(HUMAN_GRAPH), []);
  assert.ok(HUMAN_GRAPH.entries.every(entry => entry.reviewStatus === "draft"));
});

test("rights-cleared visual media do not require an unrelated generic approval stamp", () => {
  const asset = structuredClone(JONAH_PROVISIONAL_MEDIA[0]);
  assert.equal(asset.reviewStatus, "rights-verified");
  assert.equal(isProductionReadyMedia(asset), true);
  asset.rightsUse = "unresolved";
  assert.equal(isProductionReadyMedia(asset), false);
});
