import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { THOMAS_MOVEMENTS, THOMAS_REVIEW, THOMAS_SOURCES, THOMAS_SAYING, thomasVerse } from '../content/thomas.ts';

test('Thomas preserves every verse of John 20:24–29 and excludes publisher footnotes', () => {
  execFileSync(process.execPath, ['scripts/pin-thomas.mjs', '--check']);
  assert.deepEqual(THOMAS_MOVEMENTS.flatMap(m => [...m.verseIds]), ['jhn20-24','jhn20-25','jhn20-26','jhn20-27','jhn20-28','jhn20-29']);
  assert.equal(thomasVerse('jhn20-24').text, 'But Thomas, one of the twelve, called Didymus, wasn’t with them when Jesus came.');
  assert.equal(thomasVerse('jhn20-29').text, 'Jesus said to him, “Because you have seen me, you have believed. Blessed are those who have not seen and have believed.”');
  for (const m of THOMAS_MOVEMENTS) for (const id of m.verseIds) assert.doesNotMatch(thomasVerse(id).text, /or, Twin|TR adds|[†§]/);
  assert.throws(() => thomasVerse('invented'));
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
  assert.match(THOMAS_MOVEMENTS[3].note, /does not describe Thomas reaching out/);
});
