import Link from "next/link";
import { PLINY_COPY as copy, PLINY_PASSAGES, PLINY_SOURCES, type PlinyPassageId } from "@/content/pliny";
import record from "@/content/pliny-record.json";
import { PlinyMotion } from "./PlinyMotion";
import styles from "./pliny.module.css";

function Excerpt({ id, className = "" }: { id: PlinyPassageId; className?: string }) {
  const passage = PLINY_PASSAGES[id];
  const emphasis = id === "repeated" ? "threatened them with punishment" : id === "persisted" ? "at once punished" : null;
  const parts = emphasis ? passage.text.split(emphasis) : null;
  return <figure className={`${styles.excerpt} ${className}`} data-passage={id} data-source="pliny-encounter-melmoth">
    <blockquote>{parts ? <>{parts[0]}<mark>{emphasis}</mark>{parts[1]}</> : passage.text}</blockquote>
    <figcaption><a href={`#pliny-text-${passage.letter}`}>{passage.letter === "pliny" ? "Pliny" : "Trajan"} · {passage.locator}</a><span>Melmoth / Bosanquet · excerpt</span></figcaption>
  </figure>;
}

function Locator({ children, href = "#source-pliny-encounter-melmoth" }: { children: React.ReactNode; href?: string }) {
  return <a className={styles.locator} href={href}>{children}<span aria-hidden="true"> ↗</span></a>;
}

export function PlinyEncounter() {
  return <PlinyMotion>
    <main id="pliny-main" tabIndex={-1}>
      <article aria-labelledby="pliny-title">
        <section id="pliny-desk" data-movement="desk" data-source="pliny-encounter-melmoth pliny-encounter-comparison" className={styles.opening} tabIndex={-1}>
          <div className={styles.openingText}>
            <h1 id="pliny-title">The names<br />he did<br /><em>not write.</em></h1>
            <p className={styles.introduction}>{copy.introduction}</p>
            <a href="#pliny-procedure" className={styles.begin}>Open the record <span aria-hidden="true">↓</span></a>
            <p className={styles.setting}>{copy.setting}<br />Pliny 10.96 · Trajan 10.97 · Roman administrative testimony</p>
          </div>
          <div className={styles.desk}>
            <div className={styles.document}>
              <div className={styles.documentHead}><span>PLINY → TRAJAN</span><span>10.96</span></div>
              <p className={styles.documentTitle}>On those accused<br />of being Christians</p>
              <Excerpt id="doubt" />
              <div className={styles.documentRules} aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <p className={styles.documentFoot}>An official’s account.<br />The accused appear inside it.</p>
            </div>
            <p className={styles.artNote}>Original typographic composition · not a manuscript facsimile</p>
          </div>
        </section>

        <section id="pliny-procedure" className={styles.threshold} aria-labelledby="desk-title" data-source="pliny-encounter-melmoth" tabIndex={-1}>
          <p className={styles.movementLabel}>I / The governor’s desk</p>
          <h2 id="desk-title">Uncertain about policy.<br /><em>Already exercising power.</em></h2>
          <p id="procedure" tabIndex={-1}>{copy.desk}</p>
          <Locator>Pliny 10.96.1–3</Locator>
        </section>

        <section id="pliny-accused" data-movement="accused" className={styles.accused} aria-labelledby="accused-title" data-source="pliny-encounter-melmoth" tabIndex={-1}>
          <div className={styles.sectionIntro}>
            <p className={styles.movementLabel}>II / The accused</p>
            <h2 id="accused-title">A question.<br /><em>Then a threat.</em></h2>
            <p>{copy.accused}</p>
          </div>
          <div className={styles.procedure}>
            <div className={styles.procedureLine}><span aria-hidden="true">01</span><Excerpt id="asked" /></div>
            <div className={styles.procedureLine}><span aria-hidden="true">02</span><Excerpt id="repeated" /></div>
            <div className={`${styles.procedureLine} ${styles.sentence}`}><span aria-hidden="true">03</span><Excerpt id="persisted" /></div>
          </div>
          <div className={styles.consequences}>
            <div data-source="pliny-encounter-melmoth pliny-encounter-comparison pliny-latin">
              <h3>For those who persisted</h3>
              <p>{copy.execution}</p>
              <Locator href="#source-pliny-encounter-comparison">Translation comparison · 10.96.3–4</Locator>
            </div>
            <div>
              <h3>For those who denied it</h3>
              <p>{copy.denial}</p>
              <Locator>Pliny 10.96.5–6</Locator>
            </div>
          </div>
          <section id="practice" className={styles.gathering} aria-labelledby="gathering-title">
            <div><p className={styles.movementLabel}>Inside the questioning</p><h3 id="gathering-title">Before dawn.<br />Together.</h3></div>
            <div><p>{copy.gathering}</p><Excerpt id="meal" /></div>
          </section>
          <p className={styles.bridge}>Then the governor describes how he sought more information.</p>
        </section>

        <section id="pliny-women" data-movement="women" className={styles.women} aria-labelledby="women-title" data-source="pliny-encounter-melmoth pliny-latin" tabIndex={-1}>
          <div className={styles.womenHeading}>
            <p className={styles.movementLabel}>III / Two enslaved women · 10.96.8</p>
            <h2 id="women-title">Two women.<br /><em>Neither named.</em></h2>
            <p>{copy.women}</p>
          </div>
          <div className={styles.womenRecord}>
            <div className={styles.twoRules} aria-hidden="true"><i /><i /></div>
            <Excerpt id="women" />
            <p className={styles.womenCaption}>His words about what he did.<br />Their testimony is absent.</p>
          </div>
          <div className={styles.womenAfter}>
            <p>{copy.womenAfter}</p>
            <p className={styles.womenLimit}>{copy.womenLimit}</p>
            <details className={styles.wordNote}>
              <summary>What does <i lang="la">ministrae</i> tell us?</summary>
              <div>
                <p><span lang="la">ex duabus ancillis, quae ministrae dicebantur</span></p>
                <p>The Latin describes two enslaved women who were called <i lang="la">ministrae</i>. English renderings include ministers and deaconesses. Melmoth says they were said to officiate in religious rites. The term does not tell us their names, exact duties, or how their community understood the role.</p>
                <Locator href="#source-pliny-latin">Latin and translation limits · 10.96.8</Locator>
              </div>
            </details>
          </div>
        </section>

        <section id="pliny-reply" data-movement="reply" className={styles.reply} aria-labelledby="reply-title" data-source="pliny-encounter-melmoth" tabIndex={-1}>
          <div id="reply" className={styles.sectionIntro}>
            <p className={styles.movementLabel}>IV / The emperor replies · 10.97</p>
            <h2 id="reply-title">A limit on pursuit.<br /><em>Punishment remains.</em></h2>
            <p>{copy.reply}</p>
          </div>
          <div className={styles.ruling}>
            <div className={styles.restraint}><h3>The restraint</h3><Excerpt id="pursuit" /></div>
            <div className={styles.punishment}><h3>The continuing power</h3><Excerpt id="punishment" /></div>
          </div>
          <div className={styles.conditions}>
            <h3>The conditions of pardon</h3>
            <Excerpt id="pardon" />
            <p>{copy.replyAfter}</p>
            <Excerpt id="anonymous" />
            <Locator>Read the full ruling in context</Locator>
          </div>
        </section>

        <section id="pliny-survives" data-movement="survives" className={styles.survives} aria-labelledby="survives-title" data-source="pliny-encounter-melmoth" tabIndex={-1}>
          <p className={styles.movementLabel}>V / What survives</p>
          <h2 id="survives-title">The officials’ voices.<br /><em>The missing words.</em></h2>
          <p className={styles.survivesIntro}>{copy.survives}</p>
          <dl className={styles.recordBalance}>
            <div><dt>Pliny · 10.96</dt><dd>His questions.<br />His punishments.<br />His account of their practices.</dd></div>
            <div><dt>Trajan · 10.97</dt><dd>His approval.<br />His restrictions.<br />His conditions for pardon.</dd></div>
            <div className={styles.absent}><dt>The two women</dt><dd>Their names.<br />Their testimony.<br />Their subsequent fate.<span>Not given in these letters.</span></dd></div>
          </dl>
          <p className={styles.ending}>{copy.ending}</p>
          <div className={styles.onward}>
            <div><p>A different voice, later, in another province.</p><Link prefetch={false} href="/human-story/perpetua/">Read the account attributed to Perpetua <span aria-hidden="true">→</span></Link></div>
            <p>This is a comparison across distinct accounts, not evidence that Pliny’s procedure governed her case.</p>
          </div>
        </section>

        <PlinySources />
      </article>
    </main>
    <footer className={styles.footer}><Link prefetch={false} href="/human-story/worlds/witnesses/">Return to historical witnesses</Link><Link prefetch={false} href="/explore/">Open the Atlas</Link><a href="#pliny-desk">Return to the beginning ↑</a></footer>
  </PlinyMotion>;
}

function PlinySources() {
  return <section id="pliny-sources" className={styles.sources} aria-labelledby="pliny-sources-title" tabIndex={-1}>
    <h2 id="pliny-sources-title">Read the record.<br /><em>Keep its limits.</em></h2>
    <p>Quotations are Roman administrative testimony in the historical Melmoth / Bosanquet translation, public domain in the United States. Connective prose is an editorial reading. Neither is Scripture.</p>
    <div className={styles.fullTexts}>
      <details><summary>Read Pliny’s complete letter · 10.96</summary><div id="pliny-text-pliny" tabIndex={-1}><p>{record.letters.pliny}</p><p className={styles.transcription}>{record.normalization}</p></div></details>
      <details><summary>Read Trajan’s complete reply · 10.97</summary><div id="pliny-text-trajan" tabIndex={-1}><p>{record.letters.trajan}</p><p className={styles.transcription}>{record.normalization}</p></div></details>
    </div>
    <details className={styles.evidence}><summary>Sources, translations &amp; interpretive limits</summary><div>
      {PLINY_SOURCES.map(source => <section id={`source-${source.id}`} key={source.id} className={styles.sourceRecord}>
        <h3>{source.title}</h3><p id={source.id === "pliny-encounter-melmoth" ? "source-pliny-melmoth" : undefined}>{source.kind === "interpretation" ? "Later Christian interpretation" : "Roman administrative testimony / source comparison"} · {source.locator}</p>
        <p id={source.id === "pliny-encounter-melmoth" ? "source-pliny-letters" : undefined}>{source.edition}</p><p>{source.limits}</p><p>{source.rights}</p><a href={source.url}>Open the source in context ↗</a><p>Checked {source.checkedAt}.</p>
      </section>)}
      <section className={styles.sourceRecord} data-source="pliny-tertullian"><h3>A later Christian objection</h3><p>In <cite>Apology</cite> II.6–9, Tertullian attacks the combination of forbidding a search and ordering punishment when Christians are brought before a governor. This is a later Christian argument about the policy, not the testimony missing from Pliny’s letter.</p></section>
      <section className={styles.sourceRecord}><h3>About the presentation</h3><p>Original HTML/CSS typography is a creative interpretation of the record’s imbalance. The rules and empty space are symbolic; they are not a document facsimile, historical setting or depiction of either woman. No historical audio or likeness is reconstructed.</p><p>Sourced editorial draft awaiting human review. Source comparison and technical checks do not supply historical, theological or publication approval.</p></section>
    </div></details>
  </section>;
}
