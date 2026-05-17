# BibleMap Phi - 3-Phase Improvement Roadmap

**Current State:** v1.0 MLP deployed. Sophisticated WebGL architecture with critical UX gaps.  
**Last Updated:** 2026-05-17  
**Goal:** Transform from "technically impressive demo" to "daily-use Bible study tool"

---

## Phase 1: Critical UX & Data Visibility Fixes (Next 7 Days)

Fix the "dead app" feeling. Users currently land, see a globe, and have no idea what to do or if it's working.

### P0 - Loading Experience is Broken

**Task 1.1: Implement Progressive Loading with Real Progress**
- **Description:** Replace "Initializing Bible3D WebGL Context..." with actual progress indicators. Show: "Downloading matrix (2.4MB)...", "Unpacking 2,900 events...", "Initializing WebGL...". Use `ReadableStream` to track download progress.
- **Priority:** P0  
- **Effort:** 4 hours  
- **Impact:** High - Eliminates "is it broken?" anxiety  
- **Success Metric:** Users see progress within 500ms, full load in <3s on 3G. Measure with `performance.now()` logs.

**Task 1.2: Add Skeleton UI for Data-Dependent Components**
- **Description:** Book dropdown, epoch tabs, and timeline should show skeleton states while data loads. Currently they pop in abruptly after 2-3 seconds.
- **Priority:** P0  
- **Effort:** 2 hours  
- **Impact:** Medium - Feels more polished, sets expectations  
- **Success Metric:** No layout shift (CLS < 0.1) during load. Verify in Lighthouse.

**Task 1.3: Implement Error Boundaries with Recovery**
- **Description:** WebGL context loss, failed Parquet fetch, or corrupted data currently results in blank screen. Add error boundaries that catch these and offer: "Retry", "Load demo data", or "Report issue" with context.
- **Priority:** P0  
- **Effort:** 6 hours  
- **Impact:** High - Currently 100% failure rate on any error  
- **Success Metric:** Simulate network failure → user sees actionable error, not blank page. 0 unhandled rejections in console.

### P0 - Data Visibility Crisis

**Task 1.4: Fix the "Empty Map" Problem**
- **Description:** On first load, users see a dark globe with ~3-5 visible dots (most events filtered out by default year range). Solution: On initial load, auto-fit camera to show ALL events in current epoch, OR start with year = minYear instead of 0.
- **Priority:** P0  
- **Effort:** 3 hours  
- **Impact:** High - Currently looks broken to new users  
- **Success Metric:** First paint shows >50 visible events. Screenshot test.

**Task 1.5: Add "Events in View" Counter with Pulsing Indicator**
- **Description:** Show live count: "47 events visible • 2,853 filtered" in top bar. Pulse when filtering changes. Users have no feedback when scrubbing timeline.
- **Priority:** P1  
- **Effort:** 2 hours  
- **Impact:** Medium - Critical feedback loop missing  
- **Success Metric:** Counter updates in real-time during timeline scrub. No performance impact (<1ms).

### P1 - Discovery & Onboarding

**Task 1.6: Add "Quick Start" Overlay for First-Time Users**
- **Description:** Show dismissible 3-step overlay: "1. Pick an epoch → 2. Scrub timeline → 3. Click events". Track dismissal in localStorage. Currently 0% of users understand the epoch system.
- **Priority:** P1  
- **Effort:** 4 hours  
- **Impact:** Medium - Reduces cognitive load  
- **Success Metric:** 80% of users dismiss within 30 seconds (analytics event). 20% increase in event clicks.

**Task 1.7: Implement Text Search Across Events**
- **Description:** Add search box that filters events by name/description in real-time. Critical for usability - currently users must manually scrub to find specific events.
- **Priority:** P1  
- **Effort:** 1 day  
- **Impact:** High - Basic expected functionality missing  
- **Success Metric:** Search "Abraham" → shows 12 results in <100ms. Keyboard navigable.

---

## Phase 2: Features & Polish (Next 3 Weeks)

Make it feel like a complete product, not a tech demo.

### P0 - Performance Debt

**Task 2.1: Eliminate Row-by-Row JS Unpacking (CRITICAL)**
- **Description:** `DataLoader.tsx` lines 95-105 manually iterate `table.numRows` and build JS objects. This defeats the entire zero-copy architecture. Refactor to use Arrow vectors directly in deck.gl layers via `data: arrowTable` and accessor functions that read from Arrow columns.
- **Priority:** P0  
- **Effort:** 2 days  
- **Impact:** High - Currently parsing 2,900 rows in main thread defeats purpose of Parquet  
- **Success Metric:** Remove manual `for` loop. `tableFromIPC` → layer render time drops from ~400ms to <50ms. Memory usage drops 40%.

**Task 2.2: Implement True GPU Instancing for Overlapping Events**
- **Description:** Jerusalem has 400+ events at same coordinate. Currently using CPU jitter in Python export. Move to GPU-side collision detection using `CollisionFilterExtension` to dynamically space points at runtime.
- **Priority:** P1  
- **Effort:** 3 days  
- **Impact:** Medium - Enables dynamic zoom-based clustering  
- **Success Metric:** Zoom into Jerusalem → points auto-space without overlap. No Python re-export needed.

**Task 2.3: Add Web Worker for Parquet Decoding**
- **Description:** `parquet-wasm` runs on main thread currently. Move to Web Worker to keep UI responsive during 2.4MB download + decode.
- **Priority:** P1  
- **Effort:** 1 day  
- **Impact:** Medium - UI freezes for 200-400ms during load on mid-tier devices  
- **Success Metric:** Main thread stays <50ms tasks during load. Measure with Chrome DevTools.

### P1 - Core Features Missing

**Task 2.4: Shareable Event URLs**
- **Description:** Click event → URL updates to `/event/noahs-flood` or `#event=123`. Currently hash only stores epoch/book. Users can't share specific discoveries.
- **Priority:** P1  
- **Effort:** 1 day  
- **Impact:** High - Viral growth depends on shareability  
- **Success Metric:** Share URL → recipient sees same event selected and camera positioned. Test with 3 events.

**Task 2.5: Add "Related Events" Sidebar**
- **Description:** When event selected, show "3 events before" and "3 events after" chronologically, plus "Nearby geographically". Currently users click one event and dead-end.
- **Priority:** P1  
- **Effort:** 2 days  
- **Impact:** High - Increases session duration  
- **Success Metric:** Average events viewed per session increases from 1.2 to 3+. Track via analytics.

**Task 2.6: Implement Keyboard Navigation**
- **Description:** Arrow keys to scrub timeline, Tab through events, Enter to select. Currently mouse-only = accessibility failure.
- **Priority:** P1  
- **Effort:** 1 day  
- **Impact:** Medium - WCAG 2.1 AA compliance  
- **Success Metric:** Full app usable without mouse. Pass axe DevTools audit.

### P2 - Polish & Delight

**Task 2.7: Add Event Density Heatmap Toggle**
- **Description:** Toggle to show heatmap of event concentration. Helps users discover "hot zones" like Jerusalem, Egypt, etc.
- **Priority:** P2  
- **Effort:** 1 day  
- **Impact:** Low - Nice to have, not essential  
- **Success Metric:** Heatmap renders at 60fps with 2,900 points. Toggle <100ms.

**Task 2.8: Implement "Time Travel" Animation Presets**
- **Description:** Buttons for "Watch the Exodus unfold", "Follow Paul's journeys", "See kingdoms rise and fall". Auto-animates timeline with camera movements.
- **Priority:** P2  
- **Effort:** 3 days  
- **Impact:** Medium - Showcases unique capability  
- **Success Metric:** 3 preset animations work smoothly. Users can interrupt anytime.

**Task 2.9: Add Dark/Light Theme Toggle**
- **Description:** Currently dark-only. Add light theme for accessibility and user preference. Use CSS custom properties.
- **Priority:** P2  
- **Effort:** 1 day  
- **Impact:** Low - Polish item  
- **Success Metric:** Theme persists in localStorage. No flash of unstyled content.

---

## Phase 3: Advanced Capabilities & Scale (Next 2 Months)

Build moats and handle 10x data growth.

### P0 - Architecture for Scale

**Task 3.1: Implement Parquet Chunking & Streaming**
- **Description:** Current 2.4MB file loads all-or-nothing. Split by epoch (6 files) and stream on-demand. Or implement HTTP range requests to load only visible data.
- **Priority:** P0  
- **Effort:** 1 week  
- **Impact:** High - Required for >10k events  
- **Success Metric:** Initial load <500KB. Additional epochs load in background. Works offline with Service Worker.

**Task 3.2: Migrate to Vector Tiles for Base Map**
- **Description:** Currently using CARTO raster tiles. Switch to self-hosted PMTiles for offline capability and to eliminate external dependency.
- **Priority:** P1  
- **Effort:** 3 days  
- **Impact:** Medium - Removes third-party dependency, enables offline  
- **Success Metric:** Base map loads from `/tiles/{z}/{x}/{y}.pbf`. Zero external requests.

**Task 3.3: Add WebGL2 Compute Shaders for Advanced Filtering**
- **Description:** Move book filtering and search to GPU using transform feedback. Currently CPU-bound `useMemo` will break at 50k+ events.
- **Priority:** P1  
- **Effort:** 1 week  
- **Impact:** High - Enables 100k+ event datasets  
- **Success Metric:** Filter 50,000 events by book in <16ms (1 frame).

### P1 - Major Features

**Task 3.4: Split-Screen Reading Room**
- **Description:** Left pane: Bible text (synchronized scrolling). Right pane: Map auto-pans to events as user reads. Click verse → fly to location.
- **Priority:** P1  
- **Effort:** 2 weeks  
- **Impact:** High - Core differentiator, "read the Bible geographically"  
- **Success Metric:** Scroll through Genesis 12 → map follows Abram's journey automatically. Sync accuracy <100ms.

**Task 3.5: User Annotations & Collections**
- **Description:** Users can save events to collections, add notes, and share collections. Requires backend (Supabase/Cloudflare D1).
- **Priority:** P1  
- **Effort:** 2 weeks  
- **Impact:** High - Retention and network effects  
- **Success Metric:** User creates account, saves 5 events, shares collection URL, recipient views it.

**Task 3.6: 3D Terrain & Elevation**
- **Description:** Use Mapbox Terrain RGB or self-hosted DEM to show actual topography. Mount Sinai, Sea of Galilee elevation, etc.
- **Priority:** P2  
- **Effort:** 1 week  
- **Impact:** Medium - Visual wow factor  
- **Success Metric:** Terrain renders at 60fps. Toggle on/off. Works with existing layers.

### P2 - Platform Expansion

**Task 3.7: Native Mobile Apps (React Native/Expo)**
- **Description:** Wrap web app in native shell with offline maps, push notifications for "verse of the day" with location.
- **Priority:** P2  
- **Effort:** 3 weeks  
- **Impact:** Medium - Mobile app store presence  
- **Success Metric:** App published to TestFlight. Offline mode works. <50MB download.

**Task 3.8: Public API & Embeds**
- **Description:** Allow other sites to embed BibleMap with `iframe` or use API: `GET /api/events?book=GEN&year_min=-2000`
- **Priority:** P2  
- **Effort:** 1 week  
- **Impact:** Low - Developer ecosystem  
- **Success Metric:** 3 external embeds working. API docs published.

**Task 3.9: Multi-Language Support**
- **Description:** i18n for UI and event data. Start with Spanish, Portuguese (large Christian demographics).
- **Priority:** P2  
- **Effort:** 2 weeks  
- **Impact:** Medium - International growth  
- **Success Metric:** UI toggles between EN/ES/PT. Event names/descriptions translated.

---

## Technical Debt Register

**Must fix in Phase 1 or 2:**

1. **TypeScript Strict Mode Disabled** (commit 8c16ad5) - Re-enable and fix types. Currently flying blind.
2. **Duplicate DataLoader** - Root `/DataLoader.js` and `/src/components/DataLoader.tsx` diverge. Delete old one.
3. **Hardcoded Colors** - `TYPE_COLORS` duplicated in 2 files. Move to design tokens.
4. **No Tests** - Zero unit tests, zero E2E tests. Add Playwright for critical paths.
5. **Manual Cache Busting** - `?v=Date.now()` breaks CDN caching. Use content hashes.
6. **Inline Styles** - 200+ lines of inline styles in DataLoader. Move to Tailwind or CSS modules.
7. **No Error Tracking** - Add Sentry or similar. Currently errors vanish into void.
8. **Bundle Size** - Check: `parquet-wasm` is 800KB. Consider lazy-loading or web worker.

---

## Success Metrics Dashboard

Track these weekly:

**Performance:**
- Time to Interactive (TTI) < 3s on 3G
- First Contentful Paint (FCP) < 1.5s
- WebGL context loss rate < 0.1%

**Engagement:**
- Avg session duration > 3 minutes
- Events clicked per session > 3
- Return visitor rate > 25%

**Technical:**
- Lighthouse score > 90 (all categories)
- 0 TypeScript errors
- 0 console errors in production

---

## What to Ship First

**Week 1 MVP:** Tasks 1.1, 1.3, 1.4, 1.5, 1.7
- Fixes loading, errors, empty states, and adds search
- Transforms "cool demo" → "usable tool"

**Why this order:** You can't build features on a foundation where users think the app is broken. Fix the perception of brokenness first, then add delight.

---

**Notes for Implementers:**

- **Don't optimize prematurely:** The Parquet → Arrow → GPU pipeline is brilliant but currently bottlenecked by JS row iteration. Fix that before adding features.
- **Measure everything:** Add analytics BEFORE building Phase 2 features. You need baseline data.
- **Mobile is primary:** 60%+ of Bible study happens on phones. Test every change on real device, not just responsive mode.
- **Accessibility is not optional:** Screen reader users study the Bible too. Keyboard nav and ARIA labels are P1, not P3.

**Final thought:** The architecture is 10x better than 99% of web maps. The UX is currently 0.5x. Phase 1 closes that gap. Phase 2-3 build the moat.
