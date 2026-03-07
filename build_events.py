#!/usr/bin/env python3
"""
Phase 2.5 — build_events.py: Indestructible Ussher year parsing.
Fixes: empty-string ffill, gc_bc_ad column detection, pd.NA-safe parse_ussher_year.
"""

import io
import math
import re
import sys
from collections import defaultdict
from typing import Optional

import pandas as pd
import psycopg2
import requests
from psycopg2.extras import execute_values

# ── Config ────────────────────────────────────────────────────────────────────
DB_DSN = "postgresql://bible3d:bible3d_local@localhost:5432/bible3d"

USSHER_URL = (
    "https://raw.githubusercontent.com/BradyStephenson/"
    "bible-data/master/Ussher-AnnalsOfTheWorld.csv"
)

BATCH_SIZE = 200

# Jitter parameters for overlapping events (Jerusalem Problem)
JITTER_BASE_RADIUS = 0.001    # degrees; first ring
JITTER_RADIUS_STEP = 0.0008   # degrees added per ring
GOLDEN_ANGLE       = math.pi * (3 - math.sqrt(5))  # ≈ 2.399 rad
# ─────────────────────────────────────────────────────────────────────────────

def download_csv(url: str) -> str:
    print(f"  GET {url}")
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return resp.text

def _find_col(columns: list[str], *hints: str) -> Optional[str]:
    for hint in hints:
        for col in columns:
            if hint in col.lower():
                return col
    return None

# ── Indestructible Year Parsing ───────────────────────────────────────────────
def parse_ussher_year(raw) -> Optional[int]:
    if raw is None:
        return None
    try:
        if pd.isna(raw):
            return None
    except (TypeError, ValueError):
        pass

    s = str(raw).strip().lower()
    if not s or s in ("", "nan", "n/a", "none", "<na>", "–", "—", "-"):
        return None

    # Strip common junk like "circa", "ca.", "c."
    s = re.sub(r'circa|ca\.?|c\.\s*', '', s).strip()

    # Try direct int first (bare years)
    try:
        val = int(float(s))
        return -abs(val) if val > 0 else val  # bare positive = BC
    except ValueError:
        pass

    # "4004 bc", "4004 b.c.", "4004 bce"
    m = re.search(r'(\d{3,4})\s*(bc|bce|b\.c\.?|b\.c\.e?\.?)?', s)
    if m:
        year = int(m.group(1))
        era = m.group(2)
        return -year if era else -year  # assume BC if no era

    # "33 ad", "33 ce", "33 a.d."
    m = re.search(r'(\d{1,4})\s*(ad|ce|a\.d\.?|c\.e\.?)?', s)
    if m:
        year = int(m.group(1))
        era = m.group(2)
        return year if era else year

    # Last resort: extract first number and guess BC if > 100
    m = re.search(r'(\d{3,4})', s)
    if m:
        year = int(m.group(1))
        return -year if year > 100 else year

    return None

# ── Verse reference extraction ────────────────────────────────────────────────
_VERSE_RE = re.compile(r"\b(?:\d\s+)?[A-Za-z]+\.?\s+\d+:\d+(?:[,\-]\d+)*")

def extract_verse_refs(text: str) -> list[str]:
    if not text or not isinstance(text, str):
        return []
    return _VERSE_RE.findall(text)

# ── Event type inference ──────────────────────────────────────────────────────
_TYPE_KEYWORDS: dict[str, list[str]] = {
    "battle":   ["battle", "war", "fight", "slew", "defeated", "conquest"],
    "journey":  ["journey", "travel", "went", "fled", "migration", "exodus"],
    "prophecy": ["prophecy", "prophes", "foretold", "vision", "dream"],
    "miracle":  ["miracle", "miracl", "parted", "raised", "healed", "manna"],
    "birth":    ["born", "birth", "begat", "begot"],
    "death":    ["died", "death", "killed", "slain", "buried"],
    "covenant": ["covenant", "promise", "oath", "vow"],
    "building": ["built", "build", "temple", "tabernacle", "ark", "wall"],
}

def infer_event_type(text: str) -> str:
    if not text or not isinstance(text, str):
        return "general"
    lower = text.lower()
    for etype, keywords in _TYPE_KEYWORDS.items():
        if any(kw in lower for kw in keywords):
            return etype
    return "general"

# ── Place resolution ──────────────────────────────────────────────────────────
def load_places(conn) -> list[tuple]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, name, ST_X(geometry) AS lon, ST_Y(geometry) AS lat
            FROM places WHERE geometry IS NOT NULL ORDER BY LENGTH(name) DESC;
            """
        )
        return cur.fetchall()

def build_name_index(places: list[tuple]) -> dict[str, tuple]:
    return {name.lower(): (pid, lon, lat) for pid, name, lon, lat in places}

def resolve_place(text: str, name_index: dict[str, tuple]) -> Optional[tuple]:
    if not text: return None
    lower = text.lower()
    for name, (pid, lon, lat) in name_index.items():
        if re.search(rf"\b{re.escape(name)}\b", lower):
            return (pid, lon, lat)
    return None

# ── Jerusalem Problem: spiral jitter ──────────────────────────────────────────
def spiral_offset(n: int) -> tuple[float, float]:
    if n == 0: return (0.0, 0.0)
    angle  = n * GOLDEN_ANGLE
    radius = JITTER_BASE_RADIUS + JITTER_RADIUS_STEP * math.floor((-1 + math.sqrt(1 + 4 * n)) / 2)
    return (radius * math.cos(angle), radius * math.sin(angle))

def apply_jitter(events: list[dict]) -> list[dict]:
    coord_counts: dict[tuple, int] = defaultdict(int)
    for ev in events:
        if ev["lon"] is None or ev["lat"] is None: continue
        key = (round(ev["lon"], 6), round(ev["lat"], 6))
        n = coord_counts[key]
        coord_counts[key] += 1
        if n > 0:
            dlon, dlat = spiral_offset(n)
            ev["lon"] += dlon
            ev["lat"] += dlat

    collisions = {k: v for k, v in coord_counts.items() if v > 1}
    if collisions:
        print(f"  Jerusalem Problem: {len(collisions)} shared coordinates, {sum(v - 1 for v in collisions.values())} events jittered.")
    return events

# ── CSV parsing ───────────────────────────────────────────────────────────────
def parse_ussher_csv(csv_text: str, name_index: dict[str, tuple]) -> list[dict]:
    df: Optional[pd.DataFrame] = None
    for sep in (",", "\t", ";"):
        try:
            candidate = pd.read_csv(io.StringIO(csv_text), sep=sep, low_memory=False, dtype=str)
            if len(candidate.columns) >= 2:
                df = candidate
                break
        except Exception:
            continue

    if df is None or df.empty:
        raise RuntimeError("Could not parse Ussher CSV.")

    df.columns = [c.strip().lstrip("#").strip() for c in df.columns]
    
    # 1. Target the exact columns from the CSV sample
    if "gc_year" in df.columns:
        df["gc_year"] = df["gc_year"].replace(r"^\s*$", pd.NA, regex=True).ffill()
    if "gc_bc_ad" in df.columns:
        df["gc_bc_ad"] = df["gc_bc_ad"].replace(r"^\s*$", pd.NA, regex=True).ffill()

    events: list[dict] = []
    skipped = 0

    for _, row in df.iterrows():
        # 2. Combine the magnitude and the era into a single string (e.g. "4004 BC")
        y_val = row.get("gc_year")
        era_val = row.get("gc_bc_ad")
        
        if pd.notna(y_val):
            raw_year = f"{y_val} {era_val}" if pd.notna(era_val) else str(y_val)
        else:
            raw_year = None
            
        ussher_year = parse_ussher_year(raw_year)

        raw_name = row.get("event")
        name = str(raw_name).strip() if pd.notna(raw_name) else None
        if not name or name.lower() in ("nan", "none", "<na>"):
            skipped += 1
            continue

        description = name # In Ussher, the event is the description

        combined_text = name
        verse_refs = extract_verse_refs(combined_text)
        seen: set[str] = set()
        verse_refs = [r for r in verse_refs if not (r in seen or seen.add(r))]  

        event_type = infer_event_type(combined_text)
        resolved = resolve_place(combined_text, name_index)
        lon, lat = (resolved[1], resolved[2]) if resolved else (None, None)

        events.append({
            "name":        name,
            "ussher_year": ussher_year,
            "lon":         lon,
            "lat":         lat,
            "event_type":  event_type,
            "description": description,
            "verse_refs":  verse_refs,
        })

    print(f"  Parsed {len(events)} events, skipped {skipped} blank rows.")
    missing_year = sum(1 for e in events if e["ussher_year"] is None)
    print(f"  Events with ussher_year=None after parse: {missing_year}")
    return events
    
# ── DB insert ─────────────────────────────────────────────────────────────────
def insert_events(conn, events: list[dict]) -> None:
    with conn.cursor() as cur:
        print("  Truncating events table...")
        cur.execute("TRUNCATE events RESTART IDENTITY;")

        for i in range(0, len(events), BATCH_SIZE):
            batch = events[i : i + BATCH_SIZE]
            rows: list[tuple] = []
            for ev in batch:
                geom_ewkt = f"SRID=4326;POINT({ev['lon']} {ev['lat']})" if ev["lon"] is not None else None
                rows.append((
                    ev["name"], ev["ussher_year"], geom_ewkt, 
                    ev["event_type"], ev["description"], ev["verse_refs"] if ev["verse_refs"] else None
                ))

            execute_values(
                cur,
                "INSERT INTO events (name, ussher_year, geometry, event_type, description, verse_refs) VALUES %s",
                rows,
                template="(%s, %s, ST_GeomFromEWKT(%s), %s, %s, %s)",
            )
    conn.commit()

def main() -> None:
    print("=== build_events.py (Phase 2.5 - Year Fix) ===")
    csv_text = download_csv(USSHER_URL)
    conn = psycopg2.connect(DB_DSN)
    try:
        places = load_places(conn)
        name_index = build_name_index(places)
        events = parse_ussher_csv(csv_text, name_index)
        events = apply_jitter(events)
        insert_events(conn, events)
    finally:
        conn.close()

    has_geom   = sum(1 for e in events if e["lon"] is not None)
    has_year   = sum(1 for e in events if e["ussher_year"] is not None)
    missing_yr = len(events) - has_year
    print(f"Done — {len(events)} events loaded ({has_geom} with geometry, {missing_yr} missing ussher_year).")

if __name__ == "__main__":
    main()