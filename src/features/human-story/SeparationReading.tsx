"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import type { SeparationReadingText } from "@/domain/separation-reading";
import styles from "./separation.module.css";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;
const moments = [
  { id: "presence", label: "The child stays", section: "§3", locator: "Passion §3 · ANF Argument I.2", next: "Read the later passage", source: "Argument_I" },
  { id: "refusal", label: "The request is refused", section: "§6", locator: "Passion §6 · ANF Argument II.2", next: "Read what she says next", source: "Argument_II" },
  { id: "relief", label: "Her interpretation", section: "§6", locator: "Passion §6, continued · ANF Argument II.2", next: "Return to the earlier passage", source: "Argument_II" },
] as const;
const edition = "https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/";

/** Source-reading interaction, never a choice about the historical outcome. */
export function SeparationReading({ text, children }: { text: SeparationReadingText; children: ReactNode }) {
  const enhanced = useSyncExternalStore(subscribe, client, server);
  const [momentId, setMomentId] = useState<keyof SeparationReadingText>("presence");
  const [complete, setComplete] = useState(false);
  const index = moments.findIndex(moment => moment.id === momentId);
  const moment = moments[index];
  return <div className={styles.reading} data-separation-moment={momentId} data-separation-enhanced={enhanced}>
    <div hidden={!enhanced}>
      <nav className={styles.moments} aria-label="Moments in the separation passage">
        {moments.map(item => <button key={item.id} type="button" aria-current={momentId === item.id ? "step" : undefined} aria-controls="separation-source-moment" onClick={() => { setMomentId(item.id); setComplete(false); }}>
          <span>{item.section}</span>{item.label}
        </button>)}
      </nav>
      <button className={styles.completeToggle} type="button" aria-expanded={complete} aria-controls="complete-separation-text" onClick={() => setComplete(value => !value)}>{complete ? "Return to the guided reading" : "Read both complete passages"}</button>
    </div>
    <div hidden={!enhanced || complete}>
      <figure className={styles.relationship} aria-label={momentId === "presence" ? "In the account: Perpetua and her child together" : "In the account: Perpetua and her child apart"}>
        <div className={styles.contact} aria-hidden="true"><span>Perpetua</span><span>Her child</span></div>
        <figcaption>{momentId === "presence" ? "He is allowed to stay with her." : momentId === "refusal" ? "He is not returned to her." : "The child is still not returned in this paragraph."}</figcaption>
      </figure>
      <div className={styles.sourceMoment} id="separation-source-moment">
        <p className={styles.locator} aria-live="polite" aria-atomic="true">{moment.locator}{momentId === "relief" && <strong>Religious interpretation within the attributed account</strong>}</p>
        {momentId !== "presence" && <aside className={styles.remembered} aria-label="Remember the earlier passage"><span>Earlier, §3</span><q>I obtained for my infant to remain in the dungeon with me</q></aside>}
        <blockquote cite={`${edition}${moment.source}`}>{text[momentId]}</blockquote>
        {momentId === "relief" && <div className={styles.readingNote}>
          <p>Relief appears in both passages. First with the child beside her; here after the request is refused.</p>
          <p>The explanation of God’s will belongs to the attributed account. This paragraph does not tell us the child’s later life.</p>
          <small>Reading note · provisional commentary</small>
        </div>}
      </div>
      <div className={styles.turn}>
        <span>{index + 1} of 3 source moments</span>
        <button type="button" aria-controls="separation-source-moment" onClick={() => setMomentId(moments[(index + 1) % moments.length].id)}>{moment.next}<span aria-hidden="true"> ↗</span></button>
      </div>
      <p className={styles.edition}><a href={`${edition}${moment.source}`}>Read this section in the Wallis edition</a><span>R. E. Wallis, 1885 · public domain</span>{momentId === "relief" && <span>“No [longer]” corrects “no long” in the electronic transcription.</span>}</p>
    </div>
    <div id="complete-separation-text" className={styles.complete} hidden={enhanced && !complete}>{children}</div>
  </div>;
}
