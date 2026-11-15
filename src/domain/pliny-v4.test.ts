import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import manifest from "../../public/media/pliny-v4/manifest.json" with { type: "json" };

test("Pliny V4 visual sources retain exact provenance, rights evidence, historical limits and bounded local derivatives", () => {
  assert.equal(manifest.assets.length, 3);
  assert.equal(new Set(manifest.assets.map(asset => asset.id)).size, 3);
  for (const asset of manifest.assets) {
    assert.equal(asset.reviewStatus, "rights-verified");
    assert.ok(asset.creator && asset.creationDate && asset.depictedPeriod && asset.sourceInstitution && asset.sourceRecordUrl && asset.originalAssetUrl);
    assert.ok(asset.rightsStatement && asset.requiredAttribution && asset.reviewedBy && asset.altText && asset.context && asset.historicalFit);
    assert.ok(asset.class === "manuscript" || asset.class === "historical-artifact");
    assert.equal(asset.files.length, 2);
    for (const file of asset.files) {
      assert.match(file.localPath, /^\/media\/pliny-v4\/[a-z]+-\d+\.webp$/);
      const bytes = readFileSync(new URL(`../../public${file.localPath}`, import.meta.url));
      assert.equal(bytes.length, file.bytes);
      assert.equal(`sha256:${createHash("sha256").update(bytes).digest("hex")}`, file.checksum);
      assert.ok(file.width <= 1200 && file.height <= 1800 && file.bytes < 160000);
    }
  }
  const manuscript = manifest.assets.find(asset => asset.id === "pliny-manuscript");
  assert.match(manuscript?.context ?? "", /Books II–III, not the passages quoted here/);
  assert.match(manuscript?.rightsStatement ?? "", /1922.*PDF page 81/);
  const coin = manifest.assets.find(asset => asset.id === "pliny-trajan-coin");
  assert.match(coin?.rightsStatement ?? "", /248058.*isPublicDomain=true.*DP-14287-072/);
  assert.match(coin?.context ?? "", /not the image used in the proceedings/);
  const diploma = manifest.assets.find(asset => asset.id === "pliny-diploma");
  assert.match(diploma?.rightsStatement ?? "", /251396.*isPublicDomain=true.*DP105609/);
  assert.match(diploma?.context ?? "", /different document from the letters/);
});
