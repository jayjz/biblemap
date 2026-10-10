# Jonah homepage question entry — proposal (not implemented)

**Status:** creative proposal for human review, 2026-10-10. The current deployed homepage offers a single Jonah entry. This proposal does not assert implementation, editorial approval, or user research outcomes.

## Human experience

A visitor who has never opened Jonah sees a few inviting human questions and chooses one out of curiosity. There is no correct answer, diagnosis, submission, or religious prerequisite. Their selection gently changes a short invitation into the **same story from Jonah 1:1**. Visitors may skip choosing entirely.

The choice should offer recognition without trapping a visitor inside a predetermined reading. Jonah 4:2 complicates a simplistic framing of flight; the final question in 4:11 should remain unresolved.

## Example question doors (draft only)

- What are we running from?
- When do our choices affect people around us?
- Can someone deserve judgment and still receive mercy?

These are prompts to evaluate for tone and spoiler risk—not final approved homepage copy. In particular, avoid explaining Jonah's stated objection in chapter four before readers reach it.

## Two patterns to compare

1. **One selected question, one short invitation, common opening (preferred to prototype):** Accessible radio-group or equivalent. Selection changes a small nearby passage of editorial copy; the primary CTA always enters Jonah at 1:1. No URL-based personalization required in V1.
2. **Direct scene jumps:** More immediate but risks spoiling narrative progression and breaking the recognition-to-reversal structure. Do not make this the default without creator approval.

Prefer the first option for a bounded test. Three choices may be enough, but quantity and wording should be assessed with actual readers, not declared optimal.

## Safety and experience constraints

- No account, answer collection, analytics attached to selections, stored personality label, or persistent personal data.
- Selection optional; keyboard and screen-reader accessible; clear selected state; no quiz scoring or forced multi-step onboarding.
- Respect reduced motion. Keep the homepage's existing visual identity and preserve static export.
- Do not change Scripture, 13-scene sequence, museum rights gates, or the unfinished Exodus work.
- Human-authored final copy requires creator review.

## Proposed next task

Implement a **homepage-only prototype**, compare desktop/mobile and no-selection paths, then observe whether first-time readers feel invited rather than examined. Treat answers to feedback questions as qualitative evidence, not a conversion metric.

**Reference baseline:** `feat/jonah-visual-assets` commit `0131398e664be7432ca49256522a8f4b8e166520`; [recognition opening record](jonah-recognition-opening.md). The earlier [question-led homepage task note](question-led-homepage.md) reflects its original chapter-one scope.
