import type { ContentMaturity } from "./story.ts";
import type { HumanGraph } from "./human-story.ts";

export interface PublicationScope {
  schemaVersion: 1;
  entries: Record<string, ContentMaturity>;
  routes: readonly { route: string; maturity: ContentMaturity; limitations: readonly string[]; indexing?: "noindex"; canonicalRoute?: string }[];
}
export type PublicationDecision = { status: "pending" } | {
  status: "accepted";
  actor: string;
  decidedAt: string;
  evidence: string;
  contentDigest: string;
  artifactDigest: string;
  routes: readonly string[];
  acceptedLimitations: readonly string[];
};

export function indexingPolicy(value: string | undefined): "noindex" | undefined {
  if (value === undefined || value === "noindex") return value;
  throw new Error(`Unknown indexing policy: ${value}`);
}

export const visitorMaturity = (maturity: ContentMaturity) => maturity === "complete" || maturity === "provisional";

export function contentMaturity(value: string): ContentMaturity {
  if (value === "complete" || value === "provisional" || value === "internal-draft" || value === "excluded-experimental") return value;
  throw new Error(`Unknown content maturity: ${value}`);
}

/** Selection precedes rendering/static params/serialization. New entries fail closed. */
export function selectVisitorGraph(graph: HumanGraph, scope: PublicationScope): HumanGraph {
  const entries = graph.entries.filter(entry => visitorMaturity(scope.entries[entry.id]));
  const entryIds = new Set(entries.map(entry => entry.id));
  const connections = graph.connections.filter(edge => entryIds.has(edge.from) && entryIds.has(edge.to));
  const entityIds = new Set(entries.flatMap(entry => entry.entityIds));
  const entities = graph.entities.filter(entity => entityIds.has(entity.id));
  const sourceIds = new Set([
    ...entries.flatMap(entry => [...entry.sourceIds, ...entry.sections.flatMap(section => section.sourceIds)]),
    ...entities.flatMap(entity => entity.sourceIds), ...connections.flatMap(edge => edge.sourceIds),
  ]);
  // Explicit projection also prevents unknown/private fields from becoming props.
  return {
    entries: entries.map(entry => ({
      id: entry.id, title: entry.title, subtitle: entry.subtitle, worlds: [...entry.worlds], kind: entry.kind,
      era: entry.era, entityIds: [...entry.entityIds], introduction: entry.introduction,
      sections: entry.sections.map(({ id, title, text, sourceIds, kind }) => ({ id, title, text, sourceIds: [...sourceIds], kind })),
      question: entry.question, sourceIds: [...entry.sourceIds],
      ...(entry.reading ? { reading: { label: entry.reading.label, href: entry.reading.href } } : {}),
      ...(entry.atlas ? { atlas: { label: entry.atlas.label, href: entry.atlas.href, note: entry.atlas.note } } : {}),
      ...(entry.imageId ? { imageId: entry.imageId } : {}),
      // Legacy maturity metadata is retained for typed server rendering; it is not authorization.
      reviewStatus: entry.reviewStatus,
    })),
    connections: connections.map(({ id, from, to, label, kind, note, sourceIds, reviewStatus }) => ({ id, from, to, label, kind, note, sourceIds: [...sourceIds], reviewStatus })),
    entities: entities.map(({ id, type, name, sourceIds }) => ({ id, type, name, sourceIds: [...sourceIds] })),
    sources: graph.sources.filter(source => sourceIds.has(source.id)).map(({ id, title, url, locator, edition, kind, limits, checkedAt, rights }) => ({ id, title, url, locator, edition, kind, limits, checkedAt, rights })),
  };
}

/** Metadata is auditable, not cryptographic proof of the actor. Human review remains necessary. */
export function publicationErrors(scope: PublicationScope, decision: PublicationDecision, contentDigest: string, artifactDigest: string): string[] {
  const errors: string[] = [];
  const routes = scope.routes.filter(route => visitorMaturity(route.maturity));
  if (scope.schemaVersion !== 1 || !routes.length) errors.push("Invalid or empty publication scope");
  if (new Set(scope.routes.map(route => route.route)).size !== scope.routes.length || scope.routes.some(route => !/^\/(?:[a-z0-9-]+\/)*$/.test(route.route) || !["complete", "provisional", "internal-draft", "excluded-experimental"].includes(route.maturity))) errors.push("Invalid, duplicate or unclassified route");
  for (const route of scope.routes) {
    if (route.indexing !== undefined && route.indexing !== "noindex") errors.push(`Invalid indexing policy: ${route.route}`);
    if (route.canonicalRoute !== undefined && (!scope.routes.some(candidate => candidate.route === route.canonicalRoute && visitorMaturity(candidate.maturity) && !candidate.canonicalRoute) || route.indexing !== "noindex")) errors.push(`Invalid canonical alias: ${route.route}`);
  }
  if (decision.status !== "accepted") return [...errors, "Creator publication decision pending: exact candidate, routes, assets and limitations require acceptance"];
  if (!decision.actor?.trim() || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(decision.decidedAt) || !Number.isFinite(Date.parse(decision.decidedAt)) || !decision.evidence?.trim()) errors.push("Creator decision requires an actor, UTC decision date and auditable evidence");
  for (const [name, actual, expected] of [["content", decision.contentDigest, contentDigest], ["artifact", decision.artifactDigest, artifactDigest]]) {
    if (!/^sha256:[a-f0-9]{64}$/.test(actual) || actual !== expected) errors.push(`Creator decision ${name} digest does not match this candidate`);
  }
  const expected = routes.map(route => route.route).sort();
  if (JSON.stringify([...decision.routes].sort()) !== JSON.stringify(expected)) errors.push("Creator decision routes do not match the selected scope");
  const limitations = routes.flatMap(route => route.limitations);
  for (const limitation of limitations) if (!decision.acceptedLimitations.includes(limitation)) errors.push(`Limitation has no creator acceptance: ${limitation}`);
  for (const route of routes) if (route.maturity === "provisional" && !route.limitations.length) errors.push(`${route.route}: provisional publication requires a disclosed limitation`);
  return errors;
}
