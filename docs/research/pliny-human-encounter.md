# Pliny: The names he did not write

Research and creative draft, 2026-11-14. Base: `23bf774dbd38b98dd8921d33149ed4485440c223`, verified against GitHub main. Editorial review remains pending. This document records source selection and design decisions, not publication approval.

## Skill use

| Skills actually read | Application |
| --- | --- |
| BibleMap creative direction, discovery | Source-supported continuity: official uncertainty → interrogation → communal practices → two enslaved women → imperial reply → limits of the record. Three medium options considered: reconstructed desk, geographical travel, documentary typography. Typography best preserves the encounter's sparse evidence. |
| BibleMap visual review | Matched baseline and final browser review at desktop, tablet, 390px and 320px; distinguish visual judgment from observed usability and automated correctness. |
| Story Forge + pacing-doctor reference | Every movement changes the reader's knowledge. Expand the women's appearance and aftermath; compress background biography. No fiction, invented psychology, dialogue or therapeutic conclusion. |
| Source integrity audit + evidence contract | Bounded claims, translation comparison, common-source lineage and explicit unknowns below. |
| Frontend app builder + imagegen | Compare two complete typographic/motion studies before implementation, then compare actual browser output with the chosen visual system. Concepts are design references, never historical evidence or shipped source text. |
| React best practices | Server-rendered text; small interaction boundary; no animation-frame React state, new dependencies or runtime retrieval. |
| Camera systems | Viewport framing, restrained transition distance, steady reading planes, immediate cuts when motion is disabled. Engine-specific game controls are inapplicable. |
| Game UI frontend | Protect the narrative's central field; one small orientation rail and optional evidence. No game mechanics or HUD. |
| Frontend testing/debugging | Playwright fallback because Browser plugin/skill is absent; test complete reader flow, native disclosures and keyboard, no-JS and reduced motion. |
| Performance optimization | Budget and profile the static export before accepting motion. Prefer compositor transforms; no WebGL/shaders. |
| Change verifier; Vercel deployments/CI; Firecrawl | Final diff/requirement checks, exact-commit preview inspection, original-source retrieval. |

No skills installed. The four pre-existing untracked skill links remain outside this change.

## Research inputs and source selection

1. Existing `human-story-interiors.ts`, `human-story-witnesses.ts`, `human-story-culture.ts`, `ReadingRoom.tsx`, `InteriorEncounters.tsx`, and Jerome encounter inspected. Existing Melmoth/Bosanquet attribution and reply remain valid. The old Pliny room introduces the officials twice and gives the women one clause inside summary prose. The witnesses world's small comparison remains useful and is retained.
2. [Jesus evidence archive](https://github.com/jayjz/all-historical-evidence-of-jesus-christ), clone at `00f96e5f9df5197225aa405f411ce2aad5cdd136`. Inspected `collections/legal/pliny-trajan-letters-10-96-97.md`, its source metadata, and Eusebius III.33 as a later-reception lead. The Pliny mirror explicitly modifies Firth (1900); its public-domain label does not clear unidentified modifications. Discovery only; no archive text imported.
3. Christian Open Library: public [homepage](https://christianopenlibrary.org/) and [catalogue](https://christianopenlibrary.org/browse.html) inspected through Firecrawl. Catalogue discovery includes patristic material. No authenticated COL tools/session are exposed; no library passage or quote-check operation was executed. Public discovery led to a small later-Christian comparison, checked independently in Tertullian. No corpus ingestion, account creation or runtime dependency.
4. Primary anchors: [Melmoth, revised Bosanquet, Gutenberg 2811](https://www.gutenberg.org/files/2811/2811-h/2811-h.htm), complete letters in the correspondence section XCVII–XCVIII, modern 10.96–97. Historical English text pinned locally; whitespace and source-note removal disclosed. Translation's archaic evaluative language belongs to its Roman speaker.
5. [Latin and Jacques Bailly commentary, University of Vermont](https://www.uvm.edu/~jbailly/commentaries/letters/PlinyX.96and97.html), 10.96.3–8 and 10.97. Compared the short Latin passages with the English. The webpage does not identify its underlying critical edition; do not describe it as a critical edition. Modern commentary linked/paraphrased only.
6. [Georgetown-hosted English comparison](https://faculty.georgetown.edu/jod/texts/pliny.html): translator unnamed on the page; no attribution invented and no wording reproduced. Confirms the stronger explicit execution rendering and the alternative deaconesses rendering. Multiple translations are not independent witnesses to the events.
7. [Tertullian, Apology II.6–9, S. Thelwall translation](https://www.tertullian.org/anf/anf03/anf03-05.htm), translator credited on the page. Later Christian advocacy, used only in a small source-layer paraphrase. CCEL candidate returned a reader shell; no passage verification claimed from that shell. Tertullian's retelling is not corroborating testimony from the women.

## Evidence ledger

Every state concerns the bounded claim that the source says this. It does not independently authenticate the events. Source records in `src/content/pliny.ts` retain locator, edition, evidence class, rights and limits; the fixed English source packet supports exact-excerpt tests.

| ID | Bounded claim | State / fit | Source / locator | Limits and next check |
| --- | --- | --- | --- | --- |
| P1 | Pliny refers doubts to the emperor and asks about age, repentance and the name itself. | SUPPORTED / DIRECT | 10.96.1–2, Melmoth/Bosanquet; Latin comparison | His stated uncertainty does not establish an absence of all prior Roman policy. |
| P2 | He reports repeated questioning, threatened punishment and ordering persistent confessors away for execution. | SUPPORTED / DIRECT, translation-qualified | 10.96.3; `perseverantes duci iussi`; Georgetown explicitly renders executed | Melmoth says punished. State this difference rather than silently putting executed inside that quotation. No execution method, scene or number supplied. |
| P3 | He says Roman citizens were to be sent to Rome. | SUPPORTED / DIRECT | 10.96.4 | The letter reports an order, not a documented arrival or outcome. |
| P4 | An anonymous list names many people; deniers invoke gods, worship the emperor's image with incense/wine and curse Christ; Pliny discharges them. | SUPPORTED / DIRECT | 10.96.5–6 | Distinct reported cases; no invented single trial or compulsory visitor choice. |
| P5 | He relays reported meetings before dawn, address to Christ, commitments against wrongdoing and a common meal. | SUPPORTED / DIRECT | 10.96.7 | Report within interrogation, not a recording, independent community account, or verified musical performance. |
| P6 | Pliny says he used torture on two enslaved women called ministrae. | SUPPORTED / DIRECT | 10.96.8; `ex duabus ancillis, quae ministrae dicebantur`, `per tormenta` | Exact role and duties are not explained. Ministers/deaconesses are translation choices; no institutional ordination claim. |
| P7 | These letters do not give either woman's name, words or subsequent fate. | SUPPORTED / DIRECT, bounded textual absence | Complete 10.96–97 inspected | Does not mean they had no names, no voice or no life outside the text. No inferred deaths, resistance, recantation, ages, ethnicity, relationships or likenesses. |
| P8 | Pliny says he adjourns proceedings and consults Trajan. | SUPPORTED / DIRECT | 10.96.9 | The letter's narrative order is not a reconstructed day-by-day chronology. |
| P9 | Trajan approves Pliny's course, rejects a universal rule, prohibits seeking Christians out, retains punishment if accused/proved, permits pardon demonstrated by worship of Roman gods, and rejects anonymous accusations. | SUPPORTED / DIRECT | Complete 10.97 | Hold restrictions and punishment together; neither toleration nor universal empire-wide enforcement inferred. |
| P10 | Tertullian criticizes the combination of no search and continued punishment. | SUPPORTED / DIRECT | Apology II.6–9 | Later Christian polemic based on the exchange, not a second account from its accused. |
| P11 | Procedure makes a person's reported religious identification consequential to life and release. | INFERRED / CONTEXT | Editorial reading of P2–P4 and P9 | Label connective prose as editorial in source layer; no invented conscience, motives or emotions. Human review pending. |
| P12 | Cinematic framing will deepen human comprehension. | UNRESOLVED | Design hypothesis | Browser review establishes presentation/behavior only. Observe unbriefed readers explaining the officials, women, reply and missing testimony. |

Lineage: transmitted Roman letters → historical English translation / Latin presentation / Georgetown English comparison. These are one ancient record family. Roman exchange → Tertullian's later Christian argument → Thelwall translation. Archive mirrors and COL catalogue are discovery surfaces, not independent attestation. Original HTML/CSS composition is creative interpretation, not an artifact facsimile.

## Two treatments and decision

**A · The moving dossier.** Paper planes shift in depth as the frame tightens from administrative overview to a sentence. Strength: a tangible sense of a document with consequences. Risk: pseudo-artifact surface and constant tilting can make the evidence feel reconstructed, and can burden mobile reading.

**B · The divided record.** Official typography occupies ordered fields; visual space changes as consequence becomes legible. The women receive a sustained, open field and a sentence isolated from the administrative flow. The reply divides restraint from continuing punishment, then reunites them in one complete ruling. Strength: the absence belongs to the composition without inventing a body or courtroom. Risk: abstract type needs sufficient physical scale and variation to feel cinematic.

Selected treatment and final visual-review evidence are recorded in `docs/pliny-human-encounter.md`. Image concepts contain provisional mockup wording; only verified source packet text and sourced editorial prose may enter implementation. No imagegen typography is a historical quotation authority.
