import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { mayReviewDepthImage } from '../src/domain/nineveh-depth-media.ts';

const manifest = JSON.parse(readFileSync('src/features/nineveh/depth-media.json', 'utf8'));
assert.equal(manifest.reviewStatus, 'candidate');
assert.equal(manifest.reviewedBy, null);
assert.equal(new Set(manifest.assets.map(asset => asset.id)).size, manifest.assets.length);
for (const asset of manifest.assets) {
  assert.ok(mayReviewDepthImage(asset), `${asset.id}: verified image rights required`);
  for (const field of ['class', 'creator', 'creationDate', 'depictedPeriod', 'provenance', 'identifier', 'imageRecordUrl', 'originalAssetUrl', 'licenseUrl', 'rightsStatement', 'altText', 'historicalFit', 'editorialReason']) assert.ok(asset[field]?.trim(), `${asset.id}: missing ${field}`);
  assert.equal(asset.localPath, `artifacts/nineveh-depth/media/${asset.id}.webp`);
  assert.equal(asset.reviewUrl, `/review-assets/nineveh-depth/${asset.id}.webp`);
  assert.equal(createHash('sha256').update(readFileSync(asset.localPath)).digest('hex'), asset.checksum, `${asset.id}: checksum`);
  assert.ok(!existsSync(`public/media/nineveh-depth/${basename(asset.localPath)}`));
}
if (process.argv.includes('--production-export')) {
  const exported = readdirSync('out', { recursive: true }).map(String);
  for (const asset of manifest.assets) assert.ok(!exported.some(file => file.endsWith(basename(asset.localPath))));
  assert.ok(!exported.some(file => /nineveh-landscape|review-assets/.test(file)));
  const html = readFileSync('out/experiments/nineveh/index.html', 'utf8');
  assert.ok(!html.includes('nineveh-heading'), 'Ordinary build must gate the encounter');
}
console.log('✓ Nineveh depth: two verified image records and checksums; candidate editorial status; media outside public/' + (process.argv.includes('--production-export') ? '; ordinary export gated' : ''));
