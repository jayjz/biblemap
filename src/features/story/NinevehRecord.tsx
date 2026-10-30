"use client";

import { useRef, useSyncExternalStore, type MouseEvent } from 'react';
import { NINEVEH_RECORD as record, NINEVEH_READING as reading } from '@/content/jonah-nineveh-record';

function subscribe(change: () => void) {
  window.addEventListener('popstate', change);
  window.addEventListener('hashchange', change);
  return () => {
    window.removeEventListener('popstate', change);
    window.removeEventListener('hashchange', change);
  };
}
const snapshot = () => window.location.search + window.location.hash;
const serverSnapshot = () => null;

/** A modern reading of relationships in a text, never a tablet facsimile or plan. */
export function NinevehRecord() {
  const location = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const summary = useRef<HTMLElement>(null);
  const open = location !== null && new URLSearchParams(location.split('#')[0]).get('record') === 'sale'
    && location.endsWith('#jonah-3-mercy');
  function change(event: MouseEvent<HTMLElement>, next: boolean) {
    if (location === null) return; // Native disclosure remains the no-JS reader.
    event.preventDefault();
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('record', 'sale');
    else url.searchParams.delete('record');
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (!next) requestAnimationFrame(() => summary.current?.focus({ preventScroll: true }));
  }
  return <section className="nineveh-record" aria-label="A house sale from ancient Nineveh" data-editorial-status={record.review.status}>
    <div className="nineveh-document">
      <header className="nineveh-document-heading"><span>Historical document</span><span>Nineveh, {record.date}</span></header>
      <h3>A house changes hands</h3>
      <p className="nineveh-record-name">{record.owner.name}<small>{record.owner.role}</small></p>
      <div className="nineveh-transfer"><span aria-hidden="true">↓</span><span>A sale recorded in clay</span></div>
      <p className="nineveh-record-name">{record.buyer.name}<small>{record.buyer.role}</small></p>
      <details className="nineveh-sale" open={location === null ? undefined : open}>
        <summary ref={summary} onClick={event => change(event, !open)}>Follow the sale <span aria-hidden="true">＋</span></summary>
        <div className="nineveh-sale-reading">
          <p className="nineveh-record-kind">Documentary paraphrase from an Akkadian legal tablet</p>
          <dl>{record.transfer.map(item => <div key={item.id}>
            <dt>{item.title}</dt><dd>{item.text}<small>{item.locator}</small></dd>
          </div>)}</dl>
          <a href="?record=sale#jonah-3-mercy">Link to this reading</a>
          {location !== null && <button type="button" onClick={event => change(event, false)}>Close the record</button>}
        </div>
      </details>
      <p className="nineveh-document-caption">A modern reading of a document.<br />Not a facsimile or a reconstructed house.</p>
    </div>
    <div className="nineveh-record-context">
      <p>{record.limitation}</p>
      <details className="nineveh-record-sources"><summary>Read the original record and its limits</summary>
        <p>{record.identifier}. {record.source.editors}</p>
        <p>Date: {record.source.dateLocator}. Names: {record.owner.locator}; {record.buyer.locator}. English study paraphrases await human review.</p>
        <p>Adapted from the ORACC edition, shared under <a href={record.source.licenseUrl}>{record.source.license}</a>. The tablet photograph has noncommercial terms and is not reproduced here.</p>
        <a href={record.source.url} target="_blank" rel="noreferrer">Read the Akkadian edition and translation (new tab)</a>
        <a href={record.source.objectUrl} target="_blank" rel="noreferrer">Inspect the clay tablet’s catalog record (new tab)</a>
      </details>
    </div>
  </section>;
}

export function NinevehJewishReading() {
  return <details className="nineveh-jewish-reading">
    <summary>{reading.title}<span>{reading.tradition}</span></summary>
    <div>
      <p>{reading.paraphrase}</p><p className="nineveh-reading-limit">{reading.limitation}</p>
      <a href={reading.url} target="_blank" rel="noreferrer">Read {reading.locator} (new tab)</a>
    </div>
  </details>;
}
