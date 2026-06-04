// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    // Stable per commit — only changes when code actually changes
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

  webpack(config, { isServer }) {
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

    config.optimization = {
      ...config.optimization,
      concatenateModules: false,
    };

    return config;
  },
};

export default nextConfig;
