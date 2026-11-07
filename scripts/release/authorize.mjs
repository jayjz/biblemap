import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { releaseErrors } from '../publication-gate.mjs';
import { readJSON } from './artifact.mjs';

// Pending acceptance fails before credentials/network are needed. Successful
// authorization also requires a fresh provider/HTTP check, not a stale receipt.
assert.deepEqual(releaseErrors(), [], 'Creator acceptance / canonical evidence does not authorize publication');
execFileSync(process.execPath, ['--experimental-strip-types', 'scripts/release/preview.mjs', 'verify'], { stdio: 'inherit' });
const original = readJSON('release-candidate/verification.json');
const current = readJSON('release-candidate/verification-recheck.json');
for (const key of ['deploymentId', 'deploymentUrl', 'manifestDigest', 'artifactDigest', 'outputDigest']) assert.equal(current[key], original[key], `Live verification changed ${key}`);
console.log('Artifact-bound acceptance and fresh preview verification passed. No production operation or traffic assignment has been authorized or performed by this command.');
