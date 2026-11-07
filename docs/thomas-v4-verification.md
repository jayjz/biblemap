# Thomas V4: review and verification

6 November 2026. AI-assisted editorial/design draft. Base `0e762f9d10c0b91dbff469ab39c3ebca370d28de`; branch `feat/thomas-v4-human-encounter`, targeting `feat/human-story-consolidated`. Implementation milestone `3c719168543ab34e9aab498dfbc499f8d062aa4b`; final handoff also corrects the simple-reading ending contrast and aligns the encounter metadata with its new title/passage range. No creator acceptance, production promotion or merge is supplied by this report.

## What changed

Visitors first meet a speaking disciple in complete pinned John 11:16 and 14:5, rather than finding those passages behind the absence disclosure. The two voices retain complete 20:25 but occupy different spatial positions; mobile's comparison control can remove the intervening image and hold the speech closer together. A static interval precedes the return, with a direct link through it. The confession retains V3's monumental typography and complete 20:28, now breaking decisively into daylight. John 20:29, 30 and 31 resolve the main reading in order. No touch, private thought or intervening action is supplied.

The manuscript room keeps its four native selections and two sayings. Original format diagrams make codex/leaf/reused roll/roll fragments distinguishable. P.Oxy.1 offers a source-credited, offline-checked Greek ending beside the corresponding excerpt of the existing **Coptic-based** English. Missing material remains unfilled; the comparison is not advertised as a fresh Greek translation. A disclosure explains differences between catalogue dates. Institutional images and edition texts without confirmed rights remain links.

Changed application files are confined to `src/features/human-story/thomas/`, `src/content/thomas.ts`, the two new Greek source excerpts, and Thomas route metadata/sayings. `src/domain/thomas.test.ts`, `tests/thomas.spec.ts` and `scripts/pin-thomas.mjs` extend integrity/behavior coverage. Capture/review scripts, source review, direction and evidence are Thomas-specific. No homepage, other story, dependency, Next/Vercel deployment configuration or authorization record changed.

## Visual evidence

All normal before/after captures use a 1000px-high viewport, reduced motion and decoded images, at **1440, 768, 390 and 320**. The before build is the supplied consolidated V3 preview (confirmed by Vercel at the expected base SHA). The after build is the V4 static export. Opened both rendered proposals at desktop/mobile and manually inspected representative captures across every revised scene, all four witness formats, tablet, 320px confession, mobile ending, held voices, enlarged Greek, no-JS reading and failed imagery. These observations establish rendering/behavior, not a visitor's emotional response.

| Moment | Desktop before / after | Mobile before / after |
|---|---|---|
| Testimony | [Before](../artifacts/thomas-v4/before/unless-1440.jpg) / [After](../artifacts/thomas-v4/after/unless-1440.jpg) | [Before](../artifacts/thomas-v4/before/unless-390.jpg) / [After](../artifacts/thomas-v4/after/unless-390.jpg) |
| Interval / return | [Before](../artifacts/thomas-v4/before/eight-days-1440.jpg) / [After](../artifacts/thomas-v4/after/eight-days-1440.jpg) | [Before](../artifacts/thomas-v4/before/eight-days-390.jpg) / [After](../artifacts/thomas-v4/after/eight-days-390.jpg) |
| Confession | [Before](../artifacts/thomas-v4/before/confession-1440.jpg) / [After](../artifacts/thomas-v4/after/confession-1440.jpg) | [Before](../artifacts/thomas-v4/before/confession-390.jpg) / [After](../artifacts/thomas-v4/after/confession-390.jpg) |
| Written ending | [Before](../artifacts/thomas-v4/before/not-seen-1440.jpg) / [After](../artifacts/thomas-v4/after/not-seen-1440.jpg) | [Before](../artifacts/thomas-v4/before/not-seen-390.jpg) / [After](../artifacts/thomas-v4/after/not-seen-390.jpg) |
| Manuscript room | [Before](../artifacts/thomas-v4/before/witnesses-1440.jpg) / [After](../artifacts/thomas-v4/after/witnesses-1440.jpg) | [Before](../artifacts/thomas-v4/before/witnesses-390.jpg) / [After](../artifacts/thomas-v4/after/witnesses-390.jpg) |

New [earlier voice, desktop](../artifacts/thomas-v4/after/before-thomas-1440.jpg) / [mobile](../artifacts/thomas-v4/after/before-thomas-390.jpg). [Proposal A desktop](../artifacts/thomas-v4/proposals/a-1440.jpg) / [mobile](../artifacts/thomas-v4/proposals/a-390.jpg); [proposal B desktop](../artifacts/thomas-v4/proposals/b-1440.jpg) / [mobile](../artifacts/thomas-v4/proposals/b-390.jpg). [Chosen direction and critique](thomas-v4-direction.md).

`before/observations.json` and `after/observations.json` record no page/console errors, failed requests, HTTP errors or document overflow at any of the four widths. `states/observations.json` records no page/console errors and no enlarged-text overflow at 1440/390/320. [Held speech](../artifacts/thomas-v4/states/held-390.jpg), [enlarged Greek](../artifacts/thomas-v4/states/greek-enlarged-320.jpg), [failed imagery](../artifacts/thomas-v4/states/failed-media-320.jpg) and [simple no-JS reading](../artifacts/thomas-v4/states/reading-nojs-390.jpg) were opened. Intentional image aborts are a separate failure-state check, not included as normal network failures.

## Executed checks

Windows, Node 24.22.2, Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Browser tests use the ordinary static export; focused host checks use the exact deployment origin. Logs live under `artifacts/thomas-v4/`.

| Command / check | Actual result |
|---|---|
| `npm ci` | Exit 0; 551 packages added, 552 audited; lockfile unchanged. Audit reports 22 existing dependency vulnerabilities (14 moderate, 8 high). Install-script warnings for esbuild/unrs-resolver. No dependency remediation in this story revision. |
| Source/media integrity in `npm run build` | Pass: 19 WEB verses, sayings 13/26 and licensed Greek ending match retained excerpts; existing media/rights validators pass. |
| `npm run lint` | Exit 0; four existing warnings: three in `DataLoader.tsx`, one unused `basename` in `validate-nineveh-depth.mjs`. |
| `npx tsc --noEmit` | Exit 0. |
| `BIBLEMAP_VERIFY_EXPORT=1 npm run test` | Exit 0; 63 passed, zero skipped. PowerShell environment syntax used. |
| `npm run build` | Exit 0; final ordinary export restored after review fixture. Static build, visitor projection, inventory and MapLibre worker packaging pass. 375 artifacts / 47 index routes; zero unresolved HTML dependencies or loopback-review references. `build-ordinary-final.log`, `export-inventory.json`, `maplibre-worker-export.json`. |
| `npm run test:export-boundary` | Exit 0; temporary private/unselected canaries absent from exported artifacts; sources restored; ordinary candidate rebuilt afterward. |
| V3 hosted `tests/thomas.spec.ts` | Exit 0; 18 passed, 32.5 seconds, including keyboard, no-JS, text enlargement, reduced motion, loading/failure and history. |
| Canonical static focused pass | Exit 0; 18 passed, 24.6 seconds. `narrative-focused.log`. |
| Manuscript static focused pass | Exit 0; 18 passed, 23.8 seconds. `manuscript-focused.log`. |
| `node scripts/review-thomas-v4.mjs` | Exit 0; all four formats, held voices, 200% text, failed imagery and no-JS reading captured; no normal console/page errors. |
| Final focused Thomas suite | Exit 0; 20 passed, 30.1 seconds. Includes the new simple-reading and expanded Greek axe checks. `focused-final.log`. |
| Separate Nineveh regression | Exit 0; 22 passed, 52.9 seconds. `PLAYWRIGHT_REVIEW_SERVER=1`, `PLAYWRIGHT_PORT=4191`; project CI's opt-in build plus loopback review server, using the pre-existing local artwork without replacing it. `nineveh-build.log` / `nineveh.log`. |
| Full regression | Final rerun: exit 0, **223 passed, one existing skip**, 6.6 minutes. Same opt-in build sequence as CI, followed by restoration of the ordinary export. Initial run: 221 passed, one skip, two failures in the new simple-reading contrast check; selector corrected. `e2e-full.log` / `e2e-retry.log`. Skip remains the existing mobile legacy explorer in `tests/explorer.spec.ts:5`; no test was newly skipped or disabled. |
| `npm run validate:release` | Exit 1 after successful source/media/export checks: creator publication decision pending. Gate remains intact. |

Failures and retries: the first capture ran before `npm ci` finished and reported a missing Playwright package; reran after install. Sandboxed Chrome launch and first build/release checks reported `spawn EPERM`; reran outside the sandbox. A dev-server pass at `127.0.0.1:4197` produced blocked HMR WebSocket errors and loading-state timeouts; stopped after six completed checks (three passed, three failed), shut down dev, and verified static builds instead. Development-only screenshots remain local under `narrative/`, not submitted as final evidence. A redundant static-server start reported `EADDRINUSE` while the test runner already served 4189; later captures used a dedicated server on 4197. The first complete browser run then found the simple-reading ending narrator at contrast 1.42:1: `.ending>.verse .speaker` overrode the reader's general inherited color. A reader-specific selector fixes that root cause; the focused 20-test retry passes. No config, assertion or validator was weakened. Build logs retain existing typeless-package and color-environment warnings.

## Sources, media and remaining review

[Source review](research/thomas-v4-source-review.md) records every retrieval, exact locations, date disagreements and the unusable Princeton PDF lead (excluded as evidence). Newly linked resources: [Coptic SCRIPTORIUM](https://data.copticscriptorium.org/texts/thomasgospel/gospel-of-thomas/), [NASSCAL](https://www.nasscal.com/e-clavis-christian-apocrypha/gospel-of-thomas/), and [Smithsonian](https://asia-archive.si.edu/exhibition/logia-jesou-thomas/). The newly displayed original-language excerpt comes from [DCLP 62838](https://papyri.info/dclp/62838); existing [DCLP 62840](https://papyri.info/dclp/62840) / [62839](https://papyri.info/dclp/62839), [Mattison](https://www.gospels.net/thomas), [John 11](https://ebible.org/engwebp/JHN11.htm), [14](https://ebible.org/engwebp/JHN14.htm), [20](https://ebible.org/engwebp/JHN20.htm), [21](https://ebible.org/engwebp/JHN21.htm), [Hurtado](https://larryhurtado.files.wordpress.com/2010/07/gthomas-greek-fragments.pdf), [Acts of Thomas](https://www.earlychristianwritings.com/text/actsthomas.html) and [Eusebius 3.1](https://www.newadvent.org/fathers/250103.htm) were rechecked without extending Thomas's biography.

Media inventory: [V4 provenance](../artifacts/thomas-v4/media-provenance.json) and the unchanged [bitmap manifest](../public/media/thomas/manifest.json). Existing images remain AI-generated invented environments. New SVG/CSS format diagrams are original code under the repository MIT license; no bitmap generation or third-party image acquisition occurred. DCLP transcription: CC BY 3.0 with attribution, link and selection notice. Mattison English and WEB: public domain. SCRIPTORIUM, NASSCAL, Smithsonian and institutional photography are link-only.

Human review is still required for the new connective prose, literary framing of absence/interval/confession/written testimony, the manuscript format captions and catalogue disagreements, and the Greek/Coptic-based English correspondence. No critical collation, authorship authentication, recovered gesture or claim of theological consensus is made. The new evidence does not transfer PR #46's old acceptance to V4. PR #41 remains a future integration boundary.

The largest remaining uncertainty is whether an unfamiliar visitor understands the sequence and distinct sources without briefing. No unbriefed reader study, physical-device session, assistive-technology user study, field Web Vitals or measured emotional outcome is claimed. Automated axe checks and keyboard/browser observations cover tested behavior, not comprehensive WCAG conformance. Before integration: creator textual/artistic review, philological check of the extract, a short unfamiliar-reader study, then a fresh decision bound to the accepted source/artifact bytes.

## Draft delivery

[Draft PR #47](https://github.com/jayjz/biblemap/pull/47) targets consolidated, not main. Its description carries the final pushed HEAD, exact READY Vercel preview and hosted check results, recorded after the final push. Feature-branch Git integration supplies the separate preview. No production setting, alias, promotion or merge is part of this delivery.
