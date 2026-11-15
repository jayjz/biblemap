# One editorial selection

The creator's machine-readable, typed manifest is [home-curation.ts](../../src/content/home-curation.ts): hero **Pliny**, then featured **Perpetua, Jonah, Thomas**; discovery **all visitor-eligible**. The generated JSON inventory includes the same curation for consumers that do not parse TypeScript. There is no alternative featured array, automatic maturity ranking, date sorting, CMS or runtime API.

[home-catalog.ts](../../src/content/home-catalog.ts) registers destination metadata independently. Graph records require eligible entry **and** route scope. Standalone Thomas and Lachish require eligible route scope; they do not acquire fictional graph entries. `complete` and `provisional` are existing visitor eligibility states, never homepage approval or production authorization. Missing scope fails closed. Scope and creator publication decisions are unchanged.

[selectHomepage](../../src/domain/home-curation.ts) validates local canonical route syntax, unique catalog IDs, unique editorial selections, existing IDs, publication eligibility and route availability. Selected omissions throw explicit build errors, including a missing Thomas route. It checks all eligible discovery routes too. The server adapter inspects actual App Router route modules and the visitor graph's static parameters. Renderers also fail if a selected entry lacks its editorial invitation or visual treatment. No substitution is possible.

Order is hero → featured in manifest order → remaining eligible catalog records in their original stable order. Initial interactive discovery shows six entries, with an explicit browse-all control and search. This subset is not another editorial feature list. Without JavaScript, every eligible entry is server-rendered and available. Existing connection previews show only selected visitor graph edges; Thomas has none.

`RootEntrance` is unchanged. Recognized legacy root fragments and queries still enter Nineveh or the Atlas and preserve Back/Forward behavior. Ordinary root traffic and `/human-story/` share the same homepage. SEO canonical aliasing and no-index policy are unchanged. Historical encounters are unchanged.

Tests cover unknown IDs, duplicates, missing and blocked destinations, entry and route authorization, new registrations, maturity changes, inclusion of every eligible graph entry, standalone registration, deterministic order, source IDs and V4 integration. Browser tests follow the V4 hero, supporting entrances, discovery, source disclosures and no-JavaScript links.
