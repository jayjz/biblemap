import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync, readlinkSync, realpathSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { digest } from '../export-inventory.mjs';

export const readJSON = path => JSON.parse(readFileSync(path, 'utf8'));
export const jsonBytes = value => Buffer.from(JSON.stringify(value) + '\n');
export const objectDigest = value => digest(jsonBytes(value));
export const sha1 = bytes => createHash('sha1').update(bytes).digest('hex');
export const policy = readJSON(new URL('./policy.json', import.meta.url));
export const detachedDecision = path => path === 'docs/release/publication-decision.json' || path === 'docs/release/canonical-acceptance.json' || path.startsWith('docs/release/acceptances/');

/** No symlink, special-file or hidden-file exclusions at the artifact boundary. */
export function fileManifest(root, { dependencyLinks = false } = {}) {
  assert.ok(lstatSync(root).isDirectory(), `Not a directory: ${root}`);
  const files = [];
  function visit(directory, prefix) {
    for (const name of readdirSync(directory).sort()) {
      const path = prefix + name;
      const absolute = join(directory, name);
      const stat = lstatSync(absolute);
      if (stat.isSymbolicLink()) {
        assert.ok(dependencyLinks, `Symlink prohibited: ${path}`);
        assert.ok(realpathSync(absolute).startsWith(resolve(root) + sep), `Dependency link escapes installation: ${path}`);
        const bytes = readFileSync(absolute);
        files.push({ path, bytes: bytes.length, checksum: digest(bytes), link: readlinkSync(absolute) });
        continue;
      }
      if (stat.isDirectory()) visit(absolute, path + '/');
      else {
        assert.ok(stat.isFile(), `Special file prohibited: ${path}`);
        const bytes = readFileSync(absolute);
        files.push({ path, bytes: bytes.length, checksum: digest(bytes) });
      }
    }
  }
  visit(root, '');
  return files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
// Retains the existing inventory's aggregate encoding, without byte normalization.
export const artifactDigest = files => digest(JSON.stringify(files));
export function verifyFiles(root, expected, expectedDigest) {
  assert.equal(artifactDigest(expected), expectedDigest, 'Manifest aggregate hash mismatch');
  const actual = fileManifest(root);
  assert.deepEqual(actual, expected, 'Incomplete or mutated artifact: added, removed or altered files');
  assert.equal(artifactDigest(actual), expectedDigest);
  return actual;
}
export function git(...args) { return execFileSync('git', args, { encoding: 'utf8' }).trim(); }
export function sourceManifest() {
  const paths = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean).filter(path => !detachedDecision(path)).sort();
  return paths.map(path => {
    assert.ok(lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(), `Nonregular input: ${path}`);
    const bytes = readFileSync(path);
    return { path, bytes: bytes.length, checksum: digest(bytes) };
  });
}
export function verifyManifest(manifest, staticRoot, outputRoot) {
  assert.equal(manifest.schemaVersion, 2);
  assert.match(manifest.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(manifest.environment.container, policy.container);
  assert.equal(manifest.environment.platform, policy.platform);
  assert.equal(manifest.environment.architecture, policy.architecture);
  assert.equal(manifest.toolchain.node, policy.node);
  assert.equal(manifest.toolchain.npm, policy.npm);
  assert.equal(manifest.build.repository, policy.repository);
  assert.equal(manifest.build.workflow, policy.workflow);
  assert.match(manifest.build.runId, /^\d+$/);
  assert.match(manifest.build.runAttempt, /^\d+$/);
  assert.equal(objectDigest(manifest.sourceFiles), manifest.sourceInputDigest, 'Source input digest mismatch');
  assert.equal(objectDigest(manifest.dependencyFiles), manifest.toolchain.dependencyDigest, 'Dependency input digest mismatch');
  assert.equal(manifest.artifactCount, manifest.files.length);
  verifyFiles(staticRoot, manifest.files, manifest.artifactDigest);
  verifyFiles(outputRoot, manifest.outputFiles, manifest.outputDigest);
  assert.equal(objectDigest(readJSON(join(outputRoot, 'config.json'))), manifest.deploymentConfigDigest);
  return manifest;
}
export function compareBuilds(first, second) {
  for (const key of ['sourceCommit', 'sourceInputDigest', 'scopeDigest', 'artifactDigest', 'outputDigest', 'deploymentConfigDigest']) assert.equal(first[key], second[key], `Independent Linux builds differ: ${key}`);
  assert.deepEqual(first.files, second.files);
  assert.deepEqual(first.sourceFiles, second.sourceFiles);
  assert.deepEqual(first.toolchain, second.toolchain);
  assert.deepEqual(first.environment, second.environment);
  assert.equal(first.build.runId, second.build.runId);
  assert.equal(first.build.runAttempt, second.build.runAttempt);
  assert.notEqual(first.build.replica, second.build.replica, 'Independent job identities required');
}
