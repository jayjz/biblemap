import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { StableInitialChunksPlugin } from './stable-initial-chunks.mjs';

const require = createRequire(import.meta.url);
const { webpack } = require('next/dist/compiled/webpack/webpack');

test('actual bundled JSONP generator is reproducible across permuted initial chunks before hashing', async () => {
  const root = mkdtempSync(join(tmpdir(), 'biblemap-webpack-order-'));
  writeFileSync(join(root, 'entry.js'), 'import("./lazy.js").then(value => console.log(value.default));');
  writeFileSync(join(root, 'lazy.js'), 'export default "fixed fixture";');
  async function compile(order, label, stable) {
    let generated;
    const compiler = webpack({
      mode: 'production', context: root, entry: './entry.js',
      output: { path: join(root, label), filename: 'entry.js', chunkFilename: '[id].js', uniqueName: 'fixed-fixture' },
      optimization: { minimize: false },
      plugins: [{
        apply(compiler) {
          compiler.hooks.thisCompilation.tap('InitialOrderFixture', compilation => {
            compilation.hooks.runtimeModule.tap({ name: 'InitialOrderFixture', stage: -100 }, (module, chunk) => {
              if (!(module instanceof webpack.web.JsonpChunkLoadingRuntimeModule)) return;
              const original = chunk.getAllInitialChunks;
              // Empty chunks have no JS, just like the two observed initial IDs.
              const initial = order.map(id => { const value = new webpack.Chunk(); value.id = id; value.ids = [id]; return value; });
              chunk.getAllInitialChunks = () => new Set([...original.call(chunk), ...initial]);
              const generate = module.generate;
              module.generate = function () { generated = generate.call(this); return generated; };
            });
          });
        },
      }, ...(stable ? [new StableInitialChunksPlugin()] : [])],
    });
    await new Promise((resolve, reject) => compiler.run((error, stats) => {
      const failure = error ?? (stats.hasErrors() ? new Error(stats.toString()) : undefined);
      compiler.close(closeError => failure || closeError ? reject(failure ?? closeError) : resolve());
    }));
    assert.equal(typeof generated, 'string');
    return generated;
  }
  try {
    const original = await compile([709, 8220], 'original', false);
    const reversed = await compile([8220, 709], 'reversed', false);
    assert.notEqual(original, reversed, 'The fixture must reproduce the pinned upstream ordering defect');
    const first = await compile([709, 8220], 'stable-first', true);
    const second = await compile([8220, 709], 'stable-second', true);
    assert.equal(first, second, 'Runtime source must match before minification, hashing or export');
    for (const source of [original, reversed, first, second]) {
      const table = source.match(/var installedChunks = \{([\s\S]*?)\};/)?.[1];
      assert.ok(table);
      const entries = [...table.matchAll(/(\d+): 0/g)].map(match => Number(match[1])).sort((a, b) => a - b);
      assert.deepEqual(entries, [709, 792, 8220], 'Preserve every initial chunk and its loaded state');
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});
