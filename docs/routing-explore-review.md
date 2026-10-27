# Routing and navigation review

2026-10-27 · Base `1085225879f9a4ffe83d16144219595a50208e9f` · Branch `feat/root-routing-explore-20261027`

## Result

Tracking URLs now retain the Nineveh homepage. Supported old atlas URLs still open the existing atlas. New navigation uses `/explore/`. Exodus data, epoch definitions, journey behavior, Scripture, source catalogs, artwork and license records are unchanged.

| URL | Experience |
| --- | --- |
| `/`, `/?utm_source=chatgpt.com`, `/?gclid=abc&unknown=1` | Nineveh homepage |
| `/?utm_source=chatgpt.com#anger/art` | Nineveh art discovery |
| `/#main-content`, `/#nineveh-heading`, unknown fragments | Homepage, never an accidental atlas request |
| `/?explore=1`, `/?event=0`, `/?place=nineveh&from=jonah-3-mercy` | Compatible atlas entry |
| `/?lat=32&lng=35&zoom=6` | Compatible camera entry |
| `/#exodus&book=EXO` and manifest epoch fragments | Compatible epoch/book entry |
| `/explore/` | Canonical WebGL atlas and epoch controls |

Nonempty event selectors are passed to the existing atlas resolver; unknown event names do not establish a valid event. Known story places are Joppa and Nineveh. Camera intent requires all three finite values within latitude, longitude and zoom bounds. The old `#creation` alias is retained alongside manifest hashes. Routing classification does not change existing camera or event resolution.

## Changed files

- `src/domain/atlas-routing.ts` and its unit tests: pure, manifest-based compatibility classifier.
- `src/app/NinevehHome.tsx`: replace the broad search/hash predicate.
- `src/features/nineveh/NinevehEncounter.tsx` and `nineveh.css`: visible epoch entrance and wrapping header at narrow sizes.
- `src/app/explore/page.tsx` and `explore.css`: accessible home/reader navigation outside the map's loading/error boundary; preserve existing Suspense and dynamic WebGL loading.
- `src/features/story/StoryReader.tsx`: canonical atlas exits.
- `src/components/DataLoader.tsx`: accessible name and expanded/controls state for the mobile menu only.
- `tests/routing.spec.ts`: tracking, discovery, initial keyboard navigation, canonical round trip, history/reload and legacy links on desktop/mobile.
- `tests/jonah.spec.ts`: update the expected reader exit destination.

## Verification

- Reproduced the UTM bug on unchanged main with the new browser test; captured `before-utm-desktop.png` before the fix.
- `npm ci`: completed using the committed lockfile. npm reported 30 existing dependency advisories (1 low, 8 moderate, 19 high, 2 critical); no dependency upgrades are included in this routing change.
- `npm test`: **25 passed**.
- `npm run lint`: **0 errors**, 4 existing unused-symbol warnings in DataLoader and the Nineveh validator.
- `npx tsc --noEmit`: passed.
- Ordinary and opt-in `npm run build`: passed, including pinned Scripture, story, media and 2,917-row epoch checks.
- Ordinary production-export gate: passed before enabling the review build. The validator correctly rejects the opt-in review build when asked to treat it as an ordinary export; the final output is rebuilt in ordinary mode and checked again.
- Full exported browser suite: **69 passed, 1 existing legacy mobile-atlas skip**. The new routing tests pass on both projects. The desktop baseline exercises Exodus epoch selection, reload, Exodus journey scenes, event selection and an empty search result.
- Separate opt-in review server browser suite: **22 passed**. Used the exact documented CI-only Flood Tablet fixture in the otherwise absent local landscape path. This verifies interactions, not landscape aesthetics or editorial approval; the fixture is not published or committed.
- Supplemental live-provider screenshots at desktop, 393px and 320px: inspected. `live-diagnostics.json` recorded **no page errors, console errors, failed requests or HTTP error responses** during those captures. Deterministic regression screenshots use a local empty basemap style; supplemental screenshots use the actual provider.
- Source JSON and the checksum manifest were restored to exact committed bytes after Windows line-ending conversion in the fresh checkout. There is no diff to these files. Existing checkouts and synced project sources were not edited.

Tests ran locally on Windows with Node 25.0.0 and installed Chrome. Hosted CI uses Ubuntu/Node 22.22.3; local results are not evidence of a GitHub Actions run. The workflow also has a separate manually dispatched editorial release approval; passing technical checks does not approve unfinished narrative or theological material.

## Screenshot evidence

See `artifacts/routing-review/`: before UTM failure, corrected desktop homepage, 320px homepage, desktop Exodus atlas, mobile atlas and mobile reader. `capture.mjs` reproduces supplemental captures from a local static server at port 4189. Source and reproduction rights remain attached to the original displayed material.

## Remaining design findings

The supplied Nineveh screenshot and current mobile captures show the decorative city/place label behind or near reading/discovery content. The atlas timeline competes with map attribution near the bottom of a small screen. These need a bounded responsive-composition review; this change does not claim to redesign or fully validate every legacy atlas control on mobile. The pre-existing broad mobile atlas test skip remains explicit; new tests do exercise mobile entry, menu opening/closing, return navigation and legacy URLs.

The atlas still presents its existing Ussher chronology and legacy event-link resolution. Its date model should be explained more clearly in a future sourced editorial/UI pass. No chronology or historical certainty is changed here.

Recommended next creative step: review the Nineveh late-story entrance alongside the Jonah 1:1 entrance with a few first-time visitors before settling the long-term homepage direction. The supplied screenshot is evidence of current composition, not creator approval of a permanent design.

## Publication boundary

No merge or deployment is authorized. `vercel.json` disables Git deployments for this exact feature branch, following [Vercel's git.deploymentEnabled documentation](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled). Other branches retain their default behavior. This permits a review branch and draft PR to run GitHub CI without automatically deploying this work. Hosted results are recorded in the PR checks; local results above remain distinguished from hosted execution.

Research links and the bounded implementation plan are in `routing-explore-plan.md`.
