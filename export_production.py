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

    # Write dummy journeys to prevent 404s
    empty_table = pa.Table.from_pydict({"ussher_year": pa.array([], type=pa.float64())})
    pq.write_table(empty_table, "public/bible-journeys.parquet")

if __name__ == "__main__":
    main()