import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HUMAN_GRAPH } from "@/content/human-story";
import { WORLDS } from "@/features/human-story/worlds";
import { HumanStoryFrame } from "@/features/human-story/HumanStoryFrame";
import { EntryCards } from "@/features/human-story/EntryCards";
import { WitnessComparison } from "@/features/human-story/WitnessComparison";
import styles from "@/features/human-story/human-story.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return WORLDS.map(world => ({ world: world.id })); }
export async function generateMetadata({ params }: { params: Promise<{ world: string }> }): Promise<Metadata> {
  const { world: id } = await params;
  const world = WORLDS.find(candidate => candidate.id === id);
  return { title: `${world?.name ?? "Explore"} — The Human Story — BibleMap`, description: world?.description };
}
export default async function HumanStoryWorld({ params }: { params: Promise<{ world: string }> }) {
  const { world: id } = await params;
  const world = WORLDS.find(candidate => candidate.id === id);
  if (!world) notFound();
  const entries = HUMAN_GRAPH.entries.filter(entry => entry.worlds.includes(world.id));
  return <HumanStoryFrame activeWorld={world.id}>
    <header className={styles.worldHeader}><Link prefetch={false} href="/human-story/">The human story</Link><h1>{world.name}</h1><p>{world.description}</p></header>
    <section className={styles.worldReadings} aria-label={`${world.name} readings`}>
      {world.id === "witnesses" && <WitnessComparison />}
      {entries.length ? <EntryCards entries={entries} /> : <p>Start with a primary source: <Link prefetch={false} href={world.href}>{world.invitation}</Link>. Local reading rooms are being developed in this review.</p>}
      <p className={styles.worldInvitation}>Each reading opens into other worlds. Follow its connections to a person, a place, another text or a later work.</p>
      <Link prefetch={false} href="/human-story/#paths">Explore paths across the five worlds</Link>
    </section>
  </HumanStoryFrame>;
}
