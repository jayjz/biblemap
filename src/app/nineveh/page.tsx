import { routeMetadata } from "@/lib/seo";
import { NinevehHome } from "../NinevehHome";

export const metadata = routeMetadata("/nineveh/", "Nineveh — The City Remains | BibleMap", "Enter Jonah’s world through Scripture, the Assyrian past, later art, and enduring questions. Begin at Nineveh or read Jonah from the beginning.");

export default function NinevehPage() {
  return <NinevehHome />;
}
