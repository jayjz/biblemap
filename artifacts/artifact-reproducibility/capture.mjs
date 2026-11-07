// Run from the repository root. Clears only .next/ and out/ in this checkout.
// Complete byte snapshots stay outside out/ and outside committed evidence.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { inventoryExport, contentDigest, filesUnder } from '../../scripts/export-inventory.mjs';

const root = process.cwd();
if (!existsSync(join(root, '.git')) || !existsSync(join(root, 'scripts/export-inventory.mjs'))) throw new Error('Run from the diagnostic checkout root');
const evidence = join(root, 'artifacts/artifact-reproducibility/.local');
mkdirSync(evidence, { recursive: true });
const hash = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const snapshots = join(tmpdir(), 'biblemap-artifact-snapshots', hash(Buffer.from(root)).slice(7, 27));
mkdirSync(snapshots, { recursive: true });
const json = (name, value) => writeFileSync(join(evidence, name), JSON.stringify(value, null, 2) + '\n');
const execute = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: process.platform === 'win32' && command === 'npm.cmd' });
  if (result.error) throw result.error;
  return result;
};
const [action, label, other] = process.argv.slice(2);
for (const value of [label, other].filter(Boolean)) if (!/^[a-z0-9-]+$/.test(value)) throw new Error('Invalid label');
if (!label) throw new Error('A build label is required');
if (action === 'build') {
  if (existsSync(join(evidence, `${label}-environment.json`))) throw new Error('Use a new label; evidence is never overwritten');
  const revision = execute('git', ['rev-parse', 'HEAD']);
  if (revision.status !== 0) throw new Error(revision.stderr);
  const inputPaths = ['src', 'scripts', 'public', 'tests', '.github'].flatMap(dir => filesUnder(dir).map(path => `${dir}/${path}`))
    .concat(['.gitattributes', 'package.json', 'package-lock.json', 'next.config.mjs', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs', 'vercel.json', 'docs/release/publication-scope.json', 'docs/release/publication-decision.json']).sort();
  const metadata = {
    commit: revision.stdout.trim(), node: process.version, npm: execute(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version']).stdout.trim(),
    platform: process.platform, arch: process.arch, command: 'npm run build', cleanDirectories: ['.next', 'out'],
    contentDigest: contentDigest(), lockfile: hash(readFileSync('package-lock.json')),
    environment: Object.fromEntries(['NODE_ENV', 'TZ', 'CI', 'VERCEL', 'VERCEL_ENV', 'NOW_BUILDER', 'BIBLEMAP_PUBLICATION_MODE', 'BIBLEMAP_NINEVEH_REVIEW', 'BIBLEMAP_INTERNAL_REVIEW', 'BIBLEMAP_PUBLICATION_CANARY', 'NEXT_TELEMETRY_DISABLED', 'SOURCE_DATE_EPOCH'].map(key => [key, process.env[key] ?? null])),
    nextDeploymentIdPresent: Boolean(process.env.NEXT_DEPLOYMENT_ID), nextHashSaltPresent: Boolean(process.env.NEXT_HASH_SALT),
    inputFiles: inputPaths.map(path => { const bytes = readFileSync(path); return { path, bytes: bytes.length, checksum: hash(bytes) }; }),
  };
  for (const name of metadata.cleanDirectories) {
    const target = resolve(root, name);
    if (!target.startsWith(root + sep) || target === root) throw new Error('Unsafe build cleanup');
    rmSync(target, { recursive: true, force: true });
  }
  const originals = new Map(['artifacts/release-readiness/export-inventory.json', 'artifacts/release-readiness/maplibre-worker-export.json'].map(path => [path, existsSync(path) ? readFileSync(path) : undefined]));
  try {
    const result = execute(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build']);
    metadata.exitCode = result.status;
    writeFileSync(join(evidence, `${label}-build.txt`), result.stdout + result.stderr);
    metadata.postbuildContentDigest = contentDigest();
    if (result.status === 0) {
      const report = inventoryExport();
      metadata.artifactDigest = report.artifactDigest;
      metadata.artifactCount = report.files.length;
      json(`${label}-manifest.json`, { artifactDigest: report.artifactDigest, files: report.files.map(({ path, bytes, checksum }) => ({ path, bytes, checksum })) });
      metadata.snapshotDirectory = join(snapshots, label);
      cpSync('out', metadata.snapshotDirectory, { recursive: true, force: false, errorOnExist: true });
    }
    json(`${label}-environment.json`, metadata);
    console.log(JSON.stringify({ ...metadata, inputFiles: undefined }));
    process.exitCode = result.status ?? 1;
  } finally {
    for (const [path, bytes] of originals) if (bytes) writeFileSync(path, bytes); else rmSync(path, { force: true });
  }
} else if (action === 'compare' && other) {
  const left = JSON.parse(readFileSync(join(evidence, `${label}-manifest.json`)));
  const right = JSON.parse(readFileSync(join(evidence, `${other}-manifest.json`)));
  const le = JSON.parse(readFileSync(join(evidence, `${label}-environment.json`)));
  const re = JSON.parse(readFileSync(join(evidence, `${other}-environment.json`)));
  const lm = new Map(left.files.map(file => [file.path, file]));
  const rm = new Map(right.files.map(file => [file.path, file]));
  const comparison = { left: label, right: other, leftDigest: left.artifactDigest, rightDigest: right.artifactDigest,
    sameCommit: le.commit === re.commit,
    sameToolchain: ['node', 'npm', 'platform', 'arch', 'lockfile'].every(key => le[key] === re[key]),
    sameRecordedEnvironment: JSON.stringify(le.environment) === JSON.stringify(re.environment) && le.nextDeploymentIdPresent === re.nextDeploymentIdPresent && le.nextHashSaltPresent === re.nextHashSaltPresent,
    sameRawInputs: JSON.stringify(le.inputFiles) === JSON.stringify(re.inputFiles),
    unchangedInputsDuringBuild: le.contentDigest === le.postbuildContentDigest && re.contentDigest === re.postbuildContentDigest,
    added: right.files.filter(file => !lm.has(file.path)), missing: left.files.filter(file => !rm.has(file.path)),
    modified: right.files.filter(file => lm.has(file.path) && lm.get(file.path).checksum !== file.checksum).map(after => ({ before: lm.get(after.path), after })) };
  json(`${label}-vs-${other}.json`, comparison);
  console.log(JSON.stringify(comparison, null, 2));
  if (!comparison.sameCommit || !comparison.sameToolchain || !comparison.sameRecordedEnvironment || !comparison.sameRawInputs || !comparison.unchangedInputsDuringBuild || comparison.added.length || comparison.missing.length || comparison.modified.length) process.exitCode = 1;
} else throw new Error('Use build LABEL or compare LEFT RIGHT');
