import Link from "next/link";
import { JAMES_MOVEMENTS } from "@/content/james";
import { JamesExperience } from "./JamesExperience";
import { JamesNarrative } from "./JamesNarrative";
import { JamesSources } from "./JamesSources";
import { SceneEnvironment, ArtDisclosure } from "./SceneEnvironment";
import styles from "./james.module.css";
import cinema from "./cinematic.module.css";

export function JamesEncounter({ reading = false }: { reading?: boolean }) {
  return <div data-james-shell className={`${styles.shell} ${reading ? styles.reading : ""}`}>
    <a className={styles.skip} href="#james-main">Skip to the story</a>
    <header className={styles.header}>
      <Link href="/" prefetch={false} className={styles.wordmark}>BibleMap<span>The human story</span></Link>
      <nav aria-label="Leave or change the reading"><Link href="/human-story/worlds/saints/" prefetch={false}>All lives</Link><Link href={reading ? "/human-story/james/" : "/human-story/james/reading/"} prefetch={false}>{reading ? "Visual encounter" : "Simple reading"}</Link></nav>
    </header>
    <main id="james-main" tabIndex={-1}>
      <section className={`${styles.opening} ${reading ? "" : cinema.entrance}`} aria-labelledby="james-title">
        {!reading && <SceneEnvironment place="galilee" priority />}
        <div className={styles.openingText}>
          <p className={styles.eyebrow}>A life in the surviving voices</p>
          <h1 id="james-title">James<span>The Brother<br />Who Remained</span></h1>
          <p className={styles.introduction}>A brother of Jesus. A leader in Jerusalem.<br className={styles.desktopBreak} /> Remembered as the Just.</p>
          <p className={styles.invitation}>Paul says he met him. Josephus records his death. Later Christians remember more. Enter the space between a life and the words that reach us.</p>
          <a className={styles.primary} href="#brother">Begin with the brother <span aria-hidden="true">↓</span></a>
          <p className={styles.openingNote}>Five movements · read at your own pace</p>
          {!reading && <p className={styles.openingNote}>AI-generated interpretive environment</p>}
        </div>
        {!reading && <ArtDisclosure place="Galilee" />}
      </section>
      <div className={reading ? "" : styles.journeyControls} role="region" aria-label="Story navigation and evidence"><nav className={styles.movementNav} aria-label="Movements in James’s story">
        {JAMES_MOVEMENTS.map((m, i) => <a key={m.id} href={`#${m.id}`}><span>{i + 1}</span>{m.label}</a>)}
      </nav>{!reading && <JamesExperience />}</div>
      <div className={reading ? styles.journey : styles.cinematicJourney}><JamesNarrative cinematic={!reading} /></div>
      <div className={styles.afterword}><p className={styles.eyebrow}>The brother who remained</p><p>We have his name.<br />We do not have every word.</p><a href="#james-sources">Return to the surviving record</a></div>
      <JamesSources />
    </main>
    <footer className={styles.footer}><Link href="/human-story/josephus-james/" prefetch={false}>Read Josephus in context</Link><Link href="/human-story/paul/" prefetch={false}>Meet Paul in Acts</Link><Link href="/human-story/worlds/saints/" prefetch={false}>Explore other lives</Link><a href="#james-title">Back to the opening</a></footer>
  </div>;
}
