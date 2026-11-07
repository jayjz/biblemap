"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { PERPETUA_PASSAGES } from "@/content/perpetua-passages";
import { ArtworkImage } from "./ArtworkImage";
import styles from "./prison.module.css";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;
const moments = [
  { id: "expected", title: "The expected beasts", note: "The account names an Egyptian opponent instead. A public sentence becomes a different kind of contest inside the vision." },
  { id: "changed", title: "A changed body", note: "Helpers rub the body with oil. The trainer offers a branch with golden apples. After the contest he calls her ‘Daughter’. The vision’s changes do not erase its gendered language." },
  { id: "waking", title: "On waking", note: "She interprets the struggle through her faith and expects victory. This is still before the games. The account of her death will come from another writer." },
] as const;

/** A reading of a reported experience, never a simulated fight or choice of fate. */
export function PerpetuaVision() {
  const enhanced = useSyncExternalStore(subscribe, client, server);
  const [index, setIndex] = useState(0);
  const sourceStart = useRef<HTMLDivElement>(null);
  function turn(next: number) {
    setIndex(next);
    requestAnimationFrame(() => sourceStart.current?.focus({ preventScroll: true }));
  }
  return <div className={styles.visionEncounter} data-vision-moment={moments[index].id}>
    <figure className={styles.visionField}>
      <ArtworkImage src="/media/human-story/perpetua-vision.webp" width={1536} height={1024} alt="AI-generated interpretive artwork: two shifting human shadows inside an impossible dark arena, with an opening of light and a branch bearing gold fruit. Not a reconstruction or historical evidence." />
      <figcaption>Contemporary interpretation of a reported vision · AI-generated artwork.<br /><a href="#source-vision-art">Creation, source imagery & limits</a></figcaption>
    </figure>
    <div className={styles.visionText}>
      <nav aria-label="Read the reported vision" hidden={!enhanced}>
        {moments.map((moment, i) => <button key={moment.id} type="button" aria-current={i === index ? "step" : undefined} aria-controls="vision-source" onClick={() => turn(i)}>{moment.title}</button>)}
      </nav>
      <div id="vision-source" ref={sourceStart} tabIndex={-1} aria-live={enhanced ? "polite" : undefined} aria-atomic="true">
        {moments.map((moment, i) => {
          const passage = PERPETUA_PASSAGES[moment.id];
          return <div key={moment.id} hidden={enhanced && index !== i} data-vision-passage={moment.id}>
            <h3>{moment.title}</h3>
            <blockquote cite={passage.url}>{passage.text}</blockquote>
            <p className={styles.visionNote}>{moment.note}</p>
            <p className={styles.quoteCredit}><a href={passage.url}>{passage.locator}</a><br />{passage.speaker} · R. E. Wallis, 1885</p>
          </div>;
        })}
      </div>
      <button className={styles.visionNext} type="button" hidden={!enhanced} onClick={() => turn((index + 1) % moments.length)}>{index === 2 ? "Read the vision again" : `Continue: ${moments[index + 1].title}`}</button>
      <p className={styles.editorialLabel}>Reading notes · provisional interpretation of Passion §10</p>
    </div>
  </div>;
}
