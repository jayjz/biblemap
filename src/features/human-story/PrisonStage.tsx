"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { MouseEvent, ReactNode } from "react";
import { PRISON_SOURCE_FRAGMENTS, visitorPrisonView, type VisitorPrisonScene } from "@/domain/visitor-prison";
import { PerpetuaMovement } from "./PerpetuaMovements";
import { PERPETUA_CONTEXT_SOURCES } from "@/content/perpetua-encounter";
import styles from "./prison.module.css";

const getHash = () => window.location.hash;
const getServerHash = () => null;

function RelationshipScene({
  scene,
  scenes,
  separationArtwork,
  separationPassage,
  endingResearch,
  enhanced,
  navigate,
}: {
  scene: VisitorPrisonScene;
  scenes: readonly VisitorPrisonScene[];
  separationArtwork: ReactNode;
  separationPassage: ReactNode;
  endingResearch: ReactNode;
  enhanced: boolean;
  navigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [relationshipId, setRelationshipId] = useState(
    scene.relationships[0].id,
  );
  const relationship =
    scene.relationships.find((item) => item.id === relationshipId) ??
    scene.relationships[0];
  const index = scenes.findIndex((item) => item.id === scene.id);
  const previous = scenes[index - 1];
  const next = scenes[index + 1];
  const people = <>
    <div hidden={!enhanced} className={styles.relationshipControl}>
      <p id={`relations-${scene.id}`}>Follow a relationship</p>
      <div role="group" aria-labelledby={`relations-${scene.id}`}>
        {scene.relationships.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={relationship.id === item.id}
            aria-controls={`observation-${scene.id}`}
            onClick={() => setRelationshipId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        className={styles.observation}
        id={`observation-${scene.id}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <h3>{relationship.position}</h3>
        <p>{relationship.observation}</p>
      </div>
    </div>
    <div hidden={enhanced} className={styles.fallbackRelations}>
      <p>Explore the people in this passage</p>
      {scene.relationships.map((item) => (
        <details key={item.id}>
          <summary>{item.name}</summary>
          <p>{item.observation}</p>
        </details>
      ))}
    </div>
  </>;
  const supporting = (
        <div className={styles.sceneEvidence}>
        <div className={styles.relationships}>
          {scene.id === "separation" ? (
            <details className={styles.reception}><summary>How a later image holds them together</summary>{separationArtwork}</details>
          ) : null}
          <details className={styles.peopleDetails}><summary>People and the account’s limits</summary>{people}</details>
        </div>
          <div className={styles.sourceRegister}>
            <p>{scene.locator}</p>
            <details>
              <summary>Inspect this passage</summary>
              <p>{scene.evidence}</p>
              <p className={styles.limit}>{scene.limit}</p>
              {scene.contextSourceIds.map(id => <p key={id}><a href={PERPETUA_CONTEXT_SOURCES[id].url}>{PERPETUA_CONTEXT_SOURCES[id].title}</a><br />{PERPETUA_CONTEXT_SOURCES[id].limit}</p>)}
              <a href="https://sourcebooks.web.fordham.edu/source/perpetua.asp">
                Read the complete source at Fordham
              </a>
              <p className={styles.summaryNote}>
                Original editorial summary. The separately marked translated
                passage, where present, is historical source language.
              </p>
            </details>
          </div>
          <nav
            className={styles.sceneNavigation}
            aria-label={`Continue from ${scene.name}`}
          >
            {previous ? (
              <a
                href={`#perpetua-${previous.id}`}
                onClick={(event) => navigate(event, previous.id)}
              >
                Previous: {previous.name}
              </a>
            ) : (
              <span>Begin with the surviving account.</span>
            )}
            {next ? (
              <a
                className={styles.continue}
                href={`#perpetua-${next.id}`}
                onClick={(event) => navigate(event, next.id)}
              >
                Continue: {next.name}<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>
              </a>
            ) : (
              <a
                className={styles.continue}
                href="#perpetua-carthage"
                onClick={(event) => navigate(event, "carthage")}
              >
                Return to the beginning
              </a>
            )}
          </nav>
        </div>
  );
  return (
    <>
      <div className={styles.sceneLayout}>
        <div className={styles.sceneCopy}>
          <p className={styles.movementNumber}>{index + 1} / {scenes.length}<span>{scene.name}</span></p>
          <p className={styles.setting}>{scene.setting}</p>
          <h2
            className={styles.sceneTitle}
            id={`title-${scene.id}`}
            tabIndex={-1}
          >
            {scene.title}
          </h2>
          <p className={styles.position}>{scene.voiceLabel}</p>
          <PerpetuaMovement id={scene.id} endingNotes={scene.id === "handover" ? <>{supporting}{endingResearch}</> : undefined}>
          <div className={styles.narrative}>
            {scene.text.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          </PerpetuaMovement>
        </div>
        {scene.id === "separation" && <div className={styles.separationLeaf} aria-label="The two passages in the transmitted account">{separationPassage}</div>}
        {scene.id !== "handover" && <><p className={styles.sceneBridge}>{scene.transition}</p>{supporting}</>}
      </div>
    </>
  );
}

export function PrisonStage({ scenes, separationArtwork, separationPassage, endingResearch }: { scenes: readonly VisitorPrisonScene[]; separationArtwork: ReactNode; separationPassage: ReactNode; endingResearch: ReactNode }) {
  const requestedFocus = useRef(false);
  const subscribeHash = useCallback((update: () => void) => {
    const restoreSceneFocus = () => {
      // History can hide the focused scene, just as a scene link does.
      requestedFocus.current = window.location.hash === "#perpetua-all" ||
        scenes.some(scene => window.location.hash === `#perpetua-${scene.id}`);
      update();
    };
    window.addEventListener("hashchange", restoreSceneFocus);
    // Mark focus before the router handles the same history event.
    window.addEventListener("popstate", restoreSceneFocus, true);
    return () => {
      window.removeEventListener("hashchange", restoreSceneFocus);
      window.removeEventListener("popstate", restoreSceneFocus, true);
    };
  }, [scenes]);
  const hash = useSyncExternalStore<string | null>(
    subscribeHash,
    getHash,
    getServerHash,
  );
  const view = visitorPrisonView(hash, scenes);
  const stage = useRef<HTMLDivElement>(null);
  const chapterRail = useRef<HTMLElement>(null);
  const enteredFragment = useRef<string | null>(null);
  const lastReading = useRef(scenes[0].id);
  const readingSource = PRISON_SOURCE_FRAGMENTS.some(fragment => fragment === hash);
  useEffect(() => {
    // Continuing below the text should also keep the current chapter in view
    // on narrow screens. Move only the rail, never the reader's page position.
    const rail = chapterRail.current;
    const current = rail?.querySelector<HTMLElement>("[aria-current]");
    if (rail && current) {
      const frame = rail.getBoundingClientRect();
      const item = current.getBoundingClientRect();
      rail.scrollTo({ left: rail.scrollLeft + item.left - frame.left - (frame.width - item.width) / 2, behavior: "instant" });
    }
    const sourceFragment = PRISON_SOURCE_FRAGMENTS.find(fragment => fragment === hash);
    if (sourceFragment) {
      const target = stage.current?.querySelector<HTMLElement>(sourceFragment);
      let ancestor: HTMLElement | null = target ?? null;
      while (ancestor && ancestor !== stage.current) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      target?.querySelector<HTMLElement>("summary")?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      requestedFocus.current = false;
      return;
    }
    lastReading.current = view.all ? "all" : view.scene.id;
    const initialFragment = view.enhanced && hash !== "" && enteredFragment.current !== hash;
    if (!requestedFocus.current && !initialFragment) return;
    // Let history finish restoring the document before restoring scene focus.
    const frame = window.requestAnimationFrame(() => {
      const heading = stage.current?.querySelector<HTMLElement>(
          view.all ? "#all-scenes-title" : `#title-${view.scene.id}`,
        );
      heading?.focus({ preventScroll: true });
      (view.all ? heading : heading?.closest("section"))?.scrollIntoView({ block: "start", behavior: "instant" });
      enteredFragment.current = hash;
      requestedFocus.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash, view.scene.id, view.all, view.enhanced]);

  function navigate(event: MouseEvent<HTMLElement>, id: string) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    const href = `#perpetua-${id}`;
    if (window.location.hash === href) {
      stage.current
        ?.querySelector<HTMLElement>(
          id === "all" ? "#all-scenes-title" : `#title-${id}`,
        )
        ?.focus();
      return;
    }
    requestedFocus.current = true;
    window.history.pushState(null, "", href);
    window.dispatchEvent(new Event("hashchange"));
  }

  return (
    <div ref={stage} data-prison-ready={view.enhanced}>
      <div className={styles.sceneBar}>
        <nav ref={chapterRail} aria-label="Scenes in Perpetua and Felicity">
          {scenes.map((scene, index) => (
            <a
              key={scene.id}
              href={`#perpetua-${scene.id}`}
              onClick={(event) => navigate(event, scene.id)}
              aria-current={
                !view.all && view.scene.id === scene.id ? "step" : undefined
              }
            >
              <span aria-hidden="true">{index + 1}</span>
              {scene.name}
            </a>
          ))}
        </nav>
        {readingSource ? <button className={styles.sourceReturn} type="button" onClick={event => navigate(event, lastReading.current)}>Return to the story</button> : <a
          className={styles.readAll}
          href="#perpetua-all"
          onClick={(event) => navigate(event, "all")}
        >
          Read the whole story
        </a>}
      </div>
      <div
        id="perpetua-all"
        className={styles.allHeading}
        hidden={view.enhanced && !view.all}
      >
        <h2 id="all-scenes-title" tabIndex={-1}>
          The complete encounter
        </h2>
        <p>
          Seven movements through the transmitted Passion. The sequence is editorial;
          source sections are identified throughout.
        </p>
      </div>
      <noscript>
        <p className={styles.noScript}>
          All scenes are available below. Use the scene links to move through
          the account; open the people and passage details to inspect the
          evidence.
        </p>
      </noscript>
      {scenes.map((scene) => (
        <section
          className={styles.scene}
          key={scene.id}
          id={`perpetua-${scene.id}`}
          data-scene={scene.id}
          data-voice={scene.voice}
          aria-labelledby={`title-${scene.id}`}
          hidden={view.enhanced && !view.all && view.scene.id !== scene.id}
        >
          {scene.id === "child" && <span id="prison" aria-hidden="true" />}
          {scene.id === "vision" && <span id="visions" aria-hidden="true" />}
          {scene.id === "felicity" && <span id="felicity" aria-hidden="true" />}
          <RelationshipScene
            scene={scene}
            scenes={scenes}
            separationArtwork={separationArtwork}
            separationPassage={separationPassage}
            endingResearch={endingResearch}
            enhanced={view.enhanced}
            navigate={navigate}
          />
        </section>
      ))}
    </div>
  );
}
