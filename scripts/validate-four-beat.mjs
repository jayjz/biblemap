import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
const record=JSON.parse(readFileSync('src/features/nineveh-four-beat/panorama.json','utf8'));
for (const field of ['id','class','creator','creationDate','depictedPeriod','sourceRecordUrl','license','rightsStatement','requiredAttribution','checksum','localPath','altText','caption','historicalFit','editorialReason','prompt','publicationGate']) assert.ok(record[field]?.trim(),`Missing ${field}`);
assert.equal(record.reviewStatus,'candidate'); assert.equal(record.reviewedBy,null);
assert.equal(record.localPath,'artifacts/nineveh-four-beat/media/panorama.webp');
assert.equal(record.reviewUrl,'/review-assets/four-beat-panorama.webp');
assert.equal(createHash('sha256').update(readFileSync(record.localPath)).digest('hex'),record.checksum);
assert.equal(existsSync('public/media/four-beat-panorama.webp'),false);
if (process.argv.includes('--production-export')) {
  assert.ok(!readdirSync('out',{recursive:true}).map(String).some(path=>/panorama\.webp|four-beat-panorama/.test(path)));
  assert.ok(!readFileSync('out/experiments/nineveh-four-beat/index.html','utf8').includes('class="four-beat"'),'Ordinary export must exclude prototype');
}
console.log('Four-beat panorama: provenance/checksum retained; candidate unapproved; no public asset'+(process.argv.includes('--production-export')?'; ordinary route gated':''));
