# Jonah visual review

These two files are candidates whose Commons public-domain label was not reconfirmed with the holding institution.

Do not copy them into `public/`. The local review server in `scripts/review-jonah.mjs` is the only viewer.

The missing local files were retrieved again from the existing manifest URLs on 2026-10-11. Their observed SHA-256 values are recorded in `src/content/jonah-visual-review.ts`. They differ from #16's recorded checksums; the old files were unavailable for comparison. This records a new local acquisition, not a rights or editorial approval.

After `npm run build`, start `npm run review:jonah`, then run `node scripts/capture-jonah.mjs`. The ignored `artifacts/jonah-scene-board/index.html` contains all 13 scenes at 1440px, 390px, and 320px, with separate opening and Aquinas disclosure screenshots. Serve it at the local review server's `/board` route. Do not publish the board.
