# Task 002 — Jonah 1:1–3 first encounter (author-review)

## Creative boundary
The only verified creator-supplied language guiding this pass is the project thesis and the creator's account of being confused when first reading the Bible, wanting to guide newcomers, and being interested in avoidance, responsibility and the challenge of mercy. No first-person confession, narration, personal reflection prompt, or owner approval is inferred. Existing author slots and Jonah 1 WEB text are unchanged.

**Voice guide (inference, not a voice clone):** concise, question-led, concrete; avoid certainty about unexpressed motives, inspirational clichés, performative profundity, fabricated faith testimony, or treating philosophic argument as biblical exegesis. Proposed copy is editorial scaffolding, not author-approved prose.

## UX
The first scene offers a short orientation to Nineveh and permission to read without prerequisites. The second scene offers optional philosophical perspectives only after the verse. Scripture, translation attribution, private reflection, and existing evidence remain present and independent. No automatic passage advancement, narration, animation, or external image fetch is introduced.

## Sources and limits
- **Pascal**: *Pensées*, Brunschvicg 139 / Lafuma 136, W. F. Trotter translation, [Project Gutenberg](https://www.gutenberg.org/cache/epub/18269/pg18269-images.html). Pascal discusses diversion as a response to the difficulty of confronting one's condition; he was not explaining Jonah.
- **Nietzsche**: *Thus Spake Zarathustra*, part I, XVII, *The Way of the Creating One*, Thomas Common translation, [Project Gutenberg](https://www.gutenberg.org/files/1998/1998-h/1998-h.htm). The question of being free *for* something comes in a critique of conformity and self-creation, not a defense of Jonah's obligation or biblical theology.
- **Augustine**: *Confessions* V.2, nineteenth-century NPNF English edition, [New Advent](https://www.newadvent.org/fathers/110105.htm). He explicitly discusses fleeing divine presence, but this section is not a line-by-line exegesis of Jonah.
- Jonah 1:3 describes flight; Jonah 4:2 supplies Jonah's later explanation. Presenting modern avoidance as his definite motive would overstate the text.

This implementation uses attributed summaries, **not direct quotations**. Do not substitute modern translations without permission or contextual review. No rights-cleared artwork or soundtrack was needed.

## GitHub integration
A separate review branch, `integration/jonah-first-experience`, contains the homepage branch's content plus an unchanged copy of the four research Markdown files from PR #2. It is not a merge of PR #2's commit ancestry and does **not** close either PR. The task branch `feat/jonah-first-encounter` descends from that review snapshot. PR #1 and PR #2 remain independent draft submissions; human review decides final integration order. Do not merge anything into `main` from this task automatically.

## Acceptance checks — not executed by GitHub editing
```sh
npm ci
npm run validate:story
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```
Examine rendered /, /explore/, /jonah/, /jonah/#jonah-1-calling and /jonah/#jonah-1-escape at mobile and desktop widths. Check deep-link explorer behavior, keyboard focus, summary disclosure, no-JS chapter reading, and screen-reader labels. Vercel preview success is not a substitute for these checks.

## Human approvals still needed
1. Review whether the introductory sentence correctly represents BibleMap's intended editorial voice.
2. Decide whether all three philosophers belong in the public-facing reader or whether two offer a stronger experience.
3. Write the owner's own narrative and reflection question, separately from this code; neither should be synthesized from earlier conversation.
4. Approve any researched artwork separately only after provenance, file-specific reuse rights, and scene placement are checked.

The reader remains author-review / noindex. Do not promote it to production-ready status yet.
