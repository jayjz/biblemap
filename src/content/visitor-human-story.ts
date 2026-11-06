import { HUMAN_GRAPH } from "./human-story.ts";
import scope from "../../docs/release/publication-scope.json" with { type: "json" };
import { contentMaturity, selectVisitorGraph, type PublicationScope } from "../domain/publication.ts";

// Keep the complete research graph in Git; visitor imports use this selection.
const selectedScope: PublicationScope = {
  schemaVersion: 1,
  entries: Object.fromEntries(Object.entries(scope.entries).map(([id, maturity]) => [id, contentMaturity(maturity)])),
  routes: scope.routes.map(route => ({ ...route, maturity: contentMaturity(route.maturity) })),
};
export const VISITOR_HUMAN_GRAPH = selectVisitorGraph(HUMAN_GRAPH, selectedScope);
