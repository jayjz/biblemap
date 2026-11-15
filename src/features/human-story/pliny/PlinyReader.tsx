"use client";

import { createContext, useContext, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import styles from "./pliny-v3.module.css";

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const KeptSentence = createContext<{ ready: boolean; kept: boolean; toggle: () => void; release: () => void } | null>(null);

export function KeepSentenceButton() {
  const context = useContext(KeptSentence);
  if (!context) throw new Error("KeepSentenceButton requires the Pliny reader");
  if (!context.ready) return null;
  return <button type="button" aria-pressed={context.kept} className={styles.keepButton} onClick={context.toggle}>{context.kept ? "Sentence kept" : "Keep this sentence"}<span aria-hidden="true"> ↗</span></button>;
}

export function ReleaseSentenceButton() {
  const context = useContext(KeptSentence);
  if (!context) throw new Error("ReleaseSentenceButton requires the Pliny reader");
  return context.ready && context.kept ? <button type="button" className={styles.releaseButton} onClick={context.release}>Put the sentence down</button> : null;
}

/** Only a reader-held quotation hydrates. No animation, scrolling loop or source packet. */
export function PlinyReader({ children, sentence }: { children: ReactNode; sentence: string }) {
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const [kept, setKept] = useState(false);
  const sourcesLink = useRef<HTMLAnchorElement>(null);
  function release() {
    setKept(false);
    sourcesLink.current?.focus({ preventScroll: true });
  }
  return <KeptSentence.Provider value={{ ready, kept, toggle: () => setKept(value => !value), release }}><div className={styles.encounter} data-encounter="pliny" data-version="4" data-enhanced={ready} data-kept={kept} data-motion="off">
    <a href="#pliny-main" className={styles.skip}>Skip to the reading</a>
    <header className={styles.header}>
      <Link prefetch={false} href="/" className={styles.brand}>BibleMap</Link>
      <Link prefetch={false} href="/human-story/worlds/witnesses/" className={styles.back}>Historical witnesses</Link>
      <div className={styles.tools}>
        {ready && kept ? <a href="#pliny-comparison" className={styles.keptLink}>First letter kept<span aria-hidden="true"> ↙</span></a> : null}
        <a ref={sourcesLink} href="#pliny-sources">Sources</a>
      </div>
    </header>
    <aside className={styles.carried} aria-label="Kept sentence from the letter to Paternus" hidden={!kept || !ready}>
      <p className={styles.carriedLabel}>From the first letter</p>
      <blockquote>{sentence}</blockquote>
      <a href="#pliny-text-household" className={styles.citation}>Pliny to Paternus · 8.16<br />Melmoth / Bosanquet · excerpt</a>
      <button type="button" onClick={release}>Put the sentence down</button>
      <a href="#pliny-comparison" className={styles.compareLink}>Bring the letters together<span aria-hidden="true"> ↙</span></a>
    </aside>
    {children}
  </div></KeptSentence.Provider>;
}
