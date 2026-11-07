import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileManifest, verifyFiles, artifactDigest } from './artifact.mjs';

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Explicit static routes; no framework adapter, middleware or server build. */
export function staticConfig(files, deployment) {
  assert.equal(deployment.framework, null);
  assert.equal(deployment.outputDirectory, 'out');
  assert.equal(deployment.trailingSlash, true);
  assert.equal(deployment.cleanUrls, true);
  assert.deepEqual(deployment.routes, [{ src: '^/404(?:\\.html)?/?$', status: 404 }], 'Review changed host routing before packaging');
  assert.deepEqual(Object.keys(deployment).sort(), ['$schema', 'git', 'trailingSlash', 'cleanUrls', 'framework', 'buildCommand', 'outputDirectory', 'installCommand', 'routes'].sort(), 'Unmapped Vercel configuration');
  const routes = [
    { src: '^/(?:404(?:\\.html)?/?|_not-found(?:/.*)?)$', dest: '/404.html', status: 404 },
    { src: '^/index\\.html$', headers: { Location: '/' }, status: 308 },
  ];
  for (const { path } of files.filter(file => file.path.endsWith('/index.html'))) {
    const base = '/' + path.slice(0, -'/index.html'.length);
    const src = escapeRegex(base);
    routes.push({ src: `^${src}(?:\\.html)?$`, headers: { Location: base + '/' }, status: 308 });
    routes.push({ src: `^${src}/index\\.html$`, dest: '/404.html', status: 404 });
    routes.push({ src: `^${src}/$`, dest: '/' + path });
  }
  routes.push({ src: '^/$', dest: '/index.html' }, { handle: 'filesystem' }, { src: '^/.*$', dest: '/404.html', status: 404 });
  return { version: 3, routes };
}
export function packExport(source = 'out', target = '.vercel/output') {
  assert.ok(!existsSync(target), 'Refusing to replace an existing deployment output');
  const files = fileManifest(source);
  assert.ok(files.some(file => file.path === '404.html'));
  const config = staticConfig(files, JSON.parse(readFileSync('vercel.json', 'utf8')));
  mkdirSync(target, { recursive: true });
  cpSync(source, join(target, 'static'), { recursive: true, errorOnExist: true, force: false });
  writeFileSync(join(target, 'config.json'), JSON.stringify(config) + '\n');
  // Source-build routing must not be reapplied over the complete package routes.
  // This affects only the deployment, never the Vercel project settings.
  const toolbar = { VERCEL_PREVIEW_FEEDBACK_ENABLED: '0' };
  writeFileSync(join(target, 'client-config.json'), JSON.stringify({ framework: null, env: toolbar, build: { env: toolbar } }) + '\n');
  verifyFiles(join(target, 'static'), files, artifactDigest(files));
  return config;
}
