# Jonah integration verification · 2026-10-11

Baseline: `1e68586c56c1c74fb40ec52ca700de08883f5b41` (`origin/main`). Worktree: `biblemap-integration`; branch: `integration/jonah-complete-20261011`.

## Incorporated work

- [#13](https://github.com/jayjz/biblemap/pull/13), `5893424`: homepage skip-link fix and keyboard/reload regression.
- [#14](https://github.com/jayjz/biblemap/pull/14), `26cbdc7`: pinned-source attributes and Windows CI.
- [#15](https://github.com/jayjz/biblemap/pull/15), `1a8633c`: Scripture-first mercy/anger composition, optional sourced Aquinas disclosure, and tests. These implementations already exist in #16; no mechanical merge was needed.
- [#16](https://github.com/jayjz/biblemap/pull/16), `0de529b`: five supplemental images, local-only mercy/anger candidates, mobile Scripture-first ordering, and the unillustrated final question.

Additional corrections require verified source-record image rights before public export, block unresolved media outside local review, and apply rights restrictions to approved audio too. The five supplemental image records now carry rights verification observations and a reviewer, while editorial placements remain provisional. No creator approvals, narration, Scripture, or Exodus changes were made. The lots scene's explanatory absence card was removed after screenshot inspection; its Scripture and existing reading companion remain.

## Executed checks

| Check | Result |
| --- | --- |
| `npm ci` | Passed; existing dependency audit reports 36 vulnerabilities. Lockfile unchanged. |
| `npm test` | Passed, all three domain test files. |
| `npm run validate:story` / `validate:media` | Passed; 48 verses and translator notes match pinned snapshots; public-image checksums and dimensions match. |
| Git checkout with `core.autocrlf=true` | Passed source/media validators; scripts acquired CRLF while pinned source bytes remained identical. |
| `npm run lint` | Passed with three existing unused-code warnings in DataLoader. |
| `npm run typecheck` | Passed. |
| `npm run build` | Passed; existing build-time Google Fonts requests required network access. |
| Complete `npm run test:e2e` | 47 passed; one inherited mobile explorer skip. Desktop explorer, including Exodus navigation, passed. Chromium 156 / Playwright's bundled browser. |
| Local `node scripts/capture-jonah.mjs` | 39 scene renders: all 13 at 1440px, 390px, 320px; zero axe WCAG A/AA violations, overflow, broken image requests, or browser errors. |
| Static-export isolation | No mercy/anger review images, review-assets, or scene-board files in `out/`. |
| `npm run validate:release` | Expected failure: unfinished authorship and human approval remain required. No gate bypassed. |

The previous #15 mobile reflection failure was investigated using its downloaded CI trace. Reload returned the document, scripts, and artwork successfully before browser protocol activity stalled; the trace does not establish an application root cause. The unchanged regression passed five consecutive Chrome 151 runs, ten consecutive Chromium 156 runs, and the final complete suite. No assertions or timeouts were weakened. An intermittent browser/runner stall remains possible.

Native Windows execution is delegated to the included GitHub Windows job; the local CRLF test is not a Windows OS test. Firefox, WebKit, and physical-device tests were not run.

## Visual evidence and assessment

- Local scene board: `artifacts/jonah-scene-board/index.html`, served by `npm run review:jonah` at `/board`. Capture command and acquisition caveat: `artifacts/jonah-visual-review/README.md`.
- Public-reader desktop/mobile screenshots and explorer evidence: `test-results/`; browser report: `playwright-report/index.html`. GitHub CI uploads these public-reader artifacts.
- Reviewed all 13 scene compositions at all three widths, plus openings and expanded Aquinas. Scripture remains readable and dominant on mobile. Full sheets, inscriptions, and artwork edges remain intact with `object-fit: contain`. The short passages and longer prayer retain consistent typography and navigation.
- Mercy and anger place Scripture first, with no leading editorial question; Aquinas stays collapsed by default and identifies its interpretive scope. Jonah 4:11 has no illustration or added leading question, and no invented response.
- The lots card drew attention to asset availability instead of the passage. Its removal reduces competing UI without substituting unrelated art.
- Provisional source images remain editorial decisions: Roberts shows nineteenth-century Jaffa, Backhuysen a later European storm, Sadeler compresses subsequent events, and the Nineveh relief's historical identification remains qualified. These caveats are available in artwork provenance. The rights checks concern image reuse, not historical or theological approval.
- Mercy/anger originals are review-only. Fresh retrievals differed from #16's recorded hashes; the earlier local bytes were unavailable. New acquisition hashes are recorded explicitly, without claiming rights clearance.

Recommend one squash merge of this integration PR after review and required CI. Once merged, #13–16 should be treated as superseded; none were closed or merged during this work. The dirty Exodus worktree remains separate and unchanged.
