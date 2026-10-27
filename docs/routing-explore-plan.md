# Root routing and atlas navigation — 2026-10-27

Baseline: `main` at `1085225879f9a4ffe83d16144219595a50208e9f`.
Branch: `feat/root-routing-explore-20261027` in an isolated checkout. Existing checkouts and uncommitted Jonah work are preserved.

## Findings and bounded implementation

1. Reproduce the UTM failure before changing production code. `NinevehHome.legacyAtlasLink` currently sends every query string to WebGL. Recognize supported atlas selectors instead; ignore tracking/unknown queries and ordinary anchors. Preserve epoch/book hashes, event links, story-place links and explicit `explore=1`.
2. Keep the existing Nineveh homepage and its beat/discovery fragments. Add a visible `/explore/` entrance; make reader exits use that canonical route. Give the atlas visible links back to the homepage and Jonah. Keep the current epoch controls and Exodus journey intact.
3. Add pure routing tests and desktop/mobile browser regressions for tracking, discoveries, skip links, refresh/history, canonical navigation, legacy event/place/epoch links and Exodus. Capture and inspect screenshots, accessibility and runtime diagnostics.
4. Execute the repository's dependency install, story/media integrity checks, unit tests, lint, typecheck, production export and both browser suites. Record limitations separately. No merge or deployment.

Out of scope: new narrative, theology, art, datasets, chronology changes, library upgrades, a visual redesign, and changes to Exodus development.

## Visual and navigation audit

The supplied screenshots were retrieved from the referenced conversation and inspected: one shows the Nineveh encounter; the other shows the mobile atlas at 4004 BC. The routing predicate explains the mismatch for `?utm_source=chatgpt.com`. The Nineveh screenshot has a readable editorial hierarchy and explicit links to Jonah 1:1, but no visible general atlas entrance. The reader has two old root-query map exits. The atlas lacks a clear general return to the homepage or full Jonah reader; its mobile menu also lacks an accessible name. The existing mobile atlas interaction skip remains a documented baseline limitation, not proof of mobile coverage.

The homepage is a contextual entry late in Jonah, not a neutral full-book introduction. Preserve its explicit orientation and beginning-of-book links; broader homepage storytelling and art direction remain the creator's decision.

## Research consulted

- [Next.js 16.1.6 useSearchParams](https://github.com/vercel/next.js/blob/v16.1.6/docs/01-app/03-api-reference/04-functions/use-search-params.mdx): keep the atlas hook beneath Suspense for static rendering. Preserve static export and server-rendered homepage metadata.
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports): solve classification in the client compatibility layer, without server-only redirects.
- [Vercel web-design-guidelines skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) and [primary guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md): useful for keyboard focus, link semantics, motion, responsive controls, and navigation/state review. Treat as review guidance, subject to BibleMap's instructions.
- [Anthropic frontend-design skill](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md): useful for subject-specific design, restraint and screenshot critique. Suitable for a future creator-directed design pass, not justification to replace this project's visual identity. Its repository lists separate license terms; no skill or third-party code is copied or installed here.

Recommendation: use Vercel's review checklist for this routing pass; reserve a deliberate visual-direction exercise for a separate approved design change. Skills do not substitute for user testing or settle editorial choices.
