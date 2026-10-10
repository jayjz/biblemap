# Jonah public-preview preparation — 2026-10-10

> Historical preview-preparation evidence; its branch/PR/protection state and test results describe that checkpoint. See [Jonah V1](jonah-v1.md) and [the maintained completion audit](jonah-completion.md) for current status. The dated record below is preserved.

Branch: `feat/jonah-visual-assets`. PR: https://github.com/jayjz/biblemap/pull/4. Existing PR base and prior work retained; no main merge, branch deletion, or Exodus implementation change.

## Changed files

- `public/media/jonah/`: three locally hosted, uncropped museum-image derivatives, about 641 KiB total.
- `docs/research/jonah-asset-candidates.json`, `src/content/jonah-media.ts`: scoped creator approval relayed by the user; actual fresh institutional retrieval timestamps, URLs, original/derivative hashes, dimensions, and transformations; approved scene mappings. Original supplied records and unknown acquisition dates preserved.
- `scripts/validate-jonah-assets.mjs`: enforce publication approval, source metadata, file existence, checksums, sizes, and dimensions; reject unknown public files.
- `StoryReader.tsx`, `FirstEncounter.tsx`, `src/app/page.tsx`: remove repetitive visitor-facing provisional notices while keeping source drafts and meaningful Scripture/commentary/philosophy labels.
- `StoryMedia.tsx`: recover when a server-rendered image fails before hydration attaches its error listener.
- Domain/browser tests: scoped production approval, exact four-scene artwork mapping, real-route image decoding and provenance accessibility, and missing-artwork recovery.
- `docs/jonah-v1.md`: current approval scope, acquisition history, and editorial limitations.

## Verification

- `npm ci`: pass, unchanged lockfile. Existing audit reports 36 advisories (1 low, 10 moderate, 23 high, 2 critical); dependency remediation outside this change.
- `npm run lint`: pass, zero errors and three existing unused-symbol warnings in `DataLoader.tsx`.
- `npx tsc --noEmit`: pass.
- `npm test`: both domain test files pass.
- `npm run build`: pass; TypeScript enabled, static export retained for homepage, Jonah, atlas, demo, and not-found routes.
- Build validation confirms all 48 verses and translator notes match committed publisher snapshots. No Scripture changes.
- `npm run validate:media`: pass; original/hold files preserved and exactly three approved publication files verified.
- Full desktop/mobile browser suite: **31 passed, one pre-existing mobile atlas interaction test skipped**. Command: `CI=1 PLAYWRIGHT_PORT=4195 CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e`.
- Coverage includes every scene in all four chapters, all verse text, section links/history, keyboard focus, reduced motion, 320px reflow, no-JavaScript reading, source credits, Axe accessibility, private-note lifecycle, no external Jonah resource requests, image decoding, audio failures, missing-image recovery, homepage, desktop atlas/Exodus regression, empty event filtering, and selected-event dialogs.
- Inspected real-browser screenshots of desktop/mobile Jonah artwork compositions, homepage, and atlas. Full artwork sheets and inscriptions remain visible. Existing mobile atlas controls remain limited; no atlas redesign was attempted.
- Separate live CARTO desktop/mobile `/explore/` smoke checks: ready, 109 visible events, no horizontal overflow, zero console/page errors, failed requests, or HTTP errors. Report and screenshots saved locally at `/tmp/jonah-live-browser-results.json` and `/tmp/jonah-*-live-atlas.png`.
- Normal Jonah checks report no page exceptions, failed resources, or HTTP errors. Deliberate 404/playback failures occur only in fallback tests; cancelled document/HEAD probes are recorded separately.
- `npm run validate:release`: intentionally still fails on existing unfinished author slots and human editorial approval requirements. Preview authorization does not silently approve those records.
- `git diff --check`: pass. No new dependencies or unrelated file changes.

The first real-route 404 test exposed a failure before hydration; the image ref now checks already-completed failed images. The complete browser suite passed after that fix.

## Deployment access

The existing GitHub/Vercel integration creates Preview deployments for this branch. Before pushing this change, the branch alias existed but anonymous `/jonah/` requests redirected to `vercel.com/login` (browser title `Login – Vercel`, zero reader nodes). This workspace has no Vercel CLI executable, no credentials at the standard CLI paths, and no Vercel token environment variable. A protected preview cannot be represented as a publicly shareable URL. Deployment details for the pushed commit are reported in the delivery response; public browser verification requires protection access or a shareable deployment link.

## Remaining editorial limitations

Creator approval is recorded exactly as relayed, without an invented personal name or original approval date. It covers the public reading preview and the three specified artwork placements. Scene titles/questions/companions, philosophical selections, homepage/ending copy, and author slots retain their previous editorial status. Captions and alt text are not represented as a separate completed editorial review. The three reproductions with unresolved exact rights remain excluded from public files and static export.
