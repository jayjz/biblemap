# Task 003 — Jonah visual assets: staged, not approved

This branch is a **partial delivery**. It contains ten museum candidates in [the JSON catalog](research/jonah-asset-candidates.json), a review-only image acquisition script, and CSS scene treatments for all six chapter-one scenes. **No museum image files are committed or wired into `JONAH.media`.** Only approved, checksummed local files may render, under `public/media/AGENTS.md`.

## Image acquisition

Object-level museum rights must be rechecked for the exact image to be downloaded. Record direct HTTPS image URL by consulting the individual object page or official museum API. On a machine with network access, run:

```bash
node scripts/acquire-jonah-art.mjs cma-jonah-swallowed 'https://<direct-cleveland-museum-image-URL>'
```

The URL is deliberately **not** invented or inserted into source. The script checks its destination host, format, filesize and SHA-256, and writes both image bytes and a receipt under `artifacts/jonah-image-review/`. This folder is staging, not a production manifest. Verify rights and visual identity manually and inspect dimensions, resolution, crop safety and photographic reproduction provenance. Keep receipts; don't commit staging blindly. If the script rejects a legitimate image host, inspect its official API/redirect and amend the allowlist in a reviewed change.

After the image is validated, copy an approved derivative to `public/media/`, create a complete `CuratedMediaAsset` record including SHA-256, institutional attribution and `reviewedBy`, then attach its stable ID to the matching `src/content/jonah.ts` scene. Do not set `reviewStatus: approved` unless a human editor has actually approved it. The existing `isProductionReadyMedia` is the shipping gate.

## Scene fit (proposals, not editorial approvals)
| Passage | Treatment in this branch | Candidate when approved |
| --- | --- | --- |
| 1:1–2 | Warm distant light and still horizon | NGA Raphael / Met Rosselli, prophet portrait (not a literal call) |
| 1:3 | Coastal night-horizon composition | Met Vaillant prophet portrait (not literal departure) |
| 1:4–6 | Storm contrast | No precise rights-verified storm-only Jonah illustration yet |
| 1:7–10 | Darkening sea | No confirmed image of confession / lots |
| 1:11–16 | Storm sea | Rijksmuseum Jan van de Velde, cast into sea |
| 1:17 | Dark underwater atmosphere | Cleveland `Jonah Swallowed`, early Christian reception |

Later scenes: Cleveland `Jonah Praying` is scene-ambiguous; `Jonah Cast Up` occurs after chapter 1; `Jonah Under the Gourd Vine` belongs to chapter 4; Rijksmuseum Jan Luyken belongs to chapter 3.

## Future video metadata
The catalog separates scene candidate, subject type, source institution, object number, rights, limitations and approval status. Once originals exist, add truthful pixel dimensions, licensed crops, accessible alt text and focal point information to a reviewed manifest. Camera directions and depth animation are *proposals*, not historical evidence. No pipeline has been implemented.

## Verification to run locally
```bash
npm ci
npm run validate:story
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Inspect `/jonah/#jonah-1-calling`, `/jonah/#jonah-1-escape`, every storm scene, and `/jonah/#jonah-1-depths` at 320, 390, 768 and desktop widths; confirm placeholders stay visually hidden, CSS fallbacks render with no external requests and the homepage/atlas still work. Tests have **not** been run by GitHub file-editing tools.

Editorial risk: CSS-hiding placeholder text does not remove it from source markup. Before public release, prefer conditionally omitting unapproved scaffolding from the rendered DOM, while retaining the authored source data and author-only workspace. Review existing source/provenance panels separately. Do not treat the CSS as completed release clearance.
