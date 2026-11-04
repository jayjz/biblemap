# Perpetua: facing passages

3 November 2026. Design checkpoint for PR #36. A prototype for creator review; no editorial or production approval.

## What the browser shows now

The [desktop baseline](../artifacts/perpetua-immersive/before/desktop-separation.png) gives almost half the composition to a devotional mosaic. The [390px baseline](../artifacts/perpetua-immersive/before/mobile-separation.png) stacks quotation, notes, a tall image, relationship buttons and evidence. The scene is 1,872px tall on that phone; its meaningful comparison is behind a disclosure. The same diagram/button/copy arrangement governs the other scenes. This is legible and functional, but feels like a staged application because its controls and panels remain constant while the documentary situation changes.

The six-scene treatment already supplies the story. The source dossier adds crucial limits: attributed composition is disputed, the father's reason is unstated, relief is interpreted religiously, Felicity is represented by the narrator, and the infant's later life is absent. None requires a new story or invented inner voice.

## Two viable directions

| Criterion | A: facing passages | B: a turning book |
| --- | --- | --- |
| Narrative | An earlier passage can return alongside the later one. Typography gives the refusal and the subsequent religious explanation distinct space while preserving their sequence. | Each scene occupies a leaf; turning marks chronology and the final narrator's different speaking position. |
| Source integrity | Exact §3/§6 excerpts, visible attribution and locators; a contemporary reading surface, explicitly no facsimile. | Also viable with clear edition labels, but the object can imply a recovered physical diary or manuscript. |
| Accessibility | Native disclosure, normal document order, keyboard buttons, no gesture requirement; full linear reading survives. | Requires a parallel linear path and careful focus/history behavior through layered pages. |
| Mobile | One reading column. The earlier passage opens immediately above the later one; both can be read normally. | A simulated spread becomes too narrow; a single leaf loses the useful adjacency. |
| Cost/performance | Local CSS, native HTML and existing React state. No font/image/animation dependency. | CSS perspective and stacked pages are possible but add clipping, height and motion complexity without improving the passage comparison. |
| Distinctiveness | A documentary form specific to a text that changes meaning across two nursing passages and later changes narrator. | Risks a familiar digital-book effect whose novelty is stronger than its documentary purpose. |

**Select A.** Its strongest gesture is the return of an earlier passage, not a simulated object. Reject literal page flipping. A geographic-theatre direction was also considered briefly and discarded: city-scale geography cannot recover this prison or clarify these two sentences. Let typography carry the scene and keep the existing mosaic as optional reception history after the account.

## Reference study

Only two contemporary references were inspected; earlier Perpetua research was reused.

- [Emergence Magazine, The Serviceberry](https://emergencemagazine.org/essay/the-serviceberry/): primary essay page read with Firecrawl and opened in Chrome. Broad negative space, a single strong art composition, separate creator credits, and Bradford serif body text at about 22.8px/32px distinguish the sustained reading from the navigation's GT America. Take the separation between reading voice and interface voice, not the artwork, typefaces, layout or article content. Browser screenshots caught its entrance fade and a blank lower reading view; no claim of fully inspected scrolling/motion behavior is made.
- [Rijksmuseum, Closer to Johannes Vermeer](https://www.rijksmuseum.nl/en/stories/themes/vermeer/story/closer-to-johannes-vermeer): primary introduction read and opened in Chrome; dense image-led opening and much quieter text/controls. The institution describes both guided narration and independent exploration. The separate interactive application's first capture was obscured by its cookie prompt; guided playback and zoom were not verified. Take the principle of a clear optional route into detail, not its image montage or motion system.

Reference screenshots and computed-type observations remain in ignored `test-results/perpetua-reference-study/`; no reference-site assets are incorporated into BibleMap. This is an original composition. Official [Next static-export](https://nextjs.org/docs/app/guides/static-exports) and [Server/Client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components) documentation were also read to check the implementation boundary.

## Small visual/interaction concept

See the [composition sketch](../artifacts/perpetua-immersive/concept.svg). This is modern UI typography, not an ancient manuscript reconstruction.

```text
Before                              Selected direction
image          | heading            voice / scene       | earlier §3 (optional)
relationships  | quotation          large scene title   | exact later §6
               | disclosure         source / limits     | request -> refusal
               | next               relationships below | religious explanation
                                    optional later art  | named continuation
```

Local tokens: binding plum `#291c32`, page lilac `#ede8f0`, pale page `#f9f6fa`, text aubergine `#35243f`, marginal ink `#665471`, bronze `#c5ac73`. Keep Playfair for scene headings, use Georgia for sustained source reading and existing Geist for navigation/curatorial notes. No new font request. Left alignment, 42–58ch source lines, 1.6–1.75 leading. No distressed paper, handwriting or fake artifact decoration.

The full §6 paragraph remains readable without an action. A clearly named optional control brings §3 beside it, never changes its words or claims the visitor can undo the separation. A short movement of the reading surface answers that action; reduced motion makes a direct cut. The theological sentence stays with the narrated refusal. Exact translation/correction note and source links remain within reach. No timed advancement, sound or scroll interception.

## Pilot decision

Build separation first. Inspect 1440/390/320px, keyboard, reduced motion, comparison open/closed, history, no-JS, failed media/scripts and source access. Make a substantive screenshot-based refinement. Extend only if the comparison is clearer in the actual browser, the source remains comfortable to read and the interface works without motion. Give the other five scenes distinct documentary rhythms; the final handover must show a different narrator without staging violence. Technical/aesthetic judgment is not evidence of reader engagement; no readers have been observed.
