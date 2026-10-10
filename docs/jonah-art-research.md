# Jonah artwork — researched candidates (NOT approved for production)

All works below have object-level **Public Domain** labels on the Metropolitan Museum of Art's collection pages. Their old-master artistic imagery is reception history, never archaeological reconstruction. Rights of a particular downloaded derivative must be independently inspected before adding files to `public/media/approved`. No artist approval is inferred from curatorial research.

| Scene | Work | Creator / date | Museum object | Rights / next step |
|---|---|---|---|---|
| 1:3–16 (ship) | *Landscape with a Ship and Jonah and the Whale* | Lucas Gassel, ca. 1560–70, etching and engraving | The Met, 1999.360.4: https://www.metmuseum.org/art/collection/search/349348 | Public Domain, Download Image. Prefer for storm and ship imagery. |
| 1:17 (sea creature) | *Jonah and the Whale* | Luca Ciamberlano, 1600–40, engraving | The Met, 53.601.336(111): https://www.metmuseum.org/art/collection/search/912949 | Public Domain, Download Image. Assess framing and scene fit. |
| Future chapter 2 (release) | *Jonas Leaving the Whale* | After Joseph Vernet; engraved by Jean-Baptiste Tilliard, ca. 1770 | The Met, 53.600.1620: https://www.metmuseum.org/art/collection/search/811659 | Public Domain, Download Image. **Not** applicable to Jonah 1:17, which ends inside the fish. |
| Future chapter 2 | *Jonah Cast on Shore by the Fish* | After Maerten de Vos; Antonius Wierix II, ca. 1585 | The Met, 51.501.1746(3): https://www.metmuseum.org/art/collection/search/645221 | Public Domain. Do not substitute a later episode into chapter one. |

## Required ingestion before any artwork can render

1. Download from the museum's documented image download, not from a search thumbnail or runtime hotlink. Verify each individual asset's rights and record source URL, retrieval date, derivative details and SHA-256.
2. Preserve the original locally outside the shipped bundle; create optimized responsive derivatives without misleading crops; verify size and visual quality on mobile.
3. Fill the entire `CuratedMediaAsset` provenance contract in `src/domain/media.ts`: creation date, museum, original URL, public-domain statement, local path, checksum, alt text, historical caveat, editorial reason.
4. Keep `reviewStatus` as `candidate` or `rights-verified` until **human** editorial approval. The reader intentionally hides all unapproved artwork.
5. After approval, attach appropriate `artworkIds` to `src/content/jonah.ts`, run media verification, all tests, and inspect the actual rendered mobile/desktop page.

The scene with an enormous whale is a centuries-later visual reading of Jonah's “great fish”; the biblical text does not describe a whale species. Never claim these images represent ancient shipbuilding or eyewitness evidence.
