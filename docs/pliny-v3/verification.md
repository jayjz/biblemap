# Pliny V3 · verification record

Review branch `feat/pliny-v3-break-the-form`, base `064a17ac3e7511ccb42323e436b6442f661be2cd`. Source and implementation are a no-index editorial draft. No production approval is claimed.

## Creative and rendered review

Three functioning mechanism studies were rendered in Chrome at 1440×1000 and 390×844, including each opening, control state, turn and ending. Evidence is in `artifacts/pliny-v3/prototypes/`; selection is in `design-decision.md`. Concept raster copy was never treated as historical wording. The selected symbolic ribbon is 44,966 bytes on desktop and 14,730 bytes on mobile; alpha, exact checksums, generation brief and absence of reference assets are recorded in its manifest.

The first implemented reading was reviewed at 1440×1000 and 390×844 on the development server. Three weak moments were revised before freeze:

1. Desktop repeated the carried sentence in both the margin and main reading. The margin now holds it until the reader chooses to bring the letters together; the source comparison then occupies the reading and the margin withdraws. The fragment remains shareable, and no-JS has the inline comparison.
2. Phone controls occupied three header rows. The purely decorative entrance animation and its motion switch were removed; the kept-letter link is compact and the full quotation stays in the reading.
3. The closing source excerpt was a long dependent clause. The prose now states denial, demonstrable worship and prior suspicion explicitly, followed by the shorter exact pardon excerpt. The complete imperial reply remains local, including no search, punishment and rejection of anonymous accusations.

Initial development-origin inspection at 127.0.0.1 could read the server HTML but did not hydrate after Next blocked its development resource origin. Using the server's advertised localhost origin resolved it. No application configuration or production protection was changed.

## Freeze checks and bounded corrections

- Locked dependency installation passed outside the sandbox after its first binary validation was blocked by process permissions. No dependency or lockfile version changed.
- TypeScript passed.
- Lint passed with three pre-existing unused-variable warnings in unchanged `DataLoader.tsx`; one JSX apostrophe in the new composition note was corrected.
- Both focused Pliny source-test files passed. The prebuild source gate now includes the V3 packet and art integrity checks while retaining the WIP checks.
- First focused browser run: 5/8 passed. One enlarged-text case exposed a long quotation word overflowing at 320px/200%; quotation wrapping was corrected. Two disclosure cases clicked an already-open native disclosure shut; tests now inspect its actual state before opening it. Only the affected cases are rerun before the clean build.

The affected browser cases passed on their targeted rerun (4/4 across desktop and mobile). The final comparison anchor includes both separately attributed excerpts; the complete regression also asserts that both quotations fit in the viewport when docked.

## Final static-output validation

| Check | Executed result |
|---|---|
| Static build | Passed: Next 16.4.5, 51 generated pages before existing exclusions, 45 exported index routes |
| Source and media gates | Passed in prebuild; WIP pins retained; V3 quotations, paragraph sources and art checksums included |
| TypeScript | Passed directly and during the final production build |
| Lint | 0 errors; 3 existing warnings in unchanged DataLoader.tsx |
| Domain / actual generated-artifact boundaries | `BIBLEMAP_VERIFY_EXPORT=1 npm test`: 81 passed, 0 failed, 0 skipped |
| Release regressions | `npm run test:release`: 28 passed |
| Export postbuild | 378 artifacts; 291 HTML/RSC/JS/JSON and alternate artifacts inspected; all 48 WEB verses retained; no unresolved local dependencies; MapLibre worker/import bytes validated |
| SEO | 46 classified routes, 0 errors, 8 observations; noindex policy preserved and no sitemap URLs authorized |
| Full serial browser suite | 269 passed, 1 existing mobile legacy-explorer skip, 0 failed; 8.2 minutes; no overlapping suite/build |
| Final visual / performance capture | 1440, 768, 390, 320 and 320 at 200% text; no horizontal overflow, console errors or failed requests |
| Production authorization | Correctly blocked: `release-candidate/manifest.json` absent. No release files, environment rules or Vercel configuration changed |

First compiler attempt failed before export with an internal `undefined.length` exception. One diagnostic rerun used the existing `uncaughtExceptionMonitor` to print an otherwise filtered stack if the exception recurred; it did not catch, suppress or change the exit behavior. That build passed without any cache, infrastructure, dependency or source workaround. The cause of the first failure is not established. The validated export is the successful build, not stale output from the failed attempt.

Build ID: `candidate-aa7eb39cf27884069b97`. Source-content digest: `sha256:aa7eb39cf27884069b97e0f7c54f2ac58363a41937d168511fd3b222c52822fa`. Export digest: `sha256:b236105ebdc7cf9b1f728e4f4fac7ce511aaa7bdb875d20357a8092f81824964`. The final source fingerprint matches the built ID. Machine-readable results and lab samples are in `artifacts/pliny-v3/final/verification.json`.

The starting diff for AGENTS.md, the existing release-readiness inventory and next-env.d.ts was preserved byte for byte. The generated Next type file was restored to its starting contents after building. Untracked skill symlinks remain untouched. No unrelated encounter was rewritten; Perpetua's onward-link identity assertion was updated for the new Pliny title.

## Concept fidelity and final visual judgment

Selected board `prototypes/concept-carry.webp` and final built opening, docked comparison, phone ending and 200% capture were opened with view_image in the same review. The 1536×1024 board is a composite of several viewports, not a literal browser screenshot; meaningful native comparisons are the rendered 1440×1000 and 390×844 studies and final states.

| Comparison | Final evidence and intentional adaptation |
|---|---|
| Copy | Final authored prose and exact source packets replace all invented first-person raster-study text. No source-like mockup prose shipped |
| Palette | True white, cobalt #183ac2, blue-grey reading ink, pale-blue provincial field and restrained coral source rule retained |
| Typography | Georgia reading/display, local Geist controls, 20–22px base reading and rem-based enlargement; no new font dependency |
| Composition | Continuous prose and reserved marginal quotation; no numbered movement rail, fixed stage, permanent split panel or automatic ending handoff |
| Interaction | Keep → carry → native fragment docking → put down → focus returns to Sources without scrolling away. Both source wordings and locators remain distinct |
| Artwork | Selected generated blue ribbon exported as real transparent local WebP, 44,966 / 14,730 bytes; no added tint, historical portrait or reconstructed place |
| Mobile | One compact kept-letter link; no quotation overlay; the source pair is recomposed inline. 320px and genuine 200% text reflow verified |
| Motion | Deliberate final cut: no application animation, shader, requestAnimationFrame loop or motion switch is needed |

Above-fold copy matches the final allowed inventory, with the documented omission of the unused raster-study kicker and Reading tab. The implemented composition is faithful to the selected carrying grammar and its recorded revisions; it is not represented as a pixel copy of provisional generated prose. No remaining clipping, overflow, broken control or unresolved asset mismatch was found in the reviewed states.

## Performance and limits

Three fresh-context local mobile samples, same Chrome and 390×844/reduced-motion setup: mean first contentful paint 85→107ms; total measured main-thread task time 99→125ms; initial transfer 1,479,260→1,491,095 bytes (+11,835 bytes, about 0.8%). These show a small local increase, not a speed improvement. They are lab observations, not field Web Vitals, interaction latency or a guarantee on visitors' devices. The design adds no frame loop or production dependency.

Reader comprehension and emotional effect remain untested. Human literary/historical review remains pending; the preview does not supply publication approval. Exact commit and working preview will be recorded in the draft PR and delivery response rather than adding a self-referential commit hash to this document.
