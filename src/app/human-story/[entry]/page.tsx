import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HUMAN_GRAPH } from "@/content/human-story";
import { ReadingRoom } from "@/features/human-story/ReadingRoom";
import { PerpetuaEncounter } from "@/features/human-story/PerpetuaEncounter";
import { RomanusEncounter } from "@/features/human-story/romanus/RomanusEncounter";

export const dynamicParams = false;
export function generateStaticParams() {
  return HUMAN_GRAPH.entries.map((entry) => ({ entry: entry.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ entry: string }>;
}): Promise<Metadata> {
  const { entry: id } = await params;
  const entry = HUMAN_GRAPH.entries.find((candidate) => candidate.id === id);
  return {
    title: `${entry?.title ?? "Reading"} — BibleMap`,
    description: entry?.subtitle,
  };
}
export default async function HumanStoryReading({
  params,
}: {
  params: Promise<{ entry: string }>;
}) {
  const { entry: id } = await params;
  const entry = HUMAN_GRAPH.entries.find((candidate) => candidate.id === id);
  if (!entry) notFound();
  if (id === "perpetua") return <PerpetuaEncounter />;
  if (id === "romanus") return <RomanusEncounter />;
  return <ReadingRoom entry={entry} />;
}
