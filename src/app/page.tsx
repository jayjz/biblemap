import { CANONICAL_ORIGIN } from "@/domain/seo";
import { routeMetadata } from "@/lib/seo";
import HumanStoryHome from "@/features/human-story/HumanStoryHome";
import { RootEntrance } from "./RootEntrance";

// Keep draft content out of indexing until the documented publication gates pass.
export const metadata = routeMetadata("/", "The Human Story — BibleMap", "Follow Scripture into a connected world of human lives, places, historical witnesses, art and ideas.");

export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "BibleMap", url: `${CANONICAL_ORIGIN}/`, description: "Ancient stories, geography, art and questions that stay with us." }) }} /><RootEntrance><HumanStoryHome /></RootEntrance></>;
}
