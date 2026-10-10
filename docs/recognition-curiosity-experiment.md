# Recognition and curiosity: opening comparison

This is a creative hypothesis test. It does not presume that B is better or optimize for clicks. Built from `main` at `1e68586`.

## Openings for creator review

A (`/`) preserves the existing opening, including “The human condition. Questions that stay with us.”

Three B headlines were proposed before implementation:

1. Have you ever put off a conversation you knew you needed to have?
2. Have you ever been asked to do something you wished you could avoid?
3. Have you ever changed direction when someone was counting on you?

The creator selected **2** for provisional B (`/opening-b/`). Supporting copy:

> Keep that moment in mind, if one comes to you. Begin with Jonah, and leave room for the story to surprise you.

This asks about a visitor’s experience; it does not establish Jonah’s motive or interpret the whole book as avoidance. Final editorial approval remains open. Scripture may complicate the initial recognition; see [experience principles](experience-principles.md).

## Scope

`src/app/Homepage.tsx` holds the shared homepage. Only its opening varies. B removes the abstract kicker, leads with the human question, and uses a narrower, left-aligned composition with the same typefaces and palette. The shared component retains the existing hash/query atlas handling for A, including the lifetime of its in-memory question selection. B renders the homepage without the legacy atlas override.

The three optional question choices, invitations, Jonah link, future journeys, atlas navigation, and footer remain shared. Both entry links target `/jonah/#jonah-1-calling`. No new dependencies, tracking, analytics, storage, Scripture, reader, artwork, scene, or Exodus changes.

## Verification

- `npm ci`: passed; npm reports 36 existing dependency vulnerabilities. Dependency changes are outside this experiment.
- `npm run lint`: passed, with three existing unused-symbol warnings in unchanged `DataLoader.tsx`.
- `npx tsc --noEmit`: passed.
- `npm test`: passed, 2 test files.
- `npm run build`: passed, including story/media validation and static export of both routes.
- Browser verification: 35 passed, 1 intentionally skipped (legacy atlas mobile coverage). No runtime/console errors or failed requests in the homepage question-entry checks; no external requests in either opening’s entry check.
- Browser verification uses `CHROME_PATH=/opt/google/chrome/chrome PLAYWRIGHT_PORT=4193 npm run test:e2e -- tests/homepage.spec.ts tests/explorer.spec.ts` against the static export.
- Both routes exercise default entry, all three selections, radio keyboard navigation, reload/reset, reader focus/history, JavaScript-disabled entry, and axe WCAG checks. Shared markup is compared after removing the opening.
- Real browser screenshots inspected at 1440, 390, and 320 pixels: no clipping or horizontal overflow; headline, invitation, and shared sections remain legible. Reduced motion is exercised; no motion was added. Default and selected screenshots are generated in `test-results/`; CI preserves them in its existing Playwright evidence artifact.
- The opening has no image/audio request or asynchronous data state; its text renders without JavaScript. Loading, missing-media, and empty-data states are not introduced by this change.
- Pre-existing accessibility limitation from source inspection: A’s broad “any hash/query” atlas handler also catches the `#main-content` skip anchor. The same handler exists in base `main` at `1e68586`; it is retained to keep A and legacy URL behavior unchanged. Radio controls and keyboard story entry are tested, but the skip link’s activation is not a passing assertion in this suite. B does not use that atlas override.
- Existing explorer coverage exercises `/#creation`, epoch changes and reload, journey controls, and `/?event=0`, with a deterministic mocked basemap. The legacy explorer’s existing desktop-only coverage is retained.

## Observe without declaring a winner

Invite unbriefed people who have not recently read Jonah to encounter one version first; vary which version is seen first. Let them read or leave without prompting a choice. Ask afterwards what they noticed, what they expected, and whether anything made them curious or felt imposed. Record indifference, confusion, and early exits as well as recognition. Do not tell people that recognition is the desired answer.

The experiment changes both copy and composition, so responses cannot isolate a wording effect. B still foregrounds avoidance, which could narrow expectations even without attributing a motive to Jonah. The headline may be recognizable but less concrete than the conversation alternative. Technical checks and visual inspection establish neither recognition nor curiosity. No visitor observation has yet been conducted.

The next editorial decision should follow creator review and observation, not click totals. No merge or production deployment is authorized by this record.
