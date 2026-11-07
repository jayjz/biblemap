import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publicationErrors, visitorMaturity } from '../src/domain/publication.ts';
import { contentDigest, inventoryExport } from './export-inventory.mjs';
import { visitorExportErrors } from './validate-visitor-export.ts';
import { readPublicArtifacts } from './release-gate-inventory.ts';
import { authorizationErrors } from './release/authorization.mjs';
import { detachedDecision, git, objectDigest, readJSON, sourceManifest, verifyManifest } from './release/artifact.mjs';

export function candidateErrors(directory = 'out') {
  const scope = readJSON('docs/release/publication-scope.json');
  const artifact = inventoryExport(directory);
  const errors = visitorExportErrors(readPublicArtifacts(directory));
  errors.push(...publicationErrors(scope, { status: 'pending' }, '', '').filter(error => !error.startsWith('Creator publication decision pending:')));
  const selected = scope.routes.filter(route => visitorMaturity(route.maturity)).map(route => route.route);
  for (const route of selected) if (!artifact.routes.some(file => file.route === route && !file.notFound)) errors.push(`Selected route not exported: ${route}`);
  for (const file of artifact.routes) if (!file.notFound && file.route !== '/404/' && !selected.includes(file.route)) errors.push(`Unselected public route: ${file.route}`);
  for (const { route, maturity } of scope.routes) if (!visitorMaturity(maturity) && artifact.files.some(file => file.path.startsWith(route.slice(1)))) errors.push(`Prohibited route representation: ${route}`);
  if (artifact.missingDependencies.length) errors.push('Static export has missing local dependencies');
  for (const flag of ['BIBLEMAP_NINEVEH_REVIEW', 'BIBLEMAP_INTERNAL_REVIEW', 'BIBLEMAP_PUBLICATION_CANARY']) if (process.env[flag]) errors.push(`${flag} is prohibited in a publication candidate`);
  return errors;
}
export function releaseErrors() {
  const directory = existsSync('.vercel/output/static') ? '.vercel/output/static' : 'out';
  const errors = candidateErrors(directory);
  try {
    const manifest = readJSON('release-candidate/manifest.json');
    if (git('rev-parse', 'HEAD') !== manifest.sourceCommit) {
      git('merge-base', '--is-ancestor', manifest.sourceCommit, 'HEAD');
      const changed = git('diff', '--name-only', manifest.sourceCommit, 'HEAD').split('\n').filter(Boolean);
      if (!changed.length || changed.some(path => !detachedDecision(path))) errors.push('Source commit differs beyond a detached acceptance-only change');
    }
    verifyManifest(manifest, directory, '.vercel/output');
    errors.push(...authorizationErrors({
      manifest, proof: readJSON('release-candidate/reproducibility.json'), receipt: readJSON('release-candidate/verification.json'),
      deployment: readJSON('release-candidate/deployment.json'), scope: readJSON('docs/release/publication-scope.json'),
      acceptance: readJSON('docs/release/canonical-acceptance.json'), sourceInputDigest: objectDigest(sourceManifest()),
    }));
  } catch (error) { errors.push(`Canonical publication evidence required: ${error.message}`); }
  return errors;
}
export function assertBuildPublication() {
  const mode = process.env.BIBLEMAP_PUBLICATION_MODE;
  if (mode && !['review', 'release'].includes(mode)) throw new Error('Invalid BIBLEMAP_PUBLICATION_MODE');
  if (process.env.VERCEL_ENV === 'production' || mode === 'release') throw new Error('Publication builds are prohibited: authorize and deploy the existing verified canonical artifact; never rebuild after acceptance.');
}
export { contentDigest };
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--build')) assertBuildPublication();
  else if (process.argv.includes('--postbuild') && process.env.VERCEL_ENV !== 'production' && process.env.BIBLEMAP_PUBLICATION_MODE !== 'release') console.log('Review artifact only; detached creator publication acceptance remains required.');
  else {
    const errors = releaseErrors();
    errors.forEach(error => console.error(error));
    if (errors.length) process.exitCode = 1;
    else console.log('Exact canonical artifact, verified preview and detached creator acceptance match. This check does not publish or authorize preview promotion.');
  }
}
