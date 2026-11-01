import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Human Story — BibleMap",
  description: "Explore Scripture and the human lives, places, witnesses, and art gathered around it.",
};

const doors = [
  { title: "The prophet and the city", type: "Biblical story · available", text: "A reluctant prophet. A city that repents. A question left unanswered.", href: "/jonah/", action: "Enter Jonah" },
  { title: "A world you can cross", type: "Geography · available", text: "Move through the places and time behind the stories.", href: "/explore/", action: "Open the atlas" },
];

const threads = [
  { name: "The people of Nineveh", category: "Scripture", description: "Jonah 3–4 asks who mercy includes. Begin with the text rather than an answer.", href: "/jonah/" },
  { name: "James, brother of Jesus", category: "External witness", description: "Josephus describes the death of James in Antiquities 20.200. The account is later than the events.", href: "https://academic.oup.com/book/60034/chapter/513641505", external: true },
  { name: "Augustine of Hippo", category: "Later Christian voice", description: "A first-person account of memory, desire, change and faith in the Confessions. A future authored journey.", href: "https://www.gutenberg.org/ebooks/3296", external: true },
];

export default function HumanStoryPortal() {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/">BibleMap</Link>
        <nav aria-label="Human story navigation" className={styles.nav}>
          <a href="#stories">Stories</a>
          <a href="#connections">Connections</a>
          <Link href="/jonah/">Jonah</Link>
          <Link href="/explore/">Atlas</Link>
        </nav>
      </header>
      <main id="main">
        <section className={styles.opening} aria-labelledby="portal-title">
          <div className={styles.openingText}>
            <p className={styles.context}>A BibleMap editorial experiment</p>
            <h1 id="portal-title">The human story has never been only one story.</h1>
            <p className={styles.lede}>A prophet questions mercy. A city turns. Centuries later, historians, witnesses, artists and saints carry their own accounts of what faith has meant to human lives.</p>
            <a className={styles.primaryLink} href="#stories">Begin exploring <span aria-hidden="true">↘</span></a>
          </div>
          <div className={styles.field} aria-hidden="true">
            <div className={styles.sun}></div>
            <div className={styles.horizon}></div>
            <p className={styles.fieldCaption}>Land · time · memory</p>
          </div>
        </section>
        <section className={styles.section} id="stories" aria-labelledby="stories-title">
          <div className={styles.sectionHeading}><p>Begin with the story</p><h2 id="stories-title">Enter a world, not a catalogue.</h2></div>
          <div className={styles.doors}>
            {doors.map((door) => (
              <article className={styles.door} key={door.title}>
                <p className={styles.kind}>{door.type}</p>
                <h3>{door.title}</h3><p>{door.text}</p>
                <Link href={door.href}>{door.action} <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.connections} id="connections" aria-labelledby="connections-title">
          <div className={styles.sectionHeading}><p>Beyond the page</p><h2 id="connections-title">Different kinds of testimony. Different degrees of certainty.</h2><span>These are paths for inquiry, not evidence that every account has equal historical standing.</span></div>
          <div className={styles.threadList}>
            {threads.map((thread) => (
              <article className={styles.thread} key={thread.name}>
                <span>{thread.category}</span>
                <div><h3>{thread.name}</h3><p>{thread.description}</p></div>
                {thread.external ? <a href={thread.href} target="_blank" rel="noopener noreferrer" aria-label={`Read source for ${thread.name} (external site)`}>Read source ↗</a> : <Link href={thread.href}>Explore ↗</Link>}
              </article>
            ))}
          </div>
        </section>
        <aside className={styles.note}><p>Editorial boundary</p><h2>Scripture first. Sources visible. Wonder without invented certainty.</h2><p>The biblical account, archaeological evidence, later testimony, artistic interpretation and tradition remain distinct. This is a review prototype; it does not claim new journeys are complete.</p></aside>
      </main>
      <footer className={styles.footer}><Link href="/">Return to Nineveh</Link><span>BibleMap · Human Story study</span></footer>
    </div>
  );
}
