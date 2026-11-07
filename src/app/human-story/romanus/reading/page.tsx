import { routeMetadata } from "@/lib/seo";
import { RomanusEncounter } from "@/features/human-story/romanus/RomanusEncounter";

export const metadata = routeMetadata("/human-story/romanus/reading/", "Romanus — simple reading — BibleMap", "Follow the surviving accounts of Romanus with source notes and clear distinctions between narrators in a simple reading.");

export default function RomanusReadingPage() {
  return <RomanusEncounter reading />;
}
