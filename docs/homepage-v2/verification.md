# Homepage V2 verification

Scope: `feat/homepage-living-archive`, based on Pliny V4 `ae4dc1c8f5b3d585ecaa75832cf0e735a150ada9`; draft PR targets `feat/pliny-v4-documentary`. No encounter source file, publication authorization, production configuration, deep-link parser or SEO policy changed. Exact final commit and immutable Vercel preview are recorded in the draft PR to avoid a self-referential commit identifier in this document.

The flow under test is: ordinary root or `/human-story/` → manifest-selected encounter → reading and sources → return/discovery. Legacy root URLs retain their existing Nineveh/Atlas flows. Static data replaces any need for a content API. Client behavior is limited to existing root routing/discovery plus image status.

| Check | Executed result |
| --- | --- |
| `npm ci` | Passed; lockfile unchanged. Install reports existing dependency audit findings (13 moderate, 8 high); no dependency changes made. |
| `npx tsc --noEmit` | Passed. |
| `npm run lint` | Passed with zero errors; three existing unused-symbol warnings in `src/components/DataLoader.tsx`. |
| `npm test` | 85 passed, one existing skipped export-boundary test; 86 total. Includes four new curation/publication/route cases. |
| `npm run test:release` | All 28 publication/release regressions passed. |
| `node --experimental-strip-types scripts/homepage-inventory.mjs --check` | Passed: 27 destinations, 46 scoped routes. |
| Focused homepage browser run | 74 passed initially; two Thomas enlarged-text cases exposed clipped hidden accessibility text. Replaced it with the same accessible name on the source link; both affected cases then passed. No assertion weakened. |
| Static build, story/media validators, export integrity | Passed. 385 artifacts, 45 index routes, zero unresolved HTML dependencies. The 404 representation is not a new experience. All pinned Scripture, visitor-boundary, local-media and MapLibre checks passed. |
| SEO audit | 46 classified routes, zero sitemap URLs, zero errors; eight inherited Jonah image-dimension observations. Canonical aliases and no-index policy retained. |
| Internal homepage navigation | All 30 distinct hydrated homepage local links and fragments resolve to actual routes/anchors. All selected entrances also exercised without JavaScript; every eligible reading remains in the no-JS HTML. |
| Complete browser regression | 277 passed, one existing mobile legacy-explorer skip, zero failures (6.9 minutes). One serial worker, desktop and mobile; no concurrent build or browser suite. |
| Hosted preview | Exact SHA, non-production target, READY state and desktop/mobile smoke result recorded in the draft PR. This is a provider rebuild, not a claim of byte-identical canonical release output. |

Local static build identity: `candidate-352183443b16ef6ca376`; content digest `sha256:352183443b16ef6ca376aca5a738940f6482d201774e6db378c6410bc7355da2`. The source-tree fingerprint was rechecked against the finished runtime/test/script files. Documentation and screenshot artifacts are outside that fingerprint. This is a review build, not canonical production acceptance.

An initial sandboxed Next build received empty TypeScript `--showConfig` subprocess output; direct configuration parsing succeeded, and the same build succeeded outside the sandbox. Some subprocess-based domain/release files similarly produced file-only failures in the sandbox; their full runs passed outside it. No source, configuration, assertion, security gate or compiler switch was changed to accommodate that environment. Development HMR rejected a `127.0.0.1` origin; final functional and visual checks used the static export, with no HMR or runtime errors. These failures are not counted as passes.

## Rendered review

Google Chrome, Playwright, Linux; Browser plugin unavailable. The three actual prototype compositions were inspected at 1440×1000 and 390×844. Final static rendering was inspected at **1440, 768, 390 and 320px**, and at **200% text** at each width. All had HTTP 200, correct title/H1, no horizontal overflow, page exceptions, console errors or failed requests. Desktop/mobile first screens and full pages are in [the final screenshots](../../artifacts/homepage-v2/final/); [visual-results.json](../../artifacts/homepage-v2/visual-results.json) records all widths.

Keyboard checks exercised skip-to-main, selected entry actions, source disclosures, the encounters anchor, search clearing, connection selection/focus/return and deep-link navigation. Native disclosures work without JavaScript. Reduced motion produces no running homepage animations. Delayed manuscript loading retains its dimensions. Failed Pliny, Perpetua, Jonah and Thomas imagery preserves source access and navigation. The explorer's empty and selected-connection states were exercised. Automated WCAG A/AA checks pass for the exercised homepage/Thomas surfaces; this is not a complete accessibility conformance claim.

[design.md](design.md) records the selected concept and a six-point fidelity ledger. `view_image` comparison covered accepted A and final desktop/mobile render: wording, hierarchy, type scale, palette, full-object media treatment, supporting spread, navigation, responsive order and discovery. The three weakest prototype moments were corrected before final verification. Narrow phones still require more vertical reading than the desktop; enlarged-text layouts prioritize complete readable content over keeping entry actions within one viewport.

## Evidence contract

| Claim | State | Inspected evidence and limits |
| --- | --- | --- |
| Pliny hero reaches V4 | SUPPORTED | Remote PR #57/head SHA, route source, unchanged V4 encounter diff, browser entry showing `pliny-manuscript`. Component retains its historical V3 name. |
| Selection is centralized and merges cannot promote a story | SUPPORTED | Typed manifest, pure selector and tests varying maturity/new registration. No second featured-ranking array. |
| Every eligible experience remains discoverable | SUPPORTED | Generated 27-entry inventory; full-catalog/no-JS browser checks; standalone Thomas/Lachish route registration. Aliases and reading versions are not separate stories. |
| Publication and historical boundaries remain independent | SUPPORTED | No diff in scope/decisions/encounters; release regressions; inherited no-index and creator acceptance gate. No new graph relationship; thread reuses existing classified comparison. |
| Assets have traceable reuse evidence | SUPPORTED | Existing local manifests/registries, media validation and visible provenance; bounded to those records, not a new legal opinion. |
| A is the strongest editorial composition | INFERRED | Comparison of six rendered prototypes and the explicit criteria in design.md. Aesthetic judgment, not measured reader preference. |
| Visitors understand the source distinctions or feel engaged | UNRESOLVED | No unbriefed reader observation was conducted. Next check: creator review and short first-visit comprehension sessions. Technical success cannot establish this. |

No production merge, release, promotion or generic visual approval is supplied. Human literary, historical, theological and artistic review of the editorial invitations remains outstanding. Existing provisional/unfinished catalog limitations remain visible in their encounters and recorded in inventory. Unrelated starting changes and four untracked skill links are preserved byte-for-byte and excluded from the commit.
