import Link from "next/link";
import original from "@/content/pliny-record.json";
import additional from "@/content/pliny-v3-record.json";
import { PLINY_SOURCES } from "@/content/pliny";
import { PLINY_V3_EXCERPTS, PLINY_V3_PROSE, PLINY_V3_SOURCES, PLINY_V3_TITLE, PLINY_V3_TRANSLATION_NOTE, type PlinyV3ExcerptId, type PlinyV3ProseId } from "@/content/pliny-v3";
import { KeepSentenceButton, PlinyReader, ReleaseSentenceButton } from "./PlinyReader";
import styles from "./pliny-v3.module.css";
import { PlinyArtifact } from "./PlinyArtifact";

function Prose({ id, className = "" }: { id: PlinyV3ProseId; className?: string }) {
  const paragraph = PLINY_V3_PROSE[id];
  return <p className={className} data-prose={id} data-source={paragraph.sourceIds.join(" ")}>{paragraph.text}</p>;
}
function Excerpt({ id, className = "" }: { id: PlinyV3ExcerptId; className?: string }) {
  const passage = PLINY_V3_EXCERPTS[id];
  return <figure className={`${styles.excerpt} ${className}`} data-passage={id} data-source={passage.sourceId}>
    <blockquote>{passage.text}</blockquote>
    <figcaption><a href={`#pliny-text-${passage.letter}`}>{passage.speaker} · {passage.locator}</a><span>Melmoth / Bosanquet · excerpt</span></figcaption>
  </figure>;
}

export function PlinyV3Encounter() {
  return <PlinyReader sentence={PLINY_V3_EXCERPTS.commands.text}>
    <main id="pliny-main" tabIndex={-1}>
      <article aria-labelledby="pliny-title">
        <div id="pliny-desk" className={styles.opening}>
          <div className={styles.openingText}>
            <h1 id="pliny-title" aria-label={PLINY_V3_TITLE}>A kind of <em>commonwealth</em></h1>
            <Prose id="lead" className={styles.lead} />
            <Prose id="losses" />
            <Prose id="orientation" className={styles.orientation} />
            <a className={styles.begin} href="#pliny-household">Begin with the household letter <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.frontispiece}><PlinyArtifact id="pliny-manuscript" priority /></div>
          <div className={styles.openingFoot}><span>Pliny the Younger</span><nav aria-label="Letters in this reading"><a href="#pliny-household">Household · 8.16</a><a href="#pliny-province">Province · 10.33–34</a><a href="#pliny-accused">Investigation · 10.96–97</a></nav><a href="#pliny-record-chain">How the words reach us ↓</a></div>
        </div>

        <section id="pliny-household" className={styles.household} aria-labelledby="pliny-household-title" tabIndex={-1}>
          <div className={styles.marginNote}><span className={styles.letterNumber}>8.16</span><h2 id="pliny-household-title">To Paternus</h2><p>A letter about the household</p><a href="#pliny-text-household">Read the complete letter ↗</a></div>
          <div className={styles.column}>
            <Prose id="consolations" />
            <div className={styles.letterLeaf}>
              <span className={styles.documentLabel}>Pliny to Paternus · 8.16</span>
              <Excerpt id="commands" className={styles.firstSentence} />
              <KeepSentenceButton />
              <noscript><p className={styles.smallNote}>The first letter is repeated beside the later passage below. All reading and sources are available without JavaScript.</p></noscript>
            </div>
            <Prose id="condition" />
            <Excerpt id="household" className={styles.householdQuote} />
            <Prose id="grief" />
          </div>
        </section>

        <section className={styles.province} id="pliny-province" aria-labelledby="pliny-province-title">
          <div className={styles.column}>
            <h2 id="pliny-province-title" className={styles.sectionTitle}>The correspondent<br />is now the emperor.</h2>
            <Prose id="province" className={styles.newCorrespondent} />
            <div className={styles.dispatch}>
              <span className={styles.documentLabel}>10.33 · Pliny → Trajan</span>
              <Prose id="fire" />
              <div className={styles.answer}><span className={styles.documentLabel}>10.34 · Trajan → Pliny</span>
              <Prose id="refusal" />
              <Excerpt id="association" /></div>
            </div>
            <Prose id="associationLimit" className={styles.smallNote} />
          </div>
          <div className={styles.marginNote}><span className={styles.letterNumber}>X</span><p>Book ten</p><PlinyArtifact id="pliny-diploma" /></div>
        </section>

        <div id="pliny-accused" className={styles.reading} tabIndex={-1}>
          <div className={styles.marginNote}><span className={styles.letterNumber}>10.96</span><h2>The investigation</h2><p>Pliny to Trajan</p><a href="#pliny-text-pliny">Read the complete letter ↗</a><div className={styles.coinContext}><PlinyArtifact id="pliny-trajan-coin" /></div></div>
          <div className={styles.column}>
            <span id="procedure" className={styles.anchor} tabIndex={-1} />
            <Prose id="accused" />
            <Prose id="procedure" />
            <Prose id="certainty" className={styles.certainty} />
            <Prose id="denial" />
            <Prose id="former" />
            <details className={styles.translation}><summary>About punishment and the translation</summary><p>{PLINY_V3_TRANSLATION_NOTE}</p><a href="#source-pliny-encounter-comparison">Inspect the English comparison</a></details>
          </div>
        </div>

        <div id="pliny-communal" className={styles.communal}>
          <div className={styles.column}>
            <span id="practice" className={styles.anchor} tabIndex={-1} />
            <h2 className={styles.sectionTitle}>Before daylight.</h2>
            <Prose id="gathering" />
            <Excerpt id="meal" className={styles.meal} />
            <Prose id="stopped" />
          </div>
        </div>

        <div id="pliny-women" className={styles.turn} tabIndex={-1}>

          <div className={styles.column}>
            <Prose id="turn" />
            <div id="pliny-comparison" tabIndex={-1} className={styles.comparison} aria-label="The earlier sentence beside the later report">
              <span className={styles.documentLabel}>The official report · 10.96.8</span>
              <Excerpt id="women" className={styles.womenQuote} />
              <div className={styles.recall}><span className={styles.documentLabel}>The household letter · 8.16</span><Excerpt id="commands" /><ReleaseSentenceButton /></div>
            </div>
            <Prose id="women" />
          <aside className={styles.marginNote} aria-label="What the letter preserves" data-source="pliny-latin pliny-encounter-melmoth">
            <span className={styles.documentLabel}>10.96.8 · the surviving record</span>
            <p className={styles.latin} lang="la">duabus<br />ancillis</p>
            <p>Two enslaved women</p>
            <dl className={styles.absences}><div><dt>Names</dt><dd>Not supplied</dd></div><div><dt>Their words</dt><dd>Not quoted</dd></div><div><dt>Subsequent fate</dt><dd>Not given</dd></div></dl>
            <a href="#source-pliny-latin">Inspect the Latin ↗</a>
          </aside>
            <details className={styles.translation}><summary>The word ministrae</summary><p><span lang="la">ex duabus ancillis, quae ministrae dicebantur</span>. The Latin describes two enslaved women called <i lang="la">ministrae</i>. Ministers and deaconesses are translation choices. Their duties, names, words and subsequent fate are not supplied by these letters.</p><a href="#source-pliny-latin">Latin and interpretation limits</a></details>
            <Prose id="after" />
            <Prose id="reach" />
          </div>
        </div>

        <div className={styles.restoration} id="pliny-restoration">
          <div className={styles.column}>
            <Excerpt id="temples" />
            <Prose id="trade" />
            <Prose id="recoveryLimit" className={styles.smallNote} />
          </div>
        </div>

        <div id="pliny-reply" className={styles.ending} tabIndex={-1}>
          <div className={styles.marginNote}><span className={styles.letterNumber}>10.97</span><h2>The reply</h2><p>Trajan to Pliny</p><a href="#pliny-text-trajan">Read the complete reply ↗</a></div>
          <div className={styles.column}>
            <span id="reply" className={styles.anchor} tabIndex={-1} />
            <Prose id="reply" />
            <Prose id="pardon" />
            <div className={styles.replyLeaf}><span className={styles.documentLabel}>Trajan → Pliny · 10.97</span><Excerpt id="pardon" className={styles.pardon} /></div>
          </div>
        </div>
        <PlinyV3Sources />
      </article>
    </main>
    <footer className={styles.footer}><Link prefetch={false} href="/human-story/worlds/witnesses/">Historical witnesses</Link><Link prefetch={false} href="/explore/">Open the Atlas</Link><a href="#pliny-desk">Return to the first letter</a></footer>
  </PlinyReader>;
}

function PlinyV3Sources() {
  return <section id="pliny-sources" className={styles.sources} aria-labelledby="pliny-sources-title" tabIndex={-1}>
    <div id="pliny-record-chain" className={styles.recordChain} tabIndex={-1} data-source="pliny-household pliny-firemen pliny-encounter-melmoth">
      <h2>How the words reach us</h2>
      <ol><li><span>Roman correspondence</span><p>Pliny’s letters and the emperor’s replies.</p></li><li><span>Manuscripts &amp; editions</span><p>Copied and transmitted; no autographs shown.</p></li><li><span>Historical English</span><p>Melmoth, revised Bosanquet. The translation quoted here.</p></li><li><span>This reading</span><p>Selected excerpts with a modern editorial account.</p></li></ol>
      <p>The opening facsimile preserves other letters in the collection. It is not a manuscript of these passages. Multiple translations are not independent witnesses.</p>
    </div>
    <div className={styles.column}>
      <h2 id="pliny-sources-title">The letters</h2>
      <p>Quotations are Roman testimony in the historical Melmoth / Bosanquet translation, public domain in the United States. The surrounding prose is a modern editorial account. Neither is Scripture. These are transmitted texts, not autographs or neutral trial transcripts.</p>
      <details><summary>Pliny to Paternus · complete 8.16</summary><div id="pliny-text-household" tabIndex={-1}><p>{additional.letters.household}</p><p className={styles.smallNote}>{additional.normalization}</p></div></details>
      <details><summary>Pliny and Trajan · complete 10.33–34</summary><div id="pliny-text-fire" tabIndex={-1}><h3>Pliny · 10.33</h3><p>{additional.letters.fire}</p></div><div id="pliny-text-association" tabIndex={-1}><h3>Trajan · 10.34</h3><p>{additional.letters.association}</p></div></details>
      <details><summary>Pliny · complete 10.96</summary><div id="pliny-text-pliny" tabIndex={-1}><p>{original.letters.pliny}</p><p className={styles.smallNote}>{original.normalization}</p></div></details>
      <details><summary>Trajan · complete 10.97</summary><div id="pliny-text-trajan" tabIndex={-1}><p>{original.letters.trajan}</p></div></details>
      <details><summary>Sources, translation and interpretive limits</summary><div>
        <p>{PLINY_V3_TRANSLATION_NOTE}</p>
        {[...PLINY_V3_SOURCES, ...PLINY_SOURCES].map(source => <section key={source.id} id={`source-${source.id}`} className={styles.sourceRecord}>
          <h3>{source.title}</h3><p>{source.locator}</p><p>{source.edition}</p><p>{source.limits}</p><p className={styles.smallNote}>{source.rights}</p><a href={source.url}>Read the source in context<span aria-hidden="true"> ↗</span></a>
          {source.id === "pliny-encounter-melmoth" ? <><span id="source-pliny-letters" /><span id="source-pliny-melmoth" /></> : null}
        </section>)}
        <section className={styles.sourceRecord}><h3>A later Christian reading</h3><Prose id="reception" /><a href="https://www.tertullian.org/anf/anf03/anf03-05.htm">Tertullian · Apology II · S. Thelwall translation</a></section>
        <section className={styles.sourceRecord}><h3>About this composition</h3><p>The carried quotation is a modern reading device, not a recovered document. It keeps two separately attributed excerpts available without supplying Pliny’s thoughts about their relationship. The manuscript facsimile and Roman objects are identified where they appear. The facsimile contains other letters, and the objects are contextual: none is a recovered record of these proceedings. Typography, letter surfaces and the absence register are modern editorial compositions. V4 uses no generated imagery.</p><p>AI-authored historical and literary draft for human review. Historical source checking and technical verification do not supply publication approval.</p><a href="/media/pliny-v4/manifest.json">Visual sources, rights and provenance</a></section>
      </div></details>
    </div>
  </section>;
}
