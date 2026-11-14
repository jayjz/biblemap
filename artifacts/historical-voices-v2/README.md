# Jonah's plant · browser evidence

These are real Chrome captures of the locally built static export, not human testing. The Browser plugin was unavailable; Playwright used the installed `/usr/bin/google-chrome`.

- `before-desktop.png` and `after-1440-viewport.png`: matched 1440 × 1000 opening viewports.
- `before-mobile.png` and `after-390-opening.png`: full-page captures at 390 × 900. `after-390-viewport.png` preserves the first viewport separately.
- `after-1440-reply.png`: Jerome's reply opened by keyboard; Augustine's disclosure closes while Scripture remains alongside.
- `after-768-opening.png` and `after-320-opening.png`: tablet and narrow reflow.
- `visual-review.json`: actual disclosure, deep-link, no-JavaScript, console/network and axe results. No reported errors or violations at the four inspected widths.
- `route-audit.json`: all 48 publication-scope routes inspected before implementation, including the two deliberately excluded 404s.
- `performance-before.json` and `performance-after.json`: three fresh-context runs at each width; mobile uses 4× CPU throttling, no network throttling, device scale 1. Local shared-host lab observations, not field Core Web Vitals. Baseline source is `eb7e1d4`; final application source is the accompanying commit.
- `composition-reference.png`: corrected AI-generated UI composition reference only. It is not an ancient image, manuscript or source, and is not shipped in the application. The first generated reference invented wording and was rejected; it is excluded here.

Before/after resource bodies: 1,379,610 → 1,387,600 bytes (+7,990; JS +1,172 and CSS +6,818). No new dependency, font or runtime image. Median observed LCP: desktop 72 → 124 ms, 390px/4× CPU 176 → 200 ms; observed CLS 0 in both. Timing differences on a shared host do not establish a causal regression or improvement. The new encounter is a server component and native HTML disclosures; no per-frame rendering or custom client-state loop was added.

The visual review compared copy, split-field composition, typography, palette, disclosure hierarchy and source treatment against the corrected reference using `view_image`. Intentional differences: preserve BibleMap's existing navigation and locally vendored fonts; use scan-exact text; put the bishop's risk in the opening; add a first-viewport `Hear the letters` jump for mobile; expand attribution and limits behind a native disclosure. No claim of pixel equality or an emotional effect on readers is made.

The weakest observed moment was mobile delay before the letters. The opening jump now reaches and focuses the exchange without abbreviating Scripture. The clarification “a fellow bishop” also identifies the person referred to as “the man” in Augustine's excerpt. Remaining evaluation: unbriefed reader comprehension and physical-device/assistive-technology review.

For exact full-suite and hosted-preview outcomes bound to the source SHA, see the accompanying draft PR. This evidence does not authorize production publication or satisfy detached canonical-artifact acceptance.
