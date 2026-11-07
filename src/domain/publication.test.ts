import assert from "node:assert/strict";
import { test } from "node:test";
import { HUMAN_GRAPH } from "../content/human-story.ts";
import { JONAH } from "../content/jonah.ts";
import { projectVisitorStory } from "./visitor-story.ts";
import { validateStory } from "./story.ts";
import { publicationErrors, selectVisitorGraph, contentMaturity, type PublicationScope, type PublicationDecision } from "./publication.ts";
import { inventoryExport } from "../../scripts/export-inventory.mjs";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync, brotliCompressSync } from "node:zlib";

const hash = `sha256:${"1".repeat(64)}`;
const scope: PublicationScope = { schemaVersion: 1, entries: {}, routes: [{ route: "/jonah/", maturity: "provisional", limitations: ["test-only-provisional-commentary"] }] };
// Synthetic decisions exist only in memory; no creator decision is written.
const decision: PublicationDecision = { status: "accepted", actor: "synthetic-fixture-not-a-real-approver", decidedAt: "2026-11-05T00:00:00Z", evidence: "in-memory unit fixture only", contentDigest: hash, artifactDigest: hash, routes: ["/jonah/"], acceptedLimitations: ["test-only-provisional-commentary"] };

test("creator acceptance binds actor, date, evidence, both digests, exact scope and limitations", () => {
  assert.deepEqual(publicationErrors(scope, decision, hash, hash), []);
  assert.match(publicationErrors(scope, { status: "pending" }, hash, hash).join(), /decision pending/);
  for (const patch of [{ actor: "" }, { decidedAt: "invalid" }, { evidence: "" }, { contentDigest: `sha256:${"2".repeat(64)}` }, { artifactDigest: `sha256:${"2".repeat(64)}` }, { routes: [] }, { acceptedLimitations: [] }]) {
    assert.ok(publicationErrors(scope, { ...decision, ...patch }, hash, hash).length, JSON.stringify(patch));
  }
  assert.ok(publicationErrors({ ...scope, routes: [{ ...scope.routes[0], limitations: [] }] }, decision, hash, hash).some(error => error.includes("disclosed limitation")));
  assert.ok(publicationErrors({ ...scope, routes: [...scope.routes, scope.routes[0]] }, decision, hash, hash).some(error => error.includes("duplicate")));
  const completed: PublicationScope = { ...scope, routes: [{ route: "/jonah/", maturity: "complete", limitations: [] }] };
  assert.deepEqual(publicationErrors(completed, decision, hash, hash), []);
  assert.ok(publicationErrors(completed, { status: "pending" }, hash, hash).length);
  // Structurally valid metadata cannot authenticate an actor or verify historical truth.
  assert.equal(decision.actor, "synthetic-fixture-not-a-real-approver");
});

test("every companion maturity state has distinct visitor behavior without scene approval bureaucracy", () => {
  for (const state of ["complete", "provisional", "internal-draft", "excluded-experimental"] as const) {
    const story = structuredClone(JONAH);
    assert.ok(story.scenes[0].readingGuide);
    story.scenes[0].readingGuide.status = state;
    assert.deepEqual(validateStory(story, "release"), []);
    const visitor = projectVisitorStory(story);
    assert.equal(Boolean(visitor.scenes[0].readingGuide), state === "complete" || state === "provisional");
    assert.equal(story.scenes[0].review.status, "draft");
  }
  assert.throws(() => contentMaturity("approved-by-ci"), /Unknown content maturity/);
  const malformed = structuredClone(JONAH);
  Object.assign(malformed.scenes[0].readingGuide ?? {}, { status: "approved-by-ci" });
  assert.ok(validateStory(malformed).some(error => error.includes("incomplete reading companion")));
});

test("source selection excludes unclassified and private entries plus orphan edges and evidence before serialization", () => {
  const source = structuredClone(HUMAN_GRAPH);
  const first = source.entries[0];
  Object.assign(first, { privateInterview: "unpublished-field-fixture" });
  const selection: PublicationScope = { ...scope, entries: { [first.id]: "complete" } };
  const selected = selectVisitorGraph(source, selection);
  assert.deepEqual(selected.entries.map(entry => entry.id), [first.id]);
  assert.doesNotMatch(JSON.stringify(selected), /unpublished-field-fixture/);
  assert.ok(selected.connections.every(edge => edge.from === first.id && edge.to === first.id));
  for (const maturity of ["internal-draft", "excluded-experimental"] as const) {
    assert.deepEqual(selectVisitorGraph(source, { ...selection, entries: { [first.id]: maturity } }).entries, []);
  }
  assert.equal(source.entries.length, HUMAN_GRAPH.entries.length);
});

test("byte inventory detects private data in all artifact types, encodings, binary media and compressed variants", () => {
  const root = mkdtempSync(join(tmpdir(), "biblemap-boundary-fixture-"));
  try {
    const marker = "UNPUBLISHED-fixture-<&'-43190";
    mkdirSync(join(root, "alternate"));
    writeFileSync(join(root, "index.html"), "<h1>Public fixture</h1>");
    const payloads: Record<string, string | Uint8Array> = {
      "alternate/draft.html": marker, "alternate/draft.txt": JSON.stringify(marker), "alternate/draft.json": JSON.stringify(JSON.stringify(marker)),
      "alternate/draft.js": encodeURIComponent(marker), "alternate/draft.webp": Buffer.from(marker), "alternate/draft.bin": Buffer.from(marker).toString("base64"),
      "alternate/draft.gz": gzipSync(marker), "alternate/draft.br": brotliCompressSync(marker),
    };
    for (const [path, bytes] of Object.entries(payloads)) writeFileSync(join(root, path), bytes);
    const report = inventoryExport(root, [marker]);
    assert.equal(report.files.length, 9);
    assert.equal(report.leaks.length, 8);
    const original = report.artifactDigest;
    writeFileSync(join(root, "alternate/draft.webp"), "changed media");
    assert.notEqual(inventoryExport(root).artifactDigest, original);
  } finally { rmSync(root, { recursive: true }); }
});
