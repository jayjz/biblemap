# Mercy → Anger: reader composition study

**30 October continuation:** [Clay, river, and the chapter break](reader-art-direction.md) supersedes this initial composition. The generated panorama is no longer rendered in Mercy or Anger. Current before/after evidence and verification live in `artifacts/immersive-reader/`; this document preserves the first study's source and review history.

Draft for creative review. No historical, theological or human editorial approval is claimed.

## Review locally

```powershell
npm ci
$env:BIBLEMAP_READER_TRANSITION_REVIEW='1'
npm run build
$env:EXPERIMENT_PORT='4203'
node scripts/review-irreplaceable.mjs
```

Open `http://127.0.0.1:4203/jonah/#jonah-3-mercy`, then use **Read Jonah’s response**. This is the existing StoryReader at its existing URL. There is no new reader, route, scene manifest or navigation system. An ordinary build excludes the composition. The generated image lives outside public/export and is available only through the opt-in loopback server. Vercel automatic deployment is disabled for this exact branch.

## Established truth and preserved work

Based on fetched main `60ecbda079f5fd29325b68549fe6d01ced74a7fc`. Isolated branch `feat/reader-mercy-anger` in `C:/Dev/biblemap-nineveh-design/reader-prototype`. PR #32 (`dd9c775`) and PR #33 (`8f43ad6`) remain separate; their PR bodies and branch/source records were inspected. The existing modified `next-env.d.ts` in the reference worktree was not touched. PR #33 supplies an unchanged environmental study and its provenance, not its four-beat architecture. PR #32's documentary/interpretive work is not copied.

Root, src, content and scripts instructions were read, along with the creative-direction and visual-review skills, experience principles, scene manifest, pinned chapters, reader, existing media and source catalogs. The React checklist was applied: no effects for derived state, no animation loop, no new dependency, native dialog semantics, deterministic local content.

Current main has thirteen scenes and 48 WEB verses. Mercy contains **3:5–10**, not a separate 3:10 scene. Its preceding verses remain visible and in canonical order. Anger retains all of **4:1–4**. No Scripture, source record, scene ID, title record, deep link, homepage, atlas, Exodus data or editorial gate was edited.

## Three directions considered

| Direction | Mechanism and intended discovery | Risks and requirements |
| --- | --- | --- |
| Continuous city, selected | Foreground terrain, broad middle-distance buildings and atmospheric depth establish a place; a smaller city trace and narrower text measure transfer attention to prayer. | Generated specificity can look authoritative. Full disclosure, unchanged provenance and local-only image serving required. |
| Artifact-led facing page | Real clay and writing make the city materially tangible; a textual margin carries theology. | A tablet cannot depict Nineveh or the repentance. Strong rights evidence, weaker environmental scale. |
| Geographic schematic | River/city relationships connect the passage to the atlas without invented architecture. | Gives geographical orientation but little inhabited depth. Must remain explicitly unscaled; no claimed itinerary. |

The selected direction combines a shared environmental study with restrained reading typography. Mercy gives the city a broad field and marks the final verse with a larger measure and separator. Anger retains the city as a quiet trace, narrows Scripture and places an attributed theological margin next to the prayer. The repeated generic world-door material is replaced only in these two review scenes. No discovery needs to be opened for the transition. No new motion, narration, dialogue or character motivation is added.

The artifact is a native modal examination surface: whole image, optional enlarged writing, keyboard-scrollable image region, Escape/close and focus restoration without changing the scene or reading position. The theology is an inline reading margin with a native optional disclosure and visible attribution. These interactions have different purposes and behavior. On narrow screens the margin follows the complete prayer; it does not split the biblical speech.

## Evidence and source ledger

| Material / claim | Source and rights | Scope and review boundary |
| --- | --- | --- |
| WEB 3:5–10 and 4:1–4 | Existing pinned `engwebp` publisher snapshots, 2026-10-10; public-domain WEB. `validate:story` checks every verse and note. | Imported through unchanged StoryDocument; no transcription. |
| Nineveh beside the Tigris | [Pleiades 874621](https://pleiades.stoa.org/places/874621); existing research and geographic records. | Pleiades returned a bot challenge on this pass. Prior inspection is documented in PR #33's ledger; no fresh geographic measurement or chronology asserted. |
| Broad environmental study | [Full prompt, checksum, generator, historical references and limitations](../artifacts/reader-transition/media/provenance.json). OpenAI image generation directed by Codex, 27 October 2026; unchanged from PR #33. | AI-generated interpretive reconstruction, candidate, no human reviewer. Architecture, river course, terrain, planting and lighting invented. Not a measured city, ancient viewpoint, population estimate or depiction of a narrated event. The original study drew on Pleiades, Jonathan Taylor and Eckart Frahm; this reuse does not independently verify its architecture. |
| Flood Tablet K.3375, seventh century BCE, from Kouyunjik | [British Museum object record](https://www.britishmuseum.org/collection/object/W_K-3375); existing `depth-media.json` and source ledger. | Museum returned 403 on this pass; retain the previously verified object metadata without embellishment. Gilgamesh tablet XI, not Jonah, a record of repentance, or evidence of literary dependence. |
| Exact tablet photograph | [Fæ's Commons file](https://commons.wikimedia.org/wiki/File:Library_of_Ashurbanipal_The_Flood_Tablet.jpg), photographed 15 July 2010; **CC BY-SA 3.0**. Source/author/license reopened and verified this pass. | Existing full-frame WebP unchanged; conversion credit and license link visible. No British Museum photograph substituted. Hash remains enforced by existing media validator. |
| Mercy can exceed strict justice | [Thomas Aquinas, Summa Theologiae I, q.21, a.3, reply to objection 2](https://www.newadvent.org/summa/1021.htm), reopened this pass. | Existing short paraphrase reused unchanged. Medieval Catholic theological perspective, not Aquinas's commentary on Jonah or consensus. No new quotation. New Advent hosts the English translation; its presentation has separate rights. Human review remains outstanding. |

Attempts to reopen ORACC's library/area pages returned 502. This is recorded as an access limit, not corroboration. The actual photograph license and Aquinas passage were accessible. No research request runs in the visitor's browser.

## Visual evidence and critical review

[Side-by-side comparison board](../artifacts/reader-transition/index.html) includes both complete rendered scenes before and after at 1440, 820, 390 and 320 pixels. Baseline captures came from current main before edits. Screenshots represent actual Chrome rendering, not design mockups. Scene captures omit unchanged introductory navigation so the passages can be compared directly.

Observed baseline: Scripture is readable, but Nineveh is principally a large word, and Anger has a second typographic declaration of anger. Both scenes repeat world-discovery copy below Scripture. The prototype gives Nineveh visible material breadth and reduces that repetition. Anger's text and optional attribution have a clearer relationship on desktop.

Unresolved design judgments:

- The panorama's realism remains more persuasive than its historical warrant. Disclosure does not eliminate this risk; commissioning a deliberately stylized city may be preferable.
- Mercy still takes substantial scrolling to reach 3:10 because 3:5–9 remain in sequence. The larger final verse marks a turn, but the environment does not stay visible throughout the mobile passage. A sticky city would cost scarce reading space; this study chooses reading space.
- At mobile width the theology follows the prayer rather than sitting physically beside 4:2. This preserves the speech but weakens the immediate source/text comparison.
- The Flood Tablet deepens the idea of a city with a literary culture; it is only indirectly connected to the works and mercy in 3:10. A more directly related object should be researched before claiming this is the best discovery.
- The shared image and changed text measure give distinct attention, but the Anger image can still read as a banner. This is a restrained first composition, not a demonstrated emotional success.
- No first-time visitor study, human screen-reader session, historical reconstruction review or theological acceptance has occurred. Automated checks cannot establish comprehension or emotional resonance.

## Verification

Run `node scripts/verify-reader-transition.mjs` for the sequential complete pre-push suite. [Machine-readable results](../artifacts/reader-transition/verification-results.json) record actual commands and exit codes. It installs from the unchanged lockfile, checks story/media, units, lint/types, ordinary export and review boundaries, full normal desktop/mobile suite, opt-in build and existing review suite, dedicated reader tests and final captures.

Early checks found tablet-width overflow and pre-hydration image-error handling; both were fixed before the complete run. An initial baseline build was started while dependency installation was still finishing and failed with a Next storage invariant; the completed-install rebuild passed. No configuration workaround or test suppression was used.

The first complete suite passed, but visual review then found that an implicit tablet grid column still squeezed Scripture despite zero overflow. The tablet composition was corrected to stack, and the complete suite was rerun. Previous verification results are retained alongside the final run. The normal browser suite has one inherited mobile-atlas skip; no new skip was added. Lint has four inherited warnings. `npm ci` reports 30 inherited advisories (1 low, 8 moderate, 19 high, 2 critical); dependency manifests and lockfile are unchanged.

Changed implementation files: `src/app/jonah/page.tsx` (build opt-in), `StoryReader.tsx` (two-scene integration), `ReaderTransition.tsx` (environment/object/interpretation), `story.css` (scoped composition), and `scripts/review-irreplaceable.mjs` (explicit local image allowlist). Supporting changes add capture/verification/gate scripts, reader browser tests/config, the normal-suite exclusion for that opt-in-only test, branch-specific deployment prevention, provenance and review evidence. No production dependencies were added.

Release approval is deliberately not granted. The separate human editorial release workflow remains intact. Inherited dependency advisories and warnings are reported separately from task regressions.

Final complete run: **all 16 commands exited 0**. Units **25 passed**; normal browser suite **69 passed, 1 inherited skip**; existing review suite **22 passed**; dedicated reader suite **6 passed**. Final captures at all four widths recorded no page/console/request/HTTP errors or overflow. Desktop before/after pairs were also rendered together and visually inspected; tablet, 390px, 320px and the open object/interpretation captures were inspected. A focused sensitive-pattern scan and full filename/diff review found no credential material or unrelated source changes. Original `next-env.d.ts` was restored after Next's generated path rewrite; browser report directories were archived outside the checkout. Hosted CI is separate from these local results.
