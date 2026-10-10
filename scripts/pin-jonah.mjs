// Deterministic extraction from the committed publisher snapshot; never fetch at build time.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../src/content/scripture/', import.meta.url);
const html = readFileSync(new URL('web-jonah-1.html', root), 'utf8');
const decode = text => text.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const plain = text => decode(text.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const notes = [];
const verses = [...html.matchAll(/<span class="verse" id="V(\d+)">[^<]*<\/span>([\s\S]*?)(?=<span class="verse"|<ul class='tnav'>)/g)].map(([, n, body]) => {
  const number = Number(n);
  const withoutNotes = body.replace(/<a href="#FN\d+" class="notemark">[^<]*<span class="popup">([\s\S]*?)<\/span><\/a>/g, (_, note) => {
    notes.push({ verse: number, text: plain(note) }); return '';
  });
  return { number, text: plain(withoutNotes) };
});
if (verses.length !== 17 || verses.some((v, i) => v.number !== i + 1 || !v.text)) throw new Error('Publisher structure changed; review extraction');
const data = {
  sourceUrl: 'https://ebible.org/engwebp/JON01.htm',
  sourceVersion: 'engwebp snapshot 2026-10-10',
  retrievedAt: '2026-10-10',
  sourceChecksum: `sha256:${createHash('sha256').update(html).digest('hex')}`,
  verses, notes,
};
const serialized = JSON.stringify(data, null, 2) + '\n';
const target = new URL('web-jonah-1.json', root);
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== serialized) throw new Error('Pinned scripture differs from source snapshot');
  console.log('✓ Jonah 1: all 17 verses and translator notes match the pinned publisher snapshot');
} else writeFileSync(target, serialized);
