import Link from "next/link";
import { HOMEPAGE } from "@/lib/homepage";
import { HOME_INTRO } from "@/content/home-editorial";
import { VISITOR_HUMAN_GRAPH } from "@/content/visitor-human-story";
import { WORLDS } from "@/features/human-story/worlds";
import { ConnectedExplorer } from "@/features/human-story/ConnectedExplorer";
import { FeaturedEncounters } from "@/features/human-story/FeaturedEncounters";
import { ArchiveArt } from "./ArchiveArt";
import { Invitation, Arrow } from "./Invitation";
import styles from "./archive.module.css";

const comparison = (() => {
  const edge = VISITOR_HUMAN_GRAPH.connections.find(item => item.id === "pliny-perpetua");
  if (!edge) throw new Error("Missing source-grounded Pliny–Perpetua editorial comparison");
  return edge;
})();
const comparisonSources = comparison.sourceIds.map(id => {
  const source = VISITOR_HUMAN_GRAPH.sources.find(item => item.id === id);
  if (!source) throw new Error(`Missing homepage comparison source: ${id}`);
  return source;
});

export function ArchiveHome() {
  return <div className={styles.archive}>
    <a className={styles.skip} href="#main">Skip to content</a>
    <header className={styles.header}>
      <Link prefetch={false} href="/" className={styles.wordmark} aria-label="BibleMap: The human story">BibleMap<span>Scripture · lives · places</span></Link>
      <nav aria-label="Homepage navigation"><a href="#encounters">The encounters</a><a href="#discover">Discover</a><Link prefetch={false} href="/explore/">Open Atlas<Arrow /></Link></nav>
    </header>
    <main id="main" tabIndex={-1}>
      <section className={styles.opening} aria-labelledby="archive-title">
        <div className={styles.intro}><h1 id="archive-title">{HOME_INTRO.title}</h1><p>{HOME_INTRO.description}</p></div>
        <ArchiveArt id="pliny" />
        <div className={styles.heroInvitation}><Invitation entry={HOMEPAGE.hero} hero /></div>
      </section>
      <div className={styles.thread} id="paths">
        <p><span className={styles.kind}>An editorial connection</span><Link prefetch={false} href="/human-story/paths/a-name-under-pressure/">{comparison.label}<Arrow /></Link></p>
        <details><summary>How are these lives connected?</summary><p>{comparison.note}</p>{comparisonSources.map(source => <a key={source.id} href={source.url}>{source.title} · {source.locator}</a>)}</details>
      </div>
      <FeaturedEncounters />
      <section className={styles.discovery} id="discover" aria-labelledby="readings-title" tabIndex={-1}>
        <div className={styles.sectionHeading}><h2 id="readings-title">The world opens further.</h2><p>Find a person, a passage, a place. Follow the sources and the connections.</p></div>
        <nav aria-label="Explore the five worlds" className={styles.worlds}>{WORLDS.map(world => <Link prefetch={false} key={world.id} href={`/human-story/worlds/${world.id}/`}>{world.name}</Link>)}</nav>
        <ConnectedExplorer entries={HOMEPAGE.discovery.map(({ id,title,subtitle,href,kind,worlds,era,searchText }) => ({ id,title,subtitle,href,kind,worlds,era,searchText }))} connections={VISITOR_HUMAN_GRAPH.connections.map(({id,from,to,kind,label})=>({id,from,to,kind,label}))} />
      </section>
      <section className={styles.evidence} aria-labelledby="source-note-title">
        <h2 id="source-note-title">What kind of trace?</h2>
        <p>Scripture, a Roman official’s testimony, a manuscript and an artist’s vision each ask to be read differently. Every encounter keeps its sources, dates and limits within reach.</p>
        <details><summary>About this exploration</summary><p>This no-index design study gathers sourced editorial drafts for review. Historical evidence, Scripture, interpretation, reception and legend retain their own identities. Existing Scripture and release-review gates remain in force.</p></details>
      </section>
    </main>
    <footer className={styles.footer}><p>BibleMap<span>A connected world, read through its sources.</span></p><Link prefetch={false} href="/jonah/#jonah-1-calling">Read Scripture</Link><Link prefetch={false} href="/nineveh/">Enter Nineveh</Link><a href="#archive-title">Back to the beginning</a></footer>
  </div>;
}
