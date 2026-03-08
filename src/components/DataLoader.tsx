"use client";
/**
 * components/DataLoader.tsx
 * Production deck.gl viewer for Bible3D — Narrative Scrubber Edition.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, X, Search, BookOpen, Map as MapIcon, Menu } from "lucide-react";
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
  primary_book: string; verse_reference: string;
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
    pb: table.getChild("primary_book"), vr: table.getChild("verse_reference"),
  };

  for (let i = 0; i < table.numRows; i++) {
    events.push({
      name: String(cols.n?.get(i) ?? ""), ussher_year: Number(cols.y?.get(i) ?? 0),
      epoch_id: Number(cols.e?.get(i) ?? 0), event_type: String(cols.t?.get(i) ?? ""),
      description: String(cols.d?.get(i) ?? ""), lon: Number(cols.lo?.get(i) ?? 0),
      lat: Number(cols.la?.get(i) ?? 0), verse_text_snippet: String(cols.v?.get(i) ?? ""),
      primary_book: String(cols.pb?.get(i) ?? ""), verse_reference: String(cols.vr?.get(i) ?? ""),
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
    <div style={{ position: "fixed", pointerEvents: "none", background: "rgba(0,43,54,0.93)", color: "#839496", border: "1px solid #073642", borderRadius: 8, padding: "10px 14px", fontSize: 13, lineHeight: 1.5, zIndex: 1000, maxWidth: 300 }}>
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
  const [selectedEvent, setSelectedEvent] = useState<BibleEvent | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      widthMinPixels: 4,
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
      widthMinPixels: 8,
      trailLength: 5,
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
      onClick: (info: any) => {
        if (info.object) setSelectedEvent(info.object as BibleEvent);
      },
      extensions:      [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue:  (d) => [d.ussher_year, d.epoch_id],
      filterRange:     [[minYear - 1, currentYear], [activeEpochId, activeEpochId]],
      filterSoftRange: [[currentYear - 200, currentYear], [activeEpochId, activeEpochId]],
      updateTriggers:  { getFilterValue: [currentYear, activeEpochId] },
    } as any),
  ];

  if (loading) return <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 font-mono">Loading Biblical Matrix...</div>;

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">
      <DeckGL
        initialViewState={INITIAL_VIEW}
        controller
        layers={layers}
        style={{ width: "100%", height: "100%" }}
        onClick={(info) => { if (!info.object) setSelectedEvent(null); }}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      <Tooltip info={hoverInfo} />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[100] bg-slate-900/90 border border-slate-700 p-3 rounded-full shadow-lg text-amber-500"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* TOP LEFT SIDEBAR - Command Center */}
      <div className={`fixed md:absolute top-4 left-4 z-50 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl flex flex-col gap-4 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] md:translate-x-0'}`}>
        <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
          <MapIcon className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-bold text-slate-100 tracking-wide">Bible3D Matrix</h1>
        </div>

        <div className="relative flex items-center">
          <Search className={`absolute left-3 w-4 h-4 transition-colors ${journeyQuery.trim() ? 'text-amber-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search journeys (e.g. paul, red sea)"
            value={journeyQuery}
            onChange={(e) => setJourneyQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && activeJourneys.length > 0) {
                const firstMatch = activeJourneys[0];
                stopAnim();

                // 1. Change epoch if necessary to ensure the layer renders
                if (firstMatch.epoch_id !== activeEpochId) {
                  setActiveEpochId(firstMatch.epoch_id);
                  const targetEpoch = EPOCHS.find(ep => ep.id === firstMatch.epoch_id);
                  if (targetEpoch) {
                    const bookSuffix = selectedBook !== "All" ? `&book=${selectedBook}` : "";
                    window.history.replaceState(null, "", `${targetEpoch.hash}${bookSuffix}`);
                  }
                }

                // 2. Jump the WebGL timeline directly to the START of the glowing journey
                if (firstMatch.timestamps && firstMatch.timestamps.length > 0) {
                  setCurrentYear(firstMatch.timestamps[0]);
                } else {
                  // Fallback to epoch start if no timestamps exist
                  const subset = filteredEvents.filter((ev) => ev.epoch_id === firstMatch.epoch_id);
                  if (subset.length) setCurrentYear(Math.min(...subset.map((ev) => ev.ussher_year)));
                }
              }
            }}
            className={`w-full bg-slate-800 border rounded-lg pl-9 pr-10 py-2 text-sm text-slate-200 focus:outline-none transition-colors ${journeyQuery.trim() ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'border-slate-600 focus:border-amber-500'}`}
          />
          {journeyQuery && (
            <button
              onClick={() => setJourneyQuery("")}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            aria-label="Filter by book"
            value={selectedBook}
            onChange={(ev) => handleBookChange(ev.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 appearance-none transition-colors"
          >
            {uniqueBooks.map((book) => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Historical Epochs</h2>
          {EPOCHS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                stopAnim();
                setActiveEpochId(ep.id);
                setIsSidebarOpen(false);
                const bookSuffix = selectedBook !== "All" ? `&book=${selectedBook}` : "";
                window.history.replaceState(null, "", `${ep.hash}${bookSuffix}`);
                const subset = filteredEvents.filter((ev) => ev.epoch_id === ep.id);
                if (subset.length) setCurrentYear(Math.min(...subset.map((ev) => ev.ussher_year)));
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${ep.id === activeEpochId ? 'bg-amber-600/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700'}`}
            >
              {ep.name}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR - Narrative Scrubber */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-10 flex flex-col items-center gap-3">
        <div className="flex justify-between items-end w-full px-2">
          <div className="text-slate-400 text-xs">{EPOCHS[activeEpochId]?.description}</div>
          <div className="text-2xl font-bold text-amber-500 tabular-nums">
            {currentYear < 0 ? `${Math.abs(Math.round(currentYear))} BC` : `${Math.round(currentYear)} AD`}
          </div>
        </div>

        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(ev) => { stopAnim(); setCurrentYear(Number(ev.target.value)); }}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
          aria-label="Timeline year"
        />

        <div className="flex gap-4 w-full justify-center">
          <button onClick={startAnim} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-200">
            <Play className="w-4 h-4 text-amber-500" /> Play Era
          </button>
          <button onClick={stopAnim} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-200">
            <Pause className="w-4 h-4 text-amber-500" /> Pause
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Reading Panel */}
      {selectedEvent && (
        <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl z-20 flex flex-col">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-amber-500 leading-tight pr-4">{selectedEvent.name}</h2>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                {selectedEvent.ussher_year < 0 ? `${Math.abs(Math.round(selectedEvent.ussher_year))} BC` : `${Math.round(selectedEvent.ussher_year)} AD`} • {selectedEvent.event_type}
              </div>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
            <p>{selectedEvent.description}</p>
            {selectedEvent.verse_text_snippet && selectedEvent.verse_reference && (
              <div
                className="bg-slate-950 p-4 rounded-lg border border-slate-800 relative cursor-pointer hover:border-amber-500/50 transition-colors group"
                onClick={() => setShowVerseModal(true)}
              >
                <BookOpen className="absolute top-4 left-4 w-4 h-4 text-amber-600/50" />
                <p className="italic text-slate-400 pl-6 group-hover:text-amber-300 transition-colors">
                  &ldquo;{selectedEvent.verse_text_snippet}&rdquo;
                </p>
                <div className="mt-3 text-right text-xs font-semibold text-amber-500 flex items-center justify-end gap-1">
                  {selectedEvent.verse_reference}
                  <span className="text-[10px] opacity-50">→ full chapter</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredEvents.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700 rounded-xl px-6 py-4 text-slate-400 text-center shadow-2xl pointer-events-none">
          No events found for <strong className="text-amber-500">{selectedBook}</strong> in {EPOCHS[activeEpochId]?.name}
        </div>
      )}

      {showVerseModal && selectedEvent?.verse_reference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowVerseModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-500">{selectedEvent.verse_reference}</h3>
              <button onClick={() => setShowVerseModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto">
              <p className="italic mb-8 text-lg">&ldquo;{selectedEvent.verse_text_snippet}&rdquo;</p>
              <a
                href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(selectedEvent.verse_reference)}&version=KJV`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg transition-colors"
              >
                Read Full Chapter on BibleGateway →
              </a>
              <div className="text-xs text-slate-500 mt-4 text-center">
                Context: {EPOCHS[activeEpochId]?.name} • {selectedEvent.event_type}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
