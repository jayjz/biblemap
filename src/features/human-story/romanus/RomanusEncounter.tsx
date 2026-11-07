import Link from "next/link";
import { ROMANUS_ENTRY, ROMANUS_MOVEMENTS, ROMANUS_LEAVES, type RomanusMovement } from "@/content/romanus";
import { ROMANUS_MEDIA } from "@/content/romanus-media";
import { isProductionReadyMedia } from "@/domain/media";
import { RomanusArtwork } from "./RomanusArtwork";
import { RomanusEvidence, RomanusSources } from "./RomanusSources";
import styles from "./romanus.module.css";

function Prose({ movement }: { movement: RomanusMovement }) {
  return <div className={styles.prose}>{movement.paragraphs.map(p => <p key={p.text}>{p.text}</p>)}</div>;
}

function Places() {
  return <figure className={styles.places}>
    <svg viewBox="0 0 520 600" role="img" aria-labelledby="romanus-map-title romanus-map-desc">
      <title id="romanus-map-title">Caesarea and Antioch, on the eastern side of the Mediterranean</title>
      <desc id="romanus-map-desc">Schematic orientation. Caesarea is on the coast to the south; Antioch lies inland farther north. No route, ancient borders or exact village is shown.</desc>
      <path d="M0 0H276L283 47 312 72 310 109 342 147 329 182 301 202 278 239 265 279 273 307 251 335 245 373 217 422 213 459 184 501 165 555 128 600H0Z" className={styles.sea} />
      <path d="M276 0 283 47 312 72 310 109 342 147 329 182 301 202 278 239 265 279 273 307 251 335 245 373 217 422 213 459 184 501 165 555 128 600" className={styles.coast} />
      <text x="65" y="302" className={styles.seaLabel}>Mediterranean</text><text x="100" y="328" className={styles.seaLabel}>Sea</text>
      <circle cx="356" cy="158" r="7" /><path d="M356 158H408" className={styles.markerLine} />
      <text x="365" y="121" className={styles.cityLabel}>Antioch</text><text x="365" y="143" className={styles.mapNote}>The confrontation</text>
      <circle cx="217" cy="425" r="7" /><path d="M217 425H273" className={styles.markerLine} />
      <text x="282" y="427" className={styles.cityLabel}>Caesarea</text><text x="282" y="451" className={styles.mapNote}>His church community</text>
      <path d="M463 503V463m-7 9 7-9 7 9" className={styles.markerLine} /><text x="458" y="527" className={styles.mapNote}>N</text>
    </svg>
    <figcaption>Modern schematic of the eastern Mediterranean. Orientation only; no known route is implied. <a href="#source-romanus-geography">Place sources</a>.</figcaption>
  </figure>;
}

function Accounts() {
  return <div className={styles.accounts}>
    <div className={styles.shortLeaf}>
      <p className={styles.sourceName}>Eusebius · shorter Greek account</p>
      <h3>After the wound</h3>
      <blockquote>“After this punishment he was thrown into prison”</blockquote>
      <p className={styles.small}>2.4 · McGiffert translation, 1890</p>
      <div className={styles.interval} aria-hidden="true"><span /></div>
      <p>No further speech is reported.</p>
      <p className={styles.small}>The narrative continues to his death. This omission neither narrates a miracle nor disproves one.</p>
      <a href="#source-romanus-short">Read this text’s provenance</a>
    </div>
    <div className={styles.leaves}>
      <p className={styles.leafInvitation}>Keep that account in view. Open another.</p>
      {ROMANUS_LEAVES.map(leaf => <details key={leaf.id} id={leaf.id} className={styles.leaf}>
        <summary>{leaf.title}</summary>
        <div className={styles.leafContent}>
          <p className={styles.sourceName}>{leaf.author}</p><p className={styles.small}>{leaf.date}<br />{leaf.genre}</p>
          <h3>{leaf.id === "romanus-leaf-syriac" ? "Speech continues." : leaf.id === "romanus-leaf-chrysostom" ? "The voice becomes a sermon." : "A poet asks for a voice."}</h3>
          <p>{leaf.text}</p>
          {leaf.id === "romanus-leaf-prudentius" && <p className={styles.latin} lang="la">uox ueritatis testis extingui nequit</p>}
          <p className={styles.observation}>{leaf.observation}</p>
          <p className={styles.small}>Editorial summary · {leaf.locator}</p>
          <div className={styles.leafLinks}>{leaf.sourceIds.map(id => <a key={id} href={`#source-${id}`}>Source: {id === "romanus-syriac" ? "Syriac text" : id === "romanus-transmission" ? "transmission history" : id === "romanus-chrysostom" ? "homily record" : id === "romanus-tsartsidis" ? "source scholarship" : "Latin poem"}</a>)}</div>
        </div>
      </details>)}
    </div>
  </div>;
}

export function RomanusEncounter({ reading = false }: { reading?: boolean }) {
  if (!ROMANUS_MEDIA.every(isProductionReadyMedia)) throw new Error("Romanus artwork requires verified reusable rights and provenance");
  const [mosaic, smallMosaic] = ROMANUS_MEDIA;
  const [world, refusal, wound, accounts, memory] = ROMANUS_MOVEMENTS;
  return <div className={`${styles.page} ${reading ? styles.reading : ""}`}>
    <a className={styles.skip} href="#romanus-main">Skip to the story</a>
    <header className={styles.masthead}>
      <Link prefetch={false} href="/" className={styles.brand}>BibleMap<span>The human story</span></Link>
      <div><Link prefetch={false} href={reading ? "/human-story/romanus/" : "/human-story/romanus/reading/"}>{reading ? "Illustrated journey" : "Simple reading"}</Link><a href="#romanus-research">Sources</a></div>
    </header>
    <main id="romanus-main" tabIndex={-1}>
      <article data-entry="romanus">
        <header className={styles.entrance}>
          <p className={styles.setting}>Antioch, Roman Syria · around 303 CE</p>
          <h1>Romanus</h1>
          <p className={styles.subtitle}>The voice they could not silence</p>
          <div className={styles.opening}>
            <p>Romanus was a Christian deacon from the church around Caesarea. In Antioch, during the persecution associated with Diocletian, he challenged people sacrificing to the gods. He was arrested. His tongue was cut out. He died in prison.</p>
            <div><p>We know him through the writers who remembered him. They do not all tell the same story about what happened to his voice.</p><a className={styles.begin} href="#romanus-world">Begin with the person</a></div>
          </div>
          <details className={styles.about}><summary>About this encounter and its title</summary><p>AI-assisted editorial draft, awaiting human historical and theological review. The title names a conviction in expanded traditions; it does not settle the difference between them. Original summaries follow identified sources. This is a historical Christian account, not Scripture. <a href="#source-romanus-short">Eusebius 2.1–5</a>; <a href="#source-romanus-prudentius">Prudentius 10.1–15</a>.</p></details>
        </header>
        <nav className={styles.navigation} aria-label="Movements in Romanus’s story">
          {ROMANUS_MOVEMENTS.map(m => <a key={m.id} href={`#${m.id}`}>{m.label}</a>)}
        </nav>
        <section id={world.id} tabIndex={-1} className={styles.world} aria-labelledby="romanus-world-title">
          <div className={styles.worldText}><h2 id="romanus-world-title">{world.title}</h2><Prose movement={world} /><RomanusEvidence movement={world} /></div>
          {!reading && <Places />}
          <div className={styles.city}>
            {!reading && <RomanusArtwork src={mosaic.localPath} smallSrc={smallMosaic.localPath} alt={mosaic.altText} />}
            <div className={styles.cityText}><h3>A city larger than this story.</h3><p>Before Romanus, someone near Antioch lived with this image underfoot. The floor comes from Daphne, a retreat used by wealthy people from the city. At its center is a figure of abundance or good living.</p><p>The object cannot tell us who joined the crowd Romanus confronted. It reminds us that his account belongs to a world of homes, wealth and images as well as persecution.</p><a href="#source-romanus-daphne">The Met’s object record and interpretation</a></div>
          </div>
        </section>
        <section id={refusal.id} tabIndex={-1} className={styles.refusal} aria-labelledby="romanus-refusal-title">
          <div className={styles.refusalText}><h2 id="romanus-refusal-title">{refusal.title}</h2><Prose movement={refusal} /><RomanusEvidence movement={refusal} /></div>
          <figure className={styles.fireQuestion}><blockquote>“Where is the fire for me?”</blockquote><figcaption>Words attributed to Romanus by Eusebius, 2.2.<br />McGiffert translation, 1890. A reported question, not a surviving recording.</figcaption><div aria-hidden="true" className={styles.stakeLine} /></figure>
        </section>
        <section id={wound.id} tabIndex={-1} className={styles.wound} aria-labelledby="romanus-wound-title">
          <h2 id="romanus-wound-title">{wound.title}</h2><Prose movement={wound} />
          {!reading && <div className={styles.silence} aria-hidden="true"><span /></div>}
          <RomanusEvidence movement={wound} />
        </section>
        <section id={accounts.id} tabIndex={-1} className={styles.divergence} aria-labelledby="romanus-accounts-title">
          <header className={styles.movementHeader}><h2 id="romanus-accounts-title">{accounts.title}</h2><Prose movement={accounts} /><RomanusEvidence movement={accounts} /></header>
          <Accounts />
          <details className={styles.transmission}><summary>Why a longer text is not necessarily a later story</summary><p>Eusebius’s longer work is usually dated around 311; the shorter Greek recension reworks it. The full longer text survives in Syriac, including a manuscript dated 411. Some scholars have proposed that the renewed speech was an expansion in translation or transmission. We cannot resolve that question by putting the two texts in date order on a screen.</p><p><a href="#source-romanus-transmission">Minov, CSLA E00294 and E00295</a>; <a href="#source-romanus-tsartsidis">Tsartsidis, pp. 29–30</a>. Manuscript date, composition date and event date are different things.</p></details>
        </section>
        <section id={memory.id} tabIndex={-1} className={styles.memory} aria-labelledby="romanus-memory-title">
          <div className={styles.memoryText}><h2 id="romanus-memory-title">{memory.title}</h2><Prose movement={memory} /><RomanusEvidence movement={memory} /></div>
          <div className={styles.lastPage}>
            <p className={styles.lastName}>Romanus</p>
            <p className={styles.lastLine}>Remembered by Eusebius.<br />Preached by Chrysostom.<br />Given words by Prudentius.<br />Read by us.</p>
            <p className={styles.lastQuestion}>{ROMANUS_ENTRY.question}</p>
            <p className={styles.small}>A question from this encounter, not a quotation from the sources.</p>
          </div>
        </section>
      </article>
      <RomanusSources />
    </main>
    <footer className={styles.footer}><Link prefetch={false} href="/human-story/perpetua/">Perpetua: another life, other voices</Link><Link prefetch={false} href="/human-story/worlds/saints/">Return to Saints</Link><a href="#romanus-main">Read again</a></footer>
  </div>;
}
