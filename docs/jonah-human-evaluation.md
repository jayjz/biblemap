# Jonah human-story study: critical evaluation and verification

Draft for human review, 30 October 2026. [Vision](jonah-human-vision.md), [original-source dossier](research/jonah-human-sources.md), [before/after board](../artifacts/jonah-human/index.html), [exact commands and exits](../artifacts/jonah-human/verification/runs.json).

## What was evaluated

The clean starting branch was already `feat/jonah-human-experience`, at `2de3b7d`, inheriting PR #34’s two commits above main `60ecbda`. Remote main was checked and remains at that revision. No existing branch, commit or PR was replaced. This change extends the existing reader, not a parallel application.

The ordinary reader at the starting revision reproduces main’s presentation: the source diff consists of opt-in #34 classes/components and navigation enhancement, inactive in the ordinary build. The “before” screenshots are that actual ordinary export, not a claim that a separate main checkout was rebuilt. All thirteen scenes were traversed in Chrome at 1440 and 390 pixels, with complete scene captures as well as opening viewports. Longer prayer, flight, return, shade and final-question compositions were examined in addition to the contact sheet.

PR #32’s original HumanCity/content implementation, source record and actual final-scene screenshot were examined. Its useful contribution is specificity: named people at the final question. Its facing page remains an article-like composition; the optional dialog separates the document from the verse. PR #33’s original FourBeat implementation and actual Mercy screenshot show the value of continuous place, and the risk of a highly convincing invented city. PR #34’s actual existing screenshots, reader code, opt-in browser behavior and all ten dedicated tests were examined. Its literary turn and river orientation are retained. The Flood Tablet remains available in #34, but is replaced in this study by a more particular legal record. No #32/#33 implementation was imported or merged; the shared original document was reopened independently and the earlier exploration is credited.

## Observation, critique, revision

**First study:** the document had a three-line “A house / A street / Two names” headline. In the [actual first desktop screenshot](../artifacts/jonah-human/study-one/1440-jonah-3-mercy.png), that editorial headline competed with the verse, and made the document surface too tall. The title page also retained inherited decorative rings. A header-focus position clipped the top of the geographic orientation.

**Revision:** remove the staccato headline and the rings. Use a quieter description, “A house changes hands,” and spend the documentary scale on actual names. Increase the heading’s scroll margin so the place relation remains visible after navigation. Retain the full 3:5–9, the wider 3:10 pause, and the 4:1 change of scale. On mobile, every verse precedes the optional record. The record’s native disclosure unfolds property, boundaries, price and witnesses with exact line references. It works without JavaScript; the enhanced reading can be linked, reloaded, and restored through history.

The first new browser run passed ten cases and failed two no-JavaScript source-link assertions. The source link was inside a second, still-closed disclosure: the test omitted that real interaction. The corrected test opens it before checking the link; no original assertion was removed. The no-JavaScript version also omits an otherwise inert JavaScript close button; its native summary still closes the record.

An early dependency reinstall overlapped a screenshot process using Sharp and failed with a Windows DLL lock. The capture was allowed to finish, then the locked install and all core checks were rerun successfully. The raw failure remains in `verification/5-core.txt`. A concurrent log writer initially omitted its index entry; the final ledger identifies that omission explicitly rather than fabricating timestamps. The two earlier sandboxed build attempts failed at worker creation with `spawn EPERM`; the escalated builds completed without changing the build configuration. No lint rule, type check, source gate or browser assertion was disabled.

## What improved, and what did not

| Question | Evidence state and observation | Implication / next discriminating check |
| --- | --- | --- |
| Can someone enter and follow the book? | SUPPORTED for tested behavior: a direct Begin reading link, keyboard scene traversal, history, and all 48 exact verse strings in order. UNRESOLVED for first-time comprehension. | Test with unbriefed participants. The title page is quieter, but it is still a title page, not a fully realized human invitation. |
| Does the ancient city have particular human traces? | SUPPORTED: named parties, material property, payment and witnesses come from an identifiable legal record. INFERRED: their particularity may make the city less abstract. | Ask visitors who these people were. Confusion with Jonah’s audience is a failure, even if the names are memorable. |
| Does historical material illuminate rather than decorate? | INFERRED design judgment: following a transaction gives the document an action beyond looking at an object. The source is still only indirectly related to repentance. | Counterbalanced visitor comparison should measure distraction as well as curiosity. A court-connected archive cannot represent every resident. |
| Are sources, interpretations and design distinguishable? | SUPPORTED in the UI: historical document/date, modern documentary reading, visible limits, exact edition links, separately labeled rabbinic interpretation and medieval Catholic perspective. | Human comprehension of those distinctions remains UNRESOLVED. Islamic reception is researched in the dossier, not newly implemented as a foreground panel. |
| Does the chapter turn belong to the book? | SUPPORTED: 3:10 and 4:1 remain exact, adjacent in narrative order, voluntarily reached. INFERRED: scale and space may make their contrast more apparent. | Do not call it an observed emotional effect. Ask readers to retell what changed, without suggesting an answer. |
| Is mobile improved? | SUPPORTED: no horizontal overflow at tested widths; complete Scripture comes before discovery. CONFLICTED as a design objective: reading order improves, simultaneous encounter with the document is lost. | Real-device sessions should check whether the extra reading length causes people to miss discovery or the continuation link. |
| Is the whole book artistically complete? | UNRESOLVED, and not claimed. Two scenes demonstrate the direction; earlier scenes largely retain their previous article rhythm. | The whole-book scene score defines subsequent work. Do not expand it mechanically before evaluating this pair. |
| Has emotional or spiritual success been established? | UNRESOLVED. No participants, independent experts or human screen-reader sessions were available. | Use the independent method in the vision; retain negative and indifferent responses. |

The strongest existing work remains the direct Scripture entry, the sailors’ full sequence, intact later artworks, the quiet bodily ending of chapter 2, the shade/sculpture encounter, exact text, source access, reader control and the final unanswered question. The prototype does not solve every scene’s intellectual or artistic limitations. Its own surface can still read as a museum document beside a passage; it should be judged against the commissioned illustrative alternative, not declared the inevitable final style.

## Requirement-to-check map

| Requirement | Source / observable check |
| --- | --- |
| Preserve thirteen scenes, 48 pinned WEB verses, notes, human authorship and release gates | Unchanged `jonah.ts` and pinned chapter files; `validate:story`, domain tests, ordinary full-book browser test, new exact-text traversal and no-JavaScript case. |
| Small demonstration in the existing reader; keep other experiments | Build-time `BIBLEMAP_HUMAN_REVIEW=1`; ordinary export excludes study classes/document; #34’s separate flag and ten tests remain functional. |
| Date/source/rights/interpretive limits | `jonah-nineveh-record.ts`, fresh ORACC/CDLI checks, visible dating/limitations, no restricted photograph; Met research image has exact API rights evidence and checksum. |
| Navigation, keyboard, URL/history/reload, no-JS | New desktop/mobile record and full-book tests, plus ordinary site and inherited-reader regression suites. |
| Responsive and accessible composition | New axe checks for both study scenes at 320/390/820/1440; complete mobile reading order; original keyboard/dialog coverage retained. Automated axe results do not replace a human assistive-technology session. |
| Loading, missing media, malformed state, empty and selected atlas states | New image-blocking and malformed-query tests; existing media, Nineveh loading/error, and desktop explorer filter/selection/Exodus tests. The new record itself is deterministic local content, with no async loading or remote empty state. |
| Reduced motion and ordinary motion | New chapter-navigation test; inherited progressive-enhancement/unsupported-browser test; all scene advances remain voluntary. |
| Atlas, Exodus, homepage and production boundaries | No source changes to these features; full ordinary suite; existing export/media gates. Remote basemaps are mocked by the existing atlas tests, so live tile-service availability is not established. |
| No automatic publication or editorial approval | Exact branch added to existing Vercel deployment exclusion; existing release gate and review states untouched; draft PR only. |

## Executed local verification

Windows, Node `24.21.0`, npm `11.19.0`, Chrome `156.0.8078.79`. The user requested GPT-6.1 Sol / Extra High; the actual resolved model backend is not exposed by these artifacts. Browser and command versions are recorded separately from the design judgments.

Terminal logs normalize trailing spaces and final blank lines for Git review; command text, errors and outcomes are retained.

- `npm ci`: final successful exit 0; lockfile unchanged. Existing dependency audit reports 30 advisories; no dependency or audit-fix change was introduced.
- `npm run validate:story`: exit 0, including exact publisher-snapshot validation and media checks.
- `npm run test`: exit 0, 25 domain tests passed.
- `npm run lint`: exit 0, no errors and four existing warnings in unchanged `DataLoader.tsx` / `validate-nineveh-depth.mjs`.
- `npx tsc --noEmit`: exit 0.
- Ordinary `npm run build` and `node scripts/validate-nineveh-depth.mjs --production-export`: exit 0; study absent from ordinary HTML, existing media gates pass.
- `npm run test:e2e` on the ordinary export: exit 0, 69 passed, one existing mobile legacy-atlas skip. The skip is unchanged, not a new waiver.
- Separate `BIBLEMAP_NINEVEH_REVIEW=1` build and `PLAYWRIGHT_REVIEW_SERVER=1` full browser suite: exit 0, 22 passed. The absent local generated landscape was replaced only for this interaction run with the same disclosed tablet-image fixture used by existing CI. No aesthetic judgment was based on it.
- Separate `BIBLEMAP_READER_TRANSITION_REVIEW=1` build and `npx playwright test --config playwright.reader.config.ts`: exit 0, ten passed.
- `BIBLEMAP_HUMAN_REVIEW=1` build and `npx playwright test --config playwright.human.config.ts`: twelve passed in the successful run. Final capture/command records are canonical in `runs.json`.

All ordinary WebGL atlas tests use the existing deterministic basemap fixture. No real-world map-service uptime, production performance or successful theological review follows from the test count. The release command is an editorial gate, not a command to bypass or mark approved.

## Change scope and recovery

The incremental implementation changes `StoryReader.tsx`, the existing Jonah page, and adds `NinevehRecord.tsx`, `human-story.css`, and `jonah-nineveh-record.ts`. The new Playwright file/config, capture/verification scripts and CI step exercise the opt-in surface separately. `.gitignore` accounts for generated reports and retains representative screenshots while leaving complete local traversals available. `vercel.json` excludes only this additional review branch. Documentation, a comparison board, checked research references, and per-command logs carry the review evidence.

No package manifest, lockfile, canonical Scripture, story/author record, atlas, Exodus, existing media file or prior experiment implementation is changed. Existing prior commits remain ancestors. Disabling the new build flag returns to the existing ordinary reader; there is no migration or data rollback. The old #34 study is still available under its original flag.

`self-recursive` was read: this work uses an existing finite linear scene list and a short flat document list. No meaningful recursive-versus-iterative implementation decision arose, so recursion was not introduced. Design/observation/critique/revision are creative cycles, not an algorithmic requirement. The React checklist found no new async waterfall, animation-frame state loop, dependency, unsafe type escape or runtime content generation.

## Local review

```powershell
$env:BIBLEMAP_HUMAN_REVIEW='1'
npm run build
python -m http.server 4311 --bind 127.0.0.1 --directory out
```

Open `http://127.0.0.1:4311/jonah/`, then follow the book. Direct study: `http://127.0.0.1:4311/jonah/#jonah-3-mercy`; shared document: `http://127.0.0.1:4311/jonah/?record=sale#jonah-3-mercy`. The comparison board is a standalone repository artifact. No new hosted route or deployment is required.
