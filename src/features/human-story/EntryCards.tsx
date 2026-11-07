import Link from "next/link";
import type { HumanEntry } from "@/domain/human-story";
import { EVIDENCE_LABELS } from "@/domain/human-story";
import styles from "./interior.module.css";

export function EntryCards({ entries }: { entries: readonly HumanEntry[] }) {
  return (
    <section
      className={styles.readingIndex}
      aria-labelledby="reading-index-title"
    >
      <h2 className={styles.indexHeading} id="reading-index-title" tabIndex={-1}>
        Choose a reading
      </h2>
      {entries.map((entry) => (
        <article key={entry.id} className={styles.readingRow}>
          <Link className={styles.readingDestination} aria-labelledby={`index-${entry.id}`} prefetch={false} href={`/human-story/${entry.id}/`}>
            <h3 id={`index-${entry.id}`}>
              {entry.title}
            </h3>
            <p>{entry.subtitle}</p>
            <p className={styles.entryMeta}>
              <span>{EVIDENCE_LABELS[entry.kind]}</span>
              <span>{entry.era}</span>
            </p>
            <span className={styles.readingAction}>Read the account <span aria-hidden="true">↗</span></span>
          </Link>
        </article>
      ))}
    </section>
  );
}
