import type { Metadata } from "next";
import { JONAH } from "@/content/jonah";
import { JONAH_OPEN_PLACEMENTS } from "@/content/jonah-media";
import { validateStory } from "@/domain/story";
import { StoryReader } from "@/features/story/StoryReader";
import "@/features/story/story.css";

export const metadata: Metadata = {
  title: "Jonah: The Man Who Ran · BibleMap",
  description: "Read all four chapters of Jonah through Scripture, art, and questions that stay with us.",
  robots: { index: false, follow: false },
};

export default function JonahPage() {
  const errors = validateStory(JONAH);
  if (errors.length) throw new Error(errors.join("\n"));
  return <StoryReader story={JONAH} openMedia={JONAH_OPEN_PLACEMENTS} />;
}
