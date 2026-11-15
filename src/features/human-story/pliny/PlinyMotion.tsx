"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { PLINY_MOVEMENTS } from "@/content/pliny";
import styles from "./pliny.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(notify: () => void) {
  const preference = matchMedia(motionQuery);
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
}
const readReducedMotion = () => matchMedia(motionQuery).matches;
const serverReducedMotion = () => true;
// Hydration is the only transition for this store; it has no later updates.
const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

/** Only orientation and a motion preference hydrate. The document is server HTML. */
export function PlinyMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  const reduced = useSyncExternalStore(subscribeMotion, readReducedMotion, serverReducedMotion);
  const [enabled, setEnabled] = useState(true);
  const [active, setActive] = useState<string>(PLINY_MOVEMENTS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          entry.target.setAttribute("data-seen", "true");
        }
      }
    }, { rootMargin: "-15% 0px -45% 0px", threshold: 0 });
    root.current?.querySelectorAll("[data-movement]").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={root} className={styles.encounter} data-encounter="pliny" data-motion={enabled && !reduced ? "on" : "off"}>
      <a href="#pliny-main" className={styles.skip}>Skip to the encounter</a>
      <div className={styles.chrome}>
      <header className={styles.header}>
        <Link prefetch={false} href="/" className={styles.brand}>BibleMap<span>The human story</span></Link>
        <Link prefetch={false} href="/human-story/worlds/witnesses/" className={styles.back}>Historical witnesses</Link>
        <div className={styles.tools}>
          <a href="#pliny-sources">Sources</a>
          {ready && <button type="button" aria-pressed={enabled && !reduced} disabled={reduced}
            onClick={() => setEnabled((value) => !value)}>
            {reduced ? "Reduced motion" : `Motion ${enabled ? "on" : "off"}`}
          </button>}
        </div>
      </header>
      <nav className={styles.progress} aria-label="The five movements">
        {PLINY_MOVEMENTS.map((movement) => <a key={movement.id} href={`#${movement.id}`}
          aria-current={ready && active === movement.id ? "location" : undefined} aria-label={`${movement.number}. ${movement.title}`}>
          <span className={styles.numeral} aria-hidden="true">{movement.number}</span>
          <span className={styles.navLong}>{movement.title}</span>
          <span className={styles.navShort} aria-hidden="true">{movement.short}</span>
        </a>)}
      </nav>
      </div>
      {children}
    </div>
  );
}
