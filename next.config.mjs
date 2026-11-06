import { assertBuildPublication } from './scripts/publication-gate.mjs';
import { contentDigest } from './scripts/export-inventory.mjs';

// Also guards direct `next build`, independent of npm lifecycle scripts.
assertBuildPublication();
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stable across an approval-only commit; content changes invalidate acceptance.
  generateBuildId: async () => `candidate-${contentDigest().slice(7, 27)}`,

  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  webpack(config, { isServer, dev }) {
    // This upstream worker is already minified. Preserve its pinned bytes and
    // embedded BSD notice instead of running Next's JS minifier over the asset.
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.compilation.tap('PreserveMapLibreWorker', compilation => {
          compilation.hooks.processAssets.tap({
            name: 'PreserveMapLibreWorker',
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE - 1,
          }, () => {
            for (const asset of compilation.getAssets()) {
              if (/maplibre-gl-worker\.[a-f0-9]+\.mjs$/.test(asset.name)) {
                compilation.updateAsset(asset.name, asset.source, { ...asset.info, minimized: true });
              }
            }
          });
        });
      },
    });
    // Parquet support
    config.module.rules.push({
      test: /\.parquet$/i,
      type: "asset/resource",
      generator: { filename: "static/data/[name].[hash][ext]" },
    });

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
      };
    }

    // AGGRESSIVE FIXES FOR DECK.GL
    config.optimization = {
      ...config.optimization,
      concatenateModules: false,
      minimize: !dev,
    };

    // Prevent class name mangling (this is the key to stopping the _.Ay error)
    if (!dev && config.optimization?.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer?.options?.terserOptions) {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            keep_classnames: true,
            keep_fnames: true,
            mangle: {
              ...(minimizer.options.terserOptions.mangle || {}),
              keep_classnames: true,
              keep_fnames: true,
            },
          };
        }
      });
    }

    return config;
  },
};

export default nextConfig;
