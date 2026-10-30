"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import media from '@/features/nineveh/depth-media.json';
import { DISCOVERY_SOURCES, storyPlaceHref } from '@/content/jonah-discoveries';
import { AquinasMercyPerspective } from './AquinasMercyPerspective';

/** Original relationship drawing, not a city plan or a reconstructed river course. */
export function ReaderPlace({ sceneId }: { sceneId: string }) {
  return <figure className="reader-place">
    <svg viewBox="0 0 480 160" role="img" aria-labelledby={`${sceneId}-place-title ${sceneId}-place-desc`}>
      <title id={`${sceneId}-place-title`}>Nineveh beside the Tigris</title>
      <desc id={`${sceneId}-place-desc`}>Original unscaled schematic. Nineveh is east of the Tigris, opposite modern Mosul. The river curve is illustrative; no route or location of Jonah is shown.</desc>
      <path className="reader-river-bank" d="M134 -10 C104 23 169 40 142 71 S116 104 154 170" />
      <path className="reader-river" d="M122 -10 C92 23 157 40 130 71 S104 104 142 170" />
      <path className="reader-place-rule" d="M182 64 H218" />
      <circle className="reader-city-ring" cx="176" cy="64" r="10" />
      <circle className="reader-city" cx="176" cy="64" r="3" />
      <text x="230" y="70" className="reader-city-name">Nineveh</text>
      <text x="29" y="115" className="reader-river-name">Tigris</text>
      <text x="230" y="96" className="reader-place-note">Opposite modern Mosul</text>
    </svg>
    <figcaption><span><span className="reader-place-mobile-name">Nineveh beside the Tigris</span><small>Original schematic · not to scale</small></span><a href={storyPlaceHref('nineveh', sceneId)}>Locate in the atlas <span aria-hidden="true">↗</span></a></figcaption>
    <a className="reader-place-source" href={DISCOVERY_SOURCES.nineveh.url} target="_blank" rel="noreferrer">Geographic source: Pleiades</a>
  </figure>;
}

export function ReaderInterpretation() {
  return <section className="reader-margin" aria-label="Interpretation beside Jonah’s prayer">
    <p className="reader-side-note">A later conversation</p>
    <h3 className="reader-margin-title">Mercy and justice</h3>
    <p className="reader-perspective-credit">Thomas Aquinas <span>Medieval Catholic theology</span></p>
    <AquinasMercyPerspective sceneId="jonah-4-anger" />
  </section>;
}

export function ReaderArtifact() {
  const artifact = media.assets.find(asset => asset.id === 'flood-tablet');
  if (!artifact) throw new Error('Missing Flood Tablet catalog record');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState(false);
  return <section className="reader-artifact" aria-label="An object from Nineveh">
    <figure className="reader-object-preview">
      <button ref={trigger} className="reader-object-trigger" type="button" aria-label="Examine the Flood Tablet" onClick={() => {setZoom(false); dialog.current?.showModal();}}>
        {failed ? <span className="reader-image-fallback">Photograph unavailable. Examine the object record.</span> : <Image unoptimized ref={image => { if (image?.complete && image.naturalWidth === 0) setFailed(true); }} src={artifact.publicUrl} width={artifact.width} height={artifact.height} alt={artifact.altText} onError={() => setFailed(true)} />}
        <span className="reader-object-invitation">Examine the Flood Tablet <span aria-hidden="true">＋</span></span>
      </button>
      <figcaption>
        <p className="reader-side-note">From Nineveh · seventh century BCE</p>
        <h3>Stories kept in clay</h3>
        <p>This surviving tablet preserves part of the <em>Epic of Gilgamesh</em>, not an account of Jonah.</p>
        <p className="reader-credit">{artifact.requiredAttribution} <a href={artifact.licenseUrl}>License</a></p>
      </figcaption>
    </figure>
    <noscript><p><a href={artifact.publicUrl}>View the tablet photograph</a></p></noscript>
    <dialog ref={dialog} className="reader-object-dialog" aria-labelledby="reader-object-title" onClose={() => trigger.current?.focus({preventScroll:true})}>
      <div className="reader-object-toolbar"><span>Looking closely</span><button type="button" autoFocus onClick={() => dialog.current?.close()}>Return to reading <span aria-hidden="true">×</span></button></div>
      <div className="reader-object-study">
      <div className="reader-object-image" tabIndex={0} role="region" aria-label="Tablet image; scroll to examine when enlarged">
        {failed ? <p>Photograph unavailable. The object record and reading remain available below.</p> : <Image unoptimized ref={image => { if (image?.complete && image.naturalWidth === 0) setFailed(true); }} style={{width:zoom ? '1100px' : '100%', maxWidth:zoom ? 'none' : '480px'}} src={artifact.publicUrl} width={1280} height={1407} alt={artifact.altText} onError={() => setFailed(true)} />}
      </div>
      <div className="reader-object-notes">
      <p className="reader-side-note">A historical object · {artifact.creationDate}</p>
      <h3 id="reader-object-title">The Flood Tablet</h3>
      <button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? 'Fit whole object' : 'Enlarge the writing'}</button>
      <p>Notice the columns of wedge-shaped marks and the broken edge. The object gives material form to writing in Nineveh; it does not identify anyone in Jonah 3:10 or verify the narrated repentance.</p>
      <p>{artifact.title} · {artifact.creationDate} · {artifact.sourceInstitution}, {artifact.identifier}. {artifact.provenance}</p>
      <p className="reader-credit">{artifact.requiredAttribution} <a href={artifact.licenseUrl}>CC BY-SA 3.0</a> · <a href={artifact.imageRecordUrl}>Photograph source</a></p>
      <a href={artifact.sourceRecordUrl}>Read the museum object record ↗</a>
      </div>
      </div>
    </dialog>
  </section>;
}
