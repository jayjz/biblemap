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

    journeys = [
        # 1. Original Red Sea Crossing (Exodus & Conquest, ~1491 BC)
        {
            "name": "Red Sea Crossing",
            "epoch_id": 1,
            "primary_book": "EXO",
            "path": [
                [31.83, 30.80], [32.09, 30.63], [32.55, 29.95],
                [33.97, 28.53], [34.48, 30.65], [35.40, 30.31]
            ],
            "timestamps": [-1491.0, -1490.9, -1490.8, -1490.5, -1490.0, -1489.5]
        },
        # 2. Paul's First Missionary Journey (46–48 AD)
        # Antioch (Syria) → Seleucia → Salamis → Paphos → Perga → Pisidian Antioch → Iconium → Lystra → Derbe → return route
        {
            "name": "Paul's First Missionary Journey",
            "epoch_id": 5,
            "primary_book": "ACT",
            "path": [
                [36.16, 36.20],   # Antioch Syria
                [35.92, 36.15],   # Seleucia
                [33.90, 35.18],   # Salamis Cyprus
                [32.42, 34.77],   # Paphos
                [30.85, 36.95],   # Perga
                [30.53, 38.35],   # Pisidian Antioch
                [32.48, 37.87],   # Iconium
                [32.30, 37.58],   # Lystra
                [33.35, 37.35],   # Derbe
                # return leg (simplified)
                [32.30, 37.58], [32.48, 37.87], [30.53, 38.35], [30.85, 36.95],
                [32.42, 34.77], [35.92, 36.15], [36.16, 36.20]
            ],
            "timestamps": [46.0, 46.2, 46.4, 46.6, 46.8, 47.0, 47.3, 47.6, 47.9,
                           48.0, 48.1, 48.2, 48.3, 48.4, 48.5, 48.6]
        },
        # 3. Jesus' Final Journey to Jerusalem (30 AD)
        # Capernaum → Jericho → Bethany/Mt of Olives → Golgotha (Jerusalem)
        {
            "name": "Jesus' Final Journey to Jerusalem",
            "epoch_id": 5,
            "primary_book": "LUK",
            "path": [
                [35.58, 32.88],   # Capernaum (Galilee)
                [35.50, 32.70],   # through Galilee
                [35.44, 31.87],   # Jericho
                [35.25, 31.77],   # Mount of Olives / Bethany
                [35.23, 31.78]    # Golgotha (Jerusalem)
            ],
            "timestamps": [30.0, 30.1, 30.2, 30.3, 30.4]
        }
    ]

    # Build Arrow table from list of dicts
    journeys_table = pa.Table.from_pylist(journeys)
    pq.write_table(journeys_table, "public/bible-journeys.parquet")
    print(f"  Written: bible-journeys.parquet ({len(journeys)} routes — Red Sea + Paul + Jesus)")

if __name__ == "__main__":
    main()