# Human Story homepage release preparation

This release task supersedes the earlier design-study restriction on preparing
the homepage swap. It authorizes routing, technical verification, a branch commit
and a manual preview; it does not supply the missing editorial approvals.

## Execution checklist

- [x] Confirm branch, starting SHA, PR state, production project and domain.
- [x] Audit publication gates before editing.
- [x] Share the existing Human Story entrance between `/` and `/human-story/`.
- [x] Preserve the published Nineveh encounter at `/nineveh/`.
- [x] Retain recognized root Nineveh fragments and legacy Atlas links.
- [x] Complete desktop/mobile regression and separate Nineveh review suites.
- [x] Review the release diff and exclude unrelated local changes.
- [ ] Obtain the missing publication approvals; merge remains blocked.

After this preparation checkpoint, commit and push only the reviewed files,
verify GitHub checks on that exact commit, and create/browser-check a manual
Vercel preview. Record its immutable SHA, URL, deployment ID and outcome in the
release handoff. Merge and production verification require every publication
gate to pass; this checkpoint does not authorize that step while gates fail.

## Local verification at the preparation checkpoint

- `npm ci`: passed; 45 existing audit findings (1 low, 23 moderate, 19 high,
  2 critical). No dependency changes.
- `npm run lint`: passed, with the same four baseline unused-variable warnings.
- `npx tsc --noEmit`: passed.
- `npm run test`: 35 passed, no failures or skips.
- `npm run build`: ordinary and `BIBLEMAP_NINEVEH_REVIEW=1` builds passed;
  final local export restored to ordinary mode.
- Build preflight `npm run validate:story` / `npm run validate:media`: passed;
  all 48 pinned Jonah verses and notes, media identities/rights, and interior
  edition/rights tests remain enforced.
- `node scripts/validate-nineveh-depth.mjs --production-export`: passed. Both
  entrances are present; unreviewed landscape and review assets remain excluded.
- `npm run test:e2e -- --reporter=list --output=test-results/release-full`:
  **141 passed, one pre-existing intentional mobile Atlas skip** (142 total).
- With `PLAYWRIGHT_REVIEW_SERVER=1`, `npm run test:e2e -- --reporter=list
  --output=test-results/release-nineveh`: **22 passed**. These output overrides
  protect the pre-existing review directories. Chrome used the existing
  `CHROME_PATH` option.
- `git diff --check` and explicit staged-file review passed. The shared Human
  Story component body matches the original page body exactly.

Desktop/mobile browser coverage includes canonical routes, legacy query/hash
links, history, all five worlds, Perpetua and Augustine, complete Jonah reading,
metadata/noindex, keyboard focus, axe, reduced motion, 320px reflow, no-JavaScript
and failed-media/script fallback. The release-route assertions found no
unexpected console/page errors, failed requests, broken images or overflow.
Local Atlas assertions use the established deterministic basemap fixture; use
`PLAYWRIGHT_LIVE_BASEMAP=1` for the preview release-route smoke checks.

Regression work corrected the legacy Home action and updated old homepage
assumptions to the new canonical routes/entrance link. No assertions, timeouts
or publication gates were weakened. Node emits its existing module-type and
color-environment warnings. Browser evidence is under `test-results/release-full/`;
local command logs are under `artifacts/homepage-release-*.log`.

## Preflight and routing contract

Starting branch: `feat/human-story-portal`, local/remote head
`7a3c34bcd3a5c8054f3c3a95993264732cbc6505`. PR #36 was draft, open,
mergeable, had no reviews, and its technical check passed. The pre-existing
`next-env.d.ts` modification and untracked `artifacts/jonah-human/`,
`playwright-report-nineveh/` and `test-results-nineveh/` are excluded.

`/` and `/human-story/` use one server component. Both have Human Story title,
description and social metadata, canonicalized to the production root. Both
retain `noindex, nofollow` and the existing editorial disclosure. All Human
Story interiors retain their noindex layout. No sitemap, robots.txt or structured
data exists to migrate. Indexing and review-copy cleanup require the missing
publication authorization; this candidate is for preview review.

`/nineveh/` reuses `NinevehHome`, its original CSS and encounter. Relative beat
and discovery links retain their URL and history behavior. The Human Story
footer links to `/nineveh/`; its wordmark, the Nineveh brand, the Jonah reader's
brand/ending, and the Atlas Home link mean the site homepage and retain `/`.
Jonah continuation and Atlas place/return-scene URLs remain unchanged.

Old `/#city`, `/#mercy`, `/#anger`, `/#question`, valid discovery suffixes and
Nineveh accessibility anchors still open Nineveh in place, including tracking
queries. Recognized Atlas queries and epoch/book fragments still open the Atlas.
Unknown fragments and Human Story anchors stay on Human Story. A fragment does
not reach a static server, so these legacy views need JavaScript, as before;
the canonical entrances and complete Scripture fallback remain server-rendered.
Native fragment changes and Back/Forward invalidate the compatibility view.
The Home action from a historical root view performs a document navigation to
clear the old fragment/query; canonical routes keep their normal Next links.
There are no redirects or deployment-setting changes.

## Publication blockers — confirmed before implementation

`npm run validate:release` exits 1. Pinned Jonah text passes, but the release
validator rejects unfinished author slots for Nineveh, Joppa and Tarshish,
unfinished scene/reflection slots, and missing human approval for every Jonah
scene and reading companion: **68 errors, comprising 42 unfinished author slots
and 26 missing approval records across 13 scenes**. No approval values or
validator rules are changed.

That command validates Jonah; passing it would not approve the Human Story
drafts. PR #36 and the following records still require human review:

- [Human Story source and rights ledger](research/human-story-sources.md):
  approve the new narratives, theological framing and cross-era connections;
  obtain qualified Hebrew review of the original Radak paraphrase. The inspected
  Hebrew API had unknown edition rights and no English text; no translation
  approval is inferred from a source link.
- [Perpetua claim audit](research/perpetua-narrative-audit.md): a qualified
  historical editor must review attribution, composite authorship, Latin/Greek
  transmission, reported speech, visions and narrator boundaries against a
  critical edition. Unaccessed scholarship remains a research lead.
- Confirm source/translation reuse and media attribution obligations and review
  the disclosed AI-authored relationship drawing. Existing rights validation is
  technical evidence, not historical/theological publication approval. Review
  material and local-only experimental artwork remain gated.

No GitHub editorial review was present at preflight. Creator material, editorial
approval and rights review must be documented by the responsible humans. Keep
PR #36 draft and unmerged while these gates remain unresolved.

## Production and rollback reference

Vercel project `prj_xKJkC8WBUusxhsDXO4jjcJ7zlc2m`, team
`elliotandersons-projects`, production branch `main`. The verified domain is
`https://biblemap-pink.vercel.app/`. At preflight it points to READY production
deployment `dpl_HZ92yoxrEAZeji5vcrq8SyMjBqUP`, immutable URL
`https://biblemap-cm0adq5n1-elliotandersons-projects.vercel.app/`, commit
`60ecbda079f5fd29325b68549fe6d01ced74a7fc`. Preserve this deployment/commit as
the rollback target. No production change is authorized while the gates fail.

The older `77tu3jrrw` preview is commit
`38613d51b52f44158caad828a85f02cca0ff571d` and is not evidence for this candidate.
Automatic deployment stays disabled for `feat/human-story-portal` in `vercel.json`.
