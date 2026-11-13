# Lachish: Before the Walls Fell

Implemented at `/lachish/`, as a no-index editorial review candidate. Human historical/theological review and a separate creator publication decision remain outstanding. The route is provisional in the existing release scope; no existing review gate is weakened.

## Narrative and visual treatment

The people of Lachish are the subject. The opening establishes a city of households before the political conflict and assault. The relief's families, possessions, cart and animals supply a human thread without inventing identities, speech or interior thoughts. The ending returns to the limits of the surviving record.

The six movements remain connected: city → imperial conflict → defenses and assault → displacement → royal representation in Nineveh → competing accounts of Jerusalem. The three source traditions have different purposes. The story never depends on opening an annotation.

The chosen visual treatment uses limestone, dark olive terrain, gypsum and restrained ochre. [The generated concept](concept.webp) establishes the opening and six-movement rail. The alternative considered was a reconstructed city traversal; it would require unsupported spatial detail and a much larger rendering budget. The implemented artifact-led 2.5D treatment explains fewer relationships more precisely.

The visitor follows a detail from an actual relief photograph into an original spatial schematic, then into a modern photograph of the excavated ramp and back to the artifact. Three selected details, enlargement, source links, URL state, back navigation and reload are functional. The schematic contains no survey coordinates, measured dimensions or imported archaeological mesh. Geometry, proportions, engine workings, lighting and relative placements are illustrative.

## Implementation boundaries

- `LachishEncounter`: server-rendered narrative and movement composition.
- `LachishSources`: claim links, provenance, complete pinned Scripture; no runtime retrieval.
- `ReliefExplorer`: selected detail, evidence view and zoom; external URL state via `useSyncExternalStore`.
- `SiegeLandscape`: isolated original SVG spatial interpretation. No WebGL or new production dependency.
- `JourneyNavigation`: section observation and horizontal mobile orientation.
- `SourceNavigation`: unfolds native disclosures when a source link is followed; native links and summaries remain available without JavaScript.
- `LachishMedia`: responsive local images and missing-media fallback, including errors before hydration.
- `sources.json`, `narrative.ts`, `scripture.json`: deterministic editorial records. `pin-lachish.mjs` checks retained publisher snapshots and regenerates the downloadable machine registry offline.

## Design comparison

The concept and real browser screenshots were inspected with `view_image`. Browser plugin was unavailable; Playwright with installed Chrome was used. Checked at desktop 1440×1000, native concept size 1536×1024, mobile 412×839 and narrow 320px reflow.

Compared: dark-olive/limestone color relationship; literary heading scale; left text/right city composition; restrained outlined action; material transition into an actual relief; six-movement rail; mobile reading hierarchy; source controls and image disclosure. Hero title, subtitle and primary action preserve the concept's wording. The contextual copy now begins with households and identifies Hezekiah as Judah's king, following the first-time-visitor review. No invented historical claims were taken from the mockup.

Intentional differences: actual licensed photographs replace the concept's synthetic artifact image; the ribbon shows captives following the creator's human-centered adjustment; the evidence view controls live with the full working relief instead of the hero; required AI disclosure and Sources navigation are explicit. The standalone generated city differs from the mockup and is disclosed as hypothetical. The diagram is an original relational explanation rather than a photoreal reconstruction.

Visual fixes found during review: wait for real lazy-loaded imagery before capture; preserve selected detail on URL restoration; unfold source targets; keep active movements visible in the mobile rail; recover from image errors that precede hydration. No claim of user comprehension testing or independent reader sign-off is made.

## Generated art record

Built-in `image_gen` was used. No CLI/API fallback, external model service or third-party photograph input was used. Model/version was not exposed by the tool.

Final image: `public/media/lachish/city-720.webp` and `city-1440.webp`; full original checksum and disclosure in the media manifest. The concept is `docs/lachish/concept.webp` and is never used as an ancient artifact.

Final production-art prompt:

> Use case historical-scene; original interpretive illustration, not archaeological evidence. Create a standalone 1536x1024 landscape background plate for BibleMap Lachish Before the Walls Fell matching the previous concept's illustration only. NO TEXT, no interface, no relief or artifact image, no inscriptions. Hilltop Judean settlement seen obliquely from outside, sandy limestone and mudbrick forms, tight modest flat-roof houses behind a strong simple perimeter wall, one larger civic block atop the hill, small open gateway, arid olive foothills in the distance. Restrained architectural maquette / tactile clay and cut-paper artistry with fine weathered surfaces and warm angled evening light. Deep dark olive charcoal sky and foreground #171916 blending naturally into negative space at left third; city dominates right two thirds. No fantasy castles, no medieval towers, no military figures, no water, no photograph claim. Nonmeasured artistic evocation: city layout, height, houses and exact materials are hypothetical. A majestic quiet city before a siege, subdued ochre #bda371 and limestone #eee7d8. Crisp architectural silhouettes with monumental scale and sophisticated art direction; same perspective as prior generated concept, foreground sweeps from low left to walled hill high right.

## Skills used

Story Forge, BibleMap creative direction, frontend app builder/testing, React best practices, imagegen, source-integrity-audit, evidence-contract and change-verifier informed implementation and review. Verified neighboring game skills for 3D, cameras, shaders, assets and performance were inspected selectively. No third-party skill scripts were executed. A continuous WebGL renderer, shader stack and imported model pipeline were unnecessary for this bounded relational scene.
