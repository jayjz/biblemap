'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './cinema.module.css';

export type ThomasImageId = 'proximity' | 'interior' | 'threshold';

/** Decorative interpretive art. Scripture and disclosures are independent of image state. */
export function CinematicImage({ image, priority = false }: { image: ThomasImageId; priority?: boolean }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'unavailable'>('loading');
  return <span className={styles.image} data-cinematic-frame={image} data-media-state={status}>
    <span className={styles.mediaFallback} aria-hidden="true" />
    {status !== 'unavailable' && <picture>
      <source media="(max-width: 650px)" srcSet={`/media/thomas/${image}-768.webp`} />
      <Image src={`/media/thomas/${image}-1536.webp`} width={1536} height={1024} alt="" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onLoad={() => setStatus('loaded')} onError={() => setStatus('unavailable')} />
    </picture>}
  </span>;
}
