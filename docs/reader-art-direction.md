# Clay, river, and the chapter break

Draft design review, 30 October 2026. Extends PR #34 on `feat/reader-mercy-anger`; no production or editorial approval.

## Direction before implementation

The starting revision is `f71c644`. The only initial working-tree change is the generated route import in `next-env.d.ts`, which is preserved. The baseline screenshots in `artifacts/immersive-reader` capture that revision's actual opt-in reader, rather than main or a mockup.

| Concept | Tension, mechanism and discovery | Representation and rights |
| --- | --- | --- |
| Painted city | A populated, continuous environment holds city and prophet in one world. | The existing generated panorama looks more authoritative than its invented architecture warrants. Rejected as the dominant medium. No new generated image. |
| Typographic chapter break | A city receives mercy; the next chapter begins with anger. Scale, silence and a user-triggered cut let the exact words carry the contrast. | No new dialogue, motivation or moral verdict. Selected as the literary mechanism, with all verses in order. |
| Material city | A surviving written object and a spare river drawing make Nineveh a place with cultural life, rather than a backdrop or villain. Examination differs from locating a place or opening a theological note. | Selected as the spatial mechanism. The tablet is seventh-century context, not evidence of repentance. The original schematic is unscaled and does not plot Jonah. Full photo, existing verified CC BY-SA credit, museum record and limits remain. |

Tokens: river black `#14242a`, deep water `#1c3036`, limestone `#eee5d2`, silt `#b6a387`, clay `#967653`, water `#829c9c`. Georgia for the continuous Scripture reading; existing Playfair for place/person headings; existing Geist for navigation and sources. No new font request or dependency.

The layout is left aligned, with a stable reading edge and a quieter right field:

```text
Nineveh                         Tigris / Nineveh schematic
Jonah 3:5–10

Scripture                       Whole clay tablet
5 …                             Examine the writing
6–9 …                           Object, period, credit and limits

10 … [larger, with room to pause]
Read Jonah’s response

Jonah’s response                The same geographic relationship
Jonah 4:1–4

1 But … [an abrupt change of scale]
2–3 …                           Optional attributed perspective
4 … [space around the question]
```

Mobile keeps Scripture ahead of optional discovery. The river can orient the scene compactly; neither a sticky image nor an animation consumes reading space. The dramatic device is the relationship between the unchanged 3:10 and 4:1, not decorative motion. A short progressive view transition may connect these scenes; reduced motion and unsupported browsers cut immediately.

Self-review before coding: an artifact plus serif copy can become a museum article. To avoid that default, remove the banner, make the object directly visible and examinable, use the same geographic mark across the turn, and spend the largest typographic contrast on the text's chapter break. Avoid identical cards, all-caps labels and a separate explainer headline prescribing Jonah's feelings. The inherited title “When mercy hurts” becomes the neutral “Jonah’s response” in this review only; the scene document is unchanged.

## Source check

Inspected 30 October 2026 using source-integrity-audit for bounded source and rights verification. No general historicity claim or new theological teaching is made.

| Claim | State / citation fit | Original inspected and lineage | Decision |
| --- | --- | --- | --- |
| K.3375 is a seventh-century BCE Neo-Assyrian clay tablet of Gilgamesh XI, excavated at Kouyunjik | SUPPORTED / DIRECT | British Museum [K.3375](https://www.britishmuseum.org/collection/object/W_K-3375), description, production date, findspot. Museum catalog family. | Keep narrow material context. It does not attest Jonah. |
| The actual photograph is by Fæ, taken 15 July 2010, CC BY-SA 3.0 | SUPPORTED / DIRECT | [Commons file](https://commons.wikimedia.org/wiki/File:Library_of_Ashurbanipal_The_Flood_Tablet.jpg), summary, licensing and file history. Photographer/file family; its object description derives from the museum, not independent corroboration. | Keep the unchanged full-frame local WebP and existing attribution, conversion and license. |
| Nineveh lies at the eastern edge of the Tigris flood plain opposite modern Mosul | SUPPORTED / DIRECT | [Pleiades 874621](https://pleiades.stoa.org/places/874621), place description, Roaf et al., modified 17 February 2026. Pleiades geographic family. | Keep relationship only; new drawing's river course is invented and clearly unscaled. |
| Aquinas argues mercy can exceed justice without opposing it | SUPPORTED / DIRECT for the paraphrase | [Summa I q.21 a.3 ad 2](https://www.newadvent.org/summa/1021.htm#article3), New Advent English edition, actual article and reply reopened. Aquinas text family. | Preserve existing paraphrase, medieval Catholic lens and explicit “not his commentary on Jonah” limitation. No new quotation or consensus claim. |
| Jonah's location/viewpoint in 4:1–4 | UNRESOLVED | Pinned WEB does not locate him outside the city until 4:5. | Do not draw a prophet position, viewing angle, route or reconstructed scene. |

Museum catalog → Commons object description is a VERIFIED dependency. The photographer's rights statement is separate evidence for reuse, not independent evidence for the archaeological account. Pleiades and the pinned WEB answer different questions. No number of URLs establishes the narrated repentance archaeologically. No contradictory source was found in these bounded original-record checks; no exhaustive scholarly survey is claimed.

## Professional references inspected

- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): subject-specific identity, two-pass planning, typography, restraint and screenshot critique.
- The supplied [Claude Code plugin URL](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) returned a repository 404, as did its expected raw skill path; no claim to have read missing guidance.
- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) and its linked [current rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): native controls, visible focus, safe layout, reduced motion, image dimensions, restrained animation.
- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices): no per-frame React work, no fetching waterfall, no unnecessary dependency, derived state and small components.
- [Chrome 2025 update](https://developer.chrome.com/blog/view-transitions-in-2025) and [same-document guide](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): progressive enhancement and reduced-motion fallback. Stable browser API only; no experimental React API dependency.
- [React flushSync](https://react.dev/reference/react-dom/flushSync), also checked with Context7's official React documentation: bounded event-time browser snapshot integration, never render/effect/frame-loop use.

## Browser critique and revisions

The first pass removed the panorama, enlarged the object and changed the reading type, but still looked like a museum article. The second pass gives the unchanged 3:10 its own broad reading space, then opens 4:1 at a larger scale. Verse 10 is selected from the pinned passage object, not retyped; its previous position is omitted only in the opt-in composition, so there are still exactly 48 verse paragraphs. The DOM order is 3:5–9, 3:10, optional object; mobile follows that same order. Desktop puts the object alongside 3:5–9 and releases it before 3:10.

Screenshot review caught two concrete problems that a zero-overflow check missed: the geographic header consumed too much mobile reading space, and the sticky object could extend across its grid row and obscure the wide verse. The header became a compact mobile orientation; stickiness moved into the bounded first-row aside. A geometry assertion now checks that the object and 3:10 never overlap, and that mobile discovery follows the complete passage. The dialog's return control stays visible while its contents scroll. Enlargement supports ordinary scrolling and keyboard arrows, without a gesture-only requirement.

Actual Chrome output was inspected at 1440, 820, 390 and 320 pixels. The complete two scenes, their opening viewports, 3:10 in view and desktop/mobile object examination were captured. The starting screenshots retain the initial heading-focus outline; final composition captures blur focus for visual inspection. Focus styling itself remains present and is separately exercised by keyboard tests. The screenshot comparison does not claim a focus-style redesign.

### What remains weak

- **The city is still under-imagined.** A schematic identifies a place; it does not make its streets, people or scale present. Removing a falsely persuasive panorama is an artistic tradeoff, not a complete environmental solution. A commissioned, intentionally nonliteral drawing could carry more life with less implied authority.
- **The object is adjacent evidence.** The tablet is materially compelling, but it is Gilgamesh, not Jonah, and does not explain repentance. The interface says so. A future object choice should be driven by a more direct question, not by the convenience of a cleared photograph.
- **The typographic turn is stronger than the rest of the book.** These two scenes now have deliberate scale and pacing; most earlier scenes retain the foundation's article rhythm. Extending this direction needs scene-specific art direction, not a global skin or thirteen repetitions of the wide-verse treatment.
- **Mobile loses simultaneity.** Putting discovery after Scripture protects the reading, but the object is absent during the city’s response. This is a real loss, accepted instead of shrinking Scripture around a persistent image.
- **The photographic mount is visually ordinary.** The full-frame photo preserves provenance and the broken edge, but its museum supports and backing interrupt the atmosphere. Do not silently remove them and imply a new archaeological photograph.
- **The theology is still a disclosure.** Its quiet placement is appropriate to its optional status; it is not a new interpretive encounter. A more ambitious comparison would need more verified primary voices and human editorial direction.
- **Emotional success is unmeasured.** No first-time visitor study, human screen-reader session, theological acceptance or historical reconstruction review occurred. Browser checks establish behavior and legibility constraints, not whether this is an extraordinary experience for a stranger.

## Review locally

After stopping an existing checkout preview before `npm ci` (Windows locks the running esbuild helper):

```powershell
npm ci
$env:BIBLEMAP_READER_TRANSITION_REVIEW='1'
npm run build
$env:EXPERIMENT_PORT='4205'
node scripts/review-irreplaceable.mjs
```

Reader: `http://127.0.0.1:4205/jonah/#jonah-3-mercy`. Comparison board: `http://127.0.0.1:4205/reader-review/`. The board can also be opened from [the local evidence file](../artifacts/immersive-reader/index.html). Static export remains the runtime. This build opt-in uses the existing thirteen-scene reader and the existing route; ordinary exports exclude the composition. No homepage, Exodus, atlas, scene document, pinned text, media file, media catalog, lockfile or release-approval record changed. The generated panorama and its prior provenance are retained as historical review material, unused by this composition. PRs #32/#33 are untouched; PR #34 stays draft, with automatic deployment still disabled.

## Change-verifier scope and observable checks

Reviewed change: working-tree continuation from `f71c644`, compared against that exact starting revision. Initial status was only modified `next-env.d.ts`; that generated file is excluded from the commit and its initial bytes remain. The base of PR #34 remains main `60ecbda`; the earlier PR changes are preserved.

| Requirement | Implementation / review scope | Observable check |
| --- | --- | --- |
| Thirteen scenes, exact pinned 48 WEB verses and unanswered ending | Existing `StoryReader`, scoped 3:10 placement, unchanged scene/content files | `validate:story`, unit tests, ordinary browser flow and no-JS reader count; all verse snapshots checked against pinned publisher bytes |
| Spatial and typographic Mercy → Anger | `ReaderTransition.tsx`, `StoryReader.tsx`, scoped `story.css` | Actual desktop/mobile screenshots; 320/390/820/1440 geometry, no overflow or object overlap |
| Navigation, keyboard and motion | Native links/history, bounded native view-transition enhancement, native dialog and scrolling | Focus, browser back, Escape, scroll return, keyboard image panning; actual motion path, reduced-motion API refusal and unsupported-API fallback |
| Sources, rights and limitations | Existing catalog/credits; original labeled schematic; unchanged Aquinas paraphrase | Original records above; `validate:media`; modal and open interpretation accessibility checks |
| Error/loading fallback | Local image with dimensions, alt text and explicit failed-image state; independent map SVG/text | Aborted image request preserves reading and source access; no-JS reading; no runtime request for panorama |
| Publication boundary / preserved product surfaces | Existing page flag, Vercel branch gate, no new route or dependency | Ordinary build and export gates; full ordinary and existing opt-in browser suites |
| Reproducible design evidence | Capture script, preview evidence allowlist, port-aware reader config and sequential verification runner | Final capture diagnostics and [command/exit-code record](../artifacts/immersive-reader/verification-results.json) |

`scripts/review-irreplaceable.mjs` adds only a bounded local evidence-file allowlist. `playwright.reader.config.ts` and the runner accept an explicit port so verification can use a fresh server. `scripts/validate-reader-transition.mjs` strengthens ordinary-export exclusion checks. `docs/reader-transition.md` points to this superseding study. Other changed artifacts are screenshots, their comparison board and machine-readable verification history. No production dependency was added. The final diff is reversible by reverting the continuation commit; the ordinary build already excludes it.

Full pre-push command: `$env:PLAYWRIGHT_PORT='4205'; node scripts/verify-reader-transition.mjs`. It executes the repository's actual install, validation, tests, lint/typecheck, ordinary export and opt-in review checks sequentially. Failed attempts are retained; two installation attempts stopped on the running preview's locked esbuild executable. The identified preview and child were then terminated before the successful installation. No dependency or configuration workaround was introduced.

### Final executed results

All **16 sequential commands exited 0**, 30 October 2026. Exact commands, flags, times and exit codes are in [verification-results.json](../artifacts/immersive-reader/verification-results.json).

| Check | Result |
| --- | --- |
| `npm ci`; lockfile diff | Passed; lockfile unchanged. 30 inherited advisories: 1 low, 8 moderate, 19 high, 2 critical. No dependency remediation is mixed into this design change. |
| `npm run validate:story`; `npm run validate:media` | Passed; all four pinned chapters and media checksums/rights boundaries preserved. |
| `npm test` | 25 passed. |
| `npm run lint` | Zero errors; four inherited warnings in unchanged `DataLoader.tsx` and `validate-nineveh-depth.mjs`. |
| `npm run typecheck` (`tsc --noEmit`) | Passed. |
| Ordinary `npm run build`; both export gates | Passed; ordinary export excludes the review composition and experimental media. |
| Ordinary `npm run test:e2e` | 69 passed, one inherited mobile-atlas skip. No new skip. |
| Opt-in `npm run build`; existing opt-in `npm run test:e2e` | Build passed; 22 browser tests passed. |
| Dedicated reader desktop/mobile tests | 10 passed; no skips. Includes arrow-key image panning, focus/scroll restoration, motion and unsupported-API cuts, all-verse no-JS reading, responsive bounds and overlap checks. |
| Final capture script | Eight scene/width combinations; no page errors, console errors, failed requests, HTTP errors or horizontal overflow. Object captures also completed. |
| `git diff --check` | Passed. |

The final rendered captures were visually inspected after the complete suite, including the desktop chapter turn and Anger opening, tablet layout, narrow mobile opening and mobile object view. Before/after comparison is in [the evidence board](../artifacts/immersive-reader/index.html). Full normal browser reports remain in ignored `playwright-report/` and `test-results/`; final opt-in reports were archived at the `reportArchive` path recorded in the verification JSON. Temporary iteration screenshots were removed from the review diff. The starting `next-env.d.ts` modification is unchanged and remains unstaged. A full filename/diff review accounts for the source, scripts, documentation, screenshots and JSON records; no unrelated product change or credential material was found in this bounded review. This is not a repository security audit.

Limitations: Windows Chrome is the locally executed browser platform. Other engines and human assistive-technology use are unverified. The inherited audit advisories, lint warnings and Node/Next configuration warnings remain. Static reader loading and image-error states are covered; an empty dynamic data state is not introduced by this change. Human source/editorial review and production publication remain outside this draft's acceptance.
