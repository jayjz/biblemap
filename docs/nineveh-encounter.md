# Nineveh — The City Remains

Local creative review on `feat/nineveh-city-remains`, based on PR #24 (`0ceb154`). No commit, push, PR, deployment or production change. Existing `.gitignore` and `next-env.d.ts` changes preserved.

Open [the encounter](http://127.0.0.1:4191/experiments/nineveh/) or [the screenshot comparison](http://127.0.0.1:4191/nineveh-review/). Stable beat links: `#city`, `#mercy`, `#anger`, `#question`.

To reproduce in PowerShell:

```powershell
$env:BIBLEMAP_NINEVEH_REVIEW='1'
npm run build
node scripts/review-irreplaceable.mjs
# In another terminal:
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
$env:PLAYWRIGHT_PORT='4191'
npm run test:e2e
node scripts/capture-nineveh.mjs
```

This machine additionally needs Git's command-scoped `safe.directory=C:/Dev/biblemap-release` setting for the build ID. The review server binds only to loopback. Without the build flag the route returns not-found. The generated candidate stays in `artifacts/nineveh-review/landscape.webp`, outside `public/` and the static export, served only by this review server. An ordinary static server intentionally shows the landscape fallback. Existing publication gates are unchanged.

## What the visitor encounters

Four deliberate pauses: orient to the city; read exact WEB 3:10; read all of 4:1–4 together; stay with 4:4. The city persists across the turn. The question is repeated without an invented answer. Optional recall restores 3:10; continuation opens the existing reader at 4:5 and retains its ending at 4:11.

An original generated panorama, an independently moving foreground shade and a stable place label supply depth without WebGL. Brief viewpoint adjustments use shared motion tokens. Nothing advances on a timer; pause freezes motion, reduced motion uses still views, and there is no sound. Mobile keeps the city above the scrolling prayer. Sources remain optional disclosures. No new dependencies.

The image is an interpretive reconstruction, not historical evidence or Jonah's viewpoint. The site context reuses the repository's Pleiades record. Architecture, vegetation, terrain, river course, lighting and camera bearing are invented; no visit date is asserted. Human creative and historical approval remain pending. The built-in image-generation tool made the original; the complete prompt, checksum, creator disclosure and limitations are in `src/features/nineveh/artwork.json`. The original PNG is retained locally; the 309,518-byte WebP is a compressed derivative.

## Comparison and limits

| Earlier experience | Difference in this encounter |
| --- | --- |
| Existing Jonah reader | Retains its complete-book context and remains the continuation. Here, Nineveh stays visible through the turn instead of giving way to the next scene's visual. |
| A: literary juxtaposition | A makes 3:10 immediately comparable to each verse. Here, the prayer stays together; 3:10 is optional, reducing default competing text but requiring a disclosure to compare it. |
| B: original geography | Replaces the schematic/map panel with a continuous environment. The atlas becomes an optional evidence link. No basemap or external image request is needed to read. |
| C: spatial composition | Uses a consistent city instead of changing symbolic block proportions. Motion marks attention, without claiming physical travel. |

Expert visual assessment: the landscape gives the place material scale and continuity while the complete prayer remains legible. The strongest remaining risk is that the detailed generated city could be mistaken for a documented reconstruction despite its persistent label. On phones, the persistent city costs reading space. No visitor study, comprehension improvement, screen-reader session or real-device performance result is claimed.

## Verification

- `npm ci`: passed; unchanged lockfile. Reports 30 inherited dependency advisories. Initial Windows file lock was resolved before reinstalling.
- Lint: zero errors; three inherited unused-symbol warnings in `src/components/DataLoader.tsx`.
- `npx tsc --noEmit`, static build, pinned Scripture/story/media validation: passed. Initial sandbox worker-spawn denial was resolved by running the same build outside the sandbox.
- Domain tests: 19 passed.
- Full browser suite: **65 passed, 10 failed, 1 inherited mobile-atlas skip**. All ten failures report `/explore/__next.explore.__PAGE__.txt` 404; the Windows export contains `explore/__next.explore/__PAGE__.txt`. This matches PR #24's recorded baseline defect. Existing reader, homepage and atlas implementations were not changed. The two earlier discovery timing failures did not reproduce.
- New encounter: 12 desktop/mobile checks passed in that run, covering exact Scripture, four beats, history/reload, keyboard/touch, source links, 320px reflow, city visibility during scrolling, pause, reduced motion, text view, no JavaScript, held/rejected landscape chunk, missing image, and continuation through 4:11. Axe found no violations in the four beats.
- After isolating the generated asset from static export: all 24 encounter and existing-media checks passed. Default-build inspection confirmed not-found content and no generated asset in `out/`; the opt-in build was then restored for review.
- Screenshot capture: 25 actual Chrome images at 1440×1000, 390×844 and 320×700; zero browser/console/network failures. Deliberate failure tests record their blocked requests separately. Evidence is in `artifacts/nineveh-review/`; the board includes before captures of the reader and A/B/C.

Changed implementation files: `src/app/experiments/nineveh/page.tsx`; `src/features/nineveh/{NinevehEncounter.tsx,NinevehEnvironment.tsx,nineveh.css,artwork.json}`; `tests/nineveh.spec.ts`; `scripts/capture-nineveh.mjs`; `scripts/review-irreplaceable.mjs` (local image/board serving only). This report and the local artifact directory complete the deliverable. Scripture, source records, media approval records, Exodus, the reader and atlas remain unchanged.
