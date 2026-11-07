import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareBuilds, jsonBytes, objectDigest, readJSON, verifyManifest } from './artifact.mjs';

const [firstRoot, secondRoot] = process.argv.slice(2);
const first = readJSON(join(firstRoot, 'release-candidate/manifest.json'));
const second = readJSON(join(secondRoot, 'release-candidate/manifest.json'));
for (const [root, manifest] of [[firstRoot, first], [secondRoot, second]]) verifyManifest(manifest, join(root, '.vercel/output/static'), join(root, '.vercel/output'));
compareBuilds(first, second);
const proof = {
  schemaVersion: 1, status: 'verified',
  sourceCommit: first.sourceCommit, sourceInputDigest: first.sourceInputDigest,
  artifactDigest: first.artifactDigest, outputDigest: first.outputDigest,
  manifests: [objectDigest(first), objectDigest(second)],
  build: first.build, independentReplicas: [first.build.replica, second.build.replica],
};
writeFileSync(join(firstRoot, 'release-candidate/reproducibility.json'), jsonBytes(proof));
console.log(JSON.stringify(proof));
