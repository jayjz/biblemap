// Local experiment only. Not imported by the application or included in its export.
import { createRoot } from 'react-dom/client';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import chapter3 from '../src/content/scripture/web-jonah-3.json';
import chapter4 from '../src/content/scripture/web-jonah-4.json';

const Geography = lazy(() => import('./irreplaceable-map'));
const verses = [
  ...chapter3.verses.filter(verse => verse.number === 10).map(verse => ({ ...verse, reference: `3:${verse.number}` })),
  ...chapter4.verses.slice(0, 4).map(verse => ({ ...verse, reference: `4:${verse.number}` })),
];
type Treatment = 'a' | 'b' | 'c';
const names = { a: 'Words beside words', b: 'The city remains', c: 'A wider frame' };
function readLocation() {
  const params = new URLSearchParams(location.search);
  const candidate = params.get('t');
  const treatment: Treatment = candidate === 'b' || candidate === 'c' ? candidate : 'a';
  const reference = location.hash.slice(1);
  const index = verses.findIndex(verse => verse.reference === reference);
  return { treatment, index: index < 0 ? 0 : index };
}

function Verse({ index, prominent = false }: { index: number; prominent?: boolean }) {
  const verse = verses[index];
  return <div className={`verse${prominent ? ' prominent' : ''}`} data-verse={verse.reference}>
    <p className="reference">Jonah {verse.reference}</p><p className="scripture">{verse.text}</p>
  </div>;
}

function Literary({ index }: { index: number }) {
  const [beside, setBeside] = useState(true);
  return <>
    <div className={`literary ${index > 0 && beside ? 'paired' : ''}`}>
      {index > 0 && beside && <div className="earlier"><Verse index={0} /></div>}
      <div className="current"><Verse index={index} prominent /></div>
    </div>
    {index > 0 && <button className="quiet" aria-pressed={beside} onClick={() => setBeside(!beside)}>{beside ? 'Read this verse alone' : 'Place 3:10 beside this verse'}</button>}
  </>;
}

function Spatial({ index }: { index: number }) {
  const [wide, setWide] = useState(false);
  return <>
    <div className={`spatial ${wide ? 'wide' : ''}`}>
      <figure className="city-field" aria-label="Abstract composition representing a city; not a reconstruction">
        <div className="paper-city" aria-hidden="true">{Array.from({ length: 67 }, (_, i) => <i key={i} style={{ left: `${12 + ((i * 29) % 73)}%`, top: `${8 + ((i * 17) % 79)}%`, width: `${4 + i % 7}%`, height: `${2 + i % 5}%`, transform: `rotate(${(i % 5) * 3 - 6}deg)` }} />)}</div>
        <figcaption>Nineveh</figcaption>
        {index > 0 && <div className="city-text"><Verse index={0} /></div>}
      </figure>
      <div className="spatial-voice"><Verse index={index} prominent /></div>
    </div>
    <div className="composition-controls" role="group" aria-label="Composition scale">
      <button aria-pressed={!wide} onClick={() => setWide(false)}>Close composition</button>
      <button aria-pressed={wide} onClick={() => setWide(true)}>Wide composition</button>
    </div>
    <p className="caption">Original abstract composition · shapes are not buildings, people, or a population count.</p>
  </>;
}

function Sources() {
  return <details className="notes"><summary>Sources & what this composition implies</summary>
    <div className="note-grid">
      <div><h2>Scripture</h2><p>World English Bible, public domain. Unaltered text from BibleMap’s pinned October 10 snapshots. The five steps contain Jonah 3:10–4:4. The following passage is available below in full.</p><a href={chapter3.sourceUrl}>Jonah 3 · publisher</a> · <a href={chapter4.sourceUrl}>Jonah 4 · publisher</a></div>
      <div><h2>Language & interpretation</h2><p>Hebrew links the city’s evil, threatened disaster, and Jonah’s displeasure through related language. English wording can make that link less apparent. This is a translator’s observation, not a claim that the three uses have an identical meaning.</p><a href="https://classic.net.bible.org/verse.php?book=Jon&chapter=4&verse=1">NET translator’s notes, 4:1</a><p>WEB renders 4:4 as a question about the rightness of anger. NET emphasizes its intensity. Neither supplies Jonah’s answer to 4:11.</p><a href="https://classic.net.bible.org/verse.php?book=Jon&chapter=4&verse=4">Compare translations of 4:4</a></div>
      <div><h2>Place & evidence</h2><p>Nineveh’s marker reuses the existing Pleiades site record. It identifies the ancient site opposite Mosul, not Jonah’s position. The optional basemap is modern. No route, visit date, ancient street plan, or historical population is reconstructed.</p><a href="https://pleiades.stoa.org/places/874621">Pleiades 874621 · Nineveh</a><p>Jonah’s location east of the city appears in 4:5. These treatments do not place him there during 3:10–4:4.</p></div>
      <div><h2>Draft artistic choices</h2><p>These AI-assisted compositions and their arrangement are local experiments awaiting creator review. Typography, adjacency, and scale are artistic decisions. They are not historical evidence or creator-authored narration. No third-party artwork or sound is added.</p><p>Literary reference: James E. Robson, “Undercurrents in Jonah,” <i>Tyndale Bulletin</i> 64.2 (2013), pp. 193, 199, 207–208. His reading informs the comparison; it does not settle the story’s meaning.</p><a href="https://www.tyndalebulletin.org/article/29354.pdf">Read Robson’s article</a></div>
    </div>
  </details>;
}

function Experiment() {
  const [state, setState] = useState(readLocation);
  const heading = useRef<HTMLHeadingElement>(null);
  const { treatment, index } = state;
  useEffect(() => {
    const sync = () => setState(readLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);
  function step(next: number) {
    history.pushState(null, '', `?t=${treatment}#${verses[next].reference}`);
    setState({ treatment, index: next });
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
  }
  return <div className={`experiment treatment-${treatment}`} data-treatment={treatment} data-step={verses[index].reference}>
    <a className="skip" href="#encounter">Skip to Scripture</a>
    <header><span className="wordmark">BibleMap</span><span className="draft">Local experiment · creator review</span><a href="/jonah/#jonah-3-mercy">Existing reader ↗</a></header>
    <nav className="conditions" aria-label="Compare treatments">
      {(['a', 'b', 'c'] as const).map(key => <a key={key} href={`?t=${key}#${verses[index].reference}`} aria-current={treatment === key ? 'page' : undefined}><span>{key.toUpperCase()}</span> {names[key]}</a>)}
      <a href="/jonah/#jonah-3-mercy"><span>D</span> Existing reader</a>
    </nav>
    <main id="encounter">
      <div className="encounter-heading"><div><p className="eyebrow">The book of Jonah · World English Bible</p><h1 ref={heading} tabIndex={-1}>Jonah 3:10–4:4</h1></div><p className="pace">{index + 1} / 5 <span>At your pace. In silence.</span></p></div>
      <section className="treatment-stage" aria-label={`Treatment ${treatment.toUpperCase()}: ${names[treatment]}`}>
        {treatment === 'a' && <Literary index={index} />}
        {treatment === 'b' && <div className="geographic"><Suspense fallback={<div className="place-loading"><h2>Nineveh</h2><p>Loading place controls. Scripture remains available.</p></div>}><Geography /></Suspense><div className="geographic-text"><Verse index={index} prominent />{index > 0 && <details className="previous"><summary>Read 3:10 alongside</summary><Verse index={0} /></details>}</div></div>}
        {treatment === 'c' && <Spatial index={index} />}
      </section>
      <nav className="verse-navigation" aria-label="Passage navigation">
        <button onClick={() => step(index - 1)} disabled={index === 0}>← Previous verse</button>
        <div className="verse-index" aria-label="Choose a verse">{verses.map((verse, n) => <button key={verse.reference} aria-label={`Read Jonah ${verse.reference}`} aria-current={index === n ? 'step' : undefined} onClick={() => step(n)}>{verse.reference}</button>)}</div>
        <button onClick={() => step(index + 1)} disabled={index === verses.length - 1}>Next verse →</button>
      </nav>
      <p className="status" role="status">Reading Jonah {verses[index].reference}</p>
      <details className="continuation"><summary>Continue in Scripture · Jonah 4:5–11</summary>
        <div className="continuation-text">{chapter4.verses.slice(4).map(verse => <div className="verse" key={verse.number}><p className="reference">Jonah 4:{verse.number}</p><p className="scripture" data-continuation={`4:${verse.number}`}>{verse.text}</p></div>)}</div>
      </details>
      <Sources />
      <details className="notes"><summary>Review the experiment</summary><p>Keep the reading task the same across all four conditions. Ask: “What happened? What reason does Jonah give for his earlier flight? What does the text leave unanswered?” Then ask what, if anything, the interaction helped the visitor notice. Do not suggest a preferred interpretation.</p><p>No participant findings are claimed. The hypothesis fails if keeping Nineveh or 3:10 present adds distraction without improving recognition of the relationship, or if it leads visitors to invent a change in Jonah that the text does not narrate. Compare with the existing reader; it may be better.</p></details>
    </main>
    <footer><a href="/jonah/#jonah-3-mercy">Read the passage in its full journey ↗</a><span>Nothing is recorded or submitted.</span></footer>
  </div>;
}
const root = document.getElementById('experiment-root');
if (!root) throw new Error('Missing experiment root');
createRoot(root).render(<Experiment />);
