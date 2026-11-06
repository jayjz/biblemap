Thomas was absent from the appearance reported in John 20; the new draft encounter follows the text through testimony, a condition, the later gathering, confession and the blessing for those who have not seen. It preserves John 20:24–29 in full and leaves the unrecorded act of touching unstaged.

This PR targets **feat/human-story-consolidated** and remains an editorial prototype. No production promotion, main change or change to PR #41.

## Review the experience

- [Hosted Thomas encounter](https://biblemap-ltlbsy8jl-elliotandersons-projects.vercel.app/human-story/thomas/)
- [Separate Gospel of Thomas doorway](https://biblemap-ltlbsy8jl-elliotandersons-projects.vercel.app/human-story/thomas/sayings/)
- [Complete simple reading](https://biblemap-ltlbsy8jl-elliotandersons-projects.vercel.app/human-story/thomas/reading/)

The tested preview serves runtime commit `e4510b875a5f825c36358516424590a6f8180148`. The final evidence commit strengthens offline quotation checks and adds the verification record without changing rendered application behavior.

## Evidence and creative direction

[Source dossier and 25-claim uncertainty ledger](https://github.com/jayjz/biblemap/blob/feat/thomas-doubt-and-sayings/docs/research/thomas-source-dossier.md), [creative decision record](https://github.com/jayjz/biblemap/blob/feat/thomas-doubt-and-sayings/docs/thomas-creative-direction.md), and [complete verification and limitations](https://github.com/jayjz/biblemap/blob/feat/thomas-doubt-and-sayings/docs/thomas-verification.md).

Three executable, rendered studies compare absence, architectural presence and opposing testimony. The selected original SVG/CSS space has its own visual grammar, distinct from James/Jonah. Native anchors and disclosures provide source exploration, Back/deep links and no-JavaScript reading. No added dependency, remote content service or autoplay audio.

The sayings doorway separates NHC II,2 from P.Oxy. 1, 654 and 655; physical dates from composition; attribution from authorship; and resemblance from dependence/authentication. Only Mattison's rights-cleared saying 26 is compared with WEB Luke 6:41–42. Manuscript photographs are linked, not reproduced. All new art is explicitly modern, AI-assisted symbolic space under the repository license; no historic room, portrait, apparition, wounds or touch is reconstructed.

Desktop and mobile screenshots:

![Thomas desktop opening](https://raw.githubusercontent.com/jayjz/biblemap/feat/thomas-doubt-and-sayings/artifacts/thomas/after/opening-1440.jpg)

![Thomas mobile opening](https://raw.githubusercontent.com/jayjz/biblemap/feat/thomas-doubt-and-sayings/artifacts/thomas/after/opening-390.jpg)

![Thomas confession](https://raw.githubusercontent.com/jayjz/biblemap/feat/thomas-doubt-and-sayings/artifacts/thomas/after/confession-1440.jpg)

Rendered studies, all five movements, the comparison, opened source states, enlarged text, actual before/fix pairs and the James benchmark are retained in `artifacts/thomas/`. Source and rights records are in `src/content/thomas.ts` and retained publisher excerpts.

## Verification

- `npm ci`, lint, TypeScript and static build passed. Existing four lint warnings remain; lockfile unchanged.
- Source/media/export validation passed; 19 WEB verses and saying 26 match retained source excerpts.
- 57 unit tests passed with the built-export check enabled.
- Focused Thomas: 14 local and 14 hosted browser cases passed.
- Full ordinary browser suite: 203 passed, one existing mobile legacy-explorer skip. James/Jonah/Romanus regressions passed.
- 1440/768/390/320 widths, keyboard, touch, Back, deep links, no-JS, reduced motion, 200% text, blocked imagery and overflow checked. Axe scans found no violations in tested states; capture runs reported no console/network errors.

`npm run validate:release` still exits 1 for unchanged Jonah human-approval/unfinished-author-slot requirements. Nothing was waived. Thomas retains draft/noindex safeguards, and human historical, theological, translation, literary and artistic review remains pending. No unfamiliar-reader study, full Coptic/Greek collation or field-performance assessment is claimed. Existing dependency audit issues were not remediated in this scoped prototype.
