import Image from "next/image";
import styles from "./cinematic.module.css";

export function SceneEnvironment({ place, priority = false }: { place: "galilee" | "jerusalem"; priority?: boolean }) {
  return <div className={styles.environment}>
    <picture>
      <source media="(max-width: 650px)" srcSet={`/media/james/${place}-768.webp`} />
      <Image src={`/media/james/${place}-1536.webp`} alt="" width={1536} height={1024} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
    </picture>
  </div>;
}

export function ArtDisclosure({ place }: { place: "Galilee" | "Jerusalem" }) {
  return <details className={styles.artNote}>
    <summary>{place} · interpretive art</summary>
    <p>AI-generated painting, made for BibleMap in November 2026. Buildings, people and viewpoint are imagined. No likeness of James, documented meeting place or exact city plan is reconstructed.</p>
    <a href="#james-art">References and visual provenance</a>
  </details>;
}
