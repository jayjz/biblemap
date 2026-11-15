import Link from "next/link";
import Image from "next/image";
import original from "@/content/pliny-record.json";
import additional from "@/content/pliny-v3-record.json";
import { PLINY_SOURCES } from "@/content/pliny";
import { PLINY_V3_EXCERPTS, PLINY_V3_PROSE, PLINY_V3_SOURCES, PLINY_V3_TITLE, PLINY_V3_TRANSLATION_NOTE, type PlinyV3ExcerptId, type PlinyV3ProseId } from "@/content/pliny-v3";
import { KeepSentenceButton, PlinyReader, ReleaseSentenceButton } from "./PlinyReader";
import styles from "./pliny-v3.module.css";

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
          <h1 id="pliny-title" aria-label={PLINY_V3_TITLE}>A kind of <em>commonwealth</em></h1>
          <div className={styles.column}>
            <Prose id="lead" className={styles.lead} />
            <Prose id="losses" />
            <Prose id="orientation" className={styles.orientation} />
            <Prose id="consolations" />
            <Excerpt id="commands" className={styles.firstSentence} />
            <KeepSentenceButton />
            <noscript><p className={styles.smallNote}>The first letter is repeated beside the later passage below. All reading and sources are available without JavaScript.</p></noscript>
            <Prose id="condition" />
            <Excerpt id="household" className={styles.householdQuote} />
            <Prose id="grief" />
          </div>
          <div className={styles.ribbon} aria-hidden="true"><picture><source media="(max-width: 700px)" srcSet="/media/pliny-v3/carried-ribbon-mobile.webp" /><Image src="/media/pliny-v3/carried-ribbon.webp" alt="" width={1536} height={512} sizes="(max-width: 700px) 100vw, 1100px" /></picture></div>
        </div>

        <div className={styles.province} id="pliny-province">
          <div className={styles.column}>
            <Prose id="province" className={styles.newCorrespondent} />
            <Prose id="fire" />
            <Prose id="refusal" />
            <Excerpt id="association" />
            <Prose id="associationLimit" className={styles.smallNote} />
          </div>
        </div>

        <div id="pliny-accused" className={styles.reading} tabIndex={-1}>
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
            <Prose id="gathering" />
            <Excerpt id="meal" className={styles.meal} />
            <Prose id="stopped" />
          </div>
        </div>

        <div id="pliny-women" className={styles.turn} tabIndex={-1}>
          <div className={styles.column}>
            <Prose id="turn" />
            <div id="pliny-comparison" tabIndex={-1} className={styles.comparison} aria-label="The earlier sentence beside the later report">
              <Excerpt id="women" className={styles.womenQuote} />
              <div className={styles.recall}><Excerpt id="commands" /><ReleaseSentenceButton /></div>
            </div>
            <Prose id="women" />
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
          <div className={styles.column}>
            <span id="reply" className={styles.anchor} tabIndex={-1} />
            <Prose id="reply" />
            <Prose id="pardon" />
            <Excerpt id="pardon" className={styles.pardon} />
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
        <section className={styles.sourceRecord}><h3>About this composition</h3><p>The carried quotation is a modern reading device, not a recovered document. It keeps two separately attributed excerpts available without supplying Pliny’s thoughts about their relationship. The folded blue ribbon is original AI-assisted symbolic artwork, created for BibleMap in November 2026; it depicts no Roman object, place or person.</p><p>AI-authored historical and literary draft for human review. Historical source checking and technical verification do not supply publication approval.</p><a href="/media/pliny-v3/manifest.json">Artwork provenance and generation record</a></section>
      </div></details>
    </div>
  </section>;
}
