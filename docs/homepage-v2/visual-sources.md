# Visual and editorial provenance

No new third-party asset was downloaded, no artwork was generated, and no original encounter was rewritten. Existing local files and rights records supply the homepage. Captions preserve creation dates and representation limits. Each figure has a keyboard-accessible native provenance disclosure with creator, institution, rights, source link and historical fit; attribution survives image failure.

| Placement | Exact existing record | Rights and limitation |
| --- | --- | --- |
| Pliny opening | [Pliny V4 manifest](../../public/media/pliny-v4/manifest.json), `pliny-manuscript`; Morgan MS M.462, fol. 48r; 600/1200px WebP | [Morgan catalog](https://www.themorgan.org/manuscript/110821), [1922 facsimile, plate I](https://archive.org/details/sixthcenturyfrag00lowe/page/n80/mode/1up). Public-domain US publication, from the verified 1922 plate, not modern Morgan photography. Manuscript ca. 490–499, Books II–III, **not** the letters read in the encounter or Pliny's handwriting. Full plate preserved; no artificial patina, tint or crop. Existing manifest records exact derivative hashes. |
| Perpetua | [Interior media registry](../../src/content/human-story-interior-media.json), `perpetua-mosaic`, 450×600 | [Exhibit record](https://perpetua-felicitas.carrieschroeder.org/items/show/40); [photograph and license](https://commons.wikimedia.org/wiki/File:213_Bas%C3%ADlica_de_Montserrat,_escala_de_les_Santes,_mosaic_de_Santa_Perp%C3%A8tua.JPG). Enric, photograph 4 January 2015, CC BY-SA 3.0; local resized WebP retains the full composition and same license. Montserrat devotional mosaic, artist/date unknown; no historical likeness or prison identification. |
| Jonah | `/media/nineveh-depth/jonah-vine.webp`, reused from the prior homepage; [depth validator](../../scripts/validate-nineveh-depth.mjs) and [asset dossier](../../public/media/nineveh-depth/README.md) | [Cleveland Museum of Art, 1965.239](https://www.clevelandart.org/art/1965.239), public domain / CC0. Sculpture 280–290 CE; later Christian reception of Jonah, not corroboration, a portrait or a narrative date. Full composition on neutral ground. |
| Thomas | [Existing Thomas manifest](../../public/media/thomas/manifest.json), `proximity-768` / `proximity-1536` | Existing BibleMap / OpenAI generated interpretive artwork, 2026. Creator-directed original output without third-party reference images; project distribution terms and generation prompt in the manifest. Anonymous invented figures, architecture and clothing; no biblical identities or event reconstructed. The first caption visibly discloses AI generation. Reuse maintains the encounter's identity; no new generated asset or new historical-evidence claim. |

The local media adapter selects records from these registries. New image state is limited to failure handling; responsive sources select the existing derivatives. Only the manuscript is eager/high priority. Other imagery is lazy. No remote image or source request is necessary to enter or read the homepage.

Homepage copy is explicitly a sourced **AI-authored editorial draft** in [home-editorial.ts](../../src/content/home-editorial.ts), not a quotation, a creator voice or a claim of human approval. Its source IDs trace to existing records:

- Pliny: `pliny-household` (8.16), `pliny-encounter-melmoth` (10.96–97). Household and proceedings are distinct letters; no psychological cause is supplied.
- Perpetua: `passion-perpetua`, Passion §§3–6. First-person account and composite editorial work remain distinct; no invented thought or voice for Felicity.
- Jonah: `web-jonah`, pinned World English Bible, chapters 1–4. No date for the narrated visit is asserted.
- Thomas: `thomas-john20`, John 20:24–31, pinned WEB. Absence is narrated; its reason is not. The separately attributed sayings remain a separate entrance.
- The Pliny–Perpetua connection uses the **existing** `pliny-perpetua` graph edge, including its source IDs, comparison classification and limitation: different regions, dates and genres; no direct causal relationship. The thread links the existing authored reading path. No new graph edge is introduced.

Human literary/historical/artistic review and unbriefed reader observation remain outstanding. Design selection and passing tests do not supply those approvals.
