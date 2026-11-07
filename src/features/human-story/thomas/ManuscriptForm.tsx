import styles from './manuscripts.module.css';

type WitnessId = 'nhc' | 'oxy1' | 'oxy654' | 'oxy655';
const descriptions: Record<WitnessId, string> = {
  nhc: 'A codex: leaves gathered into a book. Thomas occupies pages 32–51 within Codex II, alongside other works.',
  oxy1: 'One leaf from a codex, with writing on both sides. Only part of the collection survives on this leaf.',
  oxy654: 'A reused roll: Thomas was copied on the verso, the reverse of an earlier document.',
  oxy655: 'Fragments of a roll. Surviving columns preserve portions of sayings; gaps are not a continuous text.',
};

/** Original conceptual diagrams. No traced image, invented handwriting or measured outline. */
export function ManuscriptShape({ id }: { id: WitnessId }) {
  const roll = id === 'oxy654' || id === 'oxy655';
  return <svg viewBox="0 0 480 280" aria-hidden="true" focusable="false">
      {id === 'nhc' ? <g className={styles.papyrus}>
        <path d="M58 42 223 55 224 243 58 228Z" /><path d="M223 55 409 34 409 221 224 243Z" />
        <path d="M49 50 49 236 224 253 419 230 419 43M223 55 224 243" fill="none" />
      </g> : id === 'oxy1' ? <g className={styles.papyrus}><path d="M119 29H291V245H119Z" /><path d="M298 41H361V231H298" fill="none" /></g>
      : <g className={styles.papyrus}>
        <path d="M52 57Q35 57 35 88V219Q35 239 57 230L418 205V52Z" />
        <path d="M52 57V218Q35 216 35 231M418 52Q441 45 444 64V194Q444 212 418 205" fill="none" />
      </g>}
      <g className={styles.columns}>
        {(roll ? [88,195,302] : id === 'nhc' ? [84,260] : [146]).map((x, column) => <g key={x}>
          {[0,1,2,3,4,5,6,7].map(line => <path key={line} d={`M${x} ${86+line*15}h${(column+line)%3 === 0 ? 57 : 70}`} />)}
        </g>)}
      </g>
      {id === 'oxy655' && <g className={styles.loss}><path d="M166 45V220M281 40V212M48 133H422" /></g>}
    </svg>;
}

export function ManuscriptForm({ id }: { id: WitnessId }) {
  return <figure className={styles.object} data-manuscript-form={id}>
    <ManuscriptShape id={id} />
    <figcaption><strong>Format diagram</strong><p>{descriptions[id]}</p><small>Schematic, not a facsimile. Lines stand for writing; outlines, gaps and proportions are illustrative.</small></figcaption>
  </figure>;
}
