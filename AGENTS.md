# Working on BibleMap

BibleMap is a human-authored exploration of biblical stories, the people in them, and what those stories ask of us. Scripture leads. Geography, history, artwork, theological perspectives, and technology help visitors encounter the text; they do not replace it.

## Protect the voice

- The owner writes or explicitly approves final narrative, interpretation, reflection prompts, and visual taste. Leave clear author slots rather than inventing their voice.
- Do not turn reflection into a quiz, prescribe a visitor's personal meaning, or add an AI chatbot without a specific request.
- Never invent scripture, quotation, provenance, historical evidence, dates, routes, or theological consensus.
- Distinguish **scripture**, **historical evidence**, **tradition**, **scholarly inference**, **theological interpretation**, and **artistic reconstruction**. Record disagreement and uncertainty plainly.
- Respect the subject and the reader. No manipulative engagement loops, sensationalism, or false certainty.
- Third-party images, translations, audio, and modern quotations require source and rights review. A public URL is not proof of permission.

## Before changing anything

1. Read the applicable nested `AGENTS.md` files and the documents relevant to the task.
2. Check working tree, active branch, base, and uncommitted work. Preserve the separate unfinished Exodus worktree.
3. Inspect current implementation; verify reported failures. Treat old audit notes as leads, not current facts.
4. Keep changes narrow and reversible. Never merge, deploy, delete branches, or claim editorial approval without authorization.
5. Report what changed, what was verified, what remains unknown, and where human judgment is needed.

Use a task branch. Do not edit `main` directly. Follow the user's explicit permissions for commit/push actions.

## Engineering boundaries

- Preserve the map explorer while developing standalone stories. Keep story text separate from WebGL internals.
- Maintain static export unless a change explicitly requires and justifies another deployment model.
- Keep stable scene IDs, readable source links, keyboard navigation, reduced-motion behavior, and non-WebGL reading.
- Never store, log, or transmit private reflections without a separate, explicit privacy design and approval.
- Avoid unnecessary dependencies, broad refactors, and disabling lint, type, or accessibility checks.
- Changes to scripture or historical claims need source evidence and human review, not only passing tests.

## How to verify

Run checks relevant to the changed files using the actual scripts in `package.json`: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:e2e` for interaction changes. Don't claim a check passed if it was not run. For visual work, inspect desktop and mobile, keyboard and reduced motion, failure states, and the browser console.

`npm run validate:release` intentionally rejects author-review placeholders. **Never weaken that gate merely to obtain a green build.**

For Jonah's current status, content-editing workflow, and known defects, read [docs/jonah-prototype.md](docs/jonah-prototype.md). For changes inside `src/`, `src/content/`, `scripts/`, or `public/media/`, follow the narrower instructions in those directories.

## Guidance for agents

Keep instructions short and specific; don't repeat repo policies in every prompt. Use plans for genuinely multi-step work and small verifiable increments. A skill is appropriate only for a repeated workflow that needs its own instructions or scripts—not as a substitute for understanding the code.

When working with OpenAI APIs or Codex features, consult the current official [developer documentation](https://developers.openai.com/) rather than relying on remembered interfaces.
