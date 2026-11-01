"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./human-story.module.css";

export function ArtworkImage({ src, alt, width, height, priority = false }: { src: string; alt: string; width: number; height: number; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <p className={styles.mediaFallback} role="status">The image could not load. {alt} Continue with the text and source details.</p>
    : <Image src={src} alt={alt} width={width} height={height} priority={priority} onError={() => setFailed(true)} />;
}
