"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import chapter3 from "@/content/scripture/web-jonah-3.json";
import chapter4 from "@/content/scripture/web-jonah-4.json";
import { NINEVEH_BEATS, parseNinevehHash } from "@/domain/nineveh-navigation";
import { FourBeatWorld } from "./FourBeatWorld";
import { FourBeatDiscoveries, type Navigate } from "./FourBeatDiscoveries";

const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback); window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
};
const snapshot = () => location.search + "|" + location.hash;
const serverSnapshot = () => null;
const mercy = chapter3.verses.filter(verse => verse.number === 10);
const anger = chapter4.verses.filter(verse => verse.number <= 4);
const question = chapter4.verses.filter(verse => verse.number === 4);
function Passage({ verses, chapter }: { verses: typeof mercy; chapter: number }) {
  return <div className="fb-verses">{verses.map(verse => <p key={verse.number}><sup aria-label={`Verse ${verse.number}`}>{verse.number}</sup><span data-reference={`${chapter}:${verse.number}`}>{verse.text}</span></p>)}</div>;
}
export function FourBeatExperience() {
  const url = useSyncExternalStore(subscribe,snapshot,serverSnapshot);
  const [search, hash] = url?.split("|") ?? ["", ""];
  const { beat, discovery } = parseNinevehHash(hash?.slice(1));
  const endingOpen = hash === "#question/ending";
  const choice = new URLSearchParams(search).get("treatment");
  const treatment = choice === "b" || choice === "c" ? choice : "a";
  const [still, setStill] = useState(false);
  const [plain, setPlain] = useState(false);
  const main = useRef<HTMLElement>(null);
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (url === null) return;
    // Restore reading after the disclosure has actually collapsed. Scrolling in
    // the click handler alone happens before React commits the shorter document.
    if (!discovery && !endingOpen) {
      if (previous.current !== null || hash) main.current?.querySelector<HTMLElement>(`#${beat.id}-heading`)?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    previous.current = beat.id;
  },[url,beat.id,discovery,endingOpen,hash]);
  const navigate: Navigate = (event, next) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); history.pushState(null,"",`#${next}`); window.dispatchEvent(new PopStateEvent("popstate"));
    if (!next.includes("/")) {
      main.current?.querySelector<HTMLElement>(`#${next}-heading`)?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };
  return <div className="four-beat" data-ready={url !== null} data-beat={beat.id} data-treatment={treatment} data-still={still} data-plain={plain}>
    <a className="fb-skip" href="#fb-reading">Skip to Scripture</a>
    <header className="fb-header"><Link className="fb-brand" href="/" prefetch={false}>BibleMap</Link><span>Jonah · Four encounters</span><a href="/jonah/#jonah-1-calling">Begin Jonah at 1:1</a></header>
    <FourBeatWorld treatment={treatment} />
    <main ref={main} id="fb-reading" tabIndex={-1}>
      {NINEVEH_BEATS.map((item,index) => <section className="fb-scene" id={item.id} key={item.id} data-active={item.id === beat.id} aria-labelledby={`${item.id}-heading`}>
        <div className="fb-reading">
          <p className="fb-position">{String(index+1).padStart(2,"0")} / 04 <span>{item.label}</span></p>
          <h1 id={`${item.id}-heading`} tabIndex={-1}>{item.id === "city" ? "Nineveh" : item.id === "mercy" ? "Jonah 3:10" : item.id === "anger" ? "Jonah 4:1–4" : "Jonah 4:4"}</h1>
          {item.id === "city" ? <div className="fb-opening"><p className="fb-place">Beside the Tigris.</p><p className="fb-premise">The city remains.</p><p className="fb-entry">An encounter with Jonah 3:10–4:4.<br />The story begins earlier. <a href="/jonah/#jonah-1-calling">Read from Jonah 1:1.</a></p><a className="fb-begin" href="#mercy" onClick={event => navigate(event,"mercy")}>Enter the passage <span aria-hidden="true">→</span></a></div> : <>
            <p className="fb-translation">Scripture · World English Bible</p>
            <Passage verses={item.id === "mercy" ? mercy : item.id === "anger" ? anger : question} chapter={item.id === "mercy" ? 3 : 4} />
            {item.id === "mercy" && <details className="fb-recall"><summary>Read the city’s response · Jonah 3:5–9</summary><p className="fb-translation">Scripture · World English Bible</p><Passage verses={chapter3.verses.filter(verse => verse.number >= 5 && verse.number <= 9)} chapter={3} /></details>}
            {item.id === "question" && <details className="fb-ending" id="question/ending" open={endingOpen}><summary onClick={event => navigate(event,endingOpen ? "question" : "question/ending")}>Follow the question to the book’s ending · 4:5–11</summary><p className="fb-translation">Jonah 4:5–10 · World English Bible</p><Passage verses={chapter4.verses.filter(verse => verse.number >= 5 && verse.number <= 10)} chapter={4} /><h2>The final question · Jonah 4:11</h2><Passage verses={chapter4.verses.filter(verse => verse.number === 11)} chapter={4} /><p className="fb-unanswered">A question, left open.</p><a href="/jonah/#jonah-4-shade">Read 4:5–11 in the complete reader</a></details>}
            <FourBeatDiscoveries beat={item.id} discovery={item.id === beat.id ? discovery : null} navigate={navigate} />
          </>}
        </div>
        <nav className="fb-step" aria-label={`${item.label} passage navigation`}>
          {index > 0 ? <a href={`#${NINEVEH_BEATS[index-1].id}`} onClick={event => navigate(event,NINEVEH_BEATS[index-1].id)}>Previous encounter</a> : <span>At your pace. In silence.</span>}
          {index < 3 ? <a href={`#${NINEVEH_BEATS[index+1].id}`} onClick={event => navigate(event,NINEVEH_BEATS[index+1].id)}>{index === 0 ? "Begin with 3:10" : index === 1 ? "Read Jonah’s response" : "Stay with the question"} <span aria-hidden="true">→</span></a> : <a href="/jonah/#jonah-4-shade">Continue · Jonah 4:5–11 <span aria-hidden="true">→</span></a>}
        </nav>
      </section>)}
    </main>
    <nav className="fb-beats" aria-label="Four encounters">{NINEVEH_BEATS.map((item,index) => <a href={`#${item.id}`} onClick={event => navigate(event,item.id)} key={item.id} aria-current={beat.id === item.id ? "step" : undefined}><span>0{index+1}</span>{item.label}</a>)}</nav>
    <footer className="fb-footer">
      <div className="fb-controls"><span>Design study · Review only</span><button type="button" aria-pressed={still} onClick={() => setStill(!still)}>{still ? "Enable transitions" : "Still view"}</button><button type="button" aria-pressed={plain} onClick={() => setPlain(!plain)}>{plain ? "Show the world" : "Text view"}</button></div>
      <details><summary>Place, sources and visual studies</summary><div className="fb-provenance"><section><h2>The place and the view</h2><p>Nineveh flanks the eastern Tigris flood plain, opposite modern Mosul. The great seventh-century capital postdates the traditional eighth-century setting of Jonah. Archaeology does not verify Jonah’s arrival.</p><a href="https://pleiades.stoa.org/places/874621">Pleiades · Nineveh/Ninos</a><a href="https://oracc.museum.upenn.edu/asbp/areasofnineveh/index.html">Jonathan Taylor · Areas of Nineveh (2022)</a><p>The painted landscape is AI-generated with OpenAI image generation for this review. Architecture, river course, terrain and light are imagined. Changes of composition do not represent historical weather, elapsed time or Jonah’s viewpoint. No audio is used.</p></section><section><h2>The Scripture</h2><p>Exact text from BibleMap’s pinned {chapter3.sourceVersion}. World English Bible, public domain. The final beat retains 4:4; the optional continuation contains all of 4:5–11.</p><a href={chapter3.sourceUrl}>Jonah 3 · Publisher</a><a href={chapter4.sourceUrl}>Jonah 4 · Publisher</a><a href="https://ebible.org/engwebp/copyright.htm">Translation rights</a><a href="/explore/?place=nineveh&from=jonah-3-mercy">Locate Nineveh in the atlas</a></section><section><h2>Three alternatives</h2><a href={`?treatment=a#${beat.id}`}>A · Cinematic landscape</a><a href={`?treatment=b#${beat.id}`}>B · Illuminated narrative</a><a href={`?treatment=c#${beat.id}`}>C · Geographical exhibition</a><p>These are review studies. The theological readings and artistic juxtapositions await human review. No production acceptance is implied.</p></section></div></details>
    </footer>
  </div>;
}
