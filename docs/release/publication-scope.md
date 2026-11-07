# Publication scope — frozen Human Story candidate

The creator is the publication authority. The homepage direction is accepted; **publication of this candidate is pending**. PR #44 was merged with history at `fbe2608f14ebc6111c71d38d9fe6c01d60170177`. This scope does not authorize a production release or reduce the current navigational lineup to obtain a passing gate.

The executable inventory is [publication-scope.json](publication-scope.json). All existing linked readings, five worlds and three paths remain candidate content, including the unfinished Exodus reading. `provisional` means available for candidate review, not accepted for public release. The creator must settle each retained surface and its disclosed limitations. No reviewer or approval has been generated.

| Routes | Candidate dependencies and requirements |
|---|---|
| `/`, `/human-story/` | Frozen portal, Thomas invitation, featured narratives, discovery graph, reading paths and artwork |
| `/human-story/worlds/{stories,witnesses,saints,atlas,voices}/` | Selected graph, sourced interior passages, comparison and geography; all links must resolve |
| `/human-story/paths/{a-word-crosses-centuries,a-name-under-pressure,a-life-in-another-life}/` | Complete selected reading sequence; comparisons retain their source and uncertainty distinctions |
| `/human-story/{entry}/` | Every exact entry is enumerated in JSON. Manuscripts, ancient testimonies, reception and interpretation retain separate identities. No automatic publication of future records. |
| `/human-story/{perpetua,romanus,james}/` | Cinematic art, surviving primary accounts, source dossiers; Romanus and James retain `/reading/` alternatives |
| `/human-story/thomas/`, `/human-story/thomas/reading/`, `/human-story/thomas/sayings/` | Thomas V3, pinned John 20, separate sayings/manuscript explorer, rights-cleared generated environments and manuscript reading aids |
| `/jonah/`, `/nineveh/`, `/explore/` | All 48 pinned WEB Jonah verses, 13 scenes, source/media disclosures, preserved Nineveh and Atlas, legacy hashes/query links |
| `/human-story/exodus/`, Atlas Exodus itinerary | Preserved unfinished work; creator must decide suitability and disclosure. Its current exposure remains explicit, not implicitly authorized. |
| `/demo/` | Internal product demonstration. Ordinary builds return 404. Development review can opt in with `BIBLEMAP_INTERNAL_REVIEW=1`; prohibited in release builds. Its underlying media remain in the asset inventory pending an asset decision. |
| `/experiments/nineveh/`, local review assets | Excluded experimental experience; ordinary build returns 404. Existing opt-in browser review remains separate. Review flags are prohibited in publication builds. |
| `/404/`, `/_not-found/`, `/404.html` | Framework error representations, not editorial publication decisions |

## Content and media boundary

`selectVisitorGraph` selects source records before static parameters and rendering, prunes orphan graph dependencies, and projects known fields. New entry IDs default to excluded until classified. Jonah projects before rendering/serialization: placeholders and unreviewed author text stay in Git and never enter visitor props. Companion states `complete` and `provisional` may enter the candidate; `internal-draft` and `excluded-experimental` cannot. Neither completeness nor CI creates publication acceptance. Audio and historical context retain their stricter substantive review rules.

The static inventory covers **every file**, including HTML, alternate RSC text, JS, JSON, fonts, Parquet, WASM, images, video and source/rights manifests. Asset checksums form the artifact digest. Rights evidence remains in the existing media manifests and source dossiers; digest acceptance cannot override an unresolved license or establish historical truth.

All `public/` files are copied by Next.js. This run does not pretend that a route 404 removes its media. The audit must identify unused or internal assets, public instruction files, and source records that still contain draft data. Until creator selection and any required asset separation are complete, production remains blocked. Candidate previews are publicly retrievable review artifacts; noindex is not access control.

## Creator-controlled record

[publication-decision.json](publication-decision.json) currently contains only `status: pending`. A real accepted record must identify the approving actor, UTC date, auditable evidence of the creator's decision, exact content digest, exact complete artifact digest, exact selected routes and every accepted limitation ID. The creator supplies the decision; the agent must not infer it from Git identity, a PR merge, approval of the homepage, or successful checks.

The content digest includes sources, build/export/security scripts, tests, public assets, package and lockfile, configuration and scope. It normalizes source line endings for cross-platform verification. The approval record itself is excluded, permitting a decision-only commit. Build IDs use this digest so an approval-only commit does not rename artifacts. Any input or emitted byte change invalidates acceptance.

`validate:release` verifies technical/source/media integrity and the visitor boundary before checking acceptance. `next.config.mjs` blocks direct production-target builds (`VERCEL_ENV=production`) and explicit `BIBLEMAP_PUBLICATION_MODE=release` builds without a matching decision. Postbuild/explicit release verification binds the resulting artifact bytes; a prebuild check alone cannot approve the resulting export. Deployment of an already-built artifact must rerun the full release gate. This is a repository control, not a replacement for protected production credentials or human review.

Pending decisions: exact public route and asset scope; genuine review of historical, theological and translation-sensitive material; suitability and disclosure of provisional companions/readings; unfinished Exodus; final artwork selection; accepted limitations; actual creator acceptance of the exact candidate. No new stories or homepage redesign are in this release.

## Technical SEO policy

Routing metadata and the static sitemap use this same scope. Routes need complete maturity and an accepted creator decision to become indexable; provisional candidates remain noindex. `indexing: "noindex"` may explicitly retain a selected route outside the sitemap. `canonicalRoute` identifies an existing selected self-canonical alias target and requires explicit noindex. `/human-story/` preserves the duplicate portal entrance with canonical `/`; internal navigation uses `/`. Preview builds always remain noindex. `npm run audit:seo` verifies actual HTTP and initial HTML after an ordinary export; `npm run test:seo-gate` exercises deliberate defects. These checks do not create publication acceptance.
