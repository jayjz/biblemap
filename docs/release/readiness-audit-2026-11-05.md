# BibleMap release-readiness audit — initial evidence review

**Date:** 2026-11-05  
**Audit branch:** `docs/release-readiness-audit`  
**Snapshot:** Thomas PR #42 head `6e1babad26e260597eef132f942b8f0f6b9840b2`, based on Human Story consolidation PR #41 (`2c119d9e47e96a91f3b1d4607c36c397464a04e4`).  
**Status:** **BLOCKED for production; documentation and decision audit only.** This first pass reads committed reports and GitHub state; it does **not** claim a fresh local release-validator run or editorial approval.

## Executive conclusion

Recommend Human Story as the eventual root landing experience, retaining `/nineveh/`, `/jonah/`, the Atlas and legacy links. Do not merge all draft stories to `main` merely because browser tests succeed. Choose an explicitly approved public route/content scope and validate that excluded draft material is *absent from the generated static artifacts*, not just hidden or marked noindex. Alternatively, complete a full editorial release of every exported surface.

No release branch, production setting, branch protection, approval or validator is changed by this audit.

## Verified branch architecture

| Ref / PR | Purpose | Status at audit |
|---|---|---|
| `main` | Existing production branch; `src/app/page.tsx` renders `NinevehHome` | Unchanged |
| `feat/human-story-consolidated`, [#41](https://github.com/jayjz/biblemap/pull/41) | Human Story landing, Perpetua, Romanus, discovery, James V2 | Draft, open, not merged |
| `feat/thomas-doubt-and-sayings`, [#42](https://github.com/jayjz/biblemap/pull/42) | Five-movement Thomas + later cinematic revision + separate sayings/manuscripts | Draft, open, not merged, 8 commits ahead of consolidated with 0 behind |
| `docs/release-readiness-audit` | This documentation-only assessment | Based on exact Thomas head |

The consolidated `src/app/page.tsx` renders `HumanStoryHome` through `RootEntrance`; `main` renders `NinevehHome`. A branch-based Vercel preview is not a production merge. GitHub PR #42's reported runtime CI passed (ordinary 207 browser tests, one inherited skip, 22 separate Nineveh checks), but the final evidence SHA's workflow was still in progress at initial observation. See PR/Actions for live outcomes.

## Release inventory — verify on the final candidate

| Surface | Intended decision | Known boundary / verification needed |
|---|---|---|
| `/`, `/human-story/` | Eventually make unified Human Story the entrance | Preview-only today; homepage includes discoverability of provisional stories |
| `/nineveh/` | Retain historic experience | Verify all rooted links, source/media compliance and approved copy |
| `/jonah/` | Retain reading and 13 scenes | Full `JONAH` content passed to client; unpublished fields and provisional companions leak into static export according to Nov 3 audit |
| `/explore/` | Retain Atlas | Verify compatibility hashes/query params, keyboard and mobile behavior |
| Perpetua / Romanus / James | Candidate journeys, not automatically approved | Historical, theological, artistic and rights decisions are independent of tests |
| `/human-story/thomas/`, `/reading/`, `/sayings/` | Candidate future journeys | AI-assisted interpretation, modern image rights, translation/source review, no reader study; noindex is not access control |
| Exodus and experiments | Preserve but do not unintentionally publish | Confirm final export exclusion without deleting development work |
| Legacy Nineveh/Atlas URLs | Preserve | Test hash/query, Back/Forward, no-JS limitations where relevant |

## Known blockers, evidence and required closure

1. **Jonah release validation:** `docs/editorial/08-release-gate-triage.md` reports `npm run validate:release` exit 1 with **68** items (39 author-text slots, 3 geography explanations, 13 scene reviews, 13 reading companions). Thomas final verification likewise reports exit 1; these are not newly introduced by Thomas. Re-run on the eventual candidate to produce an exact current failure inventory.
2. **Static-export exposure:** Nov 3 triage found unpublished Jonah fields serialized in HTML/RSC and 23 draft Human Story readings included by static params. `noindex` cannot restrict access. Build a **positive allowlist for publishable routes/content** and negative export scans against HTML/RSC/JS/JSON/media, including deep links, or complete all genuine content approvals before release. Never spoof or auto-fill approval records.
3. **Human review:** Historical, theological, editorial, art and relevant translation/reuse approvals remain pending for several journeys, including Thomas. Track exact content SHA, reviewer, evidence, scope and decision; passing CI does not grant approval.
4. **Dependencies:** Thomas verification reports `npm ci` audit of 38 advisories (1 low, 16 moderate, 19 high, 2 critical), with no remediation. Triage production-reachable exposure and fix material issues separately, rather than using counts alone as exploitability evidence.
5. **Visual/reader evidence:** Thomas and James captures and automated accessibility tests exist; no unfamiliar-reader comprehension study, field Web Vitals, or human assistive-tech study is claimed.

## Stale documentation findings

- `README.md` is **identical in main, consolidated and Thomas heads** at time of initial inspection. It describes Nineveh/PR #30 as the future homepage, omits Human Story, Perpetua, Romanus, James and Thomas, and uses “human-authored” without acknowledging AI-assisted draft narrative and unapproved editorial content. Rewrite it to distinguish **production**, **preview**, **proposed release** and **historical sources**.
- `docs/editorial/08-release-gate-triage.md` is a November 3 historical snapshot that still says PR #36 should remain open; #36 was superseded and closed without merging by consolidation PR #41. Preserve the historical report; prepend a supersession pointer instead of rewriting historical evidence.
- `docs/human-story-homepage-release.md` is a checkpoint from the PR #36 stage. Its test counts, SHA, ownership and preview URLs are historical, not the current release status. Keep as an archived checkpoint and point to this audit.
- `AGENTS.md` principles largely remain valid; review any commands/technical facts against current scripts rather than changing editorial safety principles.
- `package.json` on consolidated lists `npm run preview` as static export server and `validate:release` separately. Re-check Node documentation (older README says Node 22; Thomas runs used Node 24.22.2) and ensure the README does not incorrectly imply compatibility was formally certified.

## Publication paths

**Option A — full review:** supply and independently approve every exposed story, Jonah slot and companion; rerun the existing full release validator and add Human Story-specific approval coverage. Highest effort, least risk of publishing drafts.

**Option B — scoped curated launch (preferred if feasible):** creator approves a positive list of routes and exact content; implementation ensures everything else, including serialized payloads and alternate routes, is excluded from the release artifact. Keep experiments on preview branches. Require independent negative scans and manual inspection of `out/`. This is an **implementation task, not an existing capability**.

## Suggested deliverable sequence

1. Freeze the Thomas runtime SHA and collect CI status. Do not merge draft #42 or #41 as a shortcut to deployment.
2. Generate a **complete route + data-flow inventory** from an actual production-style static export, with URLs, generated artifacts, source dependencies and content review states. Explicitly test alternate RSC/data formats.
3. Resolve publication policy: obtain creator-signed route/content scope, identify accountable reviewers and distinguish approval of images, scripture rights, commentary and uncertain historical assertions.
4. Implement publication allowlist / export-boundary tests in a **separate release feature PR**; if scope is broad, perform the full-review approach instead.
5. Rewrite README with a route matrix, architecture, local commands, research/provenance model, preview status and outstanding publication gates. Update a stable documentation index and add supersession pointers without erasing historical audits.
6. Run lint/type/build/units/full browser tests, 22 Nineveh experiment tests, source/media checks, source pinning, export scans, accessibility/keyboard/mobile/legacy routes and deployment smoke tests on the exact release candidate.
7. Confirm required reviews, route rights and dependency triage; only then create/approve a release PR to `main`. Verify domain routing, metadata/indexing and rollback after merge.

## Evidence references

- [Release gate triage (Nov 3)](../editorial/08-release-gate-triage.md)
- [Human Story homepage preparation](../human-story-homepage-release.md)
- [Thomas cinematic verification](../thomas-cinematic-verification.md)
- [Thomas source dossier](../research/thomas-source-dossier.md)
- [Thomas image provenance](../../public/media/thomas/manifest.json)
- [Consolidation PR #41](https://github.com/jayjz/biblemap/pull/41)
- [Thomas PR #42](https://github.com/jayjz/biblemap/pull/42)

**Audit completeness:** The branch/README/current component/commit claims above were inspected directly on GitHub. Historical export-leak findings, test results, CI and audit counts are sourced from checked-in reports or GitHub run records; this document is not a substitute for a newly executed end-to-end release assessment.