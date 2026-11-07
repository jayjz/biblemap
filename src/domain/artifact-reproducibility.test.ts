import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

const attributes = readFileSync(new URL("../../.gitattributes", import.meta.url));
const inventoryModule = pathToFileURL(join(process.cwd(), "scripts/export-inventory.mjs")).href;

test("Git checkout preserves export text, Python inputs, binaries and pinned publisher bytes with autocrlf enabled", () => {
  const root = mkdtempSync(join(tmpdir(), "biblemap-checkout-fixture-"));
  const git = (...args: string[]) => {
    const result = spawnSync("git", ["-c", "core.autocrlf=true", "-c", "core.safecrlf=false", ...args], { cwd: root, encoding: "utf8" });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
  };
  const fixtures = new Map<string, Uint8Array>([
    ["public/media/approved/.gitkeep", Buffer.from("fixture\nsecond line\n")],
    ["public/media/example/manifest.json", Buffer.from('{"fixture":true}\n')],
    ["public/media/example/README.md", Buffer.from("public fixture\n")],
    ["scripts/epochs.py", Buffer.from("# fixture\npass\n")],
    ["src/app/layout.tsx", Buffer.from("// fixture\nexport {};\n")],
    ["src/content/scripture/web-jonah-fixture.html", Buffer.from("publisher\r\noriginal\n")],
    ["src/content/scripture/james-web-fixture.html", Buffer.from("publisher\r\noriginal\n")],
    ["public/media/example/image.webp", Buffer.from([82, 73, 70, 70, 0, 13, 10, 255])],
  ]);
  try {
    writeFileSync(join(root, ".gitattributes"), attributes);
    for (const [path, bytes] of fixtures) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), bytes);
    }
    git("init", "--quiet");
    git("add", ".");
    for (const path of fixtures.keys()) rmSync(join(root, path));
    git("checkout-index", "--all", "--force");
    for (const [path, bytes] of fixtures) assert.deepEqual(readFileSync(join(root, path)), bytes, path);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("content identity includes the checkout policy", () => {
  const root = mkdtempSync(join(tmpdir(), "biblemap-identity-fixture-"));
  const digest = () => {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `import { contentDigest } from ${JSON.stringify(inventoryModule)}; console.log(contentDigest());`], { cwd: root, encoding: "utf8" });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  try {
    for (const path of ["src", "scripts", "public", "tests", ".github", "docs/release"]) mkdirSync(join(root, path), { recursive: true });
    for (const path of ["package.json", "package-lock.json", "next.config.mjs", "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs", "vercel.json", "docs/release/publication-scope.json"]) writeFileSync(join(root, path), "{}\n");
    writeFileSync(join(root, ".gitattributes"), "* text=auto eol=lf\n");
    const before = digest();
    writeFileSync(join(root, ".gitattributes"), "* text=auto eol=crlf\n");
    assert.notEqual(digest(), before, "checkout policy must invalidate content acceptance");
  } finally { rmSync(root, { recursive: true, force: true }); }
});
