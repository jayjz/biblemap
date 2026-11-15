import { HOME_MEDIA } from "@/content/home-media";
import type { HomeInvitationId } from "@/content/home-editorial";
import { CinematicImage } from "@/features/human-story/thomas/CinematicImage";
import { ArchiveImage } from "./ArchiveImage";
import styles from "./archive.module.css";

export function ArchiveArt({ id }: { id: HomeInvitationId }) {
  const asset = HOME_MEDIA[id];
  return <figure className={styles.art} data-home-art={id}>
    {id === "thomas" ? <div className={styles.thomasImage}><CinematicImage image="proximity" /></div> : id === "pliny" ?
      <ArchiveImage src={HOME_MEDIA.pliny.localPath} srcSet={HOME_MEDIA.pliny.files.map(file => `${file.localPath} ${file.width}w`).join(", ")} sizes="(max-width: 700px) 180px, (max-width: 1000px) 36vw, 390px" width={600} height={833} alt={HOME_MEDIA.pliny.altText} priority /> :
      <ArchiveImage src={asset.localPath} alt={asset.altText} width={id === "perpetua" ? HOME_MEDIA.perpetua.width : HOME_MEDIA.jonah.width} height={id === "perpetua" ? HOME_MEDIA.perpetua.height : HOME_MEDIA.jonah.height} />}
    <figcaption>
      <p className={styles.artTitle}>{id === "pliny" ? "A later witness to Pliny’s Letters" : id === "thomas" ? "AI-generated interpretive artwork" : asset.title}</p>
      <p>{id === "pliny" ? "Books II–III, not the letters read here. A 1922 facsimile of a late-fifth-century manuscript." : id === "perpetua" ? "Montserrat. Later devotional mosaic; artist and date unknown." : id === "jonah" ? "280–290 CE. Later Christian art." : "Anonymous invented figures; no biblical identities or event are reconstructed."}</p>
      <details>
        <summary>{id === "thomas" ? "About the AI-generated artwork" : id === "pliny" ? "Manuscript & provenance" : "Artwork & provenance"}</summary>
        <p>{asset.creator}. {asset.creationDate}. {asset.sourceInstitution}.</p>
        <p>{asset.historicalFit}</p>
        <p>{asset.requiredAttribution}</p>
        <a href={asset.sourceRecordUrl}>Source record & rights</a>
        {"licenseUrl" in asset && <>{" · "}<a href={asset.licenseUrl}>{asset.license}</a></>}
      </details>
    </figcaption>
  </figure>;
}
