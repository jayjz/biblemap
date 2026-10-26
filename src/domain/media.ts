/**
 * Provenance-strict media schema for BibleMap.
 *
 * An editorially approved asset still requires every field below.
 * Rendering does not. A valid image may render while publication stays a separate check.
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
  /** Open images may be deployed. Unresolved and restricted images must not. */
  rightsUse?: "open" | "unresolved" | "restricted";
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

/**
 * Rights-cleared visual media may appear without a separate creative-approval stamp.
 * Nonvisual media (narration, soundscape, music) retain the existing editorial gate.
 * Historical/theological claims and generated-image disclosures remain independently reviewable.
 */
export function isProductionReadyMedia(asset: CuratedMediaAsset): boolean {
  const visual = !["narration", "soundscape", "music"].includes(asset.class);
  if (!visual && asset.reviewStatus !== "approved") return false;
  return validateMediaAsset(asset).ok && mayPublishMedia(asset);
}

export const PUBLICATION_FLAGS = [
  "explicit-restriction",
  "unresolved-rights",
  "license-unverified",
  "missing-source",
  "missing-attribution",
] as const;

export type PublicationFlag = (typeof PUBLICATION_FLAGS)[number];

const RESTRICTED_LICENSE = /all rights reserved|in copyright|non-?commercial|(?:^|[^a-z])nc(?:[^a-z]|$)|no-?deriv/i;
const RIGHTS_REVIEWED = new Set(["rights-verified", "historically-reviewed", "theologically-reviewed", "approved"]);
/** A reusable license string alone does not establish permission to publish. */
const PUBLICATION_BLOCKERS = new Set<PublicationFlag>(PUBLICATION_FLAGS);

/**
 * A license string is recorded metadata, not verified permission.
 * Missing attribution is flagged whenever the attribution line is empty, even if a maker is named.
 * Restricted assets must not render. Unresolved rights may render in review only.
 */
export function publicationFlags(asset: CuratedMediaAsset): PublicationFlag[] {
  const flags: PublicationFlag[] = [];
  const license = asset.license?.trim() ?? "";
  const restrictedByText = Boolean(license) && !isKnownLicense(license) && RESTRICTED_LICENSE.test(license);
  if (asset.rightsUse === "restricted" || restrictedByText) flags.push("explicit-restriction");
  else if (asset.rightsUse === "unresolved" || !license || !isKnownLicense(license)) flags.push("unresolved-rights");
  else if (!RIGHTS_REVIEWED.has(asset.reviewStatus) || !asset.reviewedBy?.trim() || !asset.rightsStatement?.trim()) flags.push("license-unverified");
  if (!(asset.sourceRecordUrl?.trim() || asset.originalAssetUrl?.trim())) flags.push("missing-source");
  if (!asset.requiredAttribution?.trim()) flags.push("missing-attribution");
  return flags;
}

/** A readable image. Editorial approval is not required. Restricted rights still block rendering. */
export function canRenderMedia(asset: CuratedMediaAsset): boolean {
  if (asset.reviewStatus === "rejected") return false;
  if (!asset.localPath?.trim()) return false;
  if (!asset.altText?.trim() && !asset.title?.trim()) return false;
  if (publicationFlags(asset).includes("explicit-restriction")) return false;
  return true;
}

/** Reuse-rights verification is mandatory for publication; creative sign-off is not a visual-media prerequisite. */
export function mayPublishMedia(asset: CuratedMediaAsset): boolean {
  if (!canRenderMedia(asset)) return false;
  if (publicationFlags(asset).some(flag => PUBLICATION_BLOCKERS.has(flag))) return false;
  return isKnownLicense(asset.license) && /^\/media\/[\w/.-]+$/.test(asset.localPath) && !asset.localPath.includes("..");
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
