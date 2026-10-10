export interface BibleMapInspectorState {
  ready: boolean;
  activeEpoch: number | null;
  currentYear: number | null;
  loadedChunks: number[];
  selectedEvent: string | null;
  activeScene: string | null;
  activeJourney: string | null;
  journeyIndex: number | null;
  focusPhase: string;
  mediaId: string | null;
  mediaClass: string | null;
  narrationStatus: "idle" | "ready" | "playing" | "paused" | "unavailable";
  reducedMotion: boolean;
  visibleEventCount: number | null;
  recoverableErrors: string[];
  contextId: string | null;
  contextVisible: boolean;
  contextSourceCount: number;
  contextConfidence: string | null;
  contextHasUncertainty: boolean;
}

const EMPTY: BibleMapInspectorState = {
  ready: false,
  activeEpoch: null,
  currentYear: null,
  loadedChunks: [],
  selectedEvent: null,
  activeScene: null,
  activeJourney: null,
  journeyIndex: null,
  focusPhase: "idle",
  mediaId: null,
  mediaClass: null,
  narrationStatus: "idle",
  reducedMotion: false,
  visibleEventCount: null,
  recoverableErrors: [],
  contextId: null,
  contextVisible: false,
  contextSourceCount: 0,
  contextConfidence: null,
  contextHasUncertainty: false,
};

declare global {
  interface Window {
    __BIBLEMAP__?: BibleMapInspectorState;
  }
}

export function publishBibleMapInspector(partial: Partial<BibleMapInspectorState>): void {
  if (typeof window === "undefined") return;
  const current = window.__BIBLEMAP__ ?? EMPTY;
  window.__BIBLEMAP__ = { ...current, ...partial };
}
