# Nineveh cultural-depth review evidence

Actual Chrome captures at **1440×1000**, **390×844**, and **320×700**. These are implementation review evidence, not visitor-research results. Sources and editorial decisions: [source ledger](../../docs/research/nineveh-depth-sources.md).

| View | Desktop | Mobile | Narrow |
| --- | --- | --- | --- |
| Encounter, text equivalent | [View](screenshots/desktop-encounter-text.png) | [View](screenshots/mobile-encounter-text.png) | [View](screenshots/narrow-encounter-text.png) |
| The world of Nineveh | [Object](screenshots/desktop-world.png) · [Lower view](screenshots/desktop-world-lower.png) | [Object](screenshots/mobile-world.png) · [Lower view](screenshots/mobile-world-lower.png) | [Object](screenshots/narrow-world.png) · [Lower view](screenshots/narrow-world-lower.png) |
| Jonah through art | [Artwork](screenshots/desktop-art.png) · [Lower view](screenshots/desktop-art-lower.png) | [Artwork](screenshots/mobile-art.png) · [Lower view](screenshots/mobile-art-lower.png) | [Artwork](screenshots/narrow-art.png) · [Lower view](screenshots/narrow-art-lower.png) |
| The question across centuries | [Augustine](screenshots/desktop-voices.png) · [Francis](screenshots/desktop-francis.png) · [Scripture](screenshots/desktop-voices-lower.png) | [Augustine](screenshots/mobile-voices.png) · [Francis](screenshots/mobile-francis.png) · [Scripture](screenshots/mobile-voices-lower.png) | [Augustine](screenshots/narrow-voices.png) · [Francis](screenshots/narrow-francis.png) · [Scripture](screenshots/narrow-voices-lower.png) |

The **unapproved AI landscape is not included in these shared screenshots**. Complete local scene captures are in ignored `local-scenes/`; before captures are in ignored `baseline/`. Both remain on the implementation machine, along with `artifacts/nineveh-review/landscape.webp`. No generated image has been added to `public/` or committed by this change. The independent photograph and museum photograph below are rights-cleared for draft review, not editorially approved assets.

- `media/flood-tablet.webp`: The Flood Tablet, British Museum K.3375; photo **Fæ / Wikimedia Commons**, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Full frame converted to WebP. Same license applies to the derivative and its reproduction within these screenshots. [Exact image source](https://commons.wikimedia.org/wiki/File:Library_of_Ashurbanipal_The_Flood_Tablet.jpg).
- `media/jonah-vine.webp`: *Jonah Under the Gourd Vine*, 280–290 CE, Cleveland Museum of Art, John L. Severance Fund, **1965.239**; [CC0](https://creativecommons.org/publicdomain/zero/1.0/). [Exact source](https://www.clevelandart.org/art/1965.239).
- Quotation screenshots retain the credited, brief excerpts. Francis’s excerpt comes from an official English report, © Dicastery for Communication; no open license or editorial approval is asserted. See the ledger for edition details and rights limits.

## Reproduce locally

```powershell
npm ci
$env:BIBLEMAP_NINEVEH_REVIEW='1'
npm run build
$env:EXPERIMENT_PORT='4194'
node scripts/review-irreplaceable.mjs
```

Open `http://127.0.0.1:4194/experiments/nineveh/#mercy`. Deep links include `#anger/world`, `#anger/art`, and `#question/voices`. Without the separately held base-branch landscape, its deliberate fallback appears; all discoveries and Scripture remain usable. The server binds only to loopback.

In a second terminal:

```powershell
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
$env:PLAYWRIGHT_PORT='4194'
npm run test:e2e -- tests/nineveh.spec.ts tests/nineveh-depth.spec.ts tests/media.spec.ts
node scripts/capture-nineveh-depth.mjs
```

The capture script requires the local landscape for its ready-state screenshots. On a different OS, set `CHROME_PATH` to an installed Chrome executable. An ordinary build without `BIBLEMAP_NINEVEH_REVIEW=1` gates the encounter; `node scripts/validate-nineveh-depth.mjs --production-export` checks that gate and asset exclusion.

Visual assessment: the two objects are legible and visibly different from the environment; the interpretation reading retains Scripture nearby. At 320px, the discoveries need vertical scrolling. The principal remaining creative limitation is the text-heavy theological reading, and the principal historical limitation is the large chronological distance between the tablet, the later sculpture and Jonah’s undated narrative. Neither is concealed. No user comprehension, screen-reader user session or real-device performance finding is claimed.
