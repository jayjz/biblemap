import type { EvidenceKind, WorldId } from "./human-story.ts";
import { visitorMaturity, type PublicationScope } from "./publication.ts";

export interface HomeCuration {
  readonly hero: string;
  readonly featured: readonly string[];
  readonly discovery: "all-visitor-eligible";
}

export interface HomeDestination {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
  readonly kind: EvidenceKind;
  readonly worlds: readonly WorldId[];
  readonly era: string;
  readonly searchText: string;
  /** Graph entries require BOTH entry and route eligibility; standalone routes use route scope. */
  readonly scopeEntryId?: string;
}

export function homeRoute(href: string): string {
  if (!/^\/(?:[a-z0-9-]+\/)*(?:#[a-z0-9-]+)?$/.test(href)) throw new Error(`Invalid homepage destination: ${href}`);
  return href.split("#")[0];
}

/** Build-time editorial selection. Neither maturity nor Git merges choose a feature. */
export function selectHomepage(curation: HomeCuration, catalog: readonly HomeDestination[], scope: PublicationScope, availableRoutes: ReadonlySet<string>) {
  if (curation.discovery !== "all-visitor-eligible") throw new Error("Homepage discovery must include all visitor-eligible destinations");
  const byId = new Map(catalog.map(entry => [entry.id, entry]));
  if (byId.size !== catalog.length) throw new Error("Duplicate homepage catalog ID");
  const chosen = [curation.hero, ...curation.featured];
  if (new Set(chosen).size !== chosen.length) throw new Error("Duplicate homepage editorial selection");
  const eligible = (entry: HomeDestination) => {
    const route = homeRoute(entry.href);
    return (entry.scopeEntryId === undefined || visitorMaturity(scope.entries[entry.scopeEntryId])) &&
      scope.routes.some(item => item.route === route && visitorMaturity(item.maturity));
  };
  for (const entry of catalog) {
    if (!/^[a-z][a-z0-9-]+$/.test(entry.id)) throw new Error(`Invalid homepage catalog ID: ${entry.id}`);
    homeRoute(entry.href);
  }
  const required = (id: string) => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`Unknown homepage selection: ${id}`);
    if (!eligible(entry)) throw new Error(`Homepage selection is not visitor-eligible: ${id}`);
    if (!availableRoutes.has(homeRoute(entry.href))) throw new Error(`Unavailable homepage destination: ${id} (${entry.href})`);
    return entry;
  };
  const hero = required(curation.hero);
  const featured = curation.featured.map(required);
  const discovery = catalog.filter(eligible);
  for (const entry of discovery) {
    if (!availableRoutes.has(homeRoute(entry.href))) throw new Error(`Unavailable discovery destination: ${entry.id} (${entry.href})`);
  }
  // Explicitly curated first, remaining discovery in stable catalog order.
  const rank = new Map(chosen.map((id, index) => [id, index]));
  return { hero, featured, discovery: [...discovery].sort((a, b) => (rank.get(a.id) ?? chosen.length) - (rank.get(b.id) ?? chosen.length)) };
}
