# Evaluation and next decision

Research checkpoint, 1 November 2026. No participant sessions have been conducted and no responses, quotations, emotional effects or success rates are invented. Codex's [live critique](01-current-state-critique.md) is expert interpretation; [the creator's actual response](03-creator-voice-and-interview.md) is author material, not an unfamiliar-reader result.

## Recommendation

Review [the eight-movement treatment](04-narrative-treatment-v2.md) and the single [separation proof](perpetua-separation-proof.html) with the creator and a qualified historical editor, then conduct the focused comparison below. A is the present artistic recommendation. Its argument is source language plus a meaningful comparison; the empirical benefit remains untested. B and C remain [storyboards](05-artistic-directions.md).

Do not replace the route yet. First settle the final translation, the visible authorship wording, the intended inference and placement of the supplied creator reflection, and the reader study's findings. The other four interview areas need actual responses if the creator wants notes there. No additional design or implementation cycle is launched by this checkpoint.

## Method and scope

The study adapts the participant/task/facilitator model in Kate Moran's [*Usability Testing 101*](https://www.nngroup.com/articles/usability-testing-101/) (2019; reviewed July 2026) and the practical think-aloud method and bias limitations in Jakob Nielsen's [*Thinking Aloud*](https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/) (2012). Both supplied articles were read. They support realistic tasks, observation and neutral facilitation; they do not validate this particular narrative or measure emotional engagement for us.

Use two related but distinct sessions. **The focused comparison can run on the existing prototype:** it evaluates separation and source use only. **The complete-encounter study is a protocol for a later approved implementation:** the current single-scene proof cannot establish the quality of an eight-movement encounter. Storyboard read-throughs may inform discussion but must not be reported as equivalent to using a finished site.

Recruit an initial eight unfamiliar adults, four per first-exposure condition, as a practical qualitative round, not a statistically powered sample. Include a spread of biblical/Christian familiarity and nonreligious readers rather than assuming one background; record prior knowledge of Perpetua. Balance phone/desktop across conditions. Include keyboard-only and screen-reader users through purposive recruitment, offering their own familiar technology. If that coverage cannot be achieved in eight, report the gap and recruit additional sessions rather than claiming it. Do not use the creator, project team or briefed reviewers as substitutes for unfamiliar readers.

Explain that the material involves imprisonment, religious persecution, childbirth and death; participants may skip or stop without explanation or penalty. Obtain consent for recording and quotation; assign participant codes and keep identifiable recordings private. Do not require a disclosure of personal grief, family conflict or religious belief. Use a neutral facilitator and a separate observer when possible; the designer should not defend the treatment during a session.

## Focused comparison runnable now

**Baseline A:** the current encounter, frozen at `dbcafa9` for local use, beginning at `#perpetua-tribunal` with The child available for context. The inspected preview's unchanged copy is an alternative only if its `38613d5` deployment remains fixed; label that version and exclude its superseded history-focus behavior from narrative conclusions. **Proposal B:** the isolated HTML proof, frozen by content hash at the study's start. Give both groups the same short neutral orientation: “The account places Perpetua, a Christian mother, in custody. It reports her condemnation before this passage.” This is facilitator orientation, not an additional historical claim of independent verification.

Assignment is between participants for the first exposure; do not teach one version by giving everyone the other first. Match prior familiarity/device as far as practical, then randomly assign within those pairs. Keep source access and available reading time comparable. Record the difference in content density: B contains translated excerpts where A contains summaries. The study evaluates that combined treatment; it cannot isolate the causal effect of typography, wording or the disclosure alone.

1. **Unprompted encounter.** “Read and explore this part of the account as you normally would. You can stop whenever you wish.” First allow a quiet reading period. Then invite the person to say what they are noticing as they use controls. Do not ask for a running monologue during every sentence of a literary passage. Record the quiet/think-aloud boundaries so these conditions can be repeated.
2. **Recall before instruction.** Hide the page briefly: “Tell me what happened in what you just read. What, if anything, stayed with you?” Then: “Whose words or account were you reading?” Preserve their wording. Do not correct attribution or suggest mother, faith, grief or relief as the intended answer.
3. **Voluntary continuation.** Restore the page: “You can finish here, or continue using it as you wish.” Observe whether they reopen the earlier passage, investigate an edition, ask another question or stop. Only actions before a directed source task count as voluntary investigation. Do not tell B participants to find the comparison control or A participants to open every relationship.
4. **Historical literacy.** “What do you think this account lets us know? Is there anything you would want to check before treating it as history?” Follow with “What did the account say about the child after the request?” Accept an accurate account of what the text claims without requiring a participant to endorse or deny its theology.
5. **Directed source task.** “Choose one statement you read and show where you would check it.” This measures source-finding usability, not spontaneous engagement. Ask for evidence of the chosen claim, not a scavenger hunt for a particular label. Record assistance exactly.
6. **Comparison task.** For B, after voluntary behavior is recorded, ask “Can you find the earlier account of the child staying with her, and return to the later passage?” For A, ask the equivalent return to The child and then The separation. This is a usability comparison of finding context, not a count of identical clicks. Observe whether returning loses the thread.
7. **Delayed recall.** After a short unrelated activity in the same session, ask again what particular detail or tension remains. An optional next-day follow-up can repeat the free-recall question with separate consent. Do not turn a participant's distress into evidence that the design worked.

Use neutral follow-ups such as “What led you to that?” or “What are you looking for?” Mark any prompt that names a missing detail as an intervention. Give factual corrections only after the observations are complete. Think-aloud can change reading and self-presentation; report that limitation. Time is useful for diagnosing stalled navigation, not as a proxy for emotional depth.

## Five outcomes, kept separate

| Dimension | Observable evidence and question | Interpretation rule |
| --- | --- | --- |
| Comprehension | Explains request, father's refusal and attributed religious explanation; identifies the speaking position | Code each item 0 absent/incorrect, 1 partial, 2 accurate, with a supporting utterance. Do not award understanding merely because the words were visible. |
| Historical literacy | Distinguishes the work's claims, attributed authorship, later fate not supplied and unverified causation | A religious belief is not an error. Conflating textual report with independent attestation is. Preserve uncertainty without rewarding rehearsed skepticism. |
| Engagement | Voluntarily opens a relevant passage/source or pursues a person/question before being directed | Record concrete action and stated reason, if any. A click alone is ambiguous; choosing to stop is valid data. Separate source exploration, rereading and confusion. |
| Narrative quality | Unprompted and delayed recall of a particular action, relationship, phrase or unresolved tension | Retain verbatim descriptions, including indifference, irritation or disagreement. Remembering the interface alone counts against the artistic aim. Do not score the intensity of grief or piety. |
| Usability | Finds context/source, closes/reopens disclosure, returns to the relevant passage with keyboard or own assistive tech | Record independent success, assistance, failure and exact friction. Accessibility-tree/axe results do not replace the participant's experience. |

## Complete-encounter comparison, after an approved build

Give fresh, unbriefed readers the existing portal entrance or the proposed entrance, balanced by device and familiarity. Observe entry, first continuation and early exit before giving tasks. After self-directed reading ask for an account of the people and changing stakes. Then ask whose voice represents Felicity, what Saturus contributes, how a reported vision differs from the later narrator's ending, and how they would inspect one claim. Ask what moment stayed with them before naming the offered hand, the father or the child.

Keep current and proposed encounters frozen and identify every wording change. Use fresh first-exposure cohorts for comprehension. A later counterbalanced crossover may compare navigation or preferences, but prior reading contaminates recall and historical-literacy results. Do not call a preference for one layout proof that it produces a stronger encounter.

## Recording and deciding

Use this empty record for each session; it is a template, not collected data:

| Field | Record |
| --- | --- |
| Participant / prior familiarity / device and assistive tech | |
| Condition / commit or content hash / date / facilitator | |
| Task / timestamp / exact action / page or passage | |
| Verbatim words, with consent / observation versus inference | |
| Prompt/intervention / independent or assisted result | |
| Comprehension items / historical-literacy items / rationale | |
| Voluntary source or context action before directed task | |
| Immediate and delayed specific recall / stop or exit | |
| Error, access barrier, contradictory evidence / next issue | |

The observer logs actions and words before writing interpretations. A second reviewer independently codes attribution and historical-literacy errors, then resolves disagreements against the recording; if unavailable, explicitly mark single-reviewer coding. Keep individual cases alongside any counts and denominators. Do not publish significance tests or general population claims from this small round.

Predeclare the consequential decision rules: repeated mistaken attribution or an implication that the child died/reunited requires revision before route integration. A keyboard/screen-reader blocker stops that candidate's usability approval. If B readers cannot explain a change between §§3 and 6, the comparison has not earned its control. If readers understand both versions equally but the static passage needs less assistance and stays with them as specifically, prefer the simpler form. If outcomes are mixed by background, keep that difference visible; do not average away a misunderstanding.

## What exists at this checkpoint

Completed: six editorial documents, three sharply different source-bound storyboards, one native-HTML separation proof, and a bounded set of browser evidence. The authentic interview response is preserved without rewriting. Muehlberger's full text has been read; Burrus's body and Heffernan's critical apparatus remain unavailable. The eight-movement encounter, creator notes and directions B/C are **proposed only**.

The proof changes no Next.js route, application source, package/lockfile, Scripture, provenance graph, media manifest or Vercel configuration. It is outside `public/`, imports no application code and contains no JavaScript. Existing deep links and production behavior are untouched. It is a documentation prototype, not a deployed product. No new production dependency was added. A temporary `pypdf` reader was installed only in ignored `test-results/perpetua-editorial/python` to read the public research PDF; it is not committed or imported by the project.

## Verification record

Application lint/build/unit/full browser suites are not rerun for documentation and native-HTML-only changes; they cannot validate the new editorial claims, and the application runtime is unchanged. The existing baseline verification remains explicitly prior evidence. No prior pass is presented as a fresh pass. If a subsequent task integrates this into application runtime code, the complete applicable regression suite is required before its push.

| Executed check | Result and retained evidence |
| --- | --- |
| `node test-results/perpetua-editorial-observe.cjs` | Exit 0 against the six supplied live URLs, 200 responses, zero page/console errors, failed requests or HTTP errors. All scenes traversed; selected controls and disclosure used. Three current-state screenshots and a [compact observation record](evidence/current-observation.json) retained; this is an editorial tour, not full regression testing. |
| `node test-results/perpetua-editorial-verify.cjs` | Exit 0. Proof at 1440, 390 and 320px: closed and expanded axe scans each return zero violations; skip link, Enter/Space toggling, retained summary focus and source disclosure pass. Tested target height 49.59px; visible outline; no horizontal overflow. 200% text at 640px, reduced motion (zero animations), no-JS and offline reading pass. Zero console/page errors, failed requests or HTTP requests. [Focused result](evidence/proof-verification.json). |
| `python test-results/perpetua-editorial/document-check.py` | Exit 0: 41 local links resolve; 16 treatment excerpts and two proof block quotations match the selected translation after whitespace/quotation normalization and the disclosed `no [longer]` correction. Interview response matches verbatim. Proof contains zero scripts/remote resources. [Document result](evidence/document-verification.json). |
| Actual screenshot review | [Desktop proof](evidence/proof-desktop-closed.png) and [mobile comparison](evidence/proof-mobile-comparison.png) inspected alongside the three [current-state captures](01-current-state-critique.md). The paragraph stays readable and source/curatorial type are distinct; the mobile comparison adds reading length rather than a diagram before the source. This is design review, not measured reader preference. |
| `git diff --check` and bounded file-scope review | Whitespace check passes. Only `docs/editorial/` is included in this task's change. `next-env.d.ts` retains SHA-256 `4e4da12aa061aac172fb1bcb48e9b6e4b293080d2f494327925fdba8f39632ac`; original untracked directories are preserved. |

The initial Chrome launches were blocked by sandbox `EPERM`; approved reruns succeeded. One initial proof run stopped because the axe harness used `browser.newPage()`; switching the scratch harness to an explicit browser context resolved it. No product code, accessibility assertion or browser check was weakened. The inspection, verification and document-check commands use ignored local scratch helpers; the durable results and inspected proof are committed here. Researchers can open the HTML directly, tab through both native disclosures and run the installed axe/Playwright tools against that same file; there is no server setup or build requirement.

**Baseline CI update, inspected before this commit:** [run 41355400864](https://github.com/jayjz/biblemap/actions/runs/41355400864), confirmed by `gh run view` to have head SHA `dbcafa918123d90665f5f265195caa036aa5f676`, finished with one browser failure. The mobile homepage test at `tests/homepage.spec.ts:36` uses an unscoped exact `Continue` link locator that resolved to 12 links in that run. Browser totals were 102 passed, one failed, one skipped; the later Nineveh review-server step was skipped after that failure. Install, source validation, unit tests, lint, typecheck and both build steps succeeded in that **remote baseline run**. Logs and the unchanged local locator were inspected read-only; its timing/root cause and reproducibility were not investigated further here. This is a documented pre-existing CI failure, not a passing baseline or a failure introduced by these documents. Leave the runtime/test correction to a separate task.

The proof's relevant checks are real-browser rendering at desktop/mobile/320px, native keyboard operation and focus, closed/open axe checks, enlarged text, reduced-motion behavior, no-JS/offline access, errors/requests and exact quotation comparison. Native HTML has no asynchronous loading, selection fetch or empty dataset: its source is present at initial parse, expanded/collapsed state is browser-owned, and failed/absent JavaScript cannot remove the text. External edition links remain optional and can fail without breaking reading. Human screen-reader and physical-device sessions remain outstanding.

## Remaining uncertainty and next decision

Historical: personal authorship, composition context and exact dating; final translation and textual variants; unrecorded child/family outcomes; no independently verified prison appearance; Felicity's legal context unresearched. Artistic: whether comparison deepens understanding or simply adds a control; whether eight movements sustain attention. Authorial: the creator's meaning of “lie,” the supplied reflection's placement, and the four unanswered interview areas. Empirical: all unfamiliar-reader outcomes are still unknown.

The next decision belongs to the creator: whether this source-led direction and its historical framing merit an edited full-encounter candidate and reader study. This checkpoint recommends that bounded review. It authorizes no merge, deployment, PR closure or further autonomous cycle.
