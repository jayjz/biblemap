// Explicit research ingestion only. Builds and tests never call the network.
import { writeFileSync } from 'node:fs';
const chapters = process.argv.includes('--sayings-only') ? [] : ['JHN11', 'JHN14', 'JHN20', 'JHN21', 'MAT10', 'MRK03', 'LUK06', 'ACT01'];
for (const chapter of chapters) {
  const response = await fetch(`https://ebible.org/engwebp/${chapter}.htm`);
  if (!response.ok) throw new Error(`${chapter}: ${response.status}`);
  writeFileSync(`src/content/scripture/thomas-web-${chapter.toLowerCase()}.html`, (await response.text()).replace(/\r\n/g, '\n').split('\n').map(line => line.trimEnd()).join('\n'));
}
const response = await fetch('https://www.gospels.net/thomas');
if (!response.ok) throw new Error(`Mattison: ${response.status}`);
const html = await response.text();
const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const saying = text.match(/Saying 26: Speck and Beam(.*?)Saying 27:/)?.[1]?.trim();
if (!saying || !text.includes('committed to the public domain')) throw new Error('Mattison structure or rights changed');
const rawSaying = html.match(/Saying 26: Speck and Beam([\s\S]*?)Saying 27:/)?.[1];
const rawRights = html.match(/The following translation has been committed to the public domain[^<]*/)?.[0];
if (!rawSaying || !rawRights) throw new Error('Mattison source excerpt structure changed');
writeFileSync('src/content/scripture/thomas-mattison-26.html', `<!-- Selected public-domain source excerpt: https://www.gospels.net/thomas ; retrieved 2026-11-05. HTML framing is retained only to audit extraction. -->\n<p>${rawRights}</p>\n<!-- saying-start -->${rawSaying}<!-- saying-end -->\n`);
writeFileSync('src/content/scripture/thomas-mattison-26.json', JSON.stringify({
  sourceUrl: 'https://www.gospels.net/thomas', reference: 'Gospel of Thomas, saying 26',
  translator: 'Mark M. Mattison', retrievedAt: '2026-11-05', rights: 'Public domain; translator dedication inspected on source page',
  rightsExcerpt: 'The following translation has been committed to the public domain', text: saying,
}, null, 2) + '\n');
console.log('Thomas: eight WEB publisher chapters and one public-domain saying retained.');
