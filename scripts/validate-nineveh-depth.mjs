import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { mayReviewDepthImage } from '../src/domain/nineveh-depth-media.ts';

// 2026-10-25: Verify identical, rights-cleared image bytes in research and public export.
// The original generated skyline must remain excluded; production uses its own SVG illustration.
const manifest = JSON.parse(readFileSync('src/features/nineveh/depth-media.json', 'utf8'));
assert.equal(manifest.reviewStatus, 'candidate');
assert.equal(manifest.reviewedBy, null);
assert.equal(new Set(manifest.assets.map(asset => asset.id)).size, manifest.assets.length);
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
for (const asset of manifest.assets) {
  assert.ok(mayReviewDepthImage(asset), `${asset.id}: verified image rights required`);
  for (const field of ['class', 'creator', 'creationDate', 'depictedPeriod', 'provenance', 'identifier', 'imageRecordUrl', 'originalAssetUrl', 'licenseUrl', 'rightsStatement', 'altText', 'historicalFit', 'editorialReason']) {
    assert.ok(asset[field]?.trim(), `${asset.id}: missing ${field}`);
  }
  assert.equal(asset.localPath, `artifacts/nineveh-depth/media/${asset.id}.webp`);
  assert.equal(asset.reviewUrl, `/review-assets/nineveh-depth/${asset.id}.webp`);
  assert.equal(asset.publicUrl, `/media/nineveh-depth/${asset.id}.webp`);
  assert.equal(sha(asset.localPath), asset.checksum, `${asset.id}: research checksum`);
  assert.ok(existsSync(`public${asset.publicUrl}`), `${asset.id}: public image missing`);
  assert.equal(sha(`public${asset.publicUrl}`), asset.checksum, `${asset.id}: publication checksum`);
}
if (process.argv.includes('--production-export')) {
  const exported = readdirSync('out', { recursive: true }).map(String);
  for (const asset of manifest.assets) {
    assert.ok(existsSync(`out${asset.publicUrl}`), `${asset.id}: image missing from static export`);
    assert.equal(sha(`out${asset.publicUrl}`), asset.checksum, `${asset.id}: exported image checksum`);
  }
  assert.ok(!exported.some(file => /nineveh-landscape|review-assets/.test(file)), 'Unreviewed landscape or review assets reached public export');
  const homepage = readFileSync('out/index.html', 'utf8');
  assert.ok(homepage.includes('nineveh-heading'), 'Public homepage must contain the Nineveh encounter');
  const experiment = readFileSync('out/experiments/nineveh/index.html', 'utf8');
  assert.ok(!experiment.includes('nineveh-heading'), 'Ordinary build must keep the old experiment gated');
}
console.log(`✓ Nineveh: ${manifest.assets.length} rights-verified images in static media; checksums and original/reproduction separation enforced${process.argv.includes('--production-export') ? '; homepage active; experimental image excluded' : ''}`);
