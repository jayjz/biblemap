"use client";

import { Component, lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import chapter3 from "@/content/scripture/web-jonah-3.json";
import chapter4 from "@/content/scripture/web-jonah-4.json";
import { DISCOVERY_SOURCES, STORY_PLACES } from "@/content/jonah-discoveries";
import { NINEVEH_BEATS as beats, parseNinevehHash } from "@/domain/nineveh-navigation";
import { DiscoveryEntrances, NinevehDiscoveryDialog } from "./NinevehDiscovery";

const Environment = lazy(() => import("./NinevehEnvironment"));
const mercy = chapter3.verses.filter(verse => verse.number === 10);
const response = chapter4.verses.filter(verse => verse.number <= 4);
const question = response.filter(verse => verse.number === 4);
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => { window.removeEventListener("hashchange", onChange); window.removeEventListener("popstate", onChange); };
}
const snapshot = () => location.hash.slice(1);
const serverSnapshot = () => null;

class EnvironmentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="nineveh-visual-status" role="status">The landscape is unavailable. Nineveh remains our place; the full passage is available below.</p> : this.props.children; }
}

function Verses({ verses, chapter }: { verses: typeof mercy; chapter: number }) {
  return <div className="nineveh-verses">{verses.map(verse => <p key={verse.number}><sup aria-label={`Verse ${verse.number}`}>{verse.number}</sup><span data-reference={`${chapter}:${verse.number}`}>{verse.text}</span></p>)}</div>;
}

export function NinevehEncounter({ published = false }: { published?: boolean } = {}) {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const { beat, discovery } = parseNinevehHash(hash);
  const index = beats.indexOf(beat);
  const [paused, setPaused] = useState(false);
  const [plain, setPlain] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const lastBeat = useRef<string | null>(null);
  useEffect(() => {
    if (hash === null) return;
    if (lastBeat.current !== beat.id) {
      if (lastBeat.current !== null || hash) {
        heading.current?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      lastBeat.current = beat.id;
    }
  }, [hash, beat.id]);
  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== `#${id}`) {
      history.pushState(id.includes("/") ? { ninevehDiscovery: true } : null, "", `#${id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }
  function closeDiscovery() {
    if (history.state?.ninevehDiscovery) history.back();
    else {
      history.replaceState(null, "", `#${beat.id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }
  const reader = beat.id === "city" || beat.id === "mercy" ? "/jonah/#jonah-3-mercy" : "/jonah/#jonah-4-anger";
  // 2026-10-25: Nineveh opens at Jonah 3; the homepage must offer the actual beginning of the story.
  const readerExit = published && beat.id === "city" ? "/jonah/#jonah-1-calling" : reader;

  return <div className="nineveh" data-beat={beat.id} data-ready={hash !== null} data-plain={plain} data-paused={paused} data-published={published}>
    <a className="nineveh-skip" href="#main-content" onClick={event => { event.preventDefault(); heading.current?.focus(); }}>Skip to reading</a>
    <header className="nineveh-header"><Link href="/" prefetch={false} className="nineveh-brand">BibleMap</Link><span>Jonah · The human story</span><div><Link href="/explore/" prefetch={false}>Explore epochs</Link><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button><a href={readerExit}>{published ? "Read Jonah" : "Exit to reader"} <span aria-hidden="true">↗</span></a></div></header>
    <div className="nineveh-landscape" role="img" aria-label="Interpretive landscape: a distant city beside water and open terrain. Nineveh remains in view through all four passages. This is not Jonah’s viewpoint.">
      {!plain && <EnvironmentBoundary><Suspense fallback={<p className="nineveh-visual-status" role="status">Preparing the landscape. You can begin reading.</p>}><Environment beat={beat.id} paused={paused} mode={published ? "published" : "review"} /></Suspense></EnvironmentBoundary>}
      <div className="nineveh-place-anchor"><span className="nineveh-place-rule"/><strong>Nineveh</strong><span>Tigris valley</span></div>
      <span className="nineveh-landscape-caption">{published ? "Illustrative city study · Not archaeological evidence" : "AI-generated · Interpretive reconstruction"}</span>
      {plain && <p className="nineveh-visual-status">Text view · Nineveh, opposite modern Mosul</p>}
    </div>
    <main className="nineveh-main" id="main-content">
      <section className="nineveh-reading" aria-labelledby="nineveh-heading">
        <p className="nineveh-eyebrow">{beat.id === "city" ? "The book of Jonah" : "Scripture · World English Bible"}</p>
        <h1 id="nineveh-heading" ref={heading} tabIndex={-1}>{beat.id === "city" ? <>Nineveh<span>The city remains.</span></> : beat.reference}</h1>
        {beat.id === "city" ? <div className="nineveh-orientation"><p>Beside the Tigris.</p><p className="nineveh-range">Jonah 3:10–4:4</p>{published && <p className="nineveh-entry-note">This encounter begins late in Jonah’s journey. <a href="/jonah/#jonah-1-calling">Begin at Jonah 1:1</a> to read the story from its first words.</p>}</div> : <>
          <Verses verses={beat.id === "mercy" ? mercy : beat.id === "anger" ? response : question} chapter={beat.id === "mercy" ? 3 : 4} />
          {(beat.id === "anger" || beat.id === "question") && <details className="nineveh-recall" key={beat.id}><summary>Return to what happened · 3:10</summary><p className="nineveh-eyebrow">Jonah 3:10 · World English Bible</p><Verses verses={mercy} chapter={3}/></details>}
        </>}
      </section>
      {(published || beat.id !== "city") && <DiscoveryEntrances beat={beat.id} navigate={navigate}/>}
      <nav className="nineveh-navigation" aria-label="Encounter navigation">
        {beat.id === "city" && <p className="nineveh-pace">Take your time. Continue when you are ready.</p>}
        <div className="nineveh-step-links">
          {index > 0 ? <a href={`#${beats[index - 1].id}`} onClick={event => navigate(event, beats[index - 1].id)}>← Back</a> : <a href="/jonah/#jonah-3-mercy">Read preceding passage</a>}
          {index < beats.length - 1 ? <a className="nineveh-continue" href={`#${beats[index + 1].id}`} onClick={event => navigate(event, beats[index + 1].id)}>{index === 0 ? "Begin with 3:10" : index === 1 ? "Read Jonah’s response" : "Stay with the question"}<span aria-hidden="true"> →</span></a> : <a className="nineveh-continue" href="/jonah/#jonah-4-shade">Continue · Jonah 4:5–11 <span aria-hidden="true">→</span></a>}
        </div>
        <ol className="nineveh-beats">{beats.map((item, number) => <li key={item.id}><a href={`#${item.id}`} onClick={event => navigate(event, item.id)} aria-current={item.id === beat.id ? "step" : undefined}><span aria-hidden="true">0{number + 1}</span>{item.label}</a></li>)}</ol>
      </nav>
    </main>
    <footer className="nineveh-footer">
      <div className="nineveh-tools"><span>At your pace · In silence</span><div><button type="button" aria-pressed={plain} onClick={() => setPlain(!plain)}>{plain ? "Show landscape" : "Text view"}</button></div></div>
      <details className="nineveh-sources"><summary>Place, Scripture & the making of this view</summary><div className="nineveh-source-grid">
        <section><h2>The place</h2><p>{STORY_PLACES.nineveh.geography}</p><a href={DISCOVERY_SOURCES.nineveh.url}>{DISCOVERY_SOURCES.nineveh.title}</a><p>The landscape is not a measured view. The river’s shape, skyline and terrain are artistic choices. No date for Jonah’s visit or location for him in these verses is inferred.</p><a href="/explore/?place=nineveh&from=jonah-3-mercy">Locate Nineveh in the atlas ↗</a></section>
        <section><h2>The text</h2><p>World English Bible · Public domain. Exact text from BibleMap’s pinned {chapter3.sourceVersion}. Jonah’s prayer is shown together; 4:4 is repeated in the final beat.</p><p><a href={chapter3.sourceUrl}>Jonah 3 · publisher</a> · <a href={chapter4.sourceUrl}>Jonah 4 · publisher</a></p><a href="https://ebible.org/engwebp/copyright.htm">Translation rights</a><p>The continuation returns to the existing reader at 4:5. The book’s final question remains unanswered.</p></section>
        <section><h2>The composition</h2>{published ? <p>Original SVG landscape composed for BibleMap, October 2026. This illustrative skyline is not an archaeological reconstruction or a documented viewpoint. The separately displayed artifact photographs retain their own image credits and reuse licenses.</p> : <p>Original AI-generated landscape for BibleMap, October 2026, created with OpenAI image generation. Interpretive reconstruction, awaiting human creative and historical review. No third-party image or audio is used in the landscape. The optional discoveries have separate image credits and rights records.</p>}<p>The city forms are invented, without identifiable buildings or people. This is neither an archaeological reconstruction nor Jonah’s viewpoint. The camera adjustment marks a change in attention, not a journey or passing time.</p><p>Nothing advances automatically. Pause motion holds a viewpoint transition; reduced motion uses still views.</p></section>
      </div></details>
      <p className="nineveh-review-label">{published ? "Nineveh · Scripture, history and interpretation" : "Experimental encounter · Creative review"}</p>
    </footer>
    {discovery && <NinevehDiscoveryDialog key={discovery} discovery={discovery} reference={beat.reference} plain={plain} published={published} onClose={closeDiscovery}/>}
    <noscript><section className="nineveh-noscript"><h2>Read the passage</h2><p>The interactive landscape needs JavaScript. The complete passage remains here.</p><p>Scripture · World English Bible · Public domain</p><h3>Jonah 3:10</h3><Verses verses={mercy} chapter={3}/><h3>Jonah 4:1–4</h3><Verses verses={response} chapter={4}/><a href="/jonah/#jonah-4-shade">Continue in the reader · Jonah 4:5–11</a></section></noscript>
  </div>;
}
