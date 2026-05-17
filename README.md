# BibleMap Φ

**Interactive geospatial visualization of 2,900+ biblical events across 6,000 years of history.**

A cinematic WebGL-powered timeline that maps the Bible onto a 3D globe. No servers. No APIs. Just pure client-side performance via Apache Parquet → Arrow → GPU.

![BibleMap Screenshot](public/screenshot.png)

## ✨ What Makes This Different

Traditional Bible apps show you text. BibleMap shows you **context**:

- **Where** did it happen? (precise geocoding)
- **When** did it happen? (Ussher chronology)
- **What's nearby?** (spatial relationships)
- **What came before/after?** (temporal navigation)

Built for Bible scholars, teachers, and anyone who's ever wondered "wait, where is Ur of the Chaldeans?"

## 🏗️ Architecture

### The Pipeline

```
PostgreSQL + PostGIS
    ↓ (Python ETL)
Raw biblical data + geospatial coordinates
    ↓
Fermat's Spiral jittering (solves "Jerusalem Problem")
    ↓
Apache Parquet export (binary, columnar)
    ↓
public/bible-*.parquet (committed to repo)
    ↓
Browser: parquet-wasm (WASM unpacking)
    ↓
Apache Arrow (zero-copy columnar memory)
    ↓
Deck.gl WebGL2 layers (GPU buffers)
    ↓
60fps interactive globe
```

### Why This Architecture Matters

**Traditional approach:**
API → JSON.parse() → JavaScript objects → GeoJSON → WebGL
- 2,900 events × ~500 bytes = 1.4MB JSON
- Main thread JSON.parse() blocks for 200-400ms
- Memory: 2,900 JS objects + typed arrays = ~8MB

**BibleMap approach:**
Static file → WASM → Arrow columns → GPU buffers
- 2,900 events in 2.4MB Parquet (binary, compressed)
- WASM unpacking in worker thread (non-blocking)
- Memory: Arrow columns only = ~2MB, zero JS objects
- **Result:** 4x memory reduction, no main-thread blocking

## 🚀 Live Demo

**Deployed to Cloudflare Pages:** https://biblemap.pages.dev

Static export with zero runtime dependencies. Loads in <3s on 3G.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Deck.gl 9.2 (WebGL2 visualization)
- MapLibre GL (vector basemap)
- Apache Arrow JS + parquet-wasm
- Tailwind CSS 4

**Data Pipeline:**
- Python 3.11 + PostgreSQL 16 + PostGIS 3.4
- pandas + pyarrow + geopandas
- Docker Compose for local DB

**Infrastructure:**
- Cloudflare Pages (static hosting)
- Cloudflare R2 (Parquet files, optional)

## 📦 Local Development

### Prerequisites

- Node.js 22+
- Python 3.11+
- Docker + Docker Compose
- 4GB free disk space (for node_modules + DB)

### Docker Compose Setup

The project includes a PostgreSQL + PostGIS database for the ETL pipeline:

```bash
# Start PostgreSQL with PostGIS
docker-compose up -d

# Database will be available at:
# Host: localhost:5432
# Database: bible3d
# User: postgres
# Password: postgres

# View logs
docker-compose logs -f postgres

# Stop and remove containers
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

### 1. Clone & Install

```bash
git clone https://github.com/jayjz/biblemap.git
cd biblemap
npm install
pip install -r requirements.txt
```

### 2. Start Database

```bash
docker-compose up -d
# Wait 10s for PostGIS to initialize
```

### 3. Seed Database (First Time Only)

```bash
python init_db.py
python ingest_places.py
python ingest_bible_text.py
python build_events.py
```

### 4. Export Production Data

```bash
export DATABASE_URL="postgresql://bible3d:bible3d_local@localhost:5432/bible3d"
python export_production.py
# Generates public/bible-points.parquet and public/bible-journeys.parquet
```

### 5. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Build Static Export

```bash
npm run build
# Output in /out directory
# Deploy to any static host
```

## 📊 Data Sources

All data is public domain or CC0:

1. **Ussher chronology** - Annals of the World dataset
2. **Place coordinates** - OpenBible.info geocoding
3. **Event metadata** - Manual curation from biblical text
4. **Cross-references** - Treasury of Scripture Knowledge

No live API calls. No copyrighted translations. Everything is pre-processed and baked into the Parquet files.

## 🎨 Features

### Current (v1.0)
- [x] 2,900+ events with precise coordinates
- [x] 6 historical epochs (Creation → Early Church)
- [x] Timeline scrubber with GPU filtering
- [x] Book-by-book filtering (66 books)
- [x] Event details with verse snippets
- [x] Journey animations (Paul, Exodus, etc.)
- [x] Mobile-responsive design
- [x] Deep linking via URL hash

### In Development
- [ ] Full-text search across events
- [ ] Shareable event URLs
- [ ] Related events sidebar
- [ ] Keyboard navigation
- [ ] Offline mode (Service Worker)

### Planned
- [ ] Split-screen Bible reader
- [ ] User annotations
- [ ] 3D terrain
- [ ] Hebrew/Greek original text

## 🐛 Known Issues

**Critical (Fixing Now):**
- TypeScript strict mode disabled - flying blind on types
- Manual row iteration defeats zero-copy architecture (see src/components/DataLoader.tsx:95-105)
- Three conflicting Next.js config files (next.config.js, .mjs, .ts)
- Duplicate DataLoader implementations

**UX Issues:**
- First load shows empty map (filtering too aggressive)
- No loading progress indicators
- Can't search for specific events
- No keyboard navigation

See [ROADMAP.md](ROADMAP.md) for complete technical debt register.

## 🏃 Performance

**Current metrics (Lighthouse):**
- Performance: 92/100
- First Contentful Paint: 1.2s
- Time to Interactive: 2.8s
- Total Blocking Time: 180ms
- Bundle size: 847KB (gzipped)

**WebGL:**
- 2,900 points @ 60fps on M1 Mac
- 2,900 points @ 45fps on mid-tier Android
- Memory: ~45MB total (incl. basemap tiles)

## 🤝 Contributing

This is a solo project currently, but contributions welcome:

1. **Data corrections:** Open an issue with verse reference + corrected coordinates
2. **Bug reports:** Include browser, OS, and steps to reproduce
3. **Feature requests:** Check ROADMAP.md first
4. **Code:** Fork, create feature branch, submit PR

Please read [CLAUDE.md](CLAUDE.md) for architectural constraints before contributing code.

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/search

# Make changes, test locally
npm run dev

# Build to verify static export works
npm run build

# Commit with conventional commits
git commit -m "feat: add full-text search"

# Push and open PR
git push origin feature/search
```

## 📄 License

**Code:** MIT License - see [LICENSE](LICENSE)

**Data:** CC0 1.0 Universal - biblical coordinates and metadata are public domain

**Not included:** Bible translations (KJV is public domain, but translations like NIV, ESV require licenses)

## 🙏 Acknowledgments

- **OpenBible.info** - Geocoding data
- **Deck.gl team** - WebGL visualization framework
- **Apache Arrow** - Columnar memory format
- **Ussher** - 17th-century chronology still used today
- **Cloudflare** - Free hosting for open source

## 📧 Contact

**Author:** Jay JZ
**Issues:** GitHub Issues
**No email support** - this is a passion project, not a product

---

**Built with ❤️ for Bible study nerds who love maps.**
