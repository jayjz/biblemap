---
name: biblemap-visual-review
description: Evaluate and improve BibleMap's immersive biblical storytelling through actual browser screenshots, Playwright, historical artwork, typography, mobile layouts, navigation, accessibility, and before-after visual comparisons.
---

# BibleMap Visual Review

## Objective

Make BibleMap feel like an immersive exploration of human stories,
not a documentation interface.

Technical correctness is necessary but does not establish visual quality.

## Observe before changing

1. Read the relevant source and applicable AGENTS.md.
2. Inspect the existing page, assets, and interactions.
3. Launch the existing application.
4. Capture actual desktop and mobile screenshots with Playwright.
5. Identify the most consequential visual weaknesses.

Evaluate:

- Does Scripture command attention?
- Does the artwork contribute meaning?
- Is the human tension recognizable?
- Is geography part of discovery rather than decoration?
- Do secondary disclosures interrupt the narrative?
- Is the visual hierarchy effective on mobile?
- Do scenes have an appropriate rhythm?
- Can the visitor understand the experience without prior expertise?

## Improve selectively

Prefer:

- Meaningful historical artwork
- Strong typography and composition
- Intentional whitespace and pacing
- Optional interpretation
- Immersive geography and contextual discovery
- Accessible interactions
- Distinct visual treatment for different passages

Avoid:

- Repetitive cards
- Generic atmospheric filler
- Decorative motion without narrative purpose
- Visible internal approval language
- Overwhelming source notes
- Unnecessary explanatory UI
- Invented creator narration

Do not publish unresolved-rights imagery.

## Verify

Capture before-and-after screenshots.

Run relevant:

- Unit and validation tests
- Lint
- Typecheck
- Production build
- Playwright browser tests
- Keyboard and accessibility checks

Inspect console errors, failed requests, responsive behavior,
and media fallbacks.

## Deliver

Report concisely:

1. What improved for the visitor.
2. Which scenes were inspected.
3. What tests actually passed.
4. The largest remaining weakness.
5. Screenshot and preview locations.

Do not expand scope into unrelated redesigns.
