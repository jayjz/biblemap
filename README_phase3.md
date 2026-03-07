# Phase 3 — Production Export & deck.gl Setup

## Prerequisites

Phase 2 ingestion complete and the PostGIS container running.

```bash
docker compose up -d
python validate_data.py   # must exit 0 before exporting
```

## Step 1 — Install Python deps

```bash
pip install -r requirements.txt
```

## Step 2 — Export GeoParquet (two typed files)

```bash
python export_production.py
```

This writes **two** files:

| File | Contents | Expected size |
|---|---|---|
| `public/bible-points.parquet` | POINT events only | 0.5–2 MB |
| `public/bible-journeys.parquet` | LINESTRING journeys only | 0.1–0.5 MB |

**Why two files?** GeoArrow requires uniform geometry types per column for
zero-copy GPU buffer mapping. Mixed POINT+LINESTRING falls back to generic WKB
blobs and kills frame rate. Each file feeds a separate deck.gl layer.

Do NOT commit the parquet files — add them to `.gitignore`:

```
# .gitignore
public/bible-points.parquet
public/bible-journeys.parquet
```

## Step 3 — Local dev preview

```bash
npm install
npm run dev
# http://localhost:3000
```

## Step 4 — Static build

```bash
npm run build
# Output: /out  (fully self-contained static directory)
```

## Step 5 — Cloudflare Pages deployment

### Build settings (Cloudflare Pages dashboard)

| Setting | Value |
|---|---|
| Framework preset | None (custom) |
| Build command | `npm run build` |
| Output directory | `out` |

### Upload parquet to R2

```bash
wrangler r2 bucket create bible3d-data

wrangler r2 object put bible3d-data/bible-points.parquet \
  --file public/bible-points.parquet \
  --content-type application/octet-stream

wrangler r2 object put bible3d-data/bible-journeys.parquet \
  --file public/bible-journeys.parquet \
  --content-type application/octet-stream
```

Set Cloudflare Pages environment variables:

```
NEXT_PUBLIC_POINTS_URL   = https://pub-xxxx.r2.dev/bible-points.parquet
NEXT_PUBLIC_JOURNEYS_URL = https://pub-xxxx.r2.dev/bible-journeys.parquet
```

R2 bucket CORS policy (required for cross-origin fetch):

```json
[{
  "AllowedOrigins": ["https://bible3d.pages.dev"],
  "AllowedMethods": ["GET"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 86400
}]
```

## Performance reference

| Metric | Value |
|---|---|
| Points parquet size | ~0.5–2 MB |
| Journeys parquet size | ~0.1–0.5 MB |
| Parse time (parquet-wasm WASM) | ~30–120 ms |
| GPU upload (Arrow → WebGL) | ~8 ms |
| Timeline scrub JS cost | **0 ms** — GPU uniform only |
| Target frame rate | 60 FPS |

## Why not GeoJSON?

| Format | Size | Parse | GPU upload |
|---|---|---|---|
| GeoJSON | ~30 MB | ~800 ms (blocks main thread) | Requires per-vertex JS |
| GeoParquet → GeoArrow | ~2 MB total | ~60 ms (WASM) | Zero-copy typed array |
