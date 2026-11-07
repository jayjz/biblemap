import { routeMetadata } from "@/lib/seo";
import { JONAH } from "@/content/jonah";
import { JONAH_OPEN_PLACEMENTS } from "@/content/jonah-media";
import { validateStory } from "@/domain/story";
import { projectVisitorStory } from "@/domain/visitor-story";
import { projectVisitorMedia } from "@/domain/visitor-media";
import { StoryReader } from "@/features/story/StoryReader";
import "@/features/story/story.css";

export const metadata = routeMetadata("/jonah/", "Jonah: The Man Who Ran — BibleMap", "Read all four chapters of Jonah through Scripture, art, and questions that stay with us.");

export default function JonahPage() {
  const errors = validateStory(JONAH);
  if (errors.length) throw new Error(errors.join("\n"));
  return <StoryReader story={projectVisitorStory(JONAH)} openMedia={JONAH_OPEN_PLACEMENTS.map(({ sceneIds, asset }) => ({ sceneIds, asset: projectVisitorMedia(asset) }))} />;
}
