# BibleMap

**Ancient stories. The human condition. Questions that stay with us.**

BibleMap is a human-authored exploration of Scripture, ancient geography, visual culture, theology and reflection. The aim is discovery rather than telling visitors what to believe.

## Experience

- **Nineveh homepage (`/`)** — on [PR #30](https://github.com/jayjz/biblemap/pull/30) pending review: an optional four-beat encounter with Jonah 3:10–4:4, a source-disclosed illustrative city, seventh-century BCE archaeological context, early Christian artwork, and attributed theological voices. It explicitly offers the first chapter before the visitor proceeds. The city image is **interpretive**, not a documented historic view.
- **[Jonah: The Man Who Ran](/jonah/)** — the complete 48-verse World English Bible book in 13 scenes, with contextual resources, art, accessibility and the unanswered conclusion of Jonah 4:11.
- **[Atlas](/explore/)** — existing WebGL geographic and chronological exploration; legacy root deep links are preserved.
- **Exodus** — unfinished development remains separate and must not be deleted.

The proposed Nineveh homepage is available to review at [the PR #30 Vercel preview](https://biblemap-git-feat-nineveh-defin-1a3705-elliotandersons-projects.vercel.app/). The production site remains [biblemap-pink.vercel.app](https://biblemap-pink.vercel.app/) until the new PR is approved and merged. Passing CI does not imply historical/editorial publication approval.

## Evidence and media boundaries

The Nineveh opening distinguishes the biblical account, archaeological context, artistic reception, theological interpretation and an original stylized SVG city. Two historical/reception images are bundled for static delivery:

- Flood Tablet photograph by Fæ, [CC BY-SA 3.0](public/media/nineveh-depth/README.md), from Nineveh's seventh-century BCE literary culture—not evidence of Jonah's visit or a dating of the book.
- *Jonah Under the Gourd Vine*, 280–290 CE, [Cleveland Museum of Art, CC0](https://www.clevelandart.org/art/1965.239)—later Christian reception, not Jonah's portrait.

Source and reuse records: [Nineveh source ledger](docs/research/nineveh-depth-sources.md), [media manifest](src/features/nineveh/depth-media.json), [homepage code audit](docs/nineveh-homepage-audit-2026-10-25.md). Additional public-domain paintings, maps, original illustration and interpretive reconstructions are welcome when they serve the passage and have verifiable rights. Rights clearance remains a distinct requirement from creative selection.

## Development

Next.js App Router, React/TypeScript and static export, with Deck.gl/MapLibre for the existing atlas. Use Node 22 compatible with the lockfile.

```bash
npm ci
npm run dev
# To test the deployable static output:
npm run build
npm run preview
```

The old `/experiments/nineveh/` route remains opt-in for archival local review; its AI-generated matte painting is intentionally not part of the public static export. Do **not** enable `BIBLEMAP_NINEVEH_REVIEW=1` in production.

## Verification

```bash
npm run validate:story
npm run validate:media
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

CI also runs a separate gated Nineveh review-mode build and browser suite. The normal build validates that the homepage, rights-cleared images, and exported file checksums exist without publishing the old generated artwork. `npm run validate:release` intentionally remains stricter about unfinished human-authored copy and editorial claims.

## Contributing and editorial control

Start with [AGENTS.md](AGENTS.md), [experience principles](docs/experience-principles.md), and the [research](docs/research/) catalog. Preserve Exodus, the complete Jonah reader, accessibility, content provenance, and honest uncertainty. Creator authority over storytelling, theology and visual direction is final. New features should be reviewable in isolated PRs.

## License

See [LICENSE](LICENSE). The repository's software license does not override Scripture, artwork, historical-source or third-party data rights.
