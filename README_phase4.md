# Phase 4 — Next.js 15 App Shell

## 1. Create the Next.js project

Run this from the repo root (or a subdirectory if you want the frontend isolated):

```bash
npm create next-app@latest . --use-npm --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
```

> If prompted to overwrite `next.config.mjs`, `app/page.tsx`, or `package.json`,
> choose **Yes** — the Phase 4 versions of those files are already written.

## 2. Install dependencies

```bash
npm install \
  @deck.gl/core@^9.0.36 \
  @deck.gl/layers@^9.0.36 \
  @deck.gl/geo-layers@^9.0.36 \
  @deck.gl/extensions@^9.0.36 \
  @deck.gl/react@^9.0.36 \
  @geoarrow/deck.gl-layers@^0.3.0 \
  apache-arrow@^17.0.0 \
  parquet-wasm@^0.6.1 \
  maplibre-gl@^4.5.0 \
  react-map-gl@^7.1.7
```

Or just run `npm install` if you're using the `package.json` already written.

## 3. Place the component

The file `components/DataLoader.tsx` must live at:

```
src/components/DataLoader.tsx    ← if you used --src-dir
  OR
components/DataLoader.tsx        ← if no src-dir
```

Update the import alias in `app/page.tsx` to match:

```typescript
// with src-dir:    import("@/components/DataLoader")
// without src-dir: import("../components/DataLoader")
```

## 4. Place the parquet files

```bash
# Copy from Phase 3 export output
cp public/bible-points.parquet   <next-app>/public/
cp public/bible-journeys.parquet <next-app>/public/
```

## 5. Local development

```bash
npm run dev
# Open http://localhost:3000
```

The parquet files are served from `public/` as static binary assets.
The map tiles come from CARTO (free, no API key needed).

## 6. Static build

```bash
npm run build
```

> **Next.js 15 note:** There is no longer a separate `next export` command.
> `output: 'export'` in `next.config.mjs` causes `npm run build` to write
> a fully static `/out` directory ready for Cloudflare Pages.

## 7. Deploy to Cloudflare Pages

### Option A — Git integration (recommended)

1. Push repo to GitHub.
2. Cloudflare Pages → **Create project** → connect repo.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Output directory | `out` |
   | Node.js version | 20 |

4. Add environment variables for R2 parquet URLs (see README_phase3.md).

### Option B — Direct upload

```bash
npm install -g wrangler
npm run build
wrangler pages deploy out --project-name=bible3d
```

## File manifest (Phase 4)

| File | Role |
|---|---|
| `next.config.mjs` | Static export, asyncWebAssembly, .parquet asset rule |
| `app/page.tsx` | Root page — dynamic import with `ssr: false` |
| `components/DataLoader.tsx` | `"use client"` — GeoArrow layers + timeline UI |
| `package.json` | All dependencies pinned |

## Architecture notes

### Why `"use client"` + `next/dynamic({ ssr: false })`

Next.js 15 App Router pre-renders every page server-side (or at build time for
static export). `DataLoader.tsx` references `window`, `requestAnimationFrame`,
and WebGL — none of which exist in Node.js. Without `ssr: false`, the static
build crashes with `window is not defined`.

The loading fallback in `page.tsx` is pure HTML/CSS and renders correctly
server-side, so users see a styled placeholder immediately before hydration.

### Layer split

| Layer | File | Geometry |
|---|---|---|
| `GeoArrowScatterplotLayer` | `bible-points.parquet` | POINT |
| `GeoArrowPathLayer` | `bible-journeys.parquet` | LINESTRING |

Each file contains a uniform geometry type. This is required for GeoArrow's
zero-copy GPU buffer path (see `lessons.md` for full explanation).

### 60 FPS timeline scrubbing

```
ussher_year column  →  Float32 vertex attribute (uploaded once)
                           │
filterRange update  →  One GPU uniform write (0 JS per frame)
                           │
DataFilterExtension →  Per-vertex discard in vertex shader
```

No JavaScript runs per animation frame. The RAF loop only calls `setCurrentYear`,
which updates the React state that feeds `filterRange` on the next render.
Deck.gl detects the changed prop and issues a single uniform upload.
