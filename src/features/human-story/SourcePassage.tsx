import {
  INTERIOR_PASSAGES,
  INTERIOR_SOURCES,
  type InteriorPassageId,
} from "@/content/human-story-interiors";
import styles from "./interior.module.css";
import { SAINT_SOURCES } from "@/content/human-story-saints";

export function SourcePassage({ id, articulate = false }: { id: InteriorPassageId; articulate?: boolean }) {
  const passage = INTERIOR_PASSAGES[id];
  const source = [...INTERIOR_SOURCES, ...SAINT_SOURCES].find(
    (item) => item.id === passage.sourceId,
  );
  if (!source) throw new Error(`Missing source for interior passage: ${id}`);
  const turn = articulate && id === "childSeparation" ? passage.text.indexOf(" And even as God willed it,") : -1;
  const href =
    id === "childEarlier"
      ? "https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_I"
      : source.url;
  return (
    <figure className={styles.passage} data-passage={id}>
      <blockquote cite={href}>{turn < 0 ? passage.text : <><span data-account-movement="request">{passage.text.slice(0, turn)}</span>{" "}<span data-account-movement="interpretation">{passage.text.slice(turn + 1)}</span></>}</blockquote>
      <figcaption>
        <a href={href}>{passage.locator}</a>
      </figcaption>
    </figure>
  );
}
