/**
 * Shared cinematic motion system.
 * Camera, dim, and artwork reveal must use these tokens so journeys
 * feel authored rather than assembled from unrelated CSS.
 */

export const MOTION = {
  easeCinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeEnter: "cubic-bezier(0.16, 1, 0.3, 1)",
  dimMs: 720,
  cameraMs: 1800,
  cameraMsNear: 1100,
  revealMs: 1100,
  captionDelayMs: 320,
  kenBurnsMs: 16000,
  narrationReadyDelayMs: 400,
} as const;

export const MOTION_REDUCED = {
  ...MOTION,
  dimMs: 0,
  cameraMs: 0,
  cameraMsNear: 0,
  revealMs: 0,
  captionDelayMs: 0,
  kenBurnsMs: 0,
  narrationReadyDelayMs: 0,
} as const;

export type FocusPhase =
  | "idle"
  | "camera"
  | "dimming"
  | "revealing"
  | "focused"
  | "exiting";

export function motionTokens(reducedMotion: boolean) {
  return reducedMotion ? MOTION_REDUCED : MOTION;
}
