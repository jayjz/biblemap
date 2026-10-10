# Jonah question entry — creator review prototype

Implemented from `main` at `e5e1b16` following [the proposal](jonah-question-entry-proposal.md). All new questions and invitation copy are **provisional editorial drafts for creator review**, not Scripture, approved narration, or research findings.

## Behavior

Three optional native radio choices invite reflection on avoidance/responsibility, consequences for others, and mercy. Selection replaces one nearby invitation in a polite live region. It stays in React memory: no scoring, storage, URL personalization, analytics, automatic progression, or requests. The native document entry link does not prefetch Jonah.

The common “Enter the story” link always opens `/jonah/#jonah-1-calling` at Jonah 1:1, whether a question was chosen or skipped. Without JavaScript, the default invitation and entry link remain available. No loading or error state is introduced by selection because it uses only local copy. The reader, Scripture, scene sequence, media rights, research archive, atlas, and Exodus implementation are unchanged.

Native radio marks, bronze text/background, quiet row separators, and visible focus distinguish state. Arrow keys change choices; Tab continues to the entry link. Existing typography and CSS sea composition remain, with a softer moon on narrow screens for title legibility. No new dependencies or animation.

## Review decisions

- Confirm the three questions and four invitations sound welcoming to first-time readers.
- Approve the revised consequences question (“What happens when our choices reach beyond us?”), mercy question (“Why can mercy be hard to offer?”), and mercy invitation (“Carry that question with you. Begin with the words Jonah hears, and let the story unfold.”). These are provisional human questions, not explanations of Jonah’s motives or Jonah 4:2.
- The avoidance question and remaining invitations also remain provisional; no creator approval is inferred.
- Observe actual reader reactions before claiming the experience succeeds; technical checks cannot establish emotional response.

## Refinement

Homepage entry now uses a native document link to the existing stable scene fragment. This avoids a verified focus race between Next’s cross-route fragment navigation and the reader’s heading focus. With JavaScript, the reader focuses Calling; without it, the browser follows the article anchor. Direct `/jonah/` visits retain the introduction, and existing reader navigation, history and other scene links are unchanged. No reader implementation changes were needed. The homepage introduction and journey title are smaller; larger serif questions and open rows give the invitation more prominence without replacing native controls. No dependencies were added.

## Original prototype verification

`npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` pass. Lint retains three existing unused-symbol warnings in `DataLoader.tsx`; no validation was disabled. The build needs network access for the existing Google Fonts fetch. Dependency installation reports 36 existing audit vulnerabilities; dependency changes are outside this focused diff. Full Playwright run: **41 passed, 1 skipped** (the existing desktop-only explorer test skips mobile). Actual default, selected, keyboard-focus, and narrow-mobile screenshots were inspected. Homepage checks report no console errors or failed resource requests. Homepage Playwright coverage runs in desktop and mobile projects and captures default, selected, keyboard-focus, and 320px states. It checks every choice and the skip path at Jonah 1:1, no selection requests/storage/URL changes, reload reset, keyboard controls, reduced motion, horizontal overflow, WCAG axe checks, and entry without JavaScript. The complete existing suite also checks reader, atlas, media fallbacks, and authorship boundaries.


## Refinement verification (2026-10-10)

- `npm ci` passed after the sandbox blocked esbuild’s install check; the existing 36 audit findings remain, with no dependency changes.
- `npm run lint` passed with the same three unused-symbol warnings in unchanged `DataLoader.tsx`; `npx tsc --noEmit`, `npm test` (2 test files), and `npm run build` passed. Static export and pinned Scripture/media validation passed.
- Full final Chrome Playwright suite: **43 passed, 1 skipped** (existing mobile explorer skip). An earlier interrupted run exposed the cross-route Link focus failure; the native document link fixes it without changing the reader.
- Real desktop (1440px) and mobile (390px, 320px) initial, question, selected/focused, and Scripture-entry screenshots were inspected. No console errors or non-cancelled resource failures appeared in these captures. Suite checks include axe, keyboard, reduced motion, no-JavaScript entry, reload, Back/Forward, direct reader introduction, other scene deep links, no selection requests/storage/URL changes, media fallback, and all 48 verses.
- Subjective remaining weaknesses: the abstract homepage headline still precedes recognition; long questions wrap to three lines at 320px; the CSS sea remains schematic. Larger question typography and open rows improve prominence without proving an emotional response. Creator approval and first-time reader feedback remain necessary for the provisional copy.
