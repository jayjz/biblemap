import Link from "next/link";
import { HUMAN_GRAPH } from "@/content/human-story";
import { INTERIOR_SOURCES } from "@/content/human-story-interiors";
import { HumanStoryFrame } from "./HumanStoryFrame";
import { PrisonStage } from "./PrisonStage";
import styles from "./prison.module.css";

export function PerpetuaEncounter() {
  const source = HUMAN_GRAPH.sources.find(
    (item) => item.id === "passion-perpetua",
  );
  if (!source) throw new Error("Perpetua encounter requires its source record");
  return (
    <HumanStoryFrame activeWorld="saints">
      <article className={styles.encounter} data-entry="perpetua">
        <header className={styles.titleBar}>
          <div>
            <p>Perpetua & Felicity</p>
            <h1>The Prison</h1>
          </div>
          <p>
            Carthage · traditionally dated 203 CE
            <br />
            An encounter with the transmitted <cite>Passion</cite>
          </p>
        </header>
        <PrisonStage />
        <section
          className={styles.beyond}
          id="beyond-prison"
          aria-labelledby="beyond-title"
        >
          <div className={styles.place}>
            <p>Place the account</p>
            <h2 id="beyond-title">
              Carthage is a city.
              <br />
              This is one surviving story.
            </h2>
            <p>
              The Atlas can orient us to Carthage. It does not establish the
              prison’s location or appearance, or independently verify this
              account.
            </p>
            <Link
              prefetch={false}
              href="/explore/?lat=36.85306&lng=10.32306&zoom=6"
            >
              Orient to Carthage in the Atlas
            </Link>
            <p className={styles.small}>
              City reference:{" "}
              <a href="https://pleiades.stoa.org/places/314921">
                Pleiades contributors, Carthago 314921
              </a>
              , CC BY 3.0. Modern city-scale orientation; no ancient route or
              exact site implied.
            </p>
          </div>
          <div className={styles.outward} id="comparison">
            <p>Other ways of telling</p>
            <Link prefetch={false} href="/human-story/pliny/">
              Pliny writes to an emperor
            </Link>
            <p>
              A Roman official’s correspondence, from another time and region.
              An editorial comparison, not the cause of this trial.
            </p>
            <Link prefetch={false} href="/human-story/augustine/">
              Augustine: a life reread
            </Link>
            <p>
              A different first-person work, addressed to God. Compare how a
              life reaches its reader.
            </p>
            <Link prefetch={false} href="/jonah/#jonah-1-calling">
              Return to Scripture: read Jonah
            </Link>
            <p>
              The biblical narrative retains its own voice. This return does not
              assert a direct dependence of the Passion on Jonah.
            </p>
          </div>
        </section>
        <section
          className={styles.evidence}
          aria-labelledby="prison-evidence-title"
        >
          <h2 id="prison-evidence-title">
            The work that carries these voices.
          </h2>
          <p>
            The Passion’s frame attributes §§3–10 to Perpetua and §§11–13 to
            Saturus. A narrator introduces the prisoners and tells the ending.
            These are parts of one transmitted work, not a collection of
            independently recovered testimonies.
          </p>
          <details id="source-passion-perpetua">
            <summary>Edition, provenance & limits</summary>
            <p>
              <a href={source.url}>{source.title} · open the source edition</a>
            </p>
            <p>{source.edition}</p>
            <p>{source.limits}</p>
            <p>{source.rights}</p>
            <p>
              Checked {source.checkedAt}. Exact scene sections appear beside
              each passage summary.
            </p>
            <p>
              The narrative’s traditional 203 CE setting follows the linked
              edition’s modern introduction. We have not inspected an autograph
              or independently verified each narrated event.
            </p>
          </details>
          <details id="source-passion-wallis">
            <summary>Quoted passages · translation & limits</summary>
            {INTERIOR_SOURCES.filter(
              (item) => item.id === "passion-wallis",
            ).map((item) => (
              <div key={item.id}>
                <p>
                  <a href={item.url}>{item.title}</a>
                </p>
                <p>{item.locator}</p>
                <p>{item.edition}</p>
                <p>{item.limits}</p>
                <p>{item.rights}</p>
              </div>
            ))}
          </details>
          <details>
            <summary>About the drawing and this encounter</summary>
            <p>
              AI-authored original vector illustration by Codex for this design
              review. Its forms describe narrated relationships, contact,
              separation and a change of voice. It is not an authentic artifact,
              portrait, prison plan or historical reconstruction.
            </p>
            <p>
              Original editorial summaries remain drafts for PR #36, pending
              human historical and theological review. The separation scene adds
              credited Wallis translation excerpts and a later devotional mosaic
              with its own image-source details. No audio or synthesized voices
              are used.
            </p>
          </details>
        </section>
      </article>
    </HumanStoryFrame>
  );
}
