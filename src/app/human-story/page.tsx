import type { Metadata } from "next";
import Image from "next/image";
import { HumanStoryFrame } from "@/features/human-story/HumanStoryFrame";
import { WORLDS } from "@/features/human-story/worlds";
import styles from "@/features/human-story/human-story.module.css";

export const metadata: Metadata = {
  title: "The Human Story — BibleMap",
  description: "Follow Scripture into a connected world of human lives, places, historical witnesses, art and ideas.",
  robots: { index: false, follow: false },
};

export default function HumanStoryPortal() {
  return (
    <HumanStoryFrame>
      <section className={styles.opening} aria-labelledby="portal-title">
        <div className={styles.openingText}>
          <p className={styles.intro}>Scripture. Lives. A connected world.</p>
          <h1 id="portal-title">The human<br />story.</h1>
          <p className={styles.lede}>An ancient story opens onto a city. A city leads to a life. A life leaves a question for someone centuries later.</p>
          <p className={styles.sublede}>Explore the human story through a biblical worldview.</p>
          <a className={styles.primaryLink} href="#paths">Find a way in <span aria-hidden="true">↘</span></a>
          <a className={styles.quietLink} href="/jonah/#jonah-1-calling">Or begin with the book of Jonah</a>
        </div>
        <div className={styles.weave}>
          <svg className={styles.weaveLines} viewBox="0 0 700 650" fill="none" aria-hidden="true"><path d="M80 80C650 50 650 480 60 530M180 10C20 180 630 240 570 630M650 50C340 90 230 440 650 550" stroke="currentColor" /><circle cx="80" cy="80" r="5" fill="currentColor"/><circle cx="60" cy="530" r="5" fill="currentColor"/><circle cx="570" cy="630" r="5" fill="currentColor"/></svg>
          <p className={styles.weaveLabel}>One story, many afterlives</p>
          <figure className={styles.heroArt}>
            <Image src="/media/nineveh-depth/jonah-vine.webp" width={749} height={579} alt="Marble Jonah reclining beneath a broad-leaved plant, a later Christian artistic interpretation." priority />
            <figcaption><span>Jonah Under the Gourd Vine</span><br />280–290 CE. Later Christian art.<br /><a href="https://www.clevelandart.org/art/1965.239">Cleveland Museum of Art, 1965.239 · CC0</a></figcaption>
          </figure>
          <a className={styles.weaveNote} href="/jonah/#jonah-4-shade"><span>The biblical text</span><strong>A prophet sits outside a city.</strong><span>Read Jonah 4:5–11 <b aria-hidden="true">↗</b></span></a>
        </div>
      </section>
      <section id="paths" className={styles.paths} aria-labelledby="paths-title">
        <div className={styles.sectionHeading}><h2 id="paths-title">Follow a thread.</h2><p>Begin somewhere particular. See where it leads.</p></div>
        <div className={styles.pathGrid}>
          <article className={`${styles.path} ${styles.pathFeatured}`}><p>Stories / Atlas / Voices</p><h3>A prophet.<br />A city.<br />An open question.</h3><p>Enter Nineveh through Jonah. Read the complete story, then explore its places, objects and later readers.</p><a href="/jonah/#jonah-1-calling">Enter Jonah <span aria-hidden="true">↗</span></a></article>
          <article className={styles.path}><p>Witnesses / Culture</p><h3>Seen from<br />the outside.</h3><p>Read the exchange between Pliny and Trajan. Keep a Roman official’s account distinct from Christian testimony.</p><a href="https://faculty.georgetown.edu/jod/texts/pliny.html">Read the primary source <span aria-hidden="true">↗</span></a></article>
          <article className={styles.path}><p>Saints / Voices</p><h3>A life told<br />from within.</h3><p>Open Augustine’s Confessions: a life remembered in a work addressed to God.</p><a href="https://www.gutenberg.org/ebooks/3296">Read the Confessions <span aria-hidden="true">↗</span></a></article>
        </div>
      </section>
      <section className={styles.worlds} aria-labelledby="worlds-title">
        <div className={styles.sectionHeading}><h2 id="worlds-title">Five ways into one world.</h2><p>A person can belong to more than one story.</p></div>
        <div className={styles.worldGrid}>{WORLDS.map(world => <article id={world.id} className={styles.world} key={world.id}><h3>{world.name}</h3><p>{world.description}</p><a href={world.href}>{world.invitation} <span aria-hidden="true">↗</span></a></article>)}</div>
      </section>
      <section className={styles.sourceNote} aria-labelledby="source-note-title"><h2 id="source-note-title">Look closer. Ask what kind of source it is.</h2><p>A biblical passage, a hostile Roman account, a saint’s memory and an artist’s vision each ask to be read differently. Follow their sources, dates and limits as you explore.</p><details><summary>About this exploration</summary><p>This no-index design study gathers sourced editorial drafts for review. Historical evidence, Scripture, interpretation, reception and legend retain their own identities. Existing Scripture and release-review gates remain in force.</p></details></section>
    </HumanStoryFrame>
  );
}
