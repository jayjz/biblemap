# Phase 2 — ETL Ingestion Pipeline

## Prerequisites

The Phase 1 database container must be running:

```bash
docker compose up -d
# Verify it is healthy
docker exec bible3d_db psql -U bible3d -d bible3d -c "SELECT PostGIS_Full_Version();"
```

## Install Python dependencies

Python 3.11+ recommended.

```bash
pip install psycopg2-binary pandas requests
```

## Run order (strictly sequential — each step depends on the previous)

### Step 1 — Load geocoded places

```bash
python ingest_places.py
```

Downloads `places.csv` from OpenBible, validates coordinates, and bulk-inserts
into the `places` table.
Expected output: `~2 000 places loaded`.

---

### Step 2 — Load Bible text + link to places

```bash
python ingest_bible_text.py
```

Downloads the World English Bible JSON (with automatic fallback to a mirror),
parses all 31 102 verses, runs whole-word regex matching against every loaded
place name, and inserts into the `verses` table with an optional `place_id`
foreign key.
Expected output: `~31 000 verses loaded`.

---

### Step 3 — Build events from Ussher's Annals

```bash
python build_events.py
```

Downloads the Ussher chronology CSV, parses signed years (negative = BCE),
resolves geometry by matching place names mentioned in each event description
against the `places` table, applies golden-angle spiral jitter to any events
that share an exact coordinate (the "Jerusalem Problem"), and inserts into the
`events` table.
Expected output: event count varies by CSV version; geometry resolved for
events where a place name is found.

---

## Verify

```bash
docker exec bible3d_db psql -U bible3d -d bible3d -c "
  SELECT
    (SELECT COUNT(*) FROM places)  AS places,
    (SELECT COUNT(*) FROM verses)  AS verses,
    (SELECT COUNT(*) FROM events)  AS events,
    (SELECT COUNT(*) FROM events WHERE geometry IS NOT NULL) AS events_with_geom;
"
```

## Re-running

All three scripts use `TRUNCATE … RESTART IDENTITY` before inserting, so they
are fully idempotent — safe to re-run in any order (but always Step 1 before
Steps 2 and 3 because those depend on the `places` data).

## Data sources (static dumps — no live API calls)

| Data | URL |
|---|---|
| Places | `https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/master/places.csv` |
| Bible text | `https://raw.githubusercontent.com/TehShrike/world-english-bible/master/json/bible.json` |
| Ussher timeline | `https://raw.githubusercontent.com/BradyStephenson/bible-data/master/Ussher-AnnalsOfTheWorld.csv` |
