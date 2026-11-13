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

function PrisonLight() {
  return <figure className={styles.prisonLight}>
    <ArtworkImage src="/media/human-story/perpetua-room.webp" width={1536} height={1024} alt="An imagined empty room with a high window and a band of light. AI-generated artistic interpretation, not the historical prison." />
    <figcaption>An imagined room · AI-generated artwork.<br />Its appearance is not known. <a href="#source-prison-art">Image & source</a></figcaption>
  </figure>;
}

/** Composition and artwork are separate from the sourced narrative model. */
export function PerpetuaMovement({ id, children, endingNotes }: { id: string; children: ReactNode; endingNotes?: ReactNode }) {
  if (id === "carthage") return <div className={styles.cityComposition}>
    <div>{children}</div>
    <aside className={styles.twoLives} aria-label="The two women at the beginning of the account">
      <div><span>Perpetua</span><p>About twenty-two.<br />A married woman.<br />A son at the breast.</p></div>
      <div><span>Felicity</span><p>Enslaved.<br />Pregnant.<br />Imprisoned with the group.</p></div>
      <p className={styles.peopleCaption}>The narrator’s introduction, Passion §2.<br />Their children give the story a future beyond its ending.</p>
    </aside>
  </div>;
  if (id === "child") return <div className={styles.childComposition}>
    <div className={styles.childReading}>{children}
      <blockquote className={styles.sourceLead}>“the dungeon became to me as it were a palace”</blockquote>
      <p className={styles.quoteCredit}><a href="#source-passion-wallis">Attributed account, §3 · R. E. Wallis, 1885</a></p>
    </div>
    <PrisonLight />
  </div>;
  if (id === "tribunal") return <>
    <div className={styles.hearingPrelude}>{children}</div>
    <div className={styles.hearingComposition}>
      <div className={styles.fatherAppeal}><Passage id="father" /><details className={styles.fatherGesture}><summary>The gestures she remembers</summary><Passage id="fatherHands" /></details></div>
      <div className={styles.officialAppeal}><Passage id="official" /></div>
      <div className={styles.daughterReply}><Passage id="reply" /></div>
      <p className={styles.hearingLimit}>Reported speech within the account attributed to Perpetua.<br />No independent court transcript survives here.</p>
    </div>
    <div className={styles.hearingGrief}>
      <p className={styles.narratedOutcome}>She refuses to sacrifice. Hilarianus orders her father struck and condemns the prisoners to the beasts: death in a public arena. Perpetua describes her father’s pain as though the blows had fallen on her.</p>
      <Passage id="grief" />
      <PerpetuaContext scene="tribunal" />
    </div>
  </>;
  if (id === "vision") return <>
    <div className={styles.visionPrelude}>{children}</div>
    <PerpetuaVision />
    <div className={styles.visionAfter}><PerpetuaContext scene="vision" /></div>
  </>;
  if (id === "felicity") return <>
    <div className={styles.felicityComposition}>
      <div className={styles.felicityReading}>{children}</div>
      <figure className={styles.felicityArt}>
        <ArtworkImage src="/media/human-story/kollwitz-mothers.webp" width={640} height={469} alt="Käthe Kollwitz’s The Mothers: women gather around children. A twentieth-century artistic parallel to companionship and care, not Felicity or the prisoners." />
        <figcaption>Käthe Kollwitz, <cite>The Mothers</cite>, 1922.<br />Library of Congress. Public domain. An artistic parallel.<br /><a href="#source-felicity-art">The print’s own world & source</a></figcaption>
      </figure>
    </div>
    <div className={styles.felicityWords}><p className={styles.registerChange}>Her answer, preserved by the narrator</p><Passage id="felicity" /><div className={styles.daughterCare}><Passage id="daughter" /></div><PerpetuaContext scene="felicity" /></div>
  </>;
  if (id === "handover") return <div className={styles.endingComposition}>
    <div className={styles.lastWords}><Passage id="last" /></div>
    <div className={styles.handoverBreak}><span>The attributed writing ends here.</span><p>After a vision attributed to Saturus (§§11–13),<br />the narrator takes up the story again (§14).</p></div>
    <div className={styles.arenaEnding}>
      <p className={styles.registerChange}>The narrator · Passion §§18–21</p>
      <h3>Another voice.<br />The same two women.</h3>
      <div className={styles.afterWriting}>
        <div>{children}</div>
        <div className={styles.standing}><Passage id="standing" /></div>
      </div>
      <p className={styles.endingAbsence}>Felicity’s daughter is placed in another woman’s care.<br />Perpetua’s son is not returned to her in the account.<br />Neither child’s later life is told here.</p>
    </div>
    <div className={styles.transmission}>
      <h3>A story survives.<br />An original diary does not.</h3>
      <p>The <cite>Passion</cite> reaches us through manuscript transmission and translation. Its frame says Perpetua wrote her account herself; scholars dispute how the work was composed and how much of that voice we can recover. The story is vivid. Vividness alone cannot authenticate its speakers.</p>
      <p>It was written to strengthen Christian readers. Its visions, remembered speech and language of victory belong to that purpose. We can listen to the people it preserves while keeping the limits of the record in view.</p>
      <PerpetuaContext scene="handover" />
    </div>
    <div className={styles.endingNotes}>{endingNotes}</div>
    <div className={styles.finalQuestion}>
      <p>Perpetua. Felicity.<br />A son. A daughter.<br />A father asking for a life.</p>
      <h3>Whose voice survives when someone else finishes the story?</h3>
    </div>
  </div>;
  return children;
}
