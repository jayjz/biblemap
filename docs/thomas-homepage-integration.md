# Thomas homepage integration — design and verification

Draft review on `feat/thomas-homepage-integration`, based on consolidated merge `2d504aafb8f368b2e827e3e88fd251e244b4da60`. PR #42 supplies the complete cinematic Thomas encounter, simple reading and separate sayings/manuscripts exploration; PR #43 supplies the initial release audit. Neither merge authorizes production publication.

## Design authority and plan

The installed [frontend-design skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) at `C:/Users/jcoul/.agents/skills/frontend-design/SKILL.md` and its Apache 2.0 `LICENSE.txt` were explicitly read and compared with Anthropic's official files. No installation or global configuration change was needed. Its subject-led composition, restrained hierarchy and browser critique govern this work.

Two directions were compared in the rendered homepage at desktop and mobile sizes:

- **A — The witness.** A horizontal cinematic invitation follows the existing Perpetua/Romanus pair. The anonymous gathering from Thomas V3 gives human scale to the question “What if you weren't there?” A separate, quieter document strip leads to the Gospel of Thomas. Preserve the root hero and the pair's placement.
- **B — Two ways a life reaches us.** A compact, text-led reading comparison pairs James's surviving accounts with John's Thomas narrative. It juxtaposes different sources, with no connecting line or claim of historical influence. The separately attributed sayings stay explicitly distinct. James is Jesus's brother; Thomas is the disciple named in John. This is an editorial comparison, not a new graph edge.

Shared tokens: existing deep blue `#153449`, mist `#edf2f3`, ink `#173344`; Thomas's umber `#2c211c`, chalk `#f3e9dc`, pale clay `#dcc4a7`. Retain the locally hosted Playfair display and Geist body fonts so the invitation belongs to the portal. Large sentence-case type, opaque text surfaces, no animation. Use one existing lazy image with its 768/1536 variants (42,442 / 134,070 bytes), no new media or dependency.

```text
A  [Perpetua] [Romanus]       B  [Perpetua] [Romanus]
   [question | gathering]       [James | Thomas]
   [separate sayings link]      [source distinction / sayings]
```

Before implementation, the plan was checked against the brief: a third equal giant portrait card would overwhelm the pair, and a network diagram would imply relationships the present graph does not support. A instead uses a shallow horizontal composition; B uses a reading comparison with explicit source differences. Keep copy brief and outside the detailed artwork, with provenance available in a native disclosure.

## Evidence boundaries

Homepage copy is a draft invitation to the existing source-backed routes, not new historical narration. John 20:24–29 supports absence and testimony. The existing [Thomas dossier](research/thomas-source-dossier.md), pinned Scripture and [sayings introduction](../src/content/thomas.ts) support the distinction between John's narrative and the separately attributed collection; apostolic authorship is not established. The [asset manifest](../public/media/thomas/manifest.json) records anonymous invented people, AI generation, source limits, rights, checksums and responsive variants. They are not portraits or recovered eyewitnesses.

Thomas is a curated reading destination, not a fabricated `HUMAN_GRAPH` entry. No graph entity or relationship is added merely for discovery. Production approvals, Jonah release gates and static-export exposure remain a separate release task.

## Rendered comparison

The built homepage was captured at **1440, 768, 390 and 320px** before implementation and for each direction. Direction B was substituted into the actual homepage DOM by the local capture script; its HTML lives under `artifacts/`, not an exported application route. Both full-page and invitation captures were opened at desktop and mobile sizes.

**A is selected.** Its human-scale cloth, shoulders and gathering introduce the cinematic experience's medium. The title asks a question without assigning a reason for Thomas's absence. On desktop the image is broad but shallower than a hero; on mobile it retains the gathering, with copy on its own opaque surface. Perpetua/Romanus stay before Thomas, the root hero stays unchanged in content, and the sayings entrance reads as a supporting document rather than a rival narrative.

**B is rejected.** The reading comparison is source-honest and legible but repeats the text-led discovery below it. At mobile it becomes two more stacked readings and delays Thomas behind James. It offers less immediate connection to Thomas V3's distinctive visual language. This is an art-direction judgment, not a measured visitor response. No reader study is claimed.

First-render critique found the cinematic component's CSS overriding the intended crop; a more specific invitation rule now retains the group at 66% horizontal position. Four-width 200% text checks also found existing overflow in the hero, thread headings, Genesis spread and long reading titles; it persisted with Thomas hidden. Bounded grid sizing and text-wrap corrections let those existing layouts wrap rather than clip or hide the excess. Initial failure evidence remains in `enlarged-before-fix/`. No general layout redesign, font replacement, new image or animation was introduced.

| Rendered evidence | Desktop | Mobile |
|---|---|---|
| Baseline homepage | [1440](../artifacts/thomas-homepage/before/home-1440.jpg) | [390](../artifacts/thomas-homepage/before/home-390.jpg) |
| Selected A invitation | [1440](../artifacts/thomas-homepage/after/thomas-1440.jpg) | [390](../artifacts/thomas-homepage/after/thomas-390.jpg) |
| Alternate B invitation | [1440](../artifacts/thomas-homepage/study-b/thomas-1440.jpg) | [390](../artifacts/thomas-homepage/study-b/thomas-390.jpg) |
| Final full homepage | [1440](../artifacts/thomas-homepage/after/home-1440.jpg) | [390](../artifacts/thomas-homepage/after/home-390.jpg) |
| Narrow invitation | [768](../artifacts/thomas-homepage/after/thomas-768.jpg) | [320](../artifacts/thomas-homepage/after/thomas-320.jpg) |

Each capture directory contains a timestamp, build ID, relevant source hashes, exported HTML route list and browser observations. `scripts/review-thomas-homepage.mjs` reproduces the before/after/study/enlarged captures against a static server. Normal and deliberately failed-media runs are kept distinct.

## Final checks and release boundary

Baseline source/media/static build and four-width normal captures passed. Baseline `validate:release` failed on existing Jonah editorial items; that is evidence of a retained blocker, not a passing check. Final normal and 200% text captures now record no document overflow, invitation text escaping its frame, broken images, page/console errors, failed requests or axe violations at any requested width. Reduced motion has zero running animations. This is automated WCAG-tag coverage, not a comprehensive conformance or assistive-technology user-test claim.

The generated HTML route inventory is **48 before and 48 after, with no additions or removals**. `src/content`, `public/media`, `src/app`, dependency manifests, CI and release/export validators have no diff from the starting merge. The visitor-boundary check inspects 477 HTML/RSC/JS/JSON/alternate-text artifacts and retains all 48 Jonah WEB verses; its private-probe check remains narrower than full draft-exclusion policy. Known exported drafts remain unresolved. Thomas adds a homepage draft invitation to already exported routes, not an additional route or graph record.

| Check | Executed result |
|---|---|
| `npm ci` | Exit 0; unchanged lockfile; 38 existing dependency audit advisories (1 low, 16 moderate, 19 high, 2 critical) |
| `npm run validate:story` (includes media validation) | Exit 0; pinned Jonah, James and Thomas text and existing rights/asset checks retained |
| `npm run lint` | Exit 0; four existing warnings in unchanged `DataLoader.tsx` / `validate-nineveh-depth.mjs` |
| `npx tsc --noEmit`, `npm run typecheck` | Both exit 0 |
| `BIBLEMAP_VERIFY_EXPORT=1 npm run test` | Exit 0; 59 passed, no skips |
| `npm run build` | Exit 0; 48 static routes, postbuild export validation passed |
| `npm run test:e2e` | Exit 0; **217 passed, one existing mobile Atlas skip**, 6.0 minutes; includes ten new homepage assertions across desktop/mobile plus the existing Thomas, James, Perpetua, Romanus, Jonah, Nineveh entrance and discovery suites |
| `npm run validate:release` | Exit 1; the existing 68 Jonah unfinished-text / human-approval items; no gate changes |

Logs are retained in [`artifacts/thomas-homepage/checks/`](../artifacts/thomas-homepage/checks/). The separate opt-in Nineveh suite was not run locally in this pass and remains part of CI; its outcome and the exact hosted preview are reported on the draft PR. Local environment: Windows, Node 24.22.2, npm 11.19.1, installed Chrome; CI continues to use its existing Node 22.22.3 configuration. Browser startup and build worker spawning require execution outside this workspace's process sandbox; the original sandbox EPERM attempts are not reported as implementation failures. The first exploratory focused run had 15 passes and one enlarged-text failure; the final regression includes the correction and a stricter invitation text-bounds assertion.

The scope is a draft homepage invitation plus curated discovery, documentation and regression coverage. Existing content, assets, routes, source pins, production configuration and release validators are unchanged. The initial workspace's untracked home-discovery/Thomas/James review artifacts are preserved and excluded from this feature's commits.

Vercel read-only inspection found that the public domain currently points to an older `feat/home-story-discovery` artifact (`e92b476`), while `main` still defines Nineveh. See the [readiness addendum](release/readiness-audit-2026-11-05.md#current-addendum--thomas-homepage-integration); this feature neither changes that state nor claims an editorial release.
