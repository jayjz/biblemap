# Romanus: implemented encounter

Review draft on `feat/romanus-voice`, built on Perpetua's PR #36. The three instruction changes through `28bff7e` were incorporated as a documentation-only patch; no unrelated branch work was merged. Narrative foundation and access limitations: [research/romanus.md](research/romanus.md).

## Visitor journey

`/human-story/romanus/` opens with the person, the persecution, the outcome and the fact that his story survives in other people's writing. Five connected movements follow: the two cities and Antioch's wider material world; public confrontation and the threatened fire; mutilation and imprisonment; differences between the surviving texts; death and the work of remembrance. The last question grows from Prudentius's imagined contrast between earthly and heavenly records.

The comparison keeps the shorter account in a separate reading surface. Visitors open the Syriac witness, the homily and the poem beside it. The Syriac witness is not presented as a separate eyewitness, or automatically as a later work because it is longer. Sermon, poem and historical narrative retain different labels. No visitor must judge the miracle.

The muted violet pages and ochre quotation distinguish written remembrance from the stone mosaic. The complete Met floor is a second-century object from Daphne near Antioch; its female figure is explicitly a personification, not Romanus. The schematic is an original modern composition without an asserted itinerary. No sound, invented likeness or simulated wound is used.

## Files and boundaries

- `src/content/romanus.ts`: sourced prose, stable movement IDs, source ledger, account leaves, draft record and collection entry.
- `src/content/romanus-media.ts`: exact-file rights and provenance manifests for both local image sizes.
- `src/features/human-story/romanus/`: server-rendered reading, source disclosures and CSS; the image failure handler is the only new client component.
- `src/app/human-story/[entry]/page.tsx`: existing static route selects Romanus. `src/app/human-story/romanus/reading/page.tsx`: simple layout using the same narrative and sources.
- `src/content/human-story.ts`: discoverable Saints/Voices entry and an explicitly editorial comparison with Perpetua.
- `src/domain/romanus.test.ts`, `tests/romanus.spec.ts`, `package.json`: source/media integrity is checked at build time; native comparison, reading and navigation checked in browsers.
- `artifacts/romanus/`: reproducible acquisition/capture helpers, source extracts, exact Met record, baseline and rendered evidence. Downloaded thesis and temporary Python dependency remain under ignored `test-results/`.

No new production dependencies, runtime content services or release-gate exceptions. Both routes inherit the collection's `noindex,nofollow`. Original narrative remains AI-assisted editorial draft; no human approval is implied. Images pass the existing reusable-rights policy independently of narrative review.

## Verification and visual review

- `npm ci`: passed. Existing dependency audit reported 38 advisories; no dependency versions changed.
- `npm run lint`: passed with four existing unused-variable warnings in `DataLoader.tsx` and `validate-nineveh-depth.mjs`.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed, including pinned Scripture, media checksums and visitor-export boundary checks.
- `npm run test`: 49 passed, one existing export-dependent test skipped in the ordinary invocation.
- Focused Playwright: all eight desktop/mobile checks passed. Includes no JavaScript at 320px, reduced motion, keyboard focus and Enter activation, image failure, deep source navigation, discoverability and axe WCAG 2/2.1/2.2 A/AA rules.
- Complete integration browser run: pending at this checkpoint.
- Actual Chrome captures at 1440×1000 and 390×844 inspected. No horizontal overflow, page/console errors or failed requests in successful-media runs. Intentional image-abort test keeps prose and source record available. The narrative has no asynchronous content, empty collection, timed scene or selected map-event state; stable fragment navigation and open/closed text leaves are its relevant states.

Compared with the captured Perpetua entrance, Romanus makes the person's role, historical setting and source mediation available before any image. The comparison remains distinct on mobile, although the reader must scroll between the shorter text and an expanded account. The ending retains navigation and research below its question. Captures are in `artifacts/romanus/after/`; baseline Perpetua is in `before/`.

## Remaining limits

Exact chronology and the emperor's identity remain disputed. The renewed-speech passage's relationship to the lost Greek long recension needs specialist review. Chrysostom's accepted homily is summarized through Rizos; the full critical edition and Mayer translation were not inspected. Emesa was identified through the inspected source survey in Tsartsidis, not directly read. No manuscript autograph, individual crowd member's account or independent court record has been recovered here.

The largest experiential weakness is the length of the sequential comparison on a small screen. Unbriefed human-reader observation is still needed to establish whether the narrative and source distinctions are understood. Visual review and automated checks cannot establish emotional depth or comprehension.
