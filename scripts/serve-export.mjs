// Dependency-free, loopback-only static export server for browser verification.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4189);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid PLAYWRIGHT_PORT');
const types = { '.xml': 'application/xml; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.ico': 'image/x-icon' };
export function createExportServer(root = resolve('out')) {
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let file = resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
      const info = await stat(file);
      if (info.isDirectory() && !pathname.endsWith('/')) { response.writeHead(308, { Location: `${pathname}/${new URL(request.url, 'http://127.0.0.1').search}` }).end(); return; }
      if (pathname.endsWith('/index.html')) { response.writeHead(308, { Location: pathname.slice(0, -10) }).end(); return; }
      if (info.isDirectory()) file = resolve(file, 'index.html');
      if (['/404/', '/404.html', '/_not-found/'].includes(pathname)) response.statusCode = 404;
      response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
      response.setHeader('Cache-Control', 'no-store');
      createReadStream(file).on('error', () => response.destroy()).pipe(response);
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') response.writeHead(404).end('Not found');
      else { console.error(error); response.writeHead(500).end('Static export read failed'); }
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) createExportServer().listen(port, '127.0.0.1', () => console.log(`Static export: http://127.0.0.1:${port}`));
