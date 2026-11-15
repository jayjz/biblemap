# Pliny · The names he did not write

Sourced editorial draft for the requested Pliny refinement. Branch `feat/pliny-human-encounter`, base `23bf774dbd38b98dd8921d33149ed4485440c223`. The exact delivered commit and immutable preview are recorded in the draft PR. No production publication decision is supplied by this work.

The [research dossier and skill-use matrix](research/pliny-human-encounter.md) contain the source-discovery log, translation decisions, evidence ledger, rights bases, rejected leads and unknowns.

## Creative treatment

An unfamiliar visitor first meets Pliny as a governor exercising authority while asking how to proceed. The narrative then follows the consequences of his procedure, the traces of communal life he reports, the two enslaved women he says he tortured, and the imperial answer. The ending distinguishes the officials' surviving language from the women's missing testimony.

Two complete visual/motion directions were compared before implementation: **the moving dossier** and **the divided record**. The latter was selected. A desk reconstruction or geographical flight would add specificity that these letters do not supply. Typography can make the imbalance in the record visible directly.

The five movements have deliberately different composition and pace:

1. **The governor's desk.** An imposing thesis heading stands beside a typeset official account. Its shallow entrance motion brings the document into the reading plane. The composition explicitly identifies itself as original typography, not a facsimile.
2. **The accused.** Repeated source fragments become broad documentary bands. On larger screens their indentation increases as the interrogation escalates. Scroll-linked underlining emphasizes threat and punishment without hiding any words. The common meal interrupts the procedure with a quieter account of gathering.
3. **The two women.** The dark administrative field gives way to a sustained pale field. Two simple vertical rules open once; no figure, face or bodily suffering is reconstructed. An exact fragment of Pliny's account stands apart from an explicit statement that their testimony is absent. The aftermath remains with what the record cannot tell us.
4. **The emperor replies.** Opposed light/dark planes approach their final positions as restraint and punishment are read together. Pardon and anonymous accusations remain in the main narrative. The complete reply is one native source jump away.
5. **What survives.** Two officials' records and the women's unrecorded names, words and fate occupy distinct columns. On mobile they become successive reading blocks. The ending leads to the account attributed to Perpetua, with the different setting and lack of a proven legal connection stated explicitly.

Motion uses native CSS scroll timelines when supported, finite transform animations, and one IntersectionObserver for orientation. No scroll listener, requestAnimationFrame loop, WebGL, shader, animation package, image or sound is shipped. The visitor may stop motion at any point. The OS reduced-motion preference always disables it. Static/no-JS reading is the base layout; unsupported animation features leave the same words available.

## Design system and concept comparison

The selected built-in Image Gen study is `/tmp/pliny-review/concept-divided-record.png`; the alternative is `concept-moving-dossier.png` in the same directory. These are design studies, never source authorities or production assets. The generated prompts and images were returned in the working conversation. Original files remain in the generated-images directory.

| Comparison point | Selected treatment → implemented evidence |
| --- | --- |
| Palette | Carbon `#181b1a`, paper `#eee7d9`, muted red; dark/light shifts follow narrative perspective. No raster overlay or faux manuscript texture. |
| Typography | Large local Playfair narrative type, local Geist body and mono reference labels; the original thesis is the opening heading. Source labels were enlarged after mobile review. |
| Container model | Open fields, ruled bands and a divided ruling; no card grid. The letter plane is explicitly a designed document surface. |
| Women's moment | Large pale interruption, isolated quotation and two rules retained. Added a separate aftermath so the line is not immediately overtaken by the emperor's answer. |
| Reply | Restriction and punishment remain juxtaposed on desktop and successive on narrow screens; actual verified pardon wording replaces provisional mockup copy. |
| Ending | Two official voices beside an explicit account of what is missing; no fabricated testimony or generic reflection prompt. |
| Navigation | Intentional adaptation: a compact sticky top rail replaces the study's sidebar so source access and motion controls remain reachable at all widths. |
| Copy integrity | The mockup's quotation marks around a modern heading and its provisional pardon wording were rejected. Actual quotations come exclusively from the pinned source packet. An exact year in the mockup was replaced with early second century. |

This is a faithful implementation of the selected visual system with the disclosed source, navigation and responsive adaptations above; it is not claimed to reproduce a provisional composite board pixel for pixel. The full board is 1536×1024; its separate viewport panels are concept studies. Actual browser review uses 1440×1000, 768×1000, 390×844 and 320×844 rather than treating the entire board as one page screenshot.

## Implementation boundaries

| Files | Purpose |
| --- | --- |
| `src/features/human-story/pliny/PlinyEncounter.tsx` | Server-rendered five-movement encounter, exact source excerpts, complete local letters, native disclosures and source jumps. |
| `src/features/human-story/pliny/PlinyMotion.tsx` | Small client boundary: orientation and optional motion. Subscribes to OS preference without per-frame React state. |
| `src/features/human-story/pliny/pliny.module.css` | Responsive art direction, fixed reading geometry and progressive motion. |
| `src/content/pliny.ts`, `pliny-record.json` | Auditable sources, claim/locator mapping, editorial prose, exact excerpts and pinned historical English letters. |
| `src/app/human-story/[entry]/page.tsx` | Existing route dispatch and Pliny-specific metadata. |
| `src/content/human-story.ts`, `human-story-witnesses.ts` | Source graph integration and the updated discovery title/subtitle. |
| `src/domain/pliny.test.ts`, `tests/pliny.spec.ts` | Exact source integrity, draft boundaries and the complete accessible visitor flow. |
| `package.json`, `tests/perpetua.spec.ts` | Run the Pliny source checks before every build; retain the no-JS Perpetua-to-Pliny journey assertion with the new title and explicit identity check. |

The small letter comparison in the witnesses world remains available. Existing Pliny `#procedure`, `#practice`, `#reply`, `#source-pliny-letters` and `#source-pliny-melmoth` fragments are retained. No new production dependency, source service, retrieval infrastructure or publication bypass was added.

## Browser review and revisions

Browser plugin/skill absent: real Chrome through the repository's Playwright stack was used. Baseline screenshots captured the original reading room before implementation. The final static export was reviewed through the visitor's chapter links at desktop, tablet, phone and narrow phone sizes. Local transient evidence lives in `/tmp/pliny-review/`; selected durable screenshots accompany this report under `artifacts/pliny-human-encounter/`.

The flow reviewed was: entry → open record → interrogation → women and ministrae note → emperor's ruling → full local reply → source limits → ending → Perpetua.

Concrete revisions from rendered review:

- A source link originally landed on a closed details element. Moving its fragment target inside the details body lets native fragment navigation reveal the full source, including without JavaScript.
- The initial interrogation treatment was too uniformly aligned. Increasing indentation and documentary emphasis now makes the accumulation of procedural pressure visible. The women's field remains still after its brief ruled transition.
- Source labels were too small on narrow screens. They now render at 12 CSS pixels at the default text size and remain subordinate to the larger reading text.
- Motion controls initially scrolled away. A compact sticky header/rail now keeps source access and the motion preference reachable without covering the story's central field.
- The 200% text-size check exposed cramped header/navigation and a partly visible offscreen skip link. Header wrapping, flexible chapter links and a size-independent hidden position address the root causes.

No loading/empty API state is introduced: all primary text is present in exported HTML. Blocking images/media does not remove any part of this encounter. Native disclosures retain source access without hydration. Remaining validation results and exact lab measurements are recorded below after the final checks.

## Limits and review still required

Source verification is bounded to the inspected editions and passages. Multiple translations of the same letter do not constitute independent witnesses. Christian Open Library was usable for public editorial discovery only; no authenticated library passage lookup or quotation check was available. No COL-derived quotation ships.

The source packet's public-domain basis is stated for the United States. No new third-party media requires clearance. AI-authored editorial bridges remain drafts requiring human historical/editorial review. Artistic quality, browser usability and technical checks do not demonstrate emotional effect or newcomer comprehension. The strongest remaining check is an unbriefed reader explaining who speaks, what happens to the women in the text, what Trajan's reply restricts, and what remains unknown.

A possible reusable pattern is the juxtaposition of an official passage, its stated consequence, and a bounded statement of what the record omits. This implementation keeps that pattern local; it does not introduce a general story engine.
