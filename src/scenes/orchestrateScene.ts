/**
 * Pure scene timeline. Camera, artwork, and narration share one clock so a
 * guided moment feels authored rather than like three unrelated effects.
 * No React. No WebGL. The hook supplies flyTo / reveal / narration callbacks.
 */

import { mediaById } from "@/domain/media-catalog";
import type { CuratedMediaAsset } from "@/domain/media";
import { MOTION, MOTION_REDUCED, type FocusPhase } from "@/scenes/motion";

export interface CameraTarget {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  durationMs: number;
}

export interface SceneNarrationCue {
  audioUrl?: string;
  transcript: string;
  startMs: number;
}

export interface SceneBeat {
  sceneId: string;
  eventId?: string;
  title: string;
  description: string;
  year?: number;
  camera: CameraTarget;
  mediaId?: string;
  narration?: SceneNarrationCue;
  scripture?: { text: string; reference: string };
  durationMs: number;
}

export interface SceneTimeline {
  cameraStartMs: number;
  cameraEndMs: number;
  dimStartMs: number;
  dimEndMs: number;
  revealStartMs: number;
  revealEndMs: number;
  narrationReadyMs: number;
  completeMs: number;
}

export interface SceneEventRef {
  name: string;
  lon: number;
  lat: number;
  verse_text_snippet?: string;
  verse_reference?: string;
  primary_book?: string;
}

export function buildSceneTimeline(beat: SceneBeat, reducedMotion: boolean): SceneTimeline {
  const motion = reducedMotion ? MOTION_REDUCED : MOTION;
  const cameraMs = reducedMotion ? 0 : beat.camera.durationMs;

  if (reducedMotion) {
    return {
      cameraStartMs: 0,
      cameraEndMs: 0,
      dimStartMs: 0,
      dimEndMs: 0,
      revealStartMs: 0,
      revealEndMs: 0,
      narrationReadyMs: 0,
      completeMs: Math.max(beat.durationMs, 1),
    };
  }

  const dimStartMs = Math.round(cameraMs * 0.32);
  const dimEndMs = dimStartMs + motion.dimMs;
  const revealStartMs = Math.max(0, dimEndMs - 160);
  const revealEndMs = revealStartMs + motion.revealMs;
  const narrationReadyMs =
    revealEndMs + motion.narrationReadyDelayMs + (beat.narration?.startMs ?? 0);

  return {
    cameraStartMs: 0,
    cameraEndMs: cameraMs,
    dimStartMs,
    dimEndMs,
    revealStartMs,
    revealEndMs,
    narrationReadyMs,
    completeMs: Math.max(beat.durationMs, narrationReadyMs + 200),
  };
}

export function phaseAt(elapsedMs: number, timeline: SceneTimeline): FocusPhase {
  if (elapsedMs < 0) return "idle";
  if (elapsedMs >= timeline.revealEndMs) return "focused";
  if (elapsedMs >= timeline.revealStartMs) return "revealing";
  if (elapsedMs >= timeline.dimStartMs) return "dimming";
  if (elapsedMs >= timeline.cameraStartMs) return "camera";
  return "idle";
}

export function isNarrationReady(elapsedMs: number, timeline: SceneTimeline): boolean {
  return elapsedMs >= timeline.narrationReadyMs;
}

export function mediaForBeat(beat: SceneBeat): CuratedMediaAsset | null {
  if (!beat.mediaId) return null;
  return mediaById(beat.mediaId) ?? null;
}

export function beatFromEvent(
  event: SceneEventRef,
  options?: {
    eventId?: string;
    media?: CuratedMediaAsset | null;
    scripture?: { text: string; reference: string };
    description?: string;
  }
): SceneBeat {
  const media = options?.media ?? null;
  const scripture =
    options?.scripture ??
    (event.verse_text_snippet
      ? { text: event.verse_text_snippet, reference: event.verse_reference ?? "" }
      : undefined);

  return {
    sceneId: `event:${options?.eventId ?? event.name}`,
    eventId: options?.eventId,
    title: event.name,
    description: options?.description ?? "",
    camera: {
      longitude: event.lon,
      latitude: event.lat,
      zoom: 7.15,
      pitch: 48,
      bearing: 8,
      durationMs: MOTION.cameraMs,
    },
    mediaId: media?.id,
    narration: scripture
      ? {
          transcript: `${event.name}. ${scripture.text}`.slice(0, 400),
          startMs: 0,
        }
      : undefined,
    scripture,
    durationMs: 9000,
  };
}

export function defaultCameraFor(lon: number, lat: number, zoom = 7): CameraTarget {
  return {
    longitude: lon,
    latitude: lat,
    zoom,
    pitch: 45,
    bearing: 0,
    durationMs: MOTION.cameraMs,
  };
}
