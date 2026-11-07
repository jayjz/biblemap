import { routeMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { NinevehEncounter } from "@/features/nineveh/NinevehEncounter";
import "@/features/nineveh/nineveh.css";

export const metadata = routeMetadata("/experiments/nineveh/", "Nineveh — experimental encounter — BibleMap", "An experimental encounter with Jonah 3:10–4:4, at your own pace.");

export default function NinevehPage() {
  // Local creative review is not publication approval for generated artwork.
  if (process.env.BIBLEMAP_NINEVEH_REVIEW !== "1") notFound();
  return <NinevehEncounter />;
}
