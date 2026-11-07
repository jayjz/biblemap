import { ROMANUS_SOURCES, type RomanusMovement } from "@/content/romanus";
import styles from "./romanus.module.css";

export function RomanusEvidence({ movement }: { movement: RomanusMovement }) {
  return <details className={styles.evidence}>
    <summary>Sources for this movement</summary>
    <ul>{movement.paragraphs.map((p, i) => {
      const source = ROMANUS_SOURCES.find(s => s.id === p.sourceId);
      if (!source) throw new Error(`Missing Romanus source: ${p.sourceId}`);
      return <li key={`${p.sourceId}-${i}`}><a href={`#source-${source.id}`}>{source.title}</a><span>{p.locator}</span></li>;
    })}</ul>
    <p>Original editorial summaries. Reported actions and theological interpretations remain attributable to the texts named here.</p>
  </details>;
}

export function RomanusSources() {
  return <details id="romanus-research" className={styles.research}>
    <summary>Read the sources, uncertainties and image record</summary>
    <div className={styles.sourceIntro}>
      <h2>The writing that reaches us.</h2>
      <p>This is a historical Christian story, not a passage of Scripture. Its surviving accounts speak from particular Christian perspectives. Multiple versions and later retellings do not amount to multiple independent eyewitnesses.</p>
      <p>AI-assisted editorial draft for human review. Summaries, transitions, diagram and typographic composition are modern work for BibleMap. Historical, theological and literary review is pending. No original words or private thoughts have been invented for Romanus.</p>
    </div>
    <details className={styles.source} id="romanus-dates">
      <summary>Why “around 303”? Which emperor?</summary>
      <p>The shorter account connects the death to Alphaeus and Zacchaeus and an approaching imperial twentieth anniversary. It separates the arrest from death by a long imprisonment. Precise dates and the emperor’s identity cannot be flattened into one certain sequence.</p>
      <p>The short Greek text leaves the emperor unnamed. Cureton’s Syriac translation names Diocletian; Prudentius names Galerius in his opening setting. McGiffert argues for Galerius; Tsartsidis offers a different chronology. We use c. 303 for the death and leave the encounter’s emperor unnamed.</p>
      <p><a href="#source-romanus-chronology">McGiffert, notes 2627–2632</a>; <a href="#source-romanus-tsartsidis">Tsartsidis p. 29 n. 57</a>; <a href="#source-romanus-prudentius">Prudentius 10.31–35</a>.</p>
    </details>
    <details className={styles.source}>
      <summary>Eusebius of Emesa and the other Chrysostom sermon</summary>
      <p>Tsartsidis identifies a passage from Eusebius of Emesa’s <cite>De resurrectione</cite> (PG 24.1097–1100), preserved in Latin and once attributed to Eusebius of Caesarea. It reports both rain extinguishing the fire and renewed speech. We have inspected the scholarly discussion, not that underlying sermon, and do not quote it.</p>
      <p>The accepted Chrysostom homily (CPG 4354, PG 50.605–612) must be distinguished from a second sermon (PG 50.611–618), generally judged inauthentic, which includes a child martyr. These are distinct literary traditions, not extra episodes silently added to this journey.</p>
      <p><a href="#source-romanus-tsartsidis">Tsartsidis, introduction §5, pp. 30–31</a>.</p>
    </details>
    {ROMANUS_SOURCES.map(source => <details key={source.id} id={`source-${source.id}`} className={styles.source}>
      <summary>{source.title}</summary>
      <p><a href={source.url}>Open the source record or edition</a></p>
      <p>{source.locator}</p><p>{source.edition}</p><p>{source.limits}</p>
      <p className={styles.small}>{source.rights} Checked {source.checkedAt}.</p>
    </details>)}
    <details className={styles.source}>
      <summary>About the title and the modern artwork</summary>
      <p>“The voice they could not silence” names a conviction in the expanded traditions, especially Prudentius’s opening. It is not a historical verdict about the disputed speech. The question at the ending is a modern editorial reflection.</p>
      <p>The map is an original AI-assisted schematic, not an archaeological map or a recovered route. The blank interval after the punishment and the opening textual leaves are modern typographic interpretations, not ancient manuscripts. No sound or simulated voice is used.</p>
      <p>The Met’s second-century mosaic is shown intact. Its female personification is not Romanus. It supplies material context for the broader world around Antioch; it cannot establish what happened to him. Open Access API object 253565 confirms the image is public domain under The Met’s CC0 program.</p>
    </details>
    <p className={styles.small}>This encounter remains on the collection’s no-index review surface. Technical verification does not approve historical or theological interpretation. <a href="/jonah/#jonah-1-calling">Return to Scripture: read Jonah</a>.</p>
  </details>;
}
