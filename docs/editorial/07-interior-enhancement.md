# Human Story interiors: a focused enhancement

Implementation for draft PR #36, based on `207f395a669a2bf87182ef80de6d7dca669e000c`. This is the subsequently requested interior enhancement, not implementation of the entire earlier eight-movement treatment. The homepage files, five worlds and six-scene Perpetua navigation remain in place. No creator reflection has been invented or moved into the application; the pending Augustine reflection remains pending.

## What the browser showed

The local static export was experienced in Chrome before editing: all five world pages, Pliny’s reading room, Perpetua’s separation and father control, and Saints on a phone-sized viewport. Each world had zero images in its main content. The common empty header, summary/note and equal card grid made very different collections feel interchangeable. Witnesses led with a substantial comparison table before a reader heard either correspondent. Saints explained autobiographical distance before giving anyone’s words. Perpetua’s separation used the same abstract diagram and controls as other scenes, while its text described rather than reproduced the request and religious interpretation.

Baseline evidence: [Witnesses](../../artifacts/human-story-interiors/before/witnesses-desktop.png), [Saints](../../artifacts/human-story-interiors/before/saints-desktop.png), [phone](../../artifacts/human-story-interiors/before/saints-mobile.png), [record](../../artifacts/human-story-interiors/before/tour.json). The baseline Perpetua screenshot records the father control after selection; it is scrolled and is not a like-for-like composition comparison.

## Design argument

Keep the established blue/mineral palette, plum for Saints/Perpetua, Playfair headings and Geist interface text. Let the ochre and red come from the artwork. Use a split opening, a reading surface and ruled lists, with no new decorative motion. Images retain their complete compositions. The result should offer something worth examining before asking a reader to choose another route.

| Before | After | Why |
| --- | --- | --- |
| Large text-only world headers | An image and a specific invitation beside each world title | Give the collection a visible object of attention |
| Identical white cards | Compact ruled reading lists retaining titles, subtitles, eras and evidence types | Preserve scanning while making space for a featured encounter |
| Witness table precedes any ancient voice | Pliny’s procedure beside a keyboard-operable Trajan reply; full table remains in a disclosure | Compare actual official language in place, then consult the wider index |
| Saints introduces categories of life-writing | Perpetua and Augustine excerpts with distinct addressees and framing | Let a reader encounter the difference before summarizing it |
| Separation summarized beside abstract shapes | Wallis’s translated passage beside a later mother-and-child mosaic; earlier passage opens inline | Compare a changing relationship across the account, and a later image’s continuity with the text’s separation |
| Augustine’s opening available chiefly by an outward link | Opening excerpt, devotional painting and optional comparison on the reading page | Bring text and reception into the same field of attention |

## What shipped in this draft

- All five world overview pages have visual openings and reading lists. Existing rights-cleared Jonah sculpture, Flood Tablet and Michelangelo imagery are reused for Stories, Atlas and Voices.
- Witnesses and Pliny share the letter/reply comparison. Trajan’s punishment clause and pardon conditions remain visible together when opened; the interface does not turn the reply into an unqualified statement of toleration. The Roman Forum print is dated eighteenth century; Pliny’s letter is located in Bithynia, not that image’s Rome.
- Saints pairs the prison passage attributed to Perpetua with Augustine’s address to God. Perpetua’s separation gains the actual translated account, an earlier-passage comparison and a later devotional mosaic. Scene IDs, deep links, relationships, history focus and full-reading mode are retained.
- Augustine gains a side-by-side text/art encounter. The image comparison identifies the painter’s heart, quill and VERITAS; it is curatorial observation, not a creator-authored reflection.
- Native disclosures retain comparisons and provenance without JavaScript. Existing local-image failure behavior remains in use. No package dependency or Vercel configuration was added.

Implementation is split among fixed [passages](../../src/content/human-story-interiors.ts), [image records](../../src/content/human-story-interior-media.json), small presentation components and a CSS module scoped to these interiors. The new media integrity checks run in `validate:media` and therefore in the normal build, as well as in the unit suite.

## Sources and representation

The selected ancient-language translations were independently checked against their linked editions, rather than attributed to the creator:

- [Pliny and Trajan, Melmoth / Bosanquet](https://www.gutenberg.org/files/2811/2811-h/2811-h.htm): modern Letters 10.96–97, numbered XCVII–XCVIII in this edition’s Trajan correspondence. The selected procedural passage and reply are testimony by officials. They are not a record of Perpetua’s trial.
- [Augustine, Pusey](https://www.gutenberg.org/files/3296/3296-h/3296-h.htm): Confessions I.1. Exact excerpt, including the questions following the restless-heart statement. No modern translation is silently substituted.
- [Wallis, Argument I.2](https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_I) and [II.2](https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_II): Passion §§3 and 6. The displayed “no [longer]” corrects the electronic transcription’s “no long” and is explicitly disclosed. The source’s attribution, divine interpretation and silence about the father’s reason remain distinct. New quotation rights do not rely on Fordham’s commercially restricted electronic edition.

Three new local WebP images total 456,454 bytes. Checksums, dimensions, dates, creator, classification, source, rights basis and transformation are retained in the manifest:

- Piranesi, Roman Forum, ca. 1775: [Met object 363433](https://www.metmuseum.org/art/collection/search/363433), accession 37.45.3(58). The official collection API marks it public domain; [Met Open Access](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access) releases those images under CC0.
- Champaigne, Saint Augustine, circa 1645: [LACMA object 61062](https://collections.lacma.org/object/61062). Underlying painting is public domain; the faithful two-dimensional reproduction uses the US PD-Art basis documented for the [equivalent Commons painting file](https://commons.wikimedia.org/wiki/File:Philippe_de_Champaigne_-_Saint_Augustine_-_LACMA_-_without_frame.jpg). LACMA’s photographic credit, © Museum Associates/LACMA, is retained. This is not represented as an institutional CC0 grant; reuse outside the US can involve different photographic-rights rules.
- Perpetua mosaic: [Perpetua and Felicitas Exhibit, item 40](https://perpetua-felicitas.carrieschroeder.org/items/show/40), corroborated with its linked Commons file. Photograph by Enric, 4 January 2015, CC BY-SA 3.0. Resized full-frame WebP derivative retains attribution and share-alike terms. Mosaic artist/date are **unknown**. It is later devotional art, not evidence of anyone’s likeness or of the prison’s appearance. Wikimedia’s download endpoint returned 429; the same attributed photograph was acquired from the exhibit’s licensed original-file link instead.

## Review and remaining limits

The more meaningful discoveries are hypotheses about reader experience, not measured emotional outcomes. No participants were simulated. The earlier [qualitative study protocol](06-evaluation-and-recommendation.md) can be adapted to compare this branch against the recorded baseline: observe unprompted use, recall, attribution, source distinctions and voluntary continuation before directing readers to controls.

Atlas and Voices now have visual anchors and a less repetitive reading index, but their deeper inline encounters remain thinner than Witnesses and the two model reading rooms. Other Perpetua scenes still use the existing abstract diagrams. The historical translations can feel distant; translation choice and source framing need human editorial review. The child’s later life and the father’s reason for withholding him remain outside what these passages establish. Creator reflections remain a separate editorial decision.

The next decision is a human review of these specific compositions and source choices, followed by unfamiliar-reader observation. It is not another automatic expansion of the site.

## Verification evidence

- `npm ci`, static build, type checking, lint, unit tests and the complete normal desktop/mobile Playwright suite passed: **33 unit tests, 111 browser tests, one browser skip**. Lint retains four pre-existing warnings in unchanged files. No new dependency or lockfile change. The install reports 45 existing dependency advisories; these were not investigated or fixed in this scoped run.
- The normal build includes pinned Scripture verification, the established media gates and the new image identity/provenance checks. The separate ordinary-export check also passed. The unchanged opt-in Nineveh browser suite was not rerun.
- New browser coverage exercises the actual primary-source comparisons, keyboard focus, native no-JS disclosures, missing-image fallback and axe checks. Existing regression coverage retains Perpetua history/focus, all worlds at 320px/200% text, reading rooms and homepage behavior.
- The final [browser tour](../../artifacts/human-story-interiors/after/tour.json) records eleven visits and five interaction observations with zero console/page errors, failed requests, HTTP errors or recorded overflow. Desktop and phone screenshots were visually inspected. All six selected historical excerpts also matched the independently retrieved editions after whitespace/footnote normalization and the disclosed Wallis correction.
- [Evidence index and reproduction command](../../artifacts/human-story-interiors/README.md); [machine-readable verification](../../artifacts/human-story-interiors/verification.json). Highlights: [Witnesses comparison](../../artifacts/human-story-interiors/after/witnesses-desktop.png), [Saints on a phone](../../artifacts/human-story-interiors/after/saints-mobile.png), [Perpetua separation](../../artifacts/human-story-interiors/after/perpetua-desktop.png), [Augustine](../../artifacts/human-story-interiors/after/augustine-desktop.png).

The working diff was reviewed with the change-verifier, React best-practices and web-interface guidance: native controls, no new effects/state machinery, explicit image dimensions, complete captions, source-linked translations, scoped CSS and static content. No blocking finding remains in the exercised scope. The unrelated `next-env.d.ts` modification retains its initial checksum; unrelated local artifact/report directories remain excluded from the commit. No merge, production deployment or Vercel configuration change was performed.
