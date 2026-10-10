# Jonah question entry — creator review prototype

Implemented from `main` at `e5e1b16` following [the proposal](jonah-question-entry-proposal.md). All new questions and invitation copy are **provisional editorial drafts for creator review**, not Scripture, approved narration, or research findings.

## Behavior

Three optional native radio choices invite reflection on avoidance/responsibility, consequences for others, and mercy/resentment/forgiveness. Selection replaces one nearby invitation in a polite live region. It stays in React memory: no scoring, storage, URL personalization, analytics, automatic progression, or requests. Jonah prefetch is disabled on the entry link.

The common “Enter the story” link always opens `/jonah/` at Jonah 1:1, whether a question was chosen or skipped. Without JavaScript, the default invitation and entry link remain available. No loading or error state is introduced by selection because it uses only local copy. The reader, Scripture, scene sequence, media rights, research archive, atlas, and Exodus implementation are unchanged.

Native radio marks, bronze borders/background, and visible focus distinguish state. Arrow keys change choices; Tab continues to the entry link. Existing typography and CSS sea composition remain, with a softer moon on narrow screens for title legibility. No new dependencies or animation.

## Review decisions

- Confirm the three questions and four invitations sound welcoming to first-time readers.
- Confirm the forgiveness question opens space for mercy and resentment without prescribing a conclusion.
- Observe actual reader reactions before claiming the experience succeeds; technical checks cannot establish emotional response.

## Verification

`npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` pass. Lint retains three existing unused-symbol warnings in `DataLoader.tsx`; no validation was disabled. The build needs network access for the existing Google Fonts fetch. Dependency installation reports 36 existing audit vulnerabilities; dependency changes are outside this focused diff. Full Playwright run: **41 passed, 1 skipped** (the existing desktop-only explorer test skips mobile). Actual default, selected, keyboard-focus, and narrow-mobile screenshots were inspected. Homepage checks report no console errors or failed resource requests. Homepage Playwright coverage runs in desktop and mobile projects and captures default, selected, keyboard-focus, and 320px states. It checks every choice and the skip path at Jonah 1:1, no selection requests/storage/URL changes, reload reset, keyboard controls, reduced motion, horizontal overflow, WCAG axe checks, and entry without JavaScript. The complete existing suite also checks reader, atlas, media fallbacks, and authorship boundaries.
