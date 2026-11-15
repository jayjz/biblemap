import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selectHomepage, homeRoute } from "./home-curation.ts";
import { HOME_CURATION } from "../content/home-curation.ts";
import { HOME_CATALOG } from "../content/home-catalog.ts";
import { selectedScope, VISITOR_HUMAN_GRAPH } from "../content/visitor-human-story.ts";
import { HOME_INVITATIONS } from "../content/home-editorial.ts";
import { PLINY_V3_SOURCES } from "../content/pliny-v3.ts";
import { PLINY_SOURCES } from "../content/pliny.ts";
import { THOMAS_SOURCES } from "../content/thomas.ts";
import { HOMEPAGE, homepageAvailableRoutes } from "../lib/homepage.ts";

const available = homepageAvailableRoutes();
const select = (curation = HOME_CURATION, scope = selectedScope, routes = available) => selectHomepage(curation, HOME_CATALOG, scope, routes);

test("creator curation is deterministic; all eligible readings remain discoverable", () => {
  assert.deepEqual(HOME_CURATION, { hero: "pliny", featured: ["perpetua", "jonah", "thomas"], discovery: "all-visitor-eligible" });
  assert.deepEqual([HOMEPAGE.hero.id, ...HOMEPAGE.featured.map(e => e.id)], ["pliny", "perpetua", "jonah", "thomas"]);
  assert.equal(HOMEPAGE.hero.href, "/human-story/pliny/");
  assert.equal(HOMEPAGE.featured[1].href, "/jonah/#jonah-1-calling");
  assert.equal(HOMEPAGE.discovery.length, VISITOR_HUMAN_GRAPH.entries.length + 2);
  assert.equal(new Set(HOMEPAGE.discovery.map(e => e.id)).size, HOMEPAGE.discovery.length);
  for (const entry of VISITOR_HUMAN_GRAPH.entries) assert.ok(HOMEPAGE.discovery.some(e => e.id === entry.id));
  assert.deepEqual(select(), select());
});

test("unknown, duplicate, ineligible and unavailable editorial selections fail explicitly", () => {
  for (const curation of [
    { ...HOME_CURATION, hero: "missing" },
    { ...HOME_CURATION, featured: ["perpetua", "perpetua"] },
    { ...HOME_CURATION, featured: ["pliny"] },
  ]) assert.throws(() => selectHomepage(curation, HOME_CATALOG, selectedScope, available), /Unknown|Duplicate/);
  for (const maturity of ["internal-draft", "excluded-experimental"] as const) {
    const scope = { ...selectedScope, entries: { ...selectedScope.entries, pliny: maturity } };
    assert.throws(() => selectHomepage(HOME_CURATION, HOME_CATALOG, scope, available), /not visitor-eligible: pliny/);
  }
  for (const id of ["pliny", "perpetua", "thomas"]) {
    const href = HOMEPAGE.discovery.find(e => e.id === id)?.href;
    assert.ok(href);
    const routes = new Set(available); routes.delete(homeRoute(href));
    assert.throws(() => select(HOME_CURATION, selectedScope, routes), /Unavailable homepage destination/);
  }
  const withoutThomas = { ...selectedScope, routes: selectedScope.routes.filter(route => route.route !== "/human-story/thomas/") };
  assert.throws(() => select(HOME_CURATION, withoutThomas), /not visitor-eligible: thomas/);
  assert.throws(() => selectHomepage(HOME_CURATION, [...HOME_CATALOG, HOME_CATALOG[0]], selectedScope, available), /Duplicate homepage catalog/);
});

test("maturity and new registrations cannot silently promote an encounter", () => {
  const scope = { ...selectedScope, entries: { ...selectedScope.entries, james: "complete" as const, exodus: "internal-draft" as const } };
  const result = select(HOME_CURATION, scope);
  assert.deepEqual(result.featured.map(e => e.id), ["perpetua", "jonah", "thomas"]);
  assert.ok(!result.discovery.some(e => e.id === "exodus"));
  assert.ok(result.discovery.some(e => e.id === "james"));
  assert.equal(selectedScope.entries.exodus, "provisional");
  const changed = { ...selectedScope, routes: [...selectedScope.routes, { route: "/new-reading/", maturity: "complete" as const, limitations: [] }] };
  const catalog = [...HOME_CATALOG, { ...HOME_CATALOG[0], id: "new-reading", href: "/new-reading/", scopeEntryId: undefined }];
  const result2 = selectHomepage(HOME_CURATION, catalog, changed, new Set([...available, "/new-reading/"]));
  assert.equal(result2.discovery.at(-1)?.id, "new-reading");
  assert.deepEqual(result2.featured.map(e => e.id), ["perpetua", "jonah", "thomas"]);
});

test("destinations are local and source-bound invitations do not invent graph evidence", () => {
  for (const href of ["https://example.com/", "//example.com/", "/missing", "/../", "/path/?draft=1"]) assert.throws(() => homeRoute(href), /Invalid homepage/);
  const sourceIds = new Set([...VISITOR_HUMAN_GRAPH.sources, ...PLINY_V3_SOURCES, ...PLINY_SOURCES, ...THOMAS_SOURCES].map(s => s.id));
  for (const invitation of Object.values(HOME_INVITATIONS)) for (const id of invitation.sourceIds) assert.ok(sourceIds.has(id), id);
  assert.ok(!VISITOR_HUMAN_GRAPH.entries.some(e => e.id === "thomas"));
  const route = readFileSync("src/app/human-story/[entry]/page.tsx", "utf8");
  assert.match(route, /id === "pliny"\) return <PlinyV3Encounter/);
  const encounter = readFileSync("src/features/human-story/pliny/PlinyV3Encounter.tsx", "utf8");
  assert.match(encounter, /<PlinyArtifact id="pliny-manuscript"/); // V4 composition, not a stale standalone route.
});
