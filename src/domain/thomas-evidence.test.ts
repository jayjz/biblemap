import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THOMAS_SOURCES, THOMAS_MANUSCRIPTS } from '../content/thomas.ts';
import { THOMAS_DOCUMENTS, THOMAS_EVIDENCE_REVIEW, THOMAS_OPEN_QUESTIONS, THOMAS_SCHOLARLY_READINGS, THOMAS_TRADITIONS, THOMAS_VOICES } from '../content/thomas-evidence.ts';

test('Thomas source encounters retain auditable sources and distinguish relationships',()=>{
  const entries=[...THOMAS_VOICES,...THOMAS_DOCUMENTS,...THOMAS_TRADITIONS,...THOMAS_OPEN_QUESTIONS,...THOMAS_SCHOLARLY_READINGS];
  assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
  for(const entry of entries) for(const id of entry.sourceIds) assert.ok(THOMAS_SOURCES.some(s=>s.id===id),`${entry.id}: orphan source ${id}`);
  assert.ok(THOMAS_VOICES.every(v=>v.relation==='textual-attestation'));
  assert.ok(THOMAS_TRADITIONS.every(t=>t.relation==='later-tradition'));
  assert.ok(THOMAS_SCHOLARLY_READINGS.every(s=>s.relation==='scholarly-interpretation'));
  assert.ok(THOMAS_DOCUMENTS.every(d=>THOMAS_MANUSCRIPTS.some(m=>m.id===d.id)));
  assert.equal(THOMAS_EVIDENCE_REVIEW.status,'draft');
});
