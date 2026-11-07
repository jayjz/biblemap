import { THOMAS_MOVEMENTS, thomasVerse } from '@/content/thomas';
import { CinematicImage } from './CinematicImage';
import { CinematicDisclosure } from './CinematicDisclosure';
import { SourceLinks, ThomasSources } from './ThomasSources';
import { ThomasShell } from './ThomasShell';
import styles from './thomas.module.css';
import cinema from './cinema.module.css';
import encounter from './encounter.module.css';
import evidence from './sources.module.css';

type Movement = (typeof THOMAS_MOVEMENTS)[number];
const numerals = ['I', 'II', 'III', 'IV', 'V'];

export function Verse({ id, dramatic = false }: { id: string; dramatic?: boolean }) {
  const v = thomasVerse(id);
  const text = v.text;
  const split = dramatic ? text.indexOf('“') : -1;
  return <figure className={styles.verse} data-verse={id}><blockquote>{split >= 0 ? <><span className={styles.speaker}>{text.slice(0, split)}</span><span>{text.slice(split)}</span></> : text}</blockquote>
    <figcaption><a href={`${v.sourceUrl}#V${v.verse}`}>{id.startsWith('l') ? 'Luke' : 'John'} {Number(v.chapter.slice(3))}:{v.verse}</a> · World English Bible</figcaption></figure>;
}

function MovementEnd({ movement }: { movement: Movement }) {
  const index = THOMAS_MOVEMENTS.findIndex(m => m.id === movement.id);
  const next = THOMAS_MOVEMENTS[index + 1];
  const first=thomasVerse(movement.verseIds[0]);
  return <div className={styles.sceneEnd}><aside className={evidence.moment} aria-label={`Source for ${movement.label}`}><p><span>Recorded in John’s Gospel · <a href={`${first.sourceUrl}#V${first.verse}`}>Read John 20:{first.verse}{movement.verseIds.length>1?`–${thomasVerse(movement.verseIds.at(-1)??'').verse}`:''}</a></span>{movement.limit}</p><a href="#source-voices">Follow the voices in this account</a></aside>
    {next && <a className={styles.continue} href={`#${next.id}`}>Continue to {next.label}</a>}</div>;
}

function EarlierThomas() {
  return <details className={styles.earlier}><summary>Thomas before this moment</summary>
    <p>John places Thomas’s question within Jesus’s farewell discourse. This is the reply that follows it.</p>
    <Verse id="jhn14-6" />
    <p>John later names him among disciples at the sea of Tiberias. The apostolic lists name Thomas separately from the James figures. These are glimpses, not a recovered inner life.</p>
    <SourceLinks ids={['thomas-john11','thomas-john14','thomas-john21','thomas-lists']} />
  </details>;
}

export function ThomasEncounter({ reading = false }: { reading?: boolean }) {
  const [absent, unless, gathering, confession, ending] = THOMAS_MOVEMENTS;
  return <ThomasShell reading={reading}><div className={reading ? undefined : encounter.experience}>
    <section className={styles.opening} aria-labelledby="thomas-title">
      {!reading && <div className={styles.openingArt}><CinematicImage image="threshold" priority /></div>}
      <div className={styles.openingText}><p className={styles.locator}>An encounter in John’s Gospel</p><h1 id="thomas-title">Thomas{' '}<span>Absent.<br />Then addressed.</span></h1>
        <p className={styles.intro}>A disciple. An encounter he missed.<br />Words from those who were there.</p>
        <p className={styles.orientation}>After Jesus’s death, John’s Gospel tells of an appearance to his disciples. Thomas was not with them. This is the account of what followed.</p>
        <a className={styles.primary} href="#before-thomas">Enter the account</a><p className={styles.pace}>Read at your own pace · John 11, 14 and 20</p><p className={styles.pace}><a href="#thomas-sources">Explore the people and documents</a></p>
      </div>
      {!reading && <p className={styles.artCaption}><a href="#art-provenance">AI-generated interpretive environment · imagined, unlocated</a></p>}
    </section>
    <nav className={styles.movementNav} aria-label="Thomas movements">{THOMAS_MOVEMENTS.map((m, i) => <a key={m.id} href={`#${m.id}`}><span>{numerals[i]}</span>{m.label}</a>)}</nav>
    <section id="before-thomas" className={`${styles.scene} ${encounter.before}`} tabIndex={-1} aria-labelledby="before-title">
      <div><p className={styles.locator}>Before the absence</p><h2 id="before-title">John has already<br />given him a voice.</h2>
        <p>Thomas is one of Jesus’s disciples. Before the encounter after Jesus’s death, John records him speaking among the others: first as Jesus proposes returning to Judea, where the disciples have warned of danger; later, as Jesus speaks about going away.</p>
        <EarlierThomas />
      </div>
      <div className={encounter.earlierWords}><p>Going with him · John 11</p><Verse id="jhn11-16" dramatic /><p>Asking him · John 14</p><Verse id="jhn14-5" dramatic /></div>
      <div className={styles.sceneEnd}><p>These are Thomas’s earlier words in John.<br />The next scene begins with his absence.<br /><a href="#source-voices">Meet the voices in this Gospel</a></p><a className={styles.continue} href="#absent">Continue to the absent disciple</a></div>
    </section>
    <section id="absent" className={`${styles.scene} ${styles.absent}`} tabIndex={-1} aria-labelledby="absent-title">
      <div className={styles.absenceTitle}><p className={styles.locator}>I · {absent.label}</p><h2 id="absent-title">{absent.title}</h2><p className={styles.sceneNote}>{absent.note}</p></div>
      <div className={styles.absenceField}>{!reading && <div className={cinema.absenceCrop}><CinematicImage image="threshold" /></div>}<Verse id="jhn20-24" /><p className={styles.marginal}>The Gospel names the absence.<br />It leaves its reason unspoken.</p></div>
      <MovementEnd movement={absent} />
    </section>
    <section id="unless" className={`${styles.scene} ${styles.unless} ${reading ? '' : cinema.testimony}`} tabIndex={-1} aria-labelledby="unless-title">
      <div className={reading ? undefined : cinema.testimonyHeading}><p className={styles.locator}>II · {unless.label}</p><h2 id="unless-title">They were there.<br />He was not.</h2>
      {!reading && <label className={cinema.compareControl}><input type="checkbox" id="voices-together" /> Hold the two voices together</label>}</div>
      <figure className={`${styles.twoVoices} ${reading ? '' : cinema.exchange}`} data-verse="jhn20-25"><blockquote>{(() => {
        const v = thomasVerse('jhn20-25').text;
        const boundary = v.indexOf(' But he said');
        const witness = v.slice(0,boundary);
        const answer = v.slice(boundary + 1);
        const openingQuote = witness.indexOf('“');
        const replyQuote = answer.indexOf('“');
        return <><span className={reading ? undefined : cinema.witnessVoice}>{!reading && <CinematicImage image="proximity" />}<span className={reading ? undefined : cinema.voiceWords}><span className={styles.speaker}>{witness.slice(0,openingQuote)}</span>{witness.slice(openingQuote)}</span></span>{' '}<span className={reading ? undefined : cinema.responseVoice}><span className={styles.speaker}>{answer.slice(0,replyQuote)}</span>{answer.slice(replyQuote)}</span></>;
      })()}</blockquote><figcaption><a href="https://ebible.org/engwebp/JHN20.htm#V25">John 20:25</a> · World English Bible</figcaption></figure>
      {!reading && <CinematicDisclosure figures />}<div className={styles.testimonyNote}><p>{unless.note}</p><details><summary>What had the others already seen?</summary><Verse id="jhn20-20" /><p>The earlier scene gives them sight of Jesus’s hands and side. Their report and Thomas’s condition belong in that sequence.</p></details></div>
      <MovementEnd movement={unless} />
    </section>
    <section id="eight-days" className={`${styles.scene} ${styles.gathering} ${reading ? '' : cinema.returned}`} tabIndex={-1} aria-labelledby="eight-title">
      <div className={reading ? undefined : encounter.interval}><p className={styles.locator}>III · The interval</p><h2 id="eight-title">Eight days.</h2><a href="#with-them">Go directly to the return</a><p>John names the interval.<br />He gives no account of the days between.</p></div>
      <div id="with-them" tabIndex={-1} className={styles.gatheredOpening}>{!reading && <CinematicImage image="interior" />}<div><h3 className={reading ? undefined : encounter.returnTitle}>{gathering.title}</h3><p>{gathering.note}</p></div></div>
      {!reading && <CinematicDisclosure figures />}
      <div className={styles.gatheredText}><Verse id="jhn20-26" /><Verse id="jhn20-27" /><p className={styles.marginal}>An interval in the account.<br />No words are supplied for the days between.</p></div>
      <MovementEnd movement={gathering} />
    </section>
    <section id="confession" className={`${styles.scene} ${styles.confession} ${reading ? '' : cinema.confession}`} tabIndex={-1} aria-labelledby="confession-title">
      <p className={styles.locator}>IV · {confession.label}</p><h2 id="confession-title">{confession.title}</h2><Verse id="jhn20-28" dramatic />
      <p className={styles.confessionNote}>{confession.note}</p><MovementEnd movement={confession} />
    </section>
    <section id="not-seen" className={`${styles.scene} ${styles.ending} ${reading ? '' : cinema.horizon}`} tabIndex={-1} aria-labelledby="ending-title">
      {!reading && <div className={cinema.horizonArt}><CinematicImage image="threshold" /></div>}
      <p className={styles.locator}>V · {ending.label}</p><h2 id="ending-title">{ending.title}</h2><Verse id="jhn20-29" dramatic />
      <div className={reading ? styles.gospelPurpose : encounter.writtenAccount}><div><h3>From an encounter<br />to a written account.</h3><p>John follows the blessing with these words about the signs and the purpose of their telling. The account moves from those who saw to those who read.</p></div><div><Verse id="jhn20-30" /><Verse id="jhn20-31" /></div></div><MovementEnd movement={ending} />
    </section>
    <ThomasSources reading={reading} />
  </div></ThomasShell>;
}
