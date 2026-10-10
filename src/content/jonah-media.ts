import catalog from "../../docs/research/jonah-asset-candidates.json" with { type: "json" };
import { isProductionReadyMedia, REVIEW_STATUSES, type CuratedMediaAsset } from "../domain/media.ts";

const descriptions: Record<string, { alt: string; caption: string; reason: string; fit: string }> = {
  "nga-raphael-hosea-jonah": {
    alt: "Brown ink drawing of two robed prophets with a winged figure between them; transfer grid and collector stamps remain visible.",
    caption: "Raphael’s The Prophets Hosea and Jonah, c. 1510. A later artistic depiction of the prophets together, not a scene of Jonah receiving the command or a historical likeness.",
    fit: "The drawing joins Hosea and Jonah in a Renaissance composition; it does not depict the command in Jonah 1:1–2.",
    reason: "Creator-approved for the opening as reception history. Preserve both prophets, the winged figure, grid, and collector stamps; no crop approved.",
  },
  "met-rosselli-prophet-jonah": {
    alt: "Engraving of a seated, bearded prophet holding a book beside a curling sea creature, with IONA PROFETA above and inscriptions below.",
    caption: "Francesco Rosselli after Baccio Baldini, 1480–90. A symbolic portrait with a sea-creature attribute, created long after the biblical narrative; not a historical likeness.",
    fit: "The sea creature is a symbolic attribute in a later portrait, not evidence of the creature’s appearance in the biblical account.",
    reason: "Creator-approved at 1:17 and 2:1–9, after the fish enters the text. Preserve the entire sheet and its inscriptions.",
  },
  "met-gassel-ship-jonah": {
    alt: "Etching and engraving of a large sailing ship near a coastal town, with a figure emerging from a sea creature in the foreground.",
    caption: "Lucas Gassel, ca. 1560–70. The ship, coastline, and sea creature form a later artistic interpretation of Jonah’s release, not a reconstruction of the ancient setting.",
    fit: "The European ship and coastal setting belong to the artist’s later interpretation, not an established ancient location.",
    reason: "Full composition only after Jonah 2:10, when the reader has reached the release. No crop or motion over the image.",
  },
};

/** Creator-approved public-preview placements; see catalog.creatorApproval for scope. */
export const JONAH_ARTWORK_PLACEMENTS = [
  { assetId: "nga-raphael-hosea-jonah", sceneIds: ["jonah-1-calling"] },
  { assetId: "met-rosselli-prophet-jonah", sceneIds: ["jonah-1-depths", "jonah-2-prayer"] },
  { assetId: "met-gassel-ship-jonah", sceneIds: ["jonah-2-shore"] },
];

/** Source editorial drafts remain separate from the creator-approved media placements. */
export const JONAH_MEDIA_REVIEW: readonly CuratedMediaAsset[] = catalog.assets
  .filter(candidate => descriptions[candidate.id])
  .map(candidate => {
    const description = descriptions[candidate.id];
    const reviewStatus = REVIEW_STATUSES.find(status => status === candidate.productionReviewStatus);
    if (!reviewStatus) throw new Error(`Unknown Jonah media review status: ${candidate.id}`);
    const acquired = catalog.publicationFiles.find(file => file.assetId === candidate.id);
    if (!acquired) throw new Error(`Missing Jonah acquisition record: ${candidate.id}`);
    return {
      id: candidate.id, eventIds: [], journeyIds: ["jonah"], class: "artistic-depiction",
      title: candidate.title, creator: candidate.creator, creationDate: candidate.creationDate,
      depictedPeriod: "The narrative of the book of Jonah; historical dating is not established by this artwork",
      sourceInstitution: candidate.sourceInstitution, sourceRecordUrl: candidate.sourceRecordUrl,
      originalAssetUrl: candidate.originalAssetUrl ?? "", license: candidate.license,
      rightsStatement: `Institutional object page identifies this image as public domain. Rights evidence: ${candidate.rightsEvidence}. Fresh institutional retrieval and derivative checksum are recorded in publicationFiles; supplied-original download history remains unknown.`,
      requiredAttribution: `${candidate.creator}, ${candidate.title}, ${candidate.creationDate}. ${candidate.sourceInstitution}, ${candidate.accessionNumber}. ${candidate.license}.`,
      downloadedAt: candidate.downloadedAt ?? "", checksum: `sha256:${acquired.checksumSha256}`,
      localPath: `/media/jonah/${acquired.filename}`, altText: description.alt,
      caption: description.caption, historicalFit: description.fit,
      editorialReason: description.reason, reviewStatus, reviewedBy: candidate.reviewedBy ?? "",
    };
  });

/** Both an asset approval and an explicit scene approval are required. */
export const JONAH_APPROVED_MEDIA = JONAH_MEDIA_REVIEW.filter(isProductionReadyMedia);
export function jonahArtworkIds(sceneId: string): string[] {
  return JONAH_APPROVED_MEDIA.filter(asset => catalog.assets.some(candidate =>
    candidate.id === asset.id && candidate.approvedSceneIds.some(id => id === sceneId)
  )).map(asset => asset.id);
}
