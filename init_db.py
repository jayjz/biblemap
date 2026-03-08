import psycopg2
import os

DB_DSN = os.environ.get("DATABASE_URL", "postgresql://bible3d:bible3d_local@localhost:5432/bible3d")

SCHEMA = """
-- 1. Enable PostGIS for spatial math
CREATE EXTENSION IF NOT EXISTS postgis;

-- Clear old schema to prevent type-mismatch errors
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS verses CASCADE;
DROP TABLE IF EXISTS places CASCADE;

-- 2. Create Places
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    modern_name VARCHAR(255),
    geometry GEOMETRY(Point, 4326),
    confidence FLOAT
);

-- 3. Create Verses
CREATE TABLE verses (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(255) UNIQUE NOT NULL,
    book VARCHAR(50),
    chapter INTEGER,
    verse INTEGER,
    text TEXT,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE
);

-- 4. Create Events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name TEXT,             -- THE FIX: Changed from VARCHAR(255) to TEXT
    ussher_year FLOAT,
    geometry GEOMETRY(Point, 4326),
    event_type VARCHAR(50),
    description TEXT,
    verse_refs TEXT[]
);
"""

def main():
    print("Injecting hardened schema into database...")
    conn = psycopg2.connect(DB_DSN)
    try:
        with conn.cursor() as cur:
            cur.execute(SCHEMA)
        conn.commit()
        print("SUCCESS: Tables (places, verses, events) recreated with TEXT limits.")
    except Exception as e:
        print(f"FAILED: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()