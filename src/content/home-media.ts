import pliny from "../../public/media/pliny-v4/manifest.json" with { type: "json" };
import interiors from "./human-story-interior-media.json" with { type: "json" };
import thomas from "../../public/media/thomas/manifest.json" with { type: "json" };

function required<T extends { id: string }>(assets: readonly T[], id: string): T {
  const asset = assets.find(candidate => candidate.id === id);
  if (!asset) throw new Error(`Missing homepage media provenance: ${id}`);
  return asset;
}

export const HOME_MEDIA = {
  pliny: required(pliny.assets, "pliny-manuscript"),
  perpetua: required(interiors, "perpetua-mosaic"),
  // Sculpture already used by the visitor homepage; full rights in the Jonah asset registry.
  jonah: {
    id: "jonah-vine", localPath: "/media/nineveh-depth/jonah-vine.webp", width: 749, height: 579,
    title: "Jonah Under the Gourd Vine", creator: "Unknown artist", creationDate: "280–290 CE",
    sourceInstitution: "Cleveland Museum of Art", sourceRecordUrl: "https://www.clevelandart.org/art/1965.239",
    license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    requiredAttribution: "Cleveland Museum of Art, 1965.239. CC0.",
    altText: "A marble figure of Jonah reclines under a broad-leaved plant. Later Christian artistic interpretation.",
    historicalFit: "Later Christian art, not a portrait of Jonah or evidence for the narrative’s date.",
  },
  thomas: required(thomas.assets, "proximity-1536"),
} as const;
