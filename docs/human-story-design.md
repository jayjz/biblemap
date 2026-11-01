# Human Story: creative direction and implementation record

Draft for PR #36. The creator's [November 1 scope correction](https://github.com/jayjz/biblemap/pull/36#issuecomment-6561745828) supersedes the handoff's narrower one-bridge suggestion. This is an editorial review surface, not publication approval. Keep `/`, `/jonah/`, `/explore/` and existing deep links intact.

## Critique of the seed

The sunset is atmospheric but interchangeable: it reveals nothing about a particular life, text or historical relationship. Two destinations and three external references do not constitute an interconnected world. The explanatory boundary occupies more editorial attention than the discoveries it protects. The wordmark also takes visitors out of the experiment before they understand where they are. Preserve the direct Jonah entrance, semantic HTML and restrained pace; replace the composition, navigation and shallow connections.

## Three directions considered before implementation

| Direction | Mechanism and visitor discovery | Representation and rights |
| --- | --- | --- |
| **The living weave** | An original diagram of intersecting lives, paired with complete, attributed artworks and objects. Cool blue, mineral green and rose light; sculptural type. Travel from Scripture into a Roman record, a North African life, a translation dispute, then back to the text. | Lines express named editorial relationships, never undocumented influence, chronology or routes. Later art remains reception. Reuse only rights-cleared local assets. |
| **A theatre of voices** | A typographic score: opposing texts occupy different parts of a stage; a visitor brings one forward. Jonah, Jerome, a Roman official and a martyr each retain a speaking position. Graphite, chalk, cobalt; strong sans-serif typography. Optional commissioned music could expose differences in rhythm and language. | Risks making sources equivalent or turning testimony into performance. No synthetic historical voices. Audio would need rights, transcript, human review and explicit consent. |
| **Cities of memory** | A geographical section through Nineveh, Rome and Carthage: spatial drawings, architectural photographs and time controls reveal what survives and what is remembered. Porcelain blue, concrete grey and red ochre; architectural typography. | Risks invented ancient skylines, false precision and map dependence. Requires verified geographical layers, accessible textual equivalents and licenses for architectural photography. |

Choose **the living weave**. It supports all five worlds without imposing a common period costume, and its central visual device describes a real product behavior: following a relationship. Borrow the theatre's respect for distinct speakers and the city direction's insistence on place. Do not borrow their unbuilt sound or historical reconstructions.

## Composition and tokens

Palette: tidal blue `#153449`, mineral `#b9d7cc`, mist `#edf2f3`, rose `#edb8ac`, deep blue `#102b3b`, ink `#173344`. These are editorial surfaces, not claims about an ancient palette. Use the already self-hosted Playfair Display for large, humane display type and Geist for navigation, evidence and reading. No new font dependency.

```text
BibleMap / The human story        Stories Witnesses Saints Atlas Voices

The human       [full, attributed work]
story           [named connections across time]
one invitation  [direct entry into a real narrative]

Three authored paths, each crossing several worlds
  Scripture + place + reception / Roman account + life / text + language

Explore the connected world: people, texts, places and works
  search + world selection; every record has a way onward

Source boundaries and route back to Nineveh
```

Left align reading. Vary composition by content rather than repeating five identical category grids. Native links and disclosures work before hydration. Client interaction progressively filters an already rendered collection; it never fetches core content. No scroll traps, autoplay, timed reveals or decorative movement. Press feedback only on pointer activation, under 160ms; respect reduced motion. Keep each connection's kind, source and editorial review state inspectable.

## Original milestone plan (historical)

1. Entrance, five-world navigation, reusable reading shell, creative comparison and baseline screenshots.
2. Scripture-led reading rooms and a typed, validated relationship graph.
3. Roman/Jewish witnesses with passage-level evidence and scholarly limits.
4. Perpetua/Felicity and Augustine, separating autobiography, editorial framing and tradition.
5. Interpretive voices, art, language and Atlas links; multiple paths across worlds.
6. Browser refinement, keyboard/axe, responsive, reduced-motion, no-JS, missing media, ordinary and review regression suites.

This plan has concluded. The [verification record](human-story-verification.md) retains executed checks, commit history and editorial questions; the [review inventory](human-story-portal-study.md) describes the resulting implementation. These historical steps do not authorize another milestone.

## Initial workspace and baseline

Branch: `feat/human-story-portal`. Preserve the pre-existing `next-env.d.ts` change from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`, and the untracked Jonah/review artifacts. Never include them in milestone commits. `npm ci` completed; it reported 45 dependency audit findings (1 low, 23 moderate, 19 high, 2 critical). Dependency remediation is outside this design diff. Baseline lint has four warnings in existing pipeline/map files, zero errors. Baseline unit tests: 25 passing. Typecheck must follow build: an initial concurrent run encountered transient missing generated route types while Next rebuilt `.next`; do not parallelize these dependent operations.
