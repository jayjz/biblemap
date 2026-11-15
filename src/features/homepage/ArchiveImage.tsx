"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./archive.module.css";

/** Only image failure needs client state; links, captions and provenance remain static. */
export function ArchiveImage({ src, alt, width, height, srcSet, sizes, priority = false }: {
  src: string; alt: string; width: number; height: number;
  srcSet?: string; sizes?: string; priority?: boolean;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "unavailable">("loading");
  return <div className={styles.imageFrame} data-media-state={state} style={{ aspectRatio: `${width} / ${height}` }}>
    {state === "unavailable" ? <p className={styles.imageFallback} role="status">The image could not load. {alt} Continue with the text and source details.</p> :
      <picture>
        {srcSet && <source srcSet={srcSet} sizes={sizes} />}
        <Image src={src} alt={alt} width={width} height={height} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} onLoad={() => setState("loaded")} onError={() => setState("unavailable")} />
      </picture>}
  </div>;
}
