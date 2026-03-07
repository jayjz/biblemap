"use client";
/**
 * components/DataLoader.tsx
 * Production deck.gl viewer for Bible3D — Narrative Scrubber Edition.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tableFromIPC } from "apache-arrow";
import DeckGL from "@deck.gl/react";
import { MapView, type PickingInfo } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

// ── Constants ─────────────────────────────────────────────────────────────────
// THE FIX: Cache-buster query string. Forces the browser to download the new schema.
const POINTS_URL = "/bible-points.parquet?v=" + Date.now();
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const SPEED = 80;

const EPOCHS = [
  { id: 0, name: "Creation & Patriarchs", description: "From Eden to the descent into Egypt", hash: "#genesis" },
  { id: 1, name: "Exodus & Conquest",     description: "Moses, Sinai, and the Promised Land", hash: "#exodus" },
  { id: 2, name: "Judges & Kings",        description: "From Joshua to the divided kingdom",  hash: "#kings" },
  { id: 3, name: "Exile & Return",        description: "Babylon to the Second Temple",        hash: "#exile" },
  { id: 4, name: "Intertestamental",      description: "Silence between the Testaments",      hash: "#inter" },
  { id: 5, name: "Jesus & Early Church",  description: "Gospels to the end of Acts",          hash: "#gospels" },
];

const TYPE_COLORS: Record<string, [number, number, number, number]> = {
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
const DEFAULT_COLOR: [number, number, number, number] = [147, 161, 161, 160];

const INITIAL_VIEW = { longitude: 35.2, latitude: 31.8, zoom: 4.5, pitch: 35, bearing: 0 };

interface BibleEvent {
  name: string; ussher_year: number; epoch_id: number; event_type: string;
  description: string; lon: number; lat: number; verse_text_snippet: string;
}

// ── Parquet loader ────────────────────────────────────────────────────────────
async function fetchAndUnpackEvents(url: string): Promise<BibleEvent[]> {
  const parquet = await import("parquet-wasm/esm");
  await (parquet as any).default?.();
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  const wasmTbl = (parquet as any).readParquet(new Uint8Array(buffer));
  const table = tableFromIPC(wasmTbl.intoIPCStream());

  const events: BibleEvent[] = [];
  const cols = {
    n: table.getChild("name"), y: table.getChild("ussher_year"), e: table.getChild("epoch_id"),
    t: table.getChild("event_type"), d: table.getChild("description"),
    lo: table.getChild("lon"), la: table.getChild("lat"), v: table.getChild("verse_text_snippet")
  };

  for (let i = 0; i < table.numRows; i++) {
    events.push({
      name: String(cols.n?.get(i) ?? ""), ussher_year: Number(cols.y?.get(i) ?? 0),
      epoch_id: Number(cols.e?.get(i) ?? 0), event_type: String(cols.t?.get(i) ?? ""),
      description: String(cols.d?.get(i) ?? ""), lon: Number(cols.lo?.get(i) ?? 0),
      lat: Number(cols.la?.get(i) ?? 0), verse_text_snippet: String(cols.v?.get(i) ?? "")
    });
  }
  return events;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ info }: { info: PickingInfo | null }) {
  if (!info?.object) return null;
  const data = info.object as BibleEvent;

  const yearLabel = data.ussher_year < 0 
    ? `${Math.abs(Math.round(data.ussher_year))} BC` 
    : `${Math.round(data.ussher_year)} AD`;

  return (
    <div style={css.tooltip}>
      <strong style={{ color: "#eee8d5" }}>{data.name}</strong>
      <div style={{ color: "#586e75", fontSize: 11, marginBottom: 4 }}>
        {yearLabel} · {data.event_type}
      </div>
      <div>{data.description}</div>
      {data.verse_text_snippet && (
        <div style={{ marginTop: 8, fontStyle: "italic", color: "#93a1a1", borderTop: "1px solid #073642", paddingTop: 8 }}>
          &ldquo;{data.verse_text_snippet}&hellip;&rdquo;
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DataLoader() {
  const [events, setEvents] = useState<BibleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEpochId, setActiveEpochId] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);

  const isPlaying = useRef(false);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // THE FIX: Animation Ref decoupled from React renders
  const maxYearRef = useRef<number>(0);

  const { minYear, maxYear } = useMemo(() => {
    const subset = events.filter(e => e.epoch_id === activeEpochId);
    if (!subset.length) return { minYear: 0, maxYear: 0 };
    const Ys = subset.map(e => e.ussher_year);
    return { minYear: Math.min(...Ys), maxYear: Math.max(...Ys) };
  }, [events, activeEpochId]);

  // Keep the Ref in sync with the current active epoch's bounds
  useEffect(() => {
    maxYearRef.current = maxYear;
  }, [maxYear]);

  useEffect(() => {
    if (events.length && currentYear === 0) setCurrentYear(minYear);
  }, [events, minYear, currentYear]);

  useEffect(() => {
    fetchAndUnpackEvents(POINTS_URL).then(data => {
      setEvents(data);
      setLoading(false);
      const found = EPOCHS.find(e => e.hash === window.location.hash);
      if (found) setActiveEpochId(found.id);
    });
  }, []);

  const stopAnim = useCallback(() => {
    isPlaying.current = false;
    lastTsRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const startAnim = useCallback(() => {
    if (isPlaying.current) return;
    isPlaying.current = true;
    const tick = (ts: number) => {
      if (!isPlaying.current) return;
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
      lastTsRef.current = ts;
      setCurrentYear(prev => {
        const next = prev + SPEED * dt;
        if (next >= maxYearRef.current) { 
          stopAnim(); 
          return maxYearRef.current; 
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnim]); // Notice how maxYear is no longer a dependency here!

  const layers = [
    new ScatterplotLayer<BibleEvent>({
      id: "bible-points",
      data: events,
      getPosition: d => [d.lon, d.lat],
      getFillColor: d => TYPE_COLORS[d.event_type] ?? DEFAULT_COLOR,
      radiusMinPixels: 4,
      radiusMaxPixels: 12,
      pickable: true,
      onHover: setHoverInfo,
      extensions: [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue: d => [d.ussher_year, d.epoch_id],
      filterRange: [[minYear - 1, currentYear], [activeEpochId, activeEpochId]],
      filterSoftRange: [[currentYear - 200, currentYear], [activeEpochId, activeEpochId]],
      updateTriggers: { getFilterValue: [currentYear, activeEpochId] }
    } as any)
  ];

  if (loading) return <div style={css.splash}>Loading Biblical Matrix...</div>;

  return (
    <div style={css.root}>
      <DeckGL initialViewState={INITIAL_VIEW} controller layers={layers} style={{width:'100%', height:'100%'}}>
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      <Tooltip info={hoverInfo} />

      <div style={css.panel}>
        <div style={css.tabRow}>
          {EPOCHS.map(e => (
            <button key={e.id} 
              onClick={() => { 
                stopAnim(); 
                setActiveEpochId(e.id); 
                window.history.replaceState(null,"",e.hash);
                const subset = events.filter(ev => ev.epoch_id === e.id);
                if (subset.length) setCurrentYear(Math.min(...subset.map(ev => ev.ussher_year)));
              }}
              style={{...css.tab, ...(e.id === activeEpochId ? css.tabActive : {})}}>{e.name}</button>
          ))}
        </div>
        <div style={css.epochDesc}>{EPOCHS[activeEpochId].description}</div>
        <div style={css.yearLabel}>{currentYear < 0 ? `${Math.abs(Math.round(currentYear))} BC` : `${Math.round(currentYear)} AD`}</div>
        <input type="range" min={minYear} max={maxYear} value={currentYear} onChange={e => { stopAnim(); setCurrentYear(Number(e.target.value)); }} style={css.slider} />
        <div style={{display:'flex', gap:8}}>
          <button onClick={startAnim} style={css.btn}>▶ Play Era</button>
          <button onClick={stopAnim} style={css.btn}>⏸ Pause</button>
        </div>
      </div>
    </div>
  );
}

const css: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100vw", height: "100vh", background: "#002b36", overflow: "hidden" },
  splash: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#839496", background: "#002b36" },
  panel: { position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(0,43,54,0.92)", border: "1px solid #073642", borderRadius: 8, padding: "12px 24px", minWidth: 540, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, backdropFilter: "blur(8px)", zIndex: 10 },
  tabRow: { display: "flex", gap: 4, overflowX: "auto", width: "100%", paddingBottom: 4 },
  tab: { 
    background: "#073642", color: "#839496", 
    borderStyle: "solid", borderWidth: "1px", borderColor: "#586e75", 
    borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap" 
  },
  tabActive: { background: "#268bd2", color: "#fdf6e3", borderColor: "#268bd2" },
  epochDesc: { color: "#586e75", fontSize: 11, textAlign: "center" },
  yearLabel: { color: "#eee8d5", fontSize: "1.5rem", fontWeight: 700 },
  slider: { width: "100%", accentColor: "#268bd2", cursor: "pointer" },
  btn: { background: "#073642", color: "#839496", border: "1px solid #586e75", borderRadius: 4, padding: "4px 14px", cursor: "pointer" },
  tooltip: {
    position: "fixed",
    pointerEvents: "none",
    background: "rgba(0,43,54,0.93)",
    color: "#839496",
    border: "1px solid #073642",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    lineHeight: 1.5,
    zIndex: 1000,
    maxWidth: 300,
  }
};