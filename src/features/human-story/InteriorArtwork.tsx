import media from "@/content/human-story-interior-media.json";
import { ArtworkImage } from "./ArtworkImage";
import styles from "./interior.module.css";

export type InteriorArtworkId =
  | "rome-forum"
  | "augustine-painting"
  | "perpetua-mosaic";

export function InteriorArtwork({
  id,
  priority = false,
}: {
  id: InteriorArtworkId;
  priority?: boolean;
}) {
  const asset = media.find((item) => item.id === id);
  if (!asset) throw new Error(`Missing interior artwork: ${id}`);
  return (
    <figure className={styles.artwork} data-interior-art={id}>
      <ArtworkImage
        src={asset.localPath}
        alt={asset.altText}
        width={asset.width}
        height={asset.height}
        priority={priority}
      />
      <figcaption>
        <p>{asset.caption}</p>
        <details>
          <summary>Look closer · image & source</summary>
          <p>{asset.historicalFit}</p>
          <p>{asset.requiredAttribution}</p>
          <p>
            <a href={asset.sourceRecordUrl}>Source record</a> ·{" "}
            <a href={asset.licenseUrl}>{asset.license}</a>
          </p>
          <p>
            {asset.creationDate}{" "}
            {asset.id === "perpetua-mosaic" &&
              "Source of mosaic’s artist and date: unknown."}
          </p>
          <a className={styles.imageLink} href={asset.localPath}>
            Open the complete image
          </a>
        </details>
      </figcaption>
    </figure>
  );
}
