# Human Story verification and milestone log

Review branch: `feat/human-story-portal`, PR #36. No merge or deployment authorized. Branch deployment is explicitly disabled in `vercel.json`, following [Vercel's branch configuration](https://vercel.com/docs/project-configuration/git-configuration).

## Milestone 1 — entrance and navigation

Replaced the generic sunset with a source-specific, full-frame Jonah sculpture and a connected-world composition. Added all five navigation doors and a shared semantic page frame. The source descriptions and external reading entrances are interim routes; subsequent milestones turn them into local connected reading rooms.

- `npm ci`: pass; existing dependency audit reports 45 findings. No lockfile change or dependency added.
- `npm run lint`: pass with the same four existing warnings (DataLoader and validate-nineveh-depth).
- `npx tsc --noEmit`: pass after build. Build/typecheck cannot run concurrently because Next regenerates route types.
- `npm run build`: pass, static export; existing pinned Scripture and media validators pass.
- `npm run test`: 25 pass. Sandbox blocked one invocation with EPERM; approved rerun passed.
- Targeted Playwright: 4 pass, desktop/mobile; keyboard skip link, axe WCAG A/AA, no-JS reader link and 320px overflow.
- Browser inspection and screenshots: 320, 390, 820, 1440px, no overflow or page errors. First-pass screenshots in `artifacts/human-story/after/`; baseline in `before/`. Baseline request failures were aborted Next link prefetches during navigation, not unavailable core resources; redesigned entrance uses normal navigation or disables prefetch. No failed requests in the milestone capture.
- Reproduced and fixed Windows-only QA launcher failure: `python3` is a Store alias; `python --version` is 3.15.0. Playwright now uses `python` on Windows and retains `python3` elsewhere.

Rights: reused `/media/nineveh-depth/jonah-vine.webp` without modification. Exact CMA record [1965.239](https://www.clevelandart.org/art/1965.239) re-read November 1, 2026: public domain, copying/modification/distribution permitted. Existing CC0 manifest and SHA-256 remain in `src/features/nineveh/depth-media.json`. Unknown sculptor, Anatolia, 280–290 CE; later artistic reception, never an Assyrian reconstruction. Original inline linework is interface ornament, not geography or a historical route.

Diff review: existing Nineveh/Jonah/Atlas implementation and source/release gates untouched. No new third-party assets, quotations or dependencies. Exclude the pre-existing `next-env.d.ts` modification and unrelated artifacts from every commit.

| Before | After | Why |
| --- | --- | --- |
| Generic CSS sunset | Full, attributed Jonah sculpture | Begin with actual subject matter; disclose later reception |
| Four mixed navigation items | Five named worlds | Make the larger scope legible |
| No source-specific visual relationship | Scripture entry beside later artwork | Distinguish the text and its reception |
| Experimental copy dominates the opening | Review metadata in native disclosure | Keep evidence available while foregrounding exploration |

Editorial acceptance and independent visitor comprehension remain untested. Technical checks do not establish emotional response.

## Milestone 2 — biblical stories and relationship integrity

Milestone 1 push confirmed at `6ec1caeb1e4b93713108457717bee2c8b726cc1e`.

Added seven substantive static reading rooms: five biblical entrances (Genesis, Exodus, Jonah, Emmaus, Saul/Ananias), Nineveh's tablet context and Jonah's later marble reception. Added five world destinations, stable person/place/source identities and classified, cited connections. Witness and saint destinations remain explicitly limited at this intermediate milestone; they are populated next. All pages inherit no-index review metadata. Exact Jonah 4:11 is imported from the existing pinned source, not retyped. Every room links onward and back to Scripture or the underlying record.

Checks: 27 unit tests pass, including rejection of unsourced claims and broken graph identities; lint passes with the four baseline warnings; static build and subsequent typecheck pass; six targeted desktop/mobile browser tests pass, including a Stories → Jonah → historical Nineveh flow, keyboard, no-JS and axe. Corrected an initially unsupported Exodus journey query during diff review: the link now uses the existing `#exodus` epoch and does not promise to launch a journey.

Source review: publisher chapters Genesis 1, Exodus 14, Luke 24 and Acts 9 read directly on November 1. No new Scripture quotations beyond the pinned Jonah verse. CMA record rechecked. The live British Museum record returned only a shell; the existing verified Nineveh dossier and retained object manifest support K.3375's dating/findspot. This retrieval limitation is recorded in its source entry. No new archaeological identification, fixed biblical chronology or historical influence is inferred from a thematic comparison.

## Milestone 3 — witnesses, scholarship and evidence

Milestone 2 push confirmed at `ec7e78966621cc1cde9c4dd217920dad63aa9739`. Milestone 1 GitHub technical/browser CI completed successfully ([run](https://github.com/jayjz/biblemap/actions/runs/41336097712)).

Added five connected rooms and a responsive comparison table: Tacitus, Pliny/Trajan, Josephus on James, the Testimonium and Suetonius. Each gives a passage locator, edition, genre and limits. The Testimonium's disputed status is in the introduction, not buried in a disclosure. Whealey's argument about related Syriac/Arabic transmission is attributed to her public publisher abstract; no claim to have read the paywalled article. Kirby's Suetonius guide is labeled modern commentary, not peer-reviewed scholarship. Failed candidate URLs and page shells were not accepted as evidence; the working Rolfe text was checked at Wikisource. No resurrection-proof claim, silent Chrestus identification or fabricated quotation.

Checks: 27 unit tests, lint (four baseline warnings), post-build typecheck and static export pass. Eight targeted desktop/mobile browser checks pass, including the comparative table, Testimonium → James and Suetonius's disputed connection. Diff/source review caught and corrected the draft Suetonius translator attribution before commit: the retrieved edition is **J. C. Rolfe**.

## Milestone 4 — saints and the telling of a life

Milestone 3 push confirmed at `77c189d86e70771e2a5554940a1811af3638443f`.

Added Perpetua/Felicity, Augustine, Teresa of Ávila and Francis. Perpetua's attributed first-person sections, Saturus's vision and the narrator's ending remain separate. Felicity is not assigned an invented diary. Augustine is a retrospective confession, Teresa a specifically Carmelite Catholic spiritual account, and Francis's birds a later hagiographic/legendary tradition. Teresa → Augustine is an explicitly documented reception link (Life 9.8–10), distinct from editorial comparisons. Augustine's Genesis reading is grounded in Confessions XI–XIII. No visions or legendary events are asserted as externally verified history.

Checks: lint (four baseline warnings), 27 unit tests, static build and subsequent typecheck pass. Ten targeted desktop/mobile browser tests pass, including Perpetua → Augustine → Teresa and the immediate legend label on Francis. Rechecked the pre-existing `next-env.d.ts` diff; it is unchanged and remains excluded. Source/rights review: primary editions read directly; no new media files or translated quotations introduced.

## Milestone 5 — voices, culture and Atlas integration

Milestone 4 push confirmed at `f2d5331400d533ddeb5187097979c7b6262f2518`. GitHub technical/browser CI is green for milestones 1–4.

The connected review now has **23 reading rooms, 31 cited relationships, 28 source records and three authored paths**. Added Augustine/Jerome's translation dispute, Rashi/Radak, Codex Sinaiticus, communal singing, time and memory, Michelangelo's Genesis reception and Rome/Carthage orientation. Explicit editorial classifications distinguish a manuscript witness from historical testimony, geographical reference from material evidence, and later interpretation from Scripture. No new media bytes, dependencies or audio added. The existing full-frame Creation of Adam derivative was reverified against its checksum and exact PD-Art record; K.3375 and Jonah sculpture retain their existing rights metadata.

The homepage now offers actual cross-world reading sequences and a searchable collection with a relationship preview. The hydrated entrance starts with six curated readings; no-JS readers receive the full collection. Selection moves focus to the relationship heading, scrolls it into view on mobile and offers a return link. Search handles accents and empty results; clearing returns focus to the field. Sources remain within the full reading rooms. The Atlas opens the existing city/epoch/camera state; no new route is invented.

Checks: lint (four baseline warnings), 29 unit tests (including every adjacent path connection), static export and subsequent typecheck pass. Sixteen targeted desktop/mobile browser tests pass: search, empty recovery, selection, authored path → Jerome, Atlas links and missing image/attribution. The first missing-media test failed only on mobile because it had not scrolled the lazy image into loading range; exercising the actual artwork viewport resolved it. Final responsive and full regression verification follows in milestone 6.

Source/reuse limitations and rejected retrieval candidates are recorded in `docs/research/human-story-sources.md`. Radak's API provided Hebrew but no English; no source text is copied, and the original short paraphrase remains explicitly pending qualified human review in its source record. The British Library's working catalogue replaces the unavailable Codex project site as evidence. Human review is still required for all new editorial drafts; no homepage swap or publication approval is implied.

## Milestone 6 — responsive refinement and regression groundwork

Milestone 5 push confirmed at `b768f6b`. Its GitHub run [41339941573](https://github.com/jayjz/biblemap/actions/runs/41339941573) passed ordinary browser and technical checks, then failed a legacy Nineveh review test. That test clicked a global Continue before hydration, when the no-JS reader intentionally exposes all twelve scene continuations. Reproduced the strict-locator failure from its log and corrected the test to wait for the existing reader-ready attribute and scope the continuation to the intended scene. No reader code, assertions or retries were weakened.

The new enlarged-text check reproduced a real navigation defect: at 820px with 200% root text, the document grew to 951px. Header and navigation now wrap. Focus outlines inherit the current foreground color; the former berry outline had only 1.90–2.72 contrast on dark surfaces. Increased small captions and evidence metadata to 12px. Selection previews now derive their active card from the displayed results, preserving a valid return target after filtering. Shared world identifiers come from the domain constant; client payloads omit full source and section records. Formatted the new Human Story files for reviewability; no dependency or lockfile changes.

Executed after the fixes: lint passes with the same four baseline warnings; 29 unit tests pass; ordinary and opt-in static builds pass; subsequent `npx tsc --noEmit` passes; ordinary export media gate passes. The first opt-in build hit sandbox child-process EPERM; approved rerun passed. Full ordinary Playwright: **93 passed, 1 pre-existing intentional mobile explorer skip**. Local review suite: **22 passed**, including the formerly failing hydration-sensitive test. The new route sweep checks all 23 rooms, three paths and their local links, reduced motion, no-index, no page/console/request errors; world checks include 320px axe and 200% text. No-JS and keyboard selection/return checks pass.

Before committing, the pre-existing `next-env.d.ts` SHA-256 remains `4e4da12aa061aac172fb1bcb48e9b6e4b293080d2f494327925fdba8f39632ac`; its diff and unrelated artifacts remain excluded.

## Narrative direction milestone

The creator's subsequent narrative brief changes the emphasis from collection breadth to one complete encounter. Three detailed treatments and visual storyboard sheets were completed before slice implementation and pushed in **`e23a7652f11c5079dd8aa399a4509306f2d1d174`**. The accompanying Perpetua audit records the composite source's single evidence lineage, reported visions/speech, missing voices, edition rights and inaccessible scholarship. It does not pretend that multiple passages independently corroborate each other. No new historical quotation, sound or third-party media is authorized by a visual treatment alone.
