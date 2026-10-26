import catalog from "../../docs/research/jonah-asset-candidates.json" with { type: "json" };
import { isProductionReadyMedia, MEDIA_CLASSES, REVIEW_STATUSES, mayPublishMedia, type CuratedMediaAsset, type MediaClass } from "../domain/media.ts";

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

const provisionalCopy: Record<string, { alt: string; caption: string; fit: string; reason: string; depicted: string; sceneIds: readonly string[]; mediaClass: MediaClass }> = {
  "cma-roberts-jaffa": {
    alt: "Lithograph of a walled town above the sea, with people seated in the foreground and water at the left.",
    caption: "David Roberts, Jaffa, 1839. A nineteenth-century view of the port city traditionally identified with Joppa. Not ancient Joppa, and not a picture of Jonah boarding a ship.",
    fit: "Jonah 1:3 says he went down to Joppa and found a ship. This print shows the later town and the sea, not the departure itself.",
    reason: "Contextual place image for the flight. No cleared picture of Jonah paying his fare was available.",
    depicted: "Jaffa in 1839; not a reconstruction of the Iron Age port",
    sceneIds: ["jonah-1-escape"],
    mediaClass: "historical-landscape",
  },
  "cma-backhuysen-storm": {
    alt: "Etching of a sailing ship heeling in heavy waves beside a rocky coast and a tower, under dark clouds.",
    caption: "Ludolf Backhuysen, Storm at Sea, 1701. A later North Sea storm. Not Jonah’s ship, and not the sailors of this passage.",
    fit: "Placed with Jonah 1:4–6 because the passage is the wind on the sea. The etching does not show Jonah asleep or the crew.",
    reason: "Maritime context for the storm without the fish or the later release.",
    depicted: "A European sea storm etched in 1701",
    sceneIds: ["jonah-1-storm-wind"],
    mediaClass: "artistic-depiction",
  },
  "nga-sadeler-jonah-storm": {
    alt: "Engraving of a ship in a violent storm, a huge fish in the foreground, and a figure falling toward the water.",
    caption: "Justus Sadeler after Paul Bril, Jonah Thrown into the Stormy Sea, about 1610–1620. An artistic depiction of the ship and the fall into the sea. The fish, and the inscription’s safe landing, run ahead into Jonah 1:17 and 2:10.",
    fit: "The print matches the crew giving Jonah to the sea in 1:15. It also shows the fish before the next verse names it.",
    reason: "Direct depiction for Jonah 1:11–16, with that sequence compression stated in the caption.",
    depicted: "The Jonah narrative as imagined in the early seventeenth century; not an ancient ship",
    sceneIds: ["jonah-1-storm-sea"],
    mediaClass: "artistic-depiction",
  },
  "commons-nineveh-gardens": {
    alt: "Stone relief of a landscaped garden with trees, a pavilion, and a watercourse.",
    caption: "Photograph of a gypsum garden relief. Its Commons record describes the North Palace at Nineveh, 645–635 BCE. Historical context for the city, not a depiction of Jonah preaching. The museum object record was not re-opened in this pass.",
    fit: "Jonah 3:1–4 sends him into Nineveh. This relief, if the identification holds, is a later palace garden there. It is not his proclamation or the people’s response.",
    reason: "The place he enters, before the scene of repentance.",
    depicted: "Nineveh in the seventh century BCE, according to the Commons description",
    sceneIds: ["jonah-3-return"],
    mediaClass: "historical-artifact",
  },
  "cma-jonah-gourd-vine": {
    alt: "Marble sculpture of a bearded man reclining under a curling vine with broad leaves.",
    caption: "Jonah Under the Gourd Vine, late Roman, Anatolia, 280–90 CE. An early Christian depiction of Jonah at rest under the plant. The sculpture chooses a vine; it is not a botanical identification, and it is not a portrait.",
    fit: "Jonah 4:5–10 is the booth, the plant, and its loss. The marble shows the shelter, not the book’s last question.",
    reason: "Direct reception of the shade scene. Cleveland’s object page releases the image as CC0.",
    depicted: "Early Christian reception of Jonah under the plant, carved 280–90 CE",
    sceneIds: ["jonah-4-shade"],
    mediaClass: "artistic-depiction",
  },
};

function asMediaClass(value: string): MediaClass {
  if (!(MEDIA_CLASSES as readonly string[]).includes(value)) throw new Error(`Unknown Jonah media class: ${value}`);
  return value as MediaClass;
}

/** Rights-verified pictures can publish without a creative approval stamp. */
export const JONAH_PROVISIONAL_MEDIA: readonly CuratedMediaAsset[] = catalog.assets.flatMap(candidate => {
  const copy = provisionalCopy[candidate.id];
  if (!copy) return [];
  const acquired = catalog.publicationFiles.find(file => file.assetId === candidate.id);
  if (!acquired) throw new Error(`Missing provisional publication file: ${candidate.id}`);
  const reviewStatus = REVIEW_STATUSES.find(status => status === candidate.productionReviewStatus);
  if (!reviewStatus || reviewStatus === "approved") throw new Error(`Provisional Jonah image must not be marked approved: ${candidate.id}`);
  return [{
    id: candidate.id, eventIds: [], journeyIds: ["jonah"], class: asMediaClass(copy.mediaClass),
    title: candidate.title, creator: candidate.creator, creationDate: candidate.creationDate,
    depictedPeriod: copy.depicted,
    sourceInstitution: candidate.sourceInstitution, sourceRecordUrl: candidate.sourceRecordUrl,
    originalAssetUrl: candidate.originalAssetUrl ?? acquired.sourceUrl, license: candidate.license,
    rightsStatement: `Image reuse rights checked against the source record on 2026-10-11: ${candidate.license}. Rights evidence: ${candidate.rightsEvidence}. Verification observations: docs/research/jonah-rights-verification.json. Editorial approval is not claimed.`,
    requiredAttribution: `${candidate.creator}, ${candidate.title}, ${candidate.creationDate}. ${candidate.sourceInstitution}${candidate.accessionNumber ? `, ${candidate.accessionNumber}` : ""}. ${candidate.license}. ${candidate.sourceRecordUrl}`,
    downloadedAt: acquired.downloadedAt, checksum: `sha256:${acquired.checksumSha256}`,
    localPath: acquired.localPath, altText: copy.alt, caption: copy.caption, historicalFit: copy.fit,
    editorialReason: copy.reason, reviewStatus, reviewedBy: candidate.reviewedBy ?? "",
    rightsUse: "open" as const,
  }];
});

if (JONAH_PROVISIONAL_MEDIA.some(asset => !mayPublishMedia(asset) || asset.reviewStatus === "approved")) {
  throw new Error("Rights-verified Jonah images must be publishable without claiming editorial approval");
}

/** Approved placements win. Provisional images fill only scenes that have none. They are not story-document media. */
export function jonahSceneArtworkIds(sceneId: string): string[] {
  const approved = jonahArtworkIds(sceneId);
  if (approved.length) return approved;
  return JONAH_PROVISIONAL_MEDIA.filter(asset => provisionalCopy[asset.id]?.sceneIds.includes(sceneId)).map(asset => asset.id);
}

/** Reader placements with verified image rights; creative status remains separate. */
export const JONAH_OPEN_PLACEMENTS: readonly { sceneIds: readonly string[]; asset: CuratedMediaAsset }[] =
  JONAH_PROVISIONAL_MEDIA.map(asset => ({ sceneIds: provisionalCopy[asset.id].sceneIds, asset }));
