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
    df['primary_book'] = df['primary_book'].fillna('Unknown').astype(str)
    df['epoch_id'] = df['epoch_id'].astype(int) 

    print("  Compiling Arrow Table...")
    table = pa.Table.from_pandas(df)
    pq.write_table(table, "public/bible-points.parquet")
    print(f"  Written: bible-points.parquet ({len(df)} rows with Book Filtering)")

    # RED SEA CROSSING TRAJECTORY
    redsea_path = [
        [31.83, 30.80], [32.09, 30.63], [32.55, 29.95],
        [33.97, 28.53], [34.48, 30.65], [35.40, 30.31]
    ]
    redsea_times = [-1491.0, -1490.9, -1490.8, -1490.5, -1490.0, -1489.5]
    journeys_data = {
        "name": ["Red Sea Crossing"],
        "epoch_id": [1],
        "primary_book": ["EXO"],
        "path": [redsea_path],
        "timestamps": [redsea_times]
    }
    print("  Compiling Journey Arrow Table...")
    journeys_table = pa.table(journeys_data)
    pq.write_table(journeys_table, "public/bible-journeys.parquet")
    print("  Written: bible-journeys.parquet (1 route)")

if __name__ == "__main__":
    main()