import Link from "next/link";
import { HUMAN_PATHS } from "@/content/human-story-paths";
import { HUMAN_GRAPH } from "@/content/human-story";
import styles from "./human-story.module.css";
import actions from "./action-link.module.css";

const invitations: Record<string, string> = {
  "a-word-crosses-centuries": "From Nineveh and Jonah to marble, translation and two Jewish readings.",
  "a-name-under-pressure": "Gospel testimony, a Roman historian, a governor’s letters and a prison account.",
  "a-life-in-another-life": "A painted beginning leads to Genesis, Augustine’s Confessions and Teresa.",
};

export function PathPreview() {
  return (
    <div className={styles.pathGrid}>
      {HUMAN_PATHS.map((path, index) => (
        <article
          className={`${styles.path} ${index === 0 ? styles.pathFeatured : ""}`}
          key={path.id}
        >
          <p>{path.worlds}</p>
          <h3>{path.title}</h3>
          <p>{invitations[path.id] ?? path.description}</p>
          <details className={styles.pathContents}>
            <summary>{path.stops.length} readings in this thread</summary>
            <ol
            className={styles.pathStops}
            aria-label={`Reading order for ${path.title}`}
          >
            {path.stops.map((stop) => (
              <li key={stop.entryId}>
                {
                  HUMAN_GRAPH.entries.find((entry) => entry.id === stop.entryId)
                    ?.title
                }
              </li>
            ))}
          </ol>
          </details>
          <Link className={actions.action} aria-label={`Follow this thread: ${path.title}`} prefetch={false} href={`/human-story/paths/${path.id}/`}>
            Follow this thread
          </Link>
        </article>
      ))}
    </div>
  );
}
