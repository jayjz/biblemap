"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import media from '@/features/nineveh/depth-media.json';
import { AquinasMercyPerspective } from './AquinasMercyPerspective';

/** Draft composition: enabled only by the server's explicit review build flag. */
export function ReaderEnvironment() {
  const [failed, setFailed] = useState(false);
  return <figure className="reader-environment">
    {!failed && <Image unoptimized ref={image => { if (image?.complete && image.naturalWidth === 0) setFailed(true); }} src="/review-assets/reader-panorama.webp" width={1672} height={941} alt="Imagined earthen city beside a river, with distant haze and rocky foreground." onError={() => setFailed(true)} />}
    {failed && <p className="reader-environment-fallback">Nineveh · beside the Tigris</p>}
    <figcaption>AI-generated interpretive study · imagined architecture and river course, not a measured reconstruction or Jonah’s viewpoint.</figcaption>
  </figure>;
}

export function ReaderInterpretation() {
  return <section className="reader-margin" aria-label="Interpretation beside Jonah’s prayer">
    <p className="story-eyebrow">Alongside Jonah 4:2</p>
    <p className="reader-margin-title">Mercy and justice</p>
    <p>Thomas Aquinas <span>· Medieval Catholic theology</span></p>
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
    <p className="story-eyebrow">An object from Nineveh · 7th century BCE</p>
    <h3>Stories kept in clay</h3>
    <p>The city named in the passage also has a material history. This surviving tablet preserves part of the Epic of Gilgamesh, not an account of Jonah.</p>
    <button ref={trigger} type="button" onClick={() => {setZoom(false); dialog.current?.showModal();}}>Examine the Flood Tablet <span aria-hidden="true">↗</span></button>
    <noscript><p><a href={artifact.publicUrl}>View the tablet photograph</a></p></noscript>
    <p className="reader-credit">{artifact.requiredAttribution} <a href={artifact.licenseUrl}>License</a></p>
    <dialog ref={dialog} className="reader-object-dialog" aria-labelledby="reader-object-title" onClose={() => trigger.current?.focus({preventScroll:true})}>
      <div className="reader-object-toolbar"><h3 id="reader-object-title">The Flood Tablet</h3><button type="button" autoFocus onClick={() => dialog.current?.close()}>Return to reading</button></div>
      <button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? 'Fit whole object' : 'Enlarge the writing'}</button>
      <div className="reader-object-image" tabIndex={0} role="region" aria-label="Tablet image; scroll to examine when enlarged">
        {failed ? <p>Photograph unavailable. The object record and reading remain available below.</p> : <Image unoptimized ref={image => { if (image?.complete && image.naturalWidth === 0) setFailed(true); }} style={{width:zoom ? '1100px' : '100%', maxWidth:zoom ? 'none' : '480px'}} src={artifact.publicUrl} width={1280} height={1407} alt={artifact.altText} onError={() => setFailed(true)} />}
      </div>
      <p>Notice the columns of wedge-shaped marks and the broken edge. The object gives material form to writing in Nineveh; it does not identify anyone in Jonah 3:10 or verify the narrated repentance.</p>
      <p>{artifact.title} · {artifact.creationDate} · {artifact.sourceInstitution}, {artifact.identifier}. {artifact.provenance}</p>
      <p className="reader-credit">{artifact.requiredAttribution} <a href={artifact.licenseUrl}>CC BY-SA 3.0</a> · <a href={artifact.imageRecordUrl}>Photograph source</a></p>
      <a href={artifact.sourceRecordUrl}>Read the museum object record ↗</a>
    </dialog>
  </section>;
}
