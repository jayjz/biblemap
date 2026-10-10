# Jonah integration audit — 2026-10-10

## Scope and checkpoint

Inspected integration HEAD: `1cad96cd5567a55e8cf325c0c5f4316c9ba4b731`.
Task branch: `chore/jonah-release-readiness`, directly based on that HEAD.
Only this report and `.github/workflows/jonah-ci.yml` change. Application behavior,
research files, dependencies, publication metadata and editorial approvals remain unchanged.
The pre-existing generated `next-env.d.ts` modification is excluded from the commit.

Fetched origin before comparing. Main and the merge base with integration are
`4ace05c9dc1fd67bf024f64179eb7553e02174e0`.
The integration history contains the foundation/Exodus checkpoint
`ea2365ac3ffcb315cb9cbefd7de98b47b3884c22`, reader
`bd0d948ecee642f6adfc89a9c380b95290ee1e3b`, homepage, archive import,
first encounter, visual work, and PR #5. The separate `feat/exodus-world-model`
worktree still points at `ea2365a`, identical to `origin/feat/immersive-foundation`;
it has no commits absent from Jonah HEAD. This is an ancestry finding, not a
claim that unfinished Exodus work is release-complete. Other worktree files were
not edited or cleaned. No merge, closure, deletion, rebase or force push occurred.

## PR representation

| PR | Inspected head | Representation in #6 |
| --- | --- | --- |
| [#1](https://github.com/jayjz/biblemap/pull/1) | `c151733ef8f1f2e7657dd0a50cfd303250df079b` | Head is an ancestor; later homepage refinements are intentional integration development. No unique commits remain. |
| [#2](https://github.com/jayjz/biblemap/pull/2) | `f9a026275840bf509400c5449db25f3bff95fe07` | Commit is divergent, but all four files and the patch are identical to the archive import `faaaff5`. No unique file content remains. |
| [#3](https://github.com/jayjz/biblemap/pull/3) | `b69ebff5e1b963385fe8495e22c60e66a84e4e31` | Head is an ancestor; no unique commits remain. |
| [#4](https://github.com/jayjz/biblemap/pull/4) | `1cad96cd5567a55e8cf325c0c5f4316c9ba4b731` | Same head as #6; alternate stacked base only. |
| [#5](https://github.com/jayjz/biblemap/pull/5) | `e441a0229e1e508dfe5e16a932048835d439eaa2` | Already merged by `1cad96c`; both documentation commits are ancestors. |
| [#6](https://github.com/jayjz/biblemap/pull/6) | `1cad96cd5567a55e8cf325c0c5f4316c9ba4b731` | Single integration candidate targeting main; GitHub reports MERGEABLE/CLEAN at inspection. |

## Research reconciliation

`git diff HEAD f9a0262 -- docs/research/jonah-{artwork,geography,quotations,theology}.md`
is empty. Corresponding Git blob IDs on both sides:

| Archive | Identical blob |
| --- | --- |
| [Artwork](research/jonah-artwork.md) | `dee44e41dd9c03114db0aa9c4e21571ef70e19af` |
| [Geography](research/jonah-geography.md) | `17487b9f9b4a3941cf318c66f4afa879eb615e40` |
| [Quotations](research/jonah-quotations.md) | `516d08185de014224a0fa97e51ec5038b9864eee` |
| [Theology](research/jonah-theology.md) | `dba96066e6f4922e463746e72346faee852ad81d` |

Both commits have stable patch ID `fad827e8fa4b0b7b333907df3e506eece9ee6732`;
`git cherry HEAD origin/research/jonah-source-archive` marks `f9a0262` as equivalent.
No missing correction or conflicting branch claim needs importing. Do not merge or
copy the archive again merely to obtain its original commit identity.

The archive is a dated research record, not current publication clearance. Its
original gaps (including museum-page retrieval and reproduction rights) remain
faithfully recorded. Later acquisition evidence and scoped placement approval live
in [the asset catalog](research/jonah-asset-candidates.json) and
[Jonah V1 status](jonah-v1.md). These supplement rather than overwrite history.
Tarshish identification, ancient harbor position, textual variants and conflicting
interpretations remain explicitly uncertain/disputed. This audit verifies preservation,
not a fresh scholarly review or approval of every archived claim.

## CI and verification

No tracked GitHub Actions workflow existed. The new pull-request workflow uses
read-only repository permissions, `npm ci`, Node 22.22.3 (matching local checks),
Ubuntu 24.04, and official GitHub actions. It installs locked Playwright Chromium
with system dependencies, runs both configured desktop/mobile projects against
the static export, and preserves browser reports on failure. No deployment action,
secret or production-setting change is involved.

Setup follows [GitHub's Node CI documentation](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)
and [Playwright's CI instructions](https://playwright.dev/docs/ci).
The independent editorial job runs the unchanged `validate:release`; it is expected
to fail until genuine human approval/authorship exists. There is no
`continue-on-error`, suppressed failure, or newly skipped test. A red editorial
check must not be described as a fully green release.

Local checks:

- `npm ci`: passed; unchanged lockfile. Existing audit: 36 advisories
  (1 low, 10 moderate, 23 high, 2 critical); remediation is outside this scoped diff.
- `npm run validate:story`: passed, including media checks and all 48 verses with
  translator notes against pinned publisher snapshots.
- `npm test`: passed both test files; direct execution additionally confirmed
  6 story and 9 historical-context assertions.
- `npm run lint`: passed with 3 existing unused-symbol warnings in `DataLoader.tsx`.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; static homepage, Jonah, explore and demo exported.
- `npm run validate:release`: failed as expected on unfinished place/scene/reflection
  author slots and missing scene/reading-companion human approvals. Same source
  and validator as the inspected checkpoint; no approval changed.

- `CI=1 PLAYWRIGHT_PORT=4197 CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e`:
  **31 passed, 1 existing mobile explorer test skipped**, in 1.2 minutes. The first
  sandbox attempt could not bind a socket; the authorized rerun passed.
- Documentation relative links and `git diff --check`: passed.

Local browsers used installed system Chrome; the hosted workflow independently
installs the browser revision specified by locked Playwright. Hosted CI evidence
is recorded with the task PR. The existing
mobile explorer interaction skip remains an explicit coverage gap; Jonah runs at
both sizes. Existing suites cover keyboard navigation, reduced motion, no-JavaScript
reading, reflow, private reflection lifecycle, selected events, empty filters,
approved media provenance, and deliberate image/audio failure fallbacks.

## Preview and human gates

GitHub reports successful Vercel Preview deployment `6982468819` for `1cad96c`,
completed at `2026-10-10T14:51:21Z`. Its
[Jonah URL](https://biblemap-cbx06a6j6-elliotandersons-projects.vercel.app/jonah/)
returned anonymous HTTP 200 during this audit, unlike the earlier protected-preview
record. An HTTP check is not a hosted browser test or editorial signoff.

The three museum placements have scoped creator approval already recorded;
no original approval date or creator name was invented. Review still needed:
13 scene titles/questions/companions, opening guidance, optional philosophy,
homepage/ending copy, author slots, and captions/alt text as separate editorial
copy. Exact digital rights for the three held reproductions remain unresolved;
they stay excluded from publication. See [current limitations](jonah-v1.md).

## Recommended order (no merges or closures performed)

1. Review this focused draft PR into `feat/jonah-visual-assets`; require its technical
   CI result and explicitly acknowledge the failing editorial gate. Merge it only
   with creator authorization. Its documentation/CI can be integrated independently
   of editorial publication approval.
2. Re-run #6 on the updated integration head. Review the existing mobile atlas gap,
   dependency advisories and preview scope. For a fully authored release, complete
   genuine authorship/editorial review and require `validate:release` to pass.
   A preview-only merge requires the creator's explicit acceptance of the narrower
   scope and remaining red editorial gate.
3. Merge #6 into main once those conditions are accepted. Prefer a merge commit to
   preserve the existing branch ancestry and independently inspectable history.
4. After verifying main includes the integration, close #4, then #3, then #1, then
   #2 as superseded, linking #6 and this audit. #2 closure relies on the recorded
   blob/patch equivalence, not ancestry. #5 is already merged; take no action.
5. Retain all branches/worktrees, especially Exodus, for their ongoing work.

At the inspected checkpoint #6 is ancestry-complete and GitHub-mergeable, with
passing local technical checks to date. It lacks hosted technical CI evidence and
is not an approved authored release. A green Vercel check alone does not resolve
either limitation. The interactive homepage selector is outside this change.
