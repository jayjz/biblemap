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
