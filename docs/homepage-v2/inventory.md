# Candidate catalog

Inspected 15 November 2026. [inventory.json](inventory.json) separates route presence, visitor eligibility, maturity, editorial role, authoring review, and indexing. Regenerate with `node --experimental-strip-types scripts/homepage-inventory.mjs`; `--check` detects drift.

The remote main head is `23bf774dbd38b98dd8921d33149ed4485440c223`. The verified, unmerged dependency chain is:

1. `main` → Pliny WIP `064a17ac3e7511ccb42323e436b6442f661be2cd` (`feat/pliny-human-encounter`; preserved WIP, no open PR found).
2. [PR #56](https://github.com/jayjz/biblemap/pull/56), V3 `82d5bc4308114dcc1ba8dbff71be4a0e08d8551e`, targets WIP.
3. [PR #57](https://github.com/jayjz/biblemap/pull/57), V4 `ae4dc1c8f5b3d585ecaa75832cf0e735a150ada9`, targets V3.
4. `feat/homepage-living-archive` starts at V4 and targets `feat/pliny-v4-documentary`.

GitHub PR metadata and `git ls-remote` agreed. No lower branch was merged or rebased. The homepage hero opens `/human-story/pliny/`, whose existing `PlinyV3Encounter` component contains V4's `PlinyArtifact` manuscript, diploma, coin, and documentary layouts. A component name containing V3 does not indicate stale V3 presentation.

The repository contains 25 Human Story graph entries and two additional visitor-eligible experiences: Thomas and Lachish. All 27 remain discoverable. Thomas is a dedicated static route, authorized through route scope, with no graph entry or invented edges. Lachish is a dedicated route already in publication scope; this work registers it in discovery. Jonah's homepage destination is the complete `/jonah/` encounter; its `/human-story/jonah/` reading room remains available through world and source navigation. Nineveh's separate `/nineveh/` presentation and the Atlas `/explore/` remain explicit links. Auxiliary reading versions, paths, world pages, and aliases are not counted as extra stories.

Developed encounters: Pliny, Perpetua & Felicity, Jonah, Thomas, James, Romanus, Lachish. The other graph entries are sourced reading rooms, not equivalent cinematic experiences. All selected candidate records are currently **provisional** in publication scope and all editorial invitations remain drafts for human review. Exodus retains its explicit unfinished limitation and discovery access. Route scope also contains internal `/demo/` and excluded `/experiments/nineveh/`; neither enters discovery or the visitor export.

The old `HumanStoryHome` ranking array and the separate Perpetua/Romanus/Thomas `FeaturedEncounters` selection disagreed. Both now consume the authoritative curation. The unused old Thomas invitation component is not part of the entrance. Content registrations and new merges never alter editorial feature selection.

Starting local modifications to `AGENTS.md`, `next-env.d.ts`, and `artifacts/release-readiness/export-inventory.json`, plus four untracked skill links, were saved and preserved separately from this change. The review artifacts and final diff are scoped to the homepage.
