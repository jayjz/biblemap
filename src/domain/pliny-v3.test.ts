import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import original from "../content/pliny-record.json" with { type: "json" };
import additional from "../content/pliny-v3-record.json" with { type: "json" };
import art from "../../public/media/pliny-v3/manifest.json" with { type: "json" };
import { PLINY_V3_EXCERPTS, PLINY_V3_PROSE, PLINY_V3_REVIEW, PLINY_V3_SOURCES } from "../content/pliny-v3.ts";
import { HUMAN_GRAPH } from "../content/human-story.ts";

const letters = { ...original.letters, ...additional.letters };
test("the new historical packet is fixed and every selected quotation is exact", () => {
  assert.equal(createHash("sha256").update(readFileSync(new URL("../content/pliny-v3-record.json", import.meta.url))).digest("hex"), "7a90b89e64c2594832f5488728b31c80442c642e21ed2f2055df82f0c9c59210");
  for (const [id, excerpt] of Object.entries(PLINY_V3_EXCERPTS)) {
    assert.ok(letters[excerpt.letter].includes(excerpt.text), id);
    assert.ok(excerpt.locator && excerpt.sourceId && excerpt.speaker, id);
  }
  for (const letter of Object.values(additional.letters)) assert.doesNotMatch(letter, /\]\(https:|\[\\\[/);
  assert.match(additional.normalization, /numbering/);
});

test("every editorial paragraph has source coverage and remains a draft", () => {
  const entry = HUMAN_GRAPH.entries.find(entry => entry.id === "pliny");
  assert.equal(entry?.reviewStatus, "draft");
  assert.equal(PLINY_V3_REVIEW.status, "draft");
  for (const [id, paragraph] of Object.entries(PLINY_V3_PROSE)) {
    assert.ok(paragraph.locator && paragraph.evidenceClass && paragraph.sourceIds.length, id);
    for (const sourceId of paragraph.sourceIds) {
      assert.ok(HUMAN_GRAPH.sources.some(source => source.id === sourceId), sourceId);
      assert.ok(entry?.sourceIds.includes(sourceId), sourceId);
    }
  }
  for (const source of PLINY_V3_SOURCES) assert.ok(source.edition && source.rights && source.limits && source.checkedAt);
});

test("the complete ruling and its conditions remain recoverable after the shorter ending", () => {
  assert.match(original.letters.trajan, /Do not go out of your way to look for them/);
  assert.match(original.letters.trajan, /they must be punished/);
  assert.match(original.letters.trajan, /Anonymous informations ought not/);
  assert.match(PLINY_V3_PROSE.pardon.text, /deny being Christian.*worship of the Roman gods/);
  assert.ok(original.letters.trajan.includes(PLINY_V3_EXCERPTS.pardon.text));
  assert.match(PLINY_V3_PROSE.women.text, /subsequent fate is not given/);
  assert.match(PLINY_V3_PROSE.reception.evidenceClass, /Later Christian reception/);
});

test("the original symbolic art has verified local files, bounded size and no historical pretense", () => {
  for (const asset of art.assets) {
    assert.equal(asset.class, "artistic-depiction");
    assert.equal(asset.reviewStatus, "rights-verified");
    assert.equal(asset.referenceAssetIds.length, 0);
    assert.match(asset.historicalFit, /No historical object/);
    assert.ok(asset.prompt && asset.rightsStatement && asset.requiredAttribution && asset.reviewedBy);
    for (const file of asset.files) {
      const bytes = readFileSync(new URL(`../../public${file.localPath}`, import.meta.url));
      assert.equal(`sha256:${createHash("sha256").update(bytes).digest("hex")}`, file.checksum);
      assert.equal(bytes.length, file.bytes);
      assert.ok(file.bytes < (file.width <= 768 ? 25000 : 60000));
    }
  }
});
