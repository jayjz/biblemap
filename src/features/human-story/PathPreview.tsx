import Link from "next/link";
import { HUMAN_PATHS } from "@/content/human-story-paths";
import { HUMAN_GRAPH } from "@/content/human-story";
import styles from "./human-story.module.css";

export function PathPreview() {
  return <div className={styles.pathGrid}>{HUMAN_PATHS.map((path, index) => <article className={`${styles.path} ${index === 0 ? styles.pathFeatured : ""}`} key={path.id}>
    <p>{path.worlds}</p><h3>{path.title}</h3><p>{path.description}</p>
    <ol className={styles.pathStops} aria-label={`Reading order for ${path.title}`}>{path.stops.map(stop => <li key={stop.entryId}>{HUMAN_GRAPH.entries.find(entry => entry.id === stop.entryId)?.title}</li>)}</ol>
    <Link prefetch={false} href={`/human-story/paths/${path.id}/`}>Follow this thread <span aria-hidden="true">↗</span></Link>
  </article>)}</div>;
}
