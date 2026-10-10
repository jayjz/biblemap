# Frontend and story experience

Inherits the repository-wide `AGENTS.md`. Work in `src/` should make biblical stories easier to encounter, not simply add features to a map.

## Reader experience

- Begin with the passage and the reader's agency. Navigation, sound, art, and commentary are optional layers.
- The Jonah reader lives in `src/app/jonah/`, with authored material in `src/content/jonah.ts`, schema and validation in `src/domain/story.ts`, and UI in `src/features/story/`.
- The existing map explorer is a separate entry into the same material. Preserve its links, filtering, and selected-event behavior.
- Stories advance only on reader action. No timer, scroll position, or audio completion should force progress.
- Reflection is optional, private, and non-prescriptive. The prototype keeps notes in memory only; do not introduce storage or telemetry without authorization.
- Source panels should reveal evidence and disagreement without competing with the scripture itself.

## Visual design

Use typography, composition, silence, and careful pacing. Warm paper, weathered bronze, earth, sea, and shadow are suggestions, not a locked brand. Avoid generic dashboards, decorative motion, overstated historical realism, and filler art. Keep artwork metadata and uncertainty available.

## Implementation

- Keep the authored story model separate from rendering, map behavior, and media orchestration. Add abstractions only when a real second use case needs them.
- Preserve stable scene IDs and validated deep links. URL state must never contain private notes.
- Scripture must show exact translation attribution; commentary and artistic reconstruction must be clearly distinguished.
- Every approved artwork or recording needs source and rights metadata. A later painting is not direct evidence of the biblical event.
- Keyboard, screen-reader labels, clear focus, reduced motion, mobile reflow, and text-only reading are baseline requirements.
- Media failure must never block reading. Don't autoplay sound.
- Keep map and WebGL details outside story prose. Avoid adding runtime AI services.

## Verification

Use the checks that exist in `package.json`, including targeted tests, typecheck, lint, build, and Playwright when interactions change. For visual work, inspect an actual desktop and mobile rendering and test keyboard, reduced-motion, source disclosure, and failure behavior. Distinguish existing explorer defects from newly introduced regressions.

The required author review and intentionally failing release gate are documented in `docs/jonah-prototype.md`.
