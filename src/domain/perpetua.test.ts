import { test } from "node:test";
import assert from "node:assert/strict";
import { PRISON_SCENES, PERPETUA_CONTEXT_SOURCES, prisonView } from "../content/perpetua-encounter.ts";
import { HUMAN_GRAPH } from "../content/human-story.ts";

test("every prison scene retains passage evidence, separate voices and review status", () => {
  assert.equal(
    new Set(PRISON_SCENES.map((scene) => scene.id)).size,
    PRISON_SCENES.length,
  );
  for (const scene of PRISON_SCENES) {
    assert.ok(
      HUMAN_GRAPH.sources.some((source) => source.id === scene.sourceId),
    );
    assert.match(scene.locator, /§/);
    assert.ok(scene.evidence && scene.limit && scene.visualDescription);
    assert.ok(scene.setting && scene.transition);
    for (const id of scene.contextSourceIds) {
      assert.ok(PERPETUA_CONTEXT_SOURCES[id].url && PERPETUA_CONTEXT_SOURCES[id].locator && PERPETUA_CONTEXT_SOURCES[id].limit);
    }
    assert.equal(scene.reviewStatus, "draft");
    assert.ok(
      scene.relationships.length &&
        scene.relationships.every((item) => item.observation && item.position),
    );
  }
  assert.equal(
    PRISON_SCENES.find((scene) => scene.id === "vision")?.voice,
    "vision",
  );
  assert.equal(
    PRISON_SCENES.find((scene) => scene.id === "felicity")?.voice,
    "narrator",
  );
  assert.equal(
    PRISON_SCENES.find((scene) => scene.id === "handover")?.voice,
    "narrator",
  );
});

test("shareable prison views preserve stable scenes and safely reject unrelated fragments", () => {
  for (const scene of PRISON_SCENES)
    assert.equal(prisonView(`#perpetua-${scene.id}`).scene.id, scene.id);
  assert.equal(prisonView("#perpetua-all").all, true);
  assert.equal(prisonView("#prison").scene.id, "child");
  assert.equal(prisonView("#visions").scene.id, "vision");
  assert.equal(prisonView("#felicity").scene.id, "felicity");
  for (const hash of ["#perpetua-99", "#tribunal", "#perpetua-%ZZ", ""]) {
    assert.equal(prisonView(hash).scene.id, "carthage");
    assert.equal(prisonView(hash).all, false);
  }
  assert.equal(prisonView(null).enhanced, false);
});
