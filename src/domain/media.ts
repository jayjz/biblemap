/**
 * Provenance-strict media schema for BibleMap.
 *
 * An asset may not appear in production unless every required field is present,
 * the media class is known, rights are recorded, and reviewStatus is "approved".
 * Artistic depictions and interpretive reconstructions must never be described
 * as archaeological evidence.
 */

export const MEDIA_CLASSES = [
  "artistic-depiction",
  "historical-artifact",
  "archaeological-evidence",
  "historical-landscape",
  "manuscript",
  "map",
  "interpretive-reconstruction",
  "texture",
  "narration",
  "soundscape",
  "music",
] as const;

export type MediaClass = (typeof MEDIA_CLASSES)[number];

export const REVIEW_STATUSES = [
  "candidate",
  "rights-verified",
  "historically-reviewed",
  "theologically-reviewed",
  "approved",
  "rejected",
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** Licenses we will ship. Unknown or unverified rights must omit the asset. */
export const KNOWN_LICENSES = [
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-SA-3.0",
  "CC-BY-3.0",
  "Public Domain",
  "PD-Art",
  "PD-US",
] as const;

export type KnownLicense = (typeof KNOWN_LICENSES)[number];

export const EVIDENCE_CLASSES: ReadonlySet<MediaClass> = new Set([
  "historical-artifact",
  "archaeological-evidence",
  "historical-landscape",
  "manuscript",
]);

export const INTERPRETIVE_CLASSES: ReadonlySet<MediaClass> = new Set([
  "artistic-depiction",
  "interpretive-reconstruction",
]);

export interface GeneratedMediaFields {
  generator: string;
  model: string;
  generatedAt: string;
  prompt: string;
  referenceAssetIds: string[];
  historicalSources: string[];
  knownInaccuracies: string[];
}

/**
 * Every production asset must carry this manifest. Field names match
 * public/media/AGENTS.md. Empty strings are treated as missing.
 */
export interface CuratedMediaAsset {
  id: string;
  eventIds: string[];
  journeyIds: string[];
  class: MediaClass;
  title: string;
  creator: string;
  creationDate: string;
  depictedPeriod: string;
  sourceInstitution: string;
  sourceRecordUrl: string;
  originalAssetUrl: string;
  license: KnownLicense | string;
  rightsStatement: string;
  requiredAttribution: string;
  downloadedAt: string;
  checksum: string;
  localPath: string;
  altText: string;
  caption: string;
  historicalFit: string;
  editorialReason: string;
  reviewStatus: ReviewStatus;
  reviewedBy: string;
  generator?: string;
  model?: string;
  generatedAt?: string;
  prompt?: string;
  referenceAssetIds?: string[];
  historicalSources?: string[];
  knownInaccuracies?: string[];
}

const REQUIRED_STRING_FIELDS = [
  "id",
  "class",
  "title",
  "creator",
  "creationDate",
  "depictedPeriod",
  "sourceInstitution",
  "sourceRecordUrl",
  "originalAssetUrl",
  "license",
  "rightsStatement",
  "requiredAttribution",
  "downloadedAt",
  "checksum",
  "localPath",
  "altText",
  "caption",
  "historicalFit",
  "editorialReason",
  "reviewStatus",
  "reviewedBy",
] as const satisfies ReadonlyArray<keyof CuratedMediaAsset>;

export interface MediaValidationResult {
  ok: boolean;
  errors: string[];
}

function isMediaClass(value: string): value is MediaClass {
  return (MEDIA_CLASSES as readonly string[]).includes(value);
}

function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}

function isKnownLicense(value: string): value is KnownLicense {
  return (KNOWN_LICENSES as readonly string[]).includes(value);
}

function missing(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

export function validateMediaAsset(asset: CuratedMediaAsset): MediaValidationResult {
  const errors: string[] = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    if (missing(asset[field] as string)) {
      errors.push(`${asset.id || "[no-id]"}: missing required field "${field}"`);
    }
  }

  if (!Array.isArray(asset.eventIds)) {
    errors.push(`${asset.id}: eventIds must be an array`);
  }
  if (!Array.isArray(asset.journeyIds)) {
    errors.push(`${asset.id}: journeyIds must be an array`);
  }

  if (asset.class && !isMediaClass(asset.class)) {
    errors.push(`${asset.id}: unknown media class "${asset.class}"`);
  }

  if (asset.reviewStatus && !isReviewStatus(asset.reviewStatus)) {
    errors.push(`${asset.id}: unknown reviewStatus "${asset.reviewStatus}"`);
  }

  if (asset.license && !isKnownLicense(asset.license)) {
    errors.push(
      `${asset.id}: license "${asset.license}" is not in the reusable-rights set; omit the asset until rights are verified`
    );
  }

  if (asset.class === "interpretive-reconstruction") {
    if (!asset.knownInaccuracies || asset.knownInaccuracies.length === 0) {
      errors.push(`${asset.id}: interpretive reconstructions must document knownInaccuracies`);
    }
    if (!asset.historicalSources || asset.historicalSources.length === 0) {
      errors.push(`${asset.id}: interpretive reconstructions must cite historicalSources`);
    }
  }

  if (asset.class === "narration" && missing(asset.caption)) {
    errors.push(`${asset.id}: narration requires a transcript in caption`);
  }

  return { ok: errors.length === 0, errors };
}

/** Production gate: only approved, fully attributed assets may render. */
export function isProductionReadyMedia(asset: CuratedMediaAsset): boolean {
  if (asset.reviewStatus !== "approved") return false;
  return validateMediaAsset(asset).ok;
}

export function isInterpretiveClass(mediaClass: MediaClass): boolean {
  return INTERPRETIVE_CLASSES.has(mediaClass);
}

export function isEvidenceClass(mediaClass: MediaClass): boolean {
  return EVIDENCE_CLASSES.has(mediaClass);
}

export function mediaClassLabel(mediaClass: MediaClass): string {
  switch (mediaClass) {
    case "artistic-depiction":
      return "Artistic depiction";
    case "historical-artifact":
      return "Historical artifact";
    case "archaeological-evidence":
      return "Archaeological evidence";
    case "historical-landscape":
      return "Historical landscape";
    case "manuscript":
      return "Manuscript";
    case "map":
      return "Map";
    case "interpretive-reconstruction":
      return "Interpretive reconstruction";
    case "texture":
      return "Texture";
    case "narration":
      return "Narration";
    case "soundscape":
      return "Soundscape";
    case "music":
      return "Music";
  }
}

/**
 * A later painting can illuminate reception history. It cannot establish
 * what an ancient event looked like.
 */
export function laterCreationDisclaimer(asset: CuratedMediaAsset): string | null {
  if (!isInterpretiveClass(asset.class)) return null;
  return `Created ${asset.creationDate}; depicts ${asset.depictedPeriod}. This is ${mediaClassLabel(asset.class).toLowerCase()}, not archaeological evidence of the event.`;
}

export function resolveMediaSrc(asset: CuratedMediaAsset): string {
  return asset.localPath;
}

export function approvedMediaForEvent(
  catalog: readonly CuratedMediaAsset[],
  eventId: string
): CuratedMediaAsset[] {
  return catalog.filter(
    (asset) => isProductionReadyMedia(asset) && asset.eventIds.includes(eventId)
  );
}

export function approvedMediaForJourney(
  catalog: readonly CuratedMediaAsset[],
  journeyId: string
): CuratedMediaAsset[] {
  return catalog.filter(
    (asset) => isProductionReadyMedia(asset) && asset.journeyIds.includes(journeyId)
  );
}

export function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
