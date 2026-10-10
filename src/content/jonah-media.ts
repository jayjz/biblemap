import catalog from "../../docs/research/jonah-asset-candidates.json" with { type: "json" };
import { isProductionReadyMedia, REVIEW_STATUSES, type CuratedMediaAsset } from "../domain/media.ts";

const descriptions: Record<string, { alt: string; caption: string; reason: string }> = {
  "nga-raphael-hosea-jonah": {
    alt: "Brown ink drawing of two robed prophets with a winged figure between them; transfer grid and collector stamps remain visible.",
    caption: "Raphael’s The Prophets Hosea and Jonah, c. 1510. A later artistic depiction of the prophets together, not a scene of Jonah receiving the command or a historical likeness.",
    reason: "Proposed for the opening as reception history. Preserve both prophets, the winged figure, grid, and collector stamps; no crop approved.",
  },
  "met-rosselli-prophet-jonah": {
    alt: "Engraving of a seated, bearded prophet holding a book beside a curling sea creature, with IONA PROFETA above and inscriptions below.",
    caption: "Francesco Rosselli after Baccio Baldini, 1480–90. A symbolic portrait with a sea-creature attribute, created long after the biblical narrative; not a historical likeness.",
    reason: "Proposed only at 1:17, after the fish enters the text. Preserve the entire sheet and its inscriptions.",
  },
  "met-gassel-ship-jonah": {
    alt: "Etching and engraving of a large sailing ship near a coastal town, with a figure emerging from a sea creature in the foreground.",
    caption: "Lucas Gassel, ca. 1560–70. Ship, coastline, and sea creature belong to a later artistic interpretation. Release imagery extends beyond Jonah chapter one.",
    reason: "Acquired and documented for review; excluded from chapter-one scene mappings to avoid revealing the release prematurely.",
  },
};

/** Review records use the existing contract. Missing receipt/reviewer fields stay empty,
 * so validation and the production gate fail closed. No editorial approval is inferred.
 * localPath is a proposed publication destination; originals remain outside public/.
 */
export const JONAH_MEDIA_REVIEW: readonly CuratedMediaAsset[] = catalog.assets
  .filter(candidate => descriptions[candidate.id])
  .map(candidate => {
    const description = descriptions[candidate.id];
    const reviewStatus = REVIEW_STATUSES.find(status => status === candidate.productionReviewStatus);
    if (!reviewStatus) throw new Error(`Unknown Jonah media review status: ${candidate.id}`);
    const acquired = catalog.acquiredFiles.find(file => file.matchedCandidateId === candidate.id);
    if (!acquired) throw new Error(`Missing Jonah acquisition record: ${candidate.id}`);
    return {
      id: candidate.id, eventIds: [], journeyIds: ["jonah"], class: "artistic-depiction",
      title: candidate.title, creator: candidate.creator, creationDate: candidate.creationDate,
      depictedPeriod: "The narrative of the book of Jonah; historical dating is not established by this artwork",
      sourceInstitution: candidate.sourceInstitution, sourceRecordUrl: candidate.sourceRecordUrl,
      originalAssetUrl: candidate.originalAssetUrl ?? "", license: candidate.license,
      rightsStatement: `Institutional object page identifies this image as public domain. Rights evidence: ${candidate.rightsEvidence}. Exact original download receipt is not supplied.`,
      requiredAttribution: `${candidate.creator}, ${candidate.title}, ${candidate.creationDate}. ${candidate.sourceInstitution}, ${candidate.accessionNumber}. ${candidate.license}.`,
      downloadedAt: candidate.downloadedAt ?? "", checksum: `sha256:${acquired.checksumSha256}`,
      localPath: `/media/jonah/${acquired.filename}`, altText: description.alt,
      caption: description.caption, historicalFit: candidate.sceneFitCaveat,
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
