import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';

export const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
export function filesUnder(directory) {
  const root = resolve(directory);
  return readdirSync(root, { recursive: true, withFileTypes: true }).filter(entry => entry.isFile())
    .map(entry => relative(root, join(entry.parentPath, entry.name)).replaceAll('\\', '/')).sort();
}
export function contentDigest() {
  const paths = ['src', 'scripts', 'public', 'tests', '.github'].flatMap(root => filesUnder(root).map(path => `${root}/${path}`));
  paths.push('package.json', 'package-lock.json', 'next.config.mjs', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs', 'vercel.json', 'docs/release/publication-scope.json');
  return digest(JSON.stringify(paths.sort().map(path => {
    const bytes = readFileSync(path);
    const normalized = /\.(?:[cm]?[jt]sx?|json|css|md|yml|html|svg)$/.test(path) ? Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n')) : bytes;
    return [path, digest(normalized)];
  })));
}
/** Inventory every byte, including media, fonts, WASM and alternate RSC artifacts. */
export function inventoryExport(directory = 'out', probes = []) {
  if (!existsSync(join(directory, 'index.html'))) throw new Error('Fresh static export required');
  const leaks = [];
  const files = filesUnder(directory).map(path => {
    const bytes = readFileSync(join(directory, path));
    const payload = path.endsWith('.gz') ? gunzipSync(bytes) : path.endsWith('.br') ? brotliDecompressSync(bytes) : bytes;
    const text = payload.toString('utf8');
    for (const probe of probes) {
      if (!probe.trim()) throw new Error('Empty private-data probe');
      const variants = [probe, JSON.stringify(probe).slice(1, -1), JSON.stringify(JSON.stringify(probe)).slice(1, -1), encodeURIComponent(probe), Buffer.from(probe).toString('base64'), probe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')];
      if (variants.some(value => text.includes(value))) leaks.push({ path, probe });
    }
    return { path, url: `/${path}`, bytes: bytes.length, checksum: digest(bytes), type: path.split('.').at(-1),
      ...(path.endsWith('index.html') ? { route: `/${path.replace(/index\.html$/, '')}`, notFound: text.includes('NEXT_HTTP_ERROR_FALLBACK;404') || /<h1[^>]*>404<\/h1>/.test(text) } : {}) };
  });
  const missingDependencies = [];
  for (const file of files.filter(file => file.type === 'html')) {
    const html = readFileSync(join(directory, file.path), 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const path = decodeURIComponent(match[1]).replace(/^\//, '');
      const candidates = [path, `${path.replace(/\/$/, '')}/index.html`, path === '' ? 'index.html' : ''];
      if (!candidates.some(candidate => files.some(file => file.path === candidate))) missingDependencies.push({ from: file.path, url: match[1] });
    }
  }
  return { schemaVersion: 1, artifactDigest: digest(JSON.stringify(files.map(({ path, bytes, checksum }) => ({ path, bytes, checksum })))),
    files, routes: files.filter(file => file.route), leaks, missingDependencies };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = inventoryExport();
  // The existing opt-in experiment deliberately loads this local-only artwork
  // from review-irreplaceable.mjs, not from the static export. Keep the ordinary
  // missing-dependency gate strict and record this one exact review binding.
  const localReviewImage = 'artifacts/nineveh-review/landscape.webp';
  const reviewDependencies = process.env.BIBLEMAP_NINEVEH_REVIEW === '1' && existsSync(localReviewImage)
    ? report.missingDependencies.filter(dependency => dependency.url === '/review-assets/nineveh-landscape.webp')
      .map(dependency => ({ ...dependency, backingFile: localReviewImage, checksum: digest(readFileSync(localReviewImage)), delivery: 'loopback-review-server-only' })) : [];
  const unresolved = report.missingDependencies.filter(dependency => !reviewDependencies.some(bound => bound.from === dependency.from && bound.url === dependency.url));
  const destination = process.argv[2] ?? 'artifacts/release-readiness/export-inventory.json';
  writeFileSync(destination, `${JSON.stringify({ ...report, reviewDependencies, contentDigest: contentDigest() }, null, 2)}\n`);
  console.log(`${report.files.length} artifacts (${report.routes.length} index routes), ${unresolved.length} unresolved HTML dependencies, ${reviewDependencies.length} explicit loopback-review references; ${report.artifactDigest}`);
  if (unresolved.length) process.exitCode = 1;
}
