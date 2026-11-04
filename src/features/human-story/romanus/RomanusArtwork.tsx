"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./romanus.module.css";

export function RomanusArtwork({ src, smallSrc, alt }: { src: string; smallSrc: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className={styles.mosaic}>
    {failed ? <div className={styles.imageFallback} role="status">The mosaic could not load. Its central female figure is a personification of abundance or good living, framed by a geometric floor. Continue with the account and image record below.</div> : <picture>
      <source media="(max-width: 600px)" srcSet={smallSrc} />
      <Image src={src} alt={alt} width={1500} height={1644} onError={() => setFailed(true)} />
    </picture>}
    <figcaption><cite>Mosaic floor panel</cite>, Daphne near Antioch, second century CE. A personification, not Romanus. The Metropolitan Museum of Art, 38.11.12. Public domain / CC0. <a href="#source-romanus-daphne">Image and provenance</a>.</figcaption>
  </figure>;
}
