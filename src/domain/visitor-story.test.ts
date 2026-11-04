import assert from "node:assert/strict";
import { test } from "node:test";
import { JONAH } from "../content/jonah.ts";
import { PRISON_SCENES } from "../content/perpetua-encounter.ts";
import { projectVisitorStory } from "./visitor-story.ts";
import { projectVisitorPrison } from "./visitor-prison.ts";
import { privateStoryProbes, visitorExportErrors } from "../../scripts/validate-visitor-export.ts";
import { readPublicArtifacts } from "../../scripts/release-gate-inventory.ts";

test("visitor projection preserves Scripture, provenance, companions and media while omitting author records", () => {
  const visitor = projectVisitorStory(JONAH);
  assert.deepEqual(visitor.passages, JONAH.passages);
  assert.deepEqual(visitor.sources, JONAH.sources);
  assert.deepEqual(visitor.media.map(m => m.id), JONAH.media.map(m => m.id));
  assert.deepEqual(visitor.media.map(m => [m.sourceRecordUrl, m.rightsStatement, m.requiredAttribution, m.historicalFit]), JONAH.media.map(m => [m.sourceRecordUrl, m.rightsStatement, m.requiredAttribution, m.historicalFit]));
  assert.doesNotMatch(JSON.stringify(visitor.media), /reviewStatus|reviewedBy|editorialReason/);
  assert.deepEqual(visitor.scenes.map(s => s.id), JONAH.scenes.map(s => s.id));
  assert.deepEqual(visitor.scenes.map(s => s.readingGuide), JONAH.scenes.map(s => s.readingGuide));
  const bytes = JSON.stringify(visitor);
  for (const probe of privateStoryProbes(JONAH)) assert.ok(!bytes.includes(probe), probe);
  assert.ok(visitor.scenes.every(s => s.title === null && s.narrative === null && s.reflections.every(r => r.prompt === null)));
  assert.ok(JONAH.scenes.every(s => s.review.status === "draft" && s.title.status === "placeholder"));
});

test("new private fields and written drafts fail closed at the allowlisted boundary", () => {
  const source = structuredClone(JONAH);
  const draft = { status: "written", text: "private-written-canary", authorId: "private-author", review: { status: "draft" } } as const;
  source.scenes[0].title = draft;
  source.scenes[0].narrative = draft;
  source.scenes[0].reflections[0].prompt = draft;
  source.geography[0].explanation = draft;
  Object.assign(source, { futurePrivateField: "private-future-canary" });
  Object.assign(source.scenes[0], { interview: "private-interview-canary" });
  const bytes = JSON.stringify(projectVisitorStory(source));
  assert.doesNotMatch(bytes, /private-written-canary|private-author|private-future-canary|private-interview-canary|reviewedAt/);
  const prison = structuredClone(PRISON_SCENES);
  Object.assign(prison[0], { unpublishedCreatorNote: "private-prison-canary" });
  assert.doesNotMatch(JSON.stringify(projectVisitorPrison(prison)), /reviewStatus|private-prison-canary/);
  assert.deepEqual(projectVisitorPrison(prison)[0].relationships, prison[0].relationships);
});

test("export verifier rejects leaks on every artifact surface, including alternate URLs", () => {
  for (const path of ["jonah/index.html", "jonah/index.txt", "jonah/__next._full.txt", "alternate/draft.json", "_next/static/chunks/draft.js"]) {
    for (const probe of ["creator narrative", '"review":{"status":"draft"}', "No one dies for a lie."]) {
      for (const text of [probe, JSON.stringify(probe)]) {
        assert.ok(visitorExportErrors([{ path, text }]).some(error => error.includes(`${path}: private editorial data exposed`)));
      }
    }
  }
});

// Opt-in because npm test can run before a build. CI/build invokes the same
// verifier unconditionally against the newly generated ordinary export.
test("actual generated HTML, RSC, JS and JSON exclude private source data", { skip: process.env.BIBLEMAP_VERIFY_EXPORT !== "1" }, () => {
  assert.deepEqual(visitorExportErrors(readPublicArtifacts("out")), []);
});
