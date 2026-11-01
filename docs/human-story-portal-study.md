# Human Story portal — design and editorial study

## Status
Draft visual and information-architecture experiment. This is not production publication approval. The current Nineveh homepage at `/`, complete Jonah reader at `/jonah/`, and Atlas at `/explore/` are unchanged. Review `/human-story/` before discussing any homepage swap.

## Creative thesis
BibleMap follows Scripture through human lives, places, material history, external testimonies, art, theology, and reception. It should feel like a richly authored world, not a directory or encyclopedic aggregation. A person must be able to enter a single story and find honest connections outward.

## Experience graph
- **Story**: the human-scale narrative and a Scripture passage.
- **Person**: biblical figure, early witness, saint, critic, artist, philosopher, or scholar.
- **Place/time**: atlas-linked with disputed identifications and dates declared.
- **Evidence**: text witness, archaeological context, later theological tradition, interpretation or legend, each labeled distinctly.
- **Work**: art, manuscript, song, ritual, reception history, or original illustration with proven rights.
- **Question**: editorial point of connection without telling readers what to think.

Design relationships as explicit editorial links with durable IDs and citations; do not claim causal influence merely from theme similarity. Biblical worldview shapes editorial selection and interpretation but should not reclassify hostile testimony or late legends as direct proof.

## Initial portal scope
The first preview provides navigation to existing Jonah and Atlas; one independently scoped `/human-story/` route; three contextual invitations; accessible semantic structure; reduced-motion support. Saints and external-witness content are **teasers and source links**, not fabricated finished experiences. No new runtime dependencies or image licenses. External citation links and historical wording require separate editorial verification before publishing.

## Source discipline
Primary sources first, dates and translations explicit, scholarly disputes surfaced. Josephus Antiquities 20.200 for James is different from the interpolated Testimonium in Antiquities 18.63–64. Tacitus Annals 15.44 and Pliny Letters 10.96 attest to Roman perceptions/Christian practice, not independent evidence for all Gospel narratives. Suetonius's Chrestus is disputed; don't assert identification. Saint narratives differentiate eyewitness/near-contemporary account, autobiographical testimony, subsequent hagiography and legend. Feast dates and historical dates should not be invented.

## Design direction before implementation
**Cartographic dusk and illuminated pages**: a deliberate editorial composition, dark lapis/ink, warm light and stone, asymmetric typographic opening, no floating dashboard cards or gratuitous animation. Visual atmosphere is interpretive and deliberately does not depict Nineveh as verified. The portal uses CSS-only landscape for now because a generated or sourced hero image would require its own visual review and provenance.

## Skills and design review
Use the official Anthropic `frontend-design` skill (https://github.com/anthropics/skills/tree/main/skills/frontend-design) as design critique guidance, not as a claim that all UI skills were installed. Evaluate ideas from the requested Apple-style clarity, shadow quality, accessibility, interaction and responsive adaptation; don't install ten overlapping or unverified packages. The optional external checker at https://github.com/enmerasoftware/ai-design-check needs its instructions and license reviewed before use. Existing repo rules and human editorial authority take precedence over any third-party skill.

## Review protocol
1. Compare current Nineveh `/` against `/human-story/` on desktop, tablet and narrow mobile, including 320px.
2. Can a reader locate Jonah 1 and the Atlas without having to finish an encounter?
3. Does the first viewport feel like a human experience, not a product pitch?
4. Do keyboard order, visible focus, contrast, text zoom, reduced motion and no-JS navigation remain usable?
5. Are quotations, illustrations, uncertain dating and later traditions visibly distinguished?
6. Verify all external references, source links, translations, and rights before approving copy.
7. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npm run test:e2e` and inspect static export.

## Next focused PRs, not this one
A sourced `/witnesses/` dossier; a sourced Augustine or Perpetua journey; and a typed content-graph schema with stable IDs. Each should stand on its own with editorial review. Do not modify drafts #32–35 while testing this portal.
