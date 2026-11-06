import Link from "next/link";
import manifest from "../../../public/media/thomas/manifest.json";
import { THOMAS_ROUTES } from "@/content/thomas";
import { CinematicImage } from "./thomas/CinematicImage";
import actions from "./action-link.module.css";
import styles from "./discovery.module.css";

/** A source-backed draft invitation, independent of the Human Story graph. */
export function ThomasInvitation() {
  const artwork = manifest.assets.find((asset) => asset.id === "proximity-1536");
  if (!artwork) throw new Error("Missing Thomas invitation provenance");
  return (
    <article id="thomas-invitation" className={styles.thomas} aria-labelledby="thomas-invitation-title">
      <div className={styles.thomasCopy}>
        <p className={styles.thomasName}>Thomas. The Witness.</p>
        <h3 id="thomas-invitation-title">What if you weren’t there?</h3>
        <p>An encounter he missed. Words from those who were there. Enter John’s account of Thomas.</p>
        <Link prefetch={false} className={`${actions.action} ${styles.thomasAction}`} href={THOMAS_ROUTES.encounter}>
          Enter Thomas’s story
        </Link>
      </div>
      <figure className={styles.thomasFigure}>
        <div className={styles.thomasArt}><CinematicImage image="proximity" /></div>
        <figcaption>
          <details>
            <summary>About the AI-generated artwork</summary>
            <p>{artwork.caption} {artwork.historicalFit}</p>
            <p>{artwork.creator}. {artwork.creationDate}. {artwork.rightsStatement}</p>
            <a href={artwork.sourceRecordUrl}>Full provenance, material references & rights</a>
          </details>
        </figcaption>
      </figure>
      <div className={styles.thomasDocuments}>
        <div>
          <h4>The Gospel of Thomas</h4>
          <p>A separately attributed sayings collection. Its authorship is uncertain.</p>
        </div>
        <Link prefetch={false} className={actions.action} href={THOMAS_ROUTES.sayings}>
          Explore the sayings & manuscripts
        </Link>
      </div>
    </article>
  );
}
