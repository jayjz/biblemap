# Jonah discovery experience

Draft implementation based on PR #17, `81f34d691895332e7b9d3517b296319d80272f51`. Editorial copy is proposed for review; human approval is not claimed.

## Try it

Build and run `npm run preview`, then visit:

- `/jonah/#jonah-1-escape`: the intact Jaffa print, the passage, and Pascal’s argument about diversion.
- `/jonah/#jonah-3-mercy`: repentance, with a direct link from 3:10 into Jonah’s response. Optional Aquinas remains at 4:1–4.
- `/jonah/#jonah-4-shade`: the passage followed by a larger marble sculpture and an optional exercise in looking. The final question at 4:11 has no added answer.
- `/explore/?place=nineveh&from=jonah-3-mercy`: the existing Deck.gl/MapLibre atlas, a sourced city point, and a short history of Nineveh’s capital and library. The return link preserves the passage.

[Before/after comparison board](../artifacts/discovery-review/index.html), including desktop and mobile. Serve that directory locally to view the HTML board, or open its linked PNGs on GitHub.

## Sources and editorial distinctions

- [Pascal, *Pensées*, Brunschvicg §139, “Diversion”](https://www.gutenberg.org/cache/epub/18269/pg18269-images.html#p_139): paraphrased thematic connection to restless activity; not an explanation of Jonah’s psychology. The earlier three-thinker list is reduced to this one developed idea.
- [Aquinas, *Summa Theologiae* I.21.3, reply 2](https://www.newadvent.org/summa/1021.htm): retained optional argument about mercy and justice, explicitly distinguished from commentary on Jonah.
- [Pleiades: Ioppe](https://pleiades.stoa.org/places/687931) and [Nineveh](https://pleiades.stoa.org/places/874621): representative city coordinates, retrieved from their JSON records on 2026-10-11; © contributors, CC BY 3.0. No Tarshish pin or journey route. Nineveh’s 704–612 BCE capital history is separate from Jonah’s uncertain narrative dating.
- British Museum: [Nineveh gallery](https://www.britishmuseum.org/collection/galleries/assyria-nineveh) and [Ashurbanipal’s Library research](https://www.britishmuseum.org/research/projects/what-was-ashurbanipals-library): palace reliefs, conquest, cuneiform texts, and the recovered tablet collection. Museum search-index text was accessible; direct requests to the library page returned 403.
- [Cleveland Museum of Art, *Jonah Under the Gourd Vine*, 1965.239](https://www.clevelandart.org/art/1965.239): 280–290 CE, marble, early Christian reception. The comparison between lasting marble and temporary shade is an editorial visual reading, not the maker’s documented intention.

No new image files or quotations were introduced. Existing media provenance and publication gates remain in force. Source/rights details and private notes now use progressive disclosure. Stale stabilization claims were removed from AGENTS.md; reviewable previews are distinguished from production approval.

The inherited pinned HTML contains mixed line endings despite its `text eol=lf` attribute. Changing only those HTML attributes to `-text` preserves exact upstream bytes and avoids phantom normalization diffs; Scripture files and validators are unchanged.

## Assessment

The three encounters now have distinct pacing: facing-page flight, a typographic mercy/anger turn, and a sculpture study. Desktop compositions give the art more room; mobile keeps Scripture first, including DOM order. Sources remain discoverable without a stack of research controls beside every passage.

The long chapter-4 passage still takes substantial mobile scrolling before the sculpture. The atlas uses a modern online basemap and needs JavaScript/WebGL; place descriptions and sources remain available when tiles or WebGL fail. No physical-device, Firefox, WebKit, or unfamiliar-reader study was performed. Human editorial judgment is still needed on the copy and provisional art placements.

## Verification

`npm ci`, the three unit-test modules, Scripture/media validation, TypeScript, lint, and the static production build pass. Lint retains the three existing DataLoader warnings; the lockfile is unchanged (36 inherited audit findings). A checkout with `core.autocrlf=true` reproduces all four pinned HTML files byte for byte. Native Windows was not run.

Desktop, 390px and 320px scenes were captured and inspected. Browser coverage checks all 48 canonical verses, keyboard/history navigation, reduced motion, no-JavaScript reading, source disclosures, private-note lifecycle, media publication/failure, the two place links, sourced camera positions, keyboard zoom, and a blocked basemap. Live Nineveh map captures logged no failed requests or page errors. One intermediate Chrome renderer crashed while other capture/build jobs were running; final verification runs separately.
