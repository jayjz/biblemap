import { THOMAS_ART, THOMAS_REVIEW, THOMAS_SOURCES } from '@/content/thomas';
import styles from './thomas.module.css';

export function SourceLinks({ ids }: { ids: readonly string[] }) {
  return <span className={styles.sourceLinks}>{ids.map(id => {
    const source = THOMAS_SOURCES.find(s => s.id === id);
    if (!source) throw new Error(`Unknown Thomas source ${id}`);
    return <a key={id} href={source.url}>{source.title} · {source.locator}</a>;
  })}</span>;
}

export function ThomasSources() {
  return <section className={styles.sources} id="thomas-sources" tabIndex={-1} aria-labelledby="sources-title">
    <h2 id="sources-title">Read the surviving sources.</h2>
    <p>Scripture, manuscript witnesses, scholarship and later traditions preserve different kinds of evidence.</p>
    <details><summary>Sources, editions and limits</summary><div className={styles.sourceList}>{THOMAS_SOURCES.map(s => <article key={s.id} id={s.id}>
      <h3><a href={s.url}>{s.title}</a></h3><p>{s.locator}</p><p>{s.edition}</p><p>{s.limits}</p><small>{s.rights} Checked {s.checkedAt}.</small>
    </article>)}</div></details>
    <details id="art-provenance"><summary>Artwork and editorial provenance</summary>
      <p>{THOMAS_ART.title} · {THOMAS_ART.creator} · {THOMAS_ART.creationDate}.</p><p>{THOMAS_ART.limits}</p><p>{THOMAS_ART.rights}</p>
      <p>{THOMAS_REVIEW.author}. {THOMAS_REVIEW.humanReview}. This noindex prototype is a working draft, not a production release.</p>
    </details>
  </section>;
}
