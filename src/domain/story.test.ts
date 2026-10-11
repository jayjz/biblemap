import assert from "node:assert/strict";
import { test } from "node:test";
import { JONAH, JONAH_CHAPTERS } from "../content/jonah.ts";
import { approvedAuthoredText, sceneFromHash, validateStory, type Claim, type StoryDocument } from "./story.ts";
import { JONAH_MEDIA_REVIEW, JONAH_OPEN_PLACEMENTS, JONAH_PROVISIONAL_MEDIA } from "../content/jonah-media.ts";
import { isProductionReadyMedia, mayPublishMedia, publicationFlags } from "./media.ts";

test("story document keeps the three approved artworks; open images stay outside it", () => {
  assert.equal(JONAH_MEDIA_REVIEW.length, 3);
  assert.ok(JONAH_MEDIA_REVIEW.every(isProductionReadyMedia));
  assert.equal(JONAH.media.length, 3);
  assert.ok(JONAH.media.every(isProductionReadyMedia));
  assert.equal(JONAH_PROVISIONAL_MEDIA.length, 5);
  assert.ok(JONAH_PROVISIONAL_MEDIA.every(asset => mayPublishMedia(asset) && !isProductionReadyMedia(asset) && publicationFlags(asset).includes("license-unverified") && !publicationFlags(asset).includes("missing-attribution")));
  assert.ok(JONAH_PROVISIONAL_MEDIA.every(asset => !JONAH.media.some(item => item.id === asset.id)));
  assert.equal(JONAH_OPEN_PLACEMENTS.length, 5);
  const placements = Object.fromEntries(JONAH.scenes.filter(scene => scene.artworkIds.length).map(scene => [scene.id, scene.artworkIds]));
  assert.deepEqual(placements, {
    "jonah-1-calling": ["nga-raphael-hosea-jonah"],
    "jonah-1-depths": ["met-rosselli-prophet-jonah"],
    "jonah-2-prayer": ["met-rosselli-prophet-jonah"],
    "jonah-2-shore": ["met-gassel-ship-jonah"],
  });
  assert.deepEqual(JONAH_OPEN_PLACEMENTS.map(entry => [entry.sceneIds[0], entry.asset.id]).sort(), [
    ["jonah-1-escape", "cma-roberts-jaffa"],
    ["jonah-1-storm-sea", "nga-sadeler-jonah-storm"],
    ["jonah-1-storm-wind", "cma-backhuysen-storm"],
    ["jonah-3-return", "commons-nineveh-gardens"],
    ["jonah-4-shade", "cma-jonah-gourd-vine"],
  ].sort());
  const withOpenImage = structuredClone(JONAH);
  withOpenImage.media = [...withOpenImage.media, JONAH_PROVISIONAL_MEDIA[0]];
  assert.ok(validateStory(withOpenImage).some(error => error.includes("approved local media")));
});

test("visitor copy requires actual approval; source slots and drafts remain intact", () => {
  assert.equal(approvedAuthoredText({ status: "placeholder", slot: "original author slot" }), null);
  assert.equal(approvedAuthoredText({ status: "written", text: "Draft", authorId: "fixture", review: { status: "draft" } }), null);
  assert.equal(approvedAuthoredText({ status: "written", text: "Approved", authorId: "fixture", review: { status: "approved", reviewedBy: "", reviewedAt: "2026-10-10" } }), null);
  assert.equal(approvedAuthoredText({ status: "written", text: "Approved", authorId: "fixture", review: { status: "approved", reviewedBy: "test-fixture-only", reviewedAt: "2026-10-10" } }), "Approved");
  assert.equal(JONAH.scenes[0].narrative.status, "placeholder");
});

test("author review is valid, while release fails closed on unfinished authorship", () => {
  assert.deepEqual(validateStory(JONAH), []);
  assert.ok(validateStory(JONAH, "release").some(e => e.includes("human approval")));
  assert.ok(validateStory(JONAH, "release").some(e => e.includes("author slot")));
  for (const [index, chapter] of JONAH_CHAPTERS.entries()) {
    assert.deepEqual(JONAH.passages.filter(p => p.chapter === index + 1).flatMap(p => p.verses), chapter.verses);
  }
  assert.equal(JONAH.passages.flatMap(p => p.verses).length, 48);
  assert.ok(JONAH.sections.every(section => section.available && JONAH.scenes.some(scene => scene.sectionId === section.id)));
  const last = JONAH.scenes.at(-1);
  assert.equal(last?.id, "jonah-4-question");
  assert.equal(last?.transition.nextSceneId, null);
  assert.ok(JONAH.passages.at(-1)?.verses[0].text.endsWith("animals?”"));
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
    s => { if (s.scenes[0].readingGuide) s.scenes[0].readingGuide.sourceId = "missing"; },
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
