"use client";
/**
 * components/DataLoader.tsx
 * Production deck.gl viewer for Bible3D — Narrative Scrubber Edition.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tableFromIPC } from "apache-arrow";
import DeckGL from "@deck.gl/react";
import { type PickingInfo } from "@deck.gl/core";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const POINTS_URL = "/bible-points.parquet?v=" + Date.now();
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const SPEED = 80;

const EPOCHS = [
  { id: 0, name: "Creation & Patriarchs", description: "From Eden to the descent into Egypt", hash: "#genesis" },
  { id: 1, name: "Exodus & Conquest",     description: "Moses, Sinai, and the Promised Land", hash: "#exodus"  },
  { id: 2, name: "Judges & Kings",        description: "From Joshua to the divided kingdom",  hash: "#kings"   },
  { id: 3, name: "Exile & Return",        description: "Babylon to the Second Temple",        hash: "#exile"   },
  { id: 4, name: "Intertestamental",      description: "Silence between the Testaments",      hash: "#inter"   },
  { id: 5, name: "Jesus & Early Church",  description: "Gospels to the end of Acts",          hash: "#gospels" },
];

const CANONICAL_BOOK_ORDER = [
  "GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA",
  "1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO",
  "ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO",
  "OBA","JON","MIC","NAH","HAB","ZEP","HAG","ZEC","MAL",
  "MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH",
  "PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS",
  "1PE","2PE","1JO","2JO","3JO","JUD","REV",
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
  primary_book: string;
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
    lo: table.getChild("lon"), la: table.getChild("lat"), v: table.getChild("verse_text_snippet"),
    pb: table.getChild("primary_book"),
  };

  for (let i = 0; i < table.numRows; i++) {
    events.push({
      name: String(cols.n?.get(i) ?? ""), ussher_year: Number(cols.y?.get(i) ?? 0),
      epoch_id: Number(cols.e?.get(i) ?? 0), event_type: String(cols.t?.get(i) ?? ""),
      description: String(cols.d?.get(i) ?? ""), lon: Number(cols.lo?.get(i) ?? 0),
      lat: Number(cols.la?.get(i) ?? 0), verse_text_snippet: String(cols.v?.get(i) ?? ""),
      primary_book: String(cols.pb?.get(i) ?? ""),
    });
  }
  return events;
}

async function fetchAndUnpackJourneys(url: string): Promise<any[]> {
  const parquet = await import("parquet-wasm/esm");
  await (parquet as any).default?.();
  const resp = await fetch(url);
  if (!resp.ok) return [];
  const buffer = await resp.arrayBuffer();
  const wasmTbl = (parquet as any).readParquet(new Uint8Array(buffer));
  const table = tableFromIPC(wasmTbl.intoIPCStream());

  const journeys = [];
  for (let i = 0; i < table.numRows; i++) {
    // THE FIX: Deep-unpack the Arrow Vectors into standard JS Arrays
    const rawPath = table.getChild("path")?.get(i)?.toJSON() ?? [];
    const formattedPath = rawPath.map((pt: any) => Array.isArray(pt) ? pt : Array.from(pt));
    
    const rawTimes = table.getChild("timestamps")?.get(i)?.toJSON() ?? [];
    const formattedTimes = Array.isArray(rawTimes) ? rawTimes : Array.from(rawTimes);

    journeys.push({
      name: String(table.getChild("name")?.get(i) ?? ""),
      epoch_id: Number(table.getChild("epoch_id")?.get(i) ?? 0),
      primary_book: String(table.getChild("primary_book")?.get(i) ?? ""),
      path: formattedPath,
      timestamps: formattedTimes,
    });
  }
  return journeys;
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
  const [events,        setEvents]        = useState<BibleEvent[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [activeEpochId, setActiveEpochId] = useState(0);
  const [currentYear,   setCurrentYear]   = useState(0);
  const [hoverInfo,     setHoverInfo]     = useState<PickingInfo | null>(null);
  const [selectedBook,  setSelectedBook]  = useState<string>("All");
  const [journeys,      setJourneys]      = useState<any[]>([]);
  const [journeyQuery,  setJourneyQuery]  = useState("");

  const isPlaying  = useRef(false);
  const lastTsRef  = useRef<number | null>(null);
  const rafRef     = useRef<number | null>(null);
  const maxYearRef = useRef<number>(0);

  // Canonical book order: only books present in data
  const uniqueBooks = useMemo(() => {
    const inData = new Set(events.map((ev) => ev.primary_book).filter(Boolean));
    return ["All", ...CANONICAL_BOOK_ORDER.filter((b) => inData.has(b))];
  }, [events]);

  const filteredEvents = useMemo(
    () => selectedBook === "All" ? events : events.filter((ev) => ev.primary_book === selectedBook),
    [events, selectedBook],
  );

  const { minYear, maxYear } = useMemo(() => {
    const subset = filteredEvents.filter((ev) => ev.epoch_id === activeEpochId);
    if (!subset.length) return { minYear: 0, maxYear: 0 };
    const ys = subset.map((ev) => ev.ussher_year);
    return { minYear: Math.min(...ys), maxYear: Math.max(...ys) };
  }, [filteredEvents, activeEpochId]);

  useEffect(() => { maxYearRef.current = maxYear; }, [maxYear]);

  useEffect(() => {
    if (events.length && currentYear === 0) setCurrentYear(minYear);
  }, [events, minYear, currentYear]);

  // Data fetch + mount-time URL sync
  useEffect(() => {
    fetchAndUnpackJourneys("/bible-journeys.parquet?v=" + Date.now()).then(setJourneys);
    fetchAndUnpackEvents(POINTS_URL).then((data) => {
      setEvents(data);
      setLoading(false);

      const hash = window.location.hash;
      const epochFound = EPOCHS.find((ep) => hash.startsWith(ep.hash));
      if (epochFound) setActiveEpochId(epochFound.id);

      const bookParam = hash.split("&").find((p) => p.startsWith("book="));
      if (bookParam) {
        const bookVal = decodeURIComponent(bookParam.slice(5));
        const validBooks = new Set(data.map((ev) => ev.primary_book));
        if (bookVal === "All" || validBooks.has(bookVal)) setSelectedBook(bookVal);
      }
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
      setCurrentYear((prev) => {
        const next = prev + SPEED * dt;
        if (next >= maxYearRef.current) { stopAnim(); return maxYearRef.current; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnim]);

  const handleBookChange = useCallback((book: string) => {
    setSelectedBook(book);
    const baseHash = window.location.hash.split("&")[0];
    window.history.replaceState(null, "", `${baseHash}&book=${book}`);
  }, []);

  const activeJourneys = useMemo(() => {
  // THE FIX: Show all journeys by default, only filter if the user types something
  if (!journeyQuery.trim()) return journeys;
  
  const q = journeyQuery.toLowerCase();
  return journeys.filter((j) => 
    j.name.toLowerCase().includes(q) || j.primary_book.toLowerCase().includes(q)
  );
}, [journeys, journeyQuery]);

  const layers = [
    new PathLayer({
      id: "journey-path",
      data: activeJourneys,
      getPath: (d) => d.path,
      getColor: [253, 128, 93, 80],
      widthMinPixels: 2,
      extensions: [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue: (d) => [d.epoch_id, d.epoch_id],
      filterRange: [[activeEpochId, activeEpochId], [activeEpochId, activeEpochId]],
      updateTriggers: { getFilterValue: [activeEpochId] }
    } as any),
    new TripsLayer({
      id: "journey-animation",
      data: activeJourneys,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: [253, 128, 93, 255],
      opacity: 1,
      widthMinPixels: 4,
      trailLength: 2,
      currentTime: currentYear,
      extensions: [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue: (d) => [d.epoch_id, d.epoch_id],
      filterRange: [[activeEpochId, activeEpochId], [activeEpochId, activeEpochId]],
      updateTriggers: { getFilterValue: [activeEpochId] }
    } as any),
    new ScatterplotLayer<BibleEvent>({
      id: "bible-points",
      data: filteredEvents,
      getPosition:     (d) => [d.lon, d.lat],
      getFillColor:    (d) => TYPE_COLORS[d.event_type] ?? DEFAULT_COLOR,
      getRadius:       (d) => d.event_type === "battle" ? 10 : 5,
      radiusUnits:     "pixels",
      radiusMinPixels: 4,
      radiusMaxPixels: 12,
      pickable:        true,
      onHover:         setHoverInfo,
      extensions:      [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue:  (d) => [d.ussher_year, d.epoch_id],
      filterRange:     [[minYear - 1, currentYear], [activeEpochId, activeEpochId]],
      filterSoftRange: [[currentYear - 200, currentYear], [activeEpochId, activeEpochId]],
      updateTriggers:  { getFilterValue: [currentYear, activeEpochId] },
    } as any),
  ];

  if (loading) return <div style={css.splash}>Loading Biblical Matrix...</div>;

  return (
    <div style={css.root}>
      <DeckGL initialViewState={INITIAL_VIEW} controller layers={layers} style={{ width: "100%", height: "100%" }}>
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      {filteredEvents.length === 0 && (
        <div style={css.emptyState}>
          No events found for <strong>{selectedBook}</strong> in {EPOCHS[activeEpochId]?.name}
        </div>
      )}

      <Tooltip info={hoverInfo} />

      <div style={css.panel}>
        <input
          type="text"
          placeholder="Search journeys (e.g. red sea)"
          value={journeyQuery}
          onChange={e => setJourneyQuery(e.target.value)}
          style={{ ...css.bookSelect, marginBottom: '8px' }}
        />
        <select
          aria-label="Filter by book"
          value={selectedBook}
          onChange={(ev) => handleBookChange(ev.target.value)}
          style={css.bookSelect}
        >
          {uniqueBooks.map((book) => (
            <option key={book} value={book}>{book}</option>
          ))}
        </select>

        <div style={css.tabRow}>
          {EPOCHS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                stopAnim();
                setActiveEpochId(ep.id);
                const bookSuffix = selectedBook !== "All" ? `&book=${selectedBook}` : "";
                window.history.replaceState(null, "", `${ep.hash}${bookSuffix}`);
                const subset = filteredEvents.filter((ev) => ev.epoch_id === ep.id);
                if (subset.length) setCurrentYear(Math.min(...subset.map((ev) => ev.ussher_year)));
              }}
              style={{ ...css.tab, ...(ep.id === activeEpochId ? css.tabActive : {}) }}
            >
              {ep.name}
            </button>
          ))}
        </div>

        <div style={css.epochDesc}>{EPOCHS[activeEpochId]?.description}</div>
        <div style={css.yearLabel}>
          {currentYear < 0 ? `${Math.abs(Math.round(currentYear))} BC` : `${Math.round(currentYear)} AD`}
        </div>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(ev) => { stopAnim(); setCurrentYear(Number(ev.target.value)); }}
          style={css.slider}
          aria-label="Timeline year"
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={startAnim} style={css.btn}>▶ Play Era</button>
          <button onClick={stopAnim}  style={css.btn}>⏸ Pause</button>
        </div>
      </div>
    </div>
  );
}

const css: Record<string, React.CSSProperties> = {
  root:       { position: "relative", width: "100vw", height: "100vh", background: "#002b36", overflow: "hidden" },
  splash:     { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#839496", background: "#002b36" },
  emptyState: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", color: "#839496", fontSize: "1rem", background: "rgba(0,43,54,0.88)", border: "1px solid #073642", borderRadius: 8, padding: "16px 28px", pointerEvents: "none", zIndex: 20, textAlign: "center" },
  panel:      { position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(0,43,54,0.92)", border: "1px solid #073642", borderRadius: 8, padding: "12px 24px", minWidth: 540, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, backdropFilter: "blur(8px)", zIndex: 10 },
  tabRow:     { display: "flex", gap: 4, overflowX: "auto", width: "100%", paddingBottom: 4 },
  tab: {
    background: "#073642", color: "#839496",
    borderStyle: "solid", borderWidth: "1px", borderColor: "#586e75",
    borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap",
  },
  tabActive:  { background: "#268bd2", color: "#fdf6e3", borderColor: "#268bd2" },
  epochDesc:  { color: "#586e75", fontSize: 11, textAlign: "center" },
  yearLabel:  { color: "#eee8d5", fontSize: "1.5rem", fontWeight: 700 },
  slider:     { width: "100%", accentColor: "#268bd2", cursor: "pointer" },
  btn:        { background: "#073642", color: "#839496", border: "1px solid #586e75", borderRadius: 4, padding: "4px 14px", cursor: "pointer" },
  bookSelect: { width: "100%", background: "#073642", color: "#eee8d5", border: "1px solid #586e75", borderRadius: 4, padding: "5px 8px", cursor: "pointer", fontSize: "0.82rem", outline: "none" },
  tooltip: {
    position: "fixed", pointerEvents: "none", background: "rgba(0,43,54,0.93)",
    color: "#839496", border: "1px solid #073642", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, lineHeight: 1.5, zIndex: 1000, maxWidth: 300,
  },
};
