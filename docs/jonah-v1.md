# Jonah V1 — visitor experience and review status

The reader now covers Jonah 1–4: 48 complete World English Bible verses, in 13 reader-controlled scenes across Calling, Flight, Storm, Depths, Nineveh, and The unanswered question. Enter from the homepage, move forward or backward, use section links or browser history, inspect optional sources and reading companions, write temporary private reflections, reach the separate Jonah 4:11 scene, and return home or open the atlas. No sound plays automatically; the journey is complete in silence. Exodus and the atlas implementation are unchanged.

All scripture comes from committed eBible.org publisher snapshots. Extraction, chapter-specific hashes, verse order, translator notes, passage coverage, and the actual rendered text are checked. Builds require no scripture or artwork network service. Publisher sources: [chapter 1](https://ebible.org/engwebp/JON01.htm), [chapter 2](https://ebible.org/engwebp/JON02.htm), [chapter 3](https://ebible.org/engwebp/JON03.htm), [chapter 4](https://ebible.org/engwebp/JON04.htm), [public-domain statement](https://ebible.org/engwebp/copyright.htm).

Reading-companion titles, questions, and short contextual readings are explicitly provisional editorial copy, tied to their passages. They are not creator testimony. Optional philosophy remains attributed, with links to the original works; the premature reference to Jonah's later explanation has been removed. Empty historical-claim panels and empty geographic disclosures no longer appear to visitors. No new historical claims or quotations have been manufactured.

## Artwork: ready compositions, pending publication

No creator scene approval was supplied during implementation. **No Jonah JPEG currently appears in the public static export.** The existing approval gates remain enforced. The following verified public-domain works are composed in the local reader and ready for creator review:

| Work | Proposed public placement | Treatment |
| --- | --- | --- |
| Raphael, *The Prophets Hosea and Jonah*, c. 1510, National Gallery of Art | Calling, Jonah 1:1–2 | Entire drawing, including both prophets, grid, and stamps. Later reception history, not a literal calling or historical likeness. |
| Francesco Rosselli after Baccio Baldini, *The Prophet Jonah*, 1480–90, Metropolitan Museum of Art | Depths, Jonah 1:17 and 2:1–9 | Entire sheet and inscriptions. Symbolic prophet portrait; only after the fish enters the text. |
| Lucas Gassel, *Landscape with a Ship and Jonah and the Whale*, ca. 1560–70, Metropolitan Museum of Art | Dry land, Jonah 2:10 | Entire print. Release imagery is withheld until the release is read. |

Each composition preserves the artwork with `object-fit: contain`; captions identify the artist, date, institution, and artistic classification. Expandable credits retain source records, rights, and interpretive limitations. Image failure produces a deliberate atmospheric fallback without preventing reading.

The other three originals remain local only: the Hortus deliciarum reproduction mislabeled as Vaillant, the Sadeler/Barendsz release engraving mislabeled as a Cleveland sculpture, and the two-object Cleveland swallowing/release composite photograph. Exact reproduction rights remain unresolved. Their gallery uses the corrected identities and makes no permission inference. All six originals and held copies remain intact.

Run `npm run review:jonah`, then open `http://127.0.0.1:4190/` for the composed reader or `/gallery` for all six images. The server binds only to loopback, serves a finite list of originals, and copies nothing into `public/` or `out/`. This is a local review tool, not a deployment target. Screenshots containing uncleared reproductions are also ignored by Git.

## Verification

- `npm ci`: passed with the existing lockfile; no dependency changes. npm reports 36 existing dependency advisories (1 low, 10 moderate, 23 high, 2 critical); remediation is outside this journey change.
- `npm run validate:story` and `npm run validate:media`: passed. All 48 verses and translator notes match the pinned sources; six distinct acquisition records and available original/hold checksums validate.
- `npm test`: both existing domain test files pass, including complete-book coverage, source references, malformed links, approval gates, and invalid transitions.
- `npm run lint`: passes with the same three pre-existing unused-symbol warnings in `DataLoader.tsx`, reproduced before edits.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with TypeScript enabled and all static routes exported.
- Diff whitespace checks pass for application code. The raw publisher HTML snapshots intentionally retain upstream whitespace/line endings so their recorded checksums identify the actual retrieved bytes.
- Desktop/mobile Playwright: 27 passed, one pre-existing mobile atlas skip (28 total). Full-book tests compare every rendered verse to the pinned content and exercise progression, backward/forward history, section navigation, the final question, and returning home. Additional checks cover static-export exclusion of held originals/review routes, keyboard focus, reduced motion, 320px reflow, private-note lifecycle, no-JavaScript reading, artwork provenance, image failures, and silent-default audio behavior. The existing mobile atlas baseline remains skipped; the desktop atlas/Exodus regression passes.
- No Jonah page exceptions, failed media loads, third-party reader requests, or HTTP errors in the successful checks. Chrome's cancelled navigation/HEAD probes are recorded separately from resource failures in a Playwright attachment. Expected 404/playback failures are injected only in fallback tests.
- Local browser check: all three proposed artworks load in their intended scenes on desktop and mobile; all six gallery originals decode successfully; no page errors, failed requests, or horizontal overflow. No fake approval fixture is used by the local review mode.
- `npm run validate:release`: intentionally fails. Provisional reading companions, scene approvals, and existing creator author slots have not been approved or completed. A technically complete reader does not imply an editorially approved release.

Screenshots inspected include the public opening, flight/storm, prayer, Nineveh, and final-question compositions; the desktop/mobile Raphael, Rosselli, and Gassel placements; and the narrow reduced-motion view. Playwright captures every scene on both sizes under `test-results/`. Selected captures are retained locally under `artifacts/jonah-v1-review/`, including `desktop-local-jonah-1-calling.png`, `mobile-local-jonah-1-depths.png`, `desktop-local-jonah-2-shore.png`, and public scene captures. Gallery screenshots containing uncleared images remain local.

## Exact approvals and remaining release requirements

1. Creator approval of the three artwork placements above, full-sheet composition, captions and alt text; record the creator/reviewer identity and review date. Populate each approved asset's `approvedSceneIds`, `reviewedBy`, and review status in the existing catalog. The proposed scene mappings alone confer no approval.
2. Genuine acquisition/receipt metadata required by the existing media contract. Original download dates were not supplied and remain empty. The NGA reference was re-fetched on 2026-10-10 and matched the supplied bytes exactly; the Met original references were also inspected but have different byte hashes from the supplied resized files. Do not invent original download dates or silently replace the supplied art.
3. Human editorial review of all 13 provisional titles, contemplative questions, and passage companions in `src/content/jonah.ts`; the opening orientation and philosophy selections in `FirstEncounter.tsx`; the introductory/homepage copy; and the ending treatment. Approve, revise, or replace creator author slots if an authored release is desired. No personal testimony is assumed.
4. Exact reproduction-source and rights evidence before any of the three uncleared files can leave local review. Their exclusion does not prevent reading the entire book.

PR #4 continues to target `feat/jonah-first-encounter` (open PR #3), which targets `integration/jonah-first-experience`. No dependency branches were merged or rebased. No merge or deployment is part of this delivery.

Changed files are concentrated in the Jonah content and scripture snapshots, story reader/media/evidence styles and components, homepage/Jonah metadata, story validation and domain tests, browser tests, the local review command and entry, `.gitignore`, and this verification note. No ETL, chronology, map renderer, Exodus media, or production dependency changes.
