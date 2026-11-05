import { JAMES_MOVEMENTS, type JamesMovement } from "@/content/james";
import { MovementSources, SourceLinks } from "./JamesSources";
import { SceneEnvironment, ArtDisclosure } from "./SceneEnvironment";
import { JerusalemRelationships } from "./JerusalemRelationships";
import styles from "./cinematic.module.css";

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
