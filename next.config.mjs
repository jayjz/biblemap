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
    // Parquet
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

    // Prevent class name mangling (this is the key for _.Ay)
    if (!dev && config.optimization?.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer?.options?.terserOptions) {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            keep_classnames: true,
            keep_fnames: true,
            mangle: {
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