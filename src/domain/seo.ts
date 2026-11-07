import type { PublicationScope } from "./publication.ts";

// Existing canonical origin. Never derive this from a deployment/request host.
export const CANONICAL_ORIGIN = "https://biblemap-pink.vercel.app";
export const canonicalURL = (path: string) => `${CANONICAL_ORIGIN}${path}`;

export function routePolicy(path: string, scope: Pick<PublicationScope, "routes">, decision: { status: string; routes?: readonly string[] }, preview = false) {
  const route = scope.routes.find(candidate => candidate.route === path);
  if (!route) throw new Error(`Unclassified SEO route: ${path}`);
  const available = route.maturity === "complete" || route.maturity === "provisional";
  const canonical = route.canonicalRoute ?? path;
  const index = available && route.maturity === "complete" && route.indexing !== "noindex" && canonical === path && !preview && decision.status === "accepted" && decision.routes?.includes(path) === true;
  return { available, canonical: canonicalURL(canonical), index, follow: available };
}
