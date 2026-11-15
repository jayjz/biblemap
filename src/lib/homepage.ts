import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { HOME_CATALOG } from "../content/home-catalog.ts";
import { HOME_CURATION } from "../content/home-curation.ts";
import { VISITOR_HUMAN_GRAPH, selectedScope } from "../content/visitor-human-story.ts";
import { selectHomepage } from "../domain/home-curation.ts";

/** Read actual route modules before rendering, including static-param eligibility. */
export function homepageAvailableRoutes() {
  const dynamicRoute = existsSync(resolve("src/app/human-story/[entry]/page.tsx"));
  const graphRoutes = new Set(VISITOR_HUMAN_GRAPH.entries.map(entry => `/human-story/${entry.id}/`));
  return new Set(selectedScope.routes.filter(({ route }) =>
    existsSync(resolve("src/app", `.${route}`, "page.tsx")) || (dynamicRoute && graphRoutes.has(route)),
  ).map(({ route }) => route));
}

export const HOMEPAGE = selectHomepage(HOME_CURATION, HOME_CATALOG, selectedScope, homepageAvailableRoutes());
