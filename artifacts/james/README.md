# James — implementation and visual verification

Verified 5 November 2026. Runtime under review: `57f30dcca3a3cd7bc2d6b583f21f34383337d6cd`, based on discovery branch `e92b476729303cf00cf71f409c9cc64841ddf447`. The following evidence commit changes only review artifacts. [Draft PR #39](https://github.com/jayjz/biblemap/pull/39) targets `feat/home-story-discovery`.

## Delivered

- `/human-story/james/`: five complete movements, continuous reading, symbolic palimpsest, in-place comparison of Mark / Paul / Acts / Josephus / later memory, native source disclosures and onward reading.
- `/human-story/james/reading/`: all narrative and source comparisons as a simple static reading.
- Human Story directory and Saints / Witnesses / Stories collections expose the James entry; graph connections lead to the existing Paul and Josephus readings. Existing story interiors were not edited.
- New code lives in `src/features/human-story/james/`, with sourced copy in `src/content/james.ts`. The existing dynamic Human Story route generates James statically. Three retained publisher snapshots, extraction checks and unit tests pin the Scripture snippets. No production dependencies were added.
- The local static server now uses Node, already required by the project, because neither `python` nor an installed interpreter behind `py` is available here. It binds only to loopback and serves `out/`; preview and Playwright use the same server.

## Executed checks

| Check | Result |
|---|---|
| `npm ci` | Passed in the initial implementation session. Existing dependency graph retained; installer audit reported 38 advisories. No dependency remediation attempted in this story change. |
| `npm run lint` | Exit 0; four existing unused-variable warnings in `scripts/validate-nineveh-depth.mjs` and `src/components/DataLoader.tsx`. No new warnings. |
| `npm run typecheck` (`tsc --noEmit`) | Exit 0. |
| `npm test` | 51 passed, 1 existing opt-in skip, 0 failed. The skipped generated-export test invokes the same boundary validator run unconditionally by the build below. |
| `npm run validate:story` | Exit 0. All 48 Jonah verses and three James quotation snapshots match; story and media validation passed. |
| `npm run build` | Exit 0, static export generated both James routes. Postbuild checked 443 exported HTML/RSC/JS/JSON/text artifacts and retained the existing editorial boundary. |
| Focused James browser checks | Initial 8 checks passed; final 10 checks (including tablet pointer regression) passed inside the full suite and against the remote preview. |
| Full `npm run test:e2e -- --reporter=line,json` | **185 passed, 1 skipped, 0 failed, 0 flaky**, 227.8 seconds. Existing skipped test is the mobile legacy Atlas baseline (`tests/explorer.spec.ts:3`); its controls are documented as off-canvas. Desktop Atlas and other mobile navigation checks ran. [Complete result](full-browser-results.json). |
| Preview James browser checks | **10 passed, 0 skipped, 0 failed**, 12.7 seconds. [Complete result](preview-browser-results.json). |
| `node scripts/capture-james.mjs` | Exit 0. Four viewport widths, no console errors, failed requests, HTTP errors or horizontal overflow recorded. [Observations](browser-observations.json). |
| `git diff --check` | Exit 0. |

The full suite used `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4193` against the ordinary static export. The optional local Nineveh art-review server suite is a separate configured mode and was not rerun. No gates or tests were disabled.

The preview was automatically created by the Git push, not manually promoted: [tested preview encounter](https://biblemap-prwl0omgy-elliotandersons-projects.vercel.app/human-story/james/). Vercel reported READY for deployment `dpl_AV2dcvqE5YbBhWdhKj6P8WjATNK4` at runtime commit `57f30dc`; the remote James suite exercised its actual routes. The final evidence-only commit may generate another preview with identical application code. No production settings or aliases were changed.

## Screenshots inspected

All final captures use Chromium, a 1000px viewport height, reduced motion and locally served production-export fonts. Each story capture waits for the selected movement to agree with the source surface. Baseline images show the original Saints collection at the verified live discovery baseline; the James route did not exist there.

| State | 1440px | 768px | 390px | 320px |
|---|---|---|---|---|
| Opening | [View](opening-1440.png) | [View](opening-768.png) | [View](opening-390.png) | [View](opening-320.png) |
| The brother | [View](brother-1440.png) | [View](brother-768.png) | [View](brother-390.png) | [View](brother-320.png) |
| Jerusalem / Acts comparison | [View](witnesses-1440.png) | [View](witnesses-768.png) | [View](witnesses-390.png) | [View](witnesses-320.png) |
| What remained | [View](ending-1440.png) | [View](ending-768.png) | [View](ending-390.png) | [View](ending-320.png) |
| The appearance | [View](appearance-1440.png) | — | [View](appearance-390.png) | — |
| The record | [View](record-1440.png) | — | [View](record-390.png) | — |
| Baseline Saints | [View](before-saints-1440.png) | — | [View](before-saints-390.png) | — |

Observed and corrected: comparison artwork was too tall on mobile because a broad stage selector overrode dialog sizing; 200% text overflowed the narrow header; initial fragment navigation could precede the hydration listener. Dialog and stage styles are now isolated, text wraps, and the fragment is initialized after hydration. The comparison reads the visible movement when opened and does not accept background observer updates while open.

A separate capture problem was diagnosed: Chromium's protocol `scrollIntoView` can recenter an already visible sticky control. Real pointer input did **not** move the page. The capture now uses a visible control's measured pointer coordinates and asserts that opening/closing preserves scroll position. The tablet regression exercises the same real pointer behavior; keyboard focus restoration is tested separately.

## Accessibility, fallbacks and limits

Exercised: keyboard entry and movement anchors, native dialog focus containment and Escape, focus restoration, pointer comparison, missing-witness states, all five witness selections, no-JS reading at 320px, reduced-motion cuts, 200% text, image-blocked reading, local source and collection links, and desktop/mobile axe WCAG 2/2.1/2.2 AA scans. James uses inline symbolic art and no asynchronous historical data or audio; the complete reading is server-rendered. Silence or unavailable imagery cannot remove testimony. No automated axe violations were found in the tested reading and dialog states; this is not a full accessibility-conformance claim.

The screenshots establish legibility and inspected composition, not emotional impact. No unfamiliar-reader study was performed. **Strongest criticism:** the document field communicates evidence relationships more strongly than it conveys Jerusalem as a physical human setting. It remains an abstract encounter, especially on mobile.

Historical uncertainties remain explicit: the precise family relationship; identifying the James of 1 Corinthians 15:7; the unrecorded appearance setting and words; how Acts aligns with Galatians; the inferred death date; Josephus's transmission/authenticity dispute; and the historical value of Hegesippus's expanded martyrdom tradition. [Source dossier](../../docs/research/james-source-dossier.md) and [three-direction comparison](../../docs/james-creative-direction.md).

All narrative, theological, historical and artistic creator review remains outstanding. The artwork is disclosed original AI-assisted SVG/CSS geometry and typography, not an artifact, likeness or archaeological reconstruction. No self-awarded approval, production promotion, merge or editorial-gate change occurred.
