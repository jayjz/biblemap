"use client";

import { useEffect, useRef, useSyncExternalStore, type MouseEvent } from 'react';
import { HUMAN_CITY_COMPARISON_URL, HUMAN_CITY_DOCUMENT, HUMAN_CITY_REVIEW, HUMAN_CITY_SOURCES, HUMAN_CITY_VOICES } from '@/content/jonah-human-city';
import { humanCityPanel, HUMAN_CITY_QUERY, type HumanCityPanel } from '@/domain/human-city';

function subscribe(change: () => void) {
  window.addEventListener('popstate', change);
  window.addEventListener('hashchange', change);
  return () => { window.removeEventListener('popstate', change); window.removeEventListener('hashchange', change); };
}
const snapshot = () => window.location.search + window.location.hash;
const serverSnapshot = () => '';
const subscribeReady = () => () => {};
const ready = () => true;
const serverReady = () => false;

function Source({ id }: { id: keyof typeof HUMAN_CITY_SOURCES }) {
  const source = HUMAN_CITY_SOURCES[id];
  return <a href={source.url} target="_blank" rel="noreferrer">{source.title} <span className="human-city-new-tab">(new tab)</span></a>;
}

function House() {
  const record = HUMAN_CITY_DOCUMENT;
  return <div className="human-city-house">
    <p className="human-city-kind">Historical document · {record.date}</p>
    <div className="human-city-sale">
      <p className="human-city-document-label">Documentary paraphrase · Akkadian legal tablet</p>
      <p className="human-city-sellers">{record.owners}<span>Named owners of the house being sold</span></p>
      <div className="human-city-transfer"><span>Buyer</span><p>{record.buyer}<small>{record.buyerRole}</small></p></div>
      <dl>{record.details.map(item => <div key={item.id}><dt>{item.title}</dt><dd>{item.text}<small>{item.locator}</small></dd></div>)}</dl>
      <p className="human-city-document-id">{record.identifier}</p>
    </div>
    <div className="human-city-context">
      <p>{HUMAN_CITY_SOURCES.sale.limitation}</p>
      <Source id="sale" />
      <Source id="object" />
      <details><summary>Edition, dating and rights</summary><p>{HUMAN_CITY_SOURCES.sale.author}</p><p>{HUMAN_CITY_SOURCES.sale.locator}</p><p>{HUMAN_CITY_SOURCES.sale.edition}</p><p>{HUMAN_CITY_SOURCES.sale.rights} <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">License (new tab)</a></p><p>{HUMAN_CITY_SOURCES.object.edition}</p><p>{HUMAN_CITY_SOURCES.object.rights} This typographic presentation is not a facsimile or a reconstruction of a house.</p></details>
    </div>
  </div>;
}

function Voices() {
  return <div className="human-city-voices">
    <p className="human-city-kind">Two medieval Jewish interpretations · Jonah 4:11</p>
    <p className="human-city-shared">Both readers identify children. They understand the animals differently.</p>
    <div className="human-city-facing">{HUMAN_CITY_VOICES.map(voice => <section key={voice.id} aria-labelledby={`human-city-${voice.id}`}>
      <p className="human-city-era">{voice.name} · {voice.era}</p>
      <h4 id={`human-city-${voice.id}`}>{voice.author}</h4>
      <p className="human-city-reading-title">{voice.title}</p>
      <p>{voice.reading}</p><p>{voice.concern}</p>
      <Source id={voice.id} />
      <details><summary>Passage, edition and translation limits</summary><p>{HUMAN_CITY_SOURCES[voice.id].locator}</p><p>{HUMAN_CITY_SOURCES[voice.id].edition}</p><p>{HUMAN_CITY_SOURCES[voice.id].rights}</p><p>{HUMAN_CITY_SOURCES[voice.id].limitation}</p></details>
    </section>)}</div>
    <p className="human-city-paraphrase">Study paraphrases, not quotations. English wording awaits human language and editorial review.</p>
    <a href={HUMAN_CITY_COMPARISON_URL} target="_blank" rel="noreferrer">Compare the Hebrew in ALHaTorah’s Mikraot Gedolot (new tab)</a>
  </div>;
}

function Content({ panel }: { panel: HumanCityPanel }) { return panel === 'house' ? <House /> : <Voices />; }

function DiscoveryDialog({ panel, close }: { panel: HumanCityPanel; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnToVerse = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    heading.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      const verse = document.querySelector<HTMLElement>('[data-reference="4:11"]');
      if (returnToVerse.current) { verse?.focus({ preventScroll: true }); verse?.scrollIntoView({ block: 'center', behavior: 'instant' }); }
      else if (previous instanceof HTMLElement && previous.isConnected && previous.getClientRects().length) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="human-city-dialog" aria-labelledby="human-city-dialog-heading" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, summary')].filter(control => control.getClientRects().length > 0);
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    <header className="human-city-dialog-top"><span>Alongside Jonah 4:11</span><button type="button" onClick={close} aria-label="Close discovery">Close <span aria-hidden="true">×</span></button></header>
    <div className="human-city-dialog-body">
      <h3 ref={heading} tabIndex={-1} id="human-city-dialog-heading">{panel === 'house' ? HUMAN_CITY_DOCUMENT.title : 'Who is within the question?'}</h3>
      <Content panel={panel} />
      <button type="button" className="human-city-return" onClick={() => { returnToVerse.current = true; close(); }}>Return to Jonah 4:11</button>
    </div>
  </dialog>;
}

export function HumanCity({ active }: { active: boolean }) {
  const location = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const enhanced = useSyncExternalStore(subscribeReady, ready, serverReady);
  const query = location.split('#')[0];
  const hash = location.includes('#') ? '#' + location.split('#')[1] : '';
  const panel = active ? humanCityPanel(query, hash) : null;
  function open(event: MouseEvent<HTMLElement>, next: HumanCityPanel) {
    if (!enhanced) return;
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set(HUMAN_CITY_QUERY, next);
    url.hash = HUMAN_CITY_REVIEW.sceneId;
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  function close() {
    const url = new URL(window.location.href);
    url.searchParams.delete(HUMAN_CITY_QUERY);
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  return <section className="human-city" aria-label="The people within the city" data-review-status={HUMAN_CITY_REVIEW.status}>
    <div className="human-city-threshold">
      <p className="human-city-place">Nineveh <span>{HUMAN_CITY_DOCUMENT.date}</span></p>
      <div className="human-city-names"><p>{HUMAN_CITY_DOCUMENT.nameInThreshold}<small>{HUMAN_CITY_DOCUMENT.nameRole}</small></p><p>{HUMAN_CITY_DOCUMENT.buyer}<small>{HUMAN_CITY_DOCUMENT.buyerRole}</small></p></div>
      <p className="human-city-threshold-note">Names preserved in a house-sale document.<br />Seventh century BCE · later historical context.</p>
    </div>
    {(['house', 'voices'] as const).map(id => <details key={id} className="human-city-door" id={`human-city-${id}-inline`}>
      <summary onClick={event => open(event, id)} aria-haspopup={enhanced ? 'dialog' : undefined}>
        <span><span>{id === 'house' ? 'Read a house sale' : 'Read two interpretations'}</span><small>{id === 'house' ? 'SAA 6 142 · 692 BCE' : 'Rashi and Radak · Jonah 4:11'}</small></span><span aria-hidden="true">↗</span>
      </summary>
      {!enhanced && <div className="human-city-inline"><Content panel={id} /><a href="#jonah-4-question">Return to Jonah 4:11</a></div>}
    </details>)}
    {panel && <DiscoveryDialog key={panel} panel={panel} close={close} />}
  </section>;
}
