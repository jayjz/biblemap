import type { PrisonScene } from "@/content/perpetua-encounter";
import styles from "./prison.module.css";

/** Original editorial illustration of narrated relationships, never a prison reconstruction. */
export function PrisonDiagram({
  scene,
  selected,
}: {
  scene: PrisonScene;
  selected: string;
}) {
  const apart = scene.id === "separation";
  const ended = scene.id === "handover";
  return (
    <figure className={styles.diagram} data-person={selected}>
      <svg
        viewBox="0 0 480 430"
        role="img"
        aria-labelledby={`diagram-${scene.id}-title diagram-${scene.id}-desc`}
      >
        <title id={`diagram-${scene.id}-title`}>
          {`${scene.name}: a relationship in the account`}
        </title>
        <desc id={`diagram-${scene.id}-desc`}>
          {`${scene.visualDescription} Original modern abstraction, not a portrait or a plan of the prison.`}
        </desc>
        <path
          className={styles.outerTrace}
          d="M402 38C154-20 25 100 37 260c6 91 93 150 211 141 89-7 144-70 168-129"
        />
        <path
          className={styles.innerTrace}
          d="M361 91C206 11 85 109 89 233c3 98 82 148 161 126 64-17 111-72 116-129"
        />
        {scene.id === "tribunal" && (
          <path className={styles.authorityTrace} d="M24 58h432v310H24z" />
        )}
        {scene.voice === "vision" && (
          <ellipse
            className={styles.visionTrace}
            cx="232"
            cy="217"
            rx="202"
            ry="171"
          />
        )}
        <path
          className={styles.mother}
          data-empty={ended}
          d="M235 91c-64 0-103 58-101 122 2 70 47 121 100 121 36 0 57-18 71-43-42 8-79-24-82-69-3-42 18-78 56-93-12-24-26-38-44-38Z"
        />
        {!ended && (
          <circle
            className={styles.child}
            cx={apart ? 399 : 282}
            cy={apart ? 266 : 215}
            r={scene.voice === "vision" ? 13 : 28}
          />
        )}
        {apart ? (
          <path className={styles.broken} d="M269 267h35m59 0h14" />
        ) : (
          !ended && (
            <path className={styles.contact} d="M226 248c22 23 48 17 61-4" />
          )
        )}
        {ended && (
          <path
            className={styles.contact}
            d="M304 210h104m-14-12 14 12-14 12"
          />
        )}
        <circle className={styles.point} cx="39" cy="260" r="5" />
      </svg>
      <figcaption>
        <span>
          {scene.id === "felicity"
            ? "Felicity & her daughter"
            : ended
              ? "The writing ends. The account continues."
              : scene.voice === "vision"
                ? "A reported vision & its interpretation"
                : "Perpetua & her child"}
        </span>
        <span>Original relationship drawing. Not historical architecture.</span>
      </figcaption>
    </figure>
  );
}
