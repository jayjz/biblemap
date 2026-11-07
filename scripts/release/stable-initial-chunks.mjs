// Webpack 5.98 emits the JSONP installed-chunk table in graph traversal order.
// Async graph construction can change that order without changing membership.
// Supply an ordered Set before runtime generation/hashing; never rewrite output.
export class StableInitialChunksPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('StableInitialChunks', compilation => {
      const ordered = new WeakSet();
      compilation.hooks.runtimeModule.tap('StableInitialChunks', (module, chunk) => {
        if (!(module instanceof compiler.webpack.web.JsonpChunkLoadingRuntimeModule) || ordered.has(chunk)) return;
        ordered.add(chunk);
        const initialChunks = chunk.getAllInitialChunks;
        chunk.getAllInitialChunks = function () {
          return new Set([...initialChunks.call(this)].sort((a, b) => {
            if (typeof a.id === 'number' && typeof b.id === 'number') return a.id - b.id;
            const left = JSON.stringify(a.id), right = JSON.stringify(b.id);
            return left < right ? -1 : left > right ? 1 : 0;
          }));
        };
      });
    });
  }
}
