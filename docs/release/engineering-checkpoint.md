# Human Story engineering checkpoint

**Production remains blocked. No production setting, alias or deployment was changed. PR #41 was not merged.**

PR [#44](https://github.com/jayjz/biblemap/pull/44) was checked at exact head `820d2639752c89ce8b15d441a71c13ab67c20928`, with successful Actions/Vercel checks, then merged with a merge commit into consolidated at `fbe2608f14ebc6111c71d38d9fe6c01d60170177`. Its tree matched the verified feature tree. `main` remained `60ecbda079f5fd29325b68549fe6d01ced74a7fc`. This release branch started at that consolidated SHA.

The full starting modified/untracked list is in [checkpoint-start-status.txt](../../artifacts/release-readiness/checkpoint-start-status.txt). Existing home-discovery screenshots, Thomas cinematic-pilot evidence and James preview output are preserved outside this commit. No story, cinematic artwork, manuscript explorer or unfinished Exodus research was deleted. Homepage design and featured lineup remain unchanged.

## Implemented boundary and authorization model

[Publication scope](publication-scope.md), [machine scope](publication-scope.json) and [pending decision](publication-decision.json) distinguish technical integrity from maturity and the creator's exact publication decision. Production-target/direct builds fail closed without that decision. CI/Git identity cannot manufacture acceptance. The record must bind actor, UTC date, decision evidence, source digest, exact emitted artifact digest, selected routes and accepted limitations. Metadata authenticity still requires human review.

Graph selection occurs before static params/rendering; unclassified/new entries fail closed. Explicit projections exclude future private fields. Jonah retains Scripture/provenance/media checks, author text review, claim distinctions and audio requirements. Companion states can be complete, provisional, internal draft or excluded experimental. Internal/experimental companions never serialize. A complete companion does not authorize a release. The internal `/demo/` now returns a 404 stub in ordinary exports; its source and media remain preserved.

| Original Jonah gate items | Before | Checkpoint behavior |
|---|---:|---|
| Scene title/narrative/reflection placeholders | 39 | Private fields omitted before rendering. The baseline already had that projection; no synthetic text or approval was added. Unfinished authorship is no longer a requirement for the selected Scripture/companion presentation. |
| Geography author placeholders | 3 | Omitted; existing sourced notes and uncertainty remain. No fabricated geography was written. |
| Per-scene release approvals | 13 | Redundant blanket permissions removed; malformed review metadata still fails technical validation. One exact creator decision governs publication. |
| Permanently provisional companions | 13 | Schema supports complete/provisional/internal/experimental states. Existing 13 remain provisional; creator acceptance and limitations are still pending. |
| Total | 68 | Technical validation is separated from publication authorization; no editorial acceptance is claimed. The legacy diagnostic still reproduces all 68 original policy items. |

## Static artifacts and the 477 / 377 counts

The baseline export inventory had **562 total files**, of which **477** matched the old HTML/RSC/JS/JSON/XML/SVG text scanner. The interim adversarial run after Next 16.4.5 inspected **377 total files**, including binary media. Those figures count different sets; 377 was not a reduced scan of the old 477 text files.

Next's newer exporter produced 184 RSC/text files instead of 372. The final inventory has 48 HTML files and the same 47 index-route paths. Images, video, Parquet, fonts, WASM, source/rights manifests and their counts remain present. The final artifact count is 376 (291 text-scan artifacts). The interim 377-file build used a different MapLibre/bundle state; its full manifest was overwritten by subsequent builds, so the exact single interim filename difference is not claimed. All-file scanning includes the emitted `.mjs` worker. Compare [baseline inventory](../../artifacts/release-readiness/export-before.json) with [ordinary final inventory](../../artifacts/release-readiness/export-inventory.json). The baseline inventory's source digest describes the newer inventory tool's working-tree inputs when it scanned the baseline output, not the clean baseline revision; use `fbe2608` and `build-before.txt` for baseline provenance.

The adversarial test injects unique private author, companion, geography, media-metadata and future-field strings plus an unclassified graph reading into actual source. It builds the site, scans every emitted file and restores the originals in `finally`. Binary/encoded/compressed fixture coverage also runs in units. Existing known unpublished markers and all 48 exact WEB verses remain checked by the visitor validator.

This does **not** establish that all draft content is absent. The ordinary candidate deliberately retains 25 provisional graph readings, including unfinished Exodus, alongside Thomas and the existing standalone journeys. Public media/direct asset URLs, manifests and three public Markdown files remain inventory-visible. Their publication scope remains a creator decision. Experimental/404 route stubs do not hide associated media. These are public review artifacts, and `noindex` is not access control.

## Frozen dependency and worker state

Installed/locked versions: Next `16.4.5`, MapLibre `6.16.0`, React map wrapper `8.1.3`; baseline ESLint configuration `16.1.6` and Hooks plugin `7.0.1`. No subsequent dependency upgrades are in this checkpoint.

The MapLibre 6.4.1 worker imported a missing sibling `maplibre-gl-shared.mjs`. The frozen 6.16.0 worker is self-contained: the package's shared compatibility file is empty and the worker has no static sibling imports. The emitted worker must match its pinned package bytes, including its BSD notice. [Worker verification](../../artifacts/release-readiness/maplibre-worker-export.json) parses the actual exported module closure; browser regressions check JavaScript MIME types, successful local worker responses, absence of failed local module requests and the existing attribution cases. There is no runtime sibling to omit in this version.

Fresh npm audit: **22 unresolved package findings: 14 moderate, 8 high, zero critical** (baseline: 38, including two critical). Unresolved findings are not fixed merely because their vulnerable paths may be build-only or unused. See [dependency assessment](dependency-security.md), [baseline audit](../../artifacts/release-readiness/audit-before.json) and [frozen audit](../../artifacts/release-readiness/audit-final.json).

## Verification and release limits

| Executed check | Exit / actual result |
|---|---|
| Frozen `npm ci` | 0; installed and locked MapLibre 6.16.0 / wrapper 8.1.3 / Hooks plugin 7.0.1 |
| Source/media and pinned Scripture gates | 0, run by ordinary build and `validate:release` |
| `npm run lint` | 0; four pre-existing unused-variable warnings, zero errors |
| `npx tsc --noEmit` | 0 |
| Export-enabled unit suite | 0; 63 passed, no skips |
| Ordinary `npm run build` | 0; 376 artifacts, 47 index routes, zero unresolved or review-server dependencies |
| Existing adversarial export fixture | 0; 376 artifacts; injected private fields and unclassified reading absent; original source restored |
| Repeated navigation fixes | 0; 20 desktop/mobile checks passed after preserving the first failed full run |
| Complete desktop/mobile Playwright suite | 0; **221 passed, one existing mobile Atlas control skip** (6.0m) |
| Separate Nineveh review build/suite | Both 0; **22 passed**; exact loopback-only image binding recorded |
| Restored ordinary export smoke | 0; 8 passed, including existing Atlas attribution cases, module delivery and repaired navigation |
| Ordinary Nineveh export exclusion | 0; original experimental image remains outside the static export |
| Worker byte/module audit | 0; one 519,372-byte worker, SHA-256 `0bf06492bdb7ba3d4132b78e435621bfba60d5250967991c02b1a73affea8cd5`, no static sibling imports |
| `npm audit --json` | **1**; 22 unresolved findings: 14 moderate, 8 high, zero critical |
| `npm run validate:release` | **1**; only `Creator publication decision pending: exact candidate, routes, assets and limitations require acceptance` |
| Production-target prebuild guard | **1**, correctly rejected pending authorization |
| Diff/research/media preservation | `git diff --check` passed; Jonah/Human Story source fixture files restored; all 50 baseline media files retain identical checksums |

The complete browser suite ran after the application navigation fixes. The later review-inventory/CI fixture adjustment changed build tooling only; the ordinary export was then rebuilt and its boundary, units/types/lint, worker closure and focused browser flow were checked again. [Ordinary tested identity](../../artifacts/release-readiness/ordinary-tested-identity.json) and the final inventory retain those distinct artifact identities. [Verification history](verification-history.md) preserves failures and corrections. This checkpoint does not claim exhaustive security testing, assistive-technology user testing or production smoke-test completion.

Remaining creator decisions: public route/asset scope, provisional commentary/readings, unfinished Exodus, substantive historical/theological/translation review and exact release acceptance. Remaining engineering work: assess deferred dependency paths, finish any asset separation required by that decision, and verify the accepted artifact in the production environment before any separately authorized release.

Recommended sequence after checkpoint review: settle scope and substantive limitations; resolve technical blockers; rebuild/test/audit the exact candidate; have the creator record the exact decision and digests; verify that decision against the artifact; obtain separate authorization for any merge to main or production change. Recheck domain/rollback state immediately before release. This run stops at a draft PR into consolidated.
