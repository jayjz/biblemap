# Jonah recognition-first opening — 2026-10-10

Branch: `feat/jonah-visual-assets`; PR #4. Baseline: `4f6a116a401d15ecb46ceb41419b90a798b903fa` and its existing Vercel branch preview. This pass is limited to the homepage, reader introduction, first three scene compositions, and related browser assertions. All 48 WEB verses, 13 scenes, three museum images and their approvals/provenance, atlas, and Exodus implementation remain intact.

## Composition and copy

- Homepage: “What are we running from?” followed by the supplied recognition sentence. The existing thesis, sea composition, story link, and future journeys remain.
- Reader: supplied examples and “Sometimes, leaving feels easier.” replace the previous invitation. Introductory spacing is reduced; no extra screen, pause, control, or automatic progression is added.
- Calling: Scripture and Raphael remain together; the responsibility question and repetitive orientation paragraph are removed from visitor presentation. The optional passage companion still identifies Nineveh.
- Flight: “But what was Jonah really running from?” follows the complete verse and translation/source disclosure. Philosophy remains collapsed, attributed, and explicitly separate from Scripture.
- Opening storm: the leading question about avoidance is omitted so the sailors’ actions and Jonah’s sleep are encountered in the text first.
- Mobile: Scripture precedes art in these three scenes. Later scenes retain their composition and prompts. Jonah 4:2 still supplies the stated motive; 4:11 and the open ending are unchanged.

No new interpretation, testimony, historical claim, or source was added. Supplied language is used only within this task’s creative scope; other provisional content and author slots retain their existing review status.

## Verification and actual screenshot review

`npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` pass. Build includes pinned Scripture and media validation. Lint retains the three documented unused-symbol warnings in `DataLoader.tsx`; npm reports the existing 36 dependency advisories. Generated `next-env.d.ts` build drift was restored and TypeScript checked again.

Final browser result: **31 passed, one pre-existing mobile atlas interaction test skipped**.

Browser command: `CI=1 PLAYWRIGHT_PORT=4198 CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e`. Coverage includes exact verse text, all scenes, history, keyboard focus, reduced motion, 320px reflow, no-JavaScript reading, Axe accessibility, approved image decoding and provenance, missing-media/audio failures, private-note lifecycle, homepage, and desktop atlas/Exodus regression. The existing mobile atlas interaction skip remains unchanged.

The first run exposed two stale test assumptions: every scene had a sidebar question, and entering from home generated no cancelled HEAD prefetch probes. Assertions now require the opening questions’ absence and record cancelled document/HEAD probes separately, while still failing script, CSS, image, data, HTTP, and page errors.

Actually inspected real Chrome desktop (1440×1000) and mobile (390×844) screenshots of the homepage, reader entry, Jonah 1:1–2, 1:3, 1:4–6, 4:1–4 (including 4:2), and 4:11, against the previous public Vercel preview. Contact sheets and individual opening/flight/storm/mercy/ending captures were reviewed. The result reduces introductory material and brings Scripture earlier on mobile; it does not merely append more prose. Raphael stays uncropped. Initial mobile entry capture reached an offscreen lazy image before decode; the final captures scroll it into view and wait for decoding.

Local evidence: `/tmp/jonah-recognition/public-baseline/`, `/tmp/jonah-recognition/after/`, and their desktop/mobile review sheets. Browser reports show no console/page errors or horizontal overflow. Only cancelled local Next document/HEAD probes were observed; successful reading checks report no resource/HTTP failures. Deliberate failure tests remain isolated.

## Assumptions and remaining editorial questions

The three beats are integrated into the existing homepage and reader, not mapped to three new screens. “A responsibility” is a supplied example of familiar experience, not an explanation of Jonah’s motive. The first and storm source questions remain in the provisional content record but no longer render in those scene sidebars.

Remaining human review concerns the existing later prompts, companions, philosophy selections, author slots, and whether the opening’s restrained pace feels right to first-time readers. `npm run validate:release` still intentionally rejects existing unfinished authorship and unapproved reading companions; scoped recognition wording and artwork approval do not imply a complete editorial release.

The previous Vercel preview was independently accessible without credentials on this date: HTTP 200, Jonah title, and reader DOM present. Deployment success and access to the new revision must be verified separately after pushing. No merge or production deployment is authorized or performed.

Changed files: `src/app/page.tsx`, `src/content/jonah.ts`, `src/features/story/StoryReader.tsx`, `src/features/story/FirstEncounter.tsx`, `src/features/story/story.css`, `tests/first-encounter.spec.ts`, `tests/jonah.spec.ts`, and this report. No dependencies changed.
