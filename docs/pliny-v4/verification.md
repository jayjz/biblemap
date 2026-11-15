# Pliny V4 · verification and visual review

Scope: the Pliny encounter at `/human-story/pliny/`, based on V3 commit `82d5bc4308114dcc1ba8dbff71be4a0e08d8551e`. A scoped frontend review, not a repository security audit or production acceptance. Browser plugin/skill unavailable; real Chrome through the installed Playwright was used.

## What changed

- `PlinyV3Encounter.tsx`: keeps the existing V3 narrative and exact excerpts, adds the manuscript entrance, correspondence composition, object placements, visible record chain and absence register. Existing route/component names remain to keep routing stable; the rendered version is 4.
- `PlinyArtifact.tsx`: server-rendered local responsive images, persistent captions, image enlargement links and native source/rights disclosures.
- `pliny-v3.module.css`: the selected oxide-red / ivory / bronze-green visual language, letter surfaces, marginal source objects and responsive recomposition. The kept sentence retains its small existing client boundary.
- `PlinyReader.tsx`: rendered version marker only; keep, compare, release and focus behavior remain intact.
- `public/media/pliny-v4/`: three rights-verified source images, six bounded derivatives and an auditable manifest. V3 symbolic imagery remains recoverable in the repository but does not render in V4.
- `pliny-v4.test.ts` and `tests/pliny.spec.ts`: image provenance/checksums and historical limits; responsive local images, native source access and preserved reader behavior.
- `docs/pliny-v4/`: design comparison, skill report, source dossier, record evidence and this review.

No changes to the V3 prose, quotation packets, Scripture, other encounters, dependency versions, publication selection, authorization gates, SEO rules, Vercel settings or production configuration.

## Rendered flow and three weakest moments

Flow inspected: entrance → household letter → keep the sentence → provincial correspondence → investigation → gathering → women / compare → release → imperial reply → full local letters and sources → historical witnesses / Atlas links. Source and artwork links were checked; image enlargement and browser Back returned to the encounter.

Matched 1440px and 390px baseline screenshots were taken before implementation. Final static-output captures were inspected at 1440×1000, 768×1000, 390×844, 320×844, and 320px with 200% text. The final composition was compared with the selected written composition contract and with the V3 baseline; there was no generated raster mockup or invented reference copy.

| Weak point found in the first rendered pass | Correction and observed result |
| --- | --- |
| The diploma disappeared when the marginal layout collapsed | Repositioned it after the correspondence in DOM order and kept it visible at narrow widths. Local image decoding, visible caption and provenance verified at 1440, 390 and 320px |
| The absence register preceded the two-women report on phones | Moved it after the quoted report and its existing explanation in reading order; desktop retains the lateral juxtaposition |
| Letter references in the entrance looked like inert catalog labels | Made the three references real, named native fragment links. The begin link focuses the household section; keep/compare/release still restores the expected focus |

Final validation additionally found and corrected a source-note contrast shortfall (4.45:1 before correction) and the unbroken word “correspondent” overflowing its heading at 320px with 200% text. No checks were disabled or expectations weakened. A type guard fixed the new browser test’s initial DOM element typing error.

Final normal captures: no horizontal overflow, page errors, console errors or failed requests in the Pliny route at the four widths. Open artwork disclosures also reflowed without overflow, including at 200% text. All displayed images retained complete object / plate edges and meaningful caption distinctions. No audio or motion was required.

No-JS and intentionally blocked-image cases retain all existing narrative paragraphs, the earlier/later quotation pair, complete local letters and source access. Image failures are deliberate in that test, not claimed as clean network requests. Pliny is a static reading route with no data-loading, empty-result or selected-event state; shared Atlas behavior is covered by the full repository browser suite.

## Executed checks

| Check | Result |
| --- | --- |
| `npm ci` | Completed from unchanged lockfile; initial sandbox esbuild spawn restriction resolved by running outside the sandbox. npm reported 21 dependency advisories (13 moderate, 8 high); dependencies were not modified by this frontend task |
| `npm run lint` | 0 errors; the same 3 existing unused-symbol warnings in unchanged `DataLoader.tsx` |
| `npm run typecheck` | Passed after the new test’s image type guard; final Next build also passed TypeScript |
| Focused Pliny domain tests | Passed, including exact quotation/source coverage and the new rights/derivative checks |
| `BIBLEMAP_VERIFY_EXPORT=1 npm test` | 82 passed, 0 failed, 0 skipped. Sandbox-only subprocess failures were resolved by executing the same checks outside the sandbox |
| `npm run test:release` | 28 passed, 0 failed |
| Focused Pliny browser scenarios | Keep/compare/release and axe; 320/390/768/1440 reflow, 200% text and reduced motion; no-JS / failed images; legacy fragments / no-index; artifact sources / responsive files all exercised. Targeted corrections were retested |
| Static build and mandatory pre/postbuild gates | Passed. 51 pages generated before existing exclusions; 45 exported index routes, 385 artifacts; 292 text artifacts inspected, all 48 WEB verses retained; 0 missing local dependencies; MapLibre worker/import bytes validated |
| Final generated-artifact boundary check | Passed against the final heading-fix build, without repeating the unchanged domain suite |
| SEO HTTP / no-JS audit | 46 classified routes; 0 errors; 8 existing Jonah image-dimension observations; 0 authorized sitemap URLs. Pliny remains no-index |
| One full serial browser suite | 271 passed, 1 existing mobile legacy-explorer skip, 0 failed; 7.7 minutes |
| Production authorization | Correctly blocked: canonical `release-candidate/manifest.json` absent. Preview work does not change this gate |
| Diff inspection | Focused task changes only; V3 content packets unchanged. Starting unrelated AGENTS, export inventory, Next type-file and untracked skill changes are preserved |

The full browser suite ran once after feature freeze. There were no full-suite runs during visual iteration. The first static build was invalidated by the test type correction; subsequent builds incorporated the specific contrast and enlarged-text fixes. They were sequential, with no overlapping builds or full browser suites. Unchanged lint and domain checks were not repeatedly run during design iteration. The source-mutating `test:export-boundary` fixture was not run; mandatory postbuild, actual-export domain and release regression checks covered the unchanged export boundary without another adversarial rebuild.

Final build ID: `candidate-8202714cd442513f02b5`. Source digest: `sha256:8202714cd442513f02b5a5e04a9dab6cf0714bd6085428b457ef799b601705e1`. Export digest: `sha256:ff4d74177bf7a9b99d44b5962be288081224497271f4591e299f762b609fc94d`. The source fingerprint matches the built ID.

## Limits and assumptions

The selected objects provide context; neither is evidence of these proceedings. The later manuscript is a witness to other letters in the collection. Newly added captions and record labels are sourced drafts pending human historical/editorial review. The existing no-index and publication gates remain authoritative.

The largest artistic uncertainty is whether the visible source surfaces deepen the encounter for an unfamiliar reader; no unbriefed reader study was performed. Browser success does not establish emotional effect, literary approval, universal accessibility conformance, or field performance. No field Web Vitals claim is made. The household world remains principally conveyed through the letter, without inventing a surviving object belonging to Pliny’s household.

Temporary captures and raw command logs are under `/tmp/pliny-v4/` in the working session; they are not production assets or additional source files. Exact commit and working preview links are in the draft PR and handoff.
