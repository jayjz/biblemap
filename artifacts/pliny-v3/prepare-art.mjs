import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = process.argv[2];
if (!source) throw new Error('Pass the original generated ribbon image path');
const generation = JSON.parse(await readFile(new URL('./generation.json', import.meta.url), 'utf8'));
const destination = new URL('../../public/media/pliny-v3/', import.meta.url);
await mkdir(destination, { recursive: true });
const original = await readFile(source);
const metadata = await sharp(original).metadata();
if (!metadata.hasAlpha) throw new Error('The generated ribbon must retain transparency');
const files = [];
for (const [name, width] of [['carried-ribbon.webp', 1536], ['carried-ribbon-mobile.webp', 768]]) {
  const data = await sharp(original).resize({ width }).webp({ quality: 78, alphaQuality: 90 }).toBuffer();
  await writeFile(new URL(name, destination), data);
  files.push({ localPath: `/media/pliny-v3/${name}`, width, bytes: data.length, checksum: `sha256:${createHash('sha256').update(data).digest('hex')}` });
}
const manifest = {
  schemaVersion: 1,
  assets: [{ id: 'pliny-carried-ribbon', eventIds: [], journeyIds: ['pliny'], class: 'artistic-depiction', title: 'A carried sentence', creator: 'OpenAI Image Gen, directed for BibleMap by Codex', creationDate: generation.generatedAt, depictedPeriod: 'None: modern symbolic composition', sourceInstitution: 'BibleMap original generated artwork', sourceRecordUrl: 'https://github.com/jayjz/biblemap/blob/feat/pliny-v3-break-the-form/artifacts/pliny-v3/generation.json', originalAssetUrl: 'Built-in Image Gen output retained in the generation session; no third-party source image', license: 'Original AI-assisted project artwork', rightsStatement: 'Created for this project with the built-in Image Gen tool and no supplied or third-party reference assets. Project use of the generated output; no claim that the image is a historical artifact or a human-made ancient work.', requiredAttribution: 'Original AI-assisted symbolic artwork for BibleMap, November 2026', downloadedAt: generation.generatedAt, checksum: `sha256:${createHash('sha256').update(original).digest('hex')}`, localPath: files[0].localPath, altText: '', caption: 'Original AI-assisted symbolic ribbon, not a Roman object or reconstruction.', historicalFit: generation.knownInaccuracies, editorialReason: 'The folded strip accompanies a quotation held between two separately attributed letters. It supplies no historical information.', reviewStatus: 'rights-verified', reviewedBy: 'Codex: generation provenance and absence of third-party inputs checked; historical/editorial narrative review pending', generator: generation.generator, generatedAt: generation.generatedAt, prompt: generation.prompt, referenceAssetIds: [], historicalSources: [], knownInaccuracies: generation.knownInaccuracies, files }],
};
await writeFile(new URL('manifest.json', destination), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ alpha: metadata.hasAlpha, files }));
