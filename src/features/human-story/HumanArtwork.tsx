import manifest from "@/features/nineveh/depth-media.json";
import { MEDIA_CATALOG } from "@/domain/media-catalog";
import { isProductionReadyMedia } from "@/domain/media";
import { ArtworkImage } from "./ArtworkImage";
import styles from "./human-story.module.css";

export function HumanArtwork({ id }: { id: string }) {
  const depth = manifest.assets.find(candidate => candidate.id === id && candidate.rightsStatus === "verified");
  const catalog = id === "michelangelo-creation-of-adam" ? MEDIA_CATALOG.find(candidate => candidate.id === id && isProductionReadyMedia(candidate)) : undefined;
  const asset = depth ? { ...depth, src: depth.publicUrl, alt: depth.altText } : catalog ? {
    ...catalog, src: catalog.localPath, alt: catalog.altText, width: 1280, height: 855,
    provenance: catalog.depictedPeriod, imageRecordUrl: catalog.sourceRecordUrl,
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Reuse_of_PD-Art_photographs",
  } : undefined;
  if (!asset) return <p>No rights-verified artwork is available for this reading. The text remains complete.</p>;
  return <figure className={styles.readingArt}>
    <ArtworkImage src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} />
    <figcaption><strong>{asset.title}</strong><p>{asset.creationDate}. {asset.sourceInstitution}.</p><p>{asset.historicalFit}</p>
      <details><summary>Artwork description, provenance & rights</summary><p>{asset.alt}</p><p>{asset.creator}</p><p>{asset.provenance}</p><p>{asset.requiredAttribution}</p><p>{asset.rightsStatement}</p><p><a href={asset.sourceRecordUrl}>Source record</a> · <a href={asset.imageRecordUrl}>Image record</a> · <a href={asset.licenseUrl}>{asset.license}</a></p></details>
    </figcaption>
  </figure>;
}
