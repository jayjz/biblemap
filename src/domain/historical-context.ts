/**
 * Human-world context around a biblical scene.
 *
 * Editorial content lives in src/content. This module is the typed contract,
 * labels, validation, and pure lookup — no React, no WebGL.
 */

export const CONTEXT_BEAT_KINDS = [
  "people",
  "power",
  "movement",
  "daily-life",
  "language",
  "religion",
  "evidence",
  "change",
] as const;

export type ContextBeatKind = (typeof CONTEXT_BEAT_KINDS)[number];

export const CLAIM_KINDS = [
  "biblical-text",
  "contemporary-text",
  "archaeological",
  "scholarly-inference",
  "traditional",
  "disputed",
] as const;

export type ClaimKind = (typeof CLAIM_KINDS)[number];

export const SOURCE_TYPES = [
  "biblical-text",
  "ancient-author",
  "museum",
  "archaeological-report",
  "peer-reviewed",
  "academic-reference",
  "inscription",
] as const;

export type HistoricalSourceType = (typeof SOURCE_TYPES)[number];

export const CONTEXT_REVIEW_STATUSES = [
  "draft",
  "reviewed",
  "approved",
] as const;

export type ContextReviewStatus = (typeof CONTEXT_REVIEW_STATUSES)[number];

export interface HistoricalSource {
  id: string;
  title: string;
  author: string;
  institution?: string;
  url: string;
  sourceType: HistoricalSourceType;
  /** Plain-language statement of the claim this source is allowed to support. */
  supports: string;
  published?: string;
}

export interface ContextBeat {
  kind: ContextBeatKind;
  text: string;
  claimKind: ClaimKind;
}

export interface HistoricalContext {
  id: string;
  sceneIds: string[];
  eventIds: string[];
  journeyIds: string[];
  region: string;
  periodLabel: string;
  /** Optional numeric range in the application's display chronology. Not a claim of certainty. */
  displayYear?: number;
  chronologyNote?: string;
  narrative: string;
  beats: ContextBeat[];
  change?: string;
  uncertainty?: string;
  confidence: ClaimKind;
  sourceIds: string[];
  reviewStatus: ContextReviewStatus;
  reviewedBy: string;
  /** Optional ids from the media catalog. Prefer historical-artifact / archaeological-evidence. */
  materialCultureIds?: string[];
}

export interface ContextValidationResult {
  ok: boolean;
  errors: string[];
}

function missing(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

export function validateHistoricalSource(source: HistoricalSource): ContextValidationResult {
  const errors: string[] = [];
  if (missing(source.id)) errors.push("[source]: missing id");
  if (missing(source.title)) errors.push(`${source.id}: missing title`);
  if (missing(source.author)) errors.push(`${source.id}: missing author`);
  if (missing(source.url)) errors.push(`${source.id}: missing url`);
  if (missing(source.supports)) errors.push(`${source.id}: missing supports`);
  if (source.sourceType && !(SOURCE_TYPES as readonly string[]).includes(source.sourceType)) {
    errors.push(`${source.id}: unknown sourceType "${source.sourceType}"`);
  }
  return { ok: errors.length === 0, errors };
}

export function validateHistoricalContext(context: HistoricalContext): ContextValidationResult {
  const errors: string[] = [];
  const id = context.id || "[no-id]";

  for (const field of ["id", "region", "periodLabel", "narrative", "reviewedBy"] as const) {
    if (missing(context[field])) errors.push(`${id}: missing ${field}`);
  }
  if (!Array.isArray(context.sceneIds) || context.sceneIds.length === 0) {
    errors.push(`${id}: sceneIds must be a non-empty array of stable ids`);
  }
  if (!Array.isArray(context.eventIds)) errors.push(`${id}: eventIds must be an array`);
  if (!Array.isArray(context.journeyIds)) errors.push(`${id}: journeyIds must be an array`);
  if (!Array.isArray(context.beats)) errors.push(`${id}: beats must be an array`);
  if (!Array.isArray(context.sourceIds) || context.sourceIds.length === 0) {
    errors.push(`${id}: at least one sourceId is required`);
  }
  if (context.narrative && context.narrative.trim().length > 900) {
    errors.push(`${id}: narrative exceeds 900 characters; keep a single readable paragraph`);
  }
  if (context.beats && context.beats.length > 4) {
    errors.push(`${id}: at most three supporting beats plus an optional change beat (max 4)`);
  }
  if (context.confidence && !(CLAIM_KINDS as readonly string[]).includes(context.confidence)) {
    errors.push(`${id}: unknown confidence "${context.confidence}"`);
  }
  if (context.reviewStatus && !(CONTEXT_REVIEW_STATUSES as readonly string[]).includes(context.reviewStatus)) {
    errors.push(`${id}: unknown reviewStatus "${context.reviewStatus}"`);
  }
  if (
    (context.confidence === "disputed" || context.confidence === "traditional") &&
    missing(context.uncertainty)
  ) {
    errors.push(`${id}: disputed or traditional contexts must carry an uncertainty note`);
  }
  for (const beat of context.beats ?? []) {
    if (!(CONTEXT_BEAT_KINDS as readonly string[]).includes(beat.kind)) {
      errors.push(`${id}: unknown beat kind "${beat.kind}"`);
    }
    if (!(CLAIM_KINDS as readonly string[]).includes(beat.claimKind)) {
      errors.push(`${id}: unknown beat claimKind "${beat.claimKind}"`);
    }
    if (missing(beat.text)) errors.push(`${id}: empty beat text (${beat.kind})`);
  }

  return { ok: errors.length === 0, errors };
}

export function isProductionReadyContext(context: HistoricalContext): boolean {
  return context.reviewStatus === "approved" && validateHistoricalContext(context).ok;
}

export function beatKindLabel(kind: ContextBeatKind): string {
  switch (kind) {
    case "people":
      return "Who lives here";
    case "power":
      return "Who holds power";
    case "movement":
      return "How people move";
    case "daily-life":
      return "How people live";
    case "language":
      return "Language";
    case "religion":
      return "Belief and ritual";
    case "evidence":
      return "What survives";
    case "change":
      return "What changed";
  }
}

export function claimKindLabel(kind: ClaimKind): string {
  switch (kind) {
    case "biblical-text":
      return "Biblical text";
    case "contemporary-text":
      return "Ancient source";
    case "archaeological":
      return "Archaeological evidence";
    case "scholarly-inference":
      return "Scholarly inference";
    case "traditional":
      return "Traditional identification";
    case "disputed":
      return "Disputed";
  }
}

export function sourceTypeLabel(type: HistoricalSourceType): string {
  switch (type) {
    case "biblical-text":
      return "Biblical text";
    case "ancient-author":
      return "Ancient author";
    case "museum":
      return "Museum / collection";
    case "archaeological-report":
      return "Archaeological report";
    case "peer-reviewed":
      return "Peer-reviewed scholarship";
    case "academic-reference":
      return "Academic reference";
    case "inscription":
      return "Inscription";
  }
}
