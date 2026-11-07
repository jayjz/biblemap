import type { ReactNode } from "react";
import { PERPETUA_PASSAGES } from "@/content/perpetua-passages";
import { ArtworkImage } from "./ArtworkImage";
import { PerpetuaVision } from "./PerpetuaVision";
import { PerpetuaContext } from "./PerpetuaContext";
import styles from "./prison.module.css";

function Passage({ id }: { id: keyof typeof PERPETUA_PASSAGES }) {
  const passage = PERPETUA_PASSAGES[id];
  return <figure className={styles.testimony} data-perpetua-passage={id}>
    <blockquote cite={passage.url}>{passage.text}</blockquote>
    <figcaption>{passage.speaker}<br /><a href={passage.url}>{passage.locator}</a><span>R. E. Wallis translation, 1885 · public domain</span></figcaption>
  </figure>;
}

export function PerpetuaMovement({ id, children, endingNotes }: { id: string; children: ReactNode; endingNotes?: ReactNode }) {
  if (id === "child") return <div className={styles.childComposition}>
    <figure className={styles.childArt}>
      <ArtworkImage src="/media/human-story/cassatt-kiss.webp" width={1200} height={1778} alt="Mary Cassatt’s Mother’s Kiss: a mother bends over the child in her arms. An artistic parallel, not Perpetua." />
      <figcaption>Mary Cassatt, <cite>Mother’s Kiss</cite>, 1890–1891.<br />An artistic parallel, not Perpetua. NGA, CC0. <a href="#source-cassatt-art">Image & source</a></figcaption>
    </figure>
    <div className={styles.childReading}>
      <p className={styles.sourceLead}>“the dungeon became to me as it were a palace”</p>
      <p className={styles.quoteCredit}><a href="#source-passion-wallis">Attributed account, §3 · Wallis, 1885</a></p>
      {children}
    </div>
  </div>;
  if (id === "tribunal") return <>
    <div className={styles.hearingComposition}>
      <div className={styles.fatherAppeal}><Passage id="father" /><div className={styles.fatherGesture}><Passage id="fatherHands" /></div></div>
      <div className={styles.officialAppeal}><Passage id="official" /></div>
      <div className={styles.daughterReply}><Passage id="reply" /></div>
      <p className={styles.hearingLimit}>Three speaking positions. One attributed account.<br />These are not independently preserved depositions.</p>
    </div>
    <div className={styles.hearingGrief}><p className={styles.registerChange}>After her father is struck</p><Passage id="grief" /></div>
    <div className={styles.hearingReading}>{children}<PerpetuaContext scene="tribunal" /></div>
  </>;
  if (id === "vision") return <><PerpetuaVision /><div className={styles.visionAfter}>{children}<PerpetuaContext scene="vision" /></div></>;
  if (id === "felicity") return <div className={styles.felicityComposition}>
    <figure className={styles.felicityArt}>
      <ArtworkImage src="/media/human-story/kollwitz-mothers.webp" width={640} height={469} alt="Käthe Kollwitz’s The Mothers: women gather their bodies and arms around children. A twentieth-century artistic parallel, not Felicity or the prisoners." />
      <figcaption>Käthe Kollwitz, <cite>The Mothers</cite>, 1922.<br />Library of Congress. Public domain. An artistic parallel.<br /><a href="#source-felicity-art">The print’s own world & source</a></figcaption>
      <p className={styles.artConversation}>A group gathered around children.<br />A story about the fear of being left behind.</p>
    </figure>
    <div className={styles.felicityReading}>{children}<div className={styles.felicityReply}><Passage id="felicity" /></div><div className={styles.daughterCare}><Passage id="daughter" /></div><PerpetuaContext scene="felicity" /></div>
  </div>;
  if (id === "handover") return <div className={styles.endingComposition}>
    <div className={styles.lastWords}><Passage id="last" /></div>
    <div className={styles.handoverBreak}><span>The attributed writing ends here.</span></div>
    <div className={styles.afterWriting}>
      <div><p className={styles.registerChange}>The narrator continues</p><Passage id="standing" />{children}</div>
      <figure className={styles.remembranceArt}>
        <ArtworkImage src="/media/human-story/perpetua-mosaic.webp" width={450} height={600} alt="Later devotional mosaic of Perpetua holding her child. This image of togetherness does not supply the child’s later history." />
        <figcaption>Remembered together.<br />Perpetua and her child, Montserrat; artist and date unknown.<br />Photo: Enric, CC BY-SA 3.0. <a href="#source-perpetua-art">Image & source</a></figcaption>
      </figure>
    </div>
    <PerpetuaContext scene="handover" />
    <div className={styles.endingNotes}>{endingNotes}</div>
    <div className={styles.finalQuestion}>
      <h3>Whose voice survives when someone else finishes the story?</h3>
    </div>
  </div>;
  return children;
}
