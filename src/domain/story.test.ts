import assert from "node:assert/strict";
import { test } from "node:test";
import { JONAH } from "../content/jonah.ts";
import { sceneFromHash, validateStory, type Claim, type StoryDocument } from "./story.ts";

test("author review is valid, while release fails closed on unfinished authorship", () => {
  assert.deepEqual(validateStory(JONAH), []);
  assert.ok(validateStory(JONAH, "release").some(e => e.includes("human approval")));
  assert.ok(validateStory(JONAH, "release").some(e => e.includes("author slot")));
  assert.deepEqual(JONAH.passages.flatMap(p => p.verses.map(v => v.number)), Array.from({ length: 17 }, (_, i) => i + 1));
});

test("malformed links cannot select unintended scenes", () => {
  for (const hash of ["", "#missing", "#%E0%A4%A", "#__proto__", "#<script>"]) assert.equal(sceneFromHash(JONAH, hash).id, JONAH.scenes[0].id);
  assert.equal(sceneFromHash(JONAH, "#jonah-1-escape").id, "jonah-1-escape");
});

test("broken content and transitions are rejected before rendering", () => {
  const mutations: ((story: StoryDocument) => void)[] = [
    s => { s.scenes[1].id = s.scenes[0].id; },
    s => { s.scenes[0].transition.nextSceneId = s.scenes[3].id; },
    s => { s.scenes[0].passageIds = ["missing"]; },
    s => { s.scenes[0].chapter = 2; },
    s => { s.passages[0].verses = [{ number: 2, text: "Wrong order" }]; },
    s => { s.passages[0].checksum = "unverified"; },
    s => { s.passages[0].rightsUrl = "javascript:alert(1)"; },
    s => { s.sources[0].url = "not a source"; },
    s => { s.scenes[0].artworkIds = ["unreviewed-art"]; },
    s => { s.scenes[0].soundscapeId = "unreviewed-sound"; },
    s => { s.geography[0].status = "identified"; },
    s => { s.scenes[0].review = { status: "approved", reviewedBy: "", reviewedAt: "unknown" }; },
  ];
  mutations.forEach((mutate, index) => {
    const draft = structuredClone(JONAH); mutate(draft);
    assert.ok(validateStory(draft).length > 0, `mutation ${index} must fail`);
  });
});

test("claim evidence needs scope, uncertainty, and interpretive lens", () => {
  const claim: Claim = {
    id: "test-claim", statement: { status: "placeholder", slot: "test" }, basis: "theological-interpretation",
    certainty: "disputed", evidence: [{ sourceId: "web-jonah-1", locator: "1:1", supports: "Textual wording", doesNotEstablish: "Historical identification" }],
  };
  const story = structuredClone(JONAH); story.claims = [claim];
  const errors = validateStory(story);
  assert.ok(errors.some(e => e.includes("uncertainty")));
  assert.ok(errors.some(e => e.includes("interpretive lens")));
  claim.uncertainty = "Test uncertainty"; claim.interpretiveLens = "Test lens";
  assert.deepEqual(validateStory(story), []);
  claim.evidence = [{ sourceId: "missing", locator: "", supports: "", doesNotEstablish: "" }];
  assert.ok(validateStory(story).some(e => e.includes("citation locator")));
  assert.ok(validateStory(story).some(e => e.includes("unresolved reference")));
});
