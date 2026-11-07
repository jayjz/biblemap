import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('test-results/romanus-research', { recursive: true });
const tasks = [
  ['met-object.json', 'https://collectionapi.metmuseum.org/public/collection/v1/objects/253565'],
  ['tsartsidis.pdf', 'https://era.ed.ac.uk/bitstreams/42a0b8fc-d425-4679-9eba-5ef23c9e853a/download'],
];
for (const [name, url] of tasks) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(`test-results/romanus-research/${name}`, buffer);
  console.log(name, buffer.length);
  if (name === 'met-object.json') {
    const object = JSON.parse(buffer.toString());
    if (!object.isPublicDomain || !object.primaryImage) throw new Error('Met image rights not confirmed');
    const image = await fetch(object.primaryImage, { signal: AbortSignal.timeout(30000) });
    if (!image.ok) throw new Error(`Met image: ${image.status}`);
    const master = Buffer.from(await image.arrayBuffer());
    await mkdir('public/media/romanus', { recursive: true });
    await sharp(master).resize({ width: 1500, withoutEnlargement: true }).webp({ quality: 86 }).toFile('public/media/romanus/daphne-mosaic.webp');
    await sharp(master).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 83 }).toFile('public/media/romanus/daphne-mosaic-small.webp');
    console.log('Rights verified against exact Met API record:', object.objectID, object.primaryImage);
  }
}
