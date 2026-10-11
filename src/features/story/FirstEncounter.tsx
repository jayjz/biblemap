import { DISCOVERY_SOURCES } from '@/content/jonah-discoveries';

/** A thematic connection, not an explanation of Jonah's psychology. */
export function FirstEncounter({ sceneId }: { sceneId: string }) {
  if (sceneId !== 'jonah-1-escape') return null;
  return <section className="story-first-encounter" aria-label="A philosophical connection">
    <p className="story-eyebrow">An idea to travel with / Blaise Pascal</p>
    <h3>Distance is not always escape.</h3>
    <p>In <em>Pensées</em>, Pascal considers the restless search for occupation: sometimes we pursue the bustle of a journey because stillness leaves us alone with ourselves.</p>
    <details className="story-disclosure story-first-perspectives"><summary>Why do people run?</summary>
      <div className="story-disclosure-body"><h4>Blaise Pascal — Diversion</h4><p>Pascal examines diversion as a way of avoiding our vulnerability and mortality. That is a question to bring to the act of leaving, not a diagnosis of Jonah. This passage tells us what Jonah does; his own explanation comes later.</p>
        <p>What are we free to do when we leave—and what responsibility travels with us?</p>
        <a href={DISCOVERY_SOURCES.pascal.url} target="_blank" rel="noreferrer">Read {DISCOVERY_SOURCES.pascal.title} ↗</a><p><small>Thematic connection · paraphrase, not quotation or direct biblical interpretation.</small></p>
      </div>
    </details>
  </section>;
}
