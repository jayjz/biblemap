# Perpetua: image and absence

4 November 2026. Draft design; no publication or editorial approval implied.

Baseline: 8ec926f; local branch matches PR 36 head. Existing critique and screenshots show artwork subordinated to disclosures, administrative material preceding the person, and an abstract relationship diagram doing the work of a scene.

Two directions considered: (A) a monumental devotional image facing a living text; (B) original textile compositions, with a small fold separating from a larger cloth. B could convey bodily proximity without pretending to reconstruct a prison, but its symbolism would require explanation and a new asset review. Choose A: the existing rights-verified Montserrat mosaic gives us actual faces and touching hands. Its later devotional character must remain explicit. Never remove the child from the mosaic or turn religious relief into a visual reunion.

Opening: full, uncropped artwork facing Perpetua's name and the existing title. Ochre #c9a56c, stone #eee4d5, oxblood #502f34, charcoal #201c1b, muted rose #c6a69b. Existing Playfair display, Georgia quotations, Geist controls. Left-aligned source reading, quiet metadata below the entrance. No new font or dependency.

Separation: keep the mosaic intact in an image field. On refusal it retreats to the edge, revealing a large empty field; the third moment preserves that absence and changes the emphasis to the account's interpretation. This is explicitly a contemporary composition around later art, not a depiction of historical events. The complete source reading, existing focus behavior, keyboard controls and no-JS text remain.

Visual concept: artifacts/perpetua-redesign/concept.html (uses the actual local rights-verified image). Baseline reference: artifacts/human-story-interiors/after/perpetua-desktop.png; this is older evidence, not a fresh baseline capture. Fresh capture attempt failed: node scripts/capture-perpetua.mjs redesign-before -> spawnSync git EPERM. Anthropic frontend-design skill read; online Rijksmuseum and Snow Fall reference retrieval failed. Existing repository reference study remains available.

## Implemented, pending rendered evaluation

Entrance: complete mosaic at large scale, Perpetua's name preceding the title, direct account link, native disclosure for draft qualifications, compact opt-in frame with a native world menu. Other worlds retain their existing frame. Mobile stacks the title and complete image without cropping. Existing art provenance and fallback remain available.

Separation: enlarged continuous composition replaces the facing-page panel layout. The full mosaic retreats to 38% of its field on refusal, exposing negative space; it stays there in the third moment. A separate border emphasizes religious interpretation without suggesting reunion or supernatural light. Existing labels, full quotations, source boundaries, focus movement, no-JS reading and reduced-motion cuts remain in code. Duplicate artwork placement uses a readable fallback without a second live announcement. No new raster, generated imagery, historical claims, media manifest changes or dependencies. Composition is original CSS by Codex, explicitly described in the interface. Enric's existing CC BY-SA 3.0 photograph remains intact and attributed.

## Verification and limits

- Initial and implementation typechecks passed. Final lint: zero errors, four existing warnings in unchanged files.
- Unit suite before final frame/fallback changes: 47 passed, one generated-export check skipped (48 total). Existing source-boundary and visitor-projection tests passed.
- First production build passed all source/media gates and the 402-artifact export validator: private editorial probes absent, all 48 Jonah verses and qualifications retained.
- Final rebuild was blocked during prebuild media-test process launch (`spawn EPERM`). Earlier build success does not verify the final adjustments.
- Focused browser command failed at launch (`spawn EPERM`). Capture helper failed on `spawnSync git EPERM`. No fresh desktop/mobile/narrow captures, keyboard run, reduced-motion run or console/network evaluation can be claimed. No after screenshot exists. Do not treat the HTML concept as rendered evidence.
- The existing mosaic and older local screenshot were visually inspected. Firecrawl could retrieve metadata and a screenshot URL for the supplied preview; that is the old preview, not these local changes. Reference sites could not be retrieved for fresh visual analysis.
- Release validation still fails on unfinished Jonah author slots and missing human approvals, consistent with the established blockers; nothing in this change approves publication.
- Dependency installation was not rerun; existing installed dependencies were used. No security policy or installation script changed.

Checkpoint 1 concept exists. Checkpoints 2/3 implementation exists but is not visually accepted. Checkpoint 4 remains incomplete because browser execution is blocked. No claims of visitor comprehension or artistic success are made. The 450px-wide source image limits desktop detail; repeated use of the same mosaic may remain too restrained for the creative brief. Human visual critique at 1440/390/320, historical/theological review and an assistive-technology reading session remain required.

## Git and continuation

Working branch remains `feat/human-story-portal`, starting at `8ec926f6c471aada2dfb81261aac8bc12be3b20f`. Initial working tree was clean. Staging and checkpoint commit failed: Git's index lock is under `C:/Dev/biblemap-release/.git/worktrees/biblemap-human-experience/`, outside the writable root. No new commit SHA, push, CI run or deployment exists. No permissions workaround attempted. Generated next-env.d.ts restored to its original import. Exodus, research, source content and publication validators were not edited.

Later authorized verification commands, from this workspace:

```powershell
npm run typecheck
npm run lint
npm run build
npm run test
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run test:e2e -- tests/perpetua.spec.ts tests/perpetua-reading.spec.ts
node scripts/capture-perpetua.mjs redesign-after
```

Then inspect the actual captures, refine and rerun affected checks before accepting the design. Git commands when the worktree metadata is writable within authorized permissions:

```powershell
git status --short
git add docs/perpetua-creative-redesign.md artifacts/perpetua-redesign/concept.html src/features/human-story/ArtworkImage.tsx src/features/human-story/HumanStoryFrame.tsx src/features/human-story/PerpetuaEncounter.tsx src/features/human-story/SeparationReading.tsx src/features/human-story/human-story.module.css src/features/human-story/prison.module.css src/features/human-story/separation.module.css
git diff --cached
git diff --cached --check
git commit -m "design(perpetua): bring image and absence into the encounter" -m "Give the intact later mosaic compositional importance in the entrance. Open empty space beside it as the source moves from presence to refusal; retain that separation through religious interpretation. Preserve exact text, provenance, no-JS reading, reduced motion and visitor boundaries. Rendered evaluation remains required; see the redesign report for sandbox limitations."
git push origin feat/human-story-portal
```

Do not merge or release. A future commit should describe the verification actually completed at that time.
