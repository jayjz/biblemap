# Task 001 — Question-led homepage (author-review)

> Historical homepage checkpoint; its chapter-one-only inventory is superseded. See [Jonah V1](jonah-v1.md) and [the maintained completion audit](jonah-completion.md) for current status. The dated record below is preserved.

## Intent
Start with questions that invite a reader unfamiliar with Scripture, not with maps, filters, or an assertion about what to believe. The visual sea/storm composition is CSS-only; it is atmospheric, not an image claiming to depict an ancient event or a rights-cleared museum artwork.

- `/`: introduction to BibleMap, available Jonah chapter-one reader, four explicitly unavailable future stories, and atlas link.
- `/jonah/`: existing author-review Jonah reader; untouched by this task.
- `/explore/`: existing client-only WebGL explorer moved into a dedicated route without changing DataLoader.
- Legacy `/#epoch` and `/?event=...`, `/?explore=1` are handled at root with a browser-side compatibility switch to the same explorer component. New links should prefer `/explore/`.
- The homepage itself does not load the WebGL bundle for users without legacy URL parameters.

## Editorial boundaries
The questions and copy are provisional concepts, not quotations, biblical text, approved author narration, or assertions of theological consensus. Jonah chapter one only is implemented. Job, Jacob, Exodus, and Joseph are non-interactive future-journey previews. The Exodus world-model worktree is not involved.

## Review checklist
- Read the story-entry headline and supporting copy for accuracy, restraint, and authorship.
- Decide whether the CSS sea composition is sufficient or whether a later rights-reviewed painting belongs here.
- Validate legibility on small screens, keyboard skip link, direct URL navigation, reduced-motion behavior.
- Exercise the explorer through `/explore/`, legacy `/#creation`, `/?event=0`, and reader's `/?explore=1` exit.
- Confirm the existing Playwright explorer and Jonah tests remain green.
- Check WebGL bundle/network requests are absent on fresh `/`.

## Commands (must be run locally or in CI; not executed by GitHub file editing)
```sh
npm ci
npm run validate:story
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The `tests/homepage.spec.ts` Playwright test captures responsive screenshots under `test-results/`. Review them in a real browser before editorial approval.

## Limitations
GitHub-side authoring cannot inspect local uncommitted work, execute npm/Playwright, inspect screenshots, or confirm runtime compatibility. No visual sign-off or release approval is implied by commits. No merge or deployment is authorized.
