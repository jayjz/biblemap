# Jonah 4:11 — the people within the city

Research and implementation draft, 27 October 2026. No human editorial or language approval is claimed.
Base: `60ecbda079f5fd29325b68549fe6d01ced74a7fc` (current main, includes merged PRs #30 and #31).
Isolated branch: `feat/jonah-411-human-city`.

## Before implementation

The existing final scene gives the unchanged WEB verse generous space, but offers no passage-specific discovery. Its empty facing column disappears. Four baseline captures in `artifacts/jonah-411-review/before-*.png` show no overflow or runtime errors. The thirteen-scene reader and `/explore/` navigation remain the framework.

### Composition A — a threshold into a written city (selected)

The verse occupies the left facing page. On the right, a typographic document threshold introduces two actual names from one transaction, with the date immediately visible. Opening it reveals selected translated evidence as a document, with people, property and boundaries. A second, quieter entrance opens two facing interpretations of the final phrase. Both return to the same verse; neither completes the story.

```
unchanged scene heading
WEB 4:11, large serif       Nineveh / 692 BCE
                           Amat-Su’la
                           Ṣilli-Aššur
                           Read a house sale
                           Read two interpretations
existing reader continuation / open ending
```

The names are documentary labels, not portraits or imagined voices. The composition is spatial and typographic, not a reconstructed street. No fabricated cuneiform, skyline, house plan or ancient sound. Palette reuses night `#131d20`, paper `#f1eadb`, bronze `#ccae79`, muted stone `#b6b5ab`, with a blue-grey document ground. Existing Playfair carries Scripture; Geist carries documentary identifiers and controls. All prose is left aligned, with no forced reading sequence.

### Composition B — a manuscript scroll (rejected)

The complete verse spans the page, followed by successive reveals of a household record and the medieval readers. It has a clear linear rhythm and works without modal interaction. Rejected because the long mobile scroll would make the Scripture harder to revisit, suggest a required interpretive sequence, and add length to the book's ending. No new understanding depends on animation.

A third preliminary direction, a walk through a reconstructed inhabited street, was discarded before development: the sale supplies boundaries, not a map or the appearance of its residents.

### Selection criteria

| Criterion | Threshold | Manuscript scroll |
| --- | --- | --- |
| Narrative impact | Actual names face the city's final question | Discoveries arrive only after leaving the verse |
| Clarity | Two explicit optional entrances | Longer sequential explanation |
| Accessibility | Native disclosures without JS; keyboard dialogs with JS | Native flow is strong, return distance is longer |
| Historical integrity | Date and document identity travel with names | Equally supportable if correctly labeled |
| Application compatibility | Scoped to existing final scene | Requires more restructuring and reader length |

This is a design judgment, not evidence of visitor response. No unbriefed visitor study has been conducted.

## Evidence ledger

All below originals opened 27 October 2026; precise claim-to-source records also live in typed content. Interpretive summaries are study paraphrases, never English quotations by medieval authors.

| ID / state | Original and locator | Observation and limits | Rights / use |
| --- | --- | --- | --- |
| `jonah-411-web` / SUPPORTED | `src/content/scripture/web-jonah-4.json`, verses 1–11; pinned 10 October 2026; [publisher](https://ebible.org/engwebp/JON04.htm) | 4:5–10 supplies the plant conversation; 4:11 closes with people and animals. No reply follows. No named king or dated Jonah visit. | WEB public domain, unchanged pinned text; existing checksum validation retained. |
| `jonah-411-rashi` / SUPPORTED attribution | [Rashi 4:11:1–2](https://www.sefaria.org/Rashi_on_Jonah.4.11); [version metadata](https://www.sefaria.org/api/texts/Rashi_on_Jonah.4.11?context=0) | Children; beasts read as adults who do not recognize their Creator. Core Hebrew checked against [ALHaTorah, Yonah 4:11, Rashi](https://mg.alhatorah.org/Full/Yonah/4.11). Similarity of editions does not independently establish authorial wording. | Hebrew Vocalized Edition CC0. Rosenberg/Judaica Press English is listed CC-BY without version; not reproduced. Original short paraphrase awaits human editorial review. |
| `jonah-411-radak` / SUPPORTED attribution; language approval UNRESOLVED | [Radak 4:11:3](https://www.sefaria.org/Radak_on_Jonah.4.11.3); [metadata](https://www.sefaria.org/api/texts/Radak_on_Jonah.4.11?context=0); [ALHaTorah, Radak, final verse](https://mg.alhatorah.org/Full/Yonah/4.11) | Children without sin; their fathers' repentance; literal animals without punishment or merit; pity appropriate for all these. Sefaria has no English here. ALHaTorah provides Hebrew and English that agree on this core contrast. English translator and reuse license not established; no translation quoted or claimed approved. | Sefaria electronic Hebrew license unknown. No substantial Hebrew or English reproduction. Original study paraphrase explicitly identified; specialist publication review remains open. |
| `nineveh-saa6-142` / SUPPORTED | [ORACC P335268](https://oracc.museum.upenn.edu/saao/saa06/P335268/html), o.1–13, r.1–17, edge 1–3; SAA 6 142 / ADD 324 | House sale dated 692-III-16 (692 BCE), eponym Zazaya, governor of Arpad. Sellers Šarru-lu-dari, Atar-suru, Amat-Su’la; buyer Ṣilli-Aššur, Egyptian scribe. House includes beams, doors, yard; adjoins two named houses and street. One mina silver; payment complete. Witnesses include royal brother-in-law, third man, chief boatmen and horse raiser. Court-linked legal archive, not a representative census of ordinary residents. | Theodore Kwasman and Simo Parpola, *Legal Transactions of the Royal Court of Nineveh*, SAA 6 (1991); lemmatization Melanie Groß, 2010–11. Annotated edition CC BY-SA 3.0; adapted excerpts/paraphrases attributed and shared alike. |
| `nineveh-cdli-p335268` / SUPPORTED identity; photograph EXCLUDED | [CDLI P335268](https://cdli.earth/artifacts/335268), physical information, collection, visual asset, references | Akkadian legal clay tablet; Nineveh/Kuyunjik; British Museum accession K 00294, eBL K.294. Links to SAA edition. These records identify the same object, not independent witnesses of the transaction. | Photo © Trustees of the British Museum, CC BY-NC-SA 4.0. Existing media gate excludes NC images. No download, embedding, tracing or fake replacement. Link to the authentic object record only. |

### Lineages, challenges and unresolved work

- Pinned WEB snapshot → reader. Scripture does not become archaeological attestation.
- SAA 6 (1991) → ORACC annotated edition; CDLI cross-identifies the same tablet. Their matching identifiers are not two independent house sales.
- Medieval commentaries → Sefaria and ALHaTorah. Textual agreement supports the bounded attribution, not a new claim about Jonah's intended meaning.
- Rashi and Radak both identify children; the comparison does not stage them as disagreeing on that point. Neither is ranked. Radak's treatment of the parents must not disappear when discussing innocence.
- The house sale belongs to later seventh-century Nineveh. Jonah ben Amittai's traditional eighth-century setting is tied to 2 Kings 14:25, not derived from this document. Composition date and the historicity of the visit are not adjudicated.
- The document names no Jonah audience and supplies no faces, interiors, daily schedules, private beliefs or feelings. Its connections to 4:11 are editorial juxtaposition, not proof.
- No new authorial narration or invented testimony. Source summaries are attributed documentary/interpretive labels in a no-index review reader, not approved historical teaching.

## Methods and external reference guidance

Read latest agent-workbench theology-inquiry and its inquiry record; source-integrity-audit and investigation record; evidence-contract; change-verifier. Read BibleMap creative-direction, discovery and visual-review. No skill installation or global modifications needed. No dependencies added.

Anthropic frontend-design was inspected for intentional typography and restraint; root LICENSE.md reserves rights and its skill's referenced LICENSE.txt was absent. Vercel web-design-guidelines and its source command were inspected for semantic controls, focus, motion and layout; no LICENSE file found in the inspected repository tree. Neither text is copied, installed or treated as BibleMap policy. Addy Osmani's collection was not needed for this bounded change.

## Verification and review

Execution evidence and actual browser review findings will be recorded here before push. Rights verification is separate from editorial approval. Rollback: revert only this branch's bounded change; canonical Scripture, scene IDs and routes are preserved.

Following PR #31's existing mechanism, `vercel.json` disables automatic Git deployments only for `feat/jonah-411-human-city`. [Official branch-specific configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled) was checked. The main branch, production settings, and other branches retain their behavior. This prevents the authorized push/draft PR from publishing unapproved content as a preview. No Vercel deployment command is run.

### Actual visual review

- Inspected desktop facing-page composition, tablet composition, 320px house-sale dialog, 390px theological dialog, and full-scene mobile captures. The long exact verse remains the largest body text in the encounter; the names form a separate facing documentary threshold. At 320px, Scripture comes first and discoveries follow in one column.
- The two interpreters have the same heading scale, source access and disclosure structure. Mobile stacks them in historical order; the opening states their agreement on children before their disagreement about animals.
- Dialogs scroll internally at narrow widths. The initial close control stays at the beginning of the dialog and is reachable by keyboard; the final return control focuses the same verse. No sticky layers obscure the focused content.
- No image is required for the new moment. A blocked-image test preserves every new discovery in text. Original tablet photography is linked rather than rendered because its NC license is outside the existing reusable-media policy.
- Early targeted verification found an overly exact selector for the combined discovery label, then a real missing editor attribution. Label markup and attribution were corrected. The subsequent targeted run passed all 14 desktop/mobile cases. No existing test was disabled, deleted or weakened.
- The first full opt-in suite returned 21 passes and one failure in `nineveh.spec.ts`: the SSR reader exposes all 13 scenes before hydration, and the existing test resolved a global Continue link before the readiness boundary. Its trace shows the unscoped selector matching 12 links. Added two assertions for `data-reader-ready=true` and one visible scene before the existing click. Every original navigation assertion is retained; no delay, retry or application behavior change hides the race. The full pre-push sequence is rerun after this strengthened precondition.
- The next full run stopped at lint because the prior review report's generated third-party trace-viewer JavaScript was included by the existing broad lint command. Source lint rules are unchanged. The verifier now preserves previous generated review reports under `/tmp/biblemap-jonah-411-evidence/` before rerunning source checks. No application source or test is omitted. `first-full-run-results.json` retains the first run's failure; final execution is separately recorded.
- Baseline network/font access failed in the restricted sandbox; the unchanged build succeeded with approved network access. A stopped early test run left a loopback port occupied; isolated port 4196 is recorded in the reproducible verifier. These are execution limitations, not silently reported passes.
- Remaining creative limitation: this is a quiet documentary encounter, not a reconstructed inhabited street. There are no portraits, city interiors or speculative voices. First-time visitor curiosity, comprehension and emotional response have not been measured.

### Screenshot evidence

| Viewport | Before | After | Discoveries |
| --- | --- | --- | --- |
| 320px | [Baseline](../artifacts/jonah-411-review/before-320.png) | [Final scene](../artifacts/jonah-411-review/after-scene-320.png) | [House sale](../artifacts/jonah-411-review/after-house-320.png), [interpreters](../artifacts/jonah-411-review/after-voices-320.png) |
| 390px | [Baseline](../artifacts/jonah-411-review/before-390.png) | [Final scene](../artifacts/jonah-411-review/after-scene-390.png) | [House sale](../artifacts/jonah-411-review/after-house-390.png), [interpreters](../artifacts/jonah-411-review/after-voices-390.png) |
| 820px tablet | [Baseline](../artifacts/jonah-411-review/before-tablet.png) | [Final scene](../artifacts/jonah-411-review/after-scene-tablet.png) | [House sale](../artifacts/jonah-411-review/after-house-tablet.png), [interpreters](../artifacts/jonah-411-review/after-voices-tablet.png) |
| 1440px desktop | [Baseline](../artifacts/jonah-411-review/before-desktop.png) | [Final scene](../artifacts/jonah-411-review/after-scene-desktop.png) | [House sale](../artifacts/jonah-411-review/after-house-desktop.png), [interpreters](../artifacts/jonah-411-review/after-voices-desktop.png) |

`capture.mjs before|after` uses the local static server at port 4195. `verify.mjs` runs the full required local checks sequentially and stops on failure; per-command results are in `verification-results.json`. Raw `.log` files are local ignored execution records; hosted CI preserves the complete browser evidence separately. Local environment: Linux, Node 24.22.1, Chrome 156.0.8078.47. Hosted CI uses its committed Ubuntu/Node 22.22.3 workflow; agreement must be checked rather than assumed.

### Final pre-push results

Complete sequence rerun after the review-test readiness assertion and report-preservation fix. Every command below returned exit 0. No push preceded these checks.

| Command | Actual result |
| --- | --- |
| `npm ci --cache /tmp/biblemap-npm-cache` | Committed lockfile installed; manifests unchanged. 30 existing advisories: 1 low, 8 moderate, 19 high, 2 critical. Existing install-script coverage warnings for esbuild, sharp and unrs-resolver. |
| `npm run validate:story` | All 48 verses and translator notes match pinned snapshots; 13-scene document validates in author-review mode. |
| `npm run validate:media` | Existing 6 acquisition records and 2 rights-cleared Nineveh images validate. No new image publication. |
| `npm test` | 27 tests passed, 0 failed, 0 skipped. |
| `node --experimental-strip-types --test --test-isolation=none src/domain/{atlas-routing,historical-context,human-city,media-publication,nineveh,story}.test.ts` | Supplemental run: the same 27 individual cases passed. The verifier records explicit paths instead of brace expansion. |
| `npm run lint` | 0 errors; 4 existing unused-symbol warnings in DataLoader and the Nineveh validator. |
| `npm run typecheck` | Passed. |
| `npm run build` | Ordinary static export passed; existing epoch validation: 2,917 rows. |
| `node scripts/validate-nineveh-depth.mjs --production-export` | Public homepage and exact licensed image bytes present; restricted experimental imagery excluded. |
| `CHROME_PATH=/usr/bin/google-chrome PLAYWRIGHT_PORT=4196 npm run test:e2e` | 83 passed, 1 pre-existing legacy mobile-atlas skip, 0 failed. Includes all PR #31 routing checks and 14 new desktop/mobile Jonah cases. |
| `BIBLEMAP_NINEVEH_REVIEW=1 npm run build` | Separate opt-in build passed. |
| `PLAYWRIGHT_REVIEW_SERVER=1 CHROME_PATH=/usr/bin/google-chrome PLAYWRIGHT_PORT=4196 npm run test:e2e` | Full separate review suite: 22 passed, 0 skipped, 0 failed. Existing documented CI-only Flood Tablet fixture used for the local landscape path; not committed or published. |
| `git diff --check` | Passed. |

Four final capture diagnostics report zero page errors, console errors, failed requests, HTTP errors and horizontal overflow. Automated accessibility checks exercised both dialogs at 390px; keyboard, history, reduced motion, no-JS and blocked-image behavior passed. Additional comparison confirmed that the deployment configuration differs only by this exact review branch's false entry. A limited pattern screen of changed text found no private-key/API-token patterns, `@ts-ignore`, raw HTML insertion or `eval`; this is not an exhaustive security audit.

Next regenerated `next-env.d.ts` during builds; its unrelated generated change was restored to the committed baseline and excluded from the patch. No Scripture, media catalog, Exodus data, atlas routing code, dependency manifest or production homepage code changed. Editorial release validation is not invoked: authorship/language approval remains unresolved, and a technical pass does not authorize publication.

Hosted CI evidence belongs in the draft PR after the exact pushed head is checked. No hosted success is inferred from these local results.
