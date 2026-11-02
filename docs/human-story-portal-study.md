# Human Story portal — design and editorial study

Release preparation now stages Human Story at `/` and preserves Nineveh at
`/nineveh/`, superseding the earlier restriction on preparing that route swap.
The [release checklist and publication blockers](human-story-homepage-release.md)
govern the candidate. Editorial approval is still missing; this is not a release.

This is the review surface for PR #36, on `feat/human-story-portal`. It replaces the seed's generic sunset and external teasers with five connected worlds. The creator's [November 1 scope correction](https://github.com/jayjz/biblemap/pull/36#issuecomment-6561745828) superseded the earlier narrow proposal. The current release brief authorizes route preparation and a manual preview, conditional on the publication gates described above.

This document is the implementation inventory for human review. The [verification record](human-story-verification.md) retains the check and milestone history; the earlier handoff and design plan remain historical context. Release preparation is routing and verification only; narrative and design development require a separate brief.

The preserved Nineveh `/nineveh/`, full Jonah reader `/jonah/`, Atlas `/explore/`, Exodus and legacy deep links remain intact. Human Story is available at `/` and `/human-story/` in the release candidate.

The later narrative direction changes the emphasis: the collection supports an encounter rather than being the creative result itself. [Three detailed treatments and visual storyboards](human-story-narrative-treatments.md) precede implementation. **Perpetua — The Prison** replaces the common reading layout on its existing route with a complete, six-scene interactive narrative. Augustine — The Garden and The Witnesses — Rome Remembers remain distinct treatments, not falsely claimed implemented experiences.

## The experience

- **Stories:** five Scripture-led entrances, from Genesis through Exodus, Jonah, Luke and Acts. The existing full Jonah text remains independently accessible.
- **Witnesses:** Tacitus, Pliny/Trajan, the distinct James and Testimonium passages in Josephus, and Suetonius's disputed Chrestus. A manuscript witness has a separate classification from testimony to events.
- **Saints:** Perpetua/Felicity, Augustine, Teresa and Francis, with autobiography, an editor's frame, spiritual testimony and later legend distinguished.
- **Atlas:** the existing geographical system, entered through sourced cities, an existing epoch or camera orientation. No new historical route or agreed chronology is invented.
- **Voices:** translation, Jewish and Latin Christian commentary, philosophy, communal singing, manuscripts, Renaissance art and architecture. A dedicated destination is supported by actual readings; these voices also remain inside the other worlds' connections.

Three authored sequences cross these domains: **A word crosses centuries**, **A name under pressure**, and **A life in another life**. Their order is editorial, not a historical itinerary. Each adjacent step is backed by a classified, sourced graph relationship.

## Architecture and evidence

The typed graph has stable entry, person/place, source and connection IDs. Each narrative section and relationship carries source IDs; each source records a passage/field locator, edition, retrieval date, limitations and rights. All new copy remains a draft in a no-index review surface. Existing release gates are unchanged.

The index provides six initial entrances after hydration, with all 23 readings available through search, world selection or expansion. Without JavaScript the complete collection, reading rooms, native source disclosures and authored paths remain available. The core reading experience uses local content and media, not runtime source fetching.

## Creative choice

Read the three medium-neutral alternatives and the seed critique in [human-story-design.md](human-story-design.md). The selected living-weave direction pairs mineral colors and substantial typography with source-specific works and visible relationships. Original interface linework is not historical cartography. Sculpture, a clay tablet and a Renaissance fresco keep distinct dates, provenance and interpretive roles.

## Review materials

- [Source and rights ledger](research/human-story-sources.md)
- [Milestones, checks, screenshots and limitations](human-story-verification.md)
- [Retained legacy research archive](human-story-codex-handoff.md)
- Screenshots: `artifacts/human-story/before/` and `artifacts/human-story/after/`

The original design work used frontend-design, accessibility and Emil design engineering guidance. No additional skill package or production dependency was installed; temporary formatting made the new content and components inspectable.

Editorial questions remain open: the accuracy and framing of each new paraphrase, especially the Hebrew-based Radak summary; the intelligibility of cross-era comparisons; the appropriate relationship between the new entrance and Nineveh; and independent visitor comprehension. Automated checks do not establish a person's emotional response or constitute theological publication approval.
