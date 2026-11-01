import {
  INTERIOR_PASSAGES,
  INTERIOR_SOURCES,
  type InteriorPassageId,
} from "@/content/human-story-interiors";
import styles from "./interior.module.css";
import { SAINT_SOURCES } from "@/content/human-story-saints";

export function SourcePassage({ id }: { id: InteriorPassageId }) {
  const passage = INTERIOR_PASSAGES[id];
  const source = [...INTERIOR_SOURCES, ...SAINT_SOURCES].find(
    (item) => item.id === passage.sourceId,
  );
  if (!source) throw new Error(`Missing source for interior passage: ${id}`);
  const href =
    id === "childEarlier"
      ? "https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_I"
      : source.url;
  return (
    <figure className={styles.passage} data-passage={id}>
      <blockquote cite={href}>{passage.text}</blockquote>
      <figcaption>
        <a href={href}>{passage.locator}</a>
      </figcaption>
    </figure>
  );
}
