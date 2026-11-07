import type { MetadataRoute } from "next";
import { routePolicy } from "@/domain/seo";
import { seoScope, seoDecision, isPreview } from "@/lib/seo";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return seoScope.routes.flatMap(({ route }) => {
    const policy = routePolicy(route, seoScope, seoDecision, isPreview);
    return policy.index ? [{ url: policy.canonical }] : [];
  });
}
