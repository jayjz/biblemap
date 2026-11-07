import { routeMetadata } from "@/lib/seo";
import HumanStoryHome from "@/features/human-story/HumanStoryHome";

export const metadata = routeMetadata("/human-story/", "Explore The Human Story — BibleMap", "Explore BibleMap’s connected stories, historical witnesses, saints, places and interpreters through five worlds and three reading paths.");

export default function HumanStoryPage() {
  return <HumanStoryHome />;
}
