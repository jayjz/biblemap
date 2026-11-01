"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { MouseEvent } from "react";
import {
  PRISON_SCENES,
  prisonView,
  type PrisonScene,
} from "@/content/perpetua-encounter";
import { PrisonDiagram } from "./PrisonDiagram";
import styles from "./prison.module.css";

const getHash = () => window.location.hash;
const getServerHash = () => null;

function RelationshipScene({
  scene,
  enhanced,
  navigate,
}: {
  scene: PrisonScene;
  enhanced: boolean;
  navigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [relationshipId, setRelationshipId] = useState(
    scene.relationships[0].id,
  );
  const relationship =
    scene.relationships.find((item) => item.id === relationshipId) ??
    scene.relationships[0];
  const index = PRISON_SCENES.findIndex((item) => item.id === scene.id);
  const previous = PRISON_SCENES[index - 1];
  const next = PRISON_SCENES[index + 1];
  return (
    <>
      <div className={styles.sceneLayout}>
        <div className={styles.sceneCopy}>
          <p className={styles.position}>{scene.voiceLabel}</p>
          <h2
            className={styles.sceneTitle}
            id={`title-${scene.id}`}
            tabIndex={-1}
          >
            {scene.title}
          </h2>
          <div className={styles.narrative}>
            {scene.text.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
        <div className={styles.relationships}>
          <PrisonDiagram scene={scene} selected={relationship.id} />
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
        </div>
        <div className={styles.sceneEvidence}>
          <div className={styles.sourceRegister}>
            <p>{scene.locator}</p>
            <details>
              <summary>Inspect this passage</summary>
              <p>{scene.evidence}</p>
              <p className={styles.limit}>{scene.limit}</p>
              <a href="https://sourcebooks.web.fordham.edu/source/perpetua.asp">
                Read the complete source at Fordham
              </a>
              <p className={styles.summaryNote}>
                Original editorial summary. Historical speech is not being
                performed or quoted here.
              </p>
            </details>
          </div>
          {scene.id === "handover" && (
            <div className={styles.finalQuestion}>
              <p>A question to leave with</p>
              <h3>
                Whose voice survives when someone else finishes the story?
              </h3>
              <a href="#beyond-prison">Follow the story outward</a>
            </div>
          )}
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
                Continue: {next.name}
              </a>
            ) : (
              <a
                className={styles.continue}
                href="#perpetua-child"
                onClick={(event) => navigate(event, "child")}
              >
                Return to the beginning
              </a>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export function PrisonStage() {
  const requestedFocus = useRef(false);
  const subscribeHash = useCallback((update: () => void) => {
    const restoreSceneFocus = () => {
      // History can hide the focused scene, just as a scene link does.
      requestedFocus.current = true;
      update();
    };
    window.addEventListener("hashchange", update);
    // Mark focus before the router handles the same history event.
    window.addEventListener("popstate", restoreSceneFocus, true);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", restoreSceneFocus, true);
    };
  }, []);
  const hash = useSyncExternalStore<string | null>(
    subscribeHash,
    getHash,
    getServerHash,
  );
  const view = prisonView(hash);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!requestedFocus.current) return;
    // Let history finish restoring the document before restoring scene focus.
    const frame = window.requestAnimationFrame(() => {
      stage.current
        ?.querySelector<HTMLElement>(
          view.all ? "#all-scenes-title" : `#title-${view.scene.id}`,
        )
        ?.focus();
      requestedFocus.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view.scene.id, view.all]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
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
        <nav aria-label="Scenes in The Prison">
          {PRISON_SCENES.map((scene, index) => (
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
        <a
          className={styles.readAll}
          href="#perpetua-all"
          onClick={(event) => navigate(event, "all")}
        >
          Read all six scenes
        </a>
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
          Six scenes from the transmitted Passion. The sequence is editorial;
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
      {PRISON_SCENES.map((scene) => (
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
            enhanced={view.enhanced}
            navigate={navigate}
          />
        </section>
      ))}
    </div>
  );
}
