// Build-time derivatives only; generated originals remain outside the public export.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root = 'artifacts/thomas/cinematic';
await mkdir(`${root}/originals`, { recursive: true });
await mkdir('public/media/thomas', { recursive: true });
const definitions = JSON.parse(await readFile(`${root}/art-direction.json`, 'utf8'));
const assets = [];
for (const definition of definitions) {
  const original = await readFile(definition.generatedPath);
  await writeFile(`${root}/originals/${definition.id}.png`, original);
  for (const width of [768, 1536]) {
    const bytes = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const meta = await sharp(bytes).metadata();
    const localPath = `/media/thomas/${definition.id}-${width}.webp`;
    await writeFile(`public${localPath}`, bytes);
    assets.push({ id: `${definition.id}-${width}`, eventIds: [], journeyIds: ['thomas'], class: 'interpretive-reconstruction', title: definition.title,
      creator: 'BibleMap / OpenAI built-in image generation, directed by Codex', creationDate: '2026-11-05', depictedPeriod: 'Imagined Early Roman eastern Mediterranean setting; no identified place or event',
      sourceInstitution: 'BibleMap original generated artwork', sourceRecordUrl: '/media/thomas/manifest.json', originalAssetUrl: null,
      license: 'Original AI-generated output; OpenAI Terms of Use, Content section, subject to applicable law',
      rightsStatement: 'Generated for this project at the user’s request. No third-party images supplied or reproduced. No exclusive copyright or historical authenticity claimed.',
      rightsEvidence: 'https://openai.com/policies/terms-of-use/', requiredAttribution: 'AI-generated interpretive environment for BibleMap, November 2026', downloadedAt: '2026-11-05',
      checksum: createHash('sha256').update(bytes).digest('hex'), originalChecksum: createHash('sha256').update(original).digest('hex'), localPath, fileSize: bytes.length, width: meta.width, height: meta.height,
      altText: '', caption: definition.caption, historicalFit: 'General material context only. Architecture, figures, textiles, objects, light and viewpoint are invented; no recovered John 20 setting.', editorialReason: definition.reason,
      reviewStatus: 'rights-verified', reviewedBy: 'Codex · generation provenance, reuse terms and visible anachronism check; human historical/editorial review pending', generator: 'Built-in image_gen.imagegen', model: 'Not exposed by built-in tool',
      generatedAt: '2026-11-05', prompt: definition.prompt, referenceAssetIds: [], historicalSources: [{url:'https://publications.iaa.org.il/atiqot/vol98/iss1/3/',title:'Alexandre, Early Roman dwelling at Nazareth, Atiqot 98 (2020)',inspected:'Abstract only, 2026-11-05',supports:'Regional domestic material context; not Jerusalem, this room, furnishings or biblical event'}],
      knownInaccuracies: ['Invented geometry, furnishings, costume, lighting and human relationships; not archaeologically validated', 'Anonymous interpretive figures are not Thomas, Jesus or documented witnesses', 'A single modern cinematic viewpoint does not reproduce a recorded encounter'],
      selected: definition.selected,
    });
  }
}
await writeFile('public/media/thomas/manifest.json', JSON.stringify({ edition: 'Thomas cinematic draft', historicalReview: 'pending human review', artReferencesAreNotReusedImages: true, assets }, null, 2) + '\n');
console.log(assets.map(a => `${a.id}: ${a.fileSize} bytes`).join('\n'));
