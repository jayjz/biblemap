# BibleMap

**Ancient stories. The human condition. Questions that stay with us.**

BibleMap is a human-authored exploration of biblical stories through Scripture, geography, historical art, theology, and reflection. The goal is to invite curiosity and personal recognition—not prescribe what to believe.

The first complete reading experience is **[Jonah: The Man Who Ran](https://biblemap-git-feat-jonah-visual-assets-elliotandersons-projects.vercel.app/jonah/)**. It is currently a **public preview on a feature branch**, not an approved editorial release or a deployment from `main`.

## What works today

- **Jonah reader** (`/jonah/`): all four chapters of the World English Bible (48 verses), organized as 13 scenes across six movements. The opening invites recognition without assigning Jonah a motive before the text reveals it (Jonah 4:2).
- **Artwork:** three approved public-domain museum-image placements, with provenance and rights information. Other acquired reproductions remain excluded pending review.
- **Reading tools:** optional context, linked sources, private in-memory reflection, keyboard navigation, reduced-motion support, and a no-JavaScript reading fallback.
- **Homepage** (`/`): three optional human questions change a short invitation into Jonah; every entry begins at Jonah 1:1. Copy is provisional for creator review. Job, Jacob, Exodus, and Joseph are marked as future experiences.
- **Biblical atlas** (`/explore/`): the existing WebGL geography/chronology explorer remains available. It is not yet fully integrated into Jonah's narrative flow.

**Still unfinished:** original authorial narration and several editorial reviews; richer place-based experiences; creator review of the interactive Jonah homepage copy. These items still need development or review. Unfinished Exodus work exists separately and must be preserved.

## Explore the preview

- [BibleMap homepage](https://biblemap-git-feat-jonah-visual-assets-elliotandersons-projects.vercel.app/)
- [Jonah reading experience](https://biblemap-git-feat-jonah-visual-assets-elliotandersons-projects.vercel.app/jonah/)
- [Atlas](https://biblemap-git-feat-jonah-visual-assets-elliotandersons-projects.vercel.app/explore/)

These are Vercel **Preview** URLs associated with `feat/jonah-visual-assets`; availability may change when branches or deployment protection settings change. Do not treat them as the `main` release.

## Development

The current app uses Next.js 16 App Router, React 19, TypeScript, Deck.gl/MapLibre, and a static export. Node.js and npm are required; use the Node version compatible with the repository's locked dependencies (the verified Codex run used Node 22).

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. To build and inspect the static export:

```bash
npm run build
npm run preview
```

`npm run preview` serves `out/` locally on port 4189. The separate `npm run review:jonah` workflow is for local artwork and editorial inspection, **not a public route**.

### Verification

```bash
npm run validate:story
npm run validate:media
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

`npm run validate:release` intentionally remains stricter: it rejects unfinished editorial approvals. A passing build or Vercel deployment does not confer creator approval.

## Source and editorial boundaries

Scripture is presented with translation attribution and source information. Later artworks are **artistic reception**, not visual evidence of ancient events. Historical identifications and theological interpretations must distinguish evidence, tradition, uncertainty, and personal reflection. Publication rights and scene placements are explicitly reviewed.

The human creator retains final authority over storytelling, selection, interpretation, and artistic direction.

## Documentation and GitHub workflow

- [Jonah V1 status and approvals](docs/jonah-v1.md)
- [Recognition-first opening: implementation record](docs/jonah-recognition-opening.md)
- [Jonah preview verification](docs/jonah-preview-verification.md)
- [Question-led homepage prototype and review decisions](docs/jonah-question-entry-implementation.md)
- [Original question-entry proposal](docs/jonah-question-entry-proposal.md)
- [Research and artwork records](docs/research/)
- [Agent and contribution rules](AGENTS.md)

The `docs/question-led-homepage.md` task note describes an **earlier chapter-one checkpoint** and is preserved as historical context, not a current feature inventory. PRs [#3](https://github.com/jayjz/biblemap/pull/3) and [#4](https://github.com/jayjz/biblemap/pull/4) are stacked; review ancestry before merging or closing either. Do not merge or delete unfinished Exodus branches as part of Jonah integration.

## License

See [LICENSE](LICENSE). Third-party Scripture, artwork, and research sources retain their separately documented rights and attribution requirements.
