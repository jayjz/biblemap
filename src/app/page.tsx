"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
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
export default function Home() {
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
          <h2 id="bm-feature-title">Why do we run from what we know is right?</h2>
          <p className="bm-feature-name">Jonah: The Man Who Ran</p>
          <p>A calling. A ship bound the other way. A storm. Read the story at your own pace, with optional paths into its history and interpretation.</p>
          <Link className="bm-cta" href="/jonah/">Enter the story <span aria-hidden="true">→</span></Link>
          <p className="bm-availability">Available now · Chapter one author-review experience</p>
        </div>
      </section>
      <section className="bm-discover" aria-labelledby="bm-discover-title">
        <div className="bm-section-top"><p className="bm-eyebrow">Other questions</p><h2 id="bm-discover-title">There are more stories to encounter.</h2><p>These journeys are still being developed. Their questions are starting points, not final answers.</p></div>
        <div className="bm-grid">{future.map((story, index) => <article className="bm-future" key={story.name}><span className="bm-index">0{index+1} / {story.theme}</span><h3>{story.question}</h3><p>{story.name}</p><span className="bm-upcoming">Future journey · Not yet available</span></article>)}</div>
      </section>
      <section className="bm-world" aria-labelledby="bm-world-title"><div><p className="bm-eyebrow">Another way to explore</p><h2 id="bm-world-title">Every story unfolds somewhere.</h2><p>Explore places, journeys, and chronology in the biblical atlas.</p></div><Link href="/explore/">Explore the biblical world <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className="bm-footer"><span>BibleMap · A human-authored exploration</span><span>Questions and descriptions are provisional editorial concepts.</span></footer>
  </div>;
}
