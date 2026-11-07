import Link from 'next/link';
import { THOMAS_DOCUMENTS, THOMAS_OPEN_QUESTIONS, THOMAS_SCHOLARLY_READINGS, THOMAS_TRADITIONS, THOMAS_VOICES } from '@/content/thomas-evidence';
import { THOMAS_MANUSCRIPTS, THOMAS_ROUTES } from '@/content/thomas';
import { SourceLinks, SourceReference } from './ThomasReferences';
import { ManuscriptShape } from './ManuscriptForm';
import { CinematicImage } from './CinematicImage';
import styles from './sources.module.css';

const passage=(anchor:string,sayings:boolean)=>sayings?`${THOMAS_ROUTES.encounter}#${anchor}`:`#${anchor}`;

export function ThomasVoices({ reading, sayings }: { reading:boolean; sayings:boolean }) {
  return <section id="source-voices" tabIndex={-1} aria-labelledby="voices-title" className={styles.voices}>
    <div className={styles.voiceOpening}>{!reading&&<div className={styles.environment}><CinematicImage image="interior" /></div>}
      <div><p className={styles.kind}>The Voices · recorded speech within John</p><h2 id="voices-title">People in the account.<br />A voice that tells it.</h2><p>Thomas speaks. Others speak to him. The Gospel lets us follow who says what, while leaving much of their lives unrecorded.</p></div>
      {!reading&&<p className={styles.artLimit}><a href="#art-provenance">AI-generated imagined environment. Anonymous figures, not portraits of the speakers or the Gospel’s author.</a></p>}
    </div>
    <ol className={styles.voiceSequence}>{THOMAS_VOICES.map(v=><li key={v.id} data-evidence-kind={v.relation}><h3>{v.person}</h3><p>{v.text}</p><a href={passage(v.anchor,sayings)}>{v.reference} · return to the passage</a></li>)}</ol>
    <p className={styles.sectionLimit}>These are voices as John’s Gospel narrates them. Calling the work “John” does not turn it into a modern interview transcript or settle its authorship here. <SourceReference id="thomas-john20">Read the chapter in its source</SourceReference>.</p>
  </section>;
}

export function ThomasWitnesses({ sayings }: { sayings:boolean }) {
  return <section id="source-witnesses" tabIndex={-1} aria-labelledby="document-title" className={styles.witnesses}>
    <header><p className={styles.kind}>The Witnesses · physical copies of a different text</p><h2 id="document-title">Hands copied words.<br />Different portions survive.</h2><p>The separately attributed Gospel of Thomas is a sayings collection, not the next scene in John. Its Greek and Coptic copies preserve evidence of transmission, not another witness to the encounter in the room.</p></header>
    <div className={styles.materials}>{THOMAS_DOCUMENTS.map(d=>{
      const m=THOMAS_MANUSCRIPTS.find(m=>m.id===d.id);
      if(!m) throw new Error(`Missing physical witness ${d.id}`);
      return <article key={d.id} data-evidence-kind={d.relation}>
        <figure className={styles.object}><ManuscriptShape id={d.id} /><figcaption>Original format diagram · schematic, not a facsimile or scale drawing</figcaption></figure>
        <p className={styles.kind}>{m.title} · {m.language}</p><h3>{d.title}</h3><p>{d.text}</p><p className={styles.copyDate}>{m.date}</p><p className={styles.documentLimit}>{d.limit}</p><SourceLinks ids={d.sourceIds} concise/>
      </article>;
    })}</div>
    <p className={styles.names}>John calls Thomas Didymus, with the sense “Twin,” without naming his twin. The sayings prologue adds Judas. The collection names James the Just and Thomas separately; Thomas is not James, the brother of Jesus. <SourceReference id="thomas-mattison">Inspect the prologue and sayings 12–13</SourceReference>; <SourceReference id="thomas-john20">compare John’s naming</SourceReference>.</p>
    <div className={styles.documentExit}><p>The remaining Greek witnesses preserve other portions. Examine all four, then compare sayings 13 and 26 without restoring what is missing.</p><Link href={sayings?'#witnesses':THOMAS_ROUTES.sayings} prefetch={false}>{sayings?'Inspect the four manuscript witnesses':'Explore the sayings and manuscripts'}</Link></div>
  </section>;
}

export function ThomasTraditions() {
  return <section id="source-traditions" tabIndex={-1} aria-labelledby="traditions-title" className={styles.traditions}>
    <header><p className={styles.kind}>The Traditions · later remembrance</p><h2 id="traditions-title">Beyond the room,<br />different stories are told.</h2><p>Later works place Thomas in a wider world. Read the people who transmit these accounts and the kind of writing each gives us.</p></header>
    <div className={styles.traditionPair}>{THOMAS_TRADITIONS.map(t=><article key={t.id} data-evidence-kind={t.relation}>
      <p className={styles.place}>{t.place}</p><h3>{t.person}</h3><p className={styles.role}>{t.role}<br />{t.date}</p><p>{t.text}</p><p className={styles.documentLimit}>{t.limit}</p><p className={styles.locator}>{t.locator}</p><SourceLinks ids={t.sourceIds} concise/>
    </article>)}</div>
    <p className={styles.traditionBoundary}>Two literary settings, not a recovered route. Neither later work supplies independent confirmation of John’s encounter. We do not join Parthia and India into an authenticated itinerary.</p>
  </section>;
}

export function ThomasQuestions({ sayings }: { sayings:boolean }) {
  return <section id="source-questions" tabIndex={-1} aria-labelledby="questions-title" className={styles.questions}>
    <header><p className={styles.kind}>The Questions · what the evidence leaves open</p><h2 id="questions-title">To read closely<br />is also to leave things open.</h2></header>
    <dl className={styles.openQuestions}>{THOMAS_OPEN_QUESTIONS.map(q=><div key={q.id} data-evidence-kind={q.relation}><dt>{q.title}</dt><dd><p>{q.text}</p><SourceLinks ids={q.sourceIds} concise/>{q.id==='comparison'&&<Link href={sayings?'#comparison':`${THOMAS_ROUTES.sayings}#comparison`} prefetch={false}>Compare the actual texts</Link>}</dd></div>)}</dl>
    <div className={styles.scholars}><h3>Scholars ask different questions of the same survival.</h3>{THOMAS_SCHOLARLY_READINGS.map(s=><article key={s.id} data-evidence-kind={s.relation}><h4>{s.person}</h4><p>{s.text}</p><SourceLinks ids={s.sourceIds} concise/></article>)}</div>
    <p className={styles.artBoundary}>The rooms and people imagined in this experience are artistic interpretation. They establish no location, likeness, gesture or missing event. John does not narrate Thomas touching Jesus. <a href="#art-provenance">Inspect the art’s provenance</a>.</p>
    <a className={styles.returnLink} href={passage('not-seen',sayings)}>{sayings?'Return to John’s ending':'Return to the blessing and written purpose'}</a>
  </section>;
}
