# Artifact reproducibility investigation — 2026-11-07

**Verdict: BLOCKED.** Repeated clean Windows builds are byte-reproducible. Actual Vercel responses and build logs still disagree with the local output. The original preview mismatch has a confirmed deployment-specific cause; a separate checkout-byte defect is fixed. This investigation does not establish cross-environment reproducibility or authorize renewed acceptance, merge, or publication.

Evidence: [per-file records, commands and logs](../../artifacts/artifact-reproducibility/). The implementation is confined to `.gitattributes`, `scripts/export-inventory.mjs`, and `src/domain/artifact-reproducibility.test.ts`. The capture helper and remaining files are investigation evidence. No decision, scope, theological content, dependency, production setting, domain, DNS, or alias was edited.

## Original symptom and source identity

[PR #46](https://github.com/jayjz/biblemap/pull/46) records 376 local artifacts versus 374 on three older previews, with different digests. [PR #41](https://github.com/jayjz/biblemap/pull/41) remains draft. Their metadata and discussion were read through the GitHub connector; their only retrieved discussion entries were Vercel status comments. Local Git history and the relevant Vercel build logs were also inspected.

The initial checkout was the Thomas branch at `3d0221a86b55338f8900c9bff0f87a61f0e4d627`, with unrelated untracked work. It was left untouched. The dedicated branch is `investigate/artifact-reproducibility-20261107`, based on the fetched consolidated head `95dd340e590b6c8c3385afea2538dffb09070001`. The diagnostic worktree is isolated under the system temporary directory. `main` remains `60ecbda079f5fd29325b68549fe6d01ced74a7fc`; the approval branch remains `c5ab3622c1ab583987174baf2396328fda7cf576`.

Important comparisons:

- `git diff --quiet d72ae172 0e762f9d` exits **0**: PR #45 and its consolidation merge have identical Git trees. Their differing hosted digests cannot be attributed to a source revision between those two commits.
- `git diff --name-only 0e762f9d c5ab3622` lists only `docs/release/publication-decision.json`. That file is excluded from the source digest used by these builds. It is still a potentially meaningful application input when imported; exclusion alone is not a general guarantee of identical output. The older inspected root RSC payloads are actually identical.
- `95dd340` includes subsequent Thomas and SEO changes. It is not the old approval candidate. In particular, `334ad68` switches Vercel to serving `out/`, `52c1c0f` pins `npm ci`, and the export finalizer removes denied/error route representations. Counts across these revisions do not prove nondeterminism.
- The historical local inventory was committed alongside PR #45, but no matching complete raw-source manifest or exact toolchain record survives in that evidence. Its content digest and output cannot be asserted to represent a pristine checkout of that commit.

## Source/environment matrix

All listed builds use `next build --webpack` through `npm run build`; prebuild validates publication mode, committed Parquet, Scripture, stories and media. Postbuild validates export bytes and the worker before the publication gate. Later builds also run `finalize-export.mjs` first.

The repository lockfile is unchanged across the inspected historical, consolidated and investigation source commits. Its LF-byte SHA-256 is `4ca26a84aa9239945ec81ec276bfbf282327b4b7282c28eb9f415ebb9b75e070`. This identifies the Git lockfile, not an independently verified historical installed dependency tree.

| Build / source | Environment and install evidence | Files | Artifact SHA-256 |
|---|---|---:|---|
| Historical local record, stored in `d72ae172e693b5c5915fa9bb59fa9885080f4754`; raw build inputs unproven | Windows paths in retained logs; original exact Node/npm versions unavailable; checkpoint records a frozen install | 376 | `1fc35178fcafd5b5077f70c3b7a3ed24f37720ea80b6793db9bd7780141c2c2f` |
| Vercel PR #45, `d72ae172e693b5c5915fa9bb59fa9885080f4754` | Next.js adapter; CLI 65.11.0; historical exact Node/npm and raw environment not captured | 374 | `f553dd9af0508e3b36b38ca375732cb2a01a642107fec9951900a44b6af7aa98` |
| Vercel consolidated, `0e762f9d10c0b91dbff469ab39c3ebca370d28de` | Next.js adapter; CLI 65.11.0; restored cache; default install changed cached dependencies | 374 | `febd2b8aac61870a733e28ca043335502c3f6155aea3a38a025190d17c17dd81` |
| Vercel approval, `c5ab3622c1ab583987174baf2396328fda7cf576` | Next.js adapter; CLI 65.11.0; restored a different cache; exact Node/npm and environment unavailable | 374 | `12b396d1a746f2523701764a4900cbf7eb19d669c2bb56c3765531be669e45f1` |
| Local baseline 1 and 2, `95dd340e590b6c8c3385afea2538dffb09070001` | Windows x64, Node 24.22.2, npm 11.19.1, `npm ci`; original CRLF checkout; both `.next/` and `out/` removed before each build | 363 each | `6e64ae93ad30eb1add61ac95403da4d585f04ca00ef8059d4300fa28a1658d19` both |
| Vercel latest consolidated, same `95dd340` | Static `out/`, framework override null, explicit `npm ci`, CLI 65.11.0; restored cache | 362 | `c90c41019b8577261fc2c69f11e4db032c16bd68724dce84c4a14a045988d39d` |
| Local intermediate `ce85c4e43d80d08f819ebfad7795bb36c478a594`, retained mixed checkout, two clean builds | Same local toolchain; changing attributes alone did not refresh existing working files | 363 each | `c88b17068cf7553b2ccfb19b93ec63025907729b90b4b998a375c522eca694db` both |
| Same intermediate source after refreshing committed inputs to LF, two clean builds | Same local toolchain; source bytes actually refreshed | 364 each | `11e8b319519938986bc3e010eb45867fedf153803e58b6b07585ed98e744a910` both |
| Vercel `ce85c4e` | Static `out/`, `npm ci`, **no previous build cache available** | 362 | `806f5e48f0cf3e521cf9efe4335bff08a0611a1c6a821939b382a9269fe0d5c9` |
| Completed source patch, local `00a6f6812d0cb33adc08fc16fefbb69c64527443` | LF checkout, same local toolchain; clean preflight build | 364 | `31990ac6e2af1c5cd28282ca4dffd239bc207419635067c3650e08bbd1018a73` |
| Completed source patch, Vercel same `00a6f68` | Static `out/`, preview deployment `dpl_GVdtSTxRtjhteZjXizZcMCVeX7cf` | 362 | `e618601ac550ef8690de79f0dbd33653e960c4f8d6869e788718dd704ceddb4d` |

The current project reports Node `24.x`; this does not establish its exact historical patch version. Existing GitHub CI pins Node `22.22.3` on Ubuntu 24.04 and has a separate Windows source check. Those are distinct environments, not additional proofs of artifact equivalence. New local parent processes have no `NODE_ENV`, `VERCEL*`, `NOW_BUILDER`, review/release flags, `NEXT_DEPLOYMENT_ID`, or `NEXT_HASH_SALT` set; npm/Next performs the normal production-style compilation. Full safe local environment and raw input hashes are retained. Secret-bearing environment values were not requested or printed.

Potential output inputs include `VERCEL_ENV` (SEO preview policy), `BIBLEMAP_*` review/publication flags, `NODE_ENV`, `NOW_BUILDER`, `NEXT_DEPLOYMENT_ID`, `NEXT_HASH_SALT`, platform paths and build-time font responses. The older Vercel environment values cannot be reconstructed from these logs. Current static-host configuration and `out/` collection were verified in repository configuration and actual logs; historical Next.js adapter packaging is a different pipeline.

## Exact digest contract

`inventoryExport` recursively includes every regular file under `out/`, including hidden files, HTML, alternate RSC payloads, JS, media, fonts, Parquet, WASM and compressed files. Symlinks are not regular-file entries. Paths are relative to the export root, backslashes become `/`, and JavaScript default string sorting determines order. For every file the inventory records its original byte length and `sha256:` checksum.

The aggregate is SHA-256 of UTF-8 `JSON.stringify(files.map(({path,bytes,checksum}) => ({path,bytes,checksum})))`, with those property names and insertion order. There is no trailing newline in the hashed JSON. Route/type/URL metadata, scan findings, mtimes, permissions, timestamps and source identity are not part of that aggregate. Gzip/Brotli contents are decompressed for private-data probes, while their original compressed bytes remain hashed. Artifact bytes are not normalized or excluded by this patch.

`contentDigest` is a separate sorted path/checksum identity over `src`, `scripts`, `public`, `tests`, `.github`, selected root configuration, and publication scope. It normalizes CRLF in its recognized text extensions. It previously omitted `.gitattributes` and did not recognize Python or `.gitkeep` as normalized text. The approval record remains excluded. Build IDs use only the first 20 hex characters of this digest.

## Verified causes and individual files

### Deployment-specific toolbar bytes in the older previews

Actual HTTP downloads show that the consolidated and approval `main-app` chunks contain a Vercel feedback script. They embed different `data-deployment-id` values:

| Surface | Consolidated | Approval |
|---|---|---|
| File | `main-app-1fff53b126da2273.js` | `main-app-1668d0cd9522f2b1.js` |
| Bytes | 769 | 769 |
| Embedded deployment | `dpl_5YTNVB4YVmojSFJjKTC365gnyLY2` | `dpl_ERMob58BAWS67Ep1ptLVqCpHJqev` |
| SHA-256 | `c72b4b08ef25d832493656947ab1925e18befac8d50a0962d1d05fd719f493f8` | `c8e2eb379d4dd7b549550bb0afc2e34aa4038a30d6068418f04d2d6b9c9fedd3` |

The root HTML is byte-identical after substituting that one chunk filename. Root `index.txt` is already byte-identical. The two complete small chunk bodies and these assertions are retained in `toolbar-difference.json` and `toolbar-*.js.txt`. This is a demonstrated cause of the original approval-only mismatch, not proof that every historical differing file has been recovered.

The newer static-host preview's inspected `main-app` does not contain that injection. The earlier SEO configuration already removed this observed cause; this patch does not disable any platform/security feature or alter project settings.

### Checkout-dependent source and public text bytes

The same Git inputs checked out with `core.autocrlf=true` change public bytes that Next copies unchanged. Six concrete exported files differ before the fix and match the hosted completed-source preview after an actual LF refresh:

| Export path | Original local bytes | LF / hosted bytes |
|---|---:|---:|
| `audio/README.md` | 41 | 40 |
| `media/AGENTS.md` | 6849 | 6653 |
| `media/approved/.gitkeep` | 147 | 145 |
| `media/james/manifest.json` | 20957 | 20718 |
| `media/nineveh-depth/README.md` | 1524 | 1514 |
| `media/thomas/manifest.json` | 37389 | 36974 |

`scripts/epochs.py`, `scripts/split_parquet.py`, and the public `.gitkeep` also change the source digest because their CRLF bytes were not normalized by the source-digest extension rule. A Git LF archive of the baseline produces content digest `6bb8fc9eaa0c026e9219364b72b61bee3625b964a12859cc0f4a29eb90301bfc`, versus baseline Windows `5bcfd6cfe3bf9513233a7cbed62bca67da6c2a04ca648bc3d3af67161020b3f5`.

The fix sets `* text=auto eol=lf`, retaining binary detection and explicit original-byte exceptions for publisher HTML. `web-rights.html` needed its own exception; its raw Git object remains `2909e599a6171e54505244868c59ad9066a0dad2`. `.gitattributes` now participates in content identity, because changing checkout policy can change actual output. A fresh checkout is necessary: Git's cached unchanged files were not all rewritten merely by changing attributes. The intermediate mixed/LF builds are separately identified above.

The regression creates a disposable Git repository with autocrlf enabled, adds LF text, binary data and mixed-ending publisher snapshots, then actually checks them out and compares bytes. A second fixture verifies that changing checkout policy changes content identity. Both tests fail against `95dd340` and pass against the completed patch. No real approval record is modified by the tests.

### Remaining source identity and Next.js platform differences

The completed source patch's local content digest is `7aa7caec49fee460dfc43b40db3afe5bd3b051880806842eb62c42af1e74b964`. The actual matching-SHA Vercel RSC build ID is `candidate-6fc612189894f6c26242`. Thus even the complete on-disk source identity is not yet proven equivalent across those environments. The full remote source manifest and precise Node/npm/environment values are unavailable. It would be incorrect to call every remaining difference nondeterminism given this failed input-equivalence condition.

Concrete generated differences also survive:

- Windows emits `jonah/__next.jonah/__PAGE__.txt`; the hosted Linux counterpart is `jonah/__next.jonah.__PAGE__.txt`. Dynamic RSC segment paths similarly use slash versus dot representations. Both paths were tested by HTTP; the Windows spelling returns 404 on Vercel while the dot spelling returns 200.
- The inspected Windows Next font manifest has an empty `app` map. Hosted RSC/HTML contains three font preloads absent from the local representation. Installed Next 16.4.5's `next-font-manifest-plugin.js` tests module requests for the literal substring `/next-font-loader/index.js?`, which is sensitive to Windows request separators. This supports a platform-path explanation; no vendor patch or full cross-platform correction has been verified.
- CSS and JS filenames/module references differ. Per-file hashes, first differing byte offsets and text contexts are retained. All 15 font binary files match in the recovered comparison, so changing font binary responses does not explain those observed differences. `next/font/google` still performs a build-time external fetch and would need captured/pinned inputs for a durable contract.

Repeated local builds show no unexplained timestamp, random-ID, order or stale-output difference under the recorded equivalent local conditions. They do not rule out all such behavior on other toolchains or in adapter packaging.

## Added, missing, modified — and the two-file count gap

Baseline clean local builds: **zero added, zero missing, zero modified** files, with complete 363-file manifests. The completed-source local manifest has 364 files. Repeated final delivery builds must match its exact digest and each other; their capture records identify the delivery commit separately from the earlier source-only commit.

The completed-source HTTP comparison has **120 verified identical** local/counterpart paths and **215 verified modified** counterparts; **29 local paths** are unavailable at the same structural hosted path. Those 29 are not asserted to be absent from the generated deployment: many have changed content-hashed names. The recovered candidate hosted manifest contains 356 paths, versus 362 in the build log, and its aggregate does not match the build-log aggregate. Error responses and inferred filesystem mappings are explicitly recorded. This is partial byte evidence, not a complete exported tree.

**The exact historical net 376-versus-374 difference cannot be assigned to two filenames with the available evidence.** The full 376-file local manifest is retained. The Vercel source-tree endpoint returns `404: File tree not found` for the historical Git deployment, and is documented as a source tree rather than a generated-output tree. The build-generated inventory under `artifacts/` is not served at its URL. HTTP reconstruction recovers 361 candidate historical files, not the complete 374-file manifest; hashes and RSC names also change. A net difference of two can include multiple removals/additions and renames. Neither `_buildManifest.js` nor `_ssgManifest.js` is missing: both were successfully retrieved under the remote build ID. Naming either as one of “the two” would be false.

## Verification and reproducible commands

Every build capture removes both `.next/` and `out/`; dependency installation remains fixed during each repeated pair. The final capture helper records the exact Git commit, raw input file manifest, safe environment, Node/npm, lockfile hash, build exit, artifact manifest and complete output snapshot outside the repository. Its comparison fails on unequal commits, toolchains, recorded environment, raw input manifests, changing source identity, or artifact files.

From a fresh diagnostic checkout with `npm ci` completed:

```powershell
node artifacts/artifact-reproducibility/capture.mjs build final-1
node artifacts/artifact-reproducibility/capture.mjs build final-2
node artifacts/artifact-reproducibility/capture.mjs compare final-1 final-2
```

The expected completed-source aggregate is `sha256:31990ac6e2af1c5cd28282ca4dffd239bc207419635067c3650e08bbd1018a73` over 364 files. Documentation/evidence delivery commits do not enter content identity. The final handoff/PR records the delivery SHA and results of the two post-commit builds; `.local/` preserves their machine-readable metadata without recursively committing snapshots. The committed `source-final-*` records independently retain the earlier completed-source preflight.

| Executed check | Exit / result |
|---|---|
| `npm ci` | 0; no dependency upgrades; 22 existing advisories reported |
| Baseline `npm run build`, twice after deleting `.next/` and `out/` | 0, 0; manifests identical |
| Focused regression against original `95dd340` implementation | 1; both intended assertions fail |
| Focused regression against completed implementation | 0; two tests pass |
| `npm run lint` | Final corrected run 0; three existing `DataLoader.tsx` warnings |
| `node node_modules/typescript/bin/tsc --noEmit` | 0; same compiler as `npx tsc --noEmit` |
| `npm run test` | 0; 67 passed, one export-opt-in skip in the initial run |
| `$env:BIBLEMAP_VERIFY_EXPORT='1'; npm run test` | 0; 68 passed, no skips |
| `npm run test:export-boundary` | 0; actual adversarial source-to-export scan; fixtures restored |
| Focused Playwright desktop/mobile, Atlas attribution/worker, metadata, keyboard and reduced motion | 0; eight passed; no page errors or failed local worker/module requests in the tested assertions |
| `npm run validate:release` | **1**, correctly blocks pending creator publication acceptance after source/media/export checks |
| Release-mode `publication-gate.mjs --build` | **1**, correctly rejects the pending decision |

Exact command records and revisions are in `checks.json`. A full Playwright rerun was not warranted for the checkout/tooling patch. A temporary evidence-capture layout initially put copied generated bundles inside ESLint's scan, yielding exit 1 (24 errors). The helper was corrected to keep raw snapshots outside the repository; lint then passed without changing lint configuration or rules. Earlier sandbox child-process/WSL enumeration failures were infrastructure failures, not successful product checks. WSL enumeration with authorized access found no Linux distribution. Capture/regression setup errors were corrected before relying on their results.

## Remaining blockers and next verification contract

The exact all-byte gate remains unchanged and blocking. PR #46 cannot safely proceed to renewed creator acceptance as a verified release candidate yet. Its acceptance concerns an older source candidate, and current consolidation includes subsequent source changes.

The next investigation should obtain complete raw input and output manifests from the actual Vercel build, before/after platform adaptation, and record exact Node/npm versions and relevant nonsecret environment settings. Logs, successful deployment status and HTTP samples cannot establish that full output equality. The current matching-SHA source-digest mismatch and net file-count differences must be explained.

A narrowly scoped verification design is to compare raw source manifests and complete output bytes using one pinned Linux/toolchain environment shared by the local release build and host, with `npm ci`, captured build-time font inputs, and no deployment-specific payload injection into those bytes. Windows builds would remain a separate portability check until their output is proven identical. This is a proposal, not an implemented replacement trust model. It must retain every artifact, exact hashes, boundary tests and creator acceptance of the exact final bytes. Platform-added files must be audited and explained rather than silently excluded. Any separate production/merge action still requires authorization.

No merge, creator acceptance, production change or publication approval is inferred from this report or from CI.
