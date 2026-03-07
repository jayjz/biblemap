#!/usr/bin/env python3
"""
Phase 2 — Step 1: Ingest OpenBible geocoding CSV into the places table.

Source:
  https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/master/places.csv

Column detection is intentionally flexible; the CSV has historically shipped
with slightly different headers across forks.
"""

import io
import sys

import pandas as pd
import psycopg2
import requests
from psycopg2.extras import execute_values

# ── Config ────────────────────────────────────────────────────────────────────
DB_DSN = "postgresql://bible3d:bible3d_local@localhost:5432/bible3d"

PLACES_URL = "https://www.openbible.info/geo/data/places.txt"
BATCH_SIZE = 500
# ─────────────────────────────────────────────────────────────────────────────


def download(url: str) -> str:
    print(f"  GET {url}")
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return resp.text


def _find_col(columns: list, *hints: str) -> str | None:
    """Return first column whose lowercased name contains any hint substring."""
    for hint in hints:
        for col in columns:
            if hint in col.lower():
                return col
    return None


def parse_places(csv_text: str) -> list:
    """
    Returns a list of (name, modern_name, lon, lat, confidence) tuples.

    The OpenBible CSV is comma-separated but some forks use tabs.
    Column name hints cover both the canonical headers and common variants.
    """
    df = None
    for sep in (",", "\t"):
        try:
            candidate = pd.read_csv(io.StringIO(csv_text), sep=sep, low_memory=False)
            if len(candidate.columns) >= 3:
                df = candidate
                break
        except Exception:
            continue

    if df is None or df.empty:
        raise RuntimeError("Could not parse CSV with comma or tab separator.")

    # Strip comment markers (e.g. '#OpenBible ID')
    df.columns = [c.strip().lstrip("#").strip() for c in df.columns]
    cols = list(df.columns)
    print(f"  Detected columns: {cols}")

    lat_col  = _find_col(cols, "latitude", "lat")
    lon_col  = _find_col(cols, "longitude", "lon")
    # Prefer KJV name, then ESV, then any 'name' column
    name_col = _find_col(cols, "kjv", "esv", "openbible", "name", "title", "place")
    conf_col = _find_col(cols, "confidence", "accuracy", "acc", "conf")

    if not lat_col or not lon_col:
        raise RuntimeError(f"Cannot locate lat/lon columns. Available: {cols}")
    if not name_col:
        raise RuntimeError(f"Cannot locate name column. Available: {cols}")

    print(
        f"  Using — name={name_col!r}  lat={lat_col!r}  "
        f"lon={lon_col!r}  conf={conf_col!r}"
    )

    # Strip out approximate (~) and uncertain (?) markers BEFORE casting to float
    df[lat_col] = df[lat_col].astype(str).str.replace(r'[~?]', '', regex=True)
    df[lon_col] = df[lon_col].astype(str).str.replace(r'[~?]', '', regex=True)

    # Now safely cast to numeric (blanks or pure '?' become NaN and get dropped)
    df[lat_col] = pd.to_numeric(df[lat_col], errors="coerce")
    df[lon_col] = pd.to_numeric(df[lon_col], errors="coerce")
    df = df.dropna(subset=[lat_col, lon_col])
    df = df[df[lat_col].between(-90, 90) & df[lon_col].between(-180, 180)]

    records = []
    for _, row in df.iterrows():
        raw_name = row.get(name_col)
        name = str(raw_name).strip() if pd.notna(raw_name) else None
        if not name or name.lower() == "nan":
            continue

        conf = None
        if conf_col:
            raw_conf = row.get(conf_col)
            if pd.notna(raw_conf):
                try:
                    conf = round(max(0.0, min(1.0, float(raw_conf))), 3)
                except (ValueError, TypeError):
                    pass

        records.append(
            (name, None, float(row[lon_col]), float(row[lat_col]), conf)
        )

    return records


def insert_places(conn, records: list) -> None:
    with conn.cursor() as cur:
        print("  Truncating places table (cascades to verses.place_id)…")
        cur.execute("TRUNCATE places RESTART IDENTITY CASCADE;")

        for i in range(0, len(records), BATCH_SIZE):
            batch = records[i : i + BATCH_SIZE]
            execute_values(
                cur,
                """
                INSERT INTO places (name, modern_name, geometry, confidence)
                VALUES %s
                """,
                batch,
                template=(
                    "(%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)"
                ),
            )
            print(f"  Inserted rows {i + 1}–{i + len(batch)}")

    conn.commit()


def main() -> None:
    print("=== ingest_places.py ===")

    print("Downloading places CSV…")
    csv_text = download(PLACES_URL)

    print("Parsing CSV…")
    records = parse_places(csv_text)
    print(f"  Valid records: {len(records)}")

    if not records:
        print("ERROR: No valid records found — aborting.", file=sys.stderr)
        sys.exit(1)

    print("Connecting to database…")
    conn = psycopg2.connect(DB_DSN)
    try:
        insert_places(conn, records)
    finally:
        conn.close()

    print(f"Done — {len(records)} places loaded.")


if __name__ == "__main__":
    main()
