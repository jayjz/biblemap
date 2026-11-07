import { JAMES_MOVEMENTS, JAMES_QUOTES, JAMES_SOURCES, JAMES_WITNESSES, type JamesMovement } from "@/content/james";
import { MovementSources, SourceLinks } from "./JamesSources";
import { SceneEnvironment, ArtDisclosure } from "./SceneEnvironment";
import { JerusalemRelationships } from "./JerusalemRelationships";
import { Palimpsest } from "./Palimpsest";
import styles from "./cinematic.module.css";

function SceneProse({ movement }: { movement: JamesMovement }) {
  return <div className={styles.prose}>{movement.paragraphs.map(p => <p key={p.locator}>{p.text}</p>)}</div>;
}

function SceneQuote({ which }: { which: keyof typeof JAMES_QUOTES }) {
  const quote = JAMES_QUOTES[which];
  const source = JAMES_SOURCES.find(s => s.id === quote.sourceId);
  if (!source) throw new Error(`Missing source for ${which}`);
  return <figure className={styles.sceneQuote}><blockquote>{quote.text}</blockquote><figcaption><a href={source.url}>{quote.reference}</a> · World English Bible</figcaption></figure>;
}

export function BrotherScene({ movement }: { movement: JamesMovement }) {
  return <section id="brother" data-scene="brother" tabIndex={-1} aria-labelledby="brother-title" className={`${styles.scene} ${styles.brother}`}>
    <div className={styles.domesticOpening}>
      <div className={styles.domesticTitle}><p>I · The brother</p><p>Galilee · the family setting</p><h2 id="brother-title">Before a title,<br />a relationship.</h2><p>A name in a family.<br />Not a recovered childhood.</p></div>
      <div className={styles.domesticWindow}><SceneEnvironment place="galilee" /><ArtDisclosure place="Galilee" /></div>
    </div>
    <div className={styles.brotherReading}><SceneQuote which="meeting" /><SceneProse movement={movement} /></div>
    <SceneEnd movement={movement} />
  </section>;
}

export function AppearanceScene({ movement }: { movement: JamesMovement }) {
  return <section id="appearance" data-scene="appearance" tabIndex={-1} aria-labelledby="appearance-title" className={`${styles.scene} ${styles.appearance}`}>
    <div className={styles.appearanceOpening}><p>II · The appearance</p><h2 id="appearance-title">One line.<br /> No scene survives.</h2><SceneQuote which="appearance" /><p className={styles.unrecorded}>No place. No dialogue. No description of what James saw.</p><p className={styles.appearanceNote}>Paul reports an appearance to James.<br />He does not supply an encounter we can stage.</p></div>
    <SceneProse movement={movement} /><SceneEnd movement={movement} />
  </section>;
}

export function MemoryScene({ movement }: { movement: JamesMovement }) {
  return <section id="remained" data-scene="remained" tabIndex={-1} aria-labelledby="remained-title" className={`${styles.scene} ${styles.memory}`}>
    <div className={styles.memoryOpening}><div><p>V · What remained</p><h2 id="remained-title">The life ends.<br />The telling grows.</h2><p>Early testimony and later remembrance.<br />A longer story is not necessarily another witness.</p></div><div className={styles.memoryArt}><Palimpsest movement="remained" /><p>Symbolic artwork · not an ancient manuscript</p></div></div>
    <SceneProse movement={movement} />
    <div className={styles.transmission}><h3>Follow a voice through time.</h3><p>These are kinds of testimony and transmission, not a count of independent confirmations.</p>{JAMES_WITNESSES.map(w => <details key={w.id}><summary><span>{w.name === "Later memory" ? "Hegesippus → Eusebius" : w.name}</span><span>{w.period}</span></summary><p>{w.genre}</p><p>{w.layers.remained?.text}</p><p className={styles.memoryLimit}>{w.layers.remained?.limit}</p><p>{w.transmission}</p>{w.layers.remained && <SourceLinks ids={w.layers.remained.sourceIds} />}</details>)}</div>
    <SceneEnd movement={movement} />
  </section>;
}

export function SceneEnd({ movement }: { movement: JamesMovement }) {
  const index = JAMES_MOVEMENTS.findIndex(m => m.id === movement.id);
  const next = JAMES_MOVEMENTS[index + 1];
  return <div className={styles.sceneEnd}><MovementSources movement={movement} />{next && <a href={`#${next.id}`} className={styles.continue}>Continue: {next.label}<span aria-hidden="true"> ↓</span></a>}</div>;
}

export function JerusalemScene({ movement }: { movement: JamesMovement }) {
  return <section id="jerusalem" data-scene="jerusalem" tabIndex={-1} aria-labelledby="jerusalem-title" className={`${styles.scene} ${styles.jerusalem}`}>
    <div className={styles.cityOpening}>
      <SceneEnvironment place="jerusalem" />
      <div className={styles.cityTitle}><p>III · Jerusalem</p><h2 id="jerusalem-title">A community.<br />A difficult fellowship.</h2><p>James, Paul, Peter, John.<br />Recognition did not remove disagreement.</p></div>
      <ArtDisclosure place="Jerusalem" />
    </div>
    <JerusalemRelationships />
    <SceneEnd movement={movement} />
  </section>;
}

const recordHeadings = ["Ananus acts between governors", "Citizens object. Authority responds.", "The boundaries of the notice"];
export function RecordScene({ movement }: { movement: JamesMovement }) {
  return <section id="record" data-scene="record" tabIndex={-1} aria-labelledby="record-title" className={`${styles.scene} ${styles.record}`}>
    <header className={styles.recordOpening}>
      <p className={styles.recordLocator}>IV · The record<br />Jerusalem · around 62 CE, inferred</p>
      <h2 id="record-title">His death enters<br />another history.</h2>
      <figure className={styles.recordName}><blockquote>whose name<br />was James</blockquote><figcaption>Josephus · <a href="https://penelope.uchicago.edu/josephus/ant-20.html">Antiquities 20.200</a><br />An identifying phrase in Whiston’s translation, 1737.</figcaption></figure>
      <p className={styles.recordBridge}>The city gives way to a brief notice.<br />James and others are delivered for stoning.</p>
      <p className={styles.recordDate}>The event: around 62 CE.<br />The history: written around 93/94 CE.<br />A later account, not a trial transcript.</p>
    </header>
    <div className={styles.recordDocket}><p>Read the notice in its political setting.</p>{movement.paragraphs.map((p, index) => <details key={p.locator} open={index === 0} className={styles.recordEntry}><summary><span>{index + 1}</span>{recordHeadings[index]}</summary><div><p>{p.text}</p><SourceLinks ids={p.sourceIds} /></div></details>)}</div>
    <SceneEnd movement={movement} />
  </section>;
}
