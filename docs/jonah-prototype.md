# Jonah: The Man Who Ran — author-review prototype

> Historical chapter-one checkpoint; chapters two through four and approved media are now integrated. See [Jonah V1](jonah-v1.md) and [the maintained completion audit](jonah-completion.md) for current status. The dated record below is preserved.

The additive `/jonah/` route implements all of Jonah 1 as six reader-controlled beats. It does not replace the map explorer or incorporate the unfinished Exodus world-model changes. Built on `feat/immersive-foundation` (`ea2365a`) in the isolated `feat/jonah-reader` worktree.

## Review locally

```sh
npm ci
npm run build
npm run preview
# http://127.0.0.1:4189/jonah/
```

The page is marked author-review and noindex. This is not an access-control mechanism: do not publish private drafts to public hosting. No publication is part of this change.

The reader has stable scene hashes, previous/next controls, browser history, optional evidence disclosures, and private notes. Neither time, scrolling, nor audio advances the story. Without JavaScript, all 17 verses and ordinary anchor navigation remain available; notes are disabled because their privacy lifecycle requires JavaScript. With JavaScript, notes remain only in React memory, survive scene changes, and clear on exit, page departure, reload, or explicit clear. The app does not submit, persist, log, or expose them through its inspector.

## Authoring boundaries

`src/content/jonah.ts` is the author-facing scene manifest. The six section labels come from the owner's proposed sequence; scene titles, interpretation, narrative, prompts, historical claims, geographic identifications, artwork, and narration remain explicit author slots. No approval is inferred from older `biblemap-editorial` records.

Replace an `AuthoredText` placeholder with a written record, retain an identifiable `authorId`, and use `review: { status: "draft" }` until the human author approves it. Only then record the real reviewer and review date. Never create an approval on the author's behalf.

`src/domain/story.ts` defines the reusable contract and pure validation. Future books can supply another `StoryDocument`; no database, CMS, WebGL renderer, or narration engine is required. This first renderer uses Jonah-specific navigation labels and passage presentation; generalize those labels when a second book actually needs them.

The current scenes cover 1:1–2, 1:3, 1:4–6, 1:7–10, 1:11–16, and 1:17. Depths continues through chapter two; Second Chance and Unanswered Question reserve chapters three and four. Their content is not implemented or invented.

## Scripture, evidence, and media

- `src/content/scripture/web-jonah-1.html` is the pinned eBible.org publisher snapshot; `web-rights.html` preserves its rights statement. The JSON is deterministically extracted from that snapshot, including translator notes. Only markup and layout whitespace are normalized.
- `npm run validate:story` checks exact extracted text, all 17 verses, source checksum, translation identity, scene references, transitions, evidence requirements, and media provenance. It runs before every build. Builds never fetch scripture or author claims.
- `node scripts/pin-jonah.mjs` regenerates JSON from the committed HTML; it does not download or update the source. A future source update must deliberately replace the snapshot, version/retrieval metadata, and rights record, then review the resulting verse diff.
- The provisional translation is the World English Bible (`engwebp`), identified by its publisher as public domain. Keep translation name, exact text, version, reference, and rights together. Another translation requires its own rights review, not a string substitution. [Publisher rights](https://ebible.org/engwebp/copyright.htm).
- Geography currently lists names from the passage, with no invented coordinates or itinerary. The schematic explicitly has no geographic scale. `unknown` means this prototype has not established an identification; it does not assert that scholarship has none.
- Historical claims require source IDs, precise locators, supported scope, limitations, claim basis, and separate certainty. Disputed/unknown claims need uncertainty notes; theological interpretation requires a named lens.
- Only approved local assets from the existing `CuratedMediaAsset` contract can be attached. The build verifies attached file checksums. There are no attached Jonah images or recordings. Missing artwork stays a neutral CSS surface; it never hotlinks an unrelated substitute.
- The ready-to-attach audio component offers separate track play/pause/replay, volume, mute, transcript, and rights disclosures. It does not autoplay, synthesize a voice, or advance a scene. Scene exit and document hiding pause playback. Test audio is generated silence in a test-only harness, never shipped in the app.

```sh
npm run validate:release
```

This command **must fail for this prototype**: draft scenes and author placeholders are not releasable. Public release requires actual authored/reviewed content, selected artwork and voice rights, final taste approval, and the manual checks below. A successful preview build does not imply editorial approval.

## Verification and dependencies

```sh
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
# Or use an installed Chrome:
CHROME_PATH=/opt/google/chrome/chrome npm run test:e2e
```

Playwright serves the exported `out/` directory. Tests cover desktop and mobile reading, keyboard focus, direct links/history, no timed advancement, notes privacy, reduced motion, 320px reflow, a half-width viewport equivalent to desktop 200% zoom, no-JavaScript reading, blocked WebGL/external requests, missing artwork, real audio playback/pause, rejected playback, and the existing explorer's data/filter/epoch/selection/journey behavior. Axe checks the expanded reader disclosures against WCAG A/AA rules. Screenshots and failure traces are generated under ignored `test-results/` and `playwright-report/` directories.

New dependencies are development-only: Playwright (browser regression), axe (automated accessibility), and esbuild (an in-memory browser harness for the media component, without adding a production test route). No production libraries were added or migrated. The installed dependency audit reported the same 36 vulnerabilities before and after these additions; dependency remediation is a separate task.

## Verification result (2026-10-10 UTC)

- Static export, scripture validation, type-check (including unit tests), and unit tests pass.
- Browser suite: 13 passed, one explicitly skipped legacy mobile-explorer case. Desktop explorer regression and all desktop/mobile Jonah and media checks pass.
- Expanded reader disclosures report no axe WCAG A/AA violations. No WebGL or third-party services are needed by Jonah.
- Local desktop and mobile screenshots were visually inspected. VoiceOver/NVDA and real-device Safari remain manual release checks.
- Release validation fails as intended on unfinished author slots and missing human approvals.

## Existing limitations and release checks

- The original explorer implementation is unchanged. Its book-filter handler can create `/&book=…` when starting from bare `/`; canonical epoch links such as `/#creation` work. Regression tests use that established URL form. Fixing the bare-root URL defect is separate work.
- The existing demo-link lint error was corrected with Next `Link`. Three pre-existing unused-code warnings remain in `DataLoader.tsx`.
- The documented Vercel deployment returned `DEPLOYMENT_NOT_FOUND` during planning. Hosting was not modified.
- Chrome desktop/mobile emulation and accessibility-tree/axe checks do not substitute for real iOS Safari, Android hardware, or a human VoiceOver/NVDA pass. Complete those before public release.
- The legacy explorer's mobile layout and modal accessibility are not repaired by this isolated reader. Explorer regression coverage is desktop; Jonah coverage includes mobile.
- A release review must select/clear any new artwork and recordings, check responsive derivatives and long transcripts, verify geographic evidence, and confirm the final translation and interpretation. No placeholder content should be approved merely to pass a gate.

Official references: [Next static export](https://nextjs.org/docs/app/guides/static-exports), [WAI modal guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [browser audio playback policy](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
