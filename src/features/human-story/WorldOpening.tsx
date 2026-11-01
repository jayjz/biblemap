import Link from "next/link";
import type { WorldId } from "@/domain/human-story";
import { HumanArtwork } from "./HumanArtwork";
import { InteriorArtwork } from "./InteriorArtwork";
import styles from "./interior.module.css";

const invitations: Record<WorldId, string> = {
  stories: "A small object. A story larger than its frame.",
  witnesses: "Read what an official asks when lives are in his hands.",
  saints:
    "A mother and child, held together in an image. Separated in the account.",
  atlas: "A story can be read. A tablet can be turned in the hand.",
  voices: "The distance between a passage and the image we remember.",
};

export function WorldOpening({
  world,
}: {
  world: { id: WorldId; name: string; description: string };
}) {
  return (
    <header className={`${styles.worldOpening} ${styles[world.id]}`}>
      <div className={styles.worldHeading}>
        <Link prefetch={false} href="/human-story/">
          The human story
        </Link>
        <h1>{world.name}</h1>
        <p className={styles.worldInvitation}>{invitations[world.id]}</p>
        <p className={styles.worldDescription}>{world.description}</p>
        <a className={styles.startHere} href="#world-encounter">
          Look inside <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className={styles.worldImage}>
        {world.id === "witnesses" && (
          <InteriorArtwork id="rome-forum" priority />
        )}
        {world.id === "saints" && (
          <InteriorArtwork id="perpetua-mosaic" priority />
        )}
        {world.id === "stories" && <HumanArtwork id="jonah-vine" />}
        {world.id === "atlas" && <HumanArtwork id="flood-tablet" />}
        {world.id === "voices" && (
          <HumanArtwork id="michelangelo-creation-of-adam" />
        )}
      </div>
    </header>
  );
}
