import type { CuratedMediaAsset } from "../domain/media.ts";

const mosaic = {
  id: "romanus-daphne-mosaic", eventIds: [], journeyIds: ["romanus"],
  class: "historical-artifact", title: "Mosaic floor panel",
  creator: "Unidentified Roman mosaic makers", creationDate: "2nd century CE",
  depictedPeriod: "Roman Daphne before the persecution of c. 303; personification, not a historical scene",
  sourceInstitution: "The Metropolitan Museum of Art, New York",
  sourceRecordUrl: "https://www.metmuseum.org/art/collection/search/253565",
  originalAssetUrl: "https://images.metmuseum.org/CRDImages/gr/original/DP140137.jpg",
  license: "CC0-1.0", rightsUse: "open",
  rightsStatement: "Image-level isPublicDomain:true verified in The Met Open Access API object 253565 on 2026-11-04; CC0 Open Access policy linked from the object record. Full image resized and encoded to WebP, without cropping or content editing.",
  requiredAttribution: "The Metropolitan Museum of Art, Mosaic floor panel, 38.11.12. Purchase, Joseph Pulitzer Bequest, 1938. Public domain / CC0.",
  downloadedAt: "2026-11-04",
  checksum: "sha256:fc26b88bc57f5dfa873e49bb20a4c48f7055e801de2c625d3635161db6bf88a6",
  localPath: "/media/romanus/daphne-mosaic.webp",
  altText: "A complete Roman mosaic floor: interlocking geometric shapes surround a female personification wearing a floral wreath.",
  caption: "Mosaic floor panel, Daphne near Antioch, second century CE. A personification, not Romanus. The Met, 38.11.12. Public domain / CC0.",
  historicalFit: "Found at Daphne-Harbiye in 1937. The Met describes the figure as probably abundance and good living, traditionally Spring. Predates Romanus; no claim he saw this floor or that it depicts his life.",
  editorialReason: "Brings the material and domestic world around Antioch into view before the confrontation, without inventing a portrait or street scene.",
  reviewStatus: "rights-verified", reviewedBy: "Codex: exact institutional object page and Open Access API checked; editorial pairing pending human review",
} satisfies CuratedMediaAsset;

export const ROMANUS_MEDIA: readonly CuratedMediaAsset[] = [
  mosaic,
  { ...mosaic, id: "romanus-daphne-mosaic-small", localPath: "/media/romanus/daphne-mosaic-small.webp", checksum: "sha256:6d16e9f83686a6092bb7d10f9c5b3cbbfa1ac6d26e83e3fa77f15ff83530f62c" },
];
