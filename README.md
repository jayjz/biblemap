# BibleMap

**Ancient stories. The human condition. Questions that stay with us.**

BibleMap is a human-authored exploration of biblical stories through Scripture, geography, historical art, theology, and reflection. The goal is to invite curiosity and personal recognition—not prescribe what to believe.

The flagship **Jonah: The Man Who Ran** is implemented on `main` as a complete-text reading preview, not a finished, creator-approved authored experience. See the maintained [Jonah completion audit and blueprint](docs/jonah-completion.md) for the pinned repository baseline, scene matrix, source candidates and shortest completion path.

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

These are historical Vercel **Preview** URLs associated with `feat/jonah-visual-assets`; availability may change. Their feature integration is now on `main`, but these aliases do not identify its current deployment. The separate recognition-led `/opening-b/` experiment remains [draft PR #11](https://github.com/jayjz/biblemap/pull/11) at the audit baseline.

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
- [Maintained Jonah completion audit and blueprint](docs/jonah-completion.md)
- [Recognition-first opening: implementation record](docs/jonah-recognition-opening.md)
- [Jonah preview verification](docs/jonah-preview-verification.md)
- [Question-led homepage prototype and review decisions](docs/jonah-question-entry-implementation.md)
- [Original question-entry proposal](docs/jonah-question-entry-proposal.md)
- [Research and artwork records](docs/research/)
- [Agent and contribution rules](AGENTS.md)

The dated task notes describe earlier checkpoints, not current feature inventories or outstanding merge instructions. Inspect current GitHub state before acting. Preserve unfinished Exodus work, including the separately documented uncommitted work on another host; do not merge or delete its branches as part of Jonah completion.

## License

See [LICENSE](LICENSE). Third-party Scripture, artwork, and research sources retain their separately documented rights and attribution requirements.
