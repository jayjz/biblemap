# Homepage discovery review

Scope: homepage, Saints collection, reading navigation. Jonah, Perpetua, Romanus and Exodus interiors and source content are unchanged.

Baseline: production `https://biblemap-pink.vercel.app/`, deployment `dpl_3RePRxky3rYTSFAzy7XtmhfFSioW`, source `b452100c3e14428419ab3662449794a6b312cd96`. The feature branches preserve PRs #36 and #37. Only the instruction update from `946eec0` was incorporated; the other requested instruction files were already identical.

## Findings and changes

| Priority / classification | Evidence and visitor impact | Correction |
| --- | --- | --- |
| P1, verified hierarchy defect | Only Perpetua had a dedicated entrance; Romanus required directory navigation. | Both lives appear immediately after the preserved Jonah opening, with direct semantic links and existing rights-verified artwork. |
| P1, verified affordance defect | “Enter the encounter” had no button boundary or underline. Several reading titles also resembled static headings. | Filled primary entrances, outlined thread/collection actions, underlined reading links, full linked directory rows, visible hover and keyboard focus. |
| P2, verified target measurement | A desktop navigation link measured 43.66px wide. The Atlas action was hidden below 1050px. | Navigation targets have a 44px minimum width and height; Atlas remains available on mobile/tablet. |
| P2, editorial hypothesis | Repeated full thread lists, five similar text columns and an always-visible research preview competed with story entry. | Short thread introductions with optional reading lists, concise collection invitations and connection previews opened on request. This hierarchy still needs observation with unfamiliar readers. |

## Visual evidence

Screenshots use matching viewport widths and reduced motion. `before/` is the actual production deployment; `after/` is the production static export. Runtime hashes in [after/revision.json](after/revision.json) identify the working-tree source, because the build ID alone uses the previous committed HEAD.

| View | Before | After |
| --- | --- | --- |
| Desktop homepage | [1440px](before/home-1440.jpg) | [1440px](after/home-1440.jpg) |
| Tablet homepage | [768px](before/home-768.jpg) | [768px](after/home-768.jpg) |
| Mobile homepage | [390px](before/home-390.jpg) | [390px](after/home-390.jpg) |
| Narrow homepage | [320px](before/home-320.jpg) | [320px](after/home-320.jpg) |
| Story entrances | [Desktop](before/encounters-1440.jpg) | [Desktop](after/encounters-1440.jpg) |
| Mobile entrances | [390px](before/encounters-390.jpg) | [390px](after/encounters-390.jpg) |
| Saints collection | [390px](before/saints-390.jpg) | [390px](after/saints-390.jpg) |
| Thread hierarchy | [Desktop](before/threads-1440.jpg) | [Desktop](after/threads-1440.jpg) |
| Five collections | [Tablet](before/worlds-768.jpg) | [Tablet](after/worlds-768.jpg) |
| Reading directory | [390px](before/directory-390.jpg) | [390px](after/directory-390.jpg) |

Additional states: [keyboard focus](after/focus-390.jpg), [selected connection](after/selected-390.jpg), [missing images](after/fallback-390.jpg). See [interaction checks](after/interaction-checks.json) and [measured bounds](after/observations.json).

Homepage heights decreased from 4,677 to 4,516px at desktop, 5,306 to 4,971px at tablet, 8,634 to 7,691px at 390px, and 9,739 to 8,519px at 320px. Saints reading rows intentionally have larger hit areas and a direct jump from the opening.

## Verification

- `npm ci`: passed. The existing lockfile audit reports 38 dependency vulnerabilities; no dependencies changed.
- `npm run lint`: passed, with four existing unused-variable warnings in unchanged `DataLoader.tsx` and `validate-nineveh-depth.mjs`.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed, including pinned Scripture, media and visitor-export validators. A sandbox worker-spawn failure was rerun successfully outside the sandbox.
- `npm run test`: 49 passed, one existing export-only check skipped; the build separately verifies the visitor export.
- Focused discovery and existing human-story checks passed. Final full-suite results are recorded in the draft PR and handoff.
- Homepage and Saints: zero axe WCAG A/AA findings at 1440, 768, 390 and 320px; no overflow, broken images, unexpected console errors or failed requests in the static captures. Automated success is not a conformance claim.
- Main story entrances: measured text contrast **8.57:1**, **48px** high; mobile widths **310px** at 390px and **240px** at 320px. This exceeds the 44px design target; WCAG AA's general minimum is 24px with exceptions.
- Keyboard skip, anchor focus, preview selection/return/close, empty search, 200% text, reduced motion, absent JavaScript and simulated image failure were exercised. Full paths include Perpetua's six scenes and sources, Augustine onward, Romanus's five movements and provenance, and the return to Perpetua.
- Existing images remain local, dimensioned and lazy-loaded below the opening. No new animation, library, runtime content service or image download was introduced. Field Web Vitals and screen-reader user testing were not measured.

## Changed files

Runtime changes are limited to `HumanStoryHome.tsx`, `FeaturedEncounters.tsx`, `ConnectedExplorer.tsx`, `PathPreview.tsx`, `EntryCards.tsx`, `WorldOpening.tsx`, the Saints links in `InteriorEncounters.tsx`, and their four CSS modules under `src/features/human-story/`. Supporting files: `tests/home-discovery.spec.ts`, `scripts/review-home-discovery.mjs`, the requested visual-review skill update, and this evidence folder.

Largest remaining weakness: the mobile homepage is still a long editorial journey. Clearer entrances and fewer competing controls are implemented, but an unbriefed reader study is still needed to establish whether newcomers recognize the choices and understand the source distinctions.

References checked: [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md), [Web Vitals field/lab distinctions](https://web.dev/articles/vitals).
