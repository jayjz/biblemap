# PR #50 Linux reproducibility investigation

Run [42415390459](https://github.com/jayjz/biblemap/actions/runs/42415390459) correctly failed closed. Its two successful Linux builds used the same PR merge commit `4bf81ebda9e898b4746993f6d8000f376fe1862b` (head `3051b5f1c25cc0304de6c2cea387b017f97f8f48`). A previous successful pair did not establish that every repeated build would reproduce; this run exposed a remaining compiler ordering dependency.

## Complete comparison

Both retained archives were downloaded and each complete static/package manifest was verified against its files before comparison. Artifact IDs are `13591700602` (replica 1) and `13591745498` (replica 2). Both contain 354 static files and 356 package files. Raw source manifests, all installed dependency bytes, recorded toolchain/environment, scope and deployment configurations are identical.

- Replica 1 static digest: `sha256:38df37e25342b26a65e15ff1594900a79ceeb978c1a1459863dc6b68c7402569`.
- Replica 2 static digest: `sha256:60b72c687bfa112e032bc0cb4f85066cc5e07f25cf6829bc4973446e3e38ce32`.
- Source/input digest (both): `sha256:6e4edf3977584b4ff94febb6c4d57b92229e415531b313c51a6606dfb3cc8cfa`.
- Forty-five HTML files differ only in their webpack-runtime filename reference. One runtime is renamed, yielding 47 differing path entries and 308 identical static files. RSC, CSS, fonts, media, data, WASM and other JavaScript are identical.
- Package differences are precisely these same paths prefixed with `static/`; both deployment configuration files match.

The [machine-readable record](pr50-linux-reproducibility-differences.json) retains every path, length, SHA-256, zero-based first differing byte offset, first 32 bytes at that offset and every differing byte of the paired runtimes. A one-sided path has offset zero against an absent file; the paired runtime comparison below identifies its actual code difference.

## Proven cause and minimal fix

The paired runtime files are both 5,428 bytes. Their first difference is offset **4586**, `0x37` (`7`) versus `0x38` (`8`); their last difference is offset **4595**. The only changed source is the initial loaded-chunk table:

```js
// Replica 1
i={8068:0,8654:0,3025:0,9711:0,1059:0,709:0,8220:0,1377:0,5909:0}
// Replica 2
i={8068:0,8654:0,3025:0,9711:0,1059:0,8220:0,709:0,1377:0,5909:0}
```

Next 16.4.5 bundles webpack **5.98.0**. Its [StartupHelpers.getInitialChunkIds](https://github.com/webpack/webpack/blob/v5.98.0/lib/javascript/StartupHelpers.js) takes insertion order from `Chunk.getAllInitialChunks()`; [JsonpChunkLoadingRuntimeModule](https://github.com/webpack/webpack/blob/v5.98.0/lib/web/JsonpChunkLoadingRuntimeModule.js) serializes that Set without sorting. The [chunk traversal](https://github.com/webpack/webpack/blob/v5.98.0/lib/Chunk.js) follows graph/group insertion order. The two retained compilations traversed IDs 709 and 8220 in opposite orders. This changes runtime source, its content hash and every HTML reference despite identical recorded build inputs. It is not a source, dependency, clock, font, Vercel-injection or Windows/Linux mismatch.

A disposable compilation using the actual bundled JSONP generator reproduced the two orders deliberately: unchanged inputs/membership with `[709,8220]` versus `[8220,709]` produced different runtime source. Ordering the returned initial-chunk Set produced identical source in both cases. The committed regression repeats both unmodified and fixed compilations, checks exact generated-source equality before hashing/minification, and verifies that every chunk and loaded state survives.

The production-client-only `StableInitialChunksPlugin` supplies stable chunk-ID traversal order to that generator through webpack's compilation/runtime-module hooks. It does not alter graph membership, dependency/startup execution order or generated artifact bytes after compilation. No vendored dependency, publication comparison, acceptance rule or artifact inventory is changed. The original byte-equality gate remains strict.

## Every differing static path

Offsets are zero-based. For HTML rows the first differing bytes begin the runtime content-hash reference. The complete first-byte windows and SHA-256 values are in the JSON record.

| Path | Difference | First offset | Replica 1 → 2 |
|---|---|---:|---|
| `404.html` | modified | 651 | 0x30 → 0x61 |
| `404/index.html` | modified | 651 | 0x30 → 0x61 |
| `_next/static/chunks/webpack-0385070d23559526.js` | missing-in-second | 0 | 0x28 → absent |
| `_next/static/chunks/webpack-af2d737d5e8ebea2.js` | added-in-second | 0 | absent → 0x28 |
| `explore/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/augustine/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/emmaus/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/exodus/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/francis/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/genesis-in-paint/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/genesis/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/index.html` | modified | 913 | 0x30 → 0x61 |
| `human-story/james/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/james/reading/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/jerome/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/jonah-in-marble/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/jonah/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/josephus-james/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/mediterranean/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/nineveh/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/paths/a-life-in-another-life/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/paths/a-name-under-pressure/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/paths/a-word-crosses-centuries/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/paul/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/perpetua/index.html` | modified | 913 | 0x30 → 0x61 |
| `human-story/pliny/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/rashi-radak/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/romanus/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/romanus/reading/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/sinaiticus/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/singing-in-milan/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/suetonius/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/tacitus/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/teresa/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/testimonium/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/thomas/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/thomas/reading/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/thomas/sayings/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/time-and-memory/index.html` | modified | 837 | 0x30 → 0x61 |
| `human-story/worlds/atlas/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/worlds/saints/index.html` | modified | 823 | 0x30 → 0x61 |
| `human-story/worlds/stories/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/worlds/voices/index.html` | modified | 744 | 0x30 → 0x61 |
| `human-story/worlds/witnesses/index.html` | modified | 818 | 0x30 → 0x61 |
| `index.html` | modified | 913 | 0x30 → 0x61 |
| `jonah/index.html` | modified | 744 | 0x30 → 0x61 |
| `nineveh/index.html` | modified | 744 | 0x30 → 0x61 |

## Preservation and verification scope

The already verified `b75b180` source, `38df37e…02569` artifact and deployment `dpl_6fGD5o1RwaxeTAD3RTGJqNPnswmu` remain historical, immutable evidence. They are not overwritten or replaced by this investigation. Creator acceptance files and historical acceptance/verification records are unchanged. No deployment, promotion, alias, merge or publication command is part of this fix.

The fix is tested in the release regression suite and then by the unchanged canonical workflow on the final PR head and its synthetic merge commit. The exact final run IDs and observed reproducibility result are recorded in the PR description and handoff, avoiding a documentation-only commit that would change the head being verified. Matching those two builds is evidence for that recorded input set; it is not an assertion that all future compiler versions or inputs are deterministic.
