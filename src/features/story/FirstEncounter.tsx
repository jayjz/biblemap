/** Optional connections to philosophical works, not direct exegesis of Jonah or creator-authored narration. */
const perspectives = [
  { name: "Blaise Pascal", title: "Diversion", work: "Pensées", locator: "Brunschvicg 139 (Lafuma 136)", href: "https://www.gutenberg.org/cache/epub/18269/pg18269-images.html", text: "Pascal examines how constant activity and diversion can distract us from confronting our own condition. The parallel with Jonah's travel is a question, not Pascal's reading of Jonah." },
  { name: "Friedrich Nietzsche", title: "Freedom for what?", work: "Thus Spake Zarathustra", locator: "Part I, XVII: The Way of the Creating One; Thomas Common translation", href: "https://www.gutenberg.org/files/1998/1998-h/1998-h.htm", text: "Nietzsche asks whether liberation has a purpose beyond breaking away. Unlike Jonah's biblical framework, his argument concerns self-directed creation of values. Leaving can be courage as well as avoidance." },
  { name: "Augustine of Hippo", title: "The presence we flee", work: "Confessions", locator: "Book V, chapter 2; NPNF translation", href: "https://www.newadvent.org/fathers/110105.htm", text: "Augustine reflects on fleeing God's presence while remaining seen. This language closely echoes Jonah's flight; it is a thematic connection, not a claim that Augustine was explaining Jonah here." },
] as const;

export function FirstEncounter({ sceneId }: { sceneId: string }) {
  if (sceneId !== "jonah-1-calling" && sceneId !== "jonah-1-escape") return null;
  return <section className="story-first-encounter" aria-label="Orientation and optional philosophical perspectives">
    {sceneId === "jonah-1-calling" && <div className="story-first-orientation">
      <p className="story-eyebrow">A place to begin</p>
      <p>This is the opening of the book of Jonah. Nineveh is the city Jonah is told to visit. Read the words first; you do not need to know the geography or the interpretations to begin.</p>
      <p className="story-first-editorial">This orientation is provisional editorial guidance, not Scripture or the creator’s approved narrative.</p>
    </div>}
    {sceneId === "jonah-1-escape" && <details className="story-disclosure story-first-perspectives">
      <summary>Why do people run? <span>Optional · philosophy, not Scripture</span></summary>
      <div className="story-disclosure-body">
        <p>These thinkers did not write these passages about Jonah. Their arguments offer different ways to think about departure, avoidance, and freedom; none determines Jonah's motive.</p>
        {perspectives.map(p => <section key={p.name} className="story-first-perspective">
          <h4>{p.name} — {p.title}</h4>
          <p>{p.text}</p>
          <p><a href={p.href} target="_blank" rel="noopener noreferrer">Read {p.work}, {p.locator} ↗</a></p>
        </section>)}
        <p>The opening chapter describes Jonah's flight without explaining his motive. The book revisits the question in Jonah 4:2. These connections are provisional editorial selections for review.</p>
      </div>
    </details>}
  </section>;
}
