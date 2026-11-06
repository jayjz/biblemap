import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
interface ThomasAsset { id: string; class: string; localPath: string; checksum: string; width: number; height: number; fileSize: number; selected: boolean; prompt: string; caption: string; historicalFit: string; rightsEvidence: string; reviewStatus: string; referenceAssetIds: string[]; knownInaccuracies: string[] }
const manifest: { historicalReview: string; assets: ThomasAsset[] } = JSON.parse(readFileSync('public/media/thomas/manifest.json','utf8'));
test('Thomas generated art has exact local bytes, bounded derivatives and disclosed limits', async () => {
  assert.match(manifest.historicalReview,/pending human review/);
  assert.equal(new Set(manifest.assets.map(a=>a.id)).size,manifest.assets.length);
  assert.deepEqual(manifest.assets.map(a=>a.localPath.split('/').at(-1)).sort(),readdirSync('public/media/thomas').filter(f=>f.endsWith('.webp')).sort());
  for(const a of manifest.assets) {
    const bytes=readFileSync(`public${a.localPath}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),a.checksum);
    assert.equal(bytes.length,a.fileSize);
    const meta=await sharp(bytes).metadata();
    assert.equal(meta.width,a.width); assert.equal(meta.height,a.height); assert.equal(meta.format,'webp');
    assert.ok([768,1536].includes(a.width));
    assert.ok(a.fileSize<(a.width===768?120000:300000));
    assert.equal(a.class,'interpretive-reconstruction');
    assert.equal(a.reviewStatus,'rights-verified');
    assert.deepEqual(a.referenceAssetIds,[]);
    assert.match(a.caption,/AI-generated interpretive/);
    assert.ok(a.prompt && a.historicalFit && a.knownInaccuracies.length);
    assert.equal(a.rightsEvidence,'https://openai.com/policies/terms-of-use/');
  }
  assert.equal(manifest.assets.filter(a=>a.selected).length,6);
});
