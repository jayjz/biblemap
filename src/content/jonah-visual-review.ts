import type { CuratedMediaAsset } from "../domain/media.ts";

/**
 * Pictures with a public-domain claim that was not reconfirmed at the holding institution.
 * They may render in the local visual-review server. They must not be copied into public/.
 */
const withheld = (asset: Omit<CuratedMediaAsset, "rightsUse">): CuratedMediaAsset => ({ ...asset, rightsUse: "unresolved" });

export const JONAH_VISUAL_REVIEW: readonly { sceneIds: readonly string[]; asset: CuratedMediaAsset }[] = [
  {
    sceneIds: ["jonah-3-mercy"],
    asset: withheld({
      id: "kbr-heemskerck-nineveh-repents",
      eventIds: [], journeyIds: ["jonah"], class: "artistic-depiction",
      title: "The People of Nineveh Repenting upon Hearing the Prophecies of Jonah",
      creator: "Philips Galle after Maarten van Heemskerck",
      creationDate: "1566",
      depictedPeriod: "The repentance in Jonah 3 as imagined in 1566; not ancient Nineveh",
      sourceInstitution: "Royal Library of Belgium, via Wikimedia Commons",
      sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:The_People_of_Niniveh_Repenting_upon_Hearing_the_Prophesies_of_Jonah_1566_print_by_Maarten_van_Heemskerck,_S.II_136362,_Prints_Department,_Royal_Library_of_Belgium.jpg",
      originalAssetUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/The_People_of_Niniveh_Repenting_upon_Hearing_the_Prophesies_of_Jonah_1566_print_by_Maarten_van_Heemskerck%2C_S.II_136362%2C_Prints_Department%2C_Royal_Library_of_Belgium.jpg/1280px-The_People_of_Niniveh_Repenting_upon_Hearing_the_Prophesies_of_Jonah_1566_print_by_Maarten_van_Heemskerck%2C_S.II_136362%2C_Prints_Department%2C_Royal_Library_of_Belgium.jpg",
      license: "Public Domain",
      rightsStatement: "Wikimedia Commons labels this file public domain and credits the Royal Library of Belgium. The library’s own reuse badge was not reconfirmed, so the file stays out of the public site.",
      requiredAttribution: "Philips Galle after Maarten van Heemskerck, The People of Nineveh Repenting, 1566. Royal Library of Belgium (Commons file S.II 136362). Public-domain claim not reconfirmed with the institution.",
      downloadedAt: "2026-10-11",
      checksum: "sha256:efebee0f7d0d15e9dba52bb8381e650e65e3f3bdf3a568b7a130f134f5cb4dcc",
      localPath: "artifacts/jonah-visual-review/kbr-heemskerck-nineveh-repents.jpg",
      altText: "Engraving of a prophet addressing a kneeling crowd, with a king on the steps, cattle, and a walled city.",
      caption: "Philips Galle after Maarten van Heemskerck, 1566. An artistic depiction of Jonah’s message and Nineveh’s response: people, the king, and animals. Not ancient Nineveh, and not archaeological evidence.",
      historicalFit: "Jonah 3:5–10 is the city turning, the king, and the animals. The print also shows the proclamation from 3:4.",
      editorialReason: "The human response to mercy. Rights are unresolved, so this is visual review only.",
      reviewStatus: "candidate",
      reviewedBy: "",
    }),
  },
  {
    sceneIds: ["jonah-4-anger"],
    asset: withheld({
      id: "lilien-jonah-complains",
      eventIds: [], journeyIds: ["jonah"], class: "artistic-depiction",
      title: "Jonah complains",
      creator: "Ephraim Moses Lilien",
      creationDate: "early 20th century",
      depictedPeriod: "A modern illustration of complaint; not a historical likeness",
      sourceInstitution: "Wikimedia Commons",
      sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Jonah_complains.jpg",
      originalAssetUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jonah_complains.jpg",
      license: "Public Domain",
      rightsStatement: "Wikimedia Commons labels this file public domain. Lilien died in 1925. The scan’s own terms were not reconfirmed beyond that label, so the file stays out of the public site.",
      requiredAttribution: "Ephraim Moses Lilien, Jonah complains. Commons file. Public-domain claim not reconfirmed for this scan.",
      downloadedAt: "2026-10-11",
      checksum: "sha256:3d6c87d06809aa560054333dabc59b3c56a4d1c2c998bdc7a18b384328e54554",
      localPath: "artifacts/jonah-visual-review/lilien-jonah-complains.jpg",
      altText: "Ink drawing of a robed figure face down across rocks, under rays of light.",
      caption: "Ephraim Moses Lilien, Jonah complains. An artistic depiction of a person collapsed in complaint. It does not show the fish, the city, or the vine, and it is not the wording of Jonah 4:2.",
      historicalFit: "Jonah 4:1–4 is his anger before the plant appears. The drawing carries that feeling without illustrating the vine, which comes later.",
      editorialReason: "The anger at mercy, kept separate from the shade scene. Rights are unresolved, so this is visual review only.",
      reviewStatus: "candidate",
      reviewedBy: "",
    }),
  },
];
