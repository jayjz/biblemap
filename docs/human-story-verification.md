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

The responsive/regression milestone was separately committed and its push confirmed at **`f6bf9597bc35038958bd6f46bda4075696f75602`**. GitHub technical/browser CI passed ([run 41342376547](https://github.com/jayjz/biblemap/actions/runs/41342376547)).

## Perpetua — The Prison: vertical slice

Replaced the existing Perpetua route's shared reading-room composition with six reader-controlled scenes: the child, hearing, separation, reported vision, Felicity and the narrator's ending. A responsive, original relationship drawing changes with the scene. Relationship buttons reveal who is present, who is represented by another voice, and whose account is absent. The source register gives each scene's exact section, evidentiary status and limits. The final narrator's report of the deaths is stated directly without a violent reenactment. The ending leaves a question about surviving voices rather than assigning the visitor a moral verdict.

The five doors remain available, with a homepage entrance into the encounter. Existing graph relationships lead to Pliny and Augustine; the Atlas orients Carthage without asserting a prison/arena location. The Passion's traditional 203 CE date is now qualified in collection metadata as well as in the encounter. Existing Perpetua `#prison`, `#visions`, `#felicity`, `#comparison` and source fragments remain usable. No new route, production dependency, third-party media, quotation or sound was added for this slice.

### Executed checks

- `npm run lint`: pass, same four existing warnings. Initial new JSX apostrophe errors were corrected, not suppressed.
- `npm run test`: **31 passed**. New contracts check scene evidence and speaker classifications, draft status and valid/legacy/unknown scene fragments.
- Ordinary and opt-in `npm run build`: pass, 40 statically exported routes. Subsequent `npx tsc --noEmit`: pass. Existing pinned 48 WEB verses and media validators pass.
- Full ordinary `npm run test:e2e`: **103 passed, 1 existing intentional skip**. Final run includes the legacy Perpetua fragments. Ordinary flow also passed on the opt-in export, matching CI's order.
- Local-only review `PLAYWRIGHT_REVIEW_SERVER=1 npm run test:e2e`: **22 passed** after the final slice, including Nineveh disclosures, Scripture, continuation, no-JS, missing media, reduced motion, keyboard and narrow-screen behavior.
- Perpetua-specific flows cover source-attributed human stakes, narrated separation, vision versus waking interpretation, Felicity's mediation, narrator handover, edition disclosure, scene history/back/forward, keyboard Enter/Space, selection focus, full reading, unknown links, no-JS and failed-script fallback. Every scene passes axe A/AA at 320px, 200% text at 820px, and reduced-motion checks. These are interface/comprehension safeguards, not observed human understanding.
- Real Chrome screenshots at 320/390/820/1440px cover all six scenes and the portal; additional captures include no-JS, selected/empty exploration states, source-aware reading rooms, Atlas, artwork and the three visual storyboard sheets. Screenshot capture records **zero page/console errors, failed requests, HTTP errors or horizontal overflow**. Accessibility tree recorded from the rendered opening.

### Defects found and resolved

Initial scene-test selectors matched hidden no-JS disclosures as well as the intended passage inspector; selectors now identify the exact visible disclosure or opened fallback. A genuine hydration failure was then reproduced in development: React received multiple text children for an SVG `title`. Consolidating the accessible title/description into single strings fixed the root cause. The subsequent development check, static screenshot run and complete browser suite report no hydration errors. No hydration suppression or error filtering was added.

Source review removed an unsupported detail about the father carrying the child and narrowed the companions' prayer description to what §15 reports. See the [claim audit](research/perpetua-narrative-audit.md) for the single source lineage and inaccessible scholarship. The AI-authored SVG's provenance is disclosed; it is modern abstraction, not a portrait, artifact or reconstruction. The source edition's restrictions are retained in the source record; its translated dialogue, scans and layout are not copied.

### Review limits

No independent visitor responses or physical-device/screen-reader sessions have been collected. Automated checks establish that the stakes, speaker distinctions and evidence are available, not that an unfamiliar person understood them or felt immersed. The [treatment's study protocol](human-story-narrative-treatments.md#verification-and-comprehension-protocol) records the next observational checks without inventing participants. Qualified historical/theological review is still required for all editorial drafts, especially the Perpetua authorship/transmission framing and the earlier Hebrew-based Radak paraphrase. The unaccessed Muehlberger article is explicitly a research lead, not support for an unseen argument. Augustine's garden and Rome Remembers are treatments only.

### Change and evidence index

| Requirement | Changed files / observable evidence |
| --- | --- |
| Three different forms before implementation | `docs/human-story-narrative-treatments.md`, `docs/storyboards/human-story-narratives.html`, `docs/research/perpetua-narrative-audit.md` |
| Complete Perpetua encounter on the existing route | `src/content/perpetua-encounter.ts`, `src/features/human-story/{PerpetuaEncounter,PrisonStage,PrisonDiagram}.tsx`, `prison.module.css`, `src/app/human-story/[entry]/page.tsx` |
| Wider-world invitation and retained source limits | Portal `page.tsx`, shared stylesheet, `human-story-saints.ts`; actual links exercised by browser tests |
| Accessibility, fallback, history, regression | `tests/perpetua.spec.ts`, updated `tests/human-story.spec.ts`, `src/domain/perpetua.test.ts`; existing complete suites |
| Reviewable screenshots and error accounting | `scripts/capture-human-story.mjs`, `artifacts/human-story/after/capture.json`, PNGs and accessibility tree |

The existing Nineveh before/after screenshot has identical SHA-256 `c1148815a7abb7953e7d6c308300bdea7ced4b61b077b9513c00b13aa3b74937`. Existing Scripture, historical/media gates and Atlas implementation are unchanged. Unrelated `next-env.d.ts` and initial Jonah/review artifacts remain excluded from commits. The branch remains unmerged and deployment remains disabled.

Development stops at this checkpoint at the creator's explicit request. The next activity is human design and architecture review, followed by the unfamiliar-reader study if authorized. No further feature, experiment, milestone, merge or deployment is started by this handoff. The latest commit and CI state are recorded in PR #36 and the final report, after this document's commit is created.

## Confirmed milestone history

Each following commit was pushed to the existing branch and confirmed. The final Perpetua checkpoint follows these commits; its SHA is reported in PR #36 rather than attempting a self-referential commit hash here.

| Commit | Completed milestone |
| --- | --- |
| `6ec1caeb1e4b93713108457717bee2c8b726cc1e` | Entrance and five-world navigation |
| `ec7e78966621cc1cde9c4dd217920dad63aa9739` | Scripture-led reading rooms and sourced connections |
| `77c189d86e70771e2a5554940a1811af3638443f` | Witnesses, disputed testimony and evidence comparison |
| `f2d5331400d533ddeb5187097979c7b6262f2518` | Saints and distinct autobiographical/legendary sources |
| `b768f6b603b2240f12f4d6877aa2df24565d3641` | Voices, culture, Atlas and authored paths |
| `e23a7652f11c5079dd8aa399a4509306f2d1d174` | Three narrative treatments, visual storyboards and source audit |
| `f6bf9597bc35038958bd6f46bda4075696f75602` | Responsive/accessibility fixes and regression groundwork |

CI history: milestones 1–4 passed; milestone 5's legacy Nineveh locator failure is documented above and resolved in `f6bf959`, whose complete CI passed. The final checkpoint's fresh CI may still be queued/running at the requested stop; that is reported as pending rather than represented as a pass.
