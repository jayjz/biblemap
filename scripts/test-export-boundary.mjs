import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { inventoryExport } from './export-inventory.mjs';

// Adversarial fixtures touch source temporarily, never approvals or production settings.
// Do not run concurrently with another build/editor. Originals are restored on failure.
const marker = `UNPUBLISHED-${randomUUID()}`;
const fixtures = {
  'src/content/jonah.ts': `\nObject.assign(JONAH.scenes[0], { title: { status: 'placeholder', slot: '${marker}-title' }, narrative: { status: 'written', text: '${marker}-narrative', authorId: '${marker}-author', review: { status: 'draft' } }, privateInterview: '${marker}-interview' });\nif (JONAH.scenes[0].readingGuide) Object.assign(JONAH.scenes[0].readingGuide, { status: 'internal-draft', title: '${marker}-companion-title', question: '${marker}-companion-question', context: '${marker}-companion' });\nObject.assign(JONAH.geography[0].explanation, { slot: '${marker}-geography' });\nObject.assign(JONAH.media[0], { privateRightsNote: '${marker}-media' });\n`,
  'src/content/human-story.ts': `\nHUMAN_GRAPH.entries = [...HUMAN_GRAPH.entries, { ...HUMAN_GRAPH.entries[0], id: 'unpublished-release-fixture', introduction: '${marker}-reading' }];\nObject.assign(HUMAN_GRAPH.entries[0], { privateResearch: '${marker}-research' });\n`,
};
const originals = new Map(Object.keys(fixtures).map(path => [path, readFileSync(path, 'utf8')]));
try {
  for (const [path, suffix] of Object.entries(fixtures)) writeFileSync(path, originals.get(path) + suffix);
  const built = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, BIBLEMAP_PUBLICATION_MODE: 'review' } });
  if (built.error) throw built.error;
  assert.equal(built.status, 0, 'Adversarial export must finish before exclusion can be asserted');
  const report = inventoryExport('out', [marker, 'unpublished-release-fixture']);
  assert.deepEqual(report.leaks, [], JSON.stringify(report.leaks));
  assert.ok(!report.files.some(file => file.path.includes('unpublished-release-fixture')));
  console.log(`Adversarial export: ${report.files.length} artifacts scanned; injected private author, companion, geography, media metadata, future field and unselected reading absent.`);
} finally {
  for (const [path, original] of originals) writeFileSync(path, original);
}
console.log('Source fixtures restored. Rebuild the ordinary candidate before release checks or browser tests.');
