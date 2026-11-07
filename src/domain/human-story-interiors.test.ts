import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { HUMAN_GRAPH } from "../content/human-story.ts";
import { INTERIOR_PASSAGES } from "../content/human-story-interiors.ts";

test("interior quotations resolve to an edition with a locator and reuse statement", () => {
  for (const passage of Object.values(INTERIOR_PASSAGES)) {
    const source = HUMAN_GRAPH.sources.find(
      (item) => item.id === passage.sourceId,
    );
    assert.ok(source, passage.sourceId);
    assert.ok(
      source.locator && source.edition && source.rights && source.limits,
    );
    assert.ok(passage.locator);
  }
});

test("new interior media retain verified file identity, local paths and reuse evidence", () => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../content/human-story-interior-media.json", import.meta.url),
      "utf8",
    ),
  );
  const ids = new Set();
  for (const asset of manifest) {
    assert.ok(!ids.has(asset.id), asset.id);
    ids.add(asset.id);
    for (const field of [
      "title",
      "creator",
      "creationDate",
      "depictedPeriod",
      "sourceInstitution",
      "sourceRecordUrl",
      "originalAssetUrl",
      "license",
      "licenseUrl",
      "rightsStatement",
      "requiredAttribution",
      "downloadedAt",
      "altText",
      "caption",
      "historicalFit",
      "editorialReason",
      "reviewedBy",
    ])
      assert.ok(asset[field], `${asset.id}: ${field}`);
    assert.equal(asset.reviewStatus, "rights-verified");
    assert.equal(asset.class, "artistic-depiction");
    assert.match(asset.localPath, /^\/media\/human-story\/[a-z-]+\.webp$/);
    const bytes = readFileSync(
      new URL(`../../public${asset.localPath}`, import.meta.url),
    );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.checksum,
      asset.id,
    );
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(bytes.length < 350_000, `${asset.id}: mobile-sized derivative`);
  }
});
