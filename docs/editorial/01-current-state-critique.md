# Perpetua: five narrative failures

Observed 1 November 2026. This is an editorial assessment by Codex, not a participant study or evidence of anyone else's emotional response. Read alongside the [source dossier](02-primary-source-dossier.md), [voice interview](03-creator-voice-and-interview.md), [treatment](04-narrative-treatment-v2.md), [concepts](05-artistic-directions.md) and [evaluation plan](06-evaluation-and-recommendation.md).

## What was independently inspected

Local HEAD and remote branch both began at `dbcafa918123d90665f5f265195caa036aa5f676`, on `feat/human-story-portal`. GitHub reported PR #36 OPEN and draft, with the technical/browser check running at the initial inspection. Vercel's read-only deployment record identified `dpl_6YQFHwFbeyfviHZ6UhcG6AMy43P5` as READY, serving `38613d51b52f44158caad828a85f02cca0ff571d` from that branch. These are metadata observations, not a SHA inferred from page appearance.

The difference between preview and local baseline consists of history-focus handling, removal of an unused style reference, its regression assertions, and cleanup documentation. The encounter's narrative content and composition are unchanged between those commits. No preview history-focus behavior is reported here as a current local defect.

Using Playwright with installed Chrome, I read the live [portal](https://biblemap-77tu3jrrw-elliotandersons-projects.vercel.app/human-story/), [Saints](https://biblemap-77tu3jrrw-elliotandersons-projects.vercel.app/human-story/worlds/saints/), [Witnesses](https://biblemap-77tu3jrrw-elliotandersons-projects.vercel.app/human-story/worlds/witnesses/) and [Perpetua](https://biblemap-77tu3jrrw-elliotandersons-projects.vercel.app/human-story/perpetua/) pages. In Perpetua I followed each Continue link, changed all opening relationships, selected father and interpretation in the separation, opened its passage disclosure, and read all scenes together. I also inspected the mobile separation at 390×844, then the [production entrance](https://biblemap-pink.vercel.app/) and [Jonah](https://biblemap-pink.vercel.app/jonah/). This combined actual page interaction, rendered screenshot inspection and code comparison; it was not a DOM-only audit. I had read the repository first, so this cannot substitute for an unfamiliar human reader's response.

All six supplied URLs returned 200. The tour recorded zero page/console errors, failed requests or HTTP errors. Mobile separation had no horizontal overflow. Those bounded observations are not a renewed regression certification. Only three screenshots are retained: [opening](evidence/current-opening-desktop.png), [separation with evidence](evidence/current-separation-desktop.png), [mobile separation](evidence/current-separation-mobile.png).

## 1. The source is continually described but never allowed to speak

The opening says, “Her account keeps returning to someone else: her nursing child.” This is the curator identifying a motif before the reader encounters any of the account's language. Every scene uses third-person editorial summaries. Opening **Inspect this passage** yields another summary; historical language remains an external trip to Fordham. `PrisonStage.tsx:106` explicitly confirms that historical speech is not quoted.

This is the most consequential failure. The design promises access to a person but delivers a report about access. The attributed account's fear, changes of tense, direct refusals, family appeals and religious confidence all acquire the same explanatory distance. The problem is not a shortage of emotion words. It is that the reader cannot hear enough difference between the ancient narrative and the site's narrator.

Evidence: [`perpetua-encounter.ts:35`](../../src/content/perpetua-encounter.ts#L35), [`PrisonStage.tsx:106`](../../src/features/human-story/PrisonStage.tsx#L106); opening screenshot.

## 2. The separation turns into a lesson about evidence at its decisive turn

Immediately after the father refuses the child, the foreground says: “The separation and the meaning she finds in it are different kinds of claim.” Selecting **Her interpretation** repeats the explanation of divine causation. Opening the evidence repeats the refusal, nursing relief, God's will and missing later story. On mobile, the methodological sentence is prominent before the large diagram and controls.

The distinction is necessary, but its placement substitutes a category for the passage's difficult religious assertion. The child first stays with her and later does not; the account describes relief in both situations. The reader needs to confront that change before being told how the claims differ. Preserve the religious wording and attribution. Move the longer methodological explanation into one source note.

Evidence: [`perpetua-encounter.ts:122`](../../src/content/perpetua-encounter.ts#L122), separation screenshots; primary §§3, 6 in the dossier.

## 3. Several relationship choices deliver an absence already explained

In the hearing, **Her child** says we are told how others invoke him rather than what he understands. In the separation, **Her father** says: “The text does not give a fresh explanation in his own voice; we cannot supply one.” This follows the already visible refusal. These clicks do not uncover an additional event, a substantial passage or a consequential contrast. The highlight shifts, but the selected person does not acquire a new documentary presence.

There are exceptions: **The deacons** supplies names and the money used to obtain a respite; **Her family** supplies mother/brother care. Keep that distinction in the diagnosis. The repeated relationship template, however, obliges even thin material to become a control. A relationship worth following should take the reader to actual language or a change they could not already see.

Evidence: [`perpetua-encounter.ts:107`](../../src/content/perpetua-encounter.ts#L107), [`perpetua-encounter.ts:143`](../../src/content/perpetua-encounter.ts#L143), [`PrisonStage.tsx:59`](../../src/features/human-story/PrisonStage.tsx#L59). `PrisonDiagram.tsx:12–15` changes the separation geometry by scene; relationship selection chiefly chooses emphasis. This is a narrative-value criticism, not a broken-control report.

## 4. Compression removes the father's changing relationship and the approaching outcome

“Her father asks her to consider her family” compresses §5's bodily appeal: hands that raised her, kisses on her hands, falling at her feet, addressing her as Lady. The next paragraph compresses confession, sentence and her sorrow when he is struck. The current text correctly resists making him a villain, but says so in commentary instead of letting the difficult combination of appeal, violence, attachment and refusal become perceptible.

The preceding §4 vision and its shared interpretation are relegated to an optional observation in a later scene. The reader reaches the hearing without knowing how the attributed account has already changed its expectation of survival. **Continue: The hearing** names a topic; it does not carry forward a newly sharpened question. The father's return in §9 is absent. The refusal therefore looks like the end of a family relationship that the text continues to narrate.

Evidence: [`perpetua-encounter.ts:74`](../../src/content/perpetua-encounter.ts#L74), `tribunal.text`, `vision.relationships[earlier]`; source §§3–6, 9. The remedy is selective scene space, not invented dialogue or longer explanations of his motives.

## 5. Distinct people and speaking positions end in the same solemn composition

“Another mother. Another voice.” is followed by two summary paragraphs and a relationship diagram structurally like the others. Felicity's represented fear of being left behind and her answer during childbirth are absent from the foreground. Saturus's distinct account is named in evidence but never experienced. The last scene says, “A different voice has brought us here,” then ends with a general question about voice survival.

The same text/diagram/controls/disclosure/Continue rhythm makes a vision, childbirth and another narrator's description of death feel like equivalent information panels. Repeated phrases about accounts, voices and what the interface must not do create mechanical solemnity. The ending omits the particular gesture of Perpetua raising Felicity (§20), which could leave the reader remembering these two women together. No graphic reenactment is needed to retain it.

Evidence: [`perpetua-encounter.ts:208`](../../src/content/perpetua-encounter.ts#L208), [`perpetua-encounter.ts:251`](../../src/content/perpetua-encounter.ts#L251), [`PrisonStage.tsx:42`](../../src/features/human-story/PrisonStage.tsx#L42). In the vision, “One must not quietly become footage of the other” addresses a production risk rather than the person reading the passage (`perpetua-encounter.ts:165`).

## Direction of change

| Before | Proposed treatment | Why |
| --- | --- | --- |
| Summary followed by a summary disclosure | Attributed translated passage, with concise separate curatorial note | Give the reader language on which to form a judgment |
| A source limitation at each emotional turn | One visible speaker/section label; fuller limits on request | Keep boundaries available without continually replacing the encounter |
| A relationship control for every person | A control only for a substantive passage or comparison | Make the reader's action change understanding |
| One composition for all six scenes | Writing, juxtaposition and explicit changes of speaking position as the passage requires | Let narrative form vary with the surviving work |

Production comparison is limited: Jonah places the primary biblical text directly in its reading stage, while Perpetua paraphrases its entire stage. That is a useful formal contrast, not proof that Jonah's voice or visitor response is already successful. No homepage or Jonah revision is proposed here.
