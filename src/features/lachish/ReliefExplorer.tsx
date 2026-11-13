"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FEATURES, readEvidenceState, type EvidenceView, type FeatureId } from "@/content/lachish/narrative";
import { LachishMedia } from "./LachishMedia";
import { SiegeLandscape } from "./SiegeLandscape";

const VIEWS = [{ id: "artifact", label: "The relief" }, { id: "landscape", label: "Spatial interpretation" }, { id: "site", label: "The surviving site" }] as const;
const subscribeLocation = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  window.addEventListener("lachish-evidence", notify);
  return () => { window.removeEventListener("popstate", notify); window.removeEventListener("lachish-evidence", notify); };
};
const locationSnapshot = () => window.location.search;
const serverSnapshot = () => "";
const subscribeHydration = () => () => {};

export function ReliefExplorer() {
  const search = useSyncExternalStore(subscribeLocation, locationSnapshot, serverSnapshot);
  const state = readEvidenceState(search);
  const enhanced = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [zoomed, setZoomed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const restore = () => setZoomed(false);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function select(feature: FeatureId, view: EvidenceView) {
    setZoomed(false);
    const url = new URL(window.location.href);
    url.searchParams.set("detail", feature); url.searchParams.set("evidence", view); url.hash = "the-walls";
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event("lachish-evidence"));
    // On narrow screens the inspector is below the image. Bring the changed
    // evidence into view instead of leaving its replacement above the visitor.
    if (view !== state.view) stage.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }
  const feature = FEATURES.find(item => item.id === state.feature) ?? FEATURES[0];
  return <div className="relief-explorer" data-evidence-view={state.view} data-enhanced={enhanced}>
    <div className="relief-toolbar" aria-label="Choose an evidence view">
      <div className="relief-views">{VIEWS.map(view => <button key={view.id} type="button" aria-pressed={state.view === view.id} onClick={() => select(state.feature, view.id)} disabled={!enhanced}>{view.label}</button>)}</div>
      <span className="relief-object-id">{state.view === "artifact" ? "BM 124906 · Panel 7" : state.view === "site" ? "TEL LACHISH · MODERN PHOTOGRAPH" : "ORIGINAL SCHEMATIC · NOT MEASURED"}</span>
    </div>
    <div className="relief-workspace">
      <div className="relief-stage" ref={stage}>
        <div className="relief-artifact-view" hidden={state.view !== "artifact"}>
          <div className={`relief-photo ${zoomed ? "is-zoomed" : ""}`} style={{ transformOrigin: `${feature.x}% ${feature.y}%` }}>
            <LachishMedia name="siege" width={4679} height={4000} alt="The actual gypsum relief: defenders above, covered engines and soldiers ascending diagonal ramps below. The panel has broken upper edges." />
            {FEATURES.map(item => <button key={item.id} type="button" className="relief-hotspot" style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`Examine ${item.label.toLowerCase()} in the relief`} aria-pressed={state.feature === item.id} tabIndex={zoomed && state.feature !== item.id ? -1 : 0} onClick={() => select(item.id, "artifact")} disabled={!enhanced}>{item.number}</button>)}
          </div>
          <button className="relief-zoom" type="button" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)} disabled={!enhanced}>{zoomed ? "Show whole panel −" : "Enlarge selected detail +"}</button>
        </div>
        <div hidden={state.view !== "landscape"}><SiegeLandscape feature={state.feature} /></div>
        <figure className="relief-site" hidden={state.view !== "site"}>
          <LachishMedia name="ramp" width={6000} height={4000} alt="A modern photograph of the excavated stone siege ramp against the slope at Tel Lachish, with exposed masonry above." />
          <figcaption>The excavated ramp today. Modern exposure and conservation differ from the ancient surface. <a href="#asset-ramp">DaringDonna · CC BY-SA 4.0</a></figcaption>
        </figure>
      </div>
      <div className="relief-inspector">
        <p className="lachish-small">FOLLOW A DETAIL</p>
        <div className="relief-features" aria-label="Select a detail">{FEATURES.map(item => <button key={item.id} type="button" aria-pressed={state.feature === item.id} onClick={() => select(item.id, state.view)} disabled={!enhanced}><span>{item.number}</span>{item.label}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="relief-observation" aria-live="polite" aria-atomic="true">
          <p className="lachish-small">{state.view === "artifact" ? "WHAT THE CARVING SHOWS" : state.view === "site" ? "WHAT SURVIVES IN THE GROUND" : "WHAT THE DIAGRAM INTERPRETS"}</p>
          <h3>{feature.label}</h3>
          <p>{state.view === "artifact" ? feature.artifact : state.view === "landscape" ? feature.landscape : "The ramp is a material remnant of siege works. A modern photograph cannot by itself restore its original height, the engines above it, or every stage of its construction."}</p>
        </div>
        <button className="lachish-action relief-next-view" type="button" disabled={!enhanced} onClick={() => select(state.feature, state.view === "artifact" ? "landscape" : state.view === "landscape" ? "site" : "artifact")}>{state.view === "artifact" ? "Open the spatial interpretation" : state.view === "landscape" ? "Compare the surviving ramp" : "Return to the original relief"}<span aria-hidden="true">→</span></button>
        <details className="lachish-disclosure"><summary>Evidence & reconstruction limits</summary><p>The relief is an ancient royal account. The diagram is an original interpretive aid. It uses no measured coordinates or archaeological mesh; wall height, engine mechanics, shape and spacing are hypothetical.</p><ul>{feature.sources.map(id => <li key={id}><a href={`#source-${id}`}>Inspect {id === "bm-siege" ? "the museum object" : id === "wall-study" ? "the excavation and wall study" : "the ramp construction study"}</a></li>)}</ul></details>
      </div>
    </div>
    <p className="relief-credit">Ancient artifact · gypsum · Nineveh, Room XXXVI · carved 700–692 BC. Photograph: Zunkir / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>; resized to WebP. <a href="#asset-siege">Full provenance</a>.</p>
    <noscript><div className="relief-static"><p>Compare the complete relief above with this original schematic. The interactive views require JavaScript; the narrative and all sources remain available.</p><SiegeLandscape feature="ramp" /><LachishMedia name="ramp" width={6000} height={4000} alt="Modern photograph of the excavated stone siege ramp at Tel Lachish." /><p><a href="#asset-ramp">Ramp photograph: DaringDonna, CC BY-SA 4.0.</a></p>{FEATURES.map(item => <p key={item.id}><strong>{item.label}.</strong> {item.artifact} {item.landscape}</p>)}</div></noscript>
  </div>;
}
