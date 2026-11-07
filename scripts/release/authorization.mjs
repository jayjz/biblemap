import assert from 'node:assert/strict';
import { objectDigest, policy } from './artifact.mjs';
import { publicationErrors } from '../../src/domain/publication.ts';

export function verifyReproducibility(manifest, proof) {
  assert.equal(proof.status, 'verified');
  for (const key of ['sourceCommit', 'sourceInputDigest', 'artifactDigest', 'outputDigest']) assert.equal(proof[key], manifest[key], `Reproducibility ${key} mismatch`);
  assert.deepEqual(proof.build, manifest.build);
  assert.equal(proof.manifests[0], objectDigest(manifest));
  assert.equal(proof.manifests.length, 2);
  assert.equal(new Set(proof.independentReplicas).size, 2);
}
export function verifyDeployment(manifest, deployment) {
  assert.match(deployment.id, /^dpl_[A-Za-z0-9]+$/);
  assert.equal(deployment.projectId, policy.projectId);
  assert.equal(deployment.teamId ?? deployment.ownerId, policy.teamId);
  assert.equal(deployment.readyState, 'READY');
  assert.ok(deployment.target === null || deployment.target === 'preview', 'Expected a preview; production operations require separate authorization');
  assert.match(deployment.url, /^[a-z0-9-]+\.vercel\.app$/);
  assert.equal(deployment.meta.canonicalArtifact, manifest.artifactDigest);
  assert.equal(deployment.meta.canonicalManifest, objectDigest(manifest));
  assert.equal(deployment.meta.canonicalOutput, manifest.outputDigest);
  assert.equal(deployment.meta.canonicalSource, manifest.sourceCommit);
  assert.equal(deployment.meta.canonicalRun, `${manifest.build.runId}/${manifest.build.runAttempt}`);
}
export function verifyPreviewIsolation(deploymentId, isolation) {
  assert.equal(isolation.status, 'verified');
  assert.notEqual(isolation.productionTargetId, deploymentId, 'Preview was promoted to the production target');
  assert.ok(isolation.productionDomains.length, 'Production domain bindings unavailable');
  for (const binding of isolation.productionDomains) {
    assert.match(binding.deploymentId, /^dpl_[A-Za-z0-9]+$/);
    assert.notEqual(binding.deploymentId, deploymentId, 'Preview was assigned a production domain');
  }
}
export function authorizationErrors({ manifest, proof, receipt, deployment, scope, acceptance, sourceInputDigest, operation = 'authorize-publication' }) {
  const errors = [];
  try {
    assert.equal(operation, 'authorize-publication', 'Preview promotion, rebuilding and deployment are not authorized by this verifier');
    verifyReproducibility(manifest, proof);
    verifyDeployment(manifest, deployment);
    assert.equal(receipt.schemaVersion, 1);
    assert.equal(receipt.status, 'verified');
    assert.equal(receipt.manifestDigest, objectDigest(manifest));
    assert.equal(receipt.deploymentId, deployment.id);
    verifyPreviewIsolation(deployment.id, receipt.productionIsolation);
    assert.equal(receipt.deploymentUrl, deployment.url);
    assert.equal(receipt.artifactDigest, manifest.artifactDigest);
    assert.equal(receipt.outputDigest, manifest.outputDigest);
    assert.equal(receipt.uploadIdentity, 'complete-prebuilt-file-tree-sha1');
    assert.equal(receipt.http.status, 'verified');
    assert.equal(objectDigest(receipt.http.results), receipt.http.resultsDigest);
    assert.equal(receipt.http.verifiedFiles, manifest.artifactCount);
    assert.deepEqual(receipt.http.results.map(({ path, checksum }) => ({ path, checksum })), manifest.files.map(({ path, checksum }) => ({ path, checksum })), 'HTTP evidence does not cover the complete artifact');
    assert.equal(sourceInputDigest, manifest.sourceInputDigest, 'Current build inputs differ from candidate');
    assert.equal(objectDigest(scope), manifest.scopeDigest, 'Publication scope changed');
    assert.equal(acceptance.schemaVersion, 2);
    assert.equal(acceptance.status, 'accepted', 'Creator acceptance pending');
    for (const [key, expected] of Object.entries({ sourceCommit: manifest.sourceCommit, sourceInputDigest: manifest.sourceInputDigest, artifactDigest: manifest.artifactDigest, manifestDigest: objectDigest(manifest), outputDigest: manifest.outputDigest, scopeDigest: manifest.scopeDigest, previewDeploymentId: deployment.id, verificationDigest: objectDigest(receipt) })) assert.equal(acceptance[key], expected, `Creator acceptance ${key} mismatch`);
    assert.deepEqual(acceptance.build, manifest.build, 'Approval targets a different build or rebuild');
    errors.push(...publicationErrors(scope, { ...acceptance, contentDigest: manifest.sourceInputDigest }, manifest.sourceInputDigest, manifest.artifactDigest));
  } catch (error) { errors.push(error.message); }
  return errors;
}
