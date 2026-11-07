import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative, join } from 'node:path';
import { build } from 'esbuild';
import { digest, filesUnder } from './export-inventory.mjs';

const root = resolve('out');
const installed = JSON.parse(readFileSync('node_modules/maplibre-gl/package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
assert.equal(installed.version, lock.packages['node_modules/maplibre-gl'].version, 'Installed/locked MapLibre mismatch');
const expected = readFileSync('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs');
const files = filesUnder(root);
const workers = files.filter(path => /maplibre-gl-worker.*\.mjs$/.test(path));
assert.ok(workers.length, 'MapLibre worker missing from export');
const modules = [];
const visited = new Set();
async function visit(path) {
  if (visited.has(path)) return;
  visited.add(path);
  assert.ok(files.includes(path), `Required worker module missing: ${path}`);
  const bytes = readFileSync(join(root, path));
  // Parse the actual emitted module with the existing build parser. No imports
  // are executed. Nonliteral optional worker extension loading is not a static dependency.
  const parsed = await build({ stdin: { contents: bytes.toString('utf8'), sourcefile: path, loader: 'js' }, bundle: false, metafile: true, write: false, format: 'esm', logLevel: 'silent' });
  const imports = Object.values(parsed.metafile.outputs).flatMap(output => output.imports).map(item => item.path);
  modules.push({ path, bytes: bytes.length, checksum: digest(bytes), imports });
  for (const specifier of imports) {
    assert.ok(specifier.startsWith('.'), `Uncontrolled external worker dependency: ${specifier}`);
    const next = relative(root, resolve(dirname(join(root, path)), specifier)).replaceAll('\\', '/');
    assert.ok(!next.startsWith('../'), `Worker import escapes the export: ${specifier}`);
    await visit(next);
  }
}
for (const worker of workers) {
  assert.ok(readFileSync(join(root, worker)).equals(expected), `${worker}: worker differs from the pinned installed package`);
  await visit(worker);
}
const report = { installed: installed.version, locked: lock.packages['node_modules/maplibre-gl'].version, modules, limitation: 'Static module dependency closure; optional nonliteral worker plugin imports are not used by BibleMap. Browser tests separately exercise source processing and network responses.' };
writeFileSync(join(process.env.BIBLEMAP_REPORT_DIR ?? 'artifacts/release-readiness', 'maplibre-worker-export.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`MapLibre ${installed.version}: ${workers.length} worker artifact(s), ${modules.length} module(s); every required static import is present and worker bytes match the lockfile package.`);
