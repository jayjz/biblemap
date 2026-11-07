import greek from '@/content/scripture/thomas-oxy1-26.json';
import { THOMAS_SAYING } from '@/content/thomas';
import styles from './manuscripts.module.css';

export function GreekEnding() {
  const start = THOMAS_SAYING.text.indexOf("then you'll");
  if (start < 0) throw new Error('Pinned saying 26 ending missing');
  const english = THOMAS_SAYING.text.slice(start, -1);
  return <div className={styles.greekInspection}>
    <div className={styles.missingBeginning}><span>Beginning not preserved here</span><p>The leaf begins within the saying. We leave the missing beginning unfilled.</p></div>
    <div className={styles.languagePair}>
      <figure><figcaption>Greek · P.Oxy. 1, verso 1–4</figcaption><blockquote lang="grc">{greek.lines.map((line, i) => <span key={line}><small aria-label={`Line ${i + 1}`}>{i + 1}</small>{line}</span>)}</blockquote></figure>
      <figure><figcaption>Corresponding ending · Coptic-based English</figcaption><blockquote>{english}</blockquote></figure>
    </div>
    <p>These Greek lines preserve the ending about clear sight and removing the speck. The English beside them is an excerpt of Mattison’s translation of the Coptic witness, not a new translation of this Greek leaf.</p>
    <details><summary>Transcription, damage and editorial choices</summary><p>{greek.selection} The full catalogue uses brackets for restorations, dots for uncertain letters and other editorial signs. This small extract is modern typesetting, not handwriting from the papyrus.</p><p>{greek.review}</p></details>
    <p className={styles.transcriptionCredit}><a href={greek.sourceUrl}>{greek.edition}</a>. DCLP/LDAB transcription · <a href={greek.rightsUrl}>CC BY 3.0</a>. Selected extract; next saying’s formula omitted. English: <a href={THOMAS_SAYING.sourceUrl}>Mattison, public domain</a>.</p>
  </div>;
}
