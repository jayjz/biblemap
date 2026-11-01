import type { ReactNode } from "react";
import Link from "next/link";
import { WORLDS } from "./worlds";
import styles from "./human-story.module.css";

export function HumanStoryFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">Skip to content</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/human-story/" aria-label="BibleMap: The human story">
          <svg width="27" height="30" viewBox="0 0 27 30" fill="none" aria-hidden="true"><path d="M3 4v22M13 2v24M23 4v22M3 10c7-10 13 15 20 3M3 19c7-10 13 15 20 3" stroke="currentColor" strokeWidth="1.6" /></svg>
          <span>BibleMap<small>The human story</small></span>
        </a>
        <nav aria-label="Explore the five worlds" className={styles.nav}>
          {WORLDS.map(world => <a key={world.id} href={`/human-story/#${world.id}`}>{world.name}</a>)}
        </nav>
        <a className={styles.atlasLink} href="/explore/">Open Atlas <span aria-hidden="true">↗</span></a>
      </header>
      <main id="main" tabIndex={-1}>{children}</main>
      <footer className={styles.footer}>
        <Link href="/" prefetch={false}>Return to Nineveh</Link>
        <p>Scripture at the center. A world of connections.</p>
        <a href="/jonah/#jonah-1-calling">Read Jonah from the beginning</a>
      </footer>
    </div>
  );
}
