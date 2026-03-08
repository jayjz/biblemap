### 3. Updated `MEMORY.md`
*Reflecting our completed phases and setting the new goal.*

```markdown
# PROJECT STATE & ROADMAP

## Current Goal
**LAUNCH PHASE:** Execute the Go-To-Market strategy, capture waitlist emails, and launch the Minimum Lovable Product (MLP) to pastors, homeschoolers, and theology communities.

## Phase Status

### [x] PHASE 1: Local PostGIS Engine
* **Status:** COMPLETED
* **Tasks:** Docker-compose setup, schema creation (places, verses, events).

### [x] PHASE 2: Static Data Ingestion
* **Status:** COMPLETED
* **Tasks:** OpenBible CSV ingestion, KJV JSON ingestion, Ussher CSV joining, and Fermat's Spiral Jittering implementation.

### [x] PHASE 3: GeoParquet Command Center Export
* **Status:** COMPLETED
* **Tasks:** Pre-computing `epoch_id` and `primary_book` in PostGIS; exporting to `bible-points.parquet` using PyArrow.

### [x] PHASE 4: Deck.gl + Next.js Frontend
* **Status:** COMPLETED
* **Tasks:** * WASM Parquet unpacking.
  * Dual-channel GPU `DataFilterExtension`.
  * Narrative Epoch tabs + Canonical Book dropdown.
  * URL Hash deep-linking.

### [ ] PHASE 5: Post-Launch Moat (v2.0)
* **Status:** PENDING
* **Tasks:**
  * **Feature 1 - Dynamic Journeys:** Animated `TripsLayer` (Red Sea as first query-triggered route) — In Progress
  * Implement Split-Screen Reading Room (Text + Map sync).
  * True GPU-level clustering (`CollisionFilterExtension`).