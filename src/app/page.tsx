import HumanStoryHome, { humanStoryMetadata } from "@/features/human-story/HumanStoryHome";
import { RootEntrance } from "./RootEntrance";

// Keep draft content out of indexing until the documented publication gates pass.
export const metadata = humanStoryMetadata;

export default function HomePage() {
  return <RootEntrance><HumanStoryHome /></RootEntrance>;
}
