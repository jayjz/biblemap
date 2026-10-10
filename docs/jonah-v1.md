# Jonah V1 — public preview and editorial status

The reader covers all four chapters: 48 complete World English Bible verses in 13 reader-controlled scenes. Scripture, translator notes, and source snapshots are unchanged by the preview work. Static export, silent-default reading, optional sources, temporary private reflections, and keyboard navigation remain available.

## Scoped creator approval

The user explicitly relayed creator approval for a public-facing Jonah reading preview and these three proposed artwork placements. This approval is recorded in `docs/research/jonah-asset-candidates.json` under `creatorApproval`. The creator's personal name and original approval date were not supplied; neither is invented. `recordedAt` records when this agent entered the approval, not when the creator originally gave it.

| Work | Approved public placement | Treatment |
| --- | --- | --- |
| Raphael, *The Prophets Hosea and Jonah*, c. 1510, National Gallery of Art | Jonah 1:1–2 | Complete drawing, including both prophets, grid, stamps, and margins. Reception history, not a literal calling or historical likeness. |
| Francesco Rosselli after Baccio Baldini, *The Prophet Jonah*, 1480–90, Metropolitan Museum of Art | Jonah 1:17 and 2:1–9 | Complete sheet and inscriptions; symbolic portrait after the fish enters the text. |
| Lucas Gassel, *Landscape with a Ship and Jonah and the Whale*, ca. 1560–70, Metropolitan Museum of Art | Jonah 2:10 | Complete print; release imagery appears only at the release. |

Rights were rechecked against the [NGA object record](https://www.nga.gov/artworks/74167-prophets-hosea-and-jonah), [Rosselli record](https://www.metmuseum.org/art/collection/search/625983), and [Gassel record](https://www.metmuseum.org/art/collection/search/349348). Each explicitly identifies its image as public domain. Attribution, creation date, source record, classification, and later-depiction limitations are available in the reader's expandable artwork credits.

Fresh copies were retrieved from the official museum image URLs for this preview. `publicationFiles` records those actual retrieval timestamps, source URLs, original source SHA-256 hashes, derivative SHA-256 hashes, sizes, dimensions, and transformations. The public files are full-composition JPEG derivatives bounded to 1200×1200, quality 85, without enlargement or cropping. Original supplied files and their acquisition records are preserved; their original download dates and receipts remain unknown. New retrieval metadata is not backfilled into supplied-original records. No runtime hotlink or new production dependency was introduced.

The Hortus reproduction, Sadeler/Barendsz reproduction, and Cleveland composite remain local only with unresolved exact reproduction rights. They are absent from `public/` and the static export. The loopback-only review tool and its gallery remain outside the public routes.

## Editorial limitations

Approval covers the public preview and the three artwork placements. It does **not** approve all commentary, philosophy, scene copy, captions as a separate editorial review, personal testimony, author slots, or historical claims. Reading-guide draft status and author placeholders remain in source. The visitor presentation removes local-review and repetitive provisional notices while retaining explicit Scripture, commentary, philosophy, artistic-depiction, and geographic-uncertainty labels. No Scripture was rewritten and no blanket editorial approval was added.

`npm run validate:release` intentionally continues to fail on existing unfinished author slots and human editorial approval requirements. A public reading preview is not a fully approved authored release. Before such a release, review the 13 scene titles/questions/companions, opening orientation, optional philosophy, homepage copy, ending, and author slots. Unresolved reproductions require exact source and rights evidence before publication.

## Human-experience review gate

Distinct from technical CI and editorial publication approval: does the opening invite curiosity without predetermining what Jonah means? Recognition must remain an invitation that Scripture can complicate. Technical checks and creator approval of copy do not establish that unfamiliar readers experience recognition or curiosity. See `docs/experience-principles.md`.

## Verification and deployment

See `docs/jonah-preview-verification.md` for the current checks and deployment evidence. Earlier local-only verification reports describe historical checkpoints, not the current publication state. PR #4 retains base `feat/jonah-first-encounter`; no merge, branch deletion, or Exodus implementation change is authorized.
