# Jonah: passage and sculpture encounter

Review candidate, 2026-10-11. No human editorial approval is claimed.

## Baseline and scope

Main: `1e68586c56c1c74fb40ec52ca700de08883f5b41`. Draft #17: `81f34d691895332e7b9d3517b296319d80272f51`. Draft #18: `082b54f8c4f427a6b674f0a110448d371379efe1`; #17 is its ancestor and target branch. This change stacks on #18, not main. Exodus, Scripture, source snapshots, media files, release gates, and existing editorial copy are unchanged.

## Three opportunities

1. The desktop shade scene put six verses above the sculpture. Comparing text and image required scrolling. Place them beside each other while preserving Scripture-first DOM and mobile reading order.
2. The sculpture's face, raised arm, and vine reward closer looking, but the reader offered no enlarged view. Provide an optional intact reproduction with an explicit return control.
3. Nineveh's discovery door remains largely prose. A future source-grounded artifact encounter could give its material world more presence. Do not add another decorative image or imply a seventh-century object dates Jonah's visit.

These are design judgments from browser inspection, not findings from visitor research. The selected improvement addresses the first two together: desktop comparison, a sticky sculpture, and a native modal study. The existing single-column mobile rhythm is retained. No new thinker, quotation, narration, or invented ancient scene is added. The final passage remains unanswered.

## Source and reproduction evidence

Rechecked [Cleveland Museum of Art, 1965.239](https://www.clevelandart.org/art/1965.239) on 2026-10-11. Its record identifies *Jonah Under the Gourd Vine*, Anatolia, late Roman–early Christian, 280–90 CE, marble; dimensions 32.3 × 46.3 × 18 cm; John L. Severance Fund. The record permits copying, modification, and distribution without requesting permission through its Open Access initiative. The repository already records CC0 reuse, acquisition metadata, and the local file's checksum. No new image or license is introduced; the dialog reuses `/media/jonah/cma-jonah-gourd-vine.jpg`.

The object is later reception history. Its depiction does not establish Jonah's appearance, the plant's species, or historical events. The existing interpretive looking exercise remains a draft editorial decision.

## Implementation and evidence

- `StoryMedia.tsx`: optional native dialog only for the shade sculpture, named by its heading, initial focus on the close button, Escape dismissal, and focus restoration.
- `story.css`: facing passage/sculpture composition on desktop, single-column Scripture-first mobile composition, centered responsive study view; no crop or new animation.
- `discovery.spec.ts`: keyboard activation, modal focus, source reuse, accessibility scan, both dismissal paths, focus return, and continuation to Jonah 4:11.
- Browser captures: all 13 scenes at 1440px, 390px, and 320px; shade also at 768px. `artifacts/discovery-review/encounter-checks.json` records overflow, page errors, and failed requests. Capture screenshots waited for local image decoding.

Developer references: [MDN native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Playwright screenshots](https://playwright.dev/docs/screenshots), and [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

### Executed verification

`npm ci`, all 19 unit tests, source/media validation (all 48 verses and translator notes), lint, TypeScript, and the static production build passed. Lint retains three existing DataLoader warnings. Final complete browser suite: **57 passed, one inherited mobile explorer skip**, Chromium 153. Includes desktop Exodus navigation, no-JavaScript reading, reduced motion, source and rights disclosures, artwork failure, reflections, and modal keyboard/focus/accessibility checks on desktop and mobile. No assertions or timeouts were weakened. The 40 scene captures recorded zero overflow, page errors, or failed requests.

An initial run overlapped the build and was stopped. A later run revealed missing browser graphics libraries; after installing the package's SwiftShader libraries, the Joppa missing-basemap check passed on untouched #18 and the candidate. That run also caught the new hidden dialog's eagerly rendered duplicate image. The study image now mounts only when opened; the unchanged media tests and final full suite pass. These were corrected, not reclassified as passing.

Screenshots: [desktop before](../artifacts/discovery-review/shade-before-1440.png), [desktop after](../artifacts/discovery-review/encounter-1440-jonah-4-shade.png), [mobile before](../artifacts/discovery-review/shade-before-390.png), [mobile after](../artifacts/discovery-review/encounter-390-jonah-4-shade.png), [desktop study](../artifacts/discovery-review/shade-study-1440.png), [mobile study](../artifacts/discovery-review/shade-study-390.png). Only the existing rights-verified sculpture appears in these public evidence images.

## Connected environment

GitHub read access and the owner's admin permission were verified. No open issues were returned. Cloud execution was used; no Strawman control tool was exposed. Figma was unnecessary for this functioning composition. Notion search returned no relevant BibleMap record, so this record stays in GitHub. Vercel connector access to `elliotandersons-projects` returned 403 and no CLI was installed. The #18 public preview was inspected in the cloud browser; that URL represents the baseline, not this patch.

The standard Playwright browser download returned invalid archives. Verification uses separately installed Chromium 153 from the npm `@sparticuz/chromium` package without changing application dependencies or the lockfile. Hosted CI's bundled browser and physical-device testing remain separate checks.

## Remaining creator decisions

Choose whether the facing-page sculpture composition improves this passage's rhythm; review #18's existing discovery copy and provisional art placements; decide whether to develop the Nineveh artifact encounter. These choices remain human decisions. No merge or production deployment is authorized by this record.
