"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import "./home.css";

const Atlas = dynamic(() => import("./explore/page"), { ssr: false });
const subscribe = (cb: () => void) => { window.addEventListener("hashchange", cb); window.addEventListener("popstate", cb); return () => { window.removeEventListener("hashchange", cb); window.removeEventListener("popstate", cb); }; };
const getLegacy = () => Boolean(window.location.hash || window.location.search);
const getServer = () => false;
const future = [
  { name: "Job", question: "What happens when we lose everything?", theme: "Loss & suffering" },
  { name: "Jacob", question: "Can we become someone different?", theme: "Identity & change" },
  { name: "Exodus", question: "What does freedom demand of us?", theme: "Freedom & responsibility" },
  { name: "Joseph", question: "What does it mean to forgive?", theme: "Betrayal & forgiveness" },
];
// Provisional editorial prompts and invitations: creator review required.
const questions = [
  { id: "responsibility", question: "What do we do when we’d rather turn away?", invitation: "Jonah’s story begins with a call and a journey in another direction. Follow what unfolds from there." },
  { id: "consequences", question: "What happens when our choices reach beyond us?", invitation: "A journey across the sea brings strangers into the same story. Begin with Jonah and meet them along the way." },
  { id: "mercy", question: "Why can mercy be hard to offer?", invitation: "Carry that question with you. Begin with the words Jonah hears, and let the story unfold." },
];
const defaultInvitation = "A call. A departure. A story still asking questions. Begin with Jonah, and follow the whole journey.";

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const invitation = questions.find(question => question.id === selected)?.invitation ?? defaultInvitation;
  const legacyAtlas = useSyncExternalStore(subscribe, getLegacy, getServer);
  if (legacyAtlas) return <Atlas />;
  return <div className="bm-home">
    <a href="#main-content" className="bm-skip">Skip to stories</a>
    <header className="bm-header"><Link href="/" className="bm-mark">BibleMap</Link><Link className="bm-atlas-link" href="/explore/">Explore the biblical world <span aria-hidden="true">↗</span></Link></header>
    <main id="main-content">
      <section className="bm-opening" aria-labelledby="bm-title">
        <p className="bm-kicker">Ancient stories. Human questions.</p>
        <h1 id="bm-title">The human condition.<br /><em>Questions that stay with us.</em></h1>
        <p className="bm-lede">Stories written long ago still ask difficult questions about the way we live. Begin with one. Follow where it leads.</p>
      </section>
      <section className="bm-feature" aria-labelledby="bm-feature-title">
        <div className="bm-sea" aria-hidden="true"><span className="bm-moon"/><span className="bm-swell bm-swell-one"/><span className="bm-swell bm-swell-two"/><span className="bm-swell bm-swell-three"/></div>
        <div className="bm-feature-copy">
          <p className="bm-eyebrow">First journey <span aria-hidden="true">/</span> The book of Jonah</p>
          <h2 id="bm-feature-title">Jonah: The Man Who Ran</h2>
          <fieldset className="bm-questions" aria-describedby="bm-question-hint">
            <legend>Which question stays with you?</legend>
            <p id="bm-question-hint">Choose one, or simply enter the story.</p>
            {questions.map(question => <label className="bm-question" key={question.id}>
              <input type="radio" name="jonah-question" value={question.id} checked={selected === question.id} onChange={() => setSelected(question.id)} />
              <span>{question.question}</span>
            </label>)}
          </fieldset>
          <p className="bm-invitation" aria-live="polite" aria-atomic="true">{invitation}</p>
          {/* A document link lets the reader own fragment focus without router focus races. */}
          <a className="bm-cta" href="/jonah/#jonah-1-calling">Enter the story <span aria-hidden="true">→</span></a>
          <p className="bm-availability">Begins at Jonah 1:1 · All four chapters · Read at your own pace</p>
        </div>
      </section>
      <section className="bm-discover" aria-labelledby="bm-discover-title">
        <div className="bm-section-top"><p className="bm-eyebrow">Other questions</p><h2 id="bm-discover-title">There are more stories to encounter.</h2><p>These journeys are still being developed. Their questions are starting points, not final answers.</p></div>
        <div className="bm-grid">{future.map((story, index) => <article className="bm-future" key={story.name}><span className="bm-index">0{index+1} / {story.theme}</span><h3>{story.question}</h3><p>{story.name}</p><span className="bm-upcoming">Future journey · Not yet available</span></article>)}</div>
      </section>
      <section className="bm-world" aria-labelledby="bm-world-title"><div><p className="bm-eyebrow">Another way to explore</p><h2 id="bm-world-title">Every story unfolds somewhere.</h2><p>Explore places, journeys, and chronology in the biblical atlas.</p></div><Link href="/explore/">Explore the biblical world <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className="bm-footer"><span>BibleMap · Ancient stories. Human questions.</span></footer>
  </div>;
}
