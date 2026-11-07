# Thomas V4.1 source immersion: verification

7 November 2026. Draft PR for `feat/thomas-v4-source-immersion` → `feat/thomas-v4-human-encounter`. Fetched base: `42a9931e4cc28c5b7965b1b3418e223b98afc54e`. Implementation milestone: `29623eb`. Exact final HEAD, READY preview and hosted test results are recorded in the draft PR after the final evidence push. Human editorial, historical, theological and artistic review remains pending; this is not release authorization.

## UX rationale and visitor flow

The V4 source entrance offered a heading and two disclosures; its opened bibliography treated widely different evidence as similarly weighted records. V4.1 gives the sources a visible narrative structure. The Voices identifies recorded speakers and returns to their passages. The Witnesses contrasts a leaf with a substantially complete collection and leads into the unchanged four-witness investigation. The Traditions identifies Eusebius, Origen's place in his attribution, the anonymous Acts narrative and M. R. James's role as translator. The Questions makes authorship, dates, literary comparison and named scholarly interpretations visible before the bibliography.

Scene-source boundaries are now short, visible asides beside each canonical movement. An opening link permits direct entry into the documentary experience. Ordinary anchors connect the four evidence settings, canonical passages and sayings/manuscripts; Back/Forward and keyboard access work without an app-specific graph. No decorative edge implies literary influence. Eusebius's Parthia and the Acts' India are explicitly separate literary settings, never an authenticated route.

The full bibliography remains complete and last, after art provenance. Source links beside the narrative are shorter than the bibliography records; exact locators, rights and limits remain in that final reference. The simple reader retains the same evidence text without the environment. No new primary quotation, bitmap, dependency or route was added.

## Changed files and preserved behavior

- `src/features/human-story/thomas/ThomasSources.tsx`: four open evidence encounters, bibliography last; stable source/provenance anchors retained.
- `ThomasEvidence.tsx` and `sources.module.css` in that directory: distinct source compositions, native navigation, responsive/simple-reader styles and visible interpretation boundaries.
- `ThomasReferences.tsx`: shared validated source lookups and concise/full citation display; existing `SourceLinks` imports remain supported.
- `ThomasEncounter.tsx`: visible scene references, source entrance link and documentary doorway in place of the old short doorway.
- `ManuscriptForm.tsx`: factors existing SVG into a reusable shape; the four-witness controls, diagrams, captions and testing attributes retain their prior behavior.
- `src/app/human-story/thomas/sayings/page.tsx`: replaces the brief later-names ending with the documentary encounter and preserves its return link. Prior name distinctions remain in the shared witness text.
- `src/content/thomas-evidence.ts`: sourced micro-narratives with stable IDs, explicit relationship categories and draft review boundary. `src/content/thomas.ts`: one additional NASSCAL Acts reference.
- `src/domain/thomas-evidence.test.ts`, `tests/thomas-sources.spec.ts`: source-reference/relationship contract and actual visitor behavior. Existing V4 tests remain unchanged.
- Three Thomas-specific study/capture/review scripts, research/design record, screenshots and logs.

Pinned Scripture, Greek extract, sayings 13/26, media manifest/rights, no-JS reading, source validation, publication projection, authorization records, package files, deployment settings, homepage and all other stories are unchanged. Build-generated release-readiness reports are retained under this task's evidence directory and restored at their original paths before handoff.

## Rendered comparison and manual review

Two materially different proposals were rendered at 1440/390 and opened before implementation: documentary settings versus a continuous reading desk. The selected settings use changing composition/material to distinguish evidence types; the desk remained too close to an annotated article. See [design and source record](thomas-source-immersion.md).

Matched before/after captures use a 1000px-high viewport and reduced motion at **1440, 768, 390, 320**. Before is the verified V4 deployment; after is the built static export. Representative screenshots from every new setting, narrative source aside, manuscript forms, mobile traditions, tablet questions, no-JS reading and 320px enlarged text were opened manually. This is rendering/usability evidence, not proof of visitor comprehension or emotional effect.

| Experience | Desktop before / after | Mobile before / after |
|---|---|---|
| Source entrance and documentary world | [Before](../artifacts/thomas-source-immersion/before/sources-1440.jpg) / [After](../artifacts/thomas-source-immersion/after/sources-1440.jpg) | [Before](../artifacts/thomas-source-immersion/before/sources-390.jpg) / [After](../artifacts/thomas-source-immersion/after/sources-390.jpg) |
| Evidence beside the testimony | [Before](../artifacts/thomas-source-immersion/before/moment-1440.jpg) / [After](../artifacts/thomas-source-immersion/after/moment-1440.jpg) | [Before](../artifacts/thomas-source-immersion/before/moment-390.jpg) / [After](../artifacts/thomas-source-immersion/after/moment-390.jpg) |
| Sayings-route reception | [Before](../artifacts/thomas-source-immersion/before/sayings-traditions-1440.jpg) / [After](../artifacts/thomas-source-immersion/after/sayings-traditions-1440.jpg) | [Before](../artifacts/thomas-source-immersion/before/sayings-traditions-390.jpg) / [After](../artifacts/thomas-source-immersion/after/sayings-traditions-390.jpg) |

Individual settings: [Voices](../artifacts/thomas-source-immersion/after/source-voices-1440.jpg), [Witnesses](../artifacts/thomas-source-immersion/after/source-witnesses-390.jpg), [Traditions](../artifacts/thomas-source-immersion/after/source-traditions-320.jpg), [Questions](../artifacts/thomas-source-immersion/after/source-questions-768.jpg). [No-JS reading](../artifacts/thomas-source-immersion/states/reading-nojs-390.jpg), [enlarged text](../artifacts/thomas-source-immersion/states/traditions-enlarged-320.jpg). Proposal [A desktop](../artifacts/thomas-source-immersion/proposals/a-1440.jpg) / [mobile](../artifacts/thomas-source-immersion/proposals/a-390.jpg); [B desktop](../artifacts/thomas-source-immersion/proposals/b-1440.jpg) / [mobile](../artifacts/thomas-source-immersion/proposals/b-390.jpg).

After-capture observations report no page/console errors, HTTP errors, failed requests or horizontal overflow at all four widths. The enlarged-text review also reports no document overflow. Existing transformed decorative images extend beyond their frames but are clipped; they do not cause document overflow. The initial V4 768px capture recorded one failed threshold request during navigation (its failure reason was not retained by that recorder); no HTTP or reflow failure accompanied it. It is not silently reported as a clean baseline network pass or asserted to be a verified application defect.

## Executed checks and failures

Windows, Node 24.22.2; installed Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Static export served by the repository's existing server. Logs under `artifacts/thomas-source-immersion/` are normalized to UTF-8, with only line endings and trailing whitespace normalized for review.

| Check | Actual result |
|---|---|
| `npm ci` | First sandbox attempt failed `spawn EPERM`; escalated retry exit 0, 551 packages added / 552 audited. Package/lock files unchanged. Existing 22 audit findings (14 moderate, 8 high) and esbuild/unrs-resolver install-script warnings retained in `install-retry.log`. |
| `npm run lint` | Exit 0; four existing warnings in unchanged `DataLoader.tsx` and `validate-nineveh-depth.mjs`. `lint-final.log`. |
| `npx tsc --noEmit` | Exit 0. `types.log`. |
| `BIBLEMAP_VERIFY_EXPORT=1 npm run test` | Exit 0; **64 passed, zero skipped**. Includes source-reference contract and export checks. `unit.log`. PowerShell environment syntax used. |
| `npm run test:export-boundary` | Exit 0; injected private/unselected canaries absent. Source fixtures restored, then ordinary artifact rebuilt. `export-boundary.log`. |
| `npm run build` | Exit 0; pinned Scripture, two sayings, Greek extract, media validation, visitor projection and worker packaging pass. 375 artifacts, 47 index routes, zero unresolved HTML dependencies or loopback-review references. `build-final.log`, task export inventory and worker report. |
| Focused Thomas/source browser suite | Exit 0; **32 passed**, 47.3 seconds. Existing 20 V4 checks plus 12 source checks across the two projects. `focused-final.log`. |
| Four-width captures and enlarged/no-JS visual review | Exit 0; `after/observations.json`, `states/observations.json`. |
| Complete project regression | Exit 0; **235 passed, one existing skip**, 6.9 minutes. `regression.log`. The skip is the pre-existing mobile legacy explorer; no test was newly skipped. |

The first focused run completed **27 passed / 5 failed**: two no-JS style-injection timeouts and three enlarged-text overflow assertions. Trace inspection located the no-JS timeout in Playwright's `addStyleTag` load-event wait, after the reading page loaded. The test now enlarges text through the stylesheet response while keeping JavaScript disabled and retaining the overflow assertion. The real layout defect was two fixed navigation columns at 320px; an auto-fit minimum now falls back to one column. No assertion was removed, test newly skipped or runtime error suppressed. The resulting focused rerun passes all 32 checks. The first trace-inspection command used an unmatched truncated path; the corrected trace path was then read. These are recorded failures, not hidden retries.

The ordinary full suite retains its pre-existing mobile legacy-explorer skip. No separate experimental Nineveh run is added for this Thomas-only UI/content change; no Nineveh/shared runtime code changed, and production Nineveh paths remain covered by the ordinary full regression. No broad security scan, assistive-technology user study, physical-device session or field performance measurement is claimed.

## Historical questions and rights

New bibliography entry: [Jonathan Henry, NASSCAL Acts of Thomas](https://www.nasscal.com/e-clavis-christian-apocrypha/acts-of-thomas/), linked and briefly paraphrased, not reproduced. Rechecked: [Eusebius 3.1](https://www.newadvent.org/fathers/250103.htm), [Acts, James translation](https://www.earlychristianwritings.com/text/actsthomas.html), [DeConick](https://repository.rice.edu/server/api/core/bitstreams/e001a3e4-3823-4050-8030-d7c8befc2f89/content), [Burke](https://www.bibleodyssey.org/articles/when-was-the-gospel-of-thomas-written/). The existing [Thomas claim dossier](research/thomas-source-dossier.md) and [V4 source audit](research/thomas-v4-source-review.md) remain the foundation for John, papyri and Coptic evidence. No new primary quotation or manuscript image is ingested.

The existing [media manifest](../public/media/thomas/manifest.json) is unchanged. The Voices reuses its disclosed generated interior as atmosphere, not a recovered room or portrait. V4's original MIT SVG format diagrams are reused without tracing institutional photography. Existing Greek CC BY 3.0 and public-domain English attributions are preserved in the unchanged manuscript room. NASSCAL and modern scholarship are link-only/brief paraphrase; access does not establish image or text republication rights.

The task-specific [media use record](../artifacts/thomas-source-immersion/media-provenance.json) records the reframe and shape reuse. [Draft PR #48](https://github.com/jayjz/biblemap/pull/48) targets Thomas V4; its description records the exact final pushed SHA, verified preview and hosted results after delivery. Independent GitHub workflow status should be checked before integration; this report claims the executed local checks, not an unobserved CI result.

Review remains needed for the micro-narratives and their emphasis, the distinction between an attributed author and a physical copy, competing composition/dependence theories, the Acts' unresolved formation history, and the juxtaposition of Parthia/India. Neither dates nor a verified itinerary are inferred from that juxtaposition. No unrecorded psychology, gesture, scribe identity or ancient conversation is supplied.

The largest unresolved UX question is whether an unfamiliar visitor can explain **why** each evidence type matters after this encounter. Run an unbriefed walkthrough, especially the transition from John to the separately attributed collection and later traditions. Automated pass counts do not prove that understanding. Creator review of the text/art and a fresh artifact-bound decision remain necessary before publication. No merge or promotion is part of this delivery.
