// Loopback-only experimental surface. Does not add a Next route or change the reader.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { build } from 'esbuild';
import { mayReviewDepthImage } from '../src/domain/nineveh-depth-media.ts';

const port = Number(process.env.EXPERIMENT_PORT ?? 4191);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid EXPERIMENT_PORT');
const root = resolve('out');
const depthMedia = JSON.parse(readFileSync('src/features/nineveh/depth-media.json', 'utf8'));
if (!existsSync(resolve(root, 'jonah/index.html'))) throw new Error('Build the existing reader first: npm run build');
const bundle = await build({ entryPoints: ['scripts/irreplaceable.tsx'], bundle: true, splitting: true, format: 'esm', outdir: 'experiment', write: false, minify: true, jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' } });
const files = new Map(bundle.outputFiles.map(file => [`/experiment/${file.path.split(/[\\/]/).at(-1)}`, file.contents]));
const css = readFileSync('scripts/irreplaceable.css', 'utf8') + '\n' + readFileSync('node_modules/maplibre-gl/dist/maplibre-gl.css', 'utf8');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>BibleMap · Jonah experiment</title><link rel="stylesheet" href="/experiment/style.css"></head><body><div id="experiment-root"></div><noscript><p>These local interactions require JavaScript. <a href="/jonah/#jonah-3-mercy">Read the complete accessible Scripture reader</a>.</p></noscript><script type="module" src="/experiment/irreplaceable.js"></script></body></html>`;
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.mp4': 'video/mp4' };
createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  const path = new URL(request.url, `http://127.0.0.1:${port}`).pathname;
  const depthAsset = depthMedia.assets.find(asset => asset.reviewUrl === path);
  if (depthAsset) {
    // Explicit local-review allowlist. Restricted/unverified images never leave the server.
    if (!mayReviewDepthImage(depthAsset)) { response.writeHead(403).end('Image rights do not permit review.'); return; }
    const file = resolve(depthAsset.localPath);
    if (!existsSync(file)) { response.writeHead(404).end('Review image unavailable.'); return; }
    response.setHeader('Content-Type', 'image/webp'); response.end(readFileSync(file)); return;
  }
  if (path === '/review-assets/nineveh-landscape.webp') {
    // Original generated candidate: available to local creative review, never copied to out/public.
    const file = resolve('artifacts/nineveh-review/landscape.webp');
    if (!existsSync(file)) { response.writeHead(404).end('Local Nineveh artwork unavailable.'); return; }
    response.setHeader('Content-Type', 'image/webp'); response.end(readFileSync(file)); return;
  }
  if (path === '/nineveh-review/' || /^\/nineveh-review\/[a-z0-9-]+\.png$/.test(path)) {
    const file = resolve('artifacts/nineveh-review', path === '/nineveh-review/' ? 'index.html' : path.slice('/nineveh-review/'.length));
    if (!existsSync(file)) { response.writeHead(404).end('Run node scripts/capture-nineveh.mjs to capture the local review.'); return; }
    response.setHeader('Content-Type', types[extname(file)]); response.end(readFileSync(file)); return;
  }
  if (path === '/evidence/' || /^\/evidence\/(baseline|experiment)\/[a-z0-9-]+\.png$/.test(path)) {
    const evidence = resolve('artifacts/irreplaceable', path === '/evidence/' ? 'index.html' : path.slice('/evidence/'.length));
    if (!existsSync(evidence)) { response.writeHead(404).end('Run node scripts/verify-irreplaceable.mjs to generate evidence.'); return; }
    response.setHeader('Content-Type', types[extname(evidence)]); response.end(readFileSync(evidence)); return;
  }
  if (path === '/experiment/' || path === '/experiment') { response.setHeader('Content-Type', types['.html']); response.end(html); return; }
  if (path === '/experiment/style.css') { response.setHeader('Content-Type', 'text/css'); response.end(css); return; }
  if (files.has(path)) { response.setHeader('Content-Type', 'text/javascript'); response.end(files.get(path)); return; }
  let file;
  try { file = resolve(root, '.' + decodeURIComponent(path)); } catch { response.writeHead(400).end(); return; }
  if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = resolve(file, 'index.html');
  if (!existsSync(file) || !statSync(file).isFile()) { response.writeHead(404).end('Not found'); return; }
  response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
  response.end(readFileSync(file));
}).listen(port, '127.0.0.1', () => console.log(`Local experiment: http://127.0.0.1:${port}/experiment/\nUnmodified reader: http://127.0.0.1:${port}/jonah/#jonah-3-mercy`));
