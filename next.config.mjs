// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    const { execSync } = await import('child_process');
    try {
      const sha = execSync('git rev-parse --short HEAD').toString().trim();
      return sha;
    } catch {
      return 'dev-' + Date.now();
    }
  },

  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },

  webpack(config, { isServer, dev }) {
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

    // CRITICAL FIXES FOR DECK.GL
    config.optimization = {
      ...config.optimization,
      concatenateModules: false,
      minimize: !dev, // Only minimize in production
    };

    // Prevent mangling of Deck/Luma classes
    if (config.optimization?.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.map((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          return {
            ...minimizer,
            options: {
              ...minimizer.options,
              terserOptions: {
                ...minimizer.options?.terserOptions,
                keep_classnames: true,
                keep_fnames: true,
              },
            },
          };
        }
        return minimizer;
      });
    }

    return config;
  },
};

export default nextConfig;
