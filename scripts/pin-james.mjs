// Offline extraction from public-domain publisher snapshots. Never fetch during a build.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../src/content/scripture/', import.meta.url);
const selections = [
  ['family', 'james-web-mark-6.html', 'MRK06', 3, 'Mark 6:3'],
  ['meeting', 'james-web-galatians-1.html', 'GAL01', 19, 'Galatians 1:19'],
  ['appearance', 'james-web-corinthians-15.html', '1CO15', 7, '1 Corinthians 15:7'],
];
const records = selections.map(([id, file, chapter, verse, reference]) => {
  const html = readFileSync(new URL(file, root), 'utf8').replace(/\r\n/g, '\n');
  const body = html.match(new RegExp(`<span class="verse" id="V${verse}">[^<]*<\\/span>([\\s\\S]*?)(?=<span class="verse"|<ul class='tnav'>)`))?.[1];
  if (!body) throw new Error(`${reference}: publisher structure changed`);
  const text = body.replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  return { id, reference, text, file, sourceUrl: `https://ebible.org/engwebp/${chapter}.htm`, sourceVersion: 'engwebp publisher snapshot 2026-11-04', rights: 'Public domain', checksum: `sha256:${createHash('sha256').update(html).digest('hex')}` };
});
const serialized = `${JSON.stringify(records, null, 2)}\n`;
const target = new URL('james-quotes.json', root);
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== serialized) throw new Error('James quotation snapshot mismatch');
  console.log('James: 3 Scripture quotations match retained publisher snapshots.');
} else writeFileSync(target, serialized);
