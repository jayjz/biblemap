import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { artifactDigest, compareBuilds, fileManifest, objectDigest, policy, sha1, sourceManifest, verifyFiles } from './artifact.mjs';
import { authorizationErrors } from './authorization.mjs';
import { staticConfig } from './pack.mjs';
import { deploymentResult, verifyUpload } from './preview.mjs';
import { assertBuildPublication, candidateErrors } from '../publication-gate.mjs';

const scope = { schemaVersion: 1, entries: {}, routes: [{ route: '/', maturity: 'provisional', limitations: ['synthetic-fixture'] }] };
const source = 'a'.repeat(40);
function fixture() {
  const manifest = {
    schemaVersion: 2, sourceCommit: source, sourceFiles: [], sourceInputDigest: objectDigest([]),
    scopeDigest: objectDigest(scope), dependencyFiles: [],
    environment: { container: policy.container, platform: 'linux', architecture: 'x64' },
    toolchain: { node: policy.node, npm: policy.npm, dependencyDigest: objectDigest([]) },
    build: { repository: policy.repository, workflow: policy.workflow, runId: '123', runAttempt: '1', replica: '1' },
    artifactDigest: objectDigest('synthetic-artifact'), outputDigest: objectDigest('synthetic-output'), artifactCount: 1,
    files: [{ path: 'index.html', bytes: 7, checksum: objectDigest('fixture') }],
  };
  const proof = { status: 'verified', sourceCommit: source, sourceInputDigest: manifest.sourceInputDigest, artifactDigest: manifest.artifactDigest, outputDigest: manifest.outputDigest, build: manifest.build, manifests: [objectDigest(manifest), objectDigest({ ...manifest, build: { ...manifest.build, replica: '2' } })], independentReplicas: ['1', '2'] };
  const deployment = { id: 'dpl_fixture', projectId: policy.projectId, teamId: policy.teamId, target: null, readyState: 'READY', url: 'synthetic-fixture.vercel.app', meta: { canonicalArtifact: manifest.artifactDigest, canonicalManifest: objectDigest(manifest), canonicalOutput: manifest.outputDigest, canonicalSource: source, canonicalRun: '123/1' } };
  const results = [{ path: 'index.html', checksum: manifest.files[0].checksum }];
  const receipt = { schemaVersion: 1, status: 'verified', manifestDigest: objectDigest(manifest), deploymentId: deployment.id, deploymentUrl: deployment.url, artifactDigest: manifest.artifactDigest, outputDigest: manifest.outputDigest, uploadIdentity: 'complete-prebuilt-file-tree-sha1', http: { status: 'verified', verifiedFiles: 1, results, resultsDigest: objectDigest(results) } };
  const acceptance = { schemaVersion: 2, status: 'accepted', actor: 'SYNTHETIC-TEST-ONLY', decidedAt: '2026-11-07T00:00:00Z', evidence: 'in-memory unit fixture, no human approval', sourceCommit: source, sourceInputDigest: manifest.sourceInputDigest, artifactDigest: manifest.artifactDigest, outputDigest: manifest.outputDigest, manifestDigest: objectDigest(manifest), scopeDigest: manifest.scopeDigest, previewDeploymentId: deployment.id, verificationDigest: objectDigest(receipt), build: manifest.build, routes: ['/'], acceptedLimitations: ['synthetic-fixture'] };
  return structuredClone({ manifest, proof, deployment, receipt, scope, acceptance, sourceInputDigest: manifest.sourceInputDigest });
}
test('synthetic exact artifact acceptance passes; pending and historical acceptance do not transfer', () => {
  assert.deepEqual(authorizationErrors(fixture()), []);
  for (const acceptance of [{ schemaVersion: 2, status: 'pending' }, { status: 'accepted', actor: 'old-record' }]) assert.ok(authorizationErrors({ ...fixture(), acceptance }).length);
});
for (const [name, mutate] of [
  ['source SHA changes', f => { f.manifest.sourceCommit = 'b'.repeat(40); }],
  ['artifact digest changes', f => { f.manifest.artifactDigest = objectDigest('changed'); }],
  ['manifest identity changes', f => { f.manifest.builtAt = 'different'; }],
  ['source bytes change', f => { f.sourceInputDigest = objectDigest('changed'); }],
  ['scope changes', f => { f.scope.routes[0].limitations.push('new'); }],
  ['deployment identity differs', f => { f.deployment.id = 'dpl_other'; }],
  ['approval targets another candidate', f => { f.acceptance.manifestDigest = objectDigest('other'); }],
  ['rebuild after approval, even with identical bytes', f => { f.manifest.build.runId = '124'; }],
  ['rerun after approval', f => { f.manifest.build.runAttempt = '2'; }],
  ['HTTP verification incomplete', f => { f.receipt.http.verifiedFiles = 0; }],
  ['HTTP evidence altered', f => { f.receipt.http.results[0].checksum = 'bad'; }],
  ['upload verification unavailable', f => { f.receipt.uploadIdentity = 'spot-check'; }],
  ['unapproved preview promotion', f => { f.operation = 'promote-preview'; }],
  ['production deployment substituted', f => { f.deployment.target = 'production'; }],
  ['different project substituted', f => { f.deployment.projectId = 'prj_other'; }],
]) test(`release authorization rejects: ${name}`, () => {
  const f = fixture(); mutate(f); assert.ok(authorizationErrors(f).length, name);
});
test('Windows/Linux byte differences do not invalidate a verified canonical Linux candidate', () => {
  const f = fixture();
  assert.notEqual(objectDigest('Windows generated RSC path'), f.manifest.artifactDigest);
  assert.deepEqual(authorizationErrors({ ...f, windowsCompatibility: { status: 'passed', artifactDigest: objectDigest('Windows generated RSC path') } }), []);
});
test('every regular artifact is covered; hidden/add/remove/alter and incorrect/incomplete manifests fail closed', () => {
  const root = mkdtempSync(join(tmpdir(), 'release-bytes-'));
  try {
    writeFileSync(join(root, 'index.html'), 'fixture');
    writeFileSync(join(root, '.hidden'), 'hidden');
    const files = fileManifest(root), hash = artifactDigest(files);
    assert.equal(files.length, 2);
    verifyFiles(root, files, hash);
    assert.throws(() => verifyFiles(root, files, objectDigest('wrong')), /hash mismatch/);
    assert.throws(() => verifyFiles(root, files.slice(1), artifactDigest(files.slice(1))), /Incomplete/);
    writeFileSync(join(root, 'new.txt'), 'added');
    assert.throws(() => verifyFiles(root, files, hash), /Incomplete/);
    rmSync(join(root, 'new.txt'));
    writeFileSync(join(root, 'index.html'), 'altered');
    assert.throws(() => verifyFiles(root, files, hash), /Incomplete/);
    rmSync(join(root, '.hidden'));
    assert.throws(() => verifyFiles(root, files, hash), /Incomplete/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('full prebuilt upload identity rejects missing, additional or replaced provider files', () => {
  const root = mkdtempSync(join(tmpdir(), 'release-upload-'));
  try {
    writeFileSync(join(root, 'config.json'), '{"version":3}');
    const entry = { name: 'config.json', type: 'file', size: 13, uid: sha1(readFileSync(join(root, 'config.json'))) };
    const tree = [{ name: 'src', type: 'directory', children: [{ name: '.vercel', type: 'directory', children: [{ name: 'output', type: 'directory', children: [entry, { name: 'empty', type: 'directory' }] }] }] }];
    assert.equal(verifyUpload(root, tree).fileCount, 1);
    assert.throws(() => verifyUpload(root, []));
    tree.push({ name: 'unexpected.txt', type: 'file', uid: '1'.repeat(40) });
    assert.throws(() => verifyUpload(root, tree));
    tree.pop();
    entry.uid = '0'.repeat(40);
    assert.throws(() => verifyUpload(root, tree));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('approval-only records do not change the raw build-input identity; source edits do', () => {
  const directory = mkdtempSync(join(tmpdir(), 'release-inputs-'));
  const original = process.cwd();
  try {
    mkdirSync(join(directory, 'docs/release'), { recursive: true });
    writeFileSync(join(directory, 'source.txt'), 'raw fixture\n');
    writeFileSync(join(directory, 'docs/release/canonical-acceptance.json'), '{"status":"pending"}');
    execFileSync('git', ['init', '--quiet'], { cwd: directory });
    execFileSync('git', ['add', '.'], { cwd: directory });
    process.chdir(directory);
    const before = objectDigest(sourceManifest());
    writeFileSync('docs/release/canonical-acceptance.json', 'detached synthetic test bytes, no approval');
    assert.equal(objectDigest(sourceManifest()), before);
    writeFileSync('source.txt', 'changed fixture\n');
    assert.notEqual(objectDigest(sourceManifest()), before);
  } finally { process.chdir(original); rmSync(directory, { recursive: true, force: true }); }
});
test('pinned CLI JSON result is parsed without following suggested production commands', () => {
  const result = { status: 'ok', deployment: { id: 'dpl_fixture', url: 'https://fixture.vercel.app', target: null }, next: [{ command: 'vercel deploy --prod' }] };
  assert.equal(deploymentResult(JSON.stringify(result)).id, 'dpl_fixture');
  result.deployment.target = 'production';
  assert.throws(() => deploymentResult(JSON.stringify(result)));
});
test('Linux replicas must match full inputs, toolchain, output and configuration', () => {
  const first = fixture().manifest, second = structuredClone(first);
  second.build.replica = '2';
  compareBuilds(first, second);
  second.toolchain.npm = 'different'; assert.throws(() => compareBuilds(first, second));
});
test('production or release rebuilds are blocked while provisional review builds are allowed', () => {
  const before = { VERCEL_ENV: process.env.VERCEL_ENV, BIBLEMAP_PUBLICATION_MODE: process.env.BIBLEMAP_PUBLICATION_MODE };
  try {
    delete process.env.VERCEL_ENV; process.env.BIBLEMAP_PUBLICATION_MODE = 'review'; assertBuildPublication();
    process.env.VERCEL_ENV = 'production'; assert.throws(assertBuildPublication, /never rebuild/);
    delete process.env.VERCEL_ENV; process.env.BIBLEMAP_PUBLICATION_MODE = 'release'; assert.throws(assertBuildPublication, /never rebuild/);
  } finally { for (const [key, value] of Object.entries(before)) if (value === undefined) delete process.env[key]; else process.env[key] = value; }
});
test('candidate boundary rejects prohibited RSC routes and private payloads before upload', () => {
  const root = mkdtempSync(join(tmpdir(), 'release-boundary-'));
  try {
    mkdirSync(join(root, 'demo'));
    writeFileSync(join(root, 'index.html'), '<h1>Fixture</h1>');
    writeFileSync(join(root, 'demo', 'index.txt'), '"reviewStatus":"draft"');
    const errors = candidateErrors(root);
    assert.ok(errors.some(error => error.includes('Prohibited route representation: /demo/')));
    assert.ok(errors.some(error => error.includes('private editorial data exposed')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('prebuilt routing preserves redirects, errors, Linux RSC paths and rejects unmapped configuration', () => {
  const host = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const files = [{ path: 'index.html' }, { path: 'jonah/index.html' }, { path: 'jonah/__next.jonah.__PAGE__.txt' }];
  const config = staticConfig(files, host);
  assert.ok(config.routes.some(rule => rule.dest === '/jonah/index.html'));
  assert.ok(config.routes.some(rule => rule.headers?.Location === '/jonah/'));
  assert.equal(config.routes.at(-1).status, 404);
  assert.ok(config.routes.some(rule => rule.handle === 'filesystem'));
  assert.throws(() => staticConfig(files, { ...host, headers: [] }), /Unmapped/);
});
