"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { EvidenceKind, WorldId, HumanConnection } from "@/domain/human-story";
import { EVIDENCE_LABELS, CONNECTION_LABELS } from "@/domain/human-story";
import { WORLDS } from "./worlds";
import styles from "./human-story.module.css";

export interface ExplorerEntry {
  id: string;
  title: string;
  subtitle: string;
  kind: EvidenceKind;
  worlds: readonly WorldId[];
  era: string;
  searchText: string;
}
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ConnectedExplorer({ entries, connections }: { entries: readonly ExplorerEntry[]; connections: readonly HumanConnection[] }) {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState("all");
  const [selectedId, setSelectedId] = useState("jonah");
  const [showAll, setShowAll] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const selectionRequested = useRef(false);
  const selected = entries.find(entry => entry.id === selectedId);
  const normalize = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const terms = normalize(query.trim());
  const visible = entries.filter(entry => (world === "all" || entry.worlds.some(id => id === world)) && normalize(entry.searchText).includes(terms));
  const shown = hydrated && !showAll && !terms && world === "all" ? visible.slice(0, 6) : visible;
  const related = connections.flatMap(connection => {
    const other = connection.from === selectedId ? connection.to : connection.to === selectedId ? connection.from : undefined;
    const entry = entries.find(candidate => candidate.id === other);
    return entry ? [{ connection, entry }] : [];
  });
  const priority = { reception: 0, textual: 1, context: 2, comparison: 3, disputed: 4 };
  related.sort((a, b) => priority[a.connection.kind] - priority[b.connection.kind]);
  useEffect(() => {
    if (selectionRequested.current) {
      previewHeading.current?.focus({ preventScroll: !window.matchMedia("(max-width: 720px)").matches });
      selectionRequested.current = false;
    }
  }, [selectedId]);
  function selectEntry(id: string) {
    selectionRequested.current = true;
    if (id === selectedId) {
      previewHeading.current?.focus();
      selectionRequested.current = false;
    } else setSelectedId(id);
  }
  return <div className={styles.explorer}>
    <div className={styles.explorerControls} hidden={!hydrated}>
      <label>Find a person, passage or place<input ref={searchInput} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Jonah, Carthage or a garden" /></label>
      <label>Explore a world<select value={world} onChange={event => setWorld(event.target.value)}><option value="all">All five worlds</option>{WORLDS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <p role="status">{shown.length < visible.length ? `${shown.length} of ` : ""}{visible.length} {visible.length === 1 ? "reading" : "readings"}</p>
      {visible.length > 6 && !terms && world === "all" && <button className={styles.showAll} type="button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show featured readings" : `Browse all ${entries.length} readings`}</button>}
    </div>
    <noscript><p>All readings are listed below. Each opens with its sources and connections; use the five-world navigation to narrow your exploration.</p></noscript>
    <div className={styles.explorerColumns}>
      <div className={styles.explorerList}>
        {shown.map(entry => <article className={styles.explorerEntry} data-selected={entry.id === selectedId} key={entry.id} id={`reading-${entry.id}`} tabIndex={-1}>
          <p className={styles.evidenceLabel}>{EVIDENCE_LABELS[entry.kind]}</p><h3><Link prefetch={false} href={`/human-story/${entry.id}/`}>{entry.title}</Link></h3><p>{entry.subtitle}</p>
          <div className={styles.explorerEntryFooter}><span>{entry.worlds.map(id => WORLDS.find(item => item.id === id)?.name).join(" / ")}</span><button hidden={!hydrated} type="button" onClick={() => selectEntry(entry.id)} aria-label={`Show connections for ${entry.title}`} aria-pressed={entry.id === selectedId} aria-controls="connection-preview">{entry.id === selectedId ? "Selected" : "Connections"}</button></div>
        </article>)}
        {visible.length === 0 && <div className={styles.emptyState}><h3>No readings match that search.</h3><p>Try a name such as Jonah or Augustine, or explore all five worlds.</p><button type="button" onClick={() => { setQuery(""); setWorld("all"); searchInput.current?.focus(); }}>Clear search and filters</button></div>}
      </div>
      <aside className={styles.connectionPreview} id="connection-preview" aria-label="Preview connections" hidden={visible.length === 0}>
        <p>Every reading has a way onward</p><h3 ref={previewHeading} tabIndex={-1}>Connected to {selected?.title}</h3>
        <div className={styles.previewRoot}><Link prefetch={false} href={`/human-story/${selectedId}/`}>{selected?.subtitle}</Link></div>
        <ul>{related.slice(0, 3).map(({ connection, entry }) => <li key={connection.id}><p>{CONNECTION_LABELS[connection.kind]}</p><Link prefetch={false} href={`/human-story/${entry.id}/`}>{entry.title}</Link><p>{connection.label}</p></li>)}</ul>
        <Link className={styles.allConnections} prefetch={false} href={`/human-story/${selectedId}/`}>All {related.length} connections & sources</Link>
        <a className={styles.returnToSelection} href={`#reading-${selectedId}`}>Return to the selected reading</a>
        <p className={styles.previewLimit}>A line means the stated relationship. Its source and limits are inside the reading; it does not automatically mean influence or historical proof.</p>
      </aside>
    </div>
  </div>;
}
