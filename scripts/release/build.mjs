import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { artifactDigest, fileManifest, git, jsonBytes, objectDigest, policy, readJSON, sourceManifest, verifyManifest } from './artifact.mjs';
import { packExport } from './pack.mjs';
import { candidateErrors } from '../publication-gate.mjs';
import { digest } from '../export-inventory.mjs';

assert.equal(process.platform, policy.platform, 'Canonical artifacts require Linux');
assert.equal(process.arch, policy.architecture);
assert.equal(process.version, policy.node);
assert.equal(execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim(), policy.npm);
assert.equal(process.env.CANONICAL_CONTAINER, policy.container);
assert.equal(process.env.GITHUB_REPOSITORY, policy.repository);
assert.match(process.env.GITHUB_RUN_ID ?? '', /^\d+$/);
assert.match(process.env.GITHUB_RUN_ATTEMPT ?? '', /^\d+$/);
assert.match(process.env.CANONICAL_REPLICA ?? '', /^[12]$/);
assert.equal(git('rev-parse', 'HEAD'), process.env.GITHUB_SHA);
assert.equal(git('status', '--porcelain', '--untracked-files=all'), '', 'Clean checkout required');
for (const file of ['.env', '.env.local', '.env.production', '.env.production.local', '.npmrc']) assert.ok(!existsSync(file), `Unrecorded build input: ${file}`);

// Resolve and check targets before deleting; only this disposable checkout.
const root = process.cwd();
for (const path of ['.next', 'out', '.vercel/output', 'release-candidate']) {
  const target = resolve(path);
  assert.ok(target.startsWith(root + sep) && target !== root);
  rmSync(target, { recursive: true, force: true });
}
mkdirSync('release-candidate/reports', { recursive: true });
const sourceFiles = sourceManifest();
const fonts = readJSON('src/app/fonts/provenance.json');
assert.equal(fonts.license, 'OFL-1.1');
for (const font of fonts.files) {
  assert.match(font.path, /^[A-Za-z]+(?:-OFL\.txt|\.ttf)$/);
  assert.equal(digest(readFileSync('src/app/fonts/' + font.path)), font.checksum, 'Pinned font/license bytes changed');
  if (font.path.endsWith('.txt')) assert.equal(digest(readFileSync('public/fonts/' + font.path)), font.checksum, 'Exported font license changed');
}
const dependencyFiles = fileManifest('node_modules', { dependencyLinks: true });
const environment = { ...policy.environment, SOURCE_DATE_EPOCH: git('show', '-s', '--format=%ct', 'HEAD') };
// Only nonsecret, enumerated compiler inputs reach the build. No Vercel IDs,
// toolbar, deployment URL, NEXT_PUBLIC_* variables, local dotenv or CI secrets.
execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: { PATH: process.env.PATH, HOME: process.env.HOME, ...environment } });
assert.deepEqual(sourceManifest(), sourceFiles, 'Build mutated its tracked inputs');
assert.deepEqual(fileManifest('node_modules', { dependencyLinks: true }), dependencyFiles, 'Build mutated installed dependencies');
assert.deepEqual(candidateErrors('out'), [], 'Publication scope/private-data boundary');
const deploymentConfig = packExport();
const files = fileManifest('out');
const outputFiles = fileManifest('.vercel/output');
const manifest = {
  schemaVersion: 2,
  sourceCommit: git('rev-parse', 'HEAD'), sourceInputDigest: objectDigest(sourceFiles), sourceFiles,
  scopeDigest: objectDigest(readJSON('docs/release/publication-scope.json')),
  toolchain: {
    node: process.version, npm: policy.npm, dependencyDigest: objectDigest(dependencyFiles),
    next: readJSON('node_modules/next/package.json').version,
    typescript: readJSON('node_modules/typescript/package.json').version,
    lockfileDigest: objectDigest(readJSON('package-lock.json')),
  },
  dependencyFiles,
  environment: { container: policy.container, platform: process.platform, architecture: process.arch, configuration: environment, osRelease: readFileSync('/etc/os-release', 'utf8') },
  build: { repository: policy.repository, workflow: policy.workflow, runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT, replica: process.env.CANONICAL_REPLICA },
  builtAt: new Date().toISOString(),
  artifactCount: files.length, artifactDigest: artifactDigest(files), files,
  outputDigest: artifactDigest(outputFiles), outputFiles,
  deploymentConfigDigest: objectDigest(deploymentConfig),
  hostConfiguration: readJSON('vercel.json'),
  externalInputs: { fonts: readJSON('src/app/fonts/provenance.json'), buildNetworkDependencies: [], registry: 'https://registry.npmjs.org/', installation: 'npm ci --include=dev; committed lockfile integrity plus complete installed-file hashes' },
};
verifyManifest(manifest, '.vercel/output/static', '.vercel/output');
writeFileSync('release-candidate/manifest.json', jsonBytes(manifest));
console.log(JSON.stringify({ sourceCommit: manifest.sourceCommit, artifactDigest: manifest.artifactDigest, artifactCount: manifest.artifactCount, manifestDigest: objectDigest(manifest) }));
