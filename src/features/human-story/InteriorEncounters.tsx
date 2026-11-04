import Link from "next/link";
import { SourcePassage } from "./SourcePassage";
import { InteriorArtwork } from "./InteriorArtwork";
import styles from "./interior.module.css";

export function LetterEncounter() {
  return (
    <section
      className={styles.letterEncounter}
      aria-labelledby="letter-encounter-title"
    >
      <div className={styles.encounterIntro}>
        <p className={styles.eyebrow}>
          Bithynia · early second century · two Roman officials
        </p>
        <h2 id="letter-encounter-title">
          A governor asks.
          <br />
          An emperor answers.
        </h2>
        <p>
          Pliny has already punished people. He writes to ask how to proceed.
          Read his practice beside the limits Trajan places on it.
        </p>
      </div>
      <div className={styles.letterPair}>
        <div>
          <h3>The practice</h3>
          <SourcePassage id="pliny" />
        </div>
        <details className={styles.reply}>
          <summary>Read Trajan’s reply alongside it</summary>
          <SourcePassage id="trajan" />
          <SourcePassage id="trajanRepentance" />
          <p className={styles.prompt}>
            What does “do not go out of your way” change—and what does it leave
            in place?
          </p>
        </details>
      </div>
      <p className={styles.sourceNote}>
        Melmoth / Bosanquet translation, public domain. Letters 10.96–97
        (XCVII–XCVIII in the linked edition). This correspondence is earlier
        than Perpetua’s trial and comes from another province.
      </p>
    </section>
  );
}

export function SaintsEncounter() {
  return (
    <section
      className={styles.saintsEncounter}
      aria-labelledby="saints-encounter-title"
    >
      <div>
        <p className={styles.eyebrow}>Two ways a life reaches us</p>
        <h2 id="saints-encounter-title">
          Who is speaking.
          <br />
          Who is listening.
        </h2>
        <div className={styles.saintVoices}>
          <article>
            <h3>Perpetua asks for her child.</h3>
            <SourcePassage id="childEarlier" />
            <p>
              The work attributes these words to Perpetua. Later, a narrator
              must tell the part she cannot write.
            </p>
            <Link prefetch={false} href="/human-story/perpetua/#perpetua-child">
              Enter the prison
            </Link>
          </article>
          <article>
            <h3>Augustine addresses God.</h3>
            <SourcePassage id="augustine" />
            <p>
              He begins with praise and questions. The “Thee” of this opening is
              God; we read over his shoulder.
            </p>
            <Link prefetch={false} href="/human-story/augustine/">
              Read the opening with the painting
            </Link>
          </article>
        </div>
        <p className={styles.sourceNote}>
          Historical translations: R. E. Wallis (1885) and E. B. Pusey; public
          domain. The Passion’s attribution is a claim of the transmitted work,
          not an autograph available to us.
        </p>
      </div>
    </section>
  );
}

export function AugustineEncounter() {
  return (
    <section
      className={styles.augustineEncounter}
      aria-labelledby="augustine-opening-title"
    >
      <div>
        <p className={styles.eyebrow}>The opening · Confessions I.1</p>
        <h2 id="augustine-opening-title">
          Before the story of his life, a question.
        </h2>
        <SourcePassage id="augustine" />
        <details className={styles.imageReading}>
          <summary>Compare the words with the painting</summary>
          <p>
            Look at the heart in his hand, the writing quill and the light
            marked VERITAS (“truth”). Champaigne gives an inward address a
            visible form. Those are the choices of a seventeenth-century
            painter.
          </p>
          <p>
            What can that image hold together that the opening leaves as a
            question?
          </p>
        </details>
      </div>
      <InteriorArtwork id="augustine-painting" />
    </section>
  );
}

export function SeparationPassage() {
  return (
    <div className={styles.separationPassage}>
      <p className={styles.eyebrow}>After the sentence · Passion §6</p>
      <SourcePassage id="childSeparation" articulate />
      <p className={styles.sourceNote}>
        R. E. Wallis, 1885, public domain. “No [longer]” corrects “no long” in
        the electronic transcription. These are translated words from the
        transmitted work.
      </p>
    </div>
  );
}
