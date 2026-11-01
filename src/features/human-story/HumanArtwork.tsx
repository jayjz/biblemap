"use client";

import { useState } from "react";
import Image from "next/image";
import manifest from "@/features/nineveh/depth-media.json";
import styles from "./human-story.module.css";

export function HumanArtwork({ id }: { id: string }) {
  const [failed, setFailed] = useState(false);
  const asset = manifest.assets.find(candidate => candidate.id === id && candidate.rightsStatus === "verified");
  if (!asset) return <p>No rights-verified artwork is available for this reading. The text remains complete.</p>;
  return (
    <figure className={styles.readingArt}>
      {failed ? <p className={styles.mediaFallback}>The image could not load. Continue with the text and the artwork description below.</p> : <Image src={asset.publicUrl} alt={asset.altText} width={asset.width} height={asset.height} onError={() => setFailed(true)} />}
      <figcaption>
        <strong>{asset.title}</strong><p>{asset.creationDate}. {asset.sourceInstitution}.</p>
        <p>{asset.historicalFit}</p>
        <details><summary>Artwork description, provenance & rights</summary><p>{asset.altText}</p><p>{asset.creator}</p><p>{asset.provenance}</p><p>{asset.requiredAttribution}</p><p>{asset.rightsStatement}</p><p><a href={asset.sourceRecordUrl}>Institutional record</a> · <a href={asset.imageRecordUrl}>Image record</a> · <a href={asset.licenseUrl}>{asset.license}</a></p></details>
      </figcaption>
    </figure>
  );
}
