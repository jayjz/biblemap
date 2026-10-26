"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { depthSources, depthVoices } from "@/content/nineveh-depth";
import type { NinevehDiscovery } from "@/domain/nineveh-navigation";
import { mayReviewDepthImage } from "@/domain/nineveh-depth-media";
import chapter3 from "@/content/scripture/web-jonah-3.json";
import chapter4 from "@/content/scripture/web-jonah-4.json";
import media from "./depth-media.json";

const discoveries = [
  { id: "world", title: "The world of Nineveh", hint: "Clay, writing, a royal collection" },
  { id: "art", title: "Jonah through art", hint: "A body beneath the leaves" },
  { id: "voices", title: "The question across centuries", hint: "Augustine · Francis" },
] as const;

export function DiscoveryEntrances({ beat, navigate }: { beat: string; navigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void }) {
  return <aside className="nineveh-discoveries" aria-label="Discover alongside the passage">
    <p className="nineveh-eyebrow">Look closer</p>
    {discoveries.map(item => <a key={item.id} id={`discover-${item.id}`} href={`#${beat}/${item.id}`} onClick={event => navigate(event, `${beat}/${item.id}`)} aria-haspopup="dialog">
      <span>{item.title}<small>{item.hint}</small></span><span aria-hidden="true">↗</span>
    </a>)}
  </aside>;
}

function Source({ id }: { id: keyof typeof depthSources }) {
  const source = depthSources[id];
  return <a href={source.url} target="_blank" rel="noreferrer">{source.title} <span className="nineveh-new-tab">(new tab)</span></a>;
}

function EvidenceImage({ id, plain }: { id: string; plain: boolean }) {
  const asset = media.assets.find(item => item.id === id);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  if (!asset) return <p role="status">No object image is available.</p>;
  const available = !plain && !failed && mayReviewDepthImage(asset);
  return <figure className="nineveh-object">
    {available ? <>
      {!loaded && <p role="status">Loading the object image…</p>}
      <div className="nineveh-object-window" data-enlarged={enlarged} tabIndex={enlarged ? 0 : undefined} role={enlarged ? "region" : undefined} aria-label={enlarged ? "Enlarged object; scroll to examine" : undefined}>
        <Image src={asset.reviewUrl} width={asset.width} height={asset.height} alt={asset.altText} unoptimized onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      </div>
      {loaded && <button type="button" aria-pressed={enlarged} onClick={() => setEnlarged(!enlarged)}>{enlarged ? "Show whole object" : "Examine larger"}</button>}
    </> : <div className="nineveh-image-fallback"><p>{plain ? "Text view" : "Object image unavailable"}</p><p>{asset.altText}</p></div>}
    <figcaption>{asset.requiredAttribution} <a href={asset.licenseUrl} target="_blank" rel="noreferrer">Image license (new tab)</a></figcaption>
  </figure>;
}

function Provenance({ id }: { id: string }) {
  const asset = media.assets.find(item => item.id === id);
  if (!asset) return null;
  return <details className="nineveh-depth-details"><summary>Object, provenance & image rights</summary>
    <dl><dt>Maker / culture</dt><dd>{asset.creator}</dd><dt>Object date</dt><dd>{asset.creationDate}</dd><dt>Collection</dt><dd>{asset.sourceInstitution} · {asset.identifier}</dd><dt>Provenance</dt><dd>{asset.provenance}</dd><dt>Limits</dt><dd>{asset.historicalFit}</dd><dt>Image rights</dt><dd>{asset.rightsStatement}</dd><dt>Editorial status</dt><dd>Sourced draft for human review; not approved for publication.</dd></dl>
    <a href={asset.imageRecordUrl} target="_blank" rel="noreferrer">Image source record (new tab)</a>
  </details>;
}

function World({ plain }: { plain: boolean }) {
  return <div className="nineveh-world-discovery">
    <div><p className="nineveh-eyebrow">Historical / archaeological evidence · Seventh century BCE</p><h3>A city that kept stories</h3>
      <p>This clay fragment was excavated at Kouyunjik, Nineveh. Its cuneiform preserves part of the flood story in the <cite>Epic of Gilgamesh</cite>. It belongs to the collection known as Ashurbanipal’s library.</p>
      <p>Look at the rows of marks, the division into columns, the broken edge. This is a written object from the city; it is not an illustration of Jonah.</p>
      <Source id="tablet"/>
      <details className="nineveh-depth-details"><summary>What kind of library?</summary><p>The surviving collection includes literary, medical, divinatory and administrative texts. Knowledge served royal power as well as preserving stories. The name “library” covers tablets found across Kuyunjik; their original arrangement and membership remain uncertain.</p><Source id="library"/></details>
      <p className="nineveh-limitation">The tablet’s seventh-century BCE date does not date or verify Jonah’s visit. No connection between its flood narrative and the composition of Jonah is asserted.</p>
      <Provenance id="flood-tablet"/>
    </div>
    <EvidenceImage id="flood-tablet" plain={plain}/>
  </div>;
}

function Art({ plain }: { plain: boolean }) {
  return <div className="nineveh-art-discovery">
    <p className="nineveh-eyebrow">Artistic reception · Anatolia · 280–290 CE</p>
    <h3>Under the leaves</h3>
    <EvidenceImage id="jonah-vine" plain={plain}/>
    <div className="nineveh-art-caption"><p><cite>Jonah Under the Gourd Vine</cite>. An unknown sculptor gives Jonah a reclining body, a raised arm and sheltering leaves. The city is absent from this small marble.</p><p>This late Roman–early Christian image turns toward the plant in Jonah 4:6. It is a later artistic reading, not a reconstruction of Jonah’s appearance or the plant’s species.</p></div>
    <Source id="art"/>
    <details className="nineveh-depth-details"><summary>Read the moment ahead · Jonah 4:6</summary><p className="nineveh-eyebrow">Biblical text · World English Bible · Public domain</p><blockquote data-reference="4:6">{chapter4.verses.find(verse => verse.number === 6)?.text}</blockquote><p>The plant’s shade is one moment in the continuing story. The reader continues through 4:11 without supplying an answer.</p><a href="/jonah/#jonah-4-shade">Continue in the reader · Jonah 4:5–11 →</a></details>
    <Provenance id="jonah-vine"/>
  </div>;
}

function Voices() {
  const [voiceId, setVoiceId] = useState<typeof depthVoices[number]["id"]>("augustine");
  const voice = depthVoices.find(item => item.id === voiceId) ?? depthVoices[0];
  return <div className="nineveh-voices-discovery">
    <p className="nineveh-eyebrow">Traditional / theological interpretation</p><h3>Mercy, and the word that remains</h3>
    <div className="nineveh-voice-choice" role="group" aria-label="Choose an interpretive voice">{depthVoices.map(item => <button type="button" key={item.id} aria-pressed={item.id === voiceId} onClick={() => setVoiceId(item.id)}>{item.author}</button>)}</div>
    <section className="nineveh-voice" aria-live="polite" aria-atomic="true">
      <p className="nineveh-voice-era">{voice.era}</p><h4>{voice.title}</h4><blockquote cite={depthSources[voice.id].url}>“{voice.quote}”</blockquote><p className="nineveh-quotation-credit">{voice.author} · {voice.id === "francis" ? "as quoted in the official English report" : "English translation"}</p>
      <p><span className="nineveh-copy-label">Paraphrase</span> {voice.paraphrase}</p>
      <details key={voice.id} className="nineveh-depth-details"><summary>Context, edition & quotation rights</summary><p>{voice.context}</p><p>{voice.edition}</p><p>{depthSources[voice.id].locator}.</p><p>{voice.rights}</p><Source id={voice.id}/></details>
    </section>
    <div className="nineveh-text-anchor"><p className="nineveh-eyebrow">Return to the words · Biblical text · WEB</p><p><small>Jonah 3:10</small><span data-reference="3:10">{chapter3.verses.find(verse => verse.number === 10)?.text}</span></p><p><small>Jonah 4:4</small><span data-reference="4:4">{chapter4.verses.find(verse => verse.number === 4)?.text}</span></p></div>
  </div>;
}

export function NinevehDiscoveryDialog({ discovery, reference, plain, onClose }: { discovery: NinevehDiscovery; reference: string; plain: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const definition = discoveries.find(item => item.id === discovery);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    title.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      const fallback = document.getElementById(`discover-${discovery}`) ?? document.getElementById("nineveh-heading");
      if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) previous.focus({ preventScroll: true });
      else fallback?.focus({ preventScroll: true });
    };
  }, [discovery]);
  return <dialog ref={dialog} className={`nineveh-discovery-dialog nineveh-discovery-${discovery}`} aria-labelledby="nineveh-discovery-title" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title.current)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    <div className="nineveh-dialog-top"><span>Nineveh · Alongside {reference}</span><button type="button" onClick={onClose}>Return to passage <span aria-hidden="true">×</span></button></div>
    <div className="nineveh-dialog-body"><h2 ref={title} tabIndex={-1} id="nineveh-discovery-title">{definition?.title}</h2>
      {discovery === "world" ? <World plain={plain}/> : discovery === "art" ? <Art plain={plain}/> : <Voices/>}
      <button className="nineveh-return" type="button" onClick={onClose}>Return to {reference} →</button>
    </div>
  </dialog>;
}
