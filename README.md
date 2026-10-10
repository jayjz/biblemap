# BibleMap

**Ancient stories. The human condition. Questions that stay with us.**

BibleMap is a personal exploration of the Bible through story, place, art, history, and reflection. The intention is not to tell visitors what to think. It is to create room to read closely, understand the world around a passage, and recognize something of their own lives in it.

This is a work in progress and a human-authored passion project.

## Begin with Jonah

**Jonah: The Man Who Ran** is the first story being developed. It begins with a calling, a refusal, a journey away, and a storm. Across the book, the harder question emerges: why does Jonah resent the mercy that saves others?

The [Jonah reader](./docs/jonah-prototype.md) currently covers **Jonah chapter 1** as six reader-controlled scenes. All 17 verses appear with translation attribution. You can move at your own pace, examine named places and sources, and use optional reflection notes that are not saved.

It is an **author-review prototype**, not a finished experience: original narration, reflection questions, historical notes, and curated artworks have not been approved for publication. Chapters 2–4 are not yet implemented.

## Two ways into the story

- **Read a journey:** Scripture first, a scene at a time. Artwork, context, and perspectives should deepen attention—not interrupt or dictate a conclusion.
- **Explore the map:** The existing geographic explorer connects biblical events, places, and chronology. Its underlying data pipeline and visualization remain part of BibleMap, but geographic identifications and dates must be handled with appropriate uncertainty.

The reader and the explorer coexist. Neither should require an AI chatbot or a personal account.

## Run locally

Use the `feat/jonah-reader` branch, or a descendant that contains it.

```sh
npm ci
npm run dev
```

- Jonah reader: http://localhost:3000/jonah/
- Map explorer: http://localhost:3000/

For a production-style static preview:

```sh
npm run build
npm run preview
```

See [Jonah prototype notes](./docs/jonah-prototype.md) for preview port, validations, known issues, and the editorial release gate.

## What is underneath

Next.js App Router, React, TypeScript, Deck.gl, MapLibre, Apache Arrow/Parquet, and a Python/PostGIS-based data preparation pipeline support the current application. The Jonah reader is deliberately usable without WebGL, sound, or a live AI service.

- Story structure and author slots: `src/content/jonah.ts`
- Story contracts and validation: `src/domain/story.ts`
- Reader presentation: `src/features/story/`
- Biblical explorer: `src/components/DataLoader.tsx`
- Existing cinematic journey foundation: `src/scenes/`
- Historical context and media provenance: `src/content/`, `src/domain/`, `src/features/context/`, `src/features/media/`

**A source is not the same as a conclusion.** Biblical text, historical evidence, later artwork, theological readings, and artistic interpretation must remain distinguishable. Dates such as Ussher's 4004 BC are traditional chronologies, not established archaeological facts.

## Contributing and authorship

The author's voice is not a field for an agent to auto-complete. Suggestions, code, research leads, and accessibility improvements are welcome. Quotation, artwork, historical claims, theological interpretation, and final narrative language need traceable sources and human review.

Read [AGENTS.md](./AGENTS.md) for contributor and agent boundaries. The software carries an [MIT license](./LICENSE); **that does not automatically license scripture translations, third-party art, recordings, or quotations**.

The goal is simple: build something worth spending time with, not merely something impressive to render.
