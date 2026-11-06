# Thomas: The Witness · cinematic verification

5 November 2026. This revision updates existing draft [PR #42](https://github.com/jayjz/biblemap/pull/42) on `feat/thomas-doubt-and-sayings`, targeting `feat/human-story-consolidated`. The starting Thomas implementation was `0d3a85542e7963092a00c72d25a0e03965f617f1`. Artwork/proposals were committed as `bbf7c17`; the verified rendered implementation is **`8f2912543fbd6ec959351c716af642ebd1e24620`**. The final verification commit adds evidence and documentation without changing application behavior.

## Delivered behavior

Movement II now brings anonymous adults into close view, then cuts to Thomas's complete recorded reply. A native checkbox holds the two statements together on desktop and compacts their reading on mobile. Movement III changes distance, atmosphere and light in an invented domestic interior. It depicts no Jesus, appearance, wound or contact. Movement IV removes imagery and gives the confession dominant scale. I and V use different crops of an empty threshold; V opens into daylight and preserves the complete John 20:29. The complete reading route remains independent of the artwork.

The separate `/human-story/thomas/sayings/` exploration adds Coptic-based saying 13 alongside John 20:28, retains saying 26 alongside Luke 6:41–42, and offers four native manuscript witness choices. The explorer explicitly distinguishes the ending of 26 preserved in P.Oxy. 1 from the complete Coptic translation. Saying 13 is not preserved in the three named Greek fragments. The three things spoken aside in 13 are not supplied. No authorship, dependence or historical authentication follows from the comparison.

## Exact verification

Windows, Node 24.22.2, installed Google Chrome with Playwright 1.64. `CHROME_PATH` was set to `C:/Program Files/Google/Chrome/Application/chrome.exe`. Local browser checks use the static export served at `http://127.0.0.1:4189` by `node scripts/serve-export.mjs`. Hosted checks use the exact runtime deployment below. No dependencies or validators were disabled or added to clear failures.

| Check | Result | Retained evidence |
|---|---|---|
| `npm ci` | Exit 0; 554 packages; lockfile unchanged | Existing audit: 38 issues (1 low, 16 moderate, 19 high, 2 critical). No dependency or audit remediation in this revision. |
| `npm run lint` | Exit 0; zero errors, four existing warnings | `artifacts/thomas/cinematic/lint.log`; unchanged `DataLoader.tsx` (3) and `validate-nineveh-depth.mjs` (1). |
| `npx tsc --noEmit` | Exit 0 | `cinematic/typecheck.log`; production build also checks types. |
| `npm run build` | Exit 0; 48 static routes | `cinematic/build.log`; source/media prebuild and post-export boundary checks pass, including 477 exported artifacts and 48 Jonah verses. |
| `BIBLEMAP_VERIFY_EXPORT=1 npm run test` | Exit 0; **59 passed, zero skipped** | `cinematic/unit.log`; actual invocation used PowerShell environment syntax. |
| Offline source and media validation | Pass in ordinary build | Nineteen WEB verse records and both Mattison sayings match retained publisher excerpts; selected media checksums, dimensions, rights and budget are tested. No network in checks. |
| `npx playwright test tests/thomas.spec.ts` | Exit 0; **18 passed**, 23.1 seconds | `cinematic/focused.log`; two configured projects. |
| `npm run test:e2e` | Exit 0; **207 passed, one existing skip**, 5.8 minutes | `cinematic/e2e-full.log`; unchanged ordinary configuration includes James, Jonah and Romanus. The mobile legacy explorer skip exists at the base. Separate experiment-server Nineveh suites remain excluded by that existing configuration. |
| Hosted focused Thomas suite | Exit 0; **18 passed**, 38.2 seconds | `cinematic/hosted.log`; exact preview/commit below, separate browser output directory. |
| `npm run validate:release` | **Exit 1; release remains blocked** | `cinematic/release.log`; existing Jonah human-approval and unfinished-author-slot failures. Gate and Jonah content inputs unchanged. Thomas human review also remains pending. |

At 16:52 UTC, GitHub's runtime workflow had passed install, source validation, unit tests, lint, TypeScript, ordinary static export and opt-in export; its browser stages were still running. The Windows pinned-byte workflow and Vercel preview checks had passed. This observation is not recorded as a full CI pass. Live CI results remain attached to PR #42.

## Visual, accessible and failure-state evidence

Matched before/after captures cover the opening, every movement and manuscript entrance at **1440, 768, 390 and 320**. Actual full-page desktop/mobile compositions, both proposal directions at desktop/mobile and representative interaction states were opened and inspected. These are visual observations, not evidence of emotional impact or reader understanding.

| Evidence | Location |
|---|---|
| Baseline before this revision | `artifacts/thomas/cinematic-before/` |
| All five revised movements and full journeys | `artifacts/thomas/cinematic-after/` |
| Two materially different art proposals, desktop/mobile | `artifacts/thomas/cinematic/studies/` and `proposals.html` |
| Held voices, P.Oxy. 1 sheet, expanded saying 13 at four widths | `artifacts/thomas/cinematic/interactions/` |
| Blocked imagery and enlarged text at 320 | `cinematic/interactions/blocked-enlarged-320.jpg` |
| Hosted room, held voices, Greek witness and expanded saying 13 | `cinematic/hosted/` |

Before/after pairs for each movement (desktop and mobile):

| Movement | Desktop before / after | Mobile before / after |
|---|---|---|
| I · absent | [Before](../artifacts/thomas/cinematic-before/absent-1440.jpg) / [After](../artifacts/thomas/cinematic-after/absent-1440.jpg) | [Before](../artifacts/thomas/cinematic-before/absent-390.jpg) / [After](../artifacts/thomas/cinematic-after/absent-390.jpg) |
| II · testimony | [Before](../artifacts/thomas/cinematic-before/unless-1440.jpg) / [After](../artifacts/thomas/cinematic-after/unless-1440.jpg) | [Before](../artifacts/thomas/cinematic-before/unless-390.jpg) / [After](../artifacts/thomas/cinematic-after/unless-390.jpg) |
| III · eight days | [Before](../artifacts/thomas/cinematic-before/eight-days-1440.jpg) / [After](../artifacts/thomas/cinematic-after/eight-days-1440.jpg) | [Before](../artifacts/thomas/cinematic-before/eight-days-390.jpg) / [After](../artifacts/thomas/cinematic-after/eight-days-390.jpg) |
| IV · confession | [Before](../artifacts/thomas/cinematic-before/confession-1440.jpg) / [After](../artifacts/thomas/cinematic-after/confession-1440.jpg) | [Before](../artifacts/thomas/cinematic-before/confession-390.jpg) / [After](../artifacts/thomas/cinematic-after/confession-390.jpg) |
| V · blessing | [Before](../artifacts/thomas/cinematic-before/not-seen-1440.jpg) / [After](../artifacts/thomas/cinematic-after/not-seen-1440.jpg) | [Before](../artifacts/thomas/cinematic-before/not-seen-390.jpg) / [After](../artifacts/thomas/cinematic-after/not-seen-390.jpg) |

`cinematic-after/observations.json` records no page/console errors, failed requests, HTTP errors or horizontal overflow in the normal capture pass. Interaction measurements preserve document width at the viewport in every tested size; transformed decorative images are clipped within their frames. Intentional aborted images are tested separately as error states.

Focused tests cover native controls with JavaScript disabled, complete no-JS reading, exact complete verses, loading-frame stability, failed imagery, keyboard-visible focus, touch, source disclosures, deep links and browser Back/Forward. Reduced motion disables decorative reframing. Enlarged text with images blocked preserves reading and reflow. Automated axe scans of the encounter and sayings exploration return no violations for the configured WCAG 2/2.1/2.2 A/AA tags; this is not a comprehensive WCAG conformance claim or assistive-technology user test.

## Hosted preview

[Five-movement encounter](https://biblemap-jd29v7pjg-elliotandersons-projects.vercel.app/human-story/thomas/) · [Separate manuscript and sayings exploration](https://biblemap-jd29v7pjg-elliotandersons-projects.vercel.app/human-story/thomas/sayings/).

Vercel deployment `dpl_4G3LqtzdFxMPKftz4Jx3Bz8A3VPW`, project `biblemap`, preview environment (`target: null`), runtime **`8f2912543fbd6ec959351c716af642ebd1e24620`**, READY. Read-only Vercel inspection confirmed branch/SHA and HTTP 200/noindex. The hosted browser suite passed against this artifact. Automatic feature-branch preview deployment was used; no production settings, domains or promotion were changed.

To repeat hosted checks, set `CHROME_PATH` as appropriate, set `PLAYWRIGHT_BASE_URL` to this deployment origin, then run `npx playwright test tests/thomas.spec.ts --output test-results/thomas-cinematic-preview --reporter=list`. To repeat representative hosted captures, run `node scripts/capture-thomas-hosted.mjs` with the same environment; all four resulting images were opened. To repeat the full scene inventory, run `node scripts/capture-thomas.mjs cinematic-review`. Capture scripts wait for image decoding. `node scripts/prepare-thomas-art.mjs` regenerates local WebP derivatives from the retained generated masters; source acquisition is a separate explicit operation.

## Artwork, sources and remaining limits

Four original bitmaps were generated with the built-in image tool; three selected compositions are used in the encounter. Selected desktop/mobile derivatives total **707,894 bytes** across all six files (546,922 desktop; 160,972 mobile). This is an asset inventory, not a measured page-transfer claim. The rejected nocturne remains a study and is not requested by the encounter. [Creative direction](thomas-cinematic-direction.md), [source dossier](research/thomas-source-dossier.md), `artifacts/thomas/cinematic/art-direction.json`, retained masters and `public/media/thomas/manifest.json` preserve the prompts, output/derivative checksums, rights, production-design limits and review status. No archaeological image or manuscript photograph is reproduced.

Anonymous figures are invented, never identified as Thomas, Jesus or recorded eyewitnesses. The Nazareth archaeological reference supplies only general regional material context; it establishes none of these rooms, furnishings, costumes, landscape, lighting or actions. Historical, theological, philological and artistic human approval remains pending. The public-domain translation is checked against the retained translator text, not independently collated against Coptic or Greek. The witness explorer reports selected catalogue ranges rather than reconstructing missing Greek.

The threshold composition is reused at the beginning and end. The historical encounter remains represented through words and anonymous environments; there is no claim of recovered appearance or location. No unfamiliar-reader study, measured emotional outcome, field Web Vitals, physical-device lab or assistive-technology user testing was performed. Those limits remain visible in this draft. Noindex/nofollow, editorial draft status and existing release gates remain active. Initial unrelated untracked home-discovery screenshots and James preview evidence were preserved.
