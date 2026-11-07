# Interior review evidence

Baseline: `207f395a669a2bf87182ef80de6d7dca669e000c`, inspected through the local static export in Chrome. `before/tour.json` records the original visits; `after/tour.json` records the enhanced pages, widths, image counts, interactions and errors. Screenshots show actual browser output, not mockups or generated compositions.

| View | Before | Enhanced |
| --- | --- | --- |
| Witnesses, desktop | [Original](before/witnesses-desktop.png) | [Letter/reply open](after/witnesses-desktop.png) |
| Saints, desktop | [Original](before/saints-desktop.png) | [Voice-led opening](after/saints-desktop.png) |
| Saints, phone | [Original](before/saints-mobile.png) | [Enhanced](after/saints-mobile.png) |
| Perpetua separation | [Original, scrolled father selection](before/perpetua-desktop.png) | [Desktop](after/perpetua-desktop.png), [phone](after/perpetua-mobile.png) |
| Augustine text/art | — | [Desktop](after/augustine-desktop.png), [phone](after/augustine-mobile.png) |

The Perpetua images are different captures: the old screenshot records the selected father control; the new screenshots deliberately frame the whole separation scene with the earlier passage opened. They demonstrate available content, not a pixel comparison. All full-page/section captures are taller than one viewport.

To reproduce enhanced captures from the repository root:

```powershell
npm run build
node artifacts/human-story-interiors/tour.mjs
```

The helper serves `out/` on loopback port 4198 and closes its browser/server afterward. It uses installed Chrome on Windows by default; set `CHROME_PATH` for another installed Chromium executable. It performs real clicks and keyboard activation, checks whether the reply appears, records browser/network errors and overflow, and saves the visible states. Assertions and axe audits live in the Playwright suite. Local build/lint/unit/browser logs are ignored; [verification.json](verification.json) retains the final results. See the [editorial record](../../docs/editorial/07-interior-enhancement.md) for source choices and limits.
