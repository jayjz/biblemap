# James V2 — review evidence

Base: PR [#39](https://github.com/jayjz/biblemap/pull/39), `86b2c5d9eae789a2202c4a423a4318595ce51c84`. Revision branch: `feat/james-cinematic-human-experience`, targeting `feat/james-the-brother-who-remained`. Final runtime commit: `62eda24f5f5f7a43de53dd91c6ee9a5a4691177b`. Later evidence-only commits do not change the application.

This is an AI-assisted editorial/artistic draft. No historical, theological or literary human approval is claimed. The no-index encounter and existing publication boundaries remain intact. No production settings, aliases, release gates, dependencies, other stories or underlying James dossier were changed.

## What changed

- **The brother:** an imagined Galilean domestic environment and readable family/source limits; a landscape entrance and a closer domestic framing.
- **The appearance:** a hard change to a dark typographic field with the exact pinned WEB verse. No resurrection reenactment, location or private conversation is invented.
- **Jerusalem:** an inhabited city painting leads into three perspectives: Jerusalem fellowship in Galatians, the Antioch dispute in that same letter, and the Jerusalem narratives in Acts. Touch/keyboard controls change the textual relationships and limits, rather than simulating unrecorded conversation. No exact harmonization is imposed.
- **The record:** a discontinuity into a pale documentary field. Josephus’s short identifying phrase changes scale. Native disclosures expose the council, accusations, James and others, citizens’ objections, Albinus, Agrippa, and the notice’s limits. No trial reenactment or recantation demand.
- **What remained:** the palimpsest returns specifically for memory; a transmission comparison preserves the distinction between Hegesippus and Eusebius as authors in a chain, rather than independent eyewitnesses. The ending remains grounded in the surviving name and limits of the accounts.

The two primary scene transformations were implemented and inspected before the remaining scenes, at milestone `9b978b0`. [Jerusalem pilot](pilot/jerusalem-1440.jpg), [Record pilot](pilot/record-1440.jpg), [mobile Jerusalem](pilot/jerusalem-390.jpg), [mobile Record](pilot/record-390.jpg).

## Before and after

Every opening is captured at **1440, 768, 390 and 320 px**, all with a 1000px viewport height. V1 uses the verified branch’s development server; its developer indicator can be visible. V2 uses the ordinary static production export. Anchor destinations and narrative moments match. Reduced motion is enabled for deterministic captures; ordinary-motion browser checks also ran.

| Moment | Before desktop | After desktop | Before mobile | After mobile |
|---|---|---|---|---|
| Entrance | [V1](before/opening-1440.jpg) | [V2](after/opening-1440.jpg) | [V1](before/opening-390.jpg) | [V2](after/opening-390.jpg) |
| The brother | [V1](before/brother-1440.jpg) | [V2](after/brother-1440.jpg) | [V1](before/brother-390.jpg) | [V2](after/brother-390.jpg) |
| The appearance | [V1](before/appearance-1440.jpg) | [V2](after/appearance-1440.jpg) | [V1](before/appearance-390.jpg) | [V2](after/appearance-390.jpg) |
| Jerusalem | [V1](before/jerusalem-1440.jpg) | [V2](after/jerusalem-1440.jpg) | [V1](before/jerusalem-390.jpg) | [V2](after/jerusalem-390.jpg) |
| The record | [V1](before/record-1440.jpg) | [V2](after/record-1440.jpg) | [V1](before/record-390.jpg) | [V2](after/record-390.jpg) |
| What remained | [V1](before/remained-1440.jpg) | [V2](after/remained-1440.jpg) | [V1](before/remained-390.jpg) | [V2](after/remained-390.jpg) |

All sizes: [before](before/), [after](after/). Important states: [Antioch desktop](interactions/antioch-1440.jpg), [Antioch mobile](interactions/antioch-390.jpg), [source comparison at 320px](interactions/witnesses-320.jpg), [citizens’ objections](interactions/objections-390.jpg), [city-to-record cut](interactions/city-to-record-390.jpg), [transmission](interactions/transmission-768.jpg), [image failure](interactions/image-failure-390.jpg), [200% text](interactions/text-200-320.jpg). Contact sheets are derived from real captures, not mockups.

The authoring agent inspected full desktop openings, mobile scene and interaction captures, and tablet/narrow contact sheets. This demonstrates changed composition and observed usability; it does **not** demonstrate an emotional or comprehension outcome. No reader study was performed.

## Visual production and evidence

Two original paintings, four local WebP derivatives: **861,556 bytes total**. Mobile uses 768px assets (95,970 and 111,778 bytes), desktop 1536px (272,782 and 381,026 bytes). All are static, 3:2. No runtime image service, paid API or new production dependency. The existing Next 16.1.6 static-export `unoptimized` configuration remains unchanged; native `picture` selects responsive files.

[Complete visual manifest](../../public/media/james/manifest.json): source/rights, author and generation method, exact prompt and corrective edit, date, checksums, dimensions, file sizes, intended scene and limitations. [Exact generation calls’ prompt archive](generation-prompts.json); [local derivative preparation](prepare-assets.mjs). The model name is not exposed by the built-in image tool. Generation is not deterministic; the checked-in selected derivatives are the reproducible local bytes.

Archaeological references are separate from modern artistic reconstruction references. No reference images were reused. The IAA Nazareth abstract was read; its full PDF returned 403. The Israel Museum model depicts 66 CE and cannot authenticate a James-era street. Detailed houses, Temple proportions, city layout, clothing, vegetation, viewpoint and people remain imagined. The initial Galilee output contained prickly pear cactus; a generation edit removed it before use. No named historical individual is depicted. Human historical/artistic review remains pending.

## Verification

Final verification results are recorded in `verification.json` and `full-browser-results.json`.

| Command / observation | Result |
|---|---|
| `npm ci` | Passed; pinned graph unchanged. Installer reported 38 advisories, also documented in V1. No dependency remediation in this visual revision. |
| `npm run lint` | Passed, four unchanged warnings in `DataLoader.tsx` and `validate-nineveh-depth.mjs`. |
| `npm run typecheck` (`tsc --noEmit`) | Passed. |
| `npm run test` | 54 passed, one existing opt-in export test skipped, zero failed. Includes three new visual inventory/provenance/transfer-budget checks. |
| `npm run build` | Passed, including `validate:story`, pinned James WEB snippets, historical/media tests and postbuild `validate:export`; 444 artifacts inspected. |
| Full `npm run test:e2e -- --reporter=line,json` | Two complete V2 runs: each 189 passed, one existing mobile Atlas skip, zero failed/flaky. The last full run at runtime `064858c` took 320 seconds. After the final neutral fallback wording/capture refinement (`62eda24`), all 14 focused James checks passed again. [Full results](full-browser-results.json), [focused final results](focused-browser-results.json). |
| `node scripts/capture-james-v2.mjs after` | Four widths, all five movements: no console errors, failed requests, HTTP errors or normal-text horizontal overflow. See [observations](after/observations.json). |
| `node scripts/review-james-v2.mjs` | Interaction, transition, source, image-failure and 200%-text captures. No horizontal overflow at any of the four enlarged-text widths. See [observations](interactions/observations.json). |
| Keyboard, touch, history, fragments | Focused browser tests cover Tab/Enter/Space/Escape, focus restoration, direct scene fragments, Back, mobile tap selection and source switching. |
| No JavaScript | Five scenes, native Record disclosures, all relationship perspectives and complete source directory remain available; companion reading remains uninterrupted. |
| Reduced motion / missing image | Complete static scene compositions; all image requests intentionally blocked in the failure check, typography and narrative remain usable. No audio dependency. |
| Accessibility | Axe scans cover every scene and source dialog at desktop and mobile. Keyboard, reflow, focus and enlarged-text checks are additional observed tests; no claim of complete WCAG conformance. |
| `git diff --check` | Passed. Unrelated home-discovery screenshots preserved; generated `next-env.d.ts` restored. |

Corrections during verification: 320px evidence-control overflow and 768px movement-rail overflow at 200% text; measured sticky offsets; capped control height; stale movement selection after reflow; missing heading space. Initial new tests also had invalid exact-text selectors for numbered summaries and attempted Playwright CSS injection into a JS-disabled page (hang). Those test harness errors were corrected; enlarged text is verified separately. A case-sensitive artistic-reference assertion was corrected. Browser launch initially required installed Chrome and sandbox escalation. No product validation was disabled.

The first focused browser run had 9 passes and 5 failures (reflow and the new summary selectors). The next had 12 passes and 2 JS-disabled CSS-injection timeouts. After correcting those causes, the final local and final preview runs each passed 14/14. The expanded unit provenance test briefly reported 53 passes, 1 failure and 1 inherited skip because its reference-category match was case-sensitive; the corrected full unit run passed 54 with the inherited skip. Build and type checks were never disabled to make these results pass.

The auto-created Vercel previews at runtimes `064858c` and final `62eda24` each passed all 14 James checks, including desktop/mobile axe scans, with no skipped or flaky checks. The first mobile smoke capture preceded lazy image decoding; the capture script now waits for the actual image. A neutral location card supports both loading and image failure without prematurely declaring an error.

Final tested preview: [enter James](https://biblemap-mx2ms9cng-elliotandersons-projects.vercel.app/human-story/james/), deployment `dpl_FZ8eW887qDkEEsfCtUtCjJvMQDpW`, Vercel READY, preview target (not production). [Preview results](preview-browser-results.json), [mobile Jerusalem](preview-jerusalem-390.jpg), [mobile Record](preview-record-390.jpg), [smoke observations](preview-observations.json). Evidence-only pushes may create additional previews with identical runtime code.

## Remaining creative weaknesses

1. The paintings establish inhabited environments, but anonymous people remain small; relationships are conveyed through text and controls rather than embodied characterization. No invented portrait is proposed as evidence.
2. Josephus’s rupture is spatial and typographic. It could develop a more physically expressive transition without staging the killing or adding unsupported dialogue.
3. The final transmission comparison remains relatively dense, and the entrance/brother movement reuse one landscape at different scales. More differentiated framing could improve pacing after reader observation.

Historical kinship interpretations, the identity of the James in 1 Corinthians 15:7, the relationship between Acts and Galatians, Josephus’s textual transmission and later death traditions retain the existing dossier’s qualifications. Unbriefed reader observation and human editorial review remain necessary before making claims about comprehension or release readiness.
