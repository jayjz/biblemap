// Rebuild local derivatives from the preserved acquisition originals.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const file = path => new URL(path, root);
const manifestFile = file('src/content/human-story-interior-media.json');
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
const assets = [
  {
    id: 'kollwitz-mothers', original: 'artifacts/perpetua-recovery/mothers-loc.jpg',
    title: 'The Mothers (Die Mütter)', creator: 'Käthe Kollwitz; printer Otto Felsing',
    creationDate: '1922, per the Library of Congress catalogue', depictedPeriod: 'Twentieth-century maternal group; not the ancient prisoners',
    sourceInstitution: 'Library of Congress, Prints and Photographs Division',
    sourceRecordUrl: 'https://www.loc.gov/pictures/item/2009630850/',
    originalAssetUrl: 'https://cdn.loc.gov/service/pnp/cph/3a40000/3a42000/3a42700/3a42742r.jpg',
    rightsEvidenceUrl: 'https://commons.wikimedia.org/wiki/File:%22Die_M%C3%BCtter%22_-_K%C3%A4the_Kollwitz_;_Felsing_(printer)._LCCN2009630850.jpg',
    license: 'Public domain', licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    rightsStatement: 'Exact file-level record reproduces LOC no-known-publication-restrictions statement; pre-1931 publication, artist died 1945. Public-domain work and faithful reproduction. Converted to WebP without cropping. Worcester’s alternative reproduction could not be downloaded; the Met facsimile was not used because the current object page restricts its image.',
    requiredAttribution: 'Käthe Kollwitz, The Mothers, 1922. Otto Felsing, printer. Library of Congress, cph.3a42742, LCCN 2009630850.',
    altText: 'Women gather their arms and bodies around children in Kollwitz’s woodcut. An artistic parallel, not Felicity or the prisoners.',
    caption: 'Kollwitz, The Mothers, 1922. A twentieth-century artistic parallel; not a depiction of Felicity.',
    historicalFit: 'A work from the world of War, not Christian martyr reception or evidence of Roman Africa. Its gathering bodies are placed beside the narrator’s account of companionship and care. No connection between the artist and the Passion is claimed.',
    editorialReason: 'Give Felicity’s narrated fear of being left behind a visual counterpoint of people gathering around children, without inventing her likeness.',
  },
  {
    id: 'perpetua-vision', original: 'artifacts/perpetua-recovery/vision-original.png',
    title: 'A contest before waking', creator: 'OpenAI image generation, directed by Codex for BibleMap',
    creationDate: '2026-11-04', depictedPeriod: 'Contemporary interpretation of the reported vision in Passion §10',
    sourceInstitution: 'BibleMap original generated artwork',
    sourceRecordUrl: '/human-story/perpetua/#source-vision-art', originalAssetUrl: '/media/human-story/perpetua-vision.webp',
    license: 'Original generated artwork; project MIT license', licenseUrl: 'https://github.com/jayjz/biblemap/blob/feat/human-story-portal/LICENSE',
    rightsStatement: 'Original generated output from the built-in image tool, commissioned within this user-authorized task. No third-party image used as input. Distributed with the project; provenance verification does not confer historical or theological approval.',
    requiredAttribution: 'BibleMap / OpenAI image generation, directed by Codex, 4 November 2026. Contemporary interpretive artwork.',
    altText: 'Two shifting human shadows in an impossible dark arena with light and a gold-fruited branch. AI-generated interpretation, not historical evidence.',
    caption: 'A contest before waking. AI-generated interpretive artwork, 2026.',
    historicalFit: 'Draws on the arena, changed body and golden fruit in §10. Architecture and shadows are artistic invention; no likeness, ethnic identification, archaeological location or supernatural verification is implied.',
    editorialReason: 'Make the change from expected public punishment to a strange reported contest perceptible during source reading.',
    generator: 'Built-in image_gen tool', model: 'Not exposed by the tool', generatedAt: '2026-11-04',
    prompt: (await readFile(file('artifacts/perpetua-recovery/vision-prompt.txt'), 'utf8')).trim(),
    historicalSources: ['Passion §10; Wallis, ANF III (1885), Argument III.2'],
    knownInaccuracies: ['Imagined arena geometry', 'Overlapping shadows represent transformation artistically', 'No claim to recover the vision’s appearance'],
  },
];
for (const { original, ...asset } of assets) {
  const localPath = `/media/human-story/${asset.id}.webp`;
  const buffer = await sharp(await readFile(file(original))).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const { width, height } = await sharp(buffer).metadata();
  await writeFile(file(`public${localPath}`), buffer);
  const record = { ...asset, localPath, width, height, bytes: buffer.length, checksum: createHash('sha256').update(buffer).digest('hex'), class: 'artistic-depiction', eventIds: [], journeyIds: ['perpetua'], downloadedAt: '2026-11-04', checkedAt: '2026-11-04', reviewStatus: 'rights-verified', reviewedBy: 'Codex: provenance and reuse verification only; interpretive pairing pending human review' };
  const previous = manifest.findIndex(item => item.id === asset.id);
  if (previous < 0) manifest.push(record); else manifest[previous] = record;
  console.log(`${asset.id}: ${width}x${height}, ${buffer.length} bytes`);
}
const unusedRavenna = manifest.find(item => item.id === 'felicitas-mosaic');
if (unusedRavenna) unusedRavenna.editorialReason = 'Retained acquisition record only; no longer displayed. Visual Museum identifies the figure as Felicitas of Rome. Not authenticated as the Felicity in this account. https://www.visualmuseum.gallery/gallery/six-women-martyrs-in-ravenna/';
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
