# BibleMap

**Scripture. Lives. A connected world.**

BibleMap explores Scripture, place, time, historical accounts and art through an immersive, human-centered experience. Authored and AI-assisted draft material supports the sources; it does not establish historical or theological consensus.

## Production and consolidated preview

`main` still defines the Nineveh entrance. Deployment state must be checked separately: Vercel's latest production-target record is `e92b476` on `feat/home-story-discovery`, **not** the consolidated Thomas branch. See the [readiness addendum](docs/release/readiness-audit-2026-11-05.md#current-addendum--thomas-homepage-integration) for the current domain inspection. Do not infer the live artifact from the branch name or the old README. The public domain is [biblemap-pink.vercel.app](https://biblemap-pink.vercel.app/).

`feat/human-story-consolidated` contains the unified Human Story entrance, retained Nineveh/Jonah/Atlas and draft narratives. Thomas PR [#42](https://github.com/jayjz/biblemap/pull/42) and readiness audit [#43](https://github.com/jayjz/biblemap/pull/43) are merged into that preview lineage at `2d504aa`. This is not a production release or editorial approval.

`feat/thomas-homepage-integration` adds Thomas's homepage invitation and reading discovery for draft review. The [integration record](docs/thomas-homepage-integration.md) contains the design comparison, screenshots and actual verification. **Production release approval remains blocked.**

## Experiences in this preview

| Entrance | Experience |
|---|---|
| `/`, `/human-story/` | Human Story portal: featured encounters, reading threads, five worlds and searchable readings |
| `/human-story/perpetua/` | *The Prison*: relationships, the surviving Passion and distinctions between its voices |
| `/human-story/romanus/` | *The voice they could not silence*: different surviving accounts and later memory |
| `/human-story/james/` | *The Brother Who Remained*: Jesus's brother through Paul, Acts, Josephus and later accounts |
| `/human-story/thomas/` | Thomas V3: five cinematic movements through John 20:24–29; absence, testimony, encounter and confession |
| `/human-story/thomas/reading/` | Complete simple Thomas reading, independent of cinematic imagery |
| `/human-story/thomas/sayings/` | **Separate** Gospel of Thomas sayings/manuscripts exploration: NHC II,2, Greek fragments, selected sayings 13 and 26, source/dating limits and uncertain authorship. Attribution does not authenticate apostolic authorship. |
| `/jonah/` | The complete 48-verse World English Bible book in 13 scenes, with context, art and source disclosures |
| `/nineveh/` | Preserved Nineveh encounter: biblical text, archaeological context, later reception and interpretive city imagery |
| `/explore/` | Deck.gl/MapLibre geographic and chronological Atlas; legacy root hash/query links remain supported |

Other Human Story readings remain available through Stories, Witnesses, Saints, Atlas and Voices, including Augustine and Genesis in art. **Exodus is unfinished development**: its existing reading/data and source work are preserved, without implying completion or release approval.

## Architecture

Next.js App Router, React and TypeScript produce a static export in `out/`. `RootEntrance` selects the Human Story portal while preserving legacy Nineveh/Atlas deep links. `HumanStoryFrame` shares world navigation. `FeaturedEncounters`, curated reading threads and `ConnectedExplorer` provide entrances into the same content.

`src/content/human-story.ts` assembles a typed, sourced graph validated by `src/domain/human-story.ts`. Standalone journeys can be curated destinations without invented graph entities or connections: Thomas uses this approach. Its cinematic, simple-reading and sayings routes share pinned sources but keep John's narrative distinct from the separately attributed collection. WebGL code stays in the Atlas rather than driving editorial pages.

The existing Python/PostGIS ETL and versioned Parquet/Arrow assets support the Atlas. A production database is not required to build the checked-in static experiences.

## Sources, media and review

Scripture quotations retain translation, references, licensing and pinned source checks. Biblical text, historical evidence, reception, interpretation, disputed inference and reconstruction retain separate identities. Source records and native disclosures preserve the limits of what survives.

Historical artwork, licensed images and original AI-assisted artwork coexist. Thomas V3's generated environments contain **anonymous invented figures**, not authentic portraits of Thomas, Jesus or eyewitnesses. Its [manifest](public/media/thomas/manifest.json) records exact prompts, responsive derivatives, checksums, rights and source limits. Reuse rights do not constitute historical or editorial approval. Modern typeset manuscript reading aids are labeled; they are not ancient facsimiles.

Start with the [Thomas dossier](docs/research/thomas-source-dossier.md), [Human Story sources](docs/research/human-story-sources.md), [Nineveh ledger](docs/research/nineveh-depth-sources.md) and [Nineveh media records](public/media/nineveh-depth/README.md). The software license does not override upstream rights.

## Development

CI uses Node **22.22.3**; the homepage integration was also checked locally on Node **24.22.2**. Use the committed lockfile with npm.

```bash
npm ci
npm run dev             # Next.js development server
npm run build           # source/media gates, static export, visitor-boundary validation
npm run preview         # serve out/ on http://127.0.0.1:4189
```

`npm run start` exists but invokes `next start`, which is unsuitable for this static-export configuration; use `npm run preview` for the built artifact.

## Verification

```bash
npm run validate:story
npm run validate:media
npm run lint
npx tsc --noEmit        # npm run typecheck is also supported
npm run test
npm run build
npm run validate:export
npm run test:e2e
npm run validate:release
```

Build before browser tests; Playwright serves `out/` automatically. Install Chromium when absent with `npx playwright install chromium`, or set `CHROME_PATH` to an installed Chrome executable. `PLAYWRIGHT_PORT` changes the local port; `PLAYWRIGHT_BASE_URL` targets an existing preview. Set `BIBLEMAP_VERIFY_EXPORT=1` before `npm run test` to enable the additional export unit check (PowerShell: `$env:BIBLEMAP_VERIFY_EXPORT='1'`).

CI retains a **separate opt-in Nineveh review build and browser suite** (`BIBLEMAP_NINEVEH_REVIEW=1`, then `PLAYWRIGHT_REVIEW_SERVER=1 npm run test:e2e`). Its local-only image/CI fixture setup is in [the workflow](.github/workflows/jonah-ci.yml). Do not enable that review flag in production. Ordinary export validation excludes its experimental imagery.

Technical checks are narrower than publication approval. `validate:release` still fails on Jonah's unfinished author slots and missing human reviews. Known draft fields/readings remain exposed in static artifacts; **noindex is not access control**. A future release must complete genuine reviews for all exposed content or enforce an approved route/content allowlist and prove excluded content absent from HTML, RSC, JS, JSON and media. This homepage feature does not implement that larger release boundary.

## Contributing

Read [AGENTS.md](AGENTS.md), applicable nested instructions and [experience principles](docs/experience-principles.md). Preserve provenance, uncertainty, keyboard access, reduced motion, responsive behavior and unfinished Exodus work. Creator approval of the precise public scope remains pending. Historical reports retain their original results and are superseded explicitly.

## License

See [LICENSE](LICENSE). Scripture, data, artwork and other sources retain their own rights and reuse requirements.
