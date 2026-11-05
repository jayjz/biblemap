import { JAMES_MOVEMENTS, JAMES_QUOTES, JAMES_SOURCES } from "@/content/james";
import { MovementSources } from "./JamesSources";
import styles from "./james.module.css";
import { AppearanceScene, BrotherScene, JerusalemScene, MemoryScene, RecordScene } from "./JamesCinematic";

export function JamesNarrative({ cinematic = false }: { cinematic?: boolean }) {
  return <div className={styles.narrative}>
    {JAMES_MOVEMENTS.map((movement, index) => {
      if (cinematic && movement.id === "brother") return <BrotherScene key={movement.id} movement={movement} />;
      if (cinematic && movement.id === "appearance") return <AppearanceScene key={movement.id} movement={movement} />;
      if (cinematic && movement.id === "jerusalem") return <JerusalemScene key={movement.id} movement={movement} />;
      if (cinematic && movement.id === "record") return <RecordScene key={movement.id} movement={movement} />;
      if (cinematic && movement.id === "remained") return <MemoryScene key={movement.id} movement={movement} />;
      const quote = movement.quote ? JAMES_QUOTES[movement.quote] : null;
      const quoteSource = quote ? JAMES_SOURCES.find(s => s.id === quote.sourceId) : null;
      if (quote && !quoteSource) throw new Error(`Missing quotation source: ${quote.sourceId}`);
      return <section id={movement.id} key={movement.id} className={styles.movement} aria-labelledby={`${movement.id}-title`} tabIndex={-1} data-scene={movement.id}>
        <p className={styles.movementLabel}><span>{String(index + 1).padStart(2, "0")}</span>{movement.label}</p>
        <p className={styles.place}>{movement.place}</p>
        <h2 id={`${movement.id}-title`}>{movement.title}</h2>
        {quote && quoteSource && <figure className={styles.quotation}>
          <blockquote>{quote.text}</blockquote>
          <figcaption><a href={quoteSource.url}>{quote.reference}</a> · World English Bible</figcaption>
        </figure>}
        {movement.paragraphs.map(p => <p key={p.locator}>{p.text}</p>)}
        <MovementSources movement={movement} />
        {JAMES_MOVEMENTS[index + 1] && <a className={styles.next} href={`#${JAMES_MOVEMENTS[index + 1].id}`}>Continue: {JAMES_MOVEMENTS[index + 1].label}<span aria-hidden="true"> ↓</span></a>}
      </section>;
    })}
  </div>;
}
