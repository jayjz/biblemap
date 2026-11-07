import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import sharp from "sharp";

interface VisualReference {
  url: string;
  title: string;
  inspected: string;
  supports: string;
}

interface JamesVisual {
  id: string;
  journeyIds: string[];
  class: string;
  title: string;
  creator: string;
  creationDate: string;
  depictedPeriod: string;
  sourceInstitution: string;
  sourceRecordUrl: string;
  originalAssetUrl: string | null;
  license: string;
  rightsStatement: string;
  rightsEvidence: string;
  requiredAttribution: string;
  downloadedAt: string;
  checksum: string;
  localPath: string;
  fileSize: number;
  width: number;
  height: number;
  altText: string;
  caption: string;
  historicalFit: string;
  editorialReason: string;
  reviewStatus: string;
  reviewedBy: string;
  generator: string;
  model: string;
  generatedAt: string;
  prompt: string;
  referenceAssetIds: string[];
  historicalSources: VisualReference[];
  artisticReferences: VisualReference[];
  knownInaccuracies: string[];
}

const mediaDirectory = resolve("public/media/james");
const manifest: {
  historicalReview: string;
  artReferencesAreNotReusedImages: boolean;
  assets: JamesVisual[];
} = JSON.parse(readFileSync(resolve(mediaDirectory, "manifest.json"), "utf8"));

test("James visual inventory matches the local responsive images and their recorded bytes", async () => {
  assert.equal(manifest.assets.length, 4);
  assert.equal(new Set(manifest.assets.map(asset => asset.id)).size, 4);
  assert.deepEqual(
    manifest.assets.map(asset => asset.localPath.split("/").at(-1)).sort(),
    readdirSync(mediaDirectory).filter(name => name.endsWith(".webp")).sort(),
  );
  for (const asset of manifest.assets) {
    assert.match(asset.localPath, /^\/media\/james\/(galilee|jerusalem)-(768|1536)\.webp$/);
    const bytes = readFileSync(resolve(`public${asset.localPath}`));
    assert.equal(bytes.length, asset.fileSize, `${asset.id}: file size`);
    assert.match(asset.checksum, /^[a-f0-9]{64}$/);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.checksum, `${asset.id}: SHA-256`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, asset.width, `${asset.id}: width`);
    assert.equal(metadata.height, asset.height, `${asset.id}: height`);
    assert.equal(metadata.pages ?? 1, 1, `${asset.id}: static image`);
  }
});

test("generated James environments retain provenance, rights evidence and historical limitations", () => {
  assert.equal(manifest.artReferencesAreNotReusedImages, true);
  assert.match(manifest.historicalReview, /pending human review/i);
  for (const asset of manifest.assets) {
    for (const value of [asset.title, asset.creator, asset.creationDate, asset.depictedPeriod,
      asset.sourceInstitution, asset.license, asset.rightsStatement, asset.requiredAttribution,
      asset.downloadedAt, asset.caption, asset.historicalFit, asset.editorialReason,
      asset.reviewedBy, asset.generator, asset.model, asset.generatedAt, asset.prompt]) {
      assert.ok(typeof value === "string" && value.trim(), `${asset.id}: required provenance`);
    }
    assert.deepEqual(asset.journeyIds, ["james"]);
    assert.equal(asset.class, "interpretive-reconstruction");
    assert.equal(asset.sourceRecordUrl, "/media/james/manifest.json");
    assert.equal(asset.originalAssetUrl, null, "original output must not be attributed to a reference image");
    assert.deepEqual(asset.referenceAssetIds, []);
    assert.match(asset.sourceInstitution, /original generated artwork/i);
    assert.match(asset.caption, /AI-generated interpretive/i);
    assert.match(asset.caption, /imagined/i);
    assert.match(asset.rightsStatement, /No third-party images supplied or reproduced/i);
    assert.equal(new URL(asset.rightsEvidence).protocol, "https:");
    assert.equal(asset.reviewStatus, "rights-verified");
    assert.match(asset.reviewedBy, /human review pending/i);
    assert.ok(asset.knownInaccuracies.length > 0);
    assert.match(asset.knownInaccuracies.join(" "), /invented.*not archaeologically validated/i);
    assert.ok(asset.historicalSources.length >= 1);
    assert.ok(asset.artisticReferences.length >= 1);
    assert.ok(asset.historicalSources.every(reference => /iaa\.org\.il/.test(new URL(reference.url).hostname)));
    assert.ok(asset.artisticReferences.every(reference => /reconstruction|artistic reference/i.test(reference.inspected + " " + reference.supports)));
    for (const reference of [...asset.historicalSources, ...asset.artisticReferences]) {
      assert.equal(new URL(reference.url).protocol, "https:");
      assert.ok(reference.title && reference.inspected && reference.supports);
      assert.notEqual(reference.url, asset.sourceRecordUrl);
    }
  }
});

test("each James environment has bounded mobile and desktop derivatives", () => {
  for (const place of ["galilee", "jerusalem"]) {
    const variants = manifest.assets.filter(asset => asset.localPath.includes(`/${place}-`));
    assert.deepEqual(variants.map(asset => asset.width).sort((a, b) => a - b), [768, 1536]);
    for (const asset of variants) {
      assert.equal(asset.width / asset.height, 1.5, `${asset.id}: consistent crop`);
      assert.ok(asset.fileSize <= (asset.width === 768 ? 150_000 : 450_000), `${asset.id}: transfer budget`);
    }
    const mobile = variants.find(asset => asset.width === 768);
    const desktop = variants.find(asset => asset.width === 1536);
    assert.ok(mobile && desktop);
    assert.ok(mobile.fileSize < desktop.fileSize);
  }
  assert.ok(manifest.assets.reduce((sum, asset) => sum + asset.fileSize, 0) < 1_000_000,
    "the complete responsive environment set stays below one megabyte");
});
