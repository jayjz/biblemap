# Jonah visual assets — verified acquisition, approval pending

Verified locally on 2026-10-10. This supersedes the earlier acquisition-blocked report. All six supplied staging files pass the supplied SHA-256 manifest; all six intended-publication copies are byte-identical. Dimensions are decoded JPEG dimensions, not museum master dimensions. Six distinct hashes mean there are no byte duplicates among the six subjects.

The machine-readable [candidate catalog](jonah-asset-candidates.json) separates museum object candidates from acquired files. The original download URLs and dates were not supplied. Recovered official reference URLs are explicitly distinguished from download receipts. No `reviewedBy` or editorial approval has been inferred.

| Supplied filename | Actual content and identity | Chapter-one decision |
| --- | --- | --- |
| `nga-raphael-hosea-jonah.jpeg` · 611×800 | Raphael, *The Prophets Hosea and Jonah*, c. 1510; NGA 1991.217.4. Official reference download is byte-identical. | Opening 1:1–2 proposal only: a later depiction of both prophets, not the literal call or Jonah’s likeness. Preserve the entire composition and collector stamps. |
| `met-vaillant-prophet-jonas.jpg` · 701×1024 | **Not Vaillant.** A *Hortus deliciarum* illustration of Jonah released near Nineveh, after the medieval composition associated with Herrad of Landsberg. Exact reproduction source/date unresolved. | Excluded. Release imagery spoils chapter one; no Vaillant image was actually acquired. |
| `met-rosselli-prophet-jonah.jpeg` · 843×1200 | Francesco Rosselli after Baccio Baldini, *The Prophet Jonah, from Prophets and Sibyls*, 1480–90; Met 29.16.24. Visual match to official image. | Reserve for 1:17 as a symbolic portrait with a sea-creature attribute. Do not use before the fish enters the text; preserve inscriptions and margins. |
| `met-gassel-ship-jonah.jpeg` · 1200×887 | Lucas Gassel, *Landscape with a Ship and Jonah and the Whale*, ca. 1560–70; Met 1999.360.4. Visual match to official image. | Excluded from chapter one. Foreground release imagery is not a storm-only illustration. No misleading crop proposed. |
| `cma-jonah-swallowed.jpeg` · 1048×676 | **Two objects:** *Jonah Swallowed*, CMA 1965.237, left; *Jonah Cast Up*, CMA 1965.238, right; sculptures 280–90 CE. Composite photographer/source unresolved. | Excluded even at 1:17: the right half reveals release. Museum CC0 object images do not establish rights to this unidentified composite. No crop approved. |
| `cma-jonah-cast-up.jpg` · 834×966 | **Not Cleveland’s sculpture.** Jan Sadeler I after Dirck Barendsz, *Jonah spat up by the Whale*, plate 2. Compare British Museum 1868,0612.514 (c. 1580–1592). Exact impression, holder, and digital source unresolved. | Excluded. Release belongs to Jonah 2:10. |

## Source and rights evidence

- [NGA object record](https://www.nga.gov/artworks/74167-prophets-hosea-and-jonah): public-domain media; [exact matching reference](https://api.nga.gov/iiif/6c410918-c6a8-428e-94a4-02470f4e777b/full/!611,800/0/default.jpg). The reference SHA-256 matches the supplied file.
- [Met Rosselli record](https://www.metmuseum.org/art/collection/search/625983), [official API](https://collectionapi.metmuseum.org/public/collection/v1/objects/625983): `isPublicDomain: true`, primary image `DP835425.jpg`.
- [Met Gassel record](https://www.metmuseum.org/art/collection/search/349348), [official API](https://collectionapi.metmuseum.org/public/collection/v1/objects/349348): `isPublicDomain: true`, primary image `DP875195.jpg`.
- [Actual Vaillant record](https://www.metmuseum.org/art/collection/search/388096): landscape-format mezzotint, not the supplied colored medieval illustration. [Related Hortus scan](https://commons.wikimedia.org/wiki/File:Hortus_Deliciarum,_Der_Prophet_Jonas_wird_vom_Fisch_bei_Ninive_ausgespien.JPG) helps identify the composition, but its photographer terms cannot be assigned to unidentified bytes.
- [CMA Swallowed](https://www.clevelandart.org/art/1965.237), [CMA Cast Up](https://www.clevelandart.org/art/1965.238): institutional open access applies to museum images. The API’s single-object `1965.237_web.jpg` is 690×893, unlike the supplied two-object composite.
- [British Museum comparable Sadeler impression](https://www.britishmuseum.org/collection/object/P_1868-0612-514) and [AGSA comparable impression](https://www.agsa.sa.gov.au/collection-publications/collection/works/jonah-spat-up-by-the-whale/65633/) establish the print’s subject and maker, not the supplied digital reproduction’s source or rights.

## Preservation and publication

Every original is preserved at `artifacts/jonah-image-review/`, with the supplied `SHA256SUMS` unchanged. The six copies formerly under `public/media/jonah/` were moved intact to `artifacts/jonah-image-review/publication-hold/`. Next static export publishes every public file regardless of whether React displays it, so holding unapproved files outside `public/` is necessary.

Only the three institution-matched, public-domain originals are committed as research assets. The other three originals and all duplicate held copies remain local and ignored; they are not redistributed through GitHub or the static export. The catalog and checksums preserve their review records. No optimized derivatives were generated: no asset is approved for display yet, and the existing 800–1200px originals suffice for review. Optimize from preserved originals after composition and scene approval.

## Integration and scene proposals

`src/content/jonah-media.ts` prepares three `CuratedMediaAsset` records from the candidate catalog. Their status is `rights-verified`; missing acquisition dates and reviewer names stay empty. Draft captions, alt text, and editorial reasons await human review. `JONAH.media` filters through the unchanged `isProductionReadyMedia` gate; scene mappings additionally require explicit `approvedSceneIds`. **Currently no museum artwork renders.** `StoryArtwork` and `MediaProvenancePlate` remain the rendering path for future approved files.

| Passage | Current display | Review proposal |
| --- | --- | --- |
| 1:1–2 | Warm light, still horizon, explicitly labeled atmospheric study | Raphael, full composition, pending approval |
| 1:3 | Dark water and an open horizon | No suitable verified departure image acquired |
| 1:4–6, 1:7–10, 1:11–16 | Static wave studies with differing light/contrast | No spoiler-free acquired storm illustration |
| 1:17 | Fading light in deep water | Rosselli symbolic portrait only, pending approval; composite CMA image excluded |

Approval requires a real reviewer, an evidenced acquisition date/receipt, complete caption/alt/rights review, an explicit scene decision, and a checksummed local publication file. Set `approvedSceneIds` only for reviewed placements; Gassel must remain outside chapter one. Copy the chosen approved original or documented derivative into `public/media/jonah/` only after review, update checksums if deriving, and run validation. No new video system exists.

## Authorship and verification

Visitor markup conditionally omits author slots and written drafts for titles, narrative, reflection prompts, geography explanations, and historical claims. Source records remain intact. `StoryReader` / `StoryEvidence` accept an explicit `authorReview` prop for an author workspace; ordinary application routes leave it off. Tests exercise both modes. No query parameter grants author review.

Run `npm ci`, `npm run validate:story`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm run test:e2e`. `validate:media` checks actual available files against the supplied manifest, decoded dimensions, byte lengths, duplicate hashes, held copies, and accidental public inclusion. Unknown-rights local-only originals may be absent in a clean checkout; the three committed research originals are required. Release validation intentionally continues to reject unfinished authorship.

For concurrent worktrees use `CI=1 PLAYWRIGHT_PORT=4193 CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e` to start an isolated preview. Review evidence and final results are recorded in `docs/jonah-visual-assets-verification.md`.
