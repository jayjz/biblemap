# Codex handoff — BibleMap Human Story redesign

Status: archived implementation brief, November 1, 2026. The seed descriptions and development steps below record earlier design inputs, not current work authorization. The [review inventory](human-story-portal-study.md) and [verification record](human-story-verification.md) describe the implemented checkpoint. Development is stopped for human review; no further milestone, merge or deployment is authorized. Preserve the research links below.

## Baseline and active task

- Repository: `jayjz/biblemap`; base: `main`.
- **Active PR:** [#36 Human Story portal](https://github.com/jayjz/biblemap/pull/36), branch `feat/human-story-portal`; route `/human-story/`. This is a first-pass **editorial prototype**, not finished design. Codex should inspect, criticize and replace weak treatments rather than preserve them because they already exist.
- The present `/` is the Nineveh encounter and retains legacy atlas URL compatibility. Existing `/jonah/`, `/explore/`, Exodus, pinned WEB Scripture, evidence and media gates must not regress.
- Implement the redesign **in PR #36** unless the creator requests a different branch. Do not work directly on `main`; do not merge or deploy without explicit follow-on authorization. Do not weaken release gates.

## Review-branch research archive — preserve these exact links

These PRs were design studies rather than approved release features. Their branches and Git history remain available even if the PR discussions are closed.

| PR | Branch | What to reuse critically | What not to copy blindly |
| --- | --- | --- | --- |
| [#11](https://github.com/jayjz/biblemap/pull/11) | `feat/recognition-curiosity-opening` | Real A/B editorial questions and failure cases | Stale route/homepage component; no visitor evidence that B wins |
| [#12](https://github.com/jayjz/biblemap/pull/12) | `docs/jonah-completion-blueprint` | [13-scene matrix and source candidate inventory](https://github.com/jayjz/biblemap/blob/docs/jonah-completion-blueprint/docs/jonah-completion.md); selective composition and 4:11 boundaries | October 10 main snapshot, stale repo audits, broad replacement of README/AGENTS and historic reports |
| [#32](https://github.com/jayjz/biblemap/pull/32) | `feat/jonah-411-human-city` | Named Nineveh people / dated house-sale text, Rashi and Radak comparison, rights ledger | Anachronistic implication that 692 BCE individuals lived in Jonah's audience; CI failed |
| [#33](https://github.com/jayjz/biblemap/pull/33) | `feat/nineveh-four-beat-experience` | Continuous city environment, alternative compositions A/B/C, visual/keyboard testing | Review-only generated panorama as verified architecture, automatic production use |
| [#34](https://github.com/jayjz/biblemap/pull/34) | `feat/reader-mercy-anger` | Strong 3:10 → 4:1 chapter transition, tablet examination, mobile reading order | Its draft review mode; CI failed on its head |
| [#35](https://github.com/jayjz/biblemap/pull/35) | `feat/jonah-human-experience` | [Primary-source matrix](https://github.com/jayjz/biblemap/blob/feat/jonah-human-experience/docs/research/jonah-human-sources.md), [independent study method](https://github.com/jayjz/biblemap/blob/feat/jonah-human-experience/docs/jonah-human-evaluation.md), source/rights lineage, full verification | Treating optional house-sale document as proven better; study was untested with independent readers; #35 includes #34 commits |

The old 13-scene matrix from #12 is **historical research**, not a maintained completion checklist. It contains source candidates and useful critique, but every implementation claim must be revalidated on current `main` first. #35's dossier traces the WEB/Hebrew verse-numbering difference, ORACC/CDLI tablet, Rashi/Radak, Augustine/Aquinas, Qur'anic Yunus, Tacitus and Josephus with separate evidence classifications. Preserve those distinctions when curating.

## Product thesis

Build a **world of connected human stories**, not a five-tab encyclopedia:
- Scripture as primary narrative text and point of entry.
- Named people, place/time, sources, art, reception, traditions and central human questions as interconnected authored layers.
- Invite exploration through immersive narrative scenes and meaningful cross-links. The atlas should be a natural layer, not a detached map widget.
- A biblical editorial worldview may guide selection and interpretation, but should never present a tradition, legend, later opinion, hostile witness or artistic reconstruction as equivalent to Scripture or direct historical proof.
- Show disagreement honestly; date every historical claim, document provenance/licensing and distinguish direct, inferred and disputed connections.

Priority information architecture: **Stories, Witnesses, Saints, Atlas**, with theological/artistic **Voices** woven into story encounters first; add a separate Voices destination only after a real content model justifies it. Saint stories should differentiate early autobiography, near-contemporary record, medieval hagiography and legend. Josephus Antiquities 20.200 (James) differs from the contested Testimonium (18.63–64); Suetonius's Chrestus identification is debated. Do not claim extra-biblical mentions prove the resurrection.

## Design problem for Codex to solve

The seed portal currently uses a CSS sunset field and topical links. It may feel generic and too separate from the existing Nineveh immersion. Critically design a distinctive **editorial exploration system** around the emotional scale of real historical lives and historical sources.

1. Audit current source, routing, tests, PR #36 diff, and screenshots at 320/390/820/1440px.
2. Write 2–3 concrete art-direction alternatives with a justified choice **before coding**. Make the first view substantive without a marketing hero cliché.
3. Prototype the new entrance and navigation without sacrificing current Nineveh, Jonah, Atlas, legacy hash routing or no-JS access. Keep existing routes stable; use a reversible home-swap approach only after comparison.
4. Make the content model independently inspectable: stable story/character/place/source IDs; status and provenance on every connection. Do not scaffold hundreds of empty pages.
5. Implement **one deep, exemplary bridge** rather than many thin teasers: e.g., Jonah 4:11 → historic Nineveh lives → later scholarly disagreement, or a sourced Augustine journey. The current biblical story should remain central.
6. Use visual and narrative media freely with disclosed provenance, licensed rights and historically honest labeling. No automatic museum-only restriction.
7. Verify lint, TS, unit tests, static export, ordinary and review-mode Playwright, keyboard/axe, reduced motion, no-JS, contrast and 320px overflow. Capture before/after for desktop and mobile. Report exact failures, especially preexisting.
8. Leave everything on PR #36 for editorial review. Do not close/merge #36 or deploy.

## Design guidance

Read [Anthropic's official frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) and BibleMap's `AGENTS.md` and `docs/experience-principles.md` before implementing. Consider the requested Apple design engineering, excellent shadows, accessibility, adaptive design and interaction design principles, but **do not bulk-install** unaudited or overlapping skills. Optional [ai-design-check](https://github.com/enmerasoftware/ai-design-check) requires verification of its implementation, license and compatibility before use. Existing repo rules are authoritative.

Don't treat online install counts or social-media slogans as design-quality evidence. Performance, source integrity, editorial coherence and reader comprehension matter more.

## Exit condition

One narrow, reviewable PR with changed-file summary, architecture decisions, screenshot comparisons, source/rights ledger, executed checks and unresolved questions. Judge whether the new portal preserves the specific strength of Nineveh rather than assuming that having more sections is progress.
