import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = 'src/features/human-story/james';
const runtimeFiles = [...(await readdir(root)).filter(p => /\.(tsx|css)$/.test(p)).map(p => `${root}/${p}`), 'src/content/james.ts', 'public/media/james/manifest.json'];
const checksums = Object.fromEntries(await Promise.all(runtimeFiles.map(async path => [path, createHash('sha256').update(await readFile(path)).digest('hex')])));
const full = JSON.parse(await readFile('artifacts/james-v2/full-browser-results.json', 'utf8'));
const focused = JSON.parse(await readFile('artifacts/james-v2/focused-browser-results.json', 'utf8'));
const preview = JSON.parse(await readFile('artifacts/james-v2/preview-browser-results.json', 'utf8'));
const screenshots = JSON.parse(await readFile('artifacts/james-v2/after/observations.json', 'utf8'));
const interactions = JSON.parse(await readFile('artifacts/james-v2/interactions/observations.json', 'utf8'));
await writeFile('artifacts/james-v2/verification.json', JSON.stringify({
  base: '86b2c5d9eae789a2202c4a423a4318595ce51c84',
  branch: 'feat/james-cinematic-human-experience',
  target: 'feat/james-the-brother-who-remained',
  runtime: '62eda24f5f5f7a43de53dd91c6ee9a5a4691177b',
  date: '2026-11-05',
  checksums,
  checks: [
    { command: 'npm ci', exit: 0, note: 'Pinned graph unchanged; 38 inherited installer audit advisories' },
    { command: 'npm run lint', exit: 0, note: 'Four inherited warnings, zero errors' },
    { command: 'npm run typecheck', exit: 0 },
    { command: 'npm run test', exit: 0, passed: 54, skipped: 1, failed: 0 },
    { command: 'npm run build', exit: 0, note: 'Includes pinned Scripture, historical/media validation, static export and 444-artifact boundary validation' },
    { command: 'npm run test:e2e -- --reporter=line,json', exit: 0, stats: full.stats, runtime: '064858c646e3733a5ad1a6b3e6d24d6acdc301ab', note: 'Second full run, after scene selection fix and before final neutral fallback text' },
    { command: 'npm run test:e2e -- tests/james.spec.ts --reporter=line,json', exit: 0, stats: focused.stats, runtime: '62eda24f5f5f7a43de53dd91c6ee9a5a4691177b' },
    { command: 'npm run test:e2e -- tests/james.spec.ts --output=test-results-james-v2-preview --reporter=line,json', exit: 0, stats: preview.stats, runtime: '62eda24f5f5f7a43de53dd91c6ee9a5a4691177b', baseURL: 'https://biblemap-mx2ms9cng-elliotandersons-projects.vercel.app' },
    { command: 'node scripts/capture-james-v2.mjs after', exit: 0, observations: screenshots },
    { command: 'node scripts/review-james-v2.mjs', exit: 0, observations: interactions },
    { command: 'git diff --check', exit: 0 },
  ],
  verifiedFlows: ['all five movements and anchors', 'keyboard, Escape and focus restoration', 'touch selection', 'history Back and direct fragments', 'native no-JS Record disclosures and all relationship perspectives', 'companion simple reading', 'reduced motion', 'blocked image fallback', '200% text at four widths', '320px reflow', 'responsive local image selection', 'source comparison including empty witness layers', 'axe checks on all scene states and dialog', 'static export editorial boundary'],
  corrections: ['320px and 768px enlarged-text overflow', 'sticky offset and maximum control height', 'visible movement selection after reflow', 'heading whitespace', 'numbered summary test selectors', 'JS-disabled CSS-injection test harness hang', 'case-sensitive artistic-reference assertion', 'lazy-image capture timing and premature unavailable label'],
  limitations: ['AI-assisted draft, human historical/theological/literary review pending', 'No reader study; no emotional or comprehension outcome claimed', 'Interpretive environments with invented layouts, garments, vegetation, people and viewpoints', 'Chromium browser coverage; no claim of full WCAG conformance or field performance', 'One inherited mobile Atlas skip and one inherited opt-in unit skip', 'No production deployment or release approval'],
}, null, 2) + '\n');
