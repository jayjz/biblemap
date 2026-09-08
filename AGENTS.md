# BibleMap Agent Instructions

## Mission

BibleMap is an immersive, human-centered journey through biblical geography, narrative, theology, history, and art.

The product should help a person experience the relationships between Scripture, place, time, movement, and meaning. It is not merely a database visualization, generic Bible application, AI chatbot, or collection of decorative effects.

The intended experience combines:

- Interactive biblical geography
- Chronological exploration
- Guided cinematic journeys
- Scripture and cross-references
- Human narration and environmental sound
- Historically contextual art and artifacts
- Clearly labeled interpretive reconstructions
- Transparent sources, uncertainty, and competing scholarly conclusions

Immersion must come from coherence, meaning, pacing, sound, geography, and visual storytelling—not from maximizing animation.

## Product Principles

1. Scripture is primary. Commentary, chronology, geography, art, and generated material are supporting layers.
2. Never fabricate a verse, quotation, source, archaeological claim, historical date, place identification, or theological consensus.
3. Distinguish explicitly between:
   - Biblical text
   - Historical or archaeological evidence
   - Traditional interpretation
   - Denominational or theological interpretation
   - Scholarly inference
   - Speculation
   - AI-generated reconstruction
4. Uncertainty is part of the product. Represent disputed dates and locations instead of silently selecting one.
5. Do not present an artistic depiction as a historically accurate reconstruction.
6. Do not present one chronology, including Ussher chronology, as uncontested history.
7. The tone should be reverent, accessible, intellectually serious, and welcoming.
8. Avoid manipulative engagement systems, trivial gamification, fake urgency, addictive streak mechanics, or sensational theology.
9. Do not add an in-app AI chatbot unless explicitly requested and supported by a source-constrained design.
10. Generated theology or historical content cannot ship without identifiable sources and human review.

## Experience Direction

The visual identity should feel like ancient material culture interpreted through a modern cinematic atlas:

- Warm stone, parchment, bronze, lapis, desert night, firelight, and natural earth tones
- Clear modern typography and navigation
- Atmospheric depth without sacrificing readability
- Editorial restraint rather than generic glassmorphism or cyber-neon UI
- Motion that communicates travel, chronological change, discovery, or theological emphasis
- Art and sound used at narratively meaningful moments
- A contemplative pace with immediate user control

The primary experience modes are:

- Explore: freely navigate places, events, books, and time
- Journey: follow a curated story through sequential locations
- Sources: inspect passages, provenance, confidence, chronology, and alternative interpretations

Do not build three disconnected applications. These are layers of one coherent experience.

## Current Technical Context

The current application uses:

- Next.js App Router
- React and TypeScript
- Deck.gl
- MapLibre
- Apache Arrow
- Parquet
- Python ETL with PostgreSQL/PostGIS
- Static export deployment

Known stabilization concerns must be verified rather than assumed:

- A lazily imported component named `Map` may shadow the global JavaScript `Map` constructor.
- `useSearchParams` may sit outside the effective Suspense boundary.
- TypeScript validation is disabled during builds.
- Minifier and constructor workarounds may be masking root defects.
- `DataLoader.tsx` is an oversized component.
- UI, ETL, and Parquet epoch definitions may have drifted.
- Data and media attribution are incomplete.
- Automated browser coverage is missing.

## Repository Workflow

Before editing:

1. Read this file.
2. Read the nearest nested `AGENTS.md` for every directory being modified.
3. Inspect `git status`, the active branch, repository structure, package scripts, and relevant documentation.
4. Reproduce reported failures before attempting fixes.
5. Separate verified defects from assumptions.
6. State a concise plan for multi-step work.
7. Preserve unrelated user changes.

Work on a task-specific branch. Do not commit directly to `main`.

Do not commit, push, open a pull request, publish, or deploy unless explicitly authorized.

Prefer focused, reviewable changes. Avoid mixing stabilization, architecture changes, content expansion, and visual redesign in one diff.

## Engineering Rules

- Fix root causes before adding configuration workarounds.
- Do not disable TypeScript, ESLint, tests, React Strict Mode, accessibility checks, or browser checks to make CI green.
- Do not add `any`, `@ts-ignore`, unsafe assertions, silent catches, or global error suppression without a documented and narrowly scoped reason.
- Prefer `@ts-expect-error` only when the failure is intentional and explained.
- Do not name an imported component `Map`, `Set`, `Date`, `Error`, `Promise`, `Object`, or another JavaScript global.
- Centralize shared domain constants such as epochs, book order, event types, routes, and schemas.
- Stable domain identifiers must not depend on array position or display names.
- Avoid loading production data from unversioned runtime sources.
- Preserve static export compatibility unless an architectural decision explicitly changes deployment.
- New production dependencies require justification and an assessment of bundle, licensing, maintenance, and security impact.
- Keep WebGL rendering code isolated from editorial content and application orchestration.
- Prefer small components, pure transformations, typed schemas, and deterministic data pipelines.
- Treat performance and accessibility as correctness requirements.

## Required Verification

For code changes, run the applicable checks:

```text
npm ci
npm run lint
npx tsc --noEmit
npm run build
npm run test
npm run test:e2e

A command that does not exist should be reported, not falsely claimed as passing. Add missing test commands when the task includes establishing that test layer.

For Python or ETL changes, run relevant focused tests and data validation. Do not require a production database merely to validate pure parsing or schema logic.

For visual changes:

Inspect the result in a real browser.
Check desktop and mobile.
Check loading, empty, error, and selected-event states.
Check keyboard navigation.
Check reduced-motion behavior.
Report console errors and failed network requests.
Compare screenshots when visual references exist.
Definition of Done

A task is complete only when:

The requested behavior exists.
Relevant tests pass.
Build, lint, and type-check pass or remaining failures are explicitly documented as pre-existing with evidence.
Error and fallback states have been considered.
Accessibility and responsive behavior have been checked.
Data, media, theological, and historical claims remain traceable.
The final diff contains no unrelated changes.
The final report lists changed files, verification performed, assumptions, and remaining risks.
Code Review Rules

Flag as high priority:

Fabricated, unattributed, or misleading content
Loss of source or licensing metadata
Conflation of biblical text with commentary or reconstruction
Unlabeled uncertainty
Incorrect event chronology or location mapping
Broken keyboard or reduced-motion behavior
Main-thread work that damages interaction during timeline or map movement
Runtime network dependencies that can break the core experience
Disabled validation or hidden errors
Changes that make a cinematic effect impossible to test deterministically