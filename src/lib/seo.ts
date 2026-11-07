import type { Metadata } from "next";
import rawScope from "../../docs/release/publication-scope.json";
import { indexingPolicy, contentMaturity, type PublicationScope } from "../domain/publication";
import { canonicalURL, routePolicy } from "../domain/seo";

export const seoScope: PublicationScope = {
  schemaVersion: 1,
  entries: Object.fromEntries(Object.entries(rawScope.entries).map(([id, maturity]) => [id, contentMaturity(maturity)])),
  routes: rawScope.routes.map(route => ({ ...route, maturity: contentMaturity(route.maturity), indexing: indexingPolicy(route.indexing) })),
};
// Approval is detached from build inputs. This candidate retains noindex even
// after acceptance. An indexing change requires a new verified/accepted build.
export const seoDecision = { status: "pending" } as const;
export const isPreview = process.env.VERCEL_ENV === "preview";
export function routeMetadata(path: string, title: string, description: string): Metadata {
  const policy = routePolicy(path, seoScope, seoDecision, isPreview);
  const portalImages = path === "/" || path === "/human-story/" ? [{
    url: canonicalURL("/media/nineveh-depth/jonah-vine.webp"), width: 749, height: 579,
    alt: "Jonah Under the Gourd Vine. Later Christian art, Cleveland Museum of Art, CC0.",
  }] : undefined;
  return {
    title, description,
    alternates: { canonical: policy.canonical },
    robots: { index: policy.index, follow: policy.follow },
    openGraph: { title, description, type: "website", url: policy.canonical, siteName: "BibleMap", images: portalImages },
    twitter: { card: portalImages ? "summary_large_image" : "summary", title, description, images: portalImages?.map(image => image.url) },
  };
}
