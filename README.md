# BibleMap Φ

Interactive 3D visualization of 2,900+ biblical events on a WebGL globe.

![BibleMap Preview](public/preview.png)

## Features

- 🗺️ Interactive 3D globe with 2,900+ biblical events
- ⏱️ Timeline scrubber from 4004 BC to 100 AD
- 🔍 Real-time search and filtering
- 📱 Fully responsive (desktop + mobile)
- ⚡ 60fps WebGL rendering via Deck.gl
- 🎨 Cinematic lighting and visual effects

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **3D Rendering:** Deck.gl + WebGL
- **Maps:** MapLibre GL
- **Data:** Apache Parquet + Apache Arrow
- **Styling:** Tailwind CSS
- **Deployment:** Cloudflare Pages

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Data Pipeline

The project uses a Python ETL pipeline to process biblical data:

```bash
# Requires PostgreSQL with PostGIS
docker-compose up -d

# Run ETL pipeline
python build_events.py
python ingest_places.py
python export_production.py
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   └── components/       # React components
├── public/               # Static assets
├── *.py                  # Data pipeline scripts
└── package.json
```

## Live Demo

**https://biblemap-phi.vercel.app**

## Deployment Notes

### Static Export Configuration
This project uses Next.js 15 static export (`output: 'export'`) for deployment to Cloudflare Pages and Vercel.

**Critical Configuration:**
- `generateBuildId`: Uses git SHA + timestamp for cache busting
- `concatenateModules: false`: Prevents Webpack TDZ issues with Map/Set
- Lazy initializers required: `useState(() => new Map())` not `useState(new Map())`

### Known Issues & Fixes

**"S.Ay is not a constructor" TDZ Error:**
- **Root cause:** Webpack minification + module evaluation order with static exports
- **Fix:** Lazy initializers + `concatenateModules: false` + enhanced cache busting
- **Reference:** See `DEPLOYMENT_INVESTIGATION.md` for full details

**Verification after deploy:**
```bash
# Check bundle doesn't contain non-lazy patterns
curl -s https://your-domain/_next/static/chunks/*.js | grep "useState.*new Map(" 
# Should return nothing (lazy form uses arrow functions)
```

## License

MIT
