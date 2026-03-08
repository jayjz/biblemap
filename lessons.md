# LEARNED ARCHITECTURAL LESSONS

## Lesson 1: The GeoJSON Memory Nuke
**Context:** We previously attempted to export 31,000+ Biblical events with rich text properties to a single GeoJSON file.
**Failure:** The browser's main thread locked up during `JSON.parse()`, and mobile devices crashed due to contiguous memory allocation limits.
**The Fix:** We exclusively use the GeoArrow binary pipeline. Data is exported as GeoParquet. Deck.gl reads the raw binary arrays directly into the GPU using `@geoarrow/deck.gl-layers` with zero CPU serialization.

## Lesson 2: The Timeline Slider Bottleneck
**Context:** Filtering timeline data (Ussher chronology) using JavaScript array filters (`.filter()`) caused stuttering when scrubbing the timeline at 60 FPS.
**Failure:** CPU-bound filtering cannot keep up with React state changes during fast scrubbing.
**The Fix:** We use Deck.gl's `DataFilterExtension`. The current timeline range is passed as a uniform variable to the WebGL shader, performing the filtering in <1ms on the GPU.

## Lesson 3: Ussher Chronology Math
**Context:** The Bible uses BCE and CE dates.
**The Fix:** All dates must be normalized into a standard numeric float (e.g., `ussher_year`). Creation is `-4004.0`. The GPU filter operates strictly on this numeric float.

## Lesson 4: React 18 StrictMode vs WebGL
**Context:** Next.js 15 dev server was throwing a fatal `this.device.limits is undefined` error from Luma.gl.
**Failure:** React 18 StrictMode intentionally double-mounts components. It was instantiating, destroying, and re-instantiating the WebGL context faster than the `ResizeObserver` could track, crashing the GPU pipeline.
**The Fix:** Added `reactStrictMode: false` to `next.config.mjs`.

## Lesson 5: The Cache-Buster Trap
**Context:** Updated the Python export to include a new Parquet column, but the frontend React UI crashed because it couldn't find the new data.
**Failure:** Next.js `Cache-Control` headers were aggressively caching the `.parquet` binary. The browser ignored the local server and served the stale binary.
**The Fix:** Append a cache-buster query string (`?v=TIMESTAMP`) to the Parquet URL in `DataLoader.tsx` to force a hard fetch during development.

## Lesson 6: Hybrid Filtering (CPU vs GPU)
**Context:** We needed to filter points by both Timeline (continuous) and Book (categorical).
**The Fix:** Do not overload the GPU with string comparisons. Categorical filters (Book) are done via React `useMemo` to create a `filteredEvents` array. Continuous/Animated filters (Year) are handled by the WebGL `DataFilterExtension`.