import { test } from "node:test";
import assert from "node:assert/strict";
import { routePolicy } from "./seo.ts";
import type { PublicationScope, PublicationDecision } from "./publication.ts";
const scope: PublicationScope = { schemaVersion: 1, entries: {}, routes: [
  { route: "/", maturity: "complete", limitations: [] },
  { route: "/draft/", maturity: "provisional", limitations: ["review"] },
  { route: "/private/", maturity: "internal-draft", limitations: [] },
  { route: "/alias/", maturity: "complete", limitations: [], canonicalRoute: "/", indexing: "noindex" },
  { route: "/utility/", maturity: "complete", limitations: [], indexing: "noindex" },
] };
const accepted: PublicationDecision = { status: "accepted", routes: scope.routes.map(r => r.route), actor: "fixture", decidedAt: "2026-11-07T00:00:00Z", evidence: "test only", contentDigest: "", artifactDigest: "", acceptedLimitations: [] };
test("publication-aware indexing fails closed without changing creator decisions", () => {
  assert.equal(routePolicy("/", scope, { status: "pending" }).index, false);
  assert.equal(routePolicy("/", scope, accepted).index, true);
  assert.equal(routePolicy("/", scope, accepted, true).index, false);
  for (const route of ["/draft/", "/private/", "/alias/", "/utility/"]) assert.equal(routePolicy(route, scope, accepted).index, false);
  assert.equal(routePolicy("/private/", scope, accepted).available, false);
  assert.equal(routePolicy("/alias/", scope, accepted).canonical, "https://biblemap-pink.vercel.app/");
  assert.throws(() => routePolicy("/unknown/", scope, accepted), /Unclassified/);
});
