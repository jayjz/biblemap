# Nineveh four-beat experience

Review-only prototype on `feat/nineveh-four-beat-experience`, based on current main `60ecbda079f5fd29325b68549fe6d01ced74a7fc` (PR #31). No production entrance, reader, atlas, epoch, Exodus or editorial-approval record is replaced.

## Review the experience

```powershell
npm ci
$env:BIBLEMAP_NINEVEH_REVIEW='1'
npm run build
$env:EXPERIMENT_PORT='4197'
node scripts/review-irreplaceable.mjs
```

Open `http://127.0.0.1:4197/experiments/nineveh-four-beat/`. The server binds only to loopback. Stable beats: `#city`, `#mercy`, `#anger`, `#question`. Shareable discoveries: `#mercy/world`, `#anger/voices`, `#question/art`; the complete ending has `#question/ending`. Study alternatives use `?treatment=a`, `b` or `c` before the hash. An ordinary build renders not-found at this experiment; its candidate panorama is never copied to `public/` or `out/`.

The exact feature branch has Vercel automatic deployment disabled in `vercel.json`. A push and draft PR are authorized for review; no merge, hosted preview, deployment or production acceptance is authorized.

## Established repository truth

- Strawman checkout was on `feat/jonah-411-human-city` at `dd9c7756472c89493a6e66441d1319f7621ba07b`, with only untracked `screenshots/`. Those files and that branch were left untouched.
- Fetched `origin`; GitHub main was `60ecbda`, independently checked through the GitHub branch endpoint. Created an isolated worktree at `C:/Dev/biblemap-nineveh-design` from that main, not PR #32.
- PR #32 was an open draft, **Jonah 4:11 — the people within the city**, with a house-sale discovery and Rashi/Radak comparisons inside the thirteen-scene reader. Its body/diff and local implementation/source report were inspected. No cherry-pick, file copy, branch update or edit to that PR occurred.
- Read root, `src/`, `src/content/`, `scripts/` and `public/media/` AGENTS guidance; no nearer instruction file exists in the new feature paths. Inspected the four-beat manifest/environment/discoveries; all thirteen scene definitions; pinned Scripture; media, rights and historical-context catalogs; creative records; experience principles; all three supplied screenshots; CI and actual scripts.
- Reviewed and selectively installed the four requested trusted Agent Workbench skills through the supported system installer after checking both user skill scopes. They had no name conflicts. External frontend guidance was read as source material, not copied/installed into this project. The [research ledger](research/nineveh-four-beat-ledger.md) records sources and boundaries.

## Baseline critique: observed output versus design judgment

Actual main output was captured at 1440×1000, 820×1180, 390×844 and 320×740 before changes. No browser/console errors, failed requests, HTTP errors or horizontal overflow occurred. This is **not** a claim that the baseline is broken or lacks accessibility support.

| Evidence | Verified observation | Design judgment |
| --- | --- | --- |
| Supplied `z1.png`, `z3.png`; new desktop/mobile City captures | Skyline is a small band beneath substantial sky. A three-row discovery block occupies much of the composition. Initial copy identifies the late entry and offers chapter 1. | Place has little material or inhabited scale. Menu and navigation receive more visual weight than the city. The chapter-1 distinction is valuable and must survive. |
| Supplied `z2.png`; new Mercy captures | A small city strip sits above a large text region on mobile. The same three discovery entrances recur. | Scripture is legible, but the city reads as a banner and resources as a standard menu. Their placement communicates little about why this object or interpretation belongs at this verse. |
| Source/CSS inspection and actual Anger/Question output | The original prayer stays together; question is 4:4. The environment persists, with a small viewpoint change. Supporting content opens dialogs. | Continuity exists technically; the visual shifts do not yet carry enough difference in attention. Dialogs are usable, but changing surface can detach evidence from the passage. |
| Actual browser baseline, all four widths | Existing reduced motion, keyboard routes, reader exits and source disclosures work in the inspected flow. | Preserve those capabilities. Aesthetic dissatisfaction is not evidence that the controls are defective. |

The new composition is compared with the supplied z references by the specific problems above. Their untracked originals remain in the Strawman checkout. Committed comparison captures reproduce current main directly, rather than claiming the references' unknown viewport/capture conditions are identical.

## Three materially different treatments

Each study uses the exact WEB Jonah 3:10, the same functional beat sequence, optional discoveries and visible image classification. The studies are rendered pages, not image mockups with invented UI text.

| Criterion | A · Cinematic landscape | B · Illuminated narrative | C · Geographical exhibition |
| --- | --- | --- | --- |
| Artistic mechanism | One broad painted city; wider Mercy, tighter Anger, open final question. | Later marble Jonah faces the text, with a stone/bronze palette; a sculptural form of illumination rather than a fake manuscript. | A schematic local locator makes the Tigris/Nineveh relationship legible; its site opens the existing atlas. |
| Emotional/intellectual aim, not measured outcome | Encounter a place large enough to remain present when concern changes. | Notice how a later artist gave bodily form to shelter and rest. | Distinguish the biblical place, surviving material culture and later interpretation. |
| Historical credibility | Broad geography sourced; visual specificity is invented and disclosed. Strongest risk of mistaken authenticity. | Authentic late Roman–early Christian reception, explicitly dated; does not show Assyrian Nineveh. | Sourced representative point and east/west relationship; illustrative river, no surveyed plan or invented gates. |
| Typography | Large restrained serif Scripture; smaller prayer preserves all four verses; final question given more space. | Same readable verse, warmer material ground, object/text facing arrangement. | Lapis ground and cartographic labels subordinate to Scripture. |
| Four-beat continuity | Strongest single-place continuity. | Persistent artifact provides unity but can make the city disappear and reveal the plant too early. | Strong spatial continuity; weaker narrative tension unless later developed with actual survey data. |
| Mobile | Wide city threshold; smaller persistent city while reading. | Object above reading; caption distinguishes reception. | Local map above text; no WebGL or tile download required. |
| Accessibility | Native links/disclosures; no-JS full reading; still/text controls and reduced motion. | Same semantic reading/discovery flow; object has descriptive alt text. | Same controls; text description and an accessible site link accompany the diagram. |
| Complexity | One 410 kB candidate panorama, CSS transforms, no new engine. | Reuses existing rights-cleared full-frame artwork; no new dependency. | Original SVG locator links to the existing atlas; a research-grade map would require additional dated data. |
| Rights | Original AI-generated candidate; review-only with complete provenance. | CMA 1965.239, CC0; full attribution and source retained. | Pleiades data CC BY 3.0; original diagram, sources and limitations labeled. |

**Provisional selection: A.** It best answers the brief's continuous-world requirement and gives the city more visual scale. This is a design judgment, not a claim of visitor comprehension or historical reconstruction. Preserve B for an artist-led narrative and C for a future research-led exhibition. Reject the first technically rendered Mercy composition: a class collision made its disclosure act as a second environment and cover the city. Renaming that discovery class restored the intended composition. The final captures, not the first captures, are the review evidence.

## Four encounters in one place

1. **The City:** the painted world establishes material scale before interpretation. The opening retains “Beside the Tigris” and “The city remains,” with an immediate chapter-1 path and a clear entrance at 3:10. No arrival, preaching crowd or historical date is asserted.
2. **Mercy:** exact 3:10 commands the reading field. The city remains, without a destruction/repentance animation. The optional exact 3:5–9 passage gives the narrative response. A real clay tablet appears as an object to examine, not as a geographically fabricated find within the painting.
3. **Anger:** a closer crop and narrower reading scale support the turn to the complete 4:1–4 prayer. The change is attention, not historical sunlight or elapsed time. Augustine and Francis appear as explicitly attributed, optional readings beside the text. No new psychological motive is written into the first viewport.
4. **The Question:** 4:4 opens more space around the question. Visitors can then follow the complete 4:5–11 sequence in place or enter the existing reader. The last verse receives its own typographic emphasis and no invented reply. The later sculpture belongs beside the shelter in that continuation; it is optional, not evidence of Assyrian dress or plant species.

Supporting evidence uses inline **object examination** and **facing readings/art**. There is no generic resource dialog, overlay, focus trap or automatic scene progression. Native disclosures retain the Scripture in the same document; each discovery has a return link that focuses the chapter heading. Browser Back/Forward and reload restore the beat and discovery. The ending has its own shareable state. No audio, new framework, animation package or production dependency was added.

## Relationship to PR #32

Keep the homepage experiment and reader project separate. This prototype's optional ending imports only the pinned Scripture already on main. PR #32 remains the potential documentary destination for reader scene `jonah-4-question`; it owns its house sale and Rashi/Radak translation-review questions. A later integration should choose deliberately whether the four-beat ending sends visitors into that reader or contains a short textual bridge. Do not duplicate its unfinished discovery, silently relabel its translations approved, or replace its names with generated inhabitants.

## Browser evidence

| Beat | Before desktop / mobile | After desktop / mobile |
| --- | --- | --- |
| City | [1440](../artifacts/nineveh-four-beat/before-desktop-city.png) / [390](../artifacts/nineveh-four-beat/before-390-city.png) | [1440](../artifacts/nineveh-four-beat/after-desktop-city.png) / [390](../artifacts/nineveh-four-beat/after-390-city.png) |
| Mercy | [1440](../artifacts/nineveh-four-beat/before-desktop-mercy.png) / [390](../artifacts/nineveh-four-beat/before-390-mercy.png) | [1440](../artifacts/nineveh-four-beat/after-desktop-mercy.png) / [390](../artifacts/nineveh-four-beat/after-390-mercy.png) |
| Anger | [1440](../artifacts/nineveh-four-beat/before-desktop-anger.png) / [390](../artifacts/nineveh-four-beat/before-390-anger.png) | [1440](../artifacts/nineveh-four-beat/after-desktop-anger.png) / [390](../artifacts/nineveh-four-beat/after-390-anger.png) |
| Question | [1440](../artifacts/nineveh-four-beat/before-desktop-question.png) / [390](../artifacts/nineveh-four-beat/before-390-question.png) | [1440](../artifacts/nineveh-four-beat/after-desktop-question.png) / [390](../artifacts/nineveh-four-beat/after-390-question.png) |

| Alternative | Desktop | Mobile |
| --- | --- | --- |
| A · Landscape | [Study](../artifacts/nineveh-four-beat/study-a-desktop.png) | [Study](../artifacts/nineveh-four-beat/study-a-390.png) |
| B · Illuminated | [Study](../artifacts/nineveh-four-beat/study-b-desktop.png) | [Study](../artifacts/nineveh-four-beat/study-b-390.png) |
| C · Geography | [Study](../artifacts/nineveh-four-beat/study-c-desktop.png) | [Study](../artifacts/nineveh-four-beat/study-c-390.png) |

Additional 320px/tablet captures and the three open discoveries are in the same artifact directory. The capture script waits for fonts and visible image decoding, records page/console/network/HTTP errors and overflow, and fails on them. The loopback server's **existing** Nineveh route uses the documented CI tablet fixture during automated tests; that fixture is not a historical landscape or creative evidence. The new panorama route uses its own recorded image throughout.

The continuation's final verse is captured at [desktop](../artifacts/nineveh-four-beat/ending-desktop.png) and [390px](../artifacts/nineveh-four-beat/ending-390.png). Open discoveries use viewport captures so fixed/sticky environmental layers are shown at their actual reading position; full-page images of a scrolled fixed background can otherwise misrepresent the composition. Focused heading outlines are verified in tests; resting-state comparison captures click the scene label before capture.

## Verification and review boundaries

The exact sequential runner is `node scripts/verify-four-beat.mjs`. [Machine-readable results](../artifacts/nineveh-four-beat/verification-results.json) contain every command, exit code, timestamp, runtime, environment and result summary. [Previous full attempt](../artifacts/nineveh-four-beat/verification-previous.json) preserves the review-suite failure rather than erasing it. Final results are recorded below after the complete rerun; no push is permitted on a failed/incomplete run.

The first full attempt passed all normal-site checks (69 browser cases, one existing mobile-atlas skip) and reached 30 passing review cases with two failures in the new history test. The ending had become shareable, adding a history entry, while that test still expected one Back to jump straight to Anger. The revised test retains the Anger return check and adds assertions that Back first closes the ending, with reload/URL coverage. No original test, lint rule, release gate or fixture expectation was weakened. Earlier exploratory runs also caught the discovery/environment class collision and a new Link lint error, both fixed before the full sequence.

A second pass added a stricter assertion that returned Scripture is actually in the viewport. It exposed a real return-position defect: scrolling in the click handler happened before React collapsed a long discovery. Restoration now happens after the committed URL/disclosure change. A separate loading/failure test needed an actual reload after releasing its held image; revisiting the same hash did not necessarily create another image request. Both were corrected and the focused desktop/mobile suite rerun before the final full verification. The attempt JSON files preserve these negative results.

### Final complete pre-push run

Every command in the final sequential run exited **0**. Executed on Windows with Node **v25.0.0** and local Google Chrome; CI's pinned Node 22 runtime is a separate hosted check, not inferred from local execution.

| Exact command / relevant environment | Result |
| --- | --- |
| `npm.cmd ci` | 559 packages installed with committed lockfile. 30 inherited advisories: 1 low, 8 moderate, 19 high, 2 critical. No dependency version change. |
| `npm.cmd run validate:story` | All 48 pinned WEB verses/notes match; story draft validates; existing human release boundary retained. |
| `npm.cmd run validate:media` | Existing rights/checksum checks and new candidate panorama provenance pass. |
| `npm.cmd test` | 25 passed, 0 failed, 0 skipped. |
| `npm.cmd run lint` | 0 errors, 4 pre-existing unused-symbol warnings in `DataLoader.tsx` and `validate-nineveh-depth.mjs`; none in the new feature. |
| `npm.cmd run typecheck` (`tsc --noEmit`) | Passed. |
| `npm.cmd run build` (review flags empty) | Ordinary static export passed. |
| `node scripts/validate-nineveh-depth.mjs --production-export` | Existing homepage/media gate passed. |
| `node scripts/validate-four-beat.mjs --production-export` | Prototype markup absent from ordinary route; candidate image absent from export/public. |
| `PLAYWRIGHT_PORT=4198 npm.cmd run test:e2e` | Entire normal suite: 69 passed, 1 existing legacy mobile-atlas skip, 0 failed. Includes PR #31 routing coverage. |
| `BIBLEMAP_NINEVEH_REVIEW=1 npm.cmd run build` | Separate opt-in static build passed. |
| `PLAYWRIGHT_REVIEW_SERVER=1 PLAYWRIGHT_PORT=4198 npm.cmd run test:e2e` | Entire review suite: 32 passed, 0 failed/skipped. Existing 22 checks plus 10 new desktop/mobile cases. |
| `CAPTURE_BASE=http://127.0.0.1:4198 node scripts/capture-four-beat.mjs after` | Final 30 images; zero page/console/network/HTTP errors or horizontal overflow at all four widths. 16 baseline images also retained: 46 total PNG captures. |
| `git diff --check` | Passed. |

Browser tests include exact text, all thirteen reader positions, deep links/invalid state, Back/Forward/reload, heading focus **and viewport return**, native no-JavaScript disclosures, reduced motion, still/text views, held and rejected landscape requests, all three alternatives, 320/390/820/1440 reflow and axe checks. The generated panorama is an original review candidate, not the CI fixture used by the older experiment. Inherited Node module-type and `NO_COLOR`/`FORCE_COLOR` warnings are recorded; no warning suppression was added. Generated `next-env.d.ts` drift is restored to baseline and excluded from the patch. Sensitive-pattern/file screening and final staged diff review are recorded at handoff.

Final staged review: `git diff --cached --stat`, the complete text diff, captured images and `git diff --cached --check` inspected; whitespace exit 0. Staged text paths were enumerated with `git diff --cached --name-only --diff-filter=ACMR` and screened with `rg -l` for AWS access-key, GitHub-token, OpenAI project-key and PEM private-key patterns. No matches (normalized screening exit 0). Filename inspection found no environment file, credential, private key, local report bundle or dependency directory staged. This is a bounded accidental-sensitive-file screen, not a security audit. The original checkout/PR #32 still had only its pre-existing untracked screenshots; remote main and PR #32 refs were rechecked unchanged before push.

## Remaining limits and creator decisions

- The painting is visually convincing but unmeasured; explicit labels cannot guarantee that everyone understands the distinction. Decide whether to commission/stylize a city image before any production discussion.
- The four beats now give more scale and passage-specific discoveries. Whether a stranger experiences recognition, curiosity or lasting reflection remains **unmeasured**. A first-time visitor session should test entrance clarity, interpretation labels, early exits and recall.
- On phones the persistent image reduces reading height; tablet currently uses that same stacked strategy. Choose whether the city should remain pinned, shrink further or leave the viewport during long prayer/ending reading.
- B is a compositional study using a later sculpture, not a completed manuscript treatment. C is a schematic exhibition study, not a research-grade reconstructed city plan. Neither alternative is presented as production-ready.
- The optional ending preserves all intervening verses, but 4:11 remains behind a disclosure. Decide whether its foreground should eventually shift from 4:4 to 4:11; do so jointly with PR #32's reader work.
- Interpretive selection is currently two Christian voices. Decide how Jewish exegesis and other readings should appear without duplicating or bypassing PR #32's language/editorial review.
- Automated axe/keyboard/reflow checks and desktop Chrome mobile emulation do not establish a real-device, assistive-technology or human response result. No human screen-reader session is claimed.
- No editorial wording, generated panorama, theology or historical reconstruction is marked approved. No publication or merge decision is made by this experiment.

Changed areas: one gated page; a small isolated feature with world, reading and discovery components/CSS/provenance; targeted browser tests; capture/verification/media-check scripts; minimal review-server/config additions; this report, source ledger and browser artifacts. Existing app experience files and source catalogs are unchanged.
