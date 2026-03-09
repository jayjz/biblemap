#!/usr/bin/env python3
"""
Phase 3: Export to GPU-ready Parquet (Command Center Edition).
Adds native SQL categorization for Epochs AND primary Book filtering.
"""
import os
import pandas as pd
from sqlalchemy import create_engine
import pyarrow as pa
import pyarrow.parquet as pq

# Secured DB connection
DB_DSN = os.environ.get("DATABASE_URL", "postgresql://bible3d:bible3d_local@localhost:5432/bible3d")

def main():
    print("=== export_production.py (Command Center Pipeline) ===")
    engine = create_engine(DB_DSN)

    # ── ENHANCED: Export full verse reference for interactivity ─────────────────
    query = """
        SELECT
            e.name,
            e.ussher_year::float AS ussher_year,
            CASE
                WHEN e.ussher_year <= -1700 THEN 0
                WHEN e.ussher_year <= -1300 THEN 1
                WHEN e.ussher_year <= -930  THEN 2
                WHEN e.ussher_year <= -539  THEN 3
                WHEN e.ussher_year <= -4    THEN 4
                ELSE 5
            END::int AS epoch_id,
            e.event_type,
            e.description,
            ST_X(e.geometry)::float AS lon,
            ST_Y(e.geometry)::float AS lat,
            (SELECT text FROM verses v WHERE v.reference = e.verse_refs[1] LIMIT 1) AS verse_text_snippet,
            e.verse_refs[1] AS verse_reference,
            SUBSTRING(e.verse_refs[1] FROM '^([A-Za-z]+)') AS primary_book
        FROM events e
        WHERE e.geometry IS NOT NULL AND e.ussher_year IS NOT NULL
    """
    print("  Querying PostGIS and Compiling Command Center Schema...")
    df = pd.read_sql(query, engine)

    # Sanitize data types for strict Arrow conversion
    df['event_type'] = df['event_type'].fillna('general').astype(str)
    df['name'] = df['name'].fillna('').astype(str)
    df['description'] = df['description'].fillna('').astype(str)
    df['verse_text_snippet'] = df['verse_text_snippet'].fillna('').astype(str)
    df['verse_reference'] = df['verse_reference'].fillna('').astype(str)
    df['primary_book'] = df['primary_book'].fillna('Unknown').astype(str)
    df['epoch_id'] = df['epoch_id'].astype(int) 

    print("  Compiling Arrow Table...")
    table = pa.Table.from_pandas(df)
    pq.write_table(table, "public/bible-points.parquet")
    print(f"  Written: bible-points.parquet ({len(df)} rows with Book Filtering)")

    # ── JOURNEYS (dynamic paths that sync to timeline + search) ─────────────────
    # All paths are [lng, lat] arrays. Timestamps are float years (negative = BC).
    # Frontend search + epoch filter will automatically surface these.

    # ── JOURNEYS (dynamic paths that sync to timeline + search) ─────────────────
    journeys = [
        # 1. Red Sea Crossing (Moses) - RED
        {
            "name": "Red Sea Crossing",
            "epoch_id": 1,
            "primary_book": "EXO",
            "color": [220, 50, 47], 
            "path": [
                [31.83, 30.80], [32.09, 30.63], [32.55, 29.95],
                [33.97, 28.53], [34.48, 30.65], [35.40, 30.31]
            ],
            "timestamps": [-1491.0, -1490.9, -1490.8, -1490.5, -1490.0, -1489.5]
        },
        # 2. Paul's First Missionary Journey - ORANGE
        {
            "name": "Paul's First Missionary Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "color": [253, 128, 93],
            "path": [
                [36.16, 36.20], [35.92, 36.15], [33.90, 35.18], [32.42, 34.77],
                [30.85, 36.95], [30.53, 38.35], [32.48, 37.87], [32.30, 37.58],
                [33.35, 37.35], [32.30, 37.58], [32.48, 37.87], [30.53, 38.35],
                [30.85, 36.95], [32.42, 34.77], [35.92, 36.15], [36.16, 36.20]
            ],
            "timestamps": [46.0, 46.2, 46.4, 46.6, 46.8, 47.0, 47.3, 47.6, 47.9, 48.0, 48.1, 48.2, 48.3, 48.4, 48.5, 48.6]
        },
        # 3. Jesus' Final Journey to Jerusalem - GOLD
        {
            "name": "Jesus' Final Journey to Jerusalem",
            "epoch_id": 5,
            "primary_book": "LUK",
            "color": [255, 215, 0],
            "path": [
                [35.58, 32.88], [35.50, 32.70], [35.44, 31.87], [35.25, 31.77], [35.23, 31.78]
            ],
            "timestamps": [30.0, 30.1, 30.2, 30.3, 30.4]
        },
        # 4. Abraham's Migration - PURPLE
        {
            "name": "Abraham's Migration to Canaan",
            "epoch_id": 0,
            "primary_book": "GEN",
            "color": [108, 113, 196],
            "path": [
                [46.10, 30.96], [39.03, 36.86], [35.28, 32.21], [35.23, 31.93],
                [31.23, 30.04], [35.23, 31.93], [35.10, 31.53]
            ],
            "timestamps": [-1921.0, -1915.0, -1910.0, -1909.0, -1908.0, -1907.0, -1900.0]
        },
        # 5. Paul's Second Missionary Journey - ORANGE
        {
            "name": "Paul's Second Missionary Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "color": [253, 128, 93],
            "path": [
                [36.16, 36.20], [34.89, 36.91], [33.35, 37.35], [32.30, 37.58], [32.48, 37.87],
                [30.53, 38.35], [26.16, 39.75], [24.28, 41.01], [22.94, 40.64], [22.20, 40.52],
                [23.72, 37.98], [22.89, 37.93], [27.34, 37.94], [34.89, 32.50], [35.23, 31.77], [36.16, 36.20]
            ],
            "timestamps": [49.0, 49.2, 49.4, 49.6, 49.8, 50.0, 50.3, 50.6, 50.8, 51.0, 51.2, 51.4, 51.6, 51.8, 51.9, 52.0]
        },
        # 6. Paul's Third Missionary Journey - ORANGE
        {
            "name": "Paul's Third Missionary Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "color": [253, 128, 93],
            "path": [
                [36.16, 36.20], [30.53, 38.35], [27.34, 37.94], [26.16, 39.75], [24.28, 41.01],
                [22.89, 37.93], [24.28, 41.01], [26.16, 39.75], [26.33, 39.48], [26.55, 39.10],
                [27.27, 37.53], [29.31, 36.26], [35.19, 33.27], [35.08, 32.92], [34.89, 32.50], [35.23, 31.77]
            ],
            "timestamps": [53.0, 53.5, 54.0, 55.5, 55.8, 56.0, 56.2, 56.4, 56.5, 56.6, 56.7, 56.8, 56.85, 56.9, 56.95, 57.0]
        },
        # 7. Peter's Missionary Journey (Acts 9-10) - BLUE
        {
            "name": "Peter's Coastal Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "color": [38, 139, 210],
            "path": [
                [35.23, 31.77], [34.89, 31.95], [34.75, 32.05], [34.89, 32.50]
            ],
            "timestamps": [37.0, 37.3, 37.6, 38.0]
        },
        # 8. Philip the Evangelist (Acts 8) - TEAL
        {
            "name": "Philip's Evangelistic Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "color": [42, 161, 152],
            "path": [
                [35.23, 31.77], [35.19, 32.27], [34.48, 31.50], [34.65, 31.80], [34.89, 32.50]
            ],
            "timestamps": [34.0, 34.2, 34.5, 34.7, 35.0]
        }
    ]

    # Build Arrow table from list of dicts
    journeys_table = pa.Table.from_pylist(journeys)
    pq.write_table(journeys_table, "public/bible-journeys.parquet")
    print(f"  Written: bible-journeys.parquet ({len(journeys)} routes — Color Coded + Apostles added)")

if __name__ == "__main__":
    main()