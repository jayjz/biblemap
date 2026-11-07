# Perpetua: a held image

Draft art direction, 4 November 2026. Supersedes the mosaic-led proposal; prior reports remain historical records. Inherited tracked changes are preserved in artifacts/perpetua-art-direction/inherited.patch.gz.

Compare [two visual concepts](../artifacts/perpetua-art-direction/comparison.html). Select A, a held image: Cassatt’s physical closeness brings an ordinary human gesture into view before the account complicates it. B uses original textile forms and spatial separation, but needs symbolic explanation. No likeness or psychological claim is made.

Palette: Prussian blue #182d40, faded blue #a6becb, print ivory #e3dac9, ink #263440, rose #b78784. Existing Playfair for the name, Georgia for testimony, Geist for navigation. One overlapping composition; the image participates in reading through an opaque screen that covers the whole print on refusal. No figure is erased. No reunion is implied by the third moment. Avoid the inherited portrait-next-to-panel arrangement and image-shrinking effect.

Research: [Rijksmuseum’s Vermeer](https://www.rijksmuseum.nl/en/story/closer-to-johannes-vermeer) offers guided and independent close looking; [The Serviceberry](https://emergencemagazine.org/essay/the-serviceberry/) separates authored art, text and optional audio. Pages inspected; full interactive playback not claimed. Apply purposeful attention and clear creator credits, without copying assets or layout. The requested [Anthropic skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) informed the comparison and critique.

Artwork: Mary Cassatt, Mother’s Kiss, 1890–1891, NGA Rosenwald Collection 1943.3.2759. [Exact object](https://www.nga.gov/artworks/5934-mothers-kiss) marks its media public domain; [NGA policy](https://www.nga.gov/terms-and-notices) grants CC0. Full uncropped local WebP, 176,816 bytes; provenance and checksum in existing validated interior-media manifest. No new dependencies. Met object 10396 was rejected because its API says isPublicDomain=false.

This pairing is artistic interpretation, not reception history of Perpetua or historical evidence. Human editorial review remains outstanding. Other five movements are retained.


## Rendered evaluation and scope

Compared the supplied deployed preview (captured in references/previous-preview.png), fresh inherited local captures (art-before), first pilot (art-pilot), and revised captures (art-final). The new entrance replaces the devotional mosaic with Cassatt and direct attributed testimony. The separation pilot introduces the covering screen; on narrow screens it becomes a blue veil over the intact print. Three source moments remain reader-controlled, with complete text available without JavaScript. No audio, tracking, dependency or runtime source fetch was added.

Visual revision fixed a wrapped desktop title, conflicting inherited source colors, incorrect screen stacking, and overlapping mobile credits. Mobile now uses document flow. The other five movements retain their content and visual treatment; expansion is withheld. Their return to the existing abstract visual language is the largest remaining creative weakness. Cassatt's nineteenth-century context also requires the visible artistic-parallel qualification; it cannot establish Perpetua's appearance.

Reference-site captures were made before their imagery fully settled (Serviceberry blank, Vermeer background unfilled); research conclusions rely on the inspected published pages, not claimed playback testing. No reference-site artwork is incorporated.

Checks: static build and 402-artifact visitor-export validation pass; typecheck passes; lint has zero errors and four warnings in unchanged files. Domain tests: 47 passed, one generated-export test skipped; the build separately executes the export validator. Local dependencies were already installed and unchanged; npm ci was not repeated. Browser evidence includes 1440/390/320, exact source moments, no overflow or unexpected console/network failures; deliberate media/script aborts are tested separately. New entry-link focus regression was reproduced and fixed without changing deep-link IDs.

Release remains blocked: Jonah author slots and human approvals fail validate:release (see release.log). Perpetua summaries, historical/theological framing and this artistic pairing still await human editorial review. Technical and visual review by Codex do not confer that approval. No production deployment or merge.

Final focused browser suite: **20 passed** (desktop and mobile), including keyboard entry with missing Cassatt artwork, all source moments, 320px reduced motion and axe checks, all six scenes, history, no-JS and failed-script fallback. Screenshot observations are in `artifacts/perpetua-immersive/art-final/observations.json`.
