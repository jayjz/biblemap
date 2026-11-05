import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { THOMAS_MOVEMENTS, THOMAS_REVIEW, THOMAS_SOURCES, THOMAS_SAYING, THOMAS_SAYINGS, THOMAS_SAYING_13_EXCERPT, THOMAS_MANUSCRIPTS, thomasVerse } from '../content/thomas.ts';

test('Thomas preserves every verse of John 20:24–29 and excludes publisher footnotes', () => {
  execFileSync(process.execPath, ['scripts/pin-thomas.mjs', '--check']);
  assert.deepEqual(THOMAS_MOVEMENTS.flatMap(m => [...m.verseIds]), ['jhn20-24','jhn20-25','jhn20-26','jhn20-27','jhn20-28','jhn20-29']);
  assert.equal(thomasVerse('jhn20-24').text, 'But Thomas, one of the twelve, called Didymus, wasn’t with them when Jesus came.');
  assert.equal(thomasVerse('jhn20-29').text, 'Jesus said to him, “Because you have seen me, you have believed. Blessed are those who have not seen and have believed.”');
  for (const m of THOMAS_MOVEMENTS) for (const id of m.verseIds) assert.doesNotMatch(thomasVerse(id).text, /or, Twin|TR adds|[†§]/);
  assert.throws(() => thomasVerse('invented'));
});

test('the additional saying and witness explorer keep Coptic text distinct from partial Greek survival', () => {
  assert.ok(THOMAS_SAYINGS[13].text.includes(THOMAS_SAYING_13_EXCERPT));
  assert.match(THOMAS_SAYINGS[13].rights,/Public domain/);
  assert.match(THOMAS_SAYINGS[13].text,/told him three things/);
  assert.equal(THOMAS_MANUSCRIPTS.length,4);
  assert.equal(THOMAS_MANUSCRIPTS.find(m=>m.id==='nhc')?.thirteen,'Preserved');
  assert.match(THOMAS_MANUSCRIPTS.find(m=>m.id==='oxy1')?.twentySix ?? '',/Ending only/);
  for(const m of THOMAS_MANUSCRIPTS.filter(m=>m.language==='Greek')) assert.match(m.thirteen,/Not preserved/);
  assert.ok(THOMAS_MANUSCRIPTS.every(m=>THOMAS_SOURCES.some(s=>s.id===m.sourceId)));
});

test('Thomas source distinctions, witness identities, rights and review boundary remain explicit', () => {
  const sources = new Set(THOMAS_SOURCES.map(s => s.id));
  assert.equal(sources.size, THOMAS_SOURCES.length);
  for (const s of THOMAS_SOURCES) assert.ok(s.url.startsWith('https://') && s.locator && s.edition && s.rights && s.limits && s.checkedAt);
  for (const m of THOMAS_MOVEMENTS) assert.ok(m.sourceIds.every(id => sources.has(id)));
  assert.equal(THOMAS_REVIEW.status, 'draft');
  assert.equal(THOMAS_REVIEW.indexed, false);
  assert.match(THOMAS_SOURCES.find(s => s.id === 'thomas-oxy654')?.url ?? '', /62840/);
  assert.match(THOMAS_SOURCES.find(s => s.id === 'thomas-oxy655')?.url ?? '', /62839/);
  assert.match(THOMAS_SAYING.rights, /Public domain/);
  assert.match(THOMAS_SAYING.text, /speck.*beam/);
  assert.doesNotMatch(THOMAS_SAYING.text, /&[a-z]+;|&#\d+;/);
  assert.match(THOMAS_MOVEMENTS[3].note, /does not describe Thomas reaching out/);
});
