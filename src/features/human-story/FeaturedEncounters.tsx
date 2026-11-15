import Link from "next/link";
import { HOMEPAGE } from "@/lib/homepage";
import { ArchiveArt } from "@/features/homepage/ArchiveArt";
import { Invitation } from "@/features/homepage/Invitation";
import { homeInvitation } from "@/content/home-editorial";
import styles from "@/features/homepage/archive.module.css";

/** The manifest owns selection and order. Each life keeps its own visual language. */
export function FeaturedEncounters() {
  return <section id="encounters" className={styles.encounters} aria-labelledby="encounters-title" tabIndex={-1}>
    <div className={styles.sectionHeading}><h2 id="encounters-title">Other lives. Other voices.</h2><p>A prison account. A biblical book. An encounter carried in writing.</p></div>
    <div className={styles.featuredSpread}>
      {HOMEPAGE.featured.map(entry => {
        // Also fail on a selected destination without an implemented editorial treatment.
        const copy = homeInvitation(entry.id);
        if (entry.id !== "perpetua" && entry.id !== "jonah" && entry.id !== "thomas") throw new Error(`No homepage composition for ${entry.id}`);
        return <article key={entry.id} id={entry.id === "thomas" ? "thomas-invitation" : `${entry.id}-invitation`} className={styles[entry.id]} aria-label={copy.name}>
          <Invitation entry={entry} />
          <ArchiveArt id={entry.id} />
          {entry.id === "thomas" && <div className={styles.sayings}><p><strong>The Gospel of Thomas</strong>A separately attributed sayings collection. Its authorship is uncertain.</p><Link prefetch={false} href="/human-story/thomas/sayings/">Explore the sayings & manuscripts</Link></div>}
        </article>;
      })}
    </div>
  </section>;
}
