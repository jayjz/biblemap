# BibleMap Frontend and Experience Instructions

These instructions extend the repository-root `AGENTS.md` for work under `src/`.

## Human Experience Goal

Every interaction should answer at least one meaningful human question:

- Where did this happen?
- What changed here?
- Who traveled?
- What Scripture describes it?
- What came before and after?
- Why does this matter within the biblical narrative?
- What is historically supported, traditional, disputed, or unknown?

Do not add motion, imagery, sound, text, or controls without identifying their narrative purpose.

## Experience Architecture

Organize the frontend into explicit systems:

- Map and rendering
- Timeline and chronology
- Events and places
- Guided journeys
- Media and art
- Narration and sound
- Scripture and editorial content
- Sources and uncertainty
- Application state and deep links
- Diagnostics and deterministic test scenes

Do not rebuild these systems inside one monolithic component.

Suggested boundaries may include:

```text
src/
  components/
  content/
  domain/
  features/
    explorer/
    journeys/
    media/
    sources/
    timeline/
  lib/
  scenes/
  styles/

Adapt this structure to the existing application incrementally. Do not perform a repository-wide rewrite merely to match the suggestion.

Visual Direction

Use a restrained cinematic language:

Dark terrain and night-sky depth for the map
Warm illuminated surfaces for Scripture and story panels
Bronze or amber for active paths and meaningful highlights
Lapis, Tyrian purple, earth, water, and stone as supporting colors
Editorial typography that remains readable
Subtle material texture
Clear hierarchy between map, narrative, Scripture, and evidence

Avoid:

Generic SaaS dashboards
Excessive glass panels
Cyberpunk neon
Constant particle noise
Decorative animations without narrative meaning
AI imagery presented without context
Tiny low-contrast text
Controls that obscure the map on mobile
Story Flight

A guided journey should behave as a sequence of authored scenes.

Each scene may define:

Stable scene ID
Event or passage IDs
Camera position and transition
Date or chronological range
Route segment
Narration cue
Ambient sound cue
Artwork or artifact cue
Scripture cue
Source cue
Duration suggestion
User interaction options

The user must always be able to pause, resume, skip, replay, exit, mute, or inspect sources.

Do not autoplay sound before user consent.

Motion

Motion must communicate:

Travel
Chronological movement
Geographic scale
A transition between narrative moments
A relationship between events
A change in viewpoint or evidence layer

Use a shared motion system rather than unrelated durations and easing values.

Respect prefers-reduced-motion. Reduced motion must preserve meaning through cuts, fades, static paths, captions, or step controls.

Avoid using React state updates on every pointer movement or animation frame when the renderer or an imperative animation controller can handle the work.

Scripture and Theology

Never generate or paraphrase Scripture and present it as a direct quotation.

For every displayed quotation retain:

Translation
Exact reference
Text source
Licensing status where applicable

Clearly label:

Scripture
Summary
Commentary
Devotional reflection
Historical note
Traditional interpretation
Scholarly interpretation
Reconstruction

Do not imply theological unanimity when traditions disagree.

When a theological interpretation is necessary:

Identify the interpretive lens.
Cite a source where appropriate.
Use measured language.
Preserve alternative readings when material.
Avoid turning inference into doctrine.

Generated summaries are drafts until reviewed. Do not describe them as vetted merely because an AI produced them.

Art and Media Presentation

Every artwork must display or make accessible:

Title
Creator, if known
Creation date
Holding institution or source
License or rights statement
Link to the source record
Classification:
artistic depiction
historical artifact
archaeological or landscape evidence
interpretive reconstruction
A note when the artwork was created much later than the depicted event

Generated media must be labeled Interpretive reconstruction.

Art should enhance the emotional or historical context without replacing the biblical text.

Accessibility
All primary functionality must work without a mouse.
Dialogs must manage focus and restore it when closed.
Controls require accessible names and visible focus.
Images require meaningful alt text; decorative images use empty alt text.
Narration requires a transcript.
Sound-only information requires a visual equivalent.
Color cannot be the only indicator of type, certainty, or state.
Touch targets must be usable on mobile.
Map-only information needs an accessible list or narrative representation.
URL and State Requirements

Important discoveries must be shareable.

Deep links should use stable IDs and preserve enough state to restore:

Selected event or place
Active journey and scene
Chronology model
Timeline position
Evidence or story mode when relevant
Camera state only when it materially affects the shared experience

Do not rely on an event’s array index or mutable display name.

Validate all URL-derived values before applying them.

Inspection Interface

Maintain a read-only development and test interface such as:

window.__BIBLEMAP__

It should expose serializable state only, including:

Application readiness
Active epoch
Current chronology and year
Loaded data chunks
Selected event and scene
Visible event count
Active journey
Media status
Narration status
Render or streaming counters
Recoverable errors

Do not expose secrets, mutable internal methods, licensed full-text corpora, or personal data.

Frontend Definition of Done

Before completing frontend work:

Exercise the feature through the user interface.
Verify deterministic test scenes.
Inspect desktop and mobile.
Verify keyboard behavior.
Verify reduced motion.
Verify missing-media behavior.
Verify the application remains usable with audio disabled.
Check browser console and network failures.
Confirm the map, narrative, Scripture, and source layers remain distinguishable.