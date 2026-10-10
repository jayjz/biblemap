# BibleMap Editorial Content Instructions

These instructions extend the repository-root and `src/AGENTS.md` files for work under `src/content/` and `src/domain/historical-context.ts`.

## Purpose

`src/content` holds authored, reviewable historical and narrative copy. It is not generated at runtime. It is not a CMS. It must remain deterministic and auditable in source control.

## Rules

1. Scripture is primary. Historical context illuminates the biblical scene; it does not replace it.
2. Never invent a date, quotation, archaeological conclusion, population figure, border, language map, travel time, or source citation.
3. Every shipped historical claim must carry a source ID that another human can follow.
4. Distinguish explicitly between biblical text, contemporary extra-biblical text, archaeological evidence, traditional identification, scholarly inference, and disputed matters.
5. Sparse, relevant context is better than padded encyclopedic copy.
6. Do not flatten peoples into villains, backdrops, or single traits.
7. Do not present Ussher chronology, or any other single chronology, as uncontested history.
8. Later artwork is reception history. Do not treat it as evidence of an ancient event.
9. No runtime LLM or network fetch may author historical claims.
10. Review status `approved` is required before a context record may render in production.
