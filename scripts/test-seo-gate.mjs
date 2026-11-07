// Exercise release-blocking failures against real exported bytes, restoring each.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('test-results/seo-gate', { recursive: true });
const fixtures = [
  ['out/index.html', html => html.replace('</head>', '<link rel="canonical" href="https://example.invalid/"/></head>'), 'canonical mismatch'],
  ['out/index.html', html => html.replace('</head>', '<meta name="robots" content="index, follow"/></head>'), 'robots mismatch'],
  ['out/index.html', html => html.replace('</body>', '<a href="/__nonexistent__/">Broken destination</a></body>'), 'nonexistent/noncanonical internal destination'],
  ['out/sitemap.xml', () => '<not-xml', 'invalid XML'],
  ['out/sitemap.xml', () => '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://biblemap-pink.vercel.app/</loc></url></urlset>', 'sitemap/indexability mismatch'],
  ['out/index.html', html => html.replace('</head>', '<script type="application/ld+json">{broken}</script></head>'), 'invalid JSON-LD'],
];
for (const [path, mutate, expected] of fixtures) {
  const original = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, mutate(original));
    const result = spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/audit-seo.mjs'], { encoding: 'utf8', env: { ...process.env, SEO_REPORT: 'test-results/seo-gate/fixture.json' } });
    if (result.error) throw result.error;
    assert.equal(result.status, 1, `Gate should reject ${expected}`);
    assert.ok(result.stderr.includes(expected), result.stderr);
    console.log(`Rejected: ${expected}`);
  } finally { writeFileSync(path, original); }
}
