# Homepage identity: the living archive

The entrance reads Scripture alongside lives, places, documents, material objects and later art. Pliny leads through an actual witness to the survival of his letter collection. The homepage does not infer motives, make historical documents interchangeable or imply contact among its four featured people.

Applied skills: `biblemap-creative-direction` (human situation and source limits), `biblemap-discovery` (encounter before optional scholarship), `biblemap-visual-review` (rendered comparison, hierarchy and responsive corrections), `frontend-app-builder` (whole-page concept comparison, extracted design system and fidelity review), `react-best-practices` (server composition and narrow client props), `frontend-testing-debugging` (browser interaction loop), `evidence-contract` (bounded evidence ledger), `change-verifier` (diff and acceptance checks), Vercel `deployments-cicd` (exact-commit preview) and `verification` (entrance → static catalog → encounter/source). Their actual instructions were loaded. No missing skill blocked execution; none was installed. The user's restriction on generated imagery overrides the frontend skill's generic Image Gen concept default. There was no unmet artistic need requiring new generated art. The existing Thomas art was reused with its existing disclosure and provenance.

The Browser plugin/browser skill was not available. Real Google Chrome through the repository's Playwright installation supplied browser inspection and screenshots. The [current Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/) were consulted on 15 November 2026. They inform interaction review, not a claim of complete conformance.

## Three working compositions

Run `node --experimental-strip-types scripts/homepage-concepts.mjs --serve`, then visit `http://127.0.0.1:4198/concepts/a.html` (also `b.html`, `c.html`). The generator reads the same manifest, catalog, invitations and media records as the implementation. Each prototype includes working selected encounter links, all-27 discovery, source links and a mobile composition. The local server serves actual encounter destinations from the candidate export; the HTML files are review artifacts outside publication scope and are not new visitor routes. Six rendered desktop/mobile screenshots are retained in `artifacts/homepage-v2/concepts/`.

| Concept | Artistic mechanism and visitor discovery | Strongest decision | Weakest decision / representation risk |
| --- | --- | --- | --- |
| **A — The Living Archive** | Open editorial spread: cream reading ground and dark manuscript ground, then a mosaic, marble sculpture and Thomas's existing interpretive scene. A person reaches us through a particular surviving form. | Pliny's literary invitation and the physical survival of the collection are visible together. Strong editorial hierarchy with accessible discovery later. | Prototype mobile art arrived below the full introduction; Perpetua's image and text were separated; a narrow comparison note created an empty area. A manuscript could be mistaken for the quoted letters without an explicit caveat. |
| **B — The Constellation** | A ruled relationship layout connects Pliny with the letter collection, the province in his correspondence and an explicitly editorial comparison with Perpetua. Jonah's Scripture-to-sculpture relationship and Thomas's distinct Gospel/sayings witnesses extend the approach. | Labels state what each connection actually means; no luminous nodes, fabricated edges or historical influence claims. | The desktop requires reading several parallel explanations; mobile becomes a long source outline before the next person. The visible network is intentionally sparse because there is no evidence for a continuous four-person graph. |
| **C — The Human Threshold** | A dark, intimate opening and a sequence of different full-width entrances: manuscript, warm mosaic, cool marble, dark Thomas scene. | Most immediate atmospheric continuity; each account has its own visual temperature and scale. | Long sequential bands can feel like independent story sites; the opening's general phrase is less specific about the archive. More scrolling before broad discovery. |

All six actual renders were inspected with `view_image`, at 1440×1000 and 390×844. Each concept had no horizontal overflow or page exceptions. Selection is a design judgment, not a measured reader outcome. **A wins** for editorial coherence, explicit first entrance, controlled visual variety, simple server composition and evidence-specific captions. B's network is clearer as an optional connection disclosure; C's atmosphere remains useful for Thomas's distinct entrance.

## Extracted system and intentional corrections

Paper `#f3efe4`, text `#242822`, manuscript ground `#252c26`, primary action `#762e26`, rules `#b5b3a6`. Locally hosted Playfair Display supplies literary hierarchy; Geist supplies reading and navigation. No dependency, remote font, carousel, parallax, decorative reveal, WebGL graph or autoplay is added. Open spreads, rules and full-width changes of ground carry the composition. Real source material retains its color; no tints, texture simulation or cropping is applied to documentary objects.

Allowed opening copy is defined by `HOME_INTRO` and `HOME_INVITATIONS.pliny`: title, product explanation, Pliny/name/evidence kind, invitation title and paragraph, region/period, entry action and letter references. Header: BibleMap, Scripture · lives · places, The encounters, Discover, Open Atlas. Figure captions and provenance summaries are required accessible extensions to the visual spec. The final title and CTA wording preserve the concept; code-native controls replace the prototype's text arrow with a small SVG arrow.

The three weakest prototype moments were corrected:

1. **Late mobile artwork:** manuscript and opening description share a compact first row; the Pliny invitation follows. The grid stacks automatically when enlarged text needs more space. The source disclosure remains usable without JavaScript.
2. **Isolated connection note:** a full-width ruled thread uses the existing sourced `pliny-perpetua` comparison. Its factual limitation and original source links live in a native disclosure. No causal edge is invented.
3. **Detached Perpetua image:** the complete mosaic and compact attribution form one adjacent opening above her invitation, beside Jonah's different landscape composition. No repeated rounded-card shell is used. Thomas then changes the reading ground and explicitly distinguishes John's narrative from the sayings.

Further verification corrected wrapping at 320px/200% text by making grid minimums depend on rem units and allowing the wordmark to wrap, and corrected the Jonah source link to the existing reading-room source section rather than an absent reader anchor.

## Fidelity ledger

| Comparison point | Prototype evidence → final implementation | Decision |
| --- | --- | --- |
| Copy and hierarchy | A's title, product explanation, Pliny invitation and primary action → `ArchiveHome`/`Invitation` | Preserved. Source references and an explicit supporting-section heading added for navigation and source access. |
| Type and spacing | A's large Playfair title, open reading area and small sans-serif source notes → module tokens and fluid rem sizes | Preserved; responsive wrapping and a deliberate responsive mobile title improve reflow. |
| Palette and imagery | A's cream/dark split and unaltered manuscript → full facsimile with responsive local derivatives | Preserved; artifact limits now disclosed inline and in details. |
| Supporting spread | A's asymmetric Perpetua/Jonah spread → adjacent mosaic/caption and landscape sculpture | Corrected the prototype's empty area and detached caption; all art remains uncropped. |
| Connection and discovery | A's narrow comparison note and native all-readings disclosure → ruled source-bound thread and existing searchable explorer | Intentional functional extension: keyboard search, filtering, empty state and connection selection retained. All readings remain in no-JS HTML. |
| Thomas | A's dark change of ground with existing art → same composition plus original sayings entrance | Preserved; generation is visibly disclosed, with separate source and provenance access. |

This verifies fidelity to the selected visual direction while recording concrete, necessary deviations. Final rendered evidence and remaining risks are in [verification.md](verification.md). No emotional effectiveness or human approval is inferred from screenshots or tests.
