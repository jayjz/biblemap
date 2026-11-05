import Link from 'next/link';
import { THOMAS_MOVEMENTS, THOMAS_ROUTES, thomasVerse } from '@/content/thomas';
import { SpatialArtwork } from './SpatialArtwork';
import { SourceLinks, ThomasSources } from './ThomasSources';
import { ThomasShell } from './ThomasShell';
import styles from './thomas.module.css';

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
  return <div className={styles.sceneEnd}><details><summary>Read this moment in its source</summary><p>{movement.limit}</p><SourceLinks ids={movement.sourceIds} /></details>
    {next && <a className={styles.continue} href={`#${next.id}`}>Continue to {next.label}</a>}</div>;
}

function EarlierThomas() {
  return <details className={styles.earlier}><summary>Thomas before this moment</summary>
    <p>John has already given Thomas a voice. In danger, he proposes going with Jesus. In the farewell discourse, he asks about the way. These scenes complicate a portrait built from doubt alone.</p>
    <Verse id="jhn11-16" /><Verse id="jhn14-5" /><Verse id="jhn14-6" />
    <p>John later names him among disciples at the sea of Tiberias. The apostolic lists name Thomas separately from the James figures. These are glimpses, not a recovered inner life.</p>
    <SourceLinks ids={['thomas-john11','thomas-john14','thomas-john21','thomas-lists']} />
  </details>;
}

export function ThomasEncounter({ reading = false }: { reading?: boolean }) {
  const [absent, unless, gathering, confession, ending] = THOMAS_MOVEMENTS;
  return <ThomasShell reading={reading}>
    <section className={styles.opening} aria-labelledby="thomas-title">
      {!reading && <div className={styles.openingArt}><SpatialArtwork /></div>}
      <div className={styles.openingText}><p className={styles.locator}>John 20:24–29</p><h1 id="thomas-title">Thomas{' '}<span>The space between<br />doubt and belief.</span></h1>
        <p className={styles.intro}>A disciple. An encounter he missed.<br />Words from those who were there.</p>
        <p className={styles.orientation}>After Jesus’s death, John’s Gospel tells of an appearance to his disciples. Thomas was not with them. This is the account of what followed.</p>
        <a className={styles.primary} href="#absent">Enter the account</a><p className={styles.pace}>Five movements · at your own pace</p>
      </div>
      {!reading && <p className={styles.artCaption}><a href="#art-provenance">Original spatial artwork · imagined, unlocated</a></p>}
    </section>
    <nav className={styles.movementNav} aria-label="Thomas movements">{THOMAS_MOVEMENTS.map((m, i) => <a key={m.id} href={`#${m.id}`}><span>{numerals[i]}</span>{m.label}</a>)}</nav>
    <section id="absent" className={`${styles.scene} ${styles.absent}`} tabIndex={-1} aria-labelledby="absent-title">
      <div className={styles.absenceTitle}><p className={styles.locator}>I · {absent.label}</p><h2 id="absent-title">{absent.title}</h2><p className={styles.sceneNote}>{absent.note}</p><EarlierThomas /></div>
      <div className={styles.absenceField}><span aria-hidden="true" className={styles.emptySpace} /><Verse id="jhn20-24" /><p className={styles.marginal}>The Gospel names the absence.<br />It leaves its reason unspoken.</p></div>
      <MovementEnd movement={absent} />
    </section>
    <section id="unless" className={`${styles.scene} ${styles.unless}`} tabIndex={-1} aria-labelledby="unless-title">
      <p className={styles.locator}>II · {unless.label}</p><h2 id="unless-title">{unless.title}</h2>
      <figure className={styles.twoVoices} data-verse="jhn20-25"><blockquote>{(() => {
        const v = thomasVerse('jhn20-25').text;
        const boundary = v.indexOf(' But he said');
        return <><span>{v.slice(0,boundary)}</span>{' '}<span>{v.slice(boundary + 1)}</span></>;
      })()}</blockquote><figcaption><a href="https://ebible.org/engwebp/JHN20.htm#V25">John 20:25</a> · World English Bible</figcaption></figure>
      <div className={styles.testimonyNote}><p>{unless.note}</p><details><summary>What had the others already seen?</summary><Verse id="jhn20-20" /><p>The earlier scene gives them sight of Jesus’s hands and side. Their report and Thomas’s condition belong in that sequence.</p></details></div>
      <MovementEnd movement={unless} />
    </section>
    <section id="eight-days" className={`${styles.scene} ${styles.gathering}`} tabIndex={-1} aria-labelledby="eight-title">
      <div className={styles.gatheredOpening}>{!reading && <SpatialArtwork variant="gathering" />}<div><p className={styles.locator}>III · {gathering.label}</p><h2 id="eight-title">{gathering.title}</h2><p>{gathering.note}</p></div></div>
      <div className={styles.gatheredText}><Verse id="jhn20-26" /><Verse id="jhn20-27" /><p className={styles.marginal}>An interval in the account.<br />No words are supplied for the days between.</p></div>
      <MovementEnd movement={gathering} />
    </section>
    <section id="confession" className={`${styles.scene} ${styles.confession}`} tabIndex={-1} aria-labelledby="confession-title">
      <p className={styles.locator}>IV · {confession.label}</p><h2 id="confession-title">{confession.title}</h2><Verse id="jhn20-28" dramatic />
      <p className={styles.confessionNote}>{confession.note}</p><MovementEnd movement={confession} />
    </section>
    <section id="not-seen" className={`${styles.scene} ${styles.ending}`} tabIndex={-1} aria-labelledby="ending-title">
      <p className={styles.locator}>V · {ending.label}</p><h2 id="ending-title">{ending.title}</h2><Verse id="jhn20-29" dramatic /><MovementEnd movement={ending} />
      <details className={styles.gospelPurpose}><summary>Read what John writes next</summary><Verse id="jhn20-30" /><Verse id="jhn20-31" /></details>
    </section>
    <section className={styles.doorway} aria-labelledby="sayings-door"><p className={styles.locator}>A different text. A separate exploration.</p><h2 id="sayings-door">Another book<br />bears his name.</h2>
      <p>The Gospel of Thomas survives as a collection of sayings attributed to Jesus. Its attribution to Didymos Judas Thomas does not establish that the apostle wrote it.</p>
      <p>This is a change of source, not the next scene in John.</p><Link className={styles.primary} href={THOMAS_ROUTES.sayings} prefetch={false}>Explore the sayings and manuscripts</Link><SourceLinks ids={['thomas-mattison','thomas-nhc']} />
    </section>
    <ThomasSources />
  </ThomasShell>;
}
