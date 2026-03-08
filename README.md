# Bible3D: The Interactive Biblical Matrix

A cinematic, interactive 3D globe that maps 2,900+ biblical events, 30,000 cross-referenced verses, and 6,000 years of history into one seamless timeline.

## Architecture
This application is built for maximum client-side performance, bypassing traditional JSON APIs:
1. **Database:** PostgreSQL + PostGIS (Local ETL only).
2. **Data Pipeline:** Python scripts extract spatial data, calculate Fermat's Spiral jittering for overlapping events (The Jerusalem Problem), and export a strictly typed Apache Parquet binary.
3. **Frontend:** Next.js 15 (Static Export) running Deck.gl. 
4. **Memory Mapping:** The browser uses `parquet-wasm` to unpack the binary stream directly into memory, feeding the WebGL shaders via Apache Arrow with zero CPU-bound JSON parsing.

## Local Setup

### 1. The Data Pipeline (Python)
Ensure your PostGIS Docker container is running and the database is seeded.
```bash
# Export the latest Parquet binary
export DATABASE_URL="postgresql://user:password@localhost:5432/bible3d"
python export_production.py