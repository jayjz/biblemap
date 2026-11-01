import Link from "next/link";
import type { HumanEntry } from "@/domain/human-story";
import { EVIDENCE_LABELS } from "@/domain/human-story";
import styles from "./human-story.module.css";

export function EntryCards({ entries }: { entries: readonly HumanEntry[] }) {
  return <div className={styles.entryGrid}>{entries.map(entry => <article key={entry.id} className={styles.entryCard}>
    <p className={styles.evidenceLabel}>{EVIDENCE_LABELS[entry.kind]}</p>
    <h3><Link prefetch={false} href={`/human-story/${entry.id}/`}>{entry.title}</Link></h3>
    <p>{entry.subtitle}</p><p className={styles.entryEra}>{entry.era}</p>
  </article>)}</div>;
}
