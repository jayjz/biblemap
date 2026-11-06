import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
for (const number of [13,26]) {
const sayingHtml = readFileSync(`src/content/scripture/thomas-mattison-${number}.html`, 'utf8').replace(/\r\n/g, '\n');
const sayingBody = sayingHtml.match(/<!-- saying-start -->([\s\S]*?)<!-- saying-end -->/)?.[1];
if (!sayingBody || !sayingHtml.includes('committed to the public domain')) throw new Error('Missing Mattison text or rights evidence');
const sayingText = sayingBody.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const sayingRecord = JSON.parse(readFileSync(`src/content/scripture/thomas-mattison-${number}.json`, 'utf8'));
if (sayingRecord.text !== sayingText) throw new Error(`Thomas saying ${number} does not match its retained translator excerpt`);
}
const selections = [['JHN11', [16]], ['JHN14', [5, 6]], ['JHN20', [20, 24, 25, 26, 27, 28, 29, 30, 31]], ['JHN21', [2]], ['MAT10', [3]], ['MRK03', [18]], ['LUK06', [15, 41, 42]], ['ACT01', [13]]];
const records = selections.flatMap(([chapter, verses]) => {
  const file = `thomas-web-${chapter.toLowerCase()}.html`;
  const html = readFileSync(`src/content/scripture/${file}`, 'utf8').replace(/\r\n/g, '\n');
  return verses.map(verse => {
    const body = html.match(new RegExp(`<span class="verse" id="V${verse}">[^<]*<\\/span>([\\s\\S]*?)(?=<span class="verse"|<ul class='tnav'>)`))?.[1];
    if (!body) throw new Error(`${chapter}:${verse}: publisher structure changed`);
    // Footnote callouts are separate from the verse text.
    const text = body.replace(/<a[^>]*class=['"]notemark['"][^>]*>[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
    return { id: `${chapter.toLowerCase()}-${verse}`, chapter, verse, text, file, sourceUrl: `https://ebible.org/engwebp/${chapter}.htm`, sourceVersion: 'engwebp publisher snapshot 2026-11-05', rights: 'Public domain', checksum: `sha256:${createHash('sha256').update(html).digest('hex')}` };
  });
});
const serialized = JSON.stringify(records, null, 2) + '\n';
const target = 'src/content/scripture/thomas-quotes.json';
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== serialized) throw new Error('Thomas quotation snapshot mismatch');
  console.log(`Thomas: ${records.length} WEB verses and sayings 13/26 match retained public-domain source excerpts.`);
} else writeFileSync(target, serialized);
