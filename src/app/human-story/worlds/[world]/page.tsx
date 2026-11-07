import { routeMetadata } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VISITOR_HUMAN_GRAPH as HUMAN_GRAPH } from "@/content/visitor-human-story";
import { WORLDS } from "@/features/human-story/worlds";
import { HumanStoryFrame } from "@/features/human-story/HumanStoryFrame";
import { EntryCards } from "@/features/human-story/EntryCards";
import { WitnessComparison } from "@/features/human-story/WitnessComparison";
import { AtlasConnections } from "@/features/human-story/AtlasConnections";
import { WorldOpening } from "@/features/human-story/WorldOpening";
import {
  LetterEncounter,
  SaintsEncounter,
} from "@/features/human-story/InteriorEncounters";
import interior from "@/features/human-story/interior.module.css";
import styles from "@/features/human-story/human-story.module.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return WORLDS.map((world) => ({ world: world.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world: id } = await params;
  const world = WORLDS.find((candidate) => candidate.id === id);
  if (!world) notFound();
  return routeMetadata(`/human-story/worlds/${id}/`, `${world.name} — The Human Story — BibleMap`, world.description);
}
export default async function HumanStoryWorld({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world: id } = await params;
  const world = WORLDS.find((candidate) => candidate.id === id);
  if (!world) notFound();
  const entries = HUMAN_GRAPH.entries.filter((entry) =>
    entry.worlds.includes(world.id),
  );
  return (
    <HumanStoryFrame activeWorld={world.id}>
      <WorldOpening world={world} />
      <section
        id="world-encounter"
        className={interior.readings}
        aria-label={`${world.name} readings`}
      >
        {world.id === "witnesses" && (
          <>
            <LetterEncounter />
            <details className={interior.accountTable}>
              <summary>Compare the five ancient accounts</summary>
              <WitnessComparison />
            </details>
          </>
        )}
        {world.id === "saints" && <SaintsEncounter />}
        {world.id === "atlas" && <AtlasConnections />}
        {world.id === "voices" && (
          <aside className={styles.saintNote}>
            <h2>Words become worlds.</h2>
            <p>
              A plant changes its name. A biblical scene moves onto a ceiling. A
              community sings. Follow interpreters, makers and readers while
              preserving their differences.
            </p>
          </aside>
        )}
        <EntryCards entries={entries} />
        <p className={styles.worldInvitation}>
          Each reading opens into other worlds. Follow its connections to a
          person, a place, another text or a later work.
        </p>
        <Link prefetch={false} href="/#paths">
          Explore paths across the five worlds
        </Link>
      </section>
    </HumanStoryFrame>
  );
}
