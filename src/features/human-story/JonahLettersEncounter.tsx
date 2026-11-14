import Link from "next/link";
import { VISITOR_HUMAN_GRAPH } from "@/content/visitor-human-story";
import chapter4 from "@/content/scripture/web-jonah-4.json";
import { JONAH_LETTERS } from "@/content/jonah-letters";
import { HumanStoryFrame } from "./HumanStoryFrame";
import styles from "./jonah-letters.module.css";

/** Native HTML owns disclosure state, including without hydration or JavaScript. */
export function JonahLettersEncounter() {
  const sources = VISITOR_HUMAN_GRAPH.sources.filter((source) =>
    JONAH_LETTERS.some((letter) => letter.sourceId === source.id),
  );
  return (
    <HumanStoryFrame immersive footer={false}>
      <article className={styles.encounter} data-encounter="jonah-letters">
        <header className={styles.opening} data-source="augustine-jerome jerome-augustine">
          <h1>One word. A congregation.</h1>
          <p className={styles.introduction}>
            In Augustine’s report, a bishop risks losing his congregation over a changed word in Jonah.
            Jerome replies in defense of his translation.
          </p>
          <a className={styles.begin} href="#letters-exchange">Hear the letters <span aria-hidden="true">↓</span></a>
          <p className={styles.setting}>
            Oea · Letters dated 403 and 404 CE · Later Christian reception
          </p>
        </header>

        <div className={styles.exchange}>
          <section className={styles.scripture} aria-labelledby="shade-title">
            <div className={styles.scriptureInner}>
              <h2 id="shade-title">Before the argument,<br />the shade.</h2>
              <figure data-source="web-jonah" className={styles.verse}>
                <blockquote>{chapter4.verses.find((verse) => verse.number === 6)?.text}</blockquote>
                <figcaption>
                  <Link prefetch={false} href="/jonah/#jonah-4-shade">Jonah 4:6</Link>
                  <span>World English Bible · Public domain</span>
                </figcaption>
              </figure>
              <p className={styles.scriptureNote}>
                This translation says “vine”. The words beside it belong
                to a much later argument about translation.
              </p>
            </div>
          </section>

          <div className={styles.correspondence}>
            <div className={styles.words} aria-label="Gourd and ivy: English renderings of the disputed plant-names">
              <span>gourd</span><span>ivy</span>
            </div>
            <p className={styles.wordNote}>English renderings of the alternatives discussed by Jerome</p>
            <section id="letters-exchange" tabIndex={-1} aria-label="Read the two letters" className={styles.letters}>
              {JONAH_LETTERS.map((letter, index) => (
                <details key={letter.id} name="jonah-correspondence" open={index === 0}
                  className={styles.letter} data-letter={letter.id}>
                  <summary>
                    <span className={styles.disclosureMark} aria-hidden="true" />
                    <span><span className={styles.year}>{letter.year}</span>{letter.action}</span>
                  </summary>
                  <div className={styles.letterBody} id={letter.id}>
                    <p>{letter.bridge}</p>
                    <figure data-source={letter.sourceId}>
                      <blockquote>{letter.quote}</blockquote>
                      <figcaption>
                        {letter.author} · {letter.locator}<br />
                        J. G. Cunningham translation · NPNF I.1, 1887
                      </figcaption>
                    </figure>
                    <p className={styles.boundary}>{letter.boundary}</p>
                    <a href={`#source-${letter.sourceId}`} className={styles.sourceLink}>
                      Inspect this letter’s source
                    </a>
                  </div>
                </details>
              ))}
            </section>

            <section className={styles.return} aria-labelledby="return-shade-title" data-source="web-jonah">
              <h2 id="return-shade-title">Return to the shade.</h2>
              <p data-source="jerome-augustine">
                Jerome identifies the dispute with gourd and ivy. The letters
                preserve an argument about translation; they do not settle the
                plant’s identity.
              </p>
              <p>
                In Jonah, the shade will disappear. The story moves from a plant
                to a question about a city.
              </p>
              <Link className={styles.continue} prefetch={false} href="/jonah/#jonah-4-shade">
                Continue Jonah 4 <span aria-hidden="true">→</span>
              </Link>
            </section>

            <details className={styles.provenance}>
              <summary>Sources &amp; limits</summary>
              <div className={styles.sourceBody} id="letters-sources">
                <p>
                  These are later Christian readings of Jonah. They are not
                  contemporary evidence for the biblical events. The dates here
                  are the letters’ dates in the historical edition.
                </p>
                <p>
                  The congregation reaches us through Augustine’s report.
                  Jerome repeats that report in his answer; the two letters
                  are not independent witnesses to the gathering. Neither
                  preserves a transcript of the congregation’s words.
                </p>
                <p>
                  Both writers make hostile remarks about Jewish readers in
                  the surrounding text. Those are their polemical judgments;
                  BibleMap does not adopt them. The full contexts remain linked
                  so that these excerpts can be read critically.
                </p>
                {sources.map((source) => (
                  <section id={`source-${source.id}`} key={source.id} className={styles.sourceRecord}>
                    <h3>{source.title}</h3>
                    <p>{source.locator}</p>
                    <p>{source.edition}</p>
                    <p>{source.limits}</p>
                    <p>{source.rights}</p>
                    <a href={source.url}>Read the letter in context</a>{" · "}
                    <a href={JONAH_LETTERS.find((letter) => letter.sourceId === source.id)?.scanUrl}>
                      Inspect the printed page
                    </a>
                    <p>Source checked {source.checkedAt}.</p>
                  </section>
                ))}
                <p>
                  Scripture is unchanged from the locally pinned WEB edition.
                  <a href={chapter4.sourceUrl}> Read the publisher’s Jonah 4</a>.
                  The 48 verses of Jonah retain their existing validation.
                </p>
                <p>Editorial bridges are a sourced draft awaiting human review. No reconstructed setting, plant image or historical audio is used.</p>
              </div>
            </details>
            <nav className={styles.onward} aria-label="Continue exploring">
              <Link prefetch={false} href="/human-story/paths/a-word-crosses-centuries/">Follow a word across centuries</Link>
              <Link prefetch={false} href="/human-story/rashi-radak/">Two Jewish readings of Jonah’s ending</Link>
            </nav>
          </div>
        </div>
      </article>
    </HumanStoryFrame>
  );
}
