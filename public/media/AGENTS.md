# BibleMap Media Asset Instructions

These instructions extend the repository-root `AGENTS.md` for artwork, images, audio, video, textures, models, and generated reconstructions.

## Core Rule

No media asset may ship without known provenance, rights status, classification, and review state.

When rights cannot be verified, omit the asset.

Do not download or ship images found through general search results merely because they are publicly visible online.

## Media Classes

Every asset must use one class:

- `artistic-depiction`
- `historical-artifact`
- `archaeological-evidence`
- `historical-landscape`
- `manuscript`
- `map`
- `interpretive-reconstruction`
- `texture`
- `narration`
- `soundscape`
- `music`

Do not describe an `artistic-depiction` or `interpretive-reconstruction` as archaeological evidence.

## Preferred Sources

Prefer assets with clear reusable rights from:

- Museum open-access collections
- Public archives
- Wikimedia Commons with verified file-level licensing
- Government or institutional open-data collections
- Original commissioned or recorded work
- BibleMap-generated original assets with disclosure

Prefer CC0 or public-domain assets when possible.

Creative Commons assets must retain all required attribution and share-alike information.

## Required Manifest

Every production asset must have a manifest entry containing:

```text
id
eventIds
journeyIds
class
title
creator
creationDate
depictedPeriod
sourceInstitution
sourceRecordUrl
originalAssetUrl
license
rightsStatement
requiredAttribution
downloadedAt
checksum
localPath
altText
caption
historicalFit
editorialReason
reviewStatus
reviewedBy

Optional generated-asset fields:

generator
model
generatedAt
prompt
referenceAssetIds
historicalSources
knownInaccuracies

Use reviewStatus values such as:

candidate
rights-verified
historically-reviewed
theologically-reviewed
approved
rejected

Only approved assets may appear in production.

Artwork Rules

Always distinguish the artwork’s creation date from the period it depicts.

A later painting can illuminate reception history or emotional interpretation, but it cannot establish what an ancient event looked like.

Captions should explain why the artwork was selected, especially when its cultural setting differs from the biblical setting.

Do not crop away signatures, inscriptions, museum marks, or context when doing so would misrepresent the work.

Do not imitate the identifiable style of a living artist when generating original work.

Interpretive Reconstructions

Generated scenes must:

Be original treatments
Be labeled Interpretive reconstruction
Be based on cited geographical and material-culture references
Document deliberate artistic choices
Record known uncertainties and inaccuracies
Avoid claiming photographic or archaeological authenticity
Receive human editorial approval

Generated images must not be used to manufacture evidence for supernatural, historical, archaeological, or doctrinal claims.

Narration

Narration must have:

A transcript
Speaker or generator disclosure when appropriate
Voice usage rights
Translation and Scripture references
Human review
Pronunciation review for names and places
Captions or readable equivalent
Independent volume and mute controls

Do not autoplay audio before user interaction.

Browser speech synthesis may be a fallback, but it should not be treated as the final immersive narration layer.

Soundscapes and Music

Sound must support place and narrative pacing without claiming undocumented historical authenticity.

Label reconstructed ancient instruments or environments appropriately.

Avoid continuous audio fatigue. Use silence intentionally.

The experience must remain complete with audio disabled.

Delivery

Prefer build-time ingestion and locally controlled optimized derivatives when source terms allow.

Generate responsive formats and dimensions appropriate to actual display:

AVIF or WebP for photographic and painted imagery
Appropriate lossless formats for diagrams or transparency
Multiple responsive sizes
Lightweight placeholders
Poster frames for video
Compressed audio with a quality master retained outside the client bundle

Do not ship full-resolution museum masters to mobile clients unnecessarily.

Avoid runtime hotlinking when it weakens reliability, performance, attribution, or compliance.

Media Failure Behavior

A missing or rejected asset must produce a deliberate fallback:

Continue the journey without the image
Show a typographic Scripture or location card
Use a verified texture or map view
Explain that no reviewed visual is available when appropriate

Never substitute an unrelated image automatically.

Review Checklist

Before approving an asset:

Rights verified
Attribution complete
Source record retained
Class correctly assigned
Creation date distinguished from depicted period
Historical limitations documented
Theological framing reviewed when applicable
Alt text and caption complete
Mobile performance checked
Missing-media fallback tested