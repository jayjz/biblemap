// Offline, deterministic extraction. Publisher HTML stays outside the visitor bundle.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CLAIMS, MOVEMENTS, FEATURES } from '../src/content/lachish/narrative.ts';
const root = new URL('../src/content/lachish/', import.meta.url);
const specifications = [
  ['2KI18', '2 Kings 18', 37, 'web-kings'], ['2KI19', '2 Kings 19', 37, 'web-kings'],
  ['ISA36', 'Isaiah 36', 22, 'web-isaiah'], ['ISA37', 'Isaiah 37', 38, 'web-isaiah'],
  ['2CH32', '2 Chronicles 32', 33, 'web-chronicles'],
];
const clean = html => html.replace(/<a\b[^>]*class="notemark"[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const chapters = specifications.map(([id, reference, count, sourceId]) => {
  const html = readFileSync(new URL(`scripture/${id}.html`, root), 'utf8').replace(/\r\n/g, '\n');
  const verses = [...html.matchAll(/<span class="verse" id="V(\d+)">[^<]*<\/span>([\s\S]*?)(?=<span class="verse"|<ul class='tnav'>)/g)].map(match => ({ number: Number(match[1]), text: clean(match[2]) }));
  if (verses.length !== count || verses.some((verse, index) => verse.number !== index + 1 || !verse.text)) throw new Error(`Incomplete publisher text: ${id}`);
  return { id: id.toLowerCase(), reference, sourceId, translation: 'World English Bible (Protestant edition)', rights: 'Public domain', sourceUrl: `https://ebible.org/engwebp/${id}.htm`, retrievedAt: '2026-11-12', checksum: `sha256:${createHash('sha256').update(html).digest('hex')}`, verses };
});
const sources = JSON.parse(readFileSync(new URL('sources.json', root), 'utf8'));
const outputs = [
  [new URL('scripture.json', root), { chapters }],
  [new URL('../public/media/lachish/evidence.json', import.meta.url), { ...sources, claims: Object.values(CLAIMS), movements: MOVEMENTS, features: FEATURES }],
];
for (const [file, record] of outputs) {
  const expected = `${JSON.stringify(record, null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (readFileSync(file, 'utf8') !== expected) throw new Error(`Lachish pinned data differs: ${file.pathname}`);
  } else writeFileSync(file, expected);
}
console.log(`Lachish: ${chapters.length} complete WEB chapters, ${chapters.reduce((count, c) => count + c.verses.length, 0)} verses; source and claim registry ${process.argv.includes('--check') ? 'verified' : 'written'}.`);
