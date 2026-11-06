# Checkpoint verification history

This records failed attempts as failures. Passing later checks do not change their original outcomes. Full retained logs are in [the checkpoint evidence directory](../../artifacts/release-readiness/). Console logs are normalized to UTF-8 with formatting-only trailing spaces removed; messages and reported outcomes are retained. Two early adversarial raw logs were overwritten by retries before the checkpoint request; their exact error excerpts below are retained from tool output. The final fixture log has its own filename.

| Attempt | Exit | Cause and resolution |
|---|---:|---|
| Initial install/build inside sandbox | 1 | `Error: spawn EPERM`; rerun with authorized subprocess access. Not a product pass. |
| First TypeScript after Next update | 2 | Stale generated `.next` types imported `PrefetchForTypeCheckInternal`. Cleaned only the verified workspace `.next` directory, then regenerated types through the build. See `types-first.txt`. |
| Lint during dependency update | 1 | 18 errors from newly selected React Hooks plugin 7.1.1, including `react-hooks/refs`, `react-hooks/immutability`, and `react-hooks/purity`. The baseline lock used 7.0.1. Restored its exact compatible lock entry and original ESLint configuration, verified with `npm ci`. No lint rules were disabled. Full errors: `lint-first.txt` and `lint.txt`. |
| First adversarial fixture | 1 | Fixture itself failed TypeScript on optional `readingGuide`. Added a guard, keeping the type check enabled. |
| Second adversarial fixture | 1 | Newly excluded companion retained the common title `Calling`; the negative scanner correctly matched that word elsewhere. Changed all fixture title/question/context values to unique private markers. The validator was retained. |
| Baseline Atlas attribution regression | 1 | Both existing controlled attribution paths executed the fixture marker on MapLibre 5.19.0. See `atlas-security-before.txt`. |
| Initial worker byte check | 1 | Next re-minified the already-minified vendor asset, changing bytes and stripping its embedded BSD notice. Preserve that asset's pinned bytes before the JS minimizer; all other minimization remains enabled. See `maplibre-worker-check-before.txt`. |
| First complete checkpoint browser suite | 1 | 218 passed, 3 failed, 1 existing skip. Homepage `#encounters` focus was inactive on desktop/mobile; mobile Nineveh disclosure navigation timed out. Full exact errors: `e2e-before-navigation-fix.txt`. The existing Nineveh test reproduced 2 failures in 5 repeats. Same-document homepage navigation now uses a native anchor; closing an initial Nineveh deep link uses native fragment replacement instead of synthetic router restoration. |
| First opt-in Nineveh review build audit | 1 | Static generation completed, then the new dependency inventory reported two references to `/review-assets/nineveh-landscape.webp`. That image is intentionally served by the existing loopback review server, not copied to out. The opt-in audit now records that one exact binding only when its backing file exists, and CI prepares its existing fixture before the audit. Ordinary export validation and production review-flag prohibition remain strict. Full initial log: `nineveh-review-build-before.txt`. |

Exact first fixture error:

```text
src/content/jonah.ts(105,15): error TS2769: No overload matches this call.
Argument of type '{ title: string; question: string; context: string; sourceId: string; locator: string; status: ContentMaturity; } | undefined' is not assignable to parameter of type '{}'.
Type 'undefined' is not assignable to type '{}'.
```

Exact second fixture error excerpts:

```text
Error: human-story/francis/__next._full.txt: private editorial data exposed (Calling)
human-story/francis/__next.human-story/$d$entry/__PAGE__.txt: private editorial data exposed (Calling)
human-story/francis/index.html: private editorial data exposed (Calling)
human-story/francis/index.txt: private editorial data exposed (Calling)
jonah/__next._full.txt: private editorial data exposed (Calling)
jonah/__next.jonah/__PAGE__.txt: private editorial data exposed (Calling)
jonah/index.html: private editorial data exposed (Calling)
jonah/index.txt: private editorial data exposed (Calling)
```

Independent review of the first MapLibre 6.4.1 candidate also found a surviving iframe `srcdoc` issue and a missing relative worker module. The dependency work already reached 6.16.0 before the creator froze upgrades. That frozen version uses a stricter sanitizer and a self-contained worker. Existing defensive tests now cover those previously identified cases. No further payload development or security research is part of this checkpoint.

The final check outcomes belong in [engineering-checkpoint.md](engineering-checkpoint.md); source/rights validity and creator publication acceptance remain separate.
