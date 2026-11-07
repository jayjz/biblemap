"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { JAMES_MOVEMENTS, JAMES_WITNESSES, type JamesMovementId } from "@/content/james";
import { Palimpsest } from "./Palimpsest";
import { SourceLinks } from "./JamesSources";
import styles from "./james.module.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function visibleMovement(controlsHeight: number) {
  return JAMES_MOVEMENTS.filter(m => {
    const bounds = document.getElementById(m.id)?.getBoundingClientRect();
    return bounds && bounds.top <= Math.max(innerHeight * .45, controlsHeight + 1) && bounds.bottom > controlsHeight;
  }).at(-1);
}

export function JamesExperience() {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [active, setActive] = useState<JamesMovementId>("brother");
  const [witnessId, setWitnessId] = useState("paul");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dock = useRef<HTMLElement>(null);
  const movement = JAMES_MOVEMENTS.find(m => m.id === active);
  const witness = JAMES_WITNESSES.find(w => w.id === witnessId);
  if (!movement || !witness) throw new Error("Invalid James narrative selection");
  const layer = witness.layers[active];

  useEffect(() => {
    const controls = dock.current?.parentElement;
    const shell = controls?.closest<HTMLElement>("[data-james-shell]");
    if (!controls || !shell) return;
    const observer = new ResizeObserver(() => {
      shell.style.setProperty("--james-dock", `${controls.getBoundingClientRect().height}px`);
    });
    observer.observe(controls);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      if (dialog.current?.open) return;
      const visible = visibleMovement(dock.current?.parentElement?.getBoundingClientRect().height ?? 0);
      if (visible) setActive(visible.id);
    }, { rootMargin: "-18% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("[data-scene]").forEach(el => observer.observe(el));
    const onHash = () => {
      const match = JAMES_MOVEMENTS.find(m => `#${m.id}` === location.hash);
      if (match) setActive(match.id);
    };
    window.addEventListener("hashchange", onHash);
    // A fragment may have been followed before hydration registered the listener.
    const initialFrame = requestAnimationFrame(onHash);
    return () => { cancelAnimationFrame(initialFrame); observer.disconnect(); window.removeEventListener("hashchange", onHash); };
  }, []);

  const close = () => dialog.current?.close();
  const openComparison = () => {
    // Read the visible narrative when opening: focusing the sticky control must
    // never make a pending observer callback select the previous movement.
    const visible = visibleMovement(dock.current?.parentElement?.getBoundingClientRect().height ?? 0);
    if (visible) setActive(visible.id);
    dialog.current?.showModal();
  };
  return <><aside ref={dock} className={styles.evidenceDock} aria-label="Evidence at this movement">
    <div className={styles.stageInner}>
      <p className={styles.stageLabel}>{ready ? movement.label : "The surviving record"}</p>
      {ready ? <div className={styles.stageActions}>
        <button ref={trigger} className={styles.primary} onClick={openComparison}>Compare surviving witnesses</button>
      </div> : <p><a className={styles.primary} href="#james-sources">Compare surviving witnesses</a></p>}
    </div>
  </aside>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="comparison-title" onClose={() => trigger.current?.focus({ preventScroll: true })}>
      <div className={styles.dialogHeader}>
        <div><p className={styles.small}>Your place in the story: {movement.label}</p><h2 id="comparison-title">What does each witness preserve?</h2></div>
        <button className={styles.close} onClick={close} autoFocus>Return to the story</button>
      </div>
      <div className={styles.witnessButtons} role="group" aria-label="Choose a surviving witness">
        {JAMES_WITNESSES.map(w => <button key={w.id} aria-pressed={w.id === witnessId} onClick={() => setWitnessId(w.id)}>{w.name}</button>)}
      </div>
      <div className={styles.comparison}>
        <div className={styles.comparisonArt} data-empty={!layer}><Palimpsest movement={active} witness={witness.id} /><p>{layer ? "One voice comes forward. The others remain distinct." : "This part of the surface is left unwritten."}</p></div>
        <div className={styles.witnessText} aria-live="polite" aria-atomic="true">
          <p className={styles.small}>{witness.period}</p><h3>{witness.name}</h3><p className={styles.genre}>{witness.genre}</p>
          <p className={styles.layerClaim}>{layer?.text ?? "No account in the selected passages."}</p>
          <p className={styles.limit}><strong>Where this voice stops</strong>{layer?.limit ?? "Silence is not a contradiction or proof that nothing happened. This witness does not supply this part of James’s story in the passages selected here."}</p>
          <p className={styles.small}>{witness.transmission}</p>
          {layer && <SourceLinks ids={layer.sourceIds} />}
        </div>
      </div>
    </dialog>
  </>;
}
