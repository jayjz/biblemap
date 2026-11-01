import { test } from "node:test";
import assert from "node:assert/strict";
import { HUMAN_GRAPH } from "../content/human-story.ts";
import { connectionsFor, validateHumanGraph } from "./human-story.ts";
import { HUMAN_PATHS } from "../content/human-story-paths.ts";

test("Human Story drafts retain source locators, stable entities and working connection endpoints", () => {
  assert.deepEqual(validateHumanGraph(HUMAN_GRAPH), []);
  for (const entry of HUMAN_GRAPH.entries) assert.ok(connectionsFor(HUMAN_GRAPH, entry.id).length > 0, `${entry.id} has a way onward`);
  assert.equal(connectionsFor(HUMAN_GRAPH, "nineveh")[0].entry.id, "jonah");
});

test("Human Story validation rejects unsourced claims and broken or duplicate identities", () => {
  const invalid = { ...HUMAN_GRAPH, entries: [...HUMAN_GRAPH.entries, { ...HUMAN_GRAPH.entries[0], sourceIds: [], entityIds: ["unknown-person"] }], connections: [...HUMAN_GRAPH.connections, { ...HUMAN_GRAPH.connections[0], id: "broken-connection", to: "missing", sourceIds: [] }] };
  const errors = validateHumanGraph(invalid).join("\n");
  assert.match(errors, /duplicate ID/);
  assert.match(errors, /missing source/);
  assert.match(errors, /unknown entity/);
  assert.match(errors, /broken endpoints/);
});

test("every authored path is grounded in actual, classified graph connections", () => {
  for (const path of HUMAN_PATHS) {
    assert.equal(new Set(path.stops.map(stop => stop.entryId)).size, path.stops.length);
    for (const [index, stop] of path.stops.entries()) {
      assert.ok(HUMAN_GRAPH.entries.some(entry => entry.id === stop.entryId), `${path.id}: existing reading`);
      const previous = path.stops[index - 1];
      if (previous) assert.ok(connectionsFor(HUMAN_GRAPH, previous.entryId).some(({ entry }) => entry.id === stop.entryId), `${path.id}: ${previous.entryId} → ${stop.entryId} is a sourced connection`);
    }
  }
});

test("each of the five worlds opens to actual readings", () => {
  for (const world of ["stories", "witnesses", "saints", "atlas", "voices"]) assert.ok(HUMAN_GRAPH.entries.some(entry => entry.worlds.some(id => id === world)), world);
});
