import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publicationErrors, visitorMaturity } from '../src/domain/publication.ts';
import { contentDigest, inventoryExport } from './export-inventory.mjs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
export function releaseErrors({ prebuild = false } = {}) {
  const scope = read('docs/release/publication-scope.json');
  const decision = read('docs/release/publication-decision.json');
  const artifact = prebuild ? undefined : inventoryExport();
  const errors = publicationErrors(scope, decision, contentDigest(), prebuild ? decision.artifactDigest ?? '' : artifact.artifactDigest);
  for (const flag of ['BIBLEMAP_NINEVEH_REVIEW', 'BIBLEMAP_INTERNAL_REVIEW', 'BIBLEMAP_PUBLICATION_CANARY']) if (process.env[flag]) errors.push(`${flag} is prohibited in a publication build`);
  if (artifact) {
    const selected = scope.routes.filter(route => visitorMaturity(route.maturity)).map(route => route.route);
    for (const route of selected) if (!artifact.routes.some(file => file.route === route && !file.notFound)) errors.push(`Selected route not exported: ${route}`);
    for (const file of artifact.routes) if (!file.notFound && file.route !== '/404/' && !selected.includes(file.route)) errors.push(`Unselected public route: ${file.route}`);
    if (artifact.missingDependencies.length) errors.push('Static export has missing local dependencies');
  }
  return errors;
}
export function assertBuildPublication() {
  const mode = process.env.BIBLEMAP_PUBLICATION_MODE;
  if (mode && !['review', 'release'].includes(mode)) throw new Error('Invalid BIBLEMAP_PUBLICATION_MODE');
  if (process.env.VERCEL_ENV === 'production' || mode === 'release') {
    const errors = releaseErrors({ prebuild: true });
    if (errors.length) throw new Error(errors.join('\n'));
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--build')) assertBuildPublication();
  else if (process.argv.includes('--postbuild') && process.env.VERCEL_ENV !== 'production' && process.env.BIBLEMAP_PUBLICATION_MODE !== 'release') console.log('Review artifact only; creator publication acceptance remains separate.');
  else {
    const errors = releaseErrors();
    errors.forEach(error => console.error(error));
    if (errors.length) process.exitCode = 1;
    else console.log('Creator decision matches the exact selected candidate and exported bytes. Source integrity is a separate check.');
  }
}
