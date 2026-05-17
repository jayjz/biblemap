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

## License

MIT
