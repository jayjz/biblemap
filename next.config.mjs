// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simplified build ID — timestamp only for now (enough to bust cache without chaos)
  generateBuildId: async () => {
    return Date.now().toString();
  },

  reactStrictMode: false, // Keep this — needed for Deck.gl/Luma.gl

  // Static export
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Ignore TS errors during rapid dev
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack config — cleaned up
  webpack(config, { isServer }) {
    // Parquet assets
    config.module.rules.push({
      test: /\.parquet$/i,
      type: "asset/resource",
      generator: { filename: "static/data/[name].[hash][ext]" },
    });

    // WASM support for parquet-wasm
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

    // TDZ fix — keep this, it's important
    config.optimization = {
      ...config.optimization,
      concatenateModules: false,
    };

    return config;
  },

  // Headers (dev only)
  async headers() {
    return [
      {
        source: "/:path*.parquet",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
