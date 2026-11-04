# Visitor export boundary

3 November 2026. Checkpoint 1 on `feat/human-story-portal`. This supersedes the exposure diagnosis in §08, not its editorial decisions. No content is approved by this change.

The baseline export at `8c5b715` exposed `creator narrative`, `creator reflection prompt` and the geography author slots in `jonah/index.html`, `index.txt`, `__next._full.txt` and `__next.jonah/__PAGE__.txt`. These were serialized props even though render conditions suppressed their visible paragraphs. The baseline release command failed with 68 editorial errors.

| Path through the application | Boundary after repair |
| --- | --- |
| Editorial `JONAH` → `/jonah/` Server Component | Validate the complete document, then construct `VisitorStory` using explicit fields. Source slots, written drafts, author identities and review decisions are absent before rendering. |
| Server → `StoryReader` client props → HTML/RSC | Only the projected representation crosses. Author text is a string or null; the reader cannot inspect a private author record. Exact pinned passages, translation notes, references, scene order and deep links survive. |
| Media → reader client props | Evaluate existing gates at the source. Pass image fields, public provenance and render permissions; omit reviewer identity, internal status and editorial rationale. Rights, attribution, source URLs and historical fit still appear in existing disclosures. This is not an image approval bypass. |
| Perpetua source → `PrisonStage` | Explicit `VisitorPrisonScene` projection, omitting draft/review records. Media and translated excerpts render on the server and cross as rendered slots. The client no longer imports the editorial scene array or the source/media catalogues. |
| Human Story reading rooms/home | Reading rooms are Server Components; their complete entry objects do not cross a client boundary. The home explorer already selects its entry and connection fields explicitly. No interview/creator draft is imported by either. |
| HTML, all RSC variants, JS, JSON and alternate routes | `validate:export` reads every recognized generated text artifact. Negative assertions cover real private slots, unpublished interview probes and scene draft metadata globally; reviewer/author metadata is additionally prohibited throughout Jonah artifacts. Positive assertions retain all 48 verses and provisional qualifications in no-JS HTML. |
| Author workspace | Local scripts may project the complete author view. No application route imports that helper. The local review server rejects non-loopback hosts; no public URL, `noindex` or client toggle is treated as access control. |

## Provisional commentary and publication decision

The existing review experience intentionally retains all 13 sourced companions. The introduction states that companion titles, questions and notes are provisional commentary awaiting human review and separate from WEB Scripture. Standalone questions have a short qualification; companion disclosure summaries identify provisional commentary before opening it, with the fuller distinction next to the text. Human Story reading rooms and Perpetua carry a restrained visible review qualification, instead of relying on a buried PR status.

This is a safer **review export**, not a publishable edition. Sourced curatorial drafts already intended for this review remain visible. Unpublished creator responses, unfinished author slots and internal editorial decisions remain source-only. A visitor projection is not proof of review, authenticated approval or historical truth. The unchanged full validator must still reject all 68 current editorial failures. A responsible human must decide the final commentary, translation and publication scope; no status is promoted and no reflection is fabricated.

## Checks

`npm ci` succeeded without lockfile changes. Focused projection/inventory tests passed; the fresh ordinary build and its 402-artifact export gate passed. Typecheck passed; lint retained four existing unused-variable warnings. The browser runs cover Jonah, author workspace, media and Perpetua on desktop/mobile, keyboard, history, reduced motion, no-JS and failed scripts. Exact results are recorded in the checkpoint commit. A first opt-in artifact test intentionally caught an older build's media metadata while a replacement build was still running; the ordered rerun against the completed export passed. Windows worker/browser commands required execution outside the sandbox after `spawn EPERM`; no assertions were disabled.

The scanner checks recognized text/known private wording, not arbitrary compression or future undisclosed fields. The allowlist and mutation tests provide the complementary source boundary. Existing media/source validation still runs before every build. Earlier §08 evidence remains a historical baseline; it must not be read as describing the repaired export.

CI follow-up: checkpoint `a6737e2` passed unit/lint/types/both builds/export checks and 137 browser tests, then failed four desktop/mobile assertions in `first-encounter.spec.ts`: two tests compared the whole curiosity container with the question alone and therefore rejected the added qualification. The correction preserves exact question wording on its paragraph and independently asserts the exact provisional label, including no-JS. All four targeted checks passed locally. This is a test-contract repair, not removal of the qualification or weakening to a substring match.
