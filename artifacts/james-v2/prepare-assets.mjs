// Run with the two selected built-in image-generation outputs. No API calls.
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const [galilee, jerusalem] = process.argv.slice(2);
if (!galilee || !jerusalem) throw new Error('Provide selected Galilee and Jerusalem PNG paths');
await mkdir('public/media/james', { recursive: true });
const references = {
  galilee: [
    { url: 'https://publications.iaa.org.il/atiqot/vol98/iss1/3/', title: 'Alexandre, Nazareth settlement history, Atiqot 98 (2020)', inspected: 'Abstract only; full PDF returned 403', supports: 'Early Roman dwelling and subterranean storage; no identified James dwelling' },
    { url: 'https://nazarethvillage.com/about/research-and-archaeology/the-houses/', title: 'Nazareth Village — houses', inspected: 'Modern reconstruction project page', supports: 'Artistic context for limestone domestic courts; not surviving complete ancient buildings' },
  ],
  jerusalem: [
    { url: 'https://hadashot.iaa.org.il/Report_Detail_Eng.aspx?id=15729&print=nopic', title: 'Hagbi and Uziel, Western Wall Foundations (IAA, 2015)', inspected: 'Excavation report', supports: 'First-century retaining walls, stone courses and changing elevation at southwest Temple Mount only' },
    { url: 'https://www.imj.org.il/ar/node/104', title: 'Israel Museum — Jerusalem model', inspected: 'Collection page', supports: 'Artistic reference: monumental precinct and dense domestic roofs; represents 66 CE, later than central James scenes' },
  ],
};
const prompts = {
  galilee: 'Original painterly environmental matte painting. First-century Galilean hill-country village; view through limestone domestic threshold over modest flat-roofed dwellings, courtyard, cistern opening, olive tree, rounded distant hills. A few anonymous people for scale. Mineral-pigment blue-gray shadows, olive green, pale limestone, atmospheric hills. General IAA Nazareth domestic reference only, not a particular dwelling or family scene. No faces identified with James or Jesus, churches, modern objects, writing or counterfeit artifacts. Final edit removes all anachronistic New World cactus and replaces it with Mediterranean shrubs and limestone, preserving composition.',
  jerusalem: 'Original hand-painted environmental matte painting. View through shadowed limestone threshold down stepped lanes over dense flat-roofed domestic settlement toward distant elevated rectilinear Temple precinct and Judean hills. Small anonymous people, ordinary unassigned activity. Gouache/oil texture, rose limestone, mineral ochre, charcoal and indigo shadows. IAA street-retaining wall/elevation reference; museum 66 CE model used only for broad scale contrast. Layout invented. No domes, minarets, churches, crosses, New World plants, modern objects, pseudo-Hebrew or named historical people. Not a reenactment or authenticated reconstruction.',
};
const assets = [];
for (const [place, input] of [['galilee', galilee], ['jerusalem', jerusalem]]) {
  for (const width of [1536, 768]) {
    const localPath = `/media/james/${place}-${width}.webp`;
    const info = await sharp(input).resize(width).webp({ quality: 82 }).toFile(`public${localPath}`);
    const bytes = await readFile(`public${localPath}`);
    assets.push({ id: `james-${place}-${width}`, eventIds: [], journeyIds: ['james'], class: 'interpretive-reconstruction', title: `${place === 'galilee' ? 'A Galilean domestic horizon' : 'Jerusalem from an imagined threshold'} — ${width}px`, creator: 'BibleMap / OpenAI built-in image generation, directed by Codex', creationDate: '2026-11-05', depictedPeriod: 'Interpretation of a first-century setting; no exact year', sourceInstitution: 'BibleMap original generated artwork', sourceRecordUrl: '/media/james/manifest.json', originalAssetUrl: null, license: 'Original AI-generated output; OpenAI Terms of Use, Content section; output ownership subject to applicable law', rightsStatement: 'Generated for this project at the user’s express request. No third-party images supplied or reproduced; historical reference pages were consulted as information only. No exclusive copyright or historical authenticity claimed.', rightsEvidence: 'https://openai.com/policies/terms-of-use/', requiredAttribution: 'AI-generated interpretive painting for BibleMap, November 2026', downloadedAt: '2026-11-05', checksum: createHash('sha256').update(bytes).digest('hex'), localPath, fileSize: info.size, width: info.width, height: info.height, altText: '', caption: 'AI-generated interpretive environment. Buildings, people and viewpoint are imagined.', historicalFit: 'General landscape and material context only. Not a likeness, identified home, meeting place or exact plan.', editorialReason: place === 'galilee' ? 'Establish domestic scale and regional setting before the title of leader' : 'Place the community within a living city before exploring textual relationships', reviewStatus: 'rights-verified', reviewedBy: 'Codex — generation provenance and reuse terms checked; historical/editorial human review pending', generator: 'Built-in image_gen.imagegen', model: 'Not exposed by built-in tool', generatedAt: '2026-11-05', prompt: prompts[place], referenceAssetIds: [], historicalSources: references[place], knownInaccuracies: ['Detailed architecture, clothing, vegetation, human activity and viewpoint are invented, not archaeologically validated', ...(place === 'jerusalem' ? ['Temple proportions and city arrangement are not a surveyed reconstruction', 'Museum model reference depicts 66 CE, not a precise James-era view'] : ['No particular Nazareth dwelling or James family scene is identified', 'Initial cactus anachronism removed by generation edit'])] });
  }
}
await writeFile('public/media/james/manifest.json', JSON.stringify({ edition: 'James cinematic draft V2', historicalReview: 'pending human review', artReferencesAreNotReusedImages: true, assets }, null, 2) + '\n');
console.log(assets.map(({ id, fileSize, checksum }) => ({ id, fileSize, checksum })));
