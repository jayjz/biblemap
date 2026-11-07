import { THOMAS_MANUSCRIPTS } from '@/content/thomas';
import { SourceLinks } from './ThomasSources';
import { ManuscriptForm } from './ManuscriptForm';
import { GreekEnding } from './GreekEnding';
import styles from './manuscripts.module.css';

export function ManuscriptWitnesses() {
  return <div className={styles.witnessDesk}>
    <fieldset className={styles.witnessChoices}><legend>Inspect a physical witness</legend>
      {THOMAS_MANUSCRIPTS.map((m,i) => <label key={m.id} htmlFor={`inspect-${m.id}`}><input id={`inspect-${m.id}`} name="manuscript-witness" type="radio" defaultChecked={i === 0} /><span>{m.title}<small>{m.language} · {m.form.split(' · ')[0]}</small></span></label>)}
    </fieldset>
    <div className={styles.witnessSheets}>{THOMAS_MANUSCRIPTS.map(m => <article key={m.id} className={styles.witnessSheet} data-witness={m.id} aria-labelledby={`sheet-${m.id}`}>
      <div className={styles.objectHeading}><p className={styles.materialLabel}>Physical witness · {m.language}</p><h3 id={`sheet-${m.id}`}>{m.title}</h3><p>{m.date}</p><p>{m.form}</p></div>
      <ManuscriptForm id={m.id} />
      <div className={styles.transmitted}><span>What survives</span><p>{m.holdings}</p></div>
      <dl className={styles.sayingPresence}><div><dt>Saying 13</dt><dd>{m.thirteen}</dd></div><div><dt>Saying 26</dt><dd>{m.twentySix}</dd></div></dl>
      {m.id === 'oxy1' && <details className={styles.inspectEnding}><summary>Inspect the surviving ending of saying 26</summary><GreekEnding /></details>}
      {m.id === 'nhc' && <p><a href="https://data.copticscriptorium.org/texts/thomasgospel/gospel-of-thomas/">Examine the Coptic in SCRIPTORIUM</a><br /><small>Diplomatic, normalized and analytic editions. Editorial restorations are part of the edition, not surviving ink.</small></p>}
      <SourceLinks ids={[m.sourceId]} /><p className={styles.limit}>Copy date, not composition date. This is a modern reading aid, not a manuscript facsimile.</p>
    </article>)}</div>
    <p className={styles.allRanges}>The three Greek fragments preserve different portions of the collection. “Not preserved” describes these physical fragments, not everything ever written in Greek.</p>
  </div>;
}
