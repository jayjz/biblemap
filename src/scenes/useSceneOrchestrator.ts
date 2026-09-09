"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { publishBibleMapInspector } from "@/lib/biblemap-inspector";
import { usePrefersReducedMotion } from "@/features/media/usePrefersReducedMotion";
import {
  buildSceneTimeline,
  isNarrationReady,
  mediaForBeat,
  phaseAt,
  type CameraTarget,
  type SceneBeat,
  type SceneTimeline,
} from "@/scenes/orchestrateScene";
import type { FocusPhase } from "@/scenes/motion";
import { JOURNEY_SCENES } from "@/scenes/journeyScenes";

export interface SceneOrchestratorApi {
  phase: FocusPhase;
  activeBeat: SceneBeat | null;
  beatIndex: number;
  beatCount: number;
  journeyId: string | null;
  narrationReady: boolean;
  paused: boolean;
  playBeat: (beat: SceneBeat) => void;
  playJourney: (journeyId: string, startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  replay: () => void;
  exit: () => void;
}

interface UseSceneOrchestratorOptions {
  flyTo: (target: CameraTarget) => void;
  onBeatStart?: (beat: SceneBeat, index: number) => void;
  onComplete?: () => void;
}

export function useSceneOrchestrator({
  flyTo,
  onBeatStart,
  onComplete,
}: UseSceneOrchestratorOptions): SceneOrchestratorApi {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<FocusPhase>("idle");
  const [activeBeat, setActiveBeat] = useState<SceneBeat | null>(null);
  const [beatIndex, setBeatIndex] = useState(0);
  const [beatCount, setBeatCount] = useState(0);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [narrationReady, setNarrationReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const beatsRef = useRef<SceneBeat[]>([]);
  const indexRef = useRef(0);
  const timelineRef = useRef<SceneTimeline | null>(null);
  const startedAtRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const narrationSignaledRef = useRef(false);
  const journeyIdRef = useRef<string | null>(null);
  const flyToRef = useRef(flyTo);
  const onBeatStartRef = useRef(onBeatStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    flyToRef.current = flyTo;
    onBeatStartRef.current = onBeatStart;
    onCompleteRef.current = onComplete;
  }, [flyTo, onBeatStart, onComplete]);

  const stopClock = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const applyBeat = useCallback(
    (beat: SceneBeat, index: number, total: number, nextJourneyId: string | null) => {
      const timeline = buildSceneTimeline(beat, reducedMotion);
      timelineRef.current = timeline;
      startedAtRef.current = performance.now();
      elapsedRef.current = 0;
      narrationSignaledRef.current = false;
      journeyIdRef.current = nextJourneyId;
      setActiveBeat(beat);
      setBeatIndex(index);
      setBeatCount(total);
      setJourneyId(nextJourneyId);
      setNarrationReady(reducedMotion);
      setPaused(false);
      setPhase(reducedMotion ? "focused" : "camera");
      flyToRef.current(beat.camera);
      onBeatStartRef.current?.(beat, index);

      const media = mediaForBeat(beat);
      publishBibleMapInspector({
        activeScene: beat.sceneId,
        activeJourney: nextJourneyId,
        journeyIndex: index,
        focusPhase: reducedMotion ? "focused" : "camera",
        mediaId: media?.id ?? null,
        mediaClass: media?.class ?? null,
        narrationStatus: reducedMotion ? "ready" : "idle",
        reducedMotion,
        contextId: beat.contextId ?? null,
      });
    },
    [reducedMotion]
  );

  const startClock = useCallback(() => {
    stopClock();
    const loop = () => {
      const timeline = timelineRef.current;
      const beat = beatsRef.current[indexRef.current];
      if (!timeline || !beat) return;

      const elapsed = performance.now() - startedAtRef.current;
      elapsedRef.current = elapsed;

      const nextPhase = phaseAt(elapsed, timeline);
      setPhase((current) => (current === nextPhase ? current : nextPhase));

      if (!narrationSignaledRef.current && isNarrationReady(elapsed, timeline)) {
        narrationSignaledRef.current = true;
        setNarrationReady(true);
        publishBibleMapInspector({ narrationStatus: "ready", focusPhase: nextPhase });
      }

      if (elapsed >= timeline.completeMs) {
        const next = indexRef.current + 1;
        if (next < beatsRef.current.length) {
          indexRef.current = next;
          applyBeat(beatsRef.current[next], next, beatsRef.current.length, journeyIdRef.current);
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        stopClock();
        onCompleteRef.current?.();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [applyBeat, stopClock]);

  const playBeat = useCallback(
    (beat: SceneBeat) => {
      beatsRef.current = [beat];
      indexRef.current = 0;
      applyBeat(beat, 0, 1, null);
      startClock();
    },
    [applyBeat, startClock]
  );

  const playJourney = useCallback(
    (id: string, startIndex = 0) => {
      const scenes = JOURNEY_SCENES[id];
      if (!scenes || scenes.length === 0) return;
      const start = Math.max(0, Math.min(startIndex, scenes.length - 1));
      beatsRef.current = scenes;
      indexRef.current = start;
      applyBeat(scenes[start], start, scenes.length, id);
      startClock();
    },
    [applyBeat, startClock]
  );

  const pause = useCallback(() => {
    if (paused) return;
    setPaused(true);
    pausedAtRef.current = performance.now();
    stopClock();
    publishBibleMapInspector({ narrationStatus: narrationReady ? "paused" : "idle" });
  }, [paused, narrationReady, stopClock]);

  const resume = useCallback(() => {
    if (!paused || !timelineRef.current) return;
    const pausedFor = performance.now() - pausedAtRef.current;
    startedAtRef.current += pausedFor;
    setPaused(false);
    startClock();
    publishBibleMapInspector({ narrationStatus: narrationReady ? "ready" : "idle" });
  }, [paused, narrationReady, startClock]);

  const skip = useCallback(() => {
    const next = indexRef.current + 1;
    if (next < beatsRef.current.length) {
      indexRef.current = next;
      applyBeat(beatsRef.current[next], next, beatsRef.current.length, journeyIdRef.current);
      startClock();
      return;
    }
    stopClock();
    onCompleteRef.current?.();
  }, [applyBeat, startClock, stopClock]);

  const replay = useCallback(() => {
    const beat = beatsRef.current[indexRef.current];
    if (!beat) return;
    applyBeat(beat, indexRef.current, beatsRef.current.length, journeyIdRef.current);
    startClock();
  }, [applyBeat, startClock]);

  const exit = useCallback(() => {
    stopClock();
    beatsRef.current = [];
    indexRef.current = 0;
    timelineRef.current = null;
    journeyIdRef.current = null;
    setActiveBeat(null);
    setBeatIndex(0);
    setBeatCount(0);
    setJourneyId(null);
    setNarrationReady(false);
    setPaused(false);
    setPhase("idle");
    publishBibleMapInspector({
      activeScene: null,
      activeJourney: null,
      journeyIndex: null,
      focusPhase: "idle",
      mediaId: null,
      mediaClass: null,
      narrationStatus: "idle",
      contextId: null,
      contextVisible: false,
      contextSourceCount: 0,
      contextConfidence: null,
      contextHasUncertainty: false,
    });
  }, [stopClock]);

  useEffect(() => () => stopClock(), [stopClock]);

  useEffect(() => {
    publishBibleMapInspector({ focusPhase: phase, reducedMotion });
  }, [phase, reducedMotion]);

  return {
    phase,
    activeBeat,
    beatIndex,
    beatCount,
    journeyId,
    narrationReady,
    paused,
    playBeat,
    playJourney,
    pause,
    resume,
    skip,
    replay,
    exit,
  };
}
