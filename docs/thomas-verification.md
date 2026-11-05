# Thomas prototype · verification and delivery

Historical record of the initial prototype. The subsequent cinematic revision, artwork, two comparisons and current verification are recorded in [Thomas cinematic verification](thomas-cinematic-verification.md).

5 November 2026. Requested base: `feat/human-story-consolidated`, fetched at `2c119d9e47e96a91f3b1d4607c36c397464a04e4`. Existing remote branch `feat/thomas-doubt-and-sayings` was tracked and confirmed to descend from it. Runtime implementation commit: `e4510b875a5f825c36358516424590a6f8180148`. The final evidence commit adds documentation and strengthens the offline saying validator; it changes no rendered application behavior.

## Delivered encounter

- `/human-story/thomas/`: five movements in John 20:24–29 order, with all six verses preserved, an optional earlier-Thomas reading and contextual testimony disclosure. The account does not narrate touch; the staging does not invent it.
- `/human-story/thomas/reading/`: the complete same reading without visual staging, including sources and native disclosures.
- `/human-story/thomas/sayings/`: a distinct manuscript doorway and one comparison, Mattison's public-domain Coptic-based saying 26 beside WEB Luke 6:41–42. Physical dates, attribution, composition and dependence remain separate questions.

The routes inherit noindex/nofollow and declare it explicitly. There is no homepage promotion, new production dependency, runtime content service, autoplay sound, scroll interception, avatar of Jesus, simulated contact or belief decision. Main, production configuration, existing release requirements and PR #41 were untouched.

## Exact checks executed

Windows, Node 24.22.2, Playwright 1.64, installed Google Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Browser commands set `CHROME_PATH` to that executable; default matching Playwright Chromium was not installed. Local checks use the real static export at `http://127.0.0.1:4189`, served by `node scripts/serve-export.mjs`.

| Check | Actual result | Evidence / qualification |
|---|---|---|
| `npm ci` | Exit 0; 554 packages installed | Existing lockfile unchanged. Audit reported 38 issues (1 low, 16 moderate, 19 high, 2 critical); no dependency changes or audit remediation attempted in this prototype. |
| `npm run lint` | Exit 0; zero errors, four existing warnings | `artifacts/thomas/lint.log`. Unused identifiers in unchanged `DataLoader.tsx` and `validate-nineveh-depth.mjs`; their base-to-head diff is empty. |
| `npx tsc --noEmit` | Exit 0 | `artifacts/thomas/typecheck.log`. Also checked by the production build. |
| `npm run build` | Exit 0; 48 routes exported | `artifacts/thomas/build.log`; source/media checks in prebuild and visitor boundary in postbuild passed. 476 HTML/RSC/JS/JSON/text artifacts checked; existing 48 Jonah verses preserved. |
| `BIBLEMAP_VERIFY_EXPORT=1 npm run test` (PowerShell environment syntax in actual run) | Exit 0; **57 passed, zero skipped** | `artifacts/thomas/unit-export.log`. The normal run had 56 passes and one opt-in export skip; the opt-in final run exercises it. |
| `node scripts/pin-thomas.mjs --check` | Exit 0 | Nineteen WEB verse records match eight retained normalized publisher chapters; saying 26 matches a retained translator HTML excerpt and rights statement. No network in validation. |
| `npx playwright test tests/thomas.spec.ts` | Exit 0; **14 passed** | Two configured projects. Exact verses, noindex, touch, keyboard focus, anchors, Back/Forward, no-JS reading and comparison, blocked imagery, reduced motion, enlarged text and all requested widths. |
| `npm run test:e2e` | Exit 0; **203 passed, one existing skip**, 5.7 minutes | `artifacts/thomas/e2e-full.log`. All configured ordinary browser tests ran, including James/Jonah/Romanus. The mobile legacy explorer test skips itself because its controls are off-canvas; that exact skip exists at the base. Separate Nineveh experiment-server tests are excluded by the unchanged ordinary configuration. |
| Hosted `npx playwright test tests/thomas.spec.ts --output test-results-thomas-preview --reporter=list` | Exit 0; **14 passed**, 28.1 seconds | `artifacts/thomas/preview-tests.log`. Exact runtime commit and deployment below. |
| `npm run validate:release` | **Exit 1; release remains blocked** | `artifacts/thomas/release.log`. Existing Jonah human-approval and unfinished-author-slot failures. Validator and its Jonah content/domain inputs are unchanged from base. These are not treated as prototype build failures or bypassed. Thomas human review is separately pending. |
| `git diff --check` | Exit 0 | Source snapshots normalize line endings and line-end whitespace while retaining text; original publisher markup and checksums remain auditable. |

Initial sandbox runs that attempted Node/Chrome subprocesses were denied by Windows; the same required checks were rerun with approved escalation. These were environment failures, not counted as successful tests. During refinement a narrowed-union TypeScript error was corrected; the final build/typecheck pass. No validators or test expectations were weakened to clear a failure.

## Visual and interaction evidence

`artifacts/thomas/studies/` contains all three rendered alternatives at 1440 and 390 pixels; all six were opened. The decision and rejected directions are in [the creative record](thomas-creative-direction.md). `artifacts/thomas/baseline/` contains the James V2 benchmark at all four widths. There was no Thomas page at base, so these are not mislabeled Thomas before/after pairs.

`artifacts/thomas/after/` contains the opening, all five movements and comparison at **1440, 768, 390 and 320**. Representative captures across every movement and each width were opened for inspection. `after/observations.json` records no console/page errors, failed requests, HTTP errors or horizontal overflow at any width. `interactions/` preserves opened testimony, Greek-witness limits and 200% text. Its observation file includes SVG paths extending within clipped SVG viewports; actual document width equals the viewport at every size.

Two verified defects were repaired: a literal `&nbsp;` in the translator extraction and an expanded-source grid whose minimum width produced 338px content at a 320px viewport. Before captures remain under `refinement/`; the corrected text and 320px document are in `after/comparison-390.jpg` and `interactions/enlarged-320.jpg`. The narrow-source test now passes in both configured projects. The initial mobile architecture study cropped away its opening; the implemented mobile opening visibly retains it. Movement III was then given a distinct interior rather than repeating the entrance geometry.

Keyboard checks exercise the skip link, visible control outlines, native disclosure activation, focused anchor destinations, direct links and history. Touch activates the testimony disclosure. Automated axe scans on the encounter with an open source disclosure and the sayings comparison with its historical discussion open returned no violations for WCAG 2/2.1/2.2 A/AA tags. This is not a claim of comprehensive WCAG conformance or observed reader understanding.

There are no raster images, remote media loads, asynchronous scene loaders, user-authored records or selected atlas event on these routes. Artwork is original inline SVG/CSS, immediately present in HTML; blocked image requests cannot remove narrative. Native reading and source controls still work without JavaScript. Loading/error/empty atlas states remain covered by existing regressions. Field Web Vitals, assistive-technology user testing and unfamiliar-reader observation were not performed.

## Hosted preview

[Open the five-movement Thomas prototype](https://biblemap-ltlbsy8jl-elliotandersons-projects.vercel.app/human-story/thomas/).

[Open the separate sayings exploration](https://biblemap-ltlbsy8jl-elliotandersons-projects.vercel.app/human-story/thomas/sayings/).

Vercel deployment `dpl_EKU156pQD7SUvPCd713THefYAhD6`, project `biblemap`, preview environment (`target: null`), runtime commit `e4510b875a5f825c36358516424590a6f8180148`. Read-only deployment inspection confirmed branch/SHA and READY state. Both Vercel fetch and unauthenticated Chrome returned HTTP 200 with the Thomas title and noindex. Hosted mobile capture: `artifacts/thomas/preview/opening-390.jpg`; focused hosted tests passed. Automatic feature-branch previews were used; no project settings, protection, domain or production promotion changed.

## Changed systems and remaining review

New route/components/styles under `src/app/human-story/thomas/` and `src/features/human-story/thomas/`; typed source registry and immutable Scripture/translation inputs under `src/content/`; source unit tests and focused browser coverage; ingestion/pinning/capture scripts; research, design and verification documents; actual screenshot evidence. The only shared runtime/build file changed is `package.json`, adding the offline Thomas pin check to existing source validation. The lockfile, James/Jonah/Romanus implementation and production deployment configuration are unchanged. Initial untracked home-discovery screenshots and `test-results-james-v2-preview/` were preserved and excluded from commits. Next.js's generated `next-env.d.ts` edit is restored after verification.

Historical and theological review, human comparison of the translation against Coptic/Greek, creator review of the original spatial art, and unfamiliar-reader comprehension remain pending. The art is modern symbolism, not archaeological evidence. No manuscript photograph is reproduced: Claremont retains copyright, and metadata licenses do not clear institutional image rights. Later travel/death traditions are not harmonized into biography. The prototype makes no claim that it has produced belief, emotional impact, an authenticated portrait, a recovered room or a definitive Gospel-of-Thomas chronology.
