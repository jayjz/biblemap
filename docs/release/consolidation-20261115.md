# BibleMap consolidation — 15 November 2026

This integrates the completed Pliny and homepage stack with its existing history. No story, artwork, design, dependency, publication scope, protection or deployment configuration is changed by consolidation. Production publication remains a separate, artifact-bound decision.

## Initial Git state and lineage

Live GitHub refs were fetched before mutation. Original checkout: `feat/homepage-living-archive` at `7475b0ae1ae7ae82e535a092b6bab7484aa995e6`. Original main: `23bf774dbd38b98dd8921d33149ed4485440c223`, tree `f0aab45b2fc08451a53854b231c707978d2c0837`. Homepage tree: `ee05c0558f699bd8078f4b70c2ec32b31649e1de`.

The [machine ancestry report](consolidation-20261115/ancestry.json) records every commit/tree/parent SHA, merge base, ahead/behind count, patch hash and recovery refs. Main is an ancestor of the selected tip: zero commits behind, six ahead; fast-forward compatible, no conflict resolution or cherry-picking needed.

| Stage | Commit | PR base |
|---|---|---|
| Preserved Pliny WIP | `064a17ac3e7511ccb42323e436b6442f661be2cd` | main |
| Pliny V3 | `82d5bc4308114dcc1ba8dbff71be4a0e08d8551e` | #56 → WIP |
| Pliny V4 | `ae4dc1c8f5b3d585ecaa75832cf0e735a150ada9` | #57 → V3 |
| Living Archive | `82563bc57e183ae367aca6714f8d00341335f0a2` | #58 → V4 |
| Export gate identity | `fe72485afc41dc09d561eade97a37910d12077b2` | #58 |
| All three reading paths | `7475b0ae1ae7ae82e535a092b6bab7484aa995e6` | #58 |

Only #56–58 were open at discovery; all were drafts, with the actual bases/heads above and successful technical, canonical, Windows and Vercel checks. [PR snapshots](consolidation-20261115/pr-stack.json) and check receipts preserve those observations. An independent integration PR targets main; the older PRs are not to be described as independently merged if their ancestry reaches main through it.

The [starting status](consolidation-20261115/original-status.txt) has modified `AGENTS.md`, `next-env.d.ts`, and `artifacts/release-readiness/export-inventory.json`, plus four untracked skill symlinks. Inspection found a generated Next instructions block, development type paths and generated inventory, not additional story work. They remain untouched in the original checkout. Their tracked binary patch is saved outside the subject checkout; symlink targets and the [complete remote branch inventory](consolidation-20261115/remote-branches.json) are recorded. Older unmerged experiment/acceptance branches are preserved; no older acceptance transfers to this candidate.

## Recovery and strategy

Pushed durable recovery branches:

- `backup/consolidation-20261115-main` → `23bf774dbd38b98dd8921d33149ed4485440c223`
- `backup/consolidation-20261115-homepage-v2` → `7475b0ae1ae7ae82e535a092b6bab7484aa995e6`

A complete verified bundle exists at `/tmp/biblemap-consolidation-20261115.bundle`; its digest is in the ancestry report. Recovery does not depend on that temporary file: clone the remote backup branches to recover either lineage. The isolated working checkout is `/tmp/biblemap-consolidated-20261115`, branch `integration/biblemap-consolidated-20261115`, started directly from Homepage V2. Use a regular PR merge, never squash, rebase, force-push main or delete the historical branches.

For source rollback after merge, create a new branch from current main and revert the integration merge with `git revert -m 1 <integration-merge-SHA>`, validate, and open a recovery PR. This keeps history and backups. A Git revert does not change the currently served website; deployment rollback is a separate operation.

## Complete change inventory and preservation

The six source commits change **167 paths**. [Full added/modified/deleted inventory](consolidation-20261115/changed-files.tsv) and JSON file statuses are retained. The exact binary diff SHA-256 is `c4da78a36a61ed3b9e325ea04b323f9533e4f0dc1305a169d278e44118aef8ec`.

Production changes are the Pliny source records/encounter and V4 artifact presentation, creator-controlled homepage catalog/curation, shared discovery, route integration, and the explicit export-gate homepage identity. Remaining changes preserve research, provenance, rights manifests, prior implementations, prototypes, screenshots and regression tests. `ThomasInvitation.tsx` is replaced by the shared featured composition; the Thomas experience, source/manuscript/sayings routes, media and tests remain. No package-lock, workflow, production dependency or publication-policy change occurs in the selected range. The consolidation adds only this report and bounded integration evidence.

`src/content/home-curation.ts` is authoritative: Pliny hero; Perpetua, Jonah, Thomas featured; all visitor-eligible discovery. The catalog has 27 eligible destinations; the three authored paths remain under the legacy `/#paths` disclosure. New registrations/maturity changes cannot silently feature another story. Thomas stays outside the historical graph rather than receiving invented connections. The Pliny route renders the V4 documentary composition (`data-version="4"`) despite its retained `PlinyV3Encounter` component name.

## Verification evidence

The requirement/check ledger and actual command exits are retained in the evidence directory. The local environment is Linux x64, Node 24.22.1/npm 11.19.1 with the committed lockfile; it is a review export, not a canonical release artifact. Canonical release requires the existing pinned Node 22.22.3/npm 10.9.8 container and attested independent Linux builds.

| Executed check | Exit | Observation |
|---|---|---|
| Locked npm ci | 0 | 555 packages installed; unchanged lockfile |
| npm run lint | 0 | 0 errors, 3 existing DataLoader warnings |
| npx tsc --noEmit | 0 | Types pass |
| Focused source/media/curation tests | 0 | Pinned Pliny source/quotation/media checks and curation partitions pass |
| npm run test:release (outside sandbox) | 0 | 28 passed |
| npm run build (outside sandbox) | 0 | 385 artifacts, 45 index routes; no unresolved local dependencies or review-server references |
| npm test | 0 | 85 passed, one export assertion deliberately skipped without opt-in |
| BIBLEMAP_VERIFY_EXPORT=1 npm test | 0 | 86 passed, zero skips |
| npm run test:export-boundary | 0 | Injected private fields/unclassified entry absent from all 385 output files; fixtures restored |
| node scripts/validate-nineveh-depth.mjs --production-export | 0 | Archive entrance, Nineveh and excluded experiment/media verified |
| npm run audit:seo with installed Chrome | 0 | Zero errors; eight existing Jonah image-dimension observations |
| CHROME_PATH=/usr/bin/google-chrome npm run test:seo-gate | 0 | All six deliberate defects rejected; output restored |
| Full desktop/mobile Playwright suite | 143 outer harness | Final runner summary: 279 passed, 1 existing mobile Atlas skip, zero failed, 7.2m; outer Python harness received SIGTERM after summary and did not capture npm exit. Exact integration CI must pass before merge. |
| npm audit --json | 1 | 21 affected-package findings: 8 high, 13 moderate, no critical; no dependency changes |
| npm run validate:release | 1 | Missing release-candidate/manifest.json; detached acceptance pending. Expected production blocker, not a technical pass |

[Machine check ledger](consolidation-20261115/checks.json). Raw logs remain in the isolated evidence directory; selected logs are retained alongside this report. The full local test summary is distinguished from the terminated outer harness; final integration CI supplies the required successful workflow conclusion.

The Browser plugin is unavailable; the installed Playwright workflow uses `/usr/bin/google-chrome`. The tested flow is homepage → Pliny V4 → keep/compare/release → complete correspondence and sources → broader readings/paths. Existing tests also exercise Perpetua, Jonah, Thomas manuscript/sayings, James, Romanus, Nineveh, Lachish, Atlas, authorized legacy links, keyboard focus, mobile, reduced motion, missing imagery, no-JavaScript and private-data exclusion. Basemap tests use the established deterministic CARTO fixture where configured; this does not establish uptime of the live basemap provider. Automated accessibility checks plus interaction/reflow inspection do not establish complete WCAG conformance or reader comprehension.

Technical failures and retries are retained rather than hidden: sandbox release-test runner failed at file level while its individual 27-test file passed; unrestricted suite passed all 28. Sandbox Next build received empty TypeScript subprocess output; unrestricted build passed. The first SEO negative-fixture invocation lacked a bundled browser; rerun uses the already installed Chrome. No source/configuration/test relaxation was made for these environment failures.

## Publication, source integrity and security

These are four separate decisions:

1. **Engineering:** validate the combined source and exact integration PR, then fetch and verify remote main. Successful historical PRs alone are insufficient.
2. **Historical/editorial:** existing source dossiers and visible limits survive; Pliny explicitly remains an AI-authored historical/literary draft awaiting human review. Neither schemas, pinned quotations, rights checks nor this integration establishes substantive human review. Provisional readings, unfinished Exodus and direct public asset scope remain documented limitations.
3. **Creator authorization:** the creator requested consolidated homepage publication in this task. That is recorded as intent, not a signature or artifact-specific acceptance. `publication-decision.json` and schema-v2 `canonical-acceptance.json` remain pending and unchanged. Older acceptance records cannot authorize these bytes.
4. **Deployment:** direct production/release rebuilds remain prohibited. Only the exact canonical prebuilt artifact, complete verified preview receipt and authentic detached acceptance can pass the existing gate. The task authorizes safe main integration; it does not erase the repository's separate publication prerequisites.

Existing source/media tests verify exact quotations, attribution, all six Pliny image hashes, local responsive delivery, manuscript Books II–III limits, contextual diploma/coin distinctions and retained generated-art disclosures. Source dossiers are preserved, not researched anew or represented as independent new historical validation.

Fresh `npm audit --json` exits 1 with **21 affected-package findings: 8 high, 13 moderate, 0 critical**. [Raw audit](consolidation-20261115/npm-audit.json) supersedes the old 22-count snapshot for this observation; the lockfile is unchanged. The known image-size/texture/deck chain, XML/ZIP loaders and lint-chain risks remain unresolved; absence of vulnerable runtime reachability is not proved. No audit-fix or dependency upgrade is attempted in this release-engineering task. This is a bounded patch/dependency assessment, not an exhaustive security scan. Existing Atlas attribution attacks and adversarial publication-boundary checks remain enabled.

## Vercel state and recovery

Project `biblemap`, `prj_xKJkC8WBUusxhsDXO4jjcJ7zlc2m`, team `team_xtntWPJwjGlK9FNNQy9sGESp` / `elliotandersons-projects`. [Observed Vercel state](consolidation-20261115/vercel-state.json) distinguishes current alias from old production metadata.

- `biblemap-pink.vercel.app` currently resolves through `get_alias` to **`dpl_GmVqVqkGkUN6JbQmu1LX9Mo8QtUS`**, immutable URL `biblemap-1qrevwnk3-elliotandersons-projects.vercel.app`, Git `46a3136e61e989b58802e266401685ff423da3ea`. Public HTTP shows the previous Human Story H1; it is not the Living Archive release. Deployment `target` is null, indicating alias/production-target drift requiring refresh.
- The production-filtered deployment list reports **`dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq`**, Git `e92b476729303cf00cf71f409c9cc64841ddf447`, as READY, `target: production`, **`isRollbackCandidate: true`**. This is a verified platform rollback candidate, not an assertion that it reproduces the current alias's bytes. Its older alias list still names the public domain, conflicting with the current alias record.
- Conditional rollback procedure: immediately refresh project target, `get_alias`, deployment readiness/eligibility and team/project; then use the approved Vercel rollback operation for the freshly eligible ID (CLI `vercel rollback <ID> --scope elliotandersons-projects` or scoped `request_rollback`), followed by alias/Git/HTTP and browser smoke tests. Never infer eligibility from an old report. No rollback has been executed.
- Current project summary shows Node 24.x, no password/SSO/trusted-IP protection, and no project environment variables. Domain is verified, with no domain-specific Git branch or custom environment. Live repository binding/production-branch and full build overrides are not exposed by the connected summary. Git metadata identifies `jayjz/biblemap`; tracked `vercel.json` disables automatic main deployments, uses `npm ci` / `npm run build` / `out`, and is unchanged. Last documented production branch was main; live configuration must still be confirmed.
- Full project/rollback CLI fallback could not authenticate: pinned CLI 65.2.0 reported no existing credentials. Device login attempts were cancelled. The initial filtered rollback MCP request returned 403; ordinary production listing supplied the eligibility evidence above. No login, project setting, environment, protection, alias, domain, production deployment or promotion was changed.

## Exact acceptance handoff and remaining operations

Freeze the verified main SHA, run the existing canonical workflow for that exact ref, download `canonical-release-<attempt>`, verify its GitHub attestation/source/workflow and complete manifests, then use the installed pinned CLI via `VERCEL_CLI_ENTRY` with `npm run release:preview -- deploy`. Retain the archive and receipts in protected storage before Actions retention expires. Do not substitute an automatically rebuilt Git preview for canonical bytes.

The creator must inspect that frozen preview and complete route/asset scope, provisional/unfinished content, editorial limitations and dependency risks. Supply an authentic schema-v2 acceptance with actor/date/evidence, exact source/input/artifact/output/manifest/scope digests, workflow/run/attempt/replica, preview ID, full verification digest, selected routes and accepted limitations. The agent must not fill acceptance identity/status on the creator's behalf. Then run `npm run validate:release` against those bytes; it includes fresh complete preview verification.

The existing procedure also requires explicit production instruction identifying the accepted manifest, staging the same prebuilt bytes without domain assignment, verifying the new deployment identity/served bytes and rollback route, then assigning traffic and smoking the public domain. No production writer workflow is installed. Missing authenticated CLI, unresolved live target drift/configuration, absent artifact-bound acceptance and missing staging evidence must be resolved before production. No direct production build, unrelated preview promotion or gate rewrite is an acceptable substitute.

Final integration PR/commit/tree, actual main fetch/check results, canonical run/artifact identities, preview outcome, PR reconciliation and final production/no-production state are recorded in the detached operation receipt linked in the final handoff. Keeping the final receipt detached avoids changing the canonical source inputs after artifact creation. This report itself is part of the candidate inputs; edits to it require a new candidate.
