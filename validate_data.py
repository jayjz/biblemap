#!/usr/bin/env python3
"""
validate_data.py — CI-ready data quality checks for Bible3D PostGIS DB.

Exit codes:
  0 — all checks passed
  1 — one or more hard failures (null geometries, orphaned verses > 10%)

Usage:
  python validate_data.py
"""

import os
import sys
import textwrap

import psycopg2

# ── Config ────────────────────────────────────────────────────────────────────
_db_pass = os.environ.get("POSTGRES_PASSWORD", "bible3d_local")
DSN = f"postgresql://bible3d:{_db_pass}@localhost:5432/bible3d"
# ─────────────────────────────────────────────────────────────────────────────

RESET  = "\033[0m"
RED    = "\033[31m"
GREEN  = "\033[32m"
YELLOW = "\033[33m"
BOLD   = "\033[1m"


def ok(msg: str)   -> None: print(f"  {GREEN}✓{RESET}  {msg}")
def fail(msg: str) -> None: print(f"  {RED}✗{RESET}  {msg}")
def warn(msg: str) -> None: print(f"  {YELLOW}!{RESET}  {msg}")


def run(cur, sql: str, params=None):
    cur.execute(textwrap.dedent(sql), params or ())
    return cur.fetchall()


def check_row_counts(cur) -> bool:
    passed = True
    print(f"\n{BOLD}── Row counts ───────────────────────────────────────{RESET}")
    for table in ("places", "verses", "events"):
        rows = run(cur, f"SELECT COUNT(*) FROM {table};")
        count = rows[0][0]
        if count == 0:
            fail(f"{table}: 0 rows  ← run ingestion scripts first")
            passed = False
        else:
            ok(f"{table}: {count:,} rows")
    return passed


def check_null_geometries(cur) -> bool:
    passed = True
    print(f"\n{BOLD}── Null geometries ──────────────────────────────────{RESET}")
    for table in ("places", "events"):
        rows = run(
            cur,
            f"SELECT COUNT(*) FROM {table} WHERE geometry IS NULL;"
        )
        null_count = rows[0][0]
        if null_count > 0:
            fail(f"{table}: {null_count:,} rows with NULL geometry")
            passed = False
        else:
            ok(f"{table}: no null geometries")
    return passed


def check_orphaned_verses(cur) -> bool:
    passed = True
    print(f"\n{BOLD}── Orphaned verse place_id references ───────────────{RESET}")
    rows = run(
        cur,
        """
        SELECT COUNT(*)
        FROM   verses
        WHERE  place_id IS NOT NULL
          AND  place_id NOT IN (SELECT id FROM places);
        """
    )
    orphaned = rows[0][0]

    total_rows = run(cur, "SELECT COUNT(*) FROM verses WHERE place_id IS NOT NULL;")
    linked = total_rows[0][0]

    if linked == 0:
        warn("No verses linked to places yet (place_id all NULL) — skipping ratio check.")
    else:
        ratio = orphaned / linked
        msg = f"verses: {orphaned:,} orphaned place_id out of {linked:,} linked ({ratio:.1%})"
        if ratio > 0.10:
            fail(msg + "  ← exceeds 10% threshold")
            passed = False
        elif orphaned > 0:
            warn(msg)
        else:
            ok(f"verses: no orphaned place_id references")
    return passed


def check_ussher_nulls(cur) -> bool:
    passed = True
    print(f"\n{BOLD}── Events with null ussher_year ─────────────────────{RESET}")
    rows = run(cur, "SELECT COUNT(*) FROM events WHERE ussher_year IS NULL;")
    null_count = rows[0][0]
    total = run(cur, "SELECT COUNT(*) FROM events;")[0][0]
    if total == 0:
        warn("events table is empty.")
        return True
    ratio = null_count / total
    msg = f"events: {null_count:,} / {total:,} missing ussher_year ({ratio:.1%})"
    if ratio > 0.50:
        warn(msg + "  ← >50% have no year; timeline will be sparse")
    else:
        ok(msg)
    return passed


def check_jitter(cur) -> bool:
    """
    If jitter was correctly applied in build_events.py, no two events should
    share an EXACT coordinate.  We sample up to 5 pairs that still share a
    coordinate — presence means jitter was not applied or had no overlaps.
    """
    passed = True
    print(f"\n{BOLD}── Coordinate jitter verification ───────────────────{RESET}")
    rows = run(
        cur,
        """
        SELECT ST_AsText(geometry), COUNT(*) AS n
        FROM   events
        WHERE  geometry IS NOT NULL
        GROUP  BY ST_AsText(geometry)
        HAVING COUNT(*) > 1
        ORDER  BY n DESC
        LIMIT  5;
        """
    )
    if not rows:
        ok("No duplicate coordinates found — jitter applied correctly.")
    else:
        warn(f"{len(rows)} coordinate(s) still shared by multiple events:")
        for wkt, n in rows:
            print(f"       {n}× {wkt[:80]}")
        warn("Re-run build_events.py if this is unexpected.")
        # Not a hard failure — overlapping coords can be legitimate
        # (e.g. multiple events truly at Jerusalem on the same coordinate
        #  before jitter, with jitter only applying within a session).
    return passed


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print(f"{BOLD}=== validate_data.py ==={RESET}")
    print(f"  DSN: postgresql://bible3d:***@localhost:5432/bible3d")

    try:
        conn = psycopg2.connect(DSN)
    except Exception as exc:
        print(f"\n{RED}Cannot connect to database: {exc}{RESET}")
        print("  Is the container running?  Run: docker compose up -d")
        sys.exit(1)

    failures = []
    with conn:
        with conn.cursor() as cur:
            if not check_row_counts(cur):
                failures.append("row counts")
            if not check_null_geometries(cur):
                failures.append("null geometries")
            if not check_orphaned_verses(cur):
                failures.append("orphaned verses")
            check_ussher_nulls(cur)   # warning-only
            check_jitter(cur)         # warning-only

    conn.close()

    print(f"\n{BOLD}── Result ───────────────────────────────────────────{RESET}")
    if failures:
        fail(f"FAILED checks: {', '.join(failures)}")
        sys.exit(1)
    else:
        ok("All hard checks passed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
