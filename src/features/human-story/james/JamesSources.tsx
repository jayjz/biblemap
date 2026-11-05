import { JAMES_MOVEMENTS, JAMES_SOURCES, JAMES_WITNESSES, type JamesMovement } from "@/content/james";
import styles from "./james.module.css";

export function SourceLinks({ ids }: { ids: readonly string[] }) {
  return <ul className={styles.sourceLinks}>{ids.map(id => {
    const source = JAMES_SOURCES.find(s => s.id === id);
    if (!source) throw new Error(`Unknown James source: ${id}`);
    return <li key={id}><a href={source.url}>{source.title}</a><span>{source.locator}</span></li>;
  })}</ul>;
}

export function MovementSources({ movement }: { movement: JamesMovement }) {
  return <details className={styles.movementSources}>
    <summary>Sources for {movement.label.toLowerCase()}</summary>
    <p>Editorial summary, separate from the ancient texts. Each paragraph follows the references below.</p>
    <ol>{movement.paragraphs.map((p, i) => <li key={p.locator}><p>Paragraph {i + 1}: {p.locator}</p><SourceLinks ids={p.sourceIds} /></li>)}</ol>
  </details>;
}

export function JamesSources() {
  return <section id="james-sources" className={styles.sources} aria-labelledby="sources-title" tabIndex={-1}>
    <p className={styles.eyebrow}>The surviving record</p>
    <h2 id="sources-title">Keep the voices distinct.</h2>
    <p>Read each witness in context. A letter, a historical notice and a later tradition preserve different kinds of knowledge.</p>
    <details className={styles.sourceDetail}>
      <summary>Compare every witness, movement by movement</summary>
      <p>This text comparison also works without JavaScript. “No account” means no account in the passages selected here, not proof that an event did not happen.</p>
      {JAMES_MOVEMENTS.map(m => <details key={m.id} className={styles.sourceDetail}>
        <summary>{m.label}</summary>
        {JAMES_WITNESSES.map(w => {
          const layer = w.layers[m.id];
          return <article key={w.id} className={styles.staticWitness}>
          <h3>{w.name}</h3><p className={styles.small}>{w.genre}</p>
          <p>{w.layers[m.id]?.text ?? "No account in the selected passages."}</p>
          <p>{w.layers[m.id]?.limit ?? "This silence does not establish what happened."}</p>
          {layer && <SourceLinks ids={layer.sourceIds} />}
        </article>; })}
      </details>)}
    </details>
    {JAMES_SOURCES.map(s => <details className={styles.sourceDetail} key={s.id} id={`source-${s.id}`}>
      <summary>{s.title}</summary>
      <p><a href={s.url}>{s.locator}</a></p><p>{s.edition}</p><p>{s.limits}</p>
      <p className={styles.small}>{s.rights} Checked {s.checkedAt}.</p>
    </details>)}
    <details className={styles.sourceDetail}>
      <summary>About the title, artwork and this edition</summary>
      <p>“The Brother Who Remained” is a modern framing of James’s continuing presence in the Jerusalem sources. It does not mean he never traveled, alone remained faithful, or outlived every disciple.</p>
      <p>The moving sheets, erased lines, open space and horizon are original AI-assisted SVG/CSS artwork made for BibleMap in November 2026. They are symbolic, not ancient manuscripts, an archaeological city plan or a reconstruction of a building. The Josephus sheet uses the identifying phrase “whose name was James” from Whiston’s public-domain translation. Other marks are abstract lines, not simulated ancient writing. Code and original composition follow the repository’s MIT license; no third-party image or audio is used.</p>
      <p>Scripture quotations use the public-domain World English Bible, updated 66-book edition. The final comma in 1 Corinthians 15:7 is retained: its sentence continues in verse 8. <a href="https://ebible.org/engwebp/copyright.htm">Publisher’s rights statement</a>.</p>
      <p>AI-assisted editorial draft for creator review. Historical, theological, literary and artistic review is pending. No human approval is claimed. The narrative and visual staging remain on BibleMap’s no-index review surface.</p>
    </details>
  </section>;
}
