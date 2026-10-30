// Bounded, repeatable verification. Every command and exit is retained, including failures.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const phase = process.argv[2];
const phases = {
  core: [
    ['npm ci'], ['npm run validate:story'], ['npm run test'], ['npm run lint'], ['npx tsc --noEmit'],
  ],
  production: [
    ['npm run build'], ['node scripts/validate-nineveh-depth.mjs --production-export'],
    ['npm run test:e2e', { PLAYWRIGHT_PORT: '4311' }],
  ],
  nineveh: [
    ['npm run build', { BIBLEMAP_NINEVEH_REVIEW: '1' }],
    ['npm run test:e2e', { PLAYWRIGHT_REVIEW_SERVER: '1', PLAYWRIGHT_PORT: '4315' }],
  ],
  inherited: [
    ['npm run build', { BIBLEMAP_READER_TRANSITION_REVIEW: '1' }],
    ['npx playwright test --config playwright.reader.config.ts', { PLAYWRIGHT_PORT: '4311' }],
  ],
  human: [
    ['npm run build', { BIBLEMAP_HUMAN_REVIEW: '1' }],
    ['npx playwright test --config playwright.human.config.ts', { PLAYWRIGHT_PORT: '4311' }],
    ['node scripts/capture-jonah-human.mjs after'],
  ],
};
if (!Object.hasOwn(phases, phase)) throw new Error('Choose core, production, nineveh, inherited, or human');
const directory = 'artifacts/jonah-human/verification';
mkdirSync(directory, { recursive: true });
const logPath = `${directory}/runs.json`;
const runs = existsSync(logPath) ? JSON.parse(readFileSync(logPath, 'utf8')) : [];
const base = { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' };
for (const key of ['BIBLEMAP_HUMAN_REVIEW', 'BIBLEMAP_NINEVEH_REVIEW', 'BIBLEMAP_READER_TRANSITION_REVIEW', 'PLAYWRIGHT_REVIEW_SERVER', 'CI']) delete base[key];
const lockBefore = readFileSync('package-lock.json', 'utf8');
if (phase === 'nineveh' && !existsSync('artifacts/nineveh-review/landscape.webp')) {
  // Same disclosed interaction fixture as CI. Never substitute for an art critique.
  copyFileSync('artifacts/nineveh-depth/media/flood-tablet.webp', 'artifacts/nineveh-review/landscape.webp');
  writeFileSync(`${directory}/nineveh-fixture.json`, JSON.stringify({
    reason: 'Original local-only generated panorama absent; use the existing CI interaction fixture.',
    source: 'artifacts/nineveh-depth/media/flood-tablet.webp',
    destination: 'artifacts/nineveh-review/landscape.webp',
    scope: 'Interaction regression only; no aesthetic or historical reconstruction approval.',
  }, null, 2));
}
for (const [command, overrides = {}] of phases[phase]) {
  const started = new Date().toISOString();
  console.log(`Running ${phase}: ${command}`);
  const result = spawnSync(command, { shell: true, env: { ...base, ...overrides }, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, windowsHide: true });
  const output = (result.stdout ?? '') + (result.stderr ?? '') + (result.error?.message ?? '');
  const index = runs.length + 1;
  const filename = `${index}-${phase}.txt`;
  writeFileSync(`${directory}/${filename}`, output);
  runs.push({ phase, command, environment: overrides, node: process.version, platform: process.platform, started, ended: new Date().toISOString(), exitCode: result.status, signal: result.signal, log: filename });
  writeFileSync(logPath, JSON.stringify(runs, null, 2));
  console.log(output.slice(-6500));
  if (result.status !== 0) process.exit(result.status ?? 1);
  if (phase === 'production' && command === 'npm run build') {
    const exported = readFileSync('out/jonah/index.html', 'utf8');
    assert.ok(!exported.includes('class="nineveh-record"'), 'Draft documentary record leaked into ordinary HTML');
    assert.ok(!exported.includes('story-root--human'), 'Study styling enabled in ordinary HTML');
    console.log('Ordinary export excludes the human-story study.');
  }
}
assert.equal(readFileSync('package-lock.json', 'utf8'), lockBefore, 'Verification changed lockfile');
console.log(`Completed ${phase}; every command exited 0; lockfile unchanged.`);
