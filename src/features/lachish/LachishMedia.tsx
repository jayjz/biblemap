"use client";

import { useState } from "react";

// Local responsive derivatives are pinned and rights-verified in manifest.json.
/* eslint-disable @next/next/no-img-element */
export function LachishMedia({ name, alt, className, eager = false, width, height }: { name: string; alt: string; className?: string; eager?: boolean; width: number; height: number }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className={`lachish-media-fallback ${className ?? ""}`} role="img" aria-label={alt}><p>The image is unavailable. The account and sources remain below.</p><a href="#sources">Read the evidence</a></div> : <img
    ref={element => { if (element?.complete && element.naturalWidth === 0) setFailed(true); }}
    className={className} src={`/media/lachish/${name}-1440.webp`}
    srcSet={`/media/lachish/${name}-720.webp 720w, /media/lachish/${name}-1440.webp 1440w`}
    sizes="(max-width: 700px) 100vw, 75vw" width={width} height={height}
    alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async"
    onError={() => setFailed(true)}
  />;
}
