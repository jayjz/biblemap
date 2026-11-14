# Historical voices · V2 working record

Research and implementation for [#53](https://github.com/jayjz/biblemap/issues/53). Base: `eb7e1d49ae99026bfc7ea8213279270007f5ab70`, verified as remote main on 2026-11-14. Branch: `feat/historical-voices-immersion`. Sourced editorial preview; no production publication approval is implied.

## Skill-use matrix

Inventory inspected at repository, parent, user and Codex system locations. No parent skill directory or parent AGENTS.md was found. The four pre-existing repository skill symlinks are preserved and excluded from this change. Paths below are actual files, resolving symlinks where applicable.

| Skill | Verified SKILL.md path | Deliverable governed |
| --- | --- | --- |
| biblemap-creative-direction | `/home/strawman3/Dev/biblemap/.agents/skills/biblemap-creative-direction/SKILL.md` | Narrative spine, alternative media treatments, causal continuity |
| biblemap-discovery | `/home/strawman3/Dev/biblemap/.agents/skills/biblemap-discovery/SKILL.md` | Source selection by visitor discovery; encounter/discover/explore hierarchy |
| biblemap-visual-review | `/home/strawman3/Dev/biblemap/.agents/skills/biblemap-visual-review/SKILL.md` | Actual route audit, matched before/after review, weakest-moment revision |
| story-forge | `/home/strawman3/.agents/skills/story-forge/SKILL.md` | Stakes, source voice continuity and information pacing; no invented dialogue or psychology |
| frontend-app-builder | `/home/strawman3/.agents/skills/frontend-app-builder/SKILL.md` | Visual treatment, scoped component architecture and browser comparison |
| react-best-practices | `/home/strawman3/.agents/skills/react-best-practices/SKILL.md` | Static rendering, minimal client boundary, no runtime retrieval |
| frontend-testing-debugging | `/home/strawman3/.agents/skills/frontend-testing-debugging/SKILL.md` | Playwright interaction loop; Browser plugin/skill absent in this session |
| source-integrity-audit | `/home/strawman3/Dev/agent-workbench/skills/source-integrity-audit/SKILL.md` | Editions, exact locators, independent evidence lineages, rejected candidates |
| evidence-contract | `/home/strawman3/Dev/agent-workbench/skills/evidence-contract/SKILL.md` | Claim-to-source and requirement-to-check ledgers |
| repo-audit | `/home/strawman3/Dev/agent-workbench/skills/repo-audit/SKILL.md` | Bounded route/architecture inventory, verified gaps versus hypotheses |
| change-verifier | `/home/strawman3/Dev/agent-workbench/skills/change-verifier/SKILL.md` | Final diff and applicable check review |
| game-ui-frontend | `/home/strawman3/Dev/garden-of-earthly-delights/.agents/skills/game-ui-frontend/SKILL.md` | Sparse controls and optional provenance; DOM text and touch alternatives |
| camera-systems | `/home/strawman3/Dev/garden-of-earthly-delights/.agents/skills/camera-systems/SKILL.md` | Framing serves a discovery, stable focal point, avoid unnecessary camera movement |
| performance-optimization | `/home/strawman3/Dev/garden-of-earthly-delights/.agents/skills/performance-optimization/SKILL.md` | Repeatable before/after production-browser measurements before accepting effects |
| Firecrawl | `/home/strawman3/.codex/plugins/cache/openai-curated-remote/app-6a314a73f8ac819195b0d55e36b9c609/2.11.0/skills/firecrawl/SKILL.md` | External source discovery and original-page retrieval |
| imagegen | `/home/strawman3/.codex/skills/.system/imagegen/SKILL.md` | Composition reference only; invented text in the first result was rejected and corrected; no generated asset enters the encounter |
| read-docs | `/home/strawman3/.codex/plugins/cache/openai-curated-remote/app-6a314a73f8ac819195b0d55e36b9c609/2.11.0/skills/read-docs/SKILL.md` | Official Next.js static-export and React state documentation; native disclosure ultimately avoids a new client component |
| deployments-cicd / vercel-cli | `/home/strawman3/.codex/plugins/cache/openai-curated-remote/vercel/0.54.1/skills/deployments-cicd/SKILL.md`, sibling `vercel-cli/SKILL.md` | Exact project/environment identity and preview-only delivery; preserve canonical release authorization |

`shader-programming` was inspected at its symlink target. It is conditional guidance only: there is no reason yet to introduce shaders into a historical reading. Codex system skills were inventoried; Codex product Q&A is outside this task, so `openai-docs` is not activated. Relevant official React/Next documentation will be checked against the existing versions.

## Work sequence

1. Audit every public/provisional encounter in source and a real browser; rank the top three.
2. Verify a small set of original sources and rights, including actual Christian Open Library access availability.
3. Write the encounter treatment before components; implement one complete vertical slice.
4. Inspect desktop/tablet/390px/320px, revise the weakest moment, and verify sources, accessibility, static export, performance and publication boundaries.
5. Commit only task files, open a draft PR and obtain a preview tied to the commit. Keep production untouched.

## Opportunity audit

Baseline export built from the base commit with the new report as the only task-authored file. Browser: installed Chrome through Playwright (Browser plugin absent), 1440 × 1000, reduced motion. All 48 scope routes were opened; 46 returned 200 and the two deliberately excluded routes returned 404. No page exceptions or failed requests were observed. A route inventory and matched screenshots accompany the verification evidence. This is an expert inspection, not unbriefed reader testing. The score expresses estimated **marginal** benefit, not overall story quality.

Rubric: human impact (H), source quality (S), design potential (D), feasibility (F), each 1–5. Rank by H × S × D × F. Close scores are judgment calls. Source summaries below describe existing material, not new historical verification.

| Rank | Encounter / route | Actual opening, stakes and source/design assessment | Main obstacle; can a source change it? | H/S/D/F · product |
| --- | --- | --- | --- | --- |
| 1 | `/human-story/jerome/` | Names a translation disagreement but opens with a generic reader header; no direct voice. Sources and distinctions are substantive. | Congregation and translator remain summaries. Their actual exchange can make trust in familiar words tangible while Scripture stays visible. | 5/5/5/5 · 625 |
| 2 | `/human-story/pliny/` | Governor/emperor, punishment and an expandable reply are already understandable. Exact historical translations present. | People described by the governor remain remote. His account of two enslaved women could interrupt the administrative viewpoint, with coercion explicitly retained. | 5/5/4/4 · 400 |
| 3 | `/human-story/teresa/` | Names Teresa's reading of Augustine and garden metaphors; correct edition distinctions, but all paraphrase. | A documented reader-to-reader connection is asserted rather than encountered. A short exact passage could make the literary relationship experiential. | 4/5/4/4 · 320 |
| 4 | `/human-story/time-and-memory/` | Clear psalm example; no present-tense interaction or direct voice. | Reciting a line while expectation becomes memory could embody the argument; avoid claiming a scientific result. | 3/5/5/4 · 300 |
| 5 | `/human-story/singing-in-milan/` | Community under pressure is described; testimony and modern sound properly separated. | Communal stakes need a specific voice; a source-led pause is feasible, but invented ancient music would mislead. | 4/5/4/3 · 240 |
| 6 | `/human-story/augustine/` | Direct opening prayer and later painting work together; garden/Monica remain explanatory. | A meaningful later passage could change emphasis, but repeating the existing opening mechanism adds little. | 3/5/4/4 · 240 |
| 7 | `/human-story/emmaus/` | Cleopas, failed hope and recognition identifiable; actual Scripture is offsite. | A locally pinned conversation is more useful than extra commentary; larger Scripture-pinning scope. | 4/5/4/3 · 240 |
| 8 | `/human-story/paul/` | Ananias remains in view; authority/dependence contrast is strong, all summarized. | Bring the biblical exchange into the encounter before adding later voices. | 4/5/4/3 · 240 |
| 9 | `/human-story/sinaiticus/` | Material object, multiple hands, copy/event distinction clear; no object encounter. | A rights-cleared page and precise correction could make copying human; requires image/text-specific research. | 4/5/4/3 · 240 |
| 10 | `/lachish/` | Strong inhabited opening, domestic objects, spatial siege, captives, contrasting royal accounts. Existing voices already change perspective. | A later Isaiah reading could help the Jerusalem ending, but introduces a second period into an already substantial recent encounter. Lower marginal gain than Jerome. | 3/5/4/3 · 180 |
| 11 | `/human-story/rashi-radak/` | Two readings correctly separated; children/animals is a concrete tension. | Qualified Hebrew review and uncertain digital rights constrain exact excerpts; do not generate a nonexistent translation. | 4/4/5/2 · 160 |
| 12 | `/human-story/francis/` | Later tale and historical distance made clear; no direct literary voice. | A small exact passage could communicate the tale's form, but avoid presenting it as Francis's recorded speech. | 3/4/3/4 · 144 |
| 13 | `/human-story/tacitus/` | Hostile retrospective historian oriented well; sparse human texture. | Brief original passage could expose rhetoric, though sensational punishments risk displacing the source question. | 3/5/3/3 · 135 |
| 14 | `/human-story/genesis/` | Creation/creatures oriented; generic summary, Scripture linked out. | Primary text before later commentary. No human scene should be fabricated for Genesis 1. | 3/5/3/3 · 135 |
| 15 | `/human-story/mediterranean/` | Different cities/periods explained; atlas link helps, little personal agency. | Spatial/chronological relationships would help more than another quotation. | 3/5/3/3 · 135 |
| 16 | `/human-story/josephus-james/` | Brief death notice restored to political context; useful transmission distinction. | Substantially addressed in the dedicated James encounter; link continuity has higher value than duplicate source UI. | 2/5/3/4 · 120 |
| 17 | `/human-story/genesis-in-paint/` | Later art visible, caption/source useful, chapter context and architectural loss explained. | Whole-image context rather than a new voice is the stronger next step. | 2/5/3/4 · 120 |
| 18 | `/human-story/jonah-in-marble/` | Object present and later date explicit; meaningful return to shade. | Could lead directly to the translation encounter; this is a possible smaller integration, not another essay. | 2/5/3/4 · 120 |
| 19 | `/human-story/nineveh/` | Actual tablet and its limits present; human literary culture indicated. | Another text may illuminate scribal life but would require separate material-context research. | 3/5/3/2 · 90 |
| 20 | `/human-story/exodus/` | Army/sea stakes and people's speech described; route explicitly unfinished. | Primary narrative needs development; avoid disturbing unfinished Exodus work for a commentary addition. | 5/4/4/1 · 80 |
| 21 | `/human-story/testimonium/` | Transmission uncertainty correctly foregrounded, rather than a false corroboration. | Technical textual problem easily becomes an academic exhibit; no exceptional human encounter yet. | 2/4/3/3 · 72 |
| 22 | `/human-story/suetonius/` | One disputed name, honest uncertainty, no forced verdict. | More quotation does not recover missing context; preserve the short reading. | 2/4/2/4 · 64 |
| 23 | `/human-story/perpetua/` | Mothers, prison, child, father, narrator handoff and visions form a full journey with exact Wallis passages. | Already inhabited; an additional voice risks breaking intimacy and flattening the composite account. | 2/5/3/2 · 60 |
| 24 | `/human-story/romanus/` | Narrative identity, location and surviving accounts are established; variants and reception already interactive. | Additional voices would duplicate the encounter's core strength. | 2/5/3/2 · 60 |
| 25 | `/human-story/james/` | Strong setting and causal progression; Paul/Josephus/later memory separately inspectable. | New sources have low marginal benefit; maintain independent lineage distinctions. | 2/5/3/2 · 60 |
| 26 | `/human-story/thomas/` and `/sayings/` | Human absence, addressed witness, manuscripts and later reception already developed; canonical/noncanonical texts separated. | Already source-rich; more material risks weakening narrative pacing. | 2/5/3/2 · 60 |
| 27 | `/jonah/`, `/human-story/jonah/` | Full pinned narrative, art, geography, later perspectives, open ending; companion reader is a useful alternate entrance. | Strengthen one relevant connection rather than adding more discoveries across all scenes. | 2/5/3/2 · 60 |
| 28 | `/nineveh/` | Place/text/composition with restrained city environment and controls. | Documents need an independently sourced human context; additional reception risks confusing the city threshold. | 2/4/3/2 · 48 |

Unique encounter coverage is 25 graph entries plus Thomas, the standalone Jonah/Nineveh/Lachish experiences and atlas. Ancillary routes: `/` and `/human-story/` are matching portals; five `/worlds/*/` pages organize the same material; three `/paths/*/` pages supply editorial reading sequences; James/Romanus/Thomas `/reading/` routes provide alternate readings. They were opened and inspected, not scored as distinct historical sources. `/explore/` remains the existing geographical layer. `/demo/` and `/experiments/nineveh/` are deliberately excluded (404), not broken public stories.

**Selection:** one complete Jerome flagship, with a small return connection from Jonah's existing shade discovery if it fits its current architecture. Pliny and Teresa are documented follow-ups, not partial implementations in this diff. Issue #53's earlier Isaiah-first proposal is deliberately superseded for this task by the user's explicit all-encounter selection mandate; this change does not close all of #53.

## Creative treatment · One word. A congregation.

**Central question:** What is at stake when a familiar scriptural word changes? Visitor starts knowing neither bishop nor translator. Explain first: Augustine reports a church in Oea resisting a changed reading of Jonah; Jerome replies in defense of his rendering. The letters are dated 403/404 in the historical edition. This is a later Christian argument about reading, not a second witness to Jonah's narrated events.

**Spine:** the vine shelters Jonah → a congregation hears an unfamiliar word → a translator faces unfamiliar Hebrew versus intelligible Latin → return to the shade, loss and unanswered question. Preserve both concerns without asking the visitor to vote or select the correct plant. Augustine does not name the disputed word in this letter; Jerome identifies it with the older gourd/ivy controversy. Make that asymmetry visible.

Three media directions considered: (1) a reconstructed church with spatial sound, rejected because it invents setting/sound and increases cost; (2) an artifact-led scan magnifier, useful as optional source evidence but too likely to become an exhibit; (3) a typographic encounter in which the biblical passage holds its position while the words and their human contexts are disclosed, selected. Text is the expressive medium. No invented portraits, plant reconstruction or historical ambience.

**Composition:** ink-blue Scripture field beside a warm paper field for the letters. Monumental *gourd / ivy* are English translation alternatives, never replacements inside the pinned WEB quotation. Restrained serif display and readable body text use the existing local fonts. A stable spatial anchor keeps Scripture beside the debate; no camera, per-frame loop or shader is necessary. This applies camera-systems' principle that framing must serve attention, and performance-optimization's preference for doing less.

**Interaction:** native disclosures reveal each actual letter at the moment its concern becomes legible. One dominant reading action and an optional provenance disclosure apply game-ui-frontend's low-chrome principle without game mechanics. No imagined decisions, trial outcome, score or fabricated dialogue. Keep exact quotations apart from short editorial bridges. Sources and limitations remain reachable; editorial draft status is recorded unobtrusively, not repeated over the story.

**Mobile:** a compact Scripture block precedes the exchange; no two-column squeeze or large fixed overlay. At 320px every source and summary reflows. Native details work by keyboard and without JavaScript; links have stable anchors. Reduced motion preserves the same meaningful states without animated travel. No media asset is needed for comprehension, so missing images cannot remove the account.

**Pacing application:** story-forge's information-pacing test removes the existing duplicated summary essay and generic final reflection from this encounter, replacing them with one causal exchange and a return to Jonah. Each disclosure changes what is known. BibleMap discovery keeps the encounter foregrounded and provenance optional. No emotional outcome is claimed without unbriefed reader observation.

The [source dossier and cross-repository opportunities](research/historical-voices-v2-sources.md) preserve the selected editions, rejected candidates, evidence ledger, actual Christian Open Library access outcome, and the user's Jesus-research archive findings. No further broad research is required for this iteration.

## Stabilization findings

| Failure actually observed | Classification and evidence | Resolution |
| --- | --- | --- |
| Baseline build: `Could not parse output from TypeScript's --showConfig` / truncated JSON | Sandbox/tool invocation; no application diagnostic. | The same build succeeded outside the sandbox. No TypeScript or configuration setting changed. |
| Later build: `Cannot read properties of undefined (reading 'length')`, build stage `compile`, filtered internal frames | Local compiler/build-state failure. Exact internal callsite and cache entry remain unknown; do not claim a proven application bug or an identified corrupted cache record. | Quarantined disposable `.next` state. A clean build and subsequent build succeeded with the same dependencies/toolchain and unchanged application settings. Final verification uses a fresh clean build. |
| Four initial Jonah Letters browser failures | Stale export after the failed rebuild: two assertions could not find the new opening sentence; two could not find the new `Hear the letters` link. | All eight focused cases passed against the successful current export. No assertion was removed. |
| `release.test.mjs` reports only `test failed` inside sandbox | Test subprocess/tool environment, not a demonstrated release-policy defect. | Outside sandbox, all 28 actual release regressions passed. The release code, authorization, scope and artifact checks are unchanged. |
| Reading-path regression expects `A translator explains his decision` in both projects | Obsolete test contract after the authorized encounter replacement; navigation reaches the new page correctly. | Assert new heading, open Jerome's reply, verify its actual words and botanical limitation; retain path and Atlas checks. Both targeted reruns passed. |
| Lachish mobile teardown: `ENOENT` opening a trace under `.playwright-artifacts-3` | Harness collision caused by overlapping Playwright commands sharing `test-results/`. No Lachish assertion failed. | Run the final suite serially. No Lachish application/test edit. |
| A later full run loses access across all routes: `page.goto: net::ERR_CONNECTION_REFUSED` | Reused background server terminated with exit 143; a direct HTTP request also failed. This does not demonstrate failures in the affected applications. | Use existing `CI=1` so Playwright starts and owns its server; keep the requested host and all checks unchanged. |
| SEO adversarial gate cannot launch absent bundled Chromium | Browser availability, not a failed SEO assertion. | Use the repository's supported `CHROME_PATH=/usr/bin/google-chrome`; no browser/toolchain reinstall or configuration edit. |

The quotation test is included in `validate:story`, so the new excerpts are checked on every build, alongside the existing Scripture/media checks. Package dependencies and the lockfile are unchanged.

## Verification and review handoff

Changed application files: the existing dynamic entry route selects `JonahLettersEncounter`; its scoped stylesheet supplies the two fields and responsive layout; `jonah-letters.ts` supplies the sourced passages through the existing `HumanSource` model; the historical paragraph fixture and domain tests protect quotation integrity; the culture registry reuses its original source IDs; Jonah's existing shade discovery links to the encounter. Browser coverage adds the complete new flow and updates the old reading-path expectation. No new generic source model, client component, dependency, shader, audio or ingestion system is introduced.

Executed local checks: `npm ci`; final clean `npm run build` including Scripture/quote/media validation, 290 visitor artifacts and MapLibre worker verification; `BIBLEMAP_VERIFY_EXPORT=1 npm test` (74 passed, no skips); quotation checks (2 passed, also part of the build); `npm run test:release` (28 passed); focused Jonah Letters browsers (8 passed); corrected path browsers (2 passed); TypeScript (no errors); lint (no errors, three existing unused-variable warnings in unchanged `DataLoader.tsx`); SEO audit (46 classified routes, no errors, empty sitemap) and all six adversarial SEO fixtures rejected. SEO observations are the eight existing Jonah images without intrinsic dimensions; this change adds no images. The final serial full-browser outcome and hosted preview identity are recorded in the draft PR against the commit, avoiding a reporting-only change to the tested source SHA.

Matched real-browser evidence and the visual/performance critique are in [the evidence directory](../artifacts/historical-voices-v2/README.md). Desktop, tablet, 390px, 320px, 200% text, keyboard, native no-JavaScript reading, deep links, both selected letter states and source expansion were checked. Relevant console errors, warnings, failed requests, HTTP errors and axe violations: none in the final four-width encounter review. Static content has no retrieval/loading/empty-data state; all historical text survives without media, scripts or audio. Existing media/fallback paths remain under the repository browser suite.

Assumptions and limits: comparison of these letters is an authored reading, not proof of the Oea incident or a botanical identification. The historical edition's dates and transmission limits remain explicit. Reader comprehension/emotion, full accessibility conformance, other browser engines and real mobile hardware are not established by this simulation. The design/research was accepted for this iteration; source bridges remain draft and production acceptance remains pending. No release authorization, canonical check, publication scope, production setting or production deployment was changed.
