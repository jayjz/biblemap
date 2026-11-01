import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HUMAN_PATHS } from "@/content/human-story-paths";
import { HUMAN_GRAPH } from "@/content/human-story";
import { CONNECTION_LABELS, EVIDENCE_LABELS } from "@/domain/human-story";
import { HumanStoryFrame } from "@/features/human-story/HumanStoryFrame";
import styles from "@/features/human-story/human-story.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return HUMAN_PATHS.map(path => ({ path: path.id })); }
export async function generateMetadata({ params }: { params: Promise<{ path: string }> }): Promise<Metadata> {
  const { path: id } = await params;
  const path = HUMAN_PATHS.find(candidate => candidate.id === id);
  return { title: `${path?.title ?? "A thread"} — BibleMap`, description: path?.description };
}
export default async function HumanStoryPath({ params }: { params: Promise<{ path: string }> }) {
  const { path: id } = await params;
  const path = HUMAN_PATHS.find(candidate => candidate.id === id);
  if (!path) notFound();
  return <HumanStoryFrame><header className={styles.worldHeader}><Link prefetch={false} href="/human-story/#paths">All threads</Link><h1>{path.title}</h1><p>{path.description}</p><p className={styles.pathBoundary}>An authored reading order across sources and eras. This is not a historical itinerary or a claim of continuous influence.</p></header>
    <nav className={styles.stopNavigation} aria-label="Stops on this reading path">{path.stops.map(stop => <a href={`#stop-${stop.entryId}`} key={stop.entryId}>{HUMAN_GRAPH.entries.find(entry => entry.id === stop.entryId)?.title}</a>)}</nav>
    <ol className={styles.pathReading}>{path.stops.map((stop, index) => {
      const entry = HUMAN_GRAPH.entries.find(candidate => candidate.id === stop.entryId);
      if (!entry) throw new Error(`Missing path stop ${stop.entryId}`);
      const previous = path.stops[index - 1];
      const connection = previous && HUMAN_GRAPH.connections.find(edge => (edge.from === previous.entryId && edge.to === entry.id) || (edge.to === previous.entryId && edge.from === entry.id));
      return <li id={`stop-${entry.id}`} key={entry.id}><div className={styles.stopNumber} aria-hidden="true">{index + 1}</div><article><p className={styles.evidenceLabel}>{EVIDENCE_LABELS[entry.kind]}</p><h2><Link prefetch={false} href={`/human-story/${entry.id}/`}>{entry.title}</Link></h2><p className={styles.entryEra}>{entry.era}</p><p className={styles.stopInvitation}>{stop.invitation}</p><p>{entry.introduction}</p><Link className={styles.stopRead} prefetch={false} href={`/human-story/${entry.id}/`}>Open the reading & sources <span aria-hidden="true">↗</span></Link>{connection && <details className={styles.pathConnection}><summary>{CONNECTION_LABELS[connection.kind]}: why this follows</summary><p>{connection.note}</p><p>Sources: {connection.sourceIds.map(sourceId => HUMAN_GRAPH.sources.find(source => source.id === sourceId)?.title).join("; ")}. Inspect these in the reading room.</p></details>}</article></li>;
    })}</ol><div className={styles.pathReturn}><Link prefetch={false} href="/human-story/#paths">Choose another thread</Link><Link prefetch={false} href="/jonah/#jonah-1-calling">Read the whole book of Jonah</Link></div>
  </HumanStoryFrame>;
}
