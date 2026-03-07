# LEARNED ARCHITECTURAL LESSONS

## Lesson 1: The GeoJSON Memory Nuke
**Context:** We previously attempted to export 31,000+ Biblical events with rich text properties to a single GeoJSON file.
**Failure:** The browser's main thread locked up during `JSON.parse()`, and mobile devices crashed due to contiguous memory allocation limits.
**The Fix:** We exclusively use the GeoArrow binary pipeline. Data is exported as GeoParquet. Deck.gl reads the raw binary arrays directly into the GPU using `@geoarrow/deck.gl-layers` with zero CPU serialization.

## Lesson 2: The Timeline Slider Bottleneck
**Context:** Filtering timeline data (Ussher chronology) using JavaScript array filters (`.filter()`) or Web Workers caused stuttering when scrubbing the timeline at 60 FPS.
**Failure:** CPU-bound filtering cannot keep up with React state changes during fast scrubbing.
**The Fix:** We use Deck.gl's `DataFilterExtension`. The entire dataset is loaded into the GPU once. The current timeline range is passed as a uniform variable to the WebGL shader, performing the filtering in <1ms on the GPU.

## Lesson 3: Ussher Chronology Math
**Context:** The Bible uses BCE and CE dates, which are not natively handled by standard JS Date objects. 
**The Fix:** All dates must be normalized into a standard numeric float field (e.g., `ussher_year`). Creation is `-4004.0`. CE dates are positive. The GPU filter operates strictly on this numeric float.