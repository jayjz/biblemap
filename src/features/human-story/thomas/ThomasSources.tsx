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
      <p>Original AI-generated interpretive environments for BibleMap, November 2026. Anonymous figures do not identify Thomas, Jesus or documented witnesses. Buildings, clothing, pottery, light and viewpoint are invented, not a recovered biblical setting.</p>
      <p>Material context: <a href="https://publications.iaa.org.il/atiqot/vol98/iss1/3/">Alexandre, Early Roman dwelling at Nazareth, Atiqot 98 (2020), abstract</a>. This regional reference does not validate a room in Jerusalem or any furnishings.</p>
      <p><a href="/media/thomas/manifest.json">Image provenance, prompts, checksums and rights</a>. Human historical and artistic review pending. No third-party image was supplied or reproduced.</p>
      <p>Manuscript format diagrams: BibleMap, original AI-assisted SVG/CSS, 6 November 2026, repository MIT license. Conceptual reading aids only; no traced manuscript photograph, exact damage outline, lost text or scale reconstruction. Greek extract: DCLP/LDAB, CC BY 3.0; edition and selection are credited beside the text.</p>
      <p>Earlier vector study: {THOMAS_ART.title} · {THOMAS_ART.creator} · {THOMAS_ART.creationDate}. Retained in the creative record, superseded in the visual encounter.</p>
      <p>{THOMAS_REVIEW.author}. {THOMAS_REVIEW.humanReview}. This noindex prototype is a working draft, not a production release.</p>
    </details>
  </section>;
}
