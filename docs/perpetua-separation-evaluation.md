# Separation pilot: browser evaluation

3 November 2026. PR #36. Single-scene experiment, not approved historical/theological content. No actual readers have been observed.

## From article to an interaction to test

The [baseline mobile scene](../artifacts/perpetua-immersive/before/mobile-separation.png) puts a long quotation before a large devotional image and the relationship controls. In the [first folio attempt](../artifacts/perpetua-immersive/pilot-v1/mobile-separation.png), the image becomes optional and the text gains a separate reading surface. That looks cleaner but is still an editorial article. Opening the [two-passage comparison](../artifacts/perpetua-immersive/pilot-v1/mobile-comparison.png) simply makes it longer. It does not adequately help the reader discover what changes. Browser axe checks also caught low-contrast inherited note colors in that attempt; those were corrected, not suppressed.

The next implementation adds three source moments:

1. [The child can stay, §3](../artifacts/perpetua-immersive/pilot-v2/mobile-separation.png). Read the complete established earlier excerpt, including bodily relief and the palace comparison.
2. [The request is refused, §6](../artifacts/perpetua-immersive/pilot-v2/mobile-refusal.png). Two textual relationship marks move apart and their connecting line breaks. An exact short excerpt from §3 remains visible beside the new words. This is a contemporary diagram of the account's relationship, not a reconstruction of people or prison.
3. [The account describes relief, §6 continued](../artifacts/perpetua-immersive/pilot-v2/mobile-interpretation.png). The relationship marks stay apart. The sentence beginning “And even as God willed it” is identified as religious interpretation within the attributed account. Provisional reading notes compare the two descriptions of relief and keep the infant's unknown later life explicit.

Each moment is directly selectable; the reader can advance, revisit or read both complete passages at any time. Internal moments do not create scene-history entries. The existing six-scene URLs, browser history, source disclosures and onward routes remain. With no JavaScript or failed scripts, the complete §3 and §6 excerpts render in normal document flow. The later mosaic is available in a native disclosure with its original provenance, not offered as a historical likeness or replacement for the missing child's story.

## What was actually checked

- Ordinary production static build, including source/media preflight and the 402-artifact negative publication boundary check: passed.
- Focused exact-boundary unit test: passed; refusal + a single original space + religious interpretation equals the full established §6 excerpt byte for byte. Missing/incomplete boundaries fail rather than inventing text.
- Typecheck: passed. Lint: no errors, four existing warnings in unchanged files.
- Perpetua, new separation interaction and interior encounter browser suites: **26 passed**, desktop/mobile. Includes unchanged six-scene history/deep links, exact full and guided excerpts, keyboard focus, 320px accessibility across all three moments, 200% text, reduced motion, no-JS, failed scripts and failed optional media.
- Captures at 1440/390/320px: no horizontal overflow, console errors or failed requests in the ordinary capture. Failure tests intentionally block media/scripts and verify the readable fallback.

The first source-driven screenshots show a material improvement over the two-quote design: a reader action visibly changes the relationship, while the earlier words remain in view. That is a testable interaction hypothesis, not evidence of engagement, comprehension or emotional effectiveness.

## Critique before any expansion

The [desktop refusal](../artifacts/perpetua-immersive/pilot-v2/desktop-refusal.png) still reserves excessive empty height. On the phone, the top labels reveal the refusal before the reader reaches it, the first forward control sits too far below the quotation, and expanded relationship commentary competes with the main sequence. These are reasons to refine this pilot, not spread it to five more scenes. The large title still risks making the encounter feel like a staged application; typography alone is not immersion.

Checkpoint 4 will keep this a **single-scene pilot**: shorten the reserved space, make controls identify source positions rather than announce outcomes, and put optional relationship exploration behind a clear disclosure. Reinspect the actual phone states and preserve source access, contrast, keyboard and no-JS behavior. Expansion is withheld pending a persuasive mobile result and unfamiliar-reader observation. No study responses will be invented. The next reader study should ask what changed for the mother and child, what the account calls God's will, and what remains unknown, without explaining those distinctions first.
