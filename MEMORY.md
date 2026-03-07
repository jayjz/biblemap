# PROJECT STATE & ROADMAP

## Current Goal
Build a massive, production-grade 3D interactive geospatial map of the entire Bible corpus with a 60 FPS chronological slider.

## Phase Status

### [ ] PHASE 1: Local PostGIS Engine
* **Status:** PENDING
* **Tasks:** * Create `docker-compose.yml` for PostgreSQL + PostGIS.
    * Create `schema.sql` (places, verses, events).

### [ ] PHASE 2: Static Data Ingestion
* **Status:** PENDING
* **Tasks:**
    * Write `ingest_places.py` (OpenBible CSV).
    * Write `ingest_bible_text.py` (Static WEB/KJV JSON).
    * Write `build_events.py` (Ussher CSV joining).

### [ ] PHASE 3: GeoParquet Export
* **Status:** PENDING
* **Tasks:**
    * Write `export_production.py` to dump the `events` table to `bible-events.parquet`.

### [ ] PHASE 4: Deck.gl + Next.js Frontend
* **Status:** PENDING
* **Tasks:**
    * Setup Next.js static export.
    * Implement `GeoArrowScatterplotLayer` for point events.
    * Implement GPU `DataFilterExtension` tied to a timeline UI slider.

## Active Directives
We are currently executing **PHASE 1**. Do not begin Phase 2 until the database schema is verified.