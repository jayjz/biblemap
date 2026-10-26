# BibleMap — Nineveh homepage audit and production decisions

**2026-10-25 · Review branch:** `feat/nineveh-definitive-home`. **Scope:** App Router/static export, Nineveh encounter, assets, story/atlas links, media provenance, browser coverage. This is a *targeted application-path audit*, not a security certification of the entire repository.

## Findings and resolution

| Severity | Verified finding on merged main | Treatment in this branch |
|---|---|---|
| Critical | The experience was accessible only with `BIBLEMAP_NINEVEH_REVIEW=1`; default export produced a 404 at the experiment route. | Public `/` renders the same shared Nineveh encounter; original `/experiments/nineveh/` remains gated for historical review, without enabling the build flag in production. |
| Critical | Its generated landscape lived in local-only `artifacts/nineveh-review/landscape.webp`; static Vercel lacked the file. | Public homepage uses an original illustrative SVG city silhouette with no network dependency. The generated matte painting remains local-only and unpublished. |
| High | Two rights-verified art images lived only under `artifacts/` and were served by the special local server. | Reuse the exact Git blobs at `public/media/nineveh-depth/`; verify SHA-256 and inclusion in `out/`; retain image attribution and explicit chronological limits. |
| High | Root homepage still rendered the old question-selector reader entry. | New server page uses static metadata and a thin client wrapper. Readers can enter at Jonah 1:1, follow the Nineveh sequence through 4:4, or continue through Jonah 4:11. |
| High | Root `?` and legacy fragment links previously resolved the atlas. | Client wrapper still honors legacy atlas query/hash deep links; `/explore/` remains the canonical atlas entry. |
| Medium | Old homepage browser tests no longer reflected the requested entry. | Replace their expected UI with checks for the new root, sourced discoveries, links, keyboard, no-JS, responsive layout, and preservation of the reader. |
| Medium | The code and root metadata still used the legacy `BibleExplorer` brand. | Update global metadata and use route-specific Nineveh metadata without changing the underlying journey. |

## Historical and artistic boundaries

- **Biblical foundation:** Jonah 3:10 and 4:1–4, exact pinned World English Bible. Journey continuation at 4:5–11 retains the unresolved 4:11 ending.
- **Historic place:** Nineveh is a real ancient city near the Tigris. The illustrative skyline is **not** a measured ancient map, period photograph, or Jonah's viewpoint. No specific gate, monument, or building is claimed.
- **Historical object:** British Museum K.3375 flood tablet is **seventh-century BCE**; does not date or verify Jonah, and does not establish dependence of the biblical narrative.
- **Reception history:** Cleveland Museum of Art Jonah sculpture is **280–290 CE**, not contemporary with the biblical story.
- **Theological voices:** Augustine and Pope Francis are contextual interpretations with precise source references and publication-rights notes. No doctrinal consensus or eyewitness access is claimed.
- **Image rights:** Flood Tablet photo by Fæ, CC BY-SA 3.0 including the format derivative; Cleveland image CC0. Individual files retain original records, verification metadata, checksums, and licenses.

## Architecture and constraints

- **One encounter component.** Root and local experiment share navigation, Scripture, context and accessible dialogs; landscape illustration differs intentionally by publication mode.
- **No new dependencies**, no server routes, no remote image requests, no server actions. The exported static pages conform to `next.config.mjs` `output: "export"`.
- Reader, WebGL atlas and incomplete Exodus project are **not modified**. Old `home.css` and research/experiment records are preserved for a separately reviewed legacy cleanup, not deleted indiscriminately.
- The earlier narrative question-selector is superseded at `/`. Open PR #11 explores that older homepage and must be reconciled editorially; do not merge it without adapting it.
- Historical presentation remains explicitly a sourced, potentially revisable interpretation. Visual media requires verified legal reuse rights, not a blanket institutional or creative stamp.

## Verification evidence before merge

CI should run: `npm ci`, `npm run validate:story`, `npm test`, `npm run lint`, `npx tsc --noEmit`, ordinary static export with Nineveh publication gate validation, review-mode build and desktop/mobile Playwright, and artifact evidence upload. Confirm the root and assets through a real preview browser. Record failures independently; never suppress tests or turn on the generated-artwork flag in production.

**Decision owner:** BibleMap creator. This document records implementation choices, not a claim that the visitor experience is complete or emotionally effective. Unbriefed visitor testing remains necessary.
