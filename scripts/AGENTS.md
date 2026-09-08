# BibleMap Data Pipeline Instructions

These instructions extend the repository-root `AGENTS.md` for ETL and data-pipeline work.

They apply to files in `scripts/` and should also be consulted before modifying root-level Python ingestion or export scripts.

## Data Philosophy

BibleMap must preserve the difference between:

- What the biblical text states
- How an event was derived from the text
- A proposed chronology
- A proposed geographic identification
- A traditional identification
- A modern scholarly identification
- A disputed or unknown identification
- Editorial or generated enrichment

Never discard uncertainty merely to simplify rendering.

## Provenance Requirements

Every derived record should retain enough information to answer:

- Where did this data originate?
- Which source version was used?
- When was it retrieved?
- Under what license may it be used?
- Which transformation created this field?
- Was the value supplied, inferred, normalized, or generated?
- What confidence or disagreement accompanied the source?
- Can the output be reproduced?

Maintain a machine-readable source registry.

At minimum, record:

- Source ID
- Source name
- Canonical source URL
- Dataset or release version
- Retrieval date
- License identifier
- Required attribution
- Content checksum when practical
- Transformation script version

## Domain Model

Prefer normalized concepts:

```text
Event
EventPassage
EventDateEstimate
ChronologyModel
Place
PlaceIdentification
EventPlace
Journey
JourneyWaypoint
Source
MediaAsset
Interpretation

An event may have:

Multiple passages
Multiple date estimates
Multiple proposed locations
Different confidence levels
Different supporting sources
Different interpretive traditions

Do not flatten these into one unexplained year and coordinate at ingestion time.

Stable Identifiers

Use stable IDs independent of:

Array positions
Database auto-increment values exposed to clients
Display names
File ordering
A single translation’s spelling

Normalize aliases separately from identity.

Chronology

Ussher chronology may be supported as a selectable chronology model.

It must be labeled with its source and methodology. It must not be presented as the only historical chronology.

Prefer date models that can express:

Exact year when genuinely supported
Approximate year
Start and end range
Relative ordering
Unknown date
Named chronology
Confidence
Supporting source

Do not convert approximate or disputed dates into unexplained exact integers.

Geography

Do not silently strip uncertainty markers from geographic records.

Preserve:

Coordinates
Geometry type
Geographic scope or radius
Confidence
Alternative identifications
Ancient and modern names
Source paths
Relevant time period
Whether the point represents a settlement, region, river, mountain, route, or approximation

Naive substring matching between event prose and place names is not sufficient evidence for a production mapping. If retained temporarily, label the result as heuristic and test known false-positive cases.

Do not apply visual jitter to canonical geographic coordinates. Keep canonical coordinates intact and calculate display displacement as a separate rendering field or at runtime.

Scripture

Retain:

Canonical book identifier
Chapter and verse
Translation
Source
License
Exact ingested text checksum where practical

Do not infer a verse reference solely from loose prose when a structured reference exists.

Never mix text from two translations without explicit labels.

Transformation Rules
Pipelines must be deterministic.
Pin source versions or record retrieval versions.
Validate input schemas before transforming.
Fail loudly on missing required fields.
Do not silently convert malformed values to zero, empty strings, or default coordinates.
Log skipped and rejected records with reasons.
Separate warnings from hard failures.
Keep pure parsing functions testable without PostgreSQL.
Version exported schemas.
Generate epoch filenames and UI metadata from one canonical manifest.
Do not maintain competing epoch definitions in Python, JavaScript, and documentation.
Licensing

OpenBible-derived data requires its applicable Creative Commons attribution.

Do not assume the repository’s MIT software license replaces upstream data or media licenses.

Keep separate:

Software license
Data licenses
Scripture translation rights
Artwork and media rights
Generated-asset disclosure
Data Validation

Validate at minimum:

Unique stable IDs
Required source references
Valid coordinates and geometries
Date-range ordering
Known chronology identifiers
Valid Scripture references
Valid event-place relationships
Confidence values within their schema
No unexplained zero coordinates
No orphaned sources
No media records without rights metadata
Deterministic output checksums
Epoch manifest consistency
Compatibility between source and exported schemas

Fixture-based tests should cover uncertain places, alternative locations, date ranges, missing fields, duplicate names, and licensing metadata.

Pipeline Definition of Done

A data-pipeline change is complete only when:

Input and output schemas are documented.
The transformation is reproducible.
Tests cover the changed logic.
Validation runs against representative fixtures.
Source and licensing metadata survive export.
Output changes are summarized quantitatively.
Any records dropped or reclassified are reported.
Frontend compatibility is verified.