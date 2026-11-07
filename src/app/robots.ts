import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/domain/seo";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // Crawlability is required to see page-level noindex. This is not access control.
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${CANONICAL_ORIGIN}/sitemap.xml` };
}
