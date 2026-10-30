"use client";

import Link from "next/link";
import { flushSync } from "react-dom";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { approvedAuthoredText, authoredLabel, sceneFromHash, type StoryDocument } from "@/domain/story";
import { mayPublishMedia, type CuratedMediaAsset } from "@/domain/media";
import { MOTION } from "@/scenes/motion";
import { AudioTrack, StoryArtwork } from "./StoryMedia";
import { PassageSource, StoryEvidence } from "./StoryEvidence";

import { SceneDiscovery } from "./SceneDiscovery";
import { ReaderPlace, ReaderArtifact, ReaderInterpretation } from "./ReaderTransition";
import { CityInsideName } from "./CityInsideName";
import { NinevehRecord, NinevehJewishReading } from "./NinevehRecord";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => { window.removeEventListener("hashchange", onChange); window.removeEventListener("popstate", onChange); };
}
const getHash = () => window.location.hash;
const serverHash = () => null;

export function StoryReader({ story, authorReview = false, localReview = false, previewMedia = [], openMedia = [], transitionReview = false, humanReview = false }: { story: StoryDocument; humanReview?: boolean; transitionReview?: boolean; authorReview?: boolean; localReview?: boolean; previewMedia?: readonly { sceneIds: readonly string[]; asset: CuratedMediaAsset }[]; openMedia?: readonly { sceneIds: readonly string[]; asset: CuratedMediaAsset }[] }) {
  const chapterTurn = transitionReview || humanReview;
  const hash = useSyncExternalStore(subscribeHash, getHash, serverHash);
  const active = sceneFromHash(story, hash ?? "");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [cleared, setCleared] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const lastScene = useRef<string | null>(null);
  const sceneTransition = useRef<ViewTransition | null>(null);
  const focusScene = (id: string) => {
    const heading = document.getElementById(`${id}-heading`);
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start", behavior: "instant" });
  };
  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    sceneTransition.current?.skipTransition();
    const move = () => {
      // The browser snapshot must see the new scene and its final scroll position.
      flushSync(() => {
        if (window.location.hash !== `#${id}`) {
          window.history.pushState(null, "", `#${id}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      });
      focusScene(id);
    };
    const pair = ["jonah-3-mercy", "jonah-4-anger"];
    if (chapterTurn && active.id !== id && pair.includes(active.id) && pair.includes(id)
      && document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sceneTransition.current = document.startViewTransition(move);
      return;
    }
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    requestAnimationFrame(() => focusScene(id));
  };
  const clear = useCallback(() => {
    // Clear DOM immediately as well as React state before a document can enter bfcache.
    root.current?.querySelectorAll("textarea").forEach(input => { input.value = ""; });
    setReflections({}); setCleared(true);
  }, []);
  useEffect(() => {
    const restore = (event: PageTransitionEvent) => { if (event.persisted) clear(); };
    window.addEventListener("pagehide", clear);
    window.addEventListener("pageshow", restore);
    return () => { window.removeEventListener("pagehide", clear); window.removeEventListener("pageshow", restore); };
  }, [clear]);
  useEffect(() => {
    if (hash === null) return;
    if (lastScene.current !== active.id) {
      const shouldFocus = lastScene.current !== null || hash;
      lastScene.current = active.id;
      if (shouldFocus) {
        const frame = requestAnimationFrame(() => focusScene(active.id));
        return () => cancelAnimationFrame(frame);
      }
    }
  }, [hash, active.id]);

  return <div className={`story-root${chapterTurn ? " story-root--transition-review" : ""}${humanReview ? " story-root--human" : ""}`} ref={root} data-reader-ready={hash !== null} data-active-scene={active.id}
    style={{ ["--story-fade-ms" as string]: `${MOTION.captionDelayMs}ms`, ["--story-ease" as string]: MOTION.easeEnter }}>
    <a className="story-skip" href={`#${active.id}-heading`} onClick={event => {
      if (hash === null) return;
      event.preventDefault();
      const heading = document.getElementById(`${active.id}-heading`);
      heading?.focus(); heading?.scrollIntoView({ block: "start", behavior: "instant" });
    }}>Skip to scripture</a>
    <header className="story-topbar">
      <Link className="story-brand" href="/" prefetch={false} onClick={clear}>BibleMap<span aria-hidden="true"> / </span><span>Stories</span></Link>
      {authorReview && <span className="story-review">Local creator review</span>}
      <Link href="/explore/" prefetch={false} onClick={clear} className="story-exit">Exit to map <span aria-hidden="true">↗</span></Link>
    </header>
    <main id="story-main">
      <div className="story-intro">
        <p className="story-eyebrow">{humanReview ? "The book of Jonah" : <>The book of Jonah <span aria-hidden="true">/</span> A journey in six movements</>}</p>
        <h1>{story.title}{!humanReview && <span>{story.subtitle}</span>}</h1>
        {humanReview ? <p className="story-invitation">Four chapters. Thirteen scenes.<br />Read at your own pace.</p> : <>
        <p className="story-invitation">A conversation. A responsibility. A truth about ourselves.</p>
        <p className="story-invitation story-recognition">Sometimes, leaving feels easier.</p>
        </>}
        <div className="story-intro-meta"><span>All four chapters</span><span>World English Bible</span><span>At your own pace · In silence</span></div>
        <a className="story-begin" href={`#${active.id}`} onClick={e => navigate(e, active.id)}>Begin reading <span aria-hidden="true">↓</span></a>
      </div>
      <nav className="story-contents" aria-label="Jonah sections">
        <ol>{story.sections.map((section, i) => {
          const firstScene = story.scenes.find(s => s.sectionId === section.id);
          return <li key={section.id}>{firstScene ? <a href={`#${firstScene.id}`} onClick={e => navigate(e, firstScene.id)} aria-current={active.sectionId === section.id ? "step" : undefined}>
            <span className="story-section-number">0{i + 1}</span><span>{section.label}<small>{section.reference}</small></span>
          </a> : <span className="story-future"><span className="story-section-number">0{i + 1}</span><span>{section.label}<small>{section.reference}</small></span></span>}</li>;
        })}</ol>
      </nav>
      {authorReview && <p className="story-preview-note">A working study for the author. Narrative, questions, artwork, and interpretation await review.</p>}
      {story.scenes.map((scene, index) => {
        const section = story.sections.find(s => s.id === scene.sectionId);
        const label = (authorReview && scene.title.status === "written" ? scene.title.text : approvedAuthoredText(scene.title)) ?? scene.readingGuide?.title ?? section?.label ?? "Scene";
        const narrative = authorReview ? authoredLabel(scene.narrative) : approvedAuthoredText(scene.narrative);
        const passage = story.passages.find(p => p.id === scene.passageIds[0]);
        const narration = story.media.find(m => m.id === scene.narration?.mediaId);
        const ambience = story.media.find(m => m.id === scene.soundscapeId);
        const fromStory = story.media.find(m => m.id === scene.artworkIds[0]);
        const open = openMedia.find(entry => entry.sceneIds.includes(scene.id))?.asset;
        const supplemental = open && mayPublishMedia(open) ? open : undefined;
        const preview = (authorReview || localReview) ? previewMedia.find(entry => entry.sceneIds.includes(scene.id))?.asset : undefined;
        const artwork = fromStory ?? supplemental ?? preview;
        const transition = chapterTurn && (scene.id === "jonah-3-mercy" || scene.id === "jonah-4-anger");
        const displayLabel = transition ? (scene.id === "jonah-3-mercy" ? "Nineveh" : "Jonah’s response") : label;
        const turnVerse = transition && scene.id === "jonah-3-mercy" ? passage?.verses.find(verse => verse.number === 10) : undefined;
        const isActive = hash !== null && active.id === scene.id;
        return <article id={scene.id} key={scene.id} hidden={hash !== null && !isActive} className={`story-scene${transition ? " reader-transition" : ""}${index < 3 ? " story-opening-scene" : ""}${scene.id === "jonah-4-question" ? " story-final-question" : ""}`} data-scene={scene.id} data-chapter={scene.chapter} data-section={scene.sectionId} data-transition={scene.transition.visual}>
          <div className="story-scene-header">
            <div><p className="story-eyebrow">Chapter {String(scene.chapter).padStart(2, "0")} <span aria-hidden="true">/</span> {String(index + 1).padStart(2, "0")} of {String(story.scenes.length).padStart(2, "0")}</p>
              <h2 id={`${scene.id}-heading`} tabIndex={-1}>{displayLabel}</h2>
              <p className="story-reference">Jonah {scene.chapter}:{passage?.firstVerse}{passage && passage.lastVerse !== passage.firstVerse ? `–${passage.lastVerse}` : ""}</p>
            </div>
            {transition ? <ReaderPlace sceneId={scene.id} /> : <span className="story-scene-mark" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
          </div>
          <div className="story-columns">
            <div className="story-reading">
              {scene.passageIds.map(id => {
                const p = story.passages.find(p => p.id === id);
                if (!p) return null;
                return <section key={p.id} aria-label={`Scripture: Jonah ${p.chapter}:${p.firstVerse}–${p.lastVerse}`}>
                  <p className="story-eyebrow">Scripture <span aria-hidden="true">/</span> World English Bible</p>
                  <div className="story-verses">{p.verses.filter(verse => verse !== turnVerse).map(v => <p key={v.number} tabIndex={scene.id === "jonah-3-mercy" ? -1 : undefined} data-verse={v.number} data-reference={`${p.chapter}:${v.number}`}><sup aria-label={`Verse ${v.number}`}>{v.number}</sup>{v.text}</p>)}</div>
                </section>;
              })}
              {scene.id === "jonah-3-mercy" && !turnVerse && <a className="story-turn-link" href="#jonah-4-anger" onClick={e => navigate(e, "jonah-4-anger")}>Read Jonah’s response <span aria-hidden="true">→</span></a>}
              {scene.id === "jonah-1-escape" && <div className="story-curiosity"><p>{scene.readingGuide?.question}</p></div>}
            </div>
            {turnVerse && <section className="story-reading reader-turn" aria-label="Scripture: Jonah 3:10">
              <p className="reader-turn-reference">Jonah 3:10</p>
              <div className="story-verses"><p tabIndex={-1} data-verse={turnVerse.number} data-reference="3:10"><sup aria-label={`Verse ${turnVerse.number}`}>{turnVerse.number}</sup>{turnVerse.text}</p></div>
              <a className="story-turn-link" href="#jonah-4-anger" onClick={e => navigate(e, "jonah-4-anger")}>Read Jonah’s response <span aria-hidden="true">→</span></a>
              {humanReview && <NinevehJewishReading />}
            </section>}
            <aside className={`story-visual${scene.id === "jonah-4-question" && !artwork ? " story-visual--absent" : ""}`} aria-label={transition && scene.id === "jonah-4-anger" ? "Optional theological interpretation" : scene.id === "jonah-3-mercy" ? "Optional Nineveh place encounter" : authorReview ? "Scene artwork and author workspace" : "Scene artwork"}>
              {transition ? (scene.id === "jonah-3-mercy" ? (humanReview ? <NinevehRecord /> : <ReaderArtifact />) : <ReaderInterpretation />) : scene.id === "jonah-3-mercy" ? <CityInsideName /> : scene.id === "jonah-4-anger" && !artwork ? <div className="mercy-lettering" aria-hidden="true"><span>The prophet</span><em>angry.</em><small>Jonah 4</small></div> : <StoryArtwork key={artwork?.id ?? scene.id} sceneId={scene.id} asset={artwork} reviewOnly={!fromStory && !supplemental && Boolean(preview)} />}
              {scene.readingGuide && index >= 3 && scene.id !== "jonah-3-mercy" && scene.id !== "jonah-4-anger" && scene.id !== "jonah-4-question" && scene.id !== "jonah-4-shade" && <div className="story-question"><p className="story-eyebrow">A question to carry</p><p>{scene.readingGuide.question}</p>{authorReview && <small>Provisional editorial prompt</small>}</div>}
              {narrative && <div className="story-author-space"><p className="story-eyebrow">Author’s voice</p>
                {authorReview && scene.title.status === "placeholder" && <p className="story-placeholder">[AUTHOR: scene title · provisional section label shown]</p>}
                <p>{narrative}</p>
              </div>}
              {isActive && narration && scene.narration?.transcript.status === "written" && <AudioTrack key={`${scene.id}-narration`} asset={narration} label="Narration" transcript={scene.narration.transcript.text} />}
              {isActive && ambience && <AudioTrack key={`${scene.id}-ambience`} asset={ambience} label="Ambience" />}

            </aside>
          </div>
          {!transition && <SceneDiscovery sceneId={scene.id} />}
          <details className="story-explore-further story-disclosure">
            <summary>Explore further <span>Sources, reading notes & private reflection</span></summary>
            <div className="story-further-content">
              {scene.passageIds.map(id => { const p = story.passages.find(p => p.id === id); return p ? <PassageSource key={id} passage={p} story={story} /> : null; })}
              {scene.readingGuide && <details className="story-disclosure story-companion"><summary>Pause with the passage <span>Optional · reading companion</span></summary><div className="story-disclosure-body"><p>{scene.readingGuide.context}</p><p><small>Reading companion · Commentary on the passage</small></p><a href={story.sources.find(source => source.id === scene.readingGuide?.sourceId)?.url} target="_blank" rel="noreferrer">Read the source: {scene.readingGuide.locator} ↗</a></div></details>}
              <StoryEvidence story={story} scene={scene} authorReview={authorReview} />

              <details className="story-disclosure story-reflection">
                <summary>Private reflection <span>Optional</span></summary>
                <div className="story-disclosure-body">
                  <p id={`${scene.id}-privacy`}>Writing stays in memory for this visit. It is not sent or saved by BibleMap and is cleared when you leave or reload.</p>
                  {scene.reflections.map(reflection => <div key={reflection.id}>
                    {(authorReview || approvedAuthoredText(reflection.prompt)) && <p>{authorReview ? authoredLabel(reflection.prompt) : approvedAuthoredText(reflection.prompt)}</p>}
                    <label htmlFor={reflection.id}>Your private notes</label>
                    <textarea id={reflection.id} aria-describedby={`${scene.id}-privacy`} rows={5} autoComplete="off" spellCheck={false} disabled={hash === null}
                      value={reflections[reflection.id] ?? ""} onChange={e => { setReflections(previous => ({ ...previous, [reflection.id]: e.target.value })); setCleared(false); }} />
                  </div>)}
                  <noscript><p>Enable JavaScript to use temporary notes. Scripture and navigation remain available.</p></noscript>
                  <button type="button" onClick={clear}>Clear all reflections</button>
                  <p role="status">{cleared ? "All reflections cleared." : ""}</p>
                </div>
              </details>
            </div>
          </details>
          {index === story.scenes.length - 1 && <section className="story-ending"><p className="story-eyebrow">The book ends here</p><h3>A question, left open.</h3><p>Take your time.</p><div className="story-ending-links"><Link href="/" prefetch={false} onClick={clear}>Return to the stories ↗</Link><Link href="/explore/" prefetch={false} onClick={clear}>Open the atlas ↗</Link></div></section>}
          <nav className="story-scene-nav" aria-label={`${displayLabel} scene navigation`}>
            {index > 0 ? <a href={`#${story.scenes[index - 1].id}`} onClick={e => navigate(e, story.scenes[index - 1].id)}>← Previous</a> : <span>Begin here</span>}
            <span>{index + 1} / {story.scenes.length}</span>
            {scene.transition.nextSceneId ? <a className="story-next" href={`#${scene.transition.nextSceneId}`} onClick={e => navigate(e, scene.transition.nextSceneId!)}>Continue <span aria-hidden="true">→</span></a> : <a className="story-next" href={`#${story.scenes[0].id}`} onClick={e => navigate(e, story.scenes[0].id)}>Read again <span aria-hidden="true">↗</span></a>}
          </nav>
        </article>;
      })}
    </main>
    <footer className="story-footer"><span>BibleMap <span aria-hidden="true">·</span> Scripture, place, reflection</span><Link href="/explore/" prefetch={false} onClick={clear}>Explore the map ↗</Link></footer>
  </div>;
}
