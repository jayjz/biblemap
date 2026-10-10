import type { HistoricalSource } from "./historical-context.ts";
import { isProductionReadyMedia, type CuratedMediaAsset } from "./media.ts";

export type Review = { status: "draft" } | { status: "approved"; reviewedBy: string; reviewedAt: string };
export type AuthoredText =
  | { status: "placeholder"; slot: string }
  | { status: "written"; text: string; authorId: string; review: Review };
export type EvidenceRef = { sourceId: string; locator: string; supports: string; doesNotEstablish: string };
export interface Passage {
  id: string; book: string; chapter: number; firstVerse: number; lastVerse: number;
  translationId: string; sourceId: string; sourceVersion: string; retrievedAt: string;
  checksum: string; rightsStatement: string; rightsUrl: string;
  verses: readonly { number: number; text: string }[];
  notes: readonly { verse: number; text: string }[];
}
export const CLAIM_BASES = ["biblical-text", "historical-evidence", "tradition", "scholarly-inference", "theological-interpretation", "artistic-reconstruction"] as const;
export interface Claim {
  id: string; statement: AuthoredText; basis: typeof CLAIM_BASES[number];
  certainty: "attested" | "qualified" | "disputed" | "unknown";
  interpretiveLens?: string; evidence: readonly EvidenceRef[]; uncertainty?: string;
}
export interface Geography {
  placeId: string; label: string;
  status: "identified" | "approximate" | "disputed" | "unknown";
  explanation: AuthoredText;
  candidates: readonly {
    id: string; label: string;
    position?: { longitude: number; latitude: number; radiusKm?: number };
    evidence: readonly EvidenceRef[];
  }[];
}
export interface StoryScene {
  id: string; sectionId: string; chapter: number; title: AuthoredText;
  passageIds: readonly string[]; narrative: AuthoredText;
  reflections: readonly { id: string; prompt: AuthoredText }[];
  claimIds: readonly string[]; geographyIds: readonly string[]; artworkIds: readonly string[];
  narration?: { mediaId: string; transcript: AuthoredText };
  soundscapeId?: string;
  transition: { nextSceneId: string | null; advance: "reader"; visual: "cut" | "fade" };
  review: Review;
}
export interface StoryDocument {
  schemaVersion: 1; id: string; book: string; mode: "author-review" | "release";
  title: string; subtitle: string;
  sections: readonly { id: string; label: string; reference: string; available: boolean }[];
  scenes: readonly StoryScene[]; passages: readonly Passage[];
  sources: readonly HistoricalSource[]; claims: readonly Claim[];
  geography: readonly Geography[]; media: readonly CuratedMediaAsset[];
}

export function authoredLabel(copy: AuthoredText): string {
  return copy.status === "placeholder" ? `[AUTHOR: ${copy.slot}]` : copy.text;
}

/** URL values never become indexes, selectors, or executable content. */
export function sceneFromHash(story: StoryDocument, hash: string): StoryScene {
  let id = "";
  try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { /* Invalid URL: use first scene. */ }
  return story.scenes.find(scene => scene.id === id) ?? story.scenes[0];
}

export function validateStory(story: StoryDocument, mode = story.mode): string[] {
  const errors: string[] = [];
  const fail = (id: string, message: string) => errors.push(`${id}: ${message}`);
  const text = (s: string) => typeof s === "string" && s.trim().length > 0;
  const https = (s: string) => { try { return new URL(s).protocol === "https:"; } catch { return false; } };
  const unique = (ids: readonly string[], kind: string) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(id) || seen.has(id)) fail(kind, `invalid or duplicate ID ${id}`);
      seen.add(id);
    }
    return seen;
  };
  const checkReview = (id: string, review: Review) => {
    if (review.status === "approved") {
      if (!text(review.reviewedBy) || !Number.isFinite(Date.parse(review.reviewedAt))) fail(id, "approval requires reviewer and date");
    } else if (review.status !== "draft" || mode === "release") fail(id, "human approval required");
  };
  const checkCopy = (id: string, copy: AuthoredText) => {
    if (copy.status === "placeholder") {
      if (!text(copy.slot) || mode === "release") fail(id, "unfinished author slot");
    } else {
      if (!text(copy.text) || !text(copy.authorId)) fail(id, "text and author required");
      checkReview(id, copy.review);
    }
  };
  if (story.schemaVersion !== 1 || !story.scenes.length || !text(story.book)) fail(story.id, "invalid story header");
  const sectionIds = unique(story.sections.map(s => s.id), "sections");
  const sceneIds = unique(story.scenes.map(s => s.id), "scenes");
  const passageIds = unique(story.passages.map(p => p.id), "passages");
  const sourceIds = unique(story.sources.map(s => s.id), "sources");
  const claimIds = unique(story.claims.map(c => c.id), "claims");
  const placeIds = unique(story.geography.map(g => g.placeId), "geography");
  const mediaIds = unique(story.media.map(m => m.id), "media");
  unique(story.scenes.flatMap(s => s.reflections.map(r => r.id)), "reflections");
  const refs = (id: string, values: readonly string[], registry: Set<string>) => {
    for (const value of values) if (!registry.has(value)) fail(id, `unresolved reference ${value}`);
  };
  const evidence = (id: string, values: readonly EvidenceRef[]) => {
    if (!values.length) fail(id, "evidence required");
    for (const ref of values) {
      refs(id, [ref.sourceId], sourceIds);
      if (![ref.locator, ref.supports, ref.doesNotEstablish].every(text)) fail(id, "citation locator and scope required");
    }
  };
  for (const source of story.sources) {
    if (![source.title, source.author, source.supports].every(text) || !https(source.url)) fail(source.id, "incomplete source");
  }
  for (const p of story.passages) {
    refs(p.id, [p.sourceId], sourceIds);
    if (p.book !== story.book || ![p.chapter, p.firstVerse, p.lastVerse].every(n => Number.isInteger(n) && n > 0) || p.lastVerse < p.firstVerse) fail(p.id, "invalid passage range");
    if (p.verses.length !== p.lastVerse - p.firstVerse + 1 || p.verses.some((v, i) => v.number !== p.firstVerse + i || !text(v.text))) fail(p.id, "missing, duplicate, or reordered verse");
    if (![p.translationId, p.sourceVersion, p.rightsStatement].every(text) || !https(p.rightsUrl) || !/^sha256:[a-f0-9]{64}$/.test(p.checksum) || !Number.isFinite(Date.parse(p.retrievedAt))) fail(p.id, "scripture provenance required");
    if (p.notes.some(n => n.verse < p.firstVerse || n.verse > p.lastVerse || !text(n.text))) fail(p.id, "invalid translation note");
  }
  for (const claim of story.claims) {
    checkCopy(claim.id, claim.statement);
    evidence(claim.id, claim.evidence);
    if (!CLAIM_BASES.includes(claim.basis)) fail(claim.id, "invalid claim basis");
    if (!["attested", "qualified", "disputed", "unknown"].includes(claim.certainty)) fail(claim.id, "invalid certainty");
    if (["disputed", "unknown"].includes(claim.certainty) && !claim.uncertainty?.trim()) fail(claim.id, "uncertainty required");
    if (claim.basis === "theological-interpretation" && !claim.interpretiveLens?.trim()) fail(claim.id, "interpretive lens required");
  }
  for (const place of story.geography) {
    checkCopy(place.placeId, place.explanation);
    if (!text(place.label) || !["identified", "approximate", "disputed", "unknown"].includes(place.status)) fail(place.placeId, "invalid geography");
    if (place.status !== "unknown" && !place.candidates.length) fail(place.placeId, "identification requires evidence");
    unique(place.candidates.map(c => c.id), place.placeId);
    for (const candidate of place.candidates) {
      evidence(candidate.id, candidate.evidence);
      const p = candidate.position;
      if (p && (!Number.isFinite(p.longitude) || Math.abs(p.longitude) > 180 || !Number.isFinite(p.latitude) || Math.abs(p.latitude) > 90 || (p.radiusKm !== undefined && (!Number.isFinite(p.radiusKm) || p.radiusKm <= 0)))) fail(candidate.id, "invalid coordinates or radius");
    }
  }
  for (const asset of story.media) {
    if (!isProductionReadyMedia(asset) || !/^sha256:[a-f0-9]{64}$/.test(asset.checksum) || !/^\/media\/[\w/.-]+$/.test(asset.localPath) || asset.localPath.includes("..")) fail(asset.id, "approved local media with verified provenance required");
  }
  story.scenes.forEach((scene, index) => {
    checkReview(scene.id, scene.review);
    checkCopy(scene.id, scene.title); checkCopy(scene.id, scene.narrative);
    scene.reflections.forEach(r => checkCopy(r.id, r.prompt));
    refs(scene.id, [scene.sectionId], sectionIds);
    refs(scene.id, scene.passageIds, passageIds); refs(scene.id, scene.claimIds, claimIds);
    refs(scene.id, scene.geographyIds, placeIds); refs(scene.id, scene.artworkIds, mediaIds);
    if (!scene.passageIds.length || scene.passageIds.some(id => story.passages.find(p => p.id === id)?.chapter !== scene.chapter)) fail(scene.id, "scene passage/chapter mismatch");
    if (scene.transition.advance !== "reader" || !["cut", "fade"].includes(scene.transition.visual) || scene.transition.nextSceneId !== (story.scenes[index + 1]?.id ?? null)) fail(scene.id, "invalid reader transition");
    if (scene.transition.nextSceneId) refs(scene.id, [scene.transition.nextSceneId], sceneIds);
    if (scene.artworkIds.some(id => ["narration", "soundscape", "music"].includes(story.media.find(m => m.id === id)?.class ?? ""))) fail(scene.id, "audio cannot be artwork");
    if (scene.narration) {
      refs(scene.id, [scene.narration.mediaId], mediaIds);
      checkCopy(scene.id, scene.narration.transcript);
      if (story.media.find(m => m.id === scene.narration?.mediaId)?.class !== "narration" || scene.narration.transcript.status !== "written" || scene.narration.transcript.review.status !== "approved") fail(scene.id, "narration requires approved transcript and narration asset");
    }
    if (scene.soundscapeId && story.media.find(m => m.id === scene.soundscapeId)?.class !== "soundscape") fail(scene.id, "soundscape asset required");
  });
  return errors;
}
