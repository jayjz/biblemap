// Reproducible local evidence runner. Does not commit, push or alter test configuration.
import { spawn } from 'node:child_process';
import { createWriteStream, writeFileSync, copyFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
const targeted = process.argv.includes('--targeted');
// Preserve generated review reports outside the source tree before a repeat run.
// The existing ESLint config excludes normal reports but not the separate review
// report's bundled third-party trace viewer. No source rules or tests are excluded.
if (!targeted) {
  const archive = `/tmp/biblemap-jonah-411-evidence/${Date.now()}`;
  for (const directory of ['playwright-report-nineveh', 'test-results-nineveh']) {
    if (existsSync(directory)) { mkdirSync(archive, { recursive: true }); renameSync(directory, `${archive}/${directory}`); }
  }
}
const steps = targeted ? [
  ['targeted-browsers', 'npm', ['run', 'test:e2e', '--', 'tests/jonah-human-city.spec.ts', '--max-failures=1']],
] : [
  ['dependencies', 'npm', ['ci', '--cache', '/tmp/biblemap-npm-cache']],
  ['story', 'npm', ['run', 'validate:story']],
  ['media', 'npm', ['run', 'validate:media']],
  ['unit', 'npm', ['test']],
  ['unit-individual-cases', 'node', ['--experimental-strip-types', '--test', '--test-isolation=none', 'src/domain/atlas-routing.test.ts', 'src/domain/historical-context.test.ts', 'src/domain/human-city.test.ts', 'src/domain/media-publication.test.ts', 'src/domain/nineveh.test.ts', 'src/domain/story.test.ts']],
  ['lint', 'npm', ['run', 'lint']],
  ['types', 'npm', ['run', 'typecheck']],
  ['production-build', 'npm', ['run', 'build']],
  ['production-export', 'node', ['scripts/validate-nineveh-depth.mjs', '--production-export']],
  ['normal-browsers', 'npm', ['run', 'test:e2e']],
  ['review-build', 'npm', ['run', 'build'], { BIBLEMAP_NINEVEH_REVIEW: '1' }],
  ['review-browsers', 'npm', ['run', 'test:e2e'], { PLAYWRIGHT_REVIEW_SERVER: '1' }],
  ['diff-whitespace', 'git', ['diff', '--check']],
];
const results = [];
for (const [id, command, args, extra = {}] of steps) {
  if (id === 'review-browsers') copyFileSync('artifacts/nineveh-depth/media/flood-tablet.webp', 'artifacts/nineveh-review/landscape.webp');
  const log = createWriteStream(`artifacts/jonah-411-review/${id}.log`);
  const startedAt = new Date().toISOString();
  console.log(`Starting ${id}: ${command} ${args.join(' ')}`);
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: { ...process.env, CHROME_PATH: '/usr/bin/google-chrome', PLAYWRIGHT_PORT: '4196', EXPERIMENT_PORT: '4196', NEXT_TELEMETRY_DISABLED: '1', ...extra }, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
    child.on('error', reject); child.on('close', resolve);
  });
  log.end();
  results.push({ id, command: `${command} ${args.join(' ')}`, env: extra, startedAt, completedAt: new Date().toISOString(), exitCode });
  writeFileSync(`artifacts/jonah-411-review/${targeted ? 'targeted' : 'verification'}-results.json`, JSON.stringify(results, null, 2) + '\n');
  console.log(`${id}: exit ${exitCode}`);
  if (exitCode !== 0) process.exit(exitCode ?? 1);
}
