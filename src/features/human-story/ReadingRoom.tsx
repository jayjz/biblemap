import Link from "next/link";
import type { HumanEntry } from "@/domain/human-story";
import {
  CONNECTION_LABELS,
  EVIDENCE_LABELS,
  connectionsFor,
} from "@/domain/human-story";
import { VISITOR_HUMAN_GRAPH as HUMAN_GRAPH } from "@/content/visitor-human-story";
import chapter4 from "@/content/scripture/web-jonah-4.json";
import { HumanStoryFrame } from "./HumanStoryFrame";
import { HumanArtwork } from "./HumanArtwork";
import { LetterEncounter, AugustineEncounter } from "./InteriorEncounters";
import { WORLDS } from "./worlds";
import styles from "./human-story.module.css";

export function ReadingRoom({ entry }: { entry: HumanEntry }) {
  const related = connectionsFor(HUMAN_GRAPH, entry.id);
  const sourceIds = new Set([
    ...(entry.id === "pliny" ? ["pliny-melmoth"] : []),
    ...entry.sourceIds,
    ...entry.sections.flatMap((section) => section.sourceIds),
    ...related.flatMap(({ connection }) => connection.sourceIds),
  ]);
  const sources = HUMAN_GRAPH.sources.filter((source) =>
    sourceIds.has(source.id),
  );
  return (
    <HumanStoryFrame>
      <article className={styles.reading} data-entry={entry.id}>
        <header className={styles.readingHeader}>
          <nav aria-label="Reading location" className={styles.breadcrumb}>
            <Link prefetch={false} href="/human-story/">
              The human story
            </Link>
            <span aria-hidden="true">/</span>
            {entry.worlds.map((id) => (
              <Link
                prefetch={false}
                key={id}
                href={`/human-story/worlds/${id}/`}
              >
                {WORLDS.find((world) => world.id === id)?.name}
              </Link>
            ))}
          </nav>
          <p className={styles.evidenceLabel}>{EVIDENCE_LABELS[entry.kind]}</p>
          <h1>{entry.title}</h1>
          <p className={styles.readingSubtitle}>{entry.subtitle}</p>
          <p className={styles.entryEra}>{entry.era}</p>
          <p className={styles.citation}>A reading in development. Editorial commentary and connections are provisional, awaiting human review; quoted source texts are identified separately.</p>
          {entry.reading && (
            <Link
              prefetch={false}
              className={styles.readOriginal}
              href={entry.reading.href}
            >
              {entry.reading.label} <span aria-hidden="true">↗</span>
            </Link>
          )}
        </header>
        {entry.id === "augustine" && <AugustineEncounter />}
        {entry.id === "pliny" && (
          <div className={styles.worldReadings}>
            <LetterEncounter />
          </div>
        )}
        <div className={styles.readingColumns}>
          <div className={styles.readingBody}>
            {entry.id === "jonah" && (
              <figure className={styles.scripture}>
                <blockquote>
                  {chapter4.verses.find((verse) => verse.number === 11)?.text}
                </blockquote>
                <figcaption>
                  <Link prefetch={false} href="/jonah/#jonah-4-question">
                    Jonah 4:11
                  </Link>{" "}
                  · World English Bible · Public domain
                </figcaption>
              </figure>
            )}
            <p className={styles.readingIntro}>{entry.introduction}</p>
            {entry.sections.map((section) => (
              <section
                id={section.id}
                key={section.id}
                className={styles.readingSection}
              >
                <h2>{section.title}</h2>
                {section.kind && (
                  <p className={styles.evidenceLabel}>
                    {EVIDENCE_LABELS[section.kind]}
                  </p>
                )}
                <p>{section.text}</p>
                <p className={styles.citation}>
                  {section.sourceIds.map((id) => (
                    <Link prefetch={false} href={`#source-${id}`} key={id}>
                      Source:{" "}
                      {
                        HUMAN_GRAPH.sources.find((source) => source.id === id)
                          ?.title
                      }
                    </Link>
                  ))}
                </p>
              </section>
            ))}
            <aside className={styles.question}>
              <p>A question to carry</p>
              <h2>{entry.question}</h2>
            </aside>
          </div>
          <aside
            className={styles.readingAside}
            aria-label="Art, place and connections"
          >
            {entry.imageId && <HumanArtwork id={entry.imageId} />}
            {entry.atlas && (
              <div className={styles.placeLink}>
                <h2>Put this story in a place.</h2>
                <Link prefetch={false} href={entry.atlas.href}>
                  {entry.atlas.label} <span aria-hidden="true">↗</span>
                </Link>
                <p>{entry.atlas.note}</p>
              </div>
            )}
            <section className={styles.related} aria-labelledby="related-title">
              <h2 id="related-title">Where this can lead</h2>
              {related.map(({ connection, entry: next }) => (
                <article
                  className={styles.relation}
                  key={connection.id}
                  data-connection={connection.id}
                >
                  <p>{CONNECTION_LABELS[connection.kind]}</p>
                  <h3>
                    <Link prefetch={false} href={`/human-story/${next.id}/`}>
                      {next.title}
                    </Link>
                  </h3>
                  <p>{connection.label}</p>
                  <details>
                    <summary>Why these are connected</summary>
                    <p>{connection.note}</p>
                    <p className={styles.citation}>
                      {connection.sourceIds.map((id) => (
                        <Link prefetch={false} href={`#source-${id}`} key={id}>
                          {
                            HUMAN_GRAPH.sources.find(
                              (source) => source.id === id,
                            )?.title
                          }
                        </Link>
                      ))}
                    </p>
                  </details>
                </article>
              ))}
            </section>
          </aside>
        </div>
        <section className={styles.sources} aria-labelledby="sources-title">
          <h2 id="sources-title">Sources & limits</h2>
          <p>
            Read the passage. Inspect the kind of evidence. Keep its limits in
            view.
          </p>
          {sources.map((source) => (
            <details id={`source-${source.id}`} key={source.id}>
              <summary>
                {source.title}{" "}
                <span>
                  —{" "}
                  {source.kind === "scholarship"
                    ? "Scholarship"
                    : EVIDENCE_LABELS[source.kind]}
                </span>
              </summary>
              <p>
                <Link prefetch={false} href={source.url}>
                  {source.title}: open source
                </Link>
              </p>
              <p>
                <strong>Where to look:</strong> {source.locator}
              </p>
              <p>{source.edition}</p>
              <p>
                <strong>Limits:</strong> {source.limits}
              </p>
              <p>{source.rights}</p>
              <p>Source checked {source.checkedAt}.</p>
            </details>
          ))}
          <details>
            <summary>About this reading</summary>
            <p>
              Sourced editorial draft for PR #36, awaiting human review.
              Connections are authored and individually classified. A comparison
              does not claim historical influence, and a later interpretation is
              not Scripture.
            </p>
          </details>
        </section>
      </article>
    </HumanStoryFrame>
  );
}
