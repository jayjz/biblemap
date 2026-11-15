import Image from "next/image";
import manifest from "../../../../public/media/pliny-v4/manifest.json";
import styles from "./pliny-v3.module.css";

type ArtifactId = "pliny-manuscript" | "pliny-diploma" | "pliny-trajan-coin";

/** Local, rights-verified derivatives. The caption survives failed image requests. */
export function PlinyArtifact({ id, priority = false }: { id: ArtifactId; priority?: boolean }) {
  const asset = manifest.assets.find(asset => asset.id === id);
  if (!asset) throw new Error(`Missing Pliny artifact: ${id}`);
  const small = asset.files[0];
  const large = asset.files[1];
  return <figure className={styles.artifact} data-artifact={id}>
    <a className={styles.artifactImage} href={large.localPath} aria-label={`Enlarge ${asset.title}`}>
      <picture>
        <source media="(max-width: 700px)" srcSet={small.localPath} />
        <Image src={large.localPath} width={large.width} height={large.height} alt={asset.altText} fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : "lazy"} sizes={id === "pliny-manuscript" ? "(max-width: 700px) 85vw, 420px" : "(max-width: 700px) 70vw, 260px"} />
      </picture>
      <span className={styles.enlarge} aria-hidden="true">View image ↗</span>
    </a>
    <figcaption>
      <span className={styles.artifactLocator}>{asset.locator}</span>
      <strong>{asset.caption}</strong>
      <p>{asset.context}</p>
      <details className={styles.artifactDetails}>
        <summary>Object, source &amp; rights</summary>
        <p>{asset.title} · {asset.creator}. {asset.creationDate}.</p>
        <p>{asset.requiredAttribution}</p>
        <p>{asset.historicalFit}</p>
        <a href={asset.sourceRecordUrl}>Institutional record ↗</a>
        {id === "pliny-manuscript" ? <a href="https://archive.org/details/sixthcenturyfrag00lowe/page/n80/mode/1up">1922 facsimile · plate I ↗</a> : null}
      </details>
    </figcaption>
  </figure>;
}
