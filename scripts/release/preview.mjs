import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { digest } from '../export-inventory.mjs';
import { fileManifest, jsonBytes, objectDigest, policy, readJSON, sha1, verifyManifest } from './artifact.mjs';
import { verifyDeployment, verifyReproducibility } from './authorization.mjs';
import { candidateErrors } from '../publication-gate.mjs';

export function flattenTree(tree, prefix = '') {
  assert.ok(Array.isArray(tree), 'Deployment file tree unavailable');
  return tree.flatMap(entry => {
    if (entry.type === 'directory') return flattenTree(entry.children ?? [], prefix + entry.name + '/');
    assert.equal(entry.type, 'file', 'Unknown provider file type');
    return [{ path: prefix + entry.name, ...(entry.size === undefined ? {} : { size: entry.size }), sha: entry.uid }];
  });
}
export function verifyUpload(outputRoot, tree) {
  const expected = fileManifest(outputRoot).map(file => ({ path: 'src/.vercel/output/' + file.path, size: file.bytes, sha: sha1(readFileSync(join(outputRoot, file.path))) }));
  const actual = flattenTree(tree).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  assert.deepEqual(actual.map(({ path, sha }) => ({ path, sha })), expected.map(({ path, sha }) => ({ path, sha })), 'Remote prebuilt upload tree differs; do not infer remote byte equality');
  for (let i = 0; i < actual.length; i++) if (actual[i].size !== undefined) assert.equal(actual[i].size, expected[i].size);
  return { fileCount: actual.length, digest: objectDigest(actual), reportedSizes: actual.filter(file => file.size !== undefined).length, limitation: 'Vercel v6 tree wraps prebuilt uploads in src/ and may omit lengths; complete path/SHA1 identities are verified, with lengths checked when exposed. This is upload identity, not CDN byte enumeration.' };
}
const runCLI = args => execFileSync(process.execPath, [process.env.VERCEL_CLI_ENTRY, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const api = path => JSON.parse(runCLI(['api', path, '--scope', 'elliotandersons-projects']));
const deploymentIdentity = deployment => ({
  id: deployment.id, projectId: deployment.projectId, teamId: deployment.teamId ?? deployment.ownerId,
  readyState: deployment.readyState, target: deployment.target, url: deployment.url,
  meta: Object.fromEntries(['canonicalArtifact', 'canonicalManifest', 'canonicalOutput', 'canonicalSource', 'canonicalRun'].map(key => [key, deployment.meta?.[key]])),
});
export function deploymentResult(stdout) {
  const result = JSON.parse(stdout);
  assert.equal(result.status, 'ok');
  assert.match(result.deployment.id, /^dpl_[A-Za-z0-9]+$/);
  assert.match(result.deployment.url, /^https:\/\/[a-z0-9-]+\.vercel\.app$/);
  assert.ok(result.deployment.target === null || result.deployment.target === 'preview');
  return result.deployment;
}

export function verifyProvenance(manifest, archive = 'canonical-release.tgz') {
  // The signed archive, its workflow/source identity, and extracted bytes must
  // agree. A successful attestation for an unrelated archive is insufficient.
  execFileSync('gh', ['attestation', 'verify', archive, '--repo', policy.repository, '--signer-workflow', `${policy.repository}/${policy.workflow}`, '--source-digest', manifest.sourceCommit, '--signer-digest', manifest.sourceCommit, '--deny-self-hosted-runners'], { stdio: 'inherit' });
  const run = JSON.parse(execFileSync('gh', ['run', 'view', manifest.build.runId, '--repo', policy.repository, '--json', 'headSha,status,conclusion'], { encoding: 'utf8' }));
  assert.equal(run.headSha, manifest.sourceCommit);
  assert.equal(run.status, 'completed');
  assert.equal(run.conclusion, 'success');
  const directory = mkdtempSync(join(tmpdir(), 'biblemap-provenance-'));
  try {
    execFileSync('tar', ['-xzf', resolve(archive), '-C', directory]);
    assert.deepEqual(readJSON(join(directory, 'release-candidate/manifest.json')), manifest);
    assert.deepEqual(readJSON(join(directory, 'release-candidate/reproducibility.json')), readJSON('release-candidate/reproducibility.json'));
    verifyManifest(manifest, join(directory, '.vercel/output/static'), join(directory, '.vercel/output'));
  } finally { rmSync(directory, { recursive: true, force: true }); }
  return { archiveDigest: digest(readFileSync(archive)), sourceCommit: manifest.sourceCommit, workflow: policy.workflow, runId: manifest.build.runId };
}

export async function verifyHTTP(manifest, origin) {
  assert.match(origin, /^https:\/\/[a-z0-9-]+\.vercel\.app$/);
  const results = [];
  // Every local artifact is fetched. This checks known paths, not the absence
  // of unknown remote files or Vercel's internal deployed filesystem.
  for (const file of manifest.files) {
    const html = file.path.endsWith('index.html');
    const route = html ? '/' + file.path.slice(0, -'index.html'.length) : '/' + file.path;
    const response = await fetch(origin + route, { redirect: 'manual', headers: { 'Accept-Encoding': 'identity' }, signal: AbortSignal.timeout(30000) });
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, ['404.html', '404/index.html'].includes(file.path) ? 404 : 200, `${route}: HTTP ${response.status}`);
    assert.equal(bytes.length, file.bytes, `${route}: served byte length changed`);
    assert.equal(digest(bytes), file.checksum, `${route}: served bytes changed`);
    results.push({ path: file.path, route, status: response.status, checksum: digest(bytes), contentType: response.headers.get('content-type'), contentEncoding: response.headers.get('content-encoding') });
  }
  for (const { route, maturity } of readJSON('docs/release/publication-scope.json').routes) {
    if (!['complete', 'provisional'].includes(maturity)) {
      for (const suffix of ['', 'index.txt', '__next.' + route.split('/').filter(Boolean).join('.') + '.__PAGE__.txt']) {
        const response = await fetch(origin + route + suffix, { redirect: 'manual' });
        assert.equal(response.status, 404, `Prohibited route accessible: ${route}${suffix}`);
      }
    } else if (route !== '/') {
      for (const path of [route.slice(0, -1), route.slice(0, -1) + '.html']) {
        const response = await fetch(origin + path, { redirect: 'manual' });
        assert.equal(response.status, 308, `Canonical redirect: ${path}`);
        assert.equal(new URL(response.headers.get('location'), origin).href, origin + route);
      }
    }
  }
  for (const route of ['/404/', '/_not-found/', '/__release_unknown_route__/']) assert.equal((await fetch(origin + route, { redirect: 'manual' })).status, 404);
  return { status: 'verified', verifiedFiles: manifest.files.length, results, resultsDigest: objectDigest(results), limitation: 'All known-file HTTP checks plus upload identity. No claim of internal CDN filesystem enumeration. Transport compression is decoded by fetch; content mutation is rejected.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assert.ok(process.env.VERCEL_CLI_ENTRY, 'Set VERCEL_CLI_ENTRY to the installed pinned CLI entry point, never a token');
  const manifest = readJSON('release-candidate/manifest.json');
  const provenance = verifyProvenance(manifest);
  verifyManifest(manifest, '.vercel/output/static', '.vercel/output');
  verifyReproducibility(manifest, readJSON('release-candidate/reproducibility.json'));
  assert.deepEqual(candidateErrors('.vercel/output/static'), []);
  assert.match(runCLI(['--version']), new RegExp(`^${policy.vercelCli.replaceAll('.', '\\.')}\\s*$`));
  const project = api(`/v9/projects/${policy.projectId}?teamId=${policy.teamId}`);
  assert.equal(project.id, policy.projectId);
  assert.equal(project.accountId, policy.teamId);
  mkdirSync('.vercel', { recursive: true });
  if (existsSync('.vercel/project.json')) {
    assert.equal(readJSON('.vercel/project.json').projectId, policy.projectId);
    assert.equal(readJSON('.vercel/project.json').orgId, policy.teamId);
  } else writeFileSync('.vercel/project.json', jsonBytes({ projectId: policy.projectId, orgId: policy.teamId, projectName: 'biblemap' }));
  let deployment;
  if (process.argv[2] === 'deploy') {
    assert.ok(!existsSync('release-candidate/deployment.json'), 'Candidate already deployed; refusing replacement');
    const args = ['deploy', '--prebuilt', '--yes', '--json', '--environment', 'preview', '--local-config', '.vercel/output/client-config.json', '--scope', 'elliotandersons-projects'];
    for (const [key, value] of Object.entries({ canonicalArtifact: manifest.artifactDigest, canonicalManifest: objectDigest(manifest), canonicalOutput: manifest.outputDigest, canonicalSource: manifest.sourceCommit, canonicalRun: `${manifest.build.runId}/${manifest.build.runAttempt}` })) args.push('--meta', `${key}=${value}`);
    const result = deploymentResult(runCLI(args));
    deployment = api(`/v13/deployments/${result.id}?teamId=${policy.teamId}`);
    verifyDeployment(manifest, deployment);
    writeFileSync('release-candidate/deployment.json', jsonBytes(deploymentIdentity(deployment)));
  } else {
    const requestedId = process.argv[3];
    if (requestedId) assert.match(requestedId, /^dpl_[A-Za-z0-9]+$/);
    const saved = existsSync('release-candidate/deployment.json') ? readJSON('release-candidate/deployment.json') : { id: requestedId };
    assert.ok(saved.id, 'Saved deployment or explicit interrupted-preview ID required');
    deployment = api(`/v13/deployments/${saved.id}?teamId=${policy.teamId}`);
    assert.equal(deployment.id, saved.id);
    verifyDeployment(manifest, deployment);
    if (!existsSync('release-candidate/deployment.json')) writeFileSync('release-candidate/deployment.json', jsonBytes(deploymentIdentity(deployment)));
  }
  verifyDeployment(manifest, deployment);
  verifyManifest(manifest, '.vercel/output/static', '.vercel/output');
  const tree = api(`/v6/deployments/${deployment.id}/files?teamId=${policy.teamId}`);
  const upload = verifyUpload('.vercel/output', tree);
  const http = await verifyHTTP(manifest, 'https://' + deployment.url);
  const receipt = { schemaVersion: 1, status: 'verified', checkedAt: new Date().toISOString(), manifestDigest: objectDigest(manifest), artifactDigest: manifest.artifactDigest, outputDigest: manifest.outputDigest, deploymentId: deployment.id, deploymentUrl: deployment.url, uploadIdentity: 'complete-prebuilt-file-tree-sha1', provenance, upload, http, trustBoundary: 'Vercel authenticated API upload identity and prebuilt semantics; SHA1 is provider upload identity, SHA256 protects local bytes. CDN internals and generated metadata are trusted, not fully remotely enumerated.' };
  const receiptPath = existsSync('release-candidate/verification.json') ? 'release-candidate/verification-recheck.json' : 'release-candidate/verification.json';
  writeFileSync(receiptPath, jsonBytes(receipt));
  console.log(JSON.stringify({ status: receipt.status, deploymentId: deployment.id, url: 'https://' + deployment.url, artifactDigest: manifest.artifactDigest, verifiedFiles: http.verifiedFiles, verificationDigest: objectDigest(receipt) }));
}
