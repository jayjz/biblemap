#!/usr/bin/env python3
"""
Phase 2 — Step 2: Ingest Bible JSON into the verses table.
Fixed for 2026 GitHub raw paths + BOM + User-Agent blocks.
"""

import json
import re
import sys
from collections import defaultdict

import psycopg2
import requests
from psycopg2.extras import execute_values

# ── Config ────────────────────────────────────────────────────────────────────
DB_DSN = "postgresql://bible3d:bible3d_local@localhost:5432/bible3d"
BATCH_SIZE = 500

# Verified live URLs (March 2026)
BIBLE_JSON_URLS = [
    "https://raw.githubusercontent.com/thiagobodruk/bible/refs/heads/master/json/en_kjv.json",   # ← THIS ONE WORKS (KJV)
    "https://raw.githubusercontent.com/thiagobodruk/bible/refs/heads/master/json/en_bbe.json",   # Basic English fallback
]

# ── Download with BOM + browser disguise ─────────────────────────────────────
def download_json(url: str) -> dict | list:
    print(f"  GET {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    resp = requests.get(url, headers=headers, timeout=60)
    resp.raise_for_status()
    
    # Eat the UTF-8 BOM that breaks json.loads
    text = resp.content.decode("utf-8-sig")
    return json.loads(text)

# ── Parser (exactly matches your sample structure) ───────────────────────────
def parse_bible_json(data) -> list:
    records = []
    if isinstance(data, list):
        for book_obj in data:
            if not isinstance(book_obj, dict):
                continue
            # Handle both "name" and "abbrev" keys
            book_name = book_obj.get("name") or book_obj.get("book") or ""
            if not book_name and "abbrev" in book_obj:
                book_name = book_obj["abbrev"].upper()  # fallback
            chapters = book_obj.get("chapters", [])
            for chap_idx, verses in enumerate(chapters, 1):
                if not isinstance(verses, list):
                    continue
                for verse_idx, text in enumerate(verses, 1):
                    if isinstance(text, str) and text.strip():
                        ref = f"{book_name} {chap_idx}:{verse_idx}"
                        records.append((ref, book_name, chap_idx, verse_idx, text.strip()))
    return records

# ── Place linking (kept exactly as before) ───────────────────────────────────
def build_place_lookup(conn) -> dict:
    with conn.cursor() as cur:
        cur.execute("SELECT id, name FROM places ORDER BY LENGTH(name) DESC;")
        rows = cur.fetchall()
    return {name.lower(): pid for pid, name in rows}

def build_place_patterns(lookup: dict) -> list:
    patterns = []
    for name, pid in lookup.items():
        escaped = re.escape(name)
        pat = re.compile(rf"\b{escaped}\b", re.IGNORECASE)
        patterns.append((pat, pid))
    return patterns

def find_place_id(text: str, patterns: list) -> int | None:
    for pat, pid in patterns:
        if pat.search(text):
            return pid
    return None

# ── Insert ───────────────────────────────────────────────────────────────────
def insert_verses(conn, records: list, place_patterns: list) -> None:
    with conn.cursor() as cur:
        print("  Truncating verses table…")
        cur.execute("TRUNCATE verses RESTART IDENTITY;")
        
        total = len(records)
        inserted = 0
        for i in range(0, total, BATCH_SIZE):
            batch = []
            for ref, book, chap, verse, text in records[i:i + BATCH_SIZE]:
                pid = find_place_id(text, place_patterns)
                batch.append((ref, book, chap, verse, text, pid))
            
            execute_values(
                cur,
                """
                INSERT INTO verses (reference, book, chapter, verse, text, place_id)
                VALUES %s
                ON CONFLICT (reference) DO NOTHING
                """,
                batch,
            )
            inserted += len(batch)
            if i % 5000 == 0:
                print(f"  Progress: {inserted:,}/{total:,}")
    
    conn.commit()
    print(f"  Inserted: {inserted:,} verses")

# ── Main ─────────────────────────────────────────────────────────────────────
def main() -> None:
    print("=== ingest_bible_text.py (2026 fixed version) ===")
    
    data = None
    for url in BIBLE_JSON_URLS:
        try:
            data = download_json(url)
            print(f"  SUCCESS: Loaded from {url}")
            break
        except Exception as e:
            print(f"  Failed {url}: {type(e).__name__} - {e}")
    
    if data is None:
        print("ERROR: All sources failed.", file=sys.stderr)
        sys.exit(1)
    
    print("Parsing Bible JSON…")
    records = parse_bible_json(data)
    print(f"  Parsed {len(records):,} verses.")
    
    if not records:
        print("ERROR: No verses parsed.", file=sys.stderr)
        sys.exit(1)
    
    print("Connecting to database…")
    conn = psycopg2.connect(DB_DSN)
    try:
        print("Building place-name lookup…")
        lookup = build_place_lookup(conn)
        print(f"  {len(lookup):,} place names loaded.")
        place_patterns = build_place_patterns(lookup)
        
        print("Inserting verses…")
        insert_verses(conn, records, place_patterns)
    finally:
        conn.close()
    
    print("Done — Bible text loaded.")

if __name__ == "__main__":
    main()