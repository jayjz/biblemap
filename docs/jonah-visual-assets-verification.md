# Jonah visual integration — local verification, 2026-10-10

> Historical preapproval checkpoint; its zero-artwork publication status is superseded by the scoped preview approval. See [Jonah V1](jonah-v1.md) and [the maintained completion audit](jonah-completion.md) for current status. The dated record below is preserved.

Branch: `feat/jonah-visual-assets`. PR: https://github.com/jayjz/biblemap/pull/4, retaining base `feat/jonah-first-encounter` (PR #3). No merge, deployment, main-branch change, or Exodus implementation change.

## Delivered files and display state

- `docs/research/jonah-asset-candidates.json`: six exact acquired-file records alongside ten original object candidates; dimensions, byte lengths, SHA-256, identity corrections, recovered reference URLs, rights evidence, acquisition gaps, and six scene proposals.
- `artifacts/jonah-image-review/`: unchanged supplied checksum manifest and three verified public-domain originals (Raphael, Rosselli, Gassel), plus preservation notes. All six originals remain locally intact; six former-public copies are preserved in ignored `publication-hold/`. Three unresolved reproductions remain local-only.
- `src/content/jonah-media.ts` / `jonah.ts`: existing `CuratedMediaAsset` contract, unchanged production gate, and separately required scene approval. Three rights-verified review records; zero editorial approvals, zero published Jonah image files, zero displayed museum artworks.
- `scripts/validate-jonah-assets.mjs` / `package.json`: reproducible local integrity, JPEG dimensions, duplicate and static-publication checks, included in story/build validation.
- `src/domain/story.ts`, `StoryReader`, `StoryEvidence`: omit placeholders and unapproved written copy from visitor nodes; preserve source data and explicit author workspace.
- `StoryMedia` / `story.css`: static scene-specific water/light studies, compact mobile fallback, visible atmosphere labeling, uncropped future artwork, recoverable image changes, and accessible provenance-link contrast/focus.
- `tests/`: author-workspace/visitor separation, approval gate, no unapproved image request, failure recovery, composition, provenance accessibility, first-scene screenshots, and existing navigation checks. `playwright.config.ts` permits an isolated review port to avoid other worktrees.
- `FirstEncounter.tsx`: two pre-existing JSX apostrophe lint errors corrected; content and optional philosophy behavior retained.

## Verification performed

| Check | Result |
| --- | --- |
| `npm ci` | Pass; existing dependency audit reports 36 vulnerabilities (1 low, 10 moderate, 23 high, 2 critical). No dependency versions changed in this task. |
| Supplied `sha256sum -c artifacts/jonah-image-review/SHA256SUMS` | Six of six pass. Both sets of six copies are byte-identical; six distinct subject hashes. |
| `npm run validate:story` / `npm run validate:media` | Pass; exact 17 WEB verses and translator notes retained; available originals/held copies and publication exclusion checked. |
| `npm test` | Pass, both existing test files. Direct execution also verifies 6 story tests and 9 historical-context tests. |
| `npm run lint` | Pass, zero errors; three pre-existing unused-symbol warnings in `DataLoader.tsx`. |
| `npx tsc --noEmit` | Pass. |
| `npm run build` | Pass, static export preserved; no Jonah image directory in `public/` or `out/`. Initial sandbox font-download failure resolved by running the existing build with network access. |
| Full desktop/mobile Playwright | 25 pass; one existing mobile-atlas interaction test remains skipped by its original suite. |
| `npm run validate:release` | Intentionally fails on existing unfinished author slots/human-review requirements. This branch remains an author-review prototype. |
| `git diff --check` | Pass. |

Playwright command: `CI=1 PLAYWRIGHT_PORT=4193 CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e`. The original default-port baseline reused a server that later disappeared; final runs used an owned isolated server. Baseline also reproduced the stale missing-art assertion and placeholder-concealment assertion, now replaced with current fallback and DOM-absence checks.

## Browser and screenshot review

Inspected desktop (1440×1000) and mobile Jonah Calling/Escape screenshots, mobile/desktop homepage, live desktop/mobile atlas, and a **test-only synthetic-approval** Raphael preview using the actual built styles. The preview is renderer verification, not editorial authorization or a published page. The complete drawing, including both prophets, winged figure, collector stamps, and margins, remains visible with `object-fit: contain`. Its provenance includes institution, title, creator, date, rights, source link, and later-depiction limitations. Axe checks the artwork/provenance region. Pale source links and metadata text discovered by screenshot and Axe review were corrected in Jonah styling without changing the shared provenance component.

The first two scenes show different restrained atmospheric studies without fish/release imagery. Scripture remains prominent, philosophy stays collapsed and optional, and mobile atmosphere height is 180px. Existing suites check widths 320, 390, 768, and 1440; no-JavaScript reading; keyboard scene focus/history; reduced motion; reflection privacy; and missing-media/audio failures. Screenshot inspection found no homepage or atlas regression from this diff. The existing mobile atlas interaction limitation remains outside this task; its live map was separately inspected and loaded 109 visible events without horizontal overflow.

Additional live checks of `/`, `/jonah/#jonah-1-calling`, `/jonah/#jonah-1-escape`, and `/explore/` on desktop/mobile recorded **zero console errors, zero page exceptions, and zero HTTP error responses**. Jonah and atlas had no failed requests. Each homepage context reported three `net::ERR_ABORTED` local page-prefetch requests during teardown (`/`, `/jonah/`, `/explore/`); no missing content or external dependency failure was observed. Media tests deliberately inject a 404 and playback rejection to verify fallbacks.

Local screenshot evidence is saved under `/tmp/jonah-visual-evidence/`; the Playwright HTML report is under ignored `playwright-report/`. Evidence files are review artifacts, not shipped artwork.

## Remaining blockers and assumptions

No human media approval was supplied. Acquisition dates and exact original download receipts remain unknown; file modification times are not substituted. Raphael is proposed only for the opening, Rosselli only after the fish is introduced at 1:17. Gassel is documented but excluded from chapter one because its foreground reveals release. The six filenames are preserved as supplied, never used as identity evidence.

The Hortus reproduction, two-object Cleveland composite, and Sadeler reproduction require exact digital-source/rights evidence before redistribution. The comparable museum records identify their subject matter but do not prove the source or license of those exact bytes. No crop, derivative, invented reviewer, guessed holder, or inferred public-domain status resolves these gaps. See `docs/research/jonah-visual-assets-v1.md` for all identities and source links.
