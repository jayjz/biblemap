// Loopback-only review. Rights-unresolved files stay out of public/ and the static export.
import { createServer } from "node:http";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename } from "node:path";
import { build } from "esbuild";
import catalog from "../docs/research/jonah-asset-candidates.json" with { type: "json" };

const root = new URL("../", import.meta.url);
const port = Number(process.env.JONAH_REVIEW_PORT ?? 4190);
const host = process.env.JONAH_REVIEW_HOST ?? "127.0.0.1";
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid JONAH_REVIEW_PORT");
if (host !== "127.0.0.1" && host !== "::1" && host !== "0.0.0.0") throw new Error("JONAH_REVIEW_HOST must be loopback, or 0.0.0.0 for an explicit local preview");
const bundle = await build({ entryPoints: [fileURLToPath(new URL("scripts/jonah-review.tsx", root))], bundle: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"', "process.env": "{}" } });
const escapeHtml = value => String(value).replace(/[&<>"\']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const localCss = `body{margin:0;background:#131d20;color:#f1eadb;font:18px/1.6 Georgia,serif}a{color:#d8be8b}.local-review-banner{padding:1rem 4%;font:14px/1.6 Arial;background:#352f23}main.gallery{max-width:1100px;margin:auto;padding:2rem} .gallery figure{margin:3rem 0;padding:1rem;border-top:1px solid #65716a}.gallery img{display:block;max-width:100%;max-height:75vh;object-fit:contain;margin:auto}.gallery figcaption{padding:1rem 0}.gallery small{display:block}.gallery code{overflow-wrap:anywhere;font-size:12px}`;
function html(body, script = "") { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jonah · Local creator review</title><link rel="stylesheet" href="/review.css"></head><body>${body}${script}</body></html>`; }
function namedFile(directory, requestPath, prefix) {
  if (!requestPath.startsWith(prefix)) return null;
  const name = basename(requestPath);
  if (!name || name !== requestPath.slice(prefix.length) || !/^[a-z0-9.-]+$/i.test(name)) return null;
  const file = new URL(name, directory);
  return existsSync(file) ? file : null;
}
const server = createServer((request, response) => {
  const path = new URL(request.url, `http://127.0.0.1:${port}`).pathname;
  response.setHeader("Cache-Control", "no-store");
  if (path === "/review.js") { response.setHeader("Content-Type", "text/javascript"); response.end(bundle.outputFiles[0].text); return; }
  if (path === "/review.css") {
    const directory = new URL("out/_next/static/css/", root);
    const css = existsSync(directory) ? readdirSync(directory).filter(file => file.endsWith(".css")).map(file => readFileSync(new URL(file, directory), "utf8")).join("\n") : "";
    response.setHeader("Content-Type", "text/css"); response.end(`${css}\n${readFileSync(new URL("src/features/story/story.css", root), "utf8")}\n${localCss}`); return;
  }
  const published = namedFile(new URL("public/media/jonah/", root), path, "/media/jonah/");
  const review = namedFile(new URL("artifacts/jonah-visual-review/", root), path, "/review-assets/");
  const staged = catalog.acquiredFiles.find(file => path === `/review-assets/${file.filename}`);
  const stagedFile = staged && existsSync(new URL(staged.stagingPath, root)) ? new URL(staged.stagingPath, root) : null;
  const image = published ?? review ?? stagedFile;
  if (image) {
    response.setHeader("Content-Type", /\.png$/i.test(path) ? "image/png" : "image/jpeg");
    response.end(readFileSync(image));
    return;
  }
  if (path === "/gallery") {
    const figures = catalog.acquiredFiles.map(file => {
      const asset = catalog.assets.find(asset => asset.id === file.matchedCandidateId);
      const title = asset?.title ?? file.identifiedTitle;
      return `<figure>${existsSync(new URL(file.stagingPath, root)) ? `<img src="/review-assets/${escapeHtml(file.filename)}" alt="${escapeHtml(title)}">` : "<p>Original unavailable on this machine. The source copy has not been replaced.</p>"}<figcaption><strong>${escapeHtml(title)}</strong><small>${escapeHtml(asset?.creator ?? file.identifiedCreator)} · ${escapeHtml(asset?.creationDate ?? file.identifiedCreationDate)}</small><p>${asset ? "Institutional image rights verified; creator scene approval pending." : "LOCAL REVIEW ONLY · Exact reproduction rights unresolved. Filename does not establish identity or permission."}</p><p>${escapeHtml(asset?.sceneFitCaveat ?? file.sceneFitCaveat)}</p>${file.identityEvidence.map(url => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">Identity evidence ↗</a>`).join(" · ")}<small>Original filename: ${escapeHtml(file.filename)}</small><code>SHA-256 ${escapeHtml(file.checksumSha256)}</code></figcaption></figure>`;
    }).join("");
    response.setHeader("Content-Type", "text/html; charset=utf-8"); response.end(html(`<main class="gallery"><a href="/">← Review the journey</a><h1>Six artworks. Their actual identities.</h1><p>Local review only. These are later artworks, not historical photographs. No approval or reproduction license is inferred.</p>${figures}</main>`)); return;
  }
  if (path === "/") { response.setHeader("Content-Type", "text/html; charset=utf-8"); response.end(html('<div id="review-root"></div>', '<script src="/review.js"></script>')); return; }
  const boardDir = new URL("artifacts/jonah-scene-board/", root);
  if (path === "/board" || path === "/board/") {
    const index = new URL("index.html", boardDir);
    if (!existsSync(index)) { response.statusCode = 404; response.end("Scene board not generated on this machine."); return; }
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(readFileSync(index));
    return;
  }
  if (path.startsWith("/board/")) {
    const name = path.slice("/board/".length);
    if (/^[a-z0-9.-]+$/i.test(name)) {
      const boardImage = new URL(name, boardDir);
      if (existsSync(boardImage)) {
        response.setHeader("Content-Type", name.endsWith(".png") ? "image/png" : "image/jpeg");
        response.end(readFileSync(boardImage));
        return;
      }
    }
  }
  response.statusCode = 404; response.end("Not available in the local review server.");
});
server.listen(port, host, () => console.log(`Local Jonah review: http://${host}:${port}/ — unresolved files only from artifacts/jonah-visual-review. Never publish this server.`));
