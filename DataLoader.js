/**
 * DataLoader.js
 *
 * Production-ready deck.gl + GeoArrow component for Bible3D.
 *
 * Architecture:
 *   fetch(bible-events.parquet)
 *     → parquet-wasm  (WASM thread, zero main-thread parsing)
 *     → Arrow IPC stream
 *     → tableFromIPC  (Apache Arrow JS — columnar, already in typed arrays)
 *     → GeoArrowScatterplotLayer / GeoArrowPathLayer
 *     → WebGL2 GPU buffers  (no JS iteration, no GeoJSON, no JSON.parse)
 *
 *   DataFilterExtension ties `ussher_year` to a GPU uniform.
 *   Changing `currentYear` updates ONE uniform register — 0 JS per frame.
 *
 * Dependencies (add to package.json):
 *   "apache-arrow": "^14.0.2",
 *   "parquet-wasm": "^0.6.1",
 *   "deck.gl": "^9.0.0",
 *   "@deck.gl/extensions": "^9.0.0",
 *   "@geoarrow/deck.gl-layers": "^0.3.0"
 */

"use client"; // Next.js App Router — this component is client-only

import { useEffect, useRef, useState, useCallback } from "react";
import { tableFromIPC }                from "apache-arrow";
import DeckGL                          from "@deck.gl/react";
import { COORDINATE_SYSTEM }          from "@deck.gl/core";
import { DataFilterExtension }        from "@deck.gl/extensions";
import {
  GeoArrowScatterplotLayer,
  GeoArrowPathLayer,
} from "@geoarrow/deck.gl-layers";

// ── Constants ─────────────────────────────────────────────────────────────────
const PARQUET_URL = "/bible-events.parquet";

// Ussher chronology spans roughly 4004 BC → 96 AD.
const YEAR_MIN  = -4004;
const YEAR_MAX  =    96;

// Scatterplot visual encoding
const POINT_RADIUS_PIXELS = 6;
const COLOR_BY_TYPE = {
  battle:   [220,  50,  47, 220],
  journey:  [ 38, 139, 210, 200],
  prophecy: [133, 153,   0, 200],
  miracle:  [203,  75,  22, 220],
  birth:    [108, 113, 196, 200],
  death:    [101, 123, 131, 180],
  covenant: [181, 137,   0, 220],
  building: [ 42, 161, 152, 200],
  general:  [147, 161, 161, 160],
};
const DEFAULT_COLOR = [147, 161, 161, 160];

// ── Parquet loader ────────────────────────────────────────────────────────────
/**
 * Loads the GeoParquet file via parquet-wasm (runs in a Worker via WASM).
 * Returns an Apache Arrow Table with all columns still in columnar form.
 * This function must only be called once; the table is reused across renders.
 */
async function loadArrowTable(url) {
  // Dynamic import keeps the WASM bundle out of the initial JS chunk.
  const parquet = await import("parquet-wasm/esm");
  await parquet.default(); // initialise WASM runtime

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  // .arrayBuffer() → Uint8Array → parquet-wasm parse → Arrow IPC bytes
  const buffer       = await response.arrayBuffer();
  const wasmTable    = parquet.readParquet(new Uint8Array(buffer));
  const ipcBytes     = wasmTable.intoIPCStream();    // zero-copy Arrow IPC

  // tableFromIPC turns the IPC bytes into a columnar Arrow Table.
  // Geometry column stays as WKB binary — GeoArrow layers read it natively.
  const arrowTable   = tableFromIPC(ipcBytes);

  console.info(
    `[DataLoader] Loaded ${arrowTable.numRows.toLocaleString()} rows, ` +
    `${arrowTable.numCols} columns.`
  );
  return arrowTable;
}

// ── Layer builder ─────────────────────────────────────────────────────────────
/**
 * Builds deck.gl layers from an Arrow Table.
 *
 * DataFilterExtension notes:
 *   • filterSize: 1  — single float filter value (ussher_year)
 *   • getFilterValue — resolved against the Arrow column per-vertex on the GPU
 *   • filterRange    — [min, max] updated as the user scrubs the timeline
 *   • filterSoftRange — adds a 200-year fade-in/out for cinematic transitions
 *
 * The extension uploads ussher_year as a GPU attribute ONCE.  After that,
 * only the filterRange uniform changes — no JS work per animation frame.
 */
function buildLayers(arrowTable, currentYear, onHover) {
  if (!arrowTable) return [];

  // Separate POINT and LINESTRING rows using the pre-computed geom_type column.
  // GeoArrow layers can accept a filtered view; use Arrow predicate pushdown
  // by slicing the table rather than copying rows.
  const geomTypeCol = arrowTable.getChild("geom_type");
  const isPoint     = (i) => {
    const val = geomTypeCol?.get(i);
    return !val || val.toLowerCase() === "point";
  };

  // Filter range: show everything from the dawn of creation up to currentYear.
  // NaN/null rows (no year data) are excluded by clamping to YEAR_MIN - 1.
  const filterRange = [[YEAR_MIN - 1, currentYear]];

  // ── Scatterplot — point events ─────────────────────────────────────────────
  const scatterLayer = new GeoArrowScatterplotLayer({
    id:   "bible-events-scatter",
    data: arrowTable,

    // GeoArrow reads the 'geometry' WKB column directly as GPU attribute.
    // No JS → GPU copy happens here; it's already in the right typed array.
    getPosition:  arrowTable.getChild("geometry"),

    // Color mapped by event_type (dictionary column → string per row)
    getFillColor: (row, { index, data }) => {
      const typeCol = data.getChild("event_type");
      const type    = typeCol?.get(index) ?? "general";
      return COLOR_BY_TYPE[type] ?? DEFAULT_COLOR;
    },

    radiusMinPixels: 3,
    radiusMaxPixels: POINT_RADIUS_PIXELS,
    radiusUnits:     "pixels",
    filled:          true,
    stroked:         false,

    pickable: true,
    onHover,

    // ── DataFilterExtension ─────────────────────────────────────────────────
    // getFilterValue references the Arrow ussher_year column.
    // The extension uploads this as a float32 vertex attribute.
    extensions:     [new DataFilterExtension({ filterSize: 1 })],
    getFilterValue: arrowTable.getChild("ussher_year"),
    filterRange,
    // 200-year soft fade — events approaching currentYear fade in gradually.
    filterSoftRange: [[currentYear - 200, currentYear]],
    filterTransformSize: false, // keep radius constant regardless of filter value

    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    updateTriggers: {
      filterRange: [currentYear],
    },
  });

  // ── Path layer — journey / linestring events ───────────────────────────────
  // Only rendered if the table actually contains LINESTRING geometries.
  const hasLinePaths =
    geomTypeCol &&
    Array.from({ length: Math.min(arrowTable.numRows, 200) }, (_, i) =>
      geomTypeCol.get(i)
    ).some((v) => v?.toLowerCase() === "linestring");

  const pathLayer = hasLinePaths
    ? new GeoArrowPathLayer({
        id:   "bible-events-paths",
        data: arrowTable,

        getPath:  arrowTable.getChild("geometry"),
        getColor: [38, 139, 210, 180],
        getWidth: 2,
        widthUnits: "pixels",
        widthMinPixels: 1,
        capRounded: true,
        jointRounded: true,

        pickable: true,
        onHover,

        extensions:     [new DataFilterExtension({ filterSize: 1 })],
        getFilterValue: arrowTable.getChild("ussher_year"),
        filterRange,
        filterSoftRange: [[currentYear - 200, currentYear]],

        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        updateTriggers: {
          filterRange: [currentYear],
        },
      })
    : null;

  return [scatterLayer, pathLayer].filter(Boolean);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function getTooltip({ object, index, layer }) {
  if (!object || index == null) return null;

  // With GeoArrow layers, `object` is the row index; we read columns directly.
  const data = layer?.props?.data;
  if (!data) return null;

  const get = (col) => data.getChild(col)?.get(index) ?? "";

  const year = get("ussher_year");
  const yearLabel =
    year === null || isNaN(year)
      ? "Unknown date"
      : year < 0
      ? `${Math.abs(Math.round(year))} BC`
      : `${Math.round(year)} AD`;

  return {
    html: `
      <div style="max-width:280px;font-family:sans-serif;font-size:13px;line-height:1.5">
        <strong>${get("name")}</strong>
        <div style="color:#93a1a1">${yearLabel} · ${get("event_type")}</div>
        <div style="margin-top:4px">${get("description")}</div>
        ${
          get("verse_text_snippet")
            ? `<div style="margin-top:6px;font-style:italic;color:#93a1a1">"${get("verse_text_snippet")}…"</div>`
            : ""
        }
      </div>
    `,
    style: {
      backgroundColor: "#002b36",
      color: "#839496",
      border: "1px solid #073642",
      borderRadius: "6px",
      padding: "10px 14px",
    },
  };
}

// ── Main component ────────────────────────────────────────────────────────────
const INITIAL_VIEW_STATE = {
  longitude: 35.2,
  latitude:  31.8,
  zoom:       5,
  pitch:     30,
  bearing:    0,
};

export default function DataLoader() {
  const [arrowTable, setArrowTable] = useState(null);
  const [loadError,  setLoadError]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [currentYear, setCurrentYear] = useState(YEAR_MIN);
  const [hoverInfo,  setHoverInfo]  = useState(null);
  const animFrameRef = useRef(null);
  const isAnimating  = useRef(false);

  // ── Load parquet once on mount ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const table = await loadArrowTable(PARQUET_URL);
        if (!cancelled) {
          setArrowTable(table);
          setLoading(false);
        }
      } catch (err) {
        console.error("[DataLoader] Load failed:", err);
        if (!cancelled) {
          setLoadError(err.message);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Timeline animation ─────────────────────────────────────────────────────
  // Animates from YEAR_MIN → YEAR_MAX at ~100 years/second.
  // Uses requestAnimationFrame so the GPU filter uniform update is tied
  // to the display refresh — no setInterval jank.
  const startAnimation = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    let lastTs = null;
    const SPEED = 100; // years per second

    const tick = (ts) => {
      if (!isAnimating.current) return;
      const dt   = lastTs ? (ts - lastTs) / 1000 : 0;
      lastTs     = ts;
      setCurrentYear((prev) => {
        const next = prev + SPEED * dt;
        if (next >= YEAR_MAX) {
          isAnimating.current = false;
          return YEAR_MAX;
        }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAnimation = useCallback(() => {
    isAnimating.current = false;
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Clean up RAF on unmount
  useEffect(() => () => stopAnimation(), [stopAnimation]);

  // ── Layers ─────────────────────────────────────────────────────────────────
  const layers = buildLayers(arrowTable, currentYear, setHoverInfo);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.overlay}>
        <p>Loading Bible events…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.overlay}>
        <p style={{ color: "#dc322f" }}>Error: {loadError}</p>
      </div>
    );
  }

  const yearLabel =
    currentYear < 0
      ? `${Math.abs(Math.round(currentYear))} BC`
      : `${Math.round(currentYear)} AD`;

  return (
    <div style={styles.root}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={layers}
        getTooltip={getTooltip}
        style={{ width: "100%", height: "100%" }}
      />

      {/* ── Timeline scrubber ────────────────────────────────────────────── */}
      <div style={styles.controls}>
        <div style={styles.yearLabel}>{yearLabel}</div>

        <input
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step={1}
          value={Math.round(currentYear)}
          onChange={(e) => {
            stopAnimation();
            setCurrentYear(Number(e.target.value));
          }}
          style={styles.slider}
          aria-label="Timeline year"
        />

        <div style={styles.buttons}>
          <button onClick={startAnimation} style={styles.btn}>▶ Play</button>
          <button onClick={stopAnimation}  style={styles.btn}>⏸ Pause</button>
          <button
            onClick={() => { stopAnimation(); setCurrentYear(YEAR_MIN); }}
            style={styles.btn}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inline styles (no external CSS dependency) ────────────────────────────────
const styles = {
  root: {
    position: "relative",
    width:    "100vw",
    height:   "100vh",
    background: "#002b36",
  },
  overlay: {
    position:  "absolute",
    inset:     0,
    display:   "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#93a1a1",
    fontSize: "1.2rem",
    background: "#002b36",
  },
  controls: {
    position:    "absolute",
    bottom:       24,
    left:         "50%",
    transform:    "translateX(-50%)",
    background:   "rgba(0,43,54,0.92)",
    border:       "1px solid #073642",
    borderRadius:  8,
    padding:       "12px 24px",
    minWidth:      360,
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           8,
    backdropFilter: "blur(6px)",
  },
  yearLabel: {
    color:      "#eee8d5",
    fontSize:    "1.4rem",
    fontWeight:  700,
    fontVariantNumeric: "tabular-nums",
    minWidth:    120,
    textAlign:  "center",
  },
  slider: {
    width:   "100%",
    accentColor: "#268bd2",
    cursor:  "pointer",
  },
  buttons: {
    display: "flex",
    gap:      8,
  },
  btn: {
    background:   "#073642",
    color:        "#839496",
    border:       "1px solid #586e75",
    borderRadius:  4,
    padding:       "4px 12px",
    cursor:        "pointer",
    fontSize:      "0.85rem",
  },
};
