import Link from "next/link";
import media from "@/content/human-story-interior-media.json";
import { ROMANUS_MEDIA } from "@/content/romanus-media";
import { ArtworkImage } from "./ArtworkImage";
import { ThomasInvitation } from "./ThomasInvitation";
import actions from "./action-link.module.css";
import styles from "./discovery.module.css";

export function FeaturedEncounters() {
  const perpetua = media.find((asset) => asset.id === "perpetua-mosaic");
  const romanus = ROMANUS_MEDIA.find((asset) => asset.id === "romanus-daphne-mosaic-small");
  if (!perpetua || !romanus) throw new Error("Missing featured encounter media");
  return (
    <section id="encounters" className={styles.encounters} aria-labelledby="encounters-title" tabIndex={-1}>
      <div className={styles.heading}>
        <h2 id="encounters-title">Lives. Different voices.</h2>
        <p>Meet Perpetua, Romanus and Thomas through the accounts that survive.</p>
      </div>
      <div className={styles.pair}>
        <article className={styles.perpetua} aria-labelledby="perpetua-invitation">
          <div className={styles.invitation}>
            <h3 id="perpetua-invitation">Perpetua.<span className={styles.storySubtitle}>The Prison.</span></h3>
            <p>A mother, her child, a father at the hearing. Follow the relationships, then look at whose voice carries them to us.</p>
            <Link prefetch={false} className={`${actions.action} ${actions.primary}`} href="/human-story/perpetua/">
              Enter the encounter
            </Link>
          </div>
          <figure>
            <ArtworkImage src={perpetua.localPath} alt={perpetua.altText} width={perpetua.width} height={perpetua.height} />
            <figcaption>
              <p>{perpetua.caption}</p>
              <details>
                <summary>Artwork & provenance</summary>
                <p>{perpetua.historicalFit}</p>
                <p>{perpetua.requiredAttribution}</p>
                <a href={perpetua.sourceRecordUrl}>Image record</a>{" · "}<a href={perpetua.licenseUrl}>{perpetua.license}</a>
              </details>
            </figcaption>
          </figure>
        </article>
        <article className={styles.romanus} aria-labelledby="romanus-invitation">
          <div className={styles.invitation}>
            <h3 id="romanus-invitation">Romanus.<span className={styles.storySubtitle}>The voice they could not silence.</span></h3>
            <p>A man in Antioch. A life preserved in different words.</p>
            <Link prefetch={false} className={`${actions.action} ${actions.primary}`} href="/human-story/romanus/">
              Meet Romanus
            </Link>
          </div>
          <figure>
            <ArtworkImage src={romanus.localPath} alt={romanus.altText} width={1500} height={1644} />
            <figcaption>
              <p>{romanus.caption}</p>
              <details>
                <summary>Artwork & provenance</summary>
                <p>{romanus.historicalFit}</p>
                <p>{romanus.requiredAttribution}</p>
                <a href={romanus.sourceRecordUrl}>Image record</a>{" · "}<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>
              </details>
            </figcaption>
          </figure>
        </article>
      </div>
      <ThomasInvitation />
    </section>
  );
}
