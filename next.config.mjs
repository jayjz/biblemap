// next.config.mjs
// Static HTML export — zero Node.js runtime.
// Targets: Cloudflare Pages / R2, or any static host.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // THE FIX: Disable StrictMode to prevent Luma.gl WebGL context destruction 
  // during React 18 development double-mounts.
  reactStrictMode: false,

  // ── Static export ──────────────────────────────────────────────────────────
  // next build writes a self-contained /out directory.
  // No separate `next export` command in Next.js 15 — `output: 'export'` is enough.
  output: "export",

  // Required for Cloudflare Pages route resolution (/about → /about/index.html)
  trailingSlash: true,

  // No image optimisation runtime in a static export
  images: { unoptimized: true },

  // ── Webpack ───────────────────────────────────────────────────────────────
  webpack(config, { isServer }) {
    // 1. Treat .parquet files as opaque binary assets — copy verbatim to /out.
    //    Without this rule, webpack tries to parse the binary and throws.
    config.module.rules.push({
      test:      /\.parquet$/i,
      type:      "asset/resource",
      generator: { filename: "static/data/[name].[hash][ext]" },
    });

    // 2. parquet-wasm ships a .wasm binary that must be loaded asynchronously.
    //    asyncWebAssembly lets webpack generate the correct import() wrapper.
    //    topLevelAwait is required for the ESM parquet-wasm init pattern.
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait:    true,
    };

    // 3. Stub Node-only modules for the browser bundle.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs:     false,
        path:   false,
        crypto: false,
        stream: false,
      };
    }

    return config;
  },

  // ── Dev-server headers ────────────────────────────────────────────────────
  // Cloudflare Pages handles production headers via _headers file or R2 config.
  // These only apply to `next dev`.
  async headers() {
    return [
      {
        source: "/:path*.parquet",
        headers: [
          { key: "Content-Type",  value: "application/octet-stream" },
          {
            key:   "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;