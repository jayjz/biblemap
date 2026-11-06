import Link from "next/link";
import type { Metadata } from "next";
import { HumanStoryFrame } from "@/features/human-story/HumanStoryFrame";
import { WORLDS } from "@/features/human-story/worlds";
import { VISITOR_HUMAN_GRAPH as HUMAN_GRAPH } from "@/content/visitor-human-story";
import { ConnectedExplorer, type ExplorerEntry } from "@/features/human-story/ConnectedExplorer";
import { PathPreview } from "@/features/human-story/PathPreview";
import { ArtworkImage } from "@/features/human-story/ArtworkImage";
import { FeaturedEncounters } from "./FeaturedEncounters";
import actions from "./action-link.module.css";
import styles from "@/features/human-story/human-story.module.css";

const collectionInvitations = {
  stories: { description: "Scripture, from the first garden to the early Church.", action: "Read Scripture" },
  witnesses: { description: "Jesus and the biblical world in other people’s records.", action: "Read the accounts" },
  saints: { description: "Faith lived in particular bodies and places.", action: "Meet the saints" },
  atlas: { description: "Places, civilizations, journeys and the material things that remain.", action: "Locate the stories" },
  voices: { description: "Theology, philosophy, language and art in conversation.", action: "Meet the interpreters" },
};

export const humanStoryMetadata: Metadata = {
  title: "The Human Story — BibleMap",
  description:
    "Follow Scripture into a connected world of human lives, places, historical witnesses, art and ideas.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://biblemap-pink.vercel.app/" },
  openGraph: {
    title: "The Human Story — BibleMap",
    description: "Follow Scripture into a connected world of human lives, places, historical witnesses, art and ideas.",
    type: "website",
    url: "https://biblemap-pink.vercel.app/",
    images: [{
      url: "https://biblemap-pink.vercel.app/media/nineveh-depth/jonah-vine.webp",
      width: 749,
      height: 579,
      alt: "Jonah Under the Gourd Vine. Later Christian art, Cleveland Museum of Art, CC0.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Human Story — BibleMap",
    description: "Follow Scripture into a connected world of human lives, places, historical witnesses, art and ideas.",
    images: ["https://biblemap-pink.vercel.app/media/nineveh-depth/jonah-vine.webp"],
  },
};

export default function HumanStoryHome() {
  const featured = [
    "jonah",
    "perpetua",
    "romanus",
    "james",
    "thomas",
    "augustine",
    "pliny",
    "genesis-in-paint",
  ];
  // Curated destinations may stand alone; discovery must not invent graph evidence.
  const readings: ExplorerEntry[] = HUMAN_GRAPH.entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    kind: entry.kind,
    worlds: entry.worlds,
    era: entry.era,
    searchText: [entry.title, entry.subtitle, entry.introduction,
      ...entry.entityIds.map((id) => HUMAN_GRAPH.entities.find((entity) => entity.id === id)?.name ?? ""),
    ].join(" "),
  }));
  readings.push({
    id: "thomas",
    title: "Thomas: The Witness",
    subtitle: "John’s account of absence, testimony and encounter",
    kind: "scripture",
    worlds: ["stories"],
    era: "John 20:24–29",
    searchText: "Thomas witness John 20 absence testimony doubt encounter confession Gospel of Thomas sayings manuscripts",
  });
  const entries = readings.sort((a, b) => {
    const rank = (id: string) =>
      featured.includes(id) ? featured.indexOf(id) : featured.length;
    return rank(a.id) - rank(b.id);
  });
  return (
    <HumanStoryFrame>
      <section className={styles.opening} aria-labelledby="portal-title">
        <div className={styles.openingText}>
          <p className={styles.intro}>Scripture. Lives. A connected world.</p>
          <h1 id="portal-title">
            The human
            <br />
            story.
          </h1>
          <p className={styles.lede}>
            An ancient story opens onto a city. A city leads to a life. A life
            leaves a question for someone centuries later.
          </p>
          <p className={styles.sublede}>
            Explore the human story through a biblical worldview.
          </p>
          <a className={`${styles.primaryLink} ${actions.action} ${actions.primary}`} href="#encounters">
            Meet Perpetua & Romanus
          </a>
          <Link
            prefetch={false}
            className={styles.quietLink}
            href="/jonah/#jonah-1-calling"
          >
            Or begin with the book of Jonah
          </Link>
        </div>
        <div className={styles.weave}>
          <svg
            className={styles.weaveLines}
            viewBox="0 0 700 650"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M80 80C650 50 650 480 60 530M180 10C20 180 630 240 570 630M650 50C340 90 230 440 650 550"
              stroke="currentColor"
            />
            <circle cx="80" cy="80" r="5" fill="currentColor" />
            <circle cx="60" cy="530" r="5" fill="currentColor" />
            <circle cx="570" cy="630" r="5" fill="currentColor" />
          </svg>
          <p className={styles.weaveLabel}>One story, many afterlives</p>
          <figure className={styles.heroArt}>
            <ArtworkImage
              src="/media/nineveh-depth/jonah-vine.webp"
              width={749}
              height={579}
              alt="Marble Jonah reclining beneath a broad-leaved plant, a later Christian artistic interpretation."
              priority
            />
            <figcaption>
              <span>Jonah Under the Gourd Vine</span>
              <br />
              280–290 CE. Later Christian art.
              <br />
              <Link
                prefetch={false}
                href="https://www.clevelandart.org/art/1965.239"
              >
                Cleveland Museum of Art, 1965.239 · CC0
              </Link>
            </figcaption>
          </figure>
          <Link
            prefetch={false}
            className={styles.weaveNote}
            href="/jonah/#jonah-4-shade"
          >
            <span>The biblical text</span>
            <strong>A prophet sits outside a city.</strong>
            <span>
              Read Jonah 4:5–11 <b aria-hidden="true">↗</b>
            </span>
          </Link>
        </div>
      </section>
      <FeaturedEncounters />
      <section
        id="paths"
        className={styles.paths}
        aria-labelledby="paths-title"
      >
        <div className={styles.sectionHeading}>
          <h2 id="paths-title">Follow a thread.</h2>
          <p>Begin somewhere particular. See where it leads.</p>
        </div>
        <PathPreview />
      </section>
      <section className={styles.artSpread} aria-labelledby="art-spread-title">
        <figure>
          <ArtworkImage
            src="/media/approved/michelangelo-creation-of-adam.jpg"
            width={1280}
            height={855}
            alt="Michelangelo’s fresco of a reclining Adam and a reaching Creator, with surrounding figures and the full supplied frame visible."
          />
          <figcaption>
            Michelangelo Buonarroti, The Creation of Adam, c. 1511. Sistine
            Chapel. Later artistic reception of Genesis.{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Creaci%C3%B3n_de_Ad%C3%A1n.jpg">
              Public-domain reproduction · source & rights
            </a>
            .
          </figcaption>
        </figure>
        <div>
          <p>Scripture / Art / Architecture</p>
          <h2 id="art-spread-title">
            A beginning,
            <br />
            painted again.
          </h2>
          <p>
            The biblical text has a life in the imagination. Look at what a
            later artist makes visible, then return to what the chapter actually
            says.
          </p>
          <Link prefetch={false} className={actions.action} href="/human-story/genesis-in-paint/">
            Look at Genesis on a chapel ceiling{" "}
          </Link>
        </div>
      </section>
      <section className={styles.worlds} aria-labelledby="worlds-title">
        <div className={styles.sectionHeading}>
          <h2 id="worlds-title">Five ways into one world.</h2>
          <p>A person can belong to more than one story.</p>
        </div>
        <div className={styles.worldGrid}>
          {WORLDS.map((world) => (
            <article id={world.id} className={styles.world} key={world.id}>
              <Link className={styles.worldLink} prefetch={false} href={`/human-story/worlds/${world.id}/`}>
                <h3>{world.name}</h3>
                <p>{collectionInvitations[world.id].description}</p>
                <span className={styles.collectionAction}>{collectionInvitations[world.id].action}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section
        className={styles.paths}
        id="discover"
        aria-labelledby="readings-title"
      >
        <div className={styles.sectionHeading}>
          <h2 id="readings-title">Choose a reading.</h2>
          <p>Open a story, or preview where it connects.</p>
        </div>
        <ConnectedExplorer
          entries={entries}
          connections={HUMAN_GRAPH.connections.map(
            ({ id, from, to, kind, label }) => ({ id, from, to, kind, label }),
          )}
        />
      </section>
      <section
        className={styles.sourceNote}
        aria-labelledby="source-note-title"
      >
        <h2 id="source-note-title">
          Look closer. Ask what kind of source it is.
        </h2>
        <p>
          A biblical passage, a hostile Roman account, a saint’s memory and an
          artist’s vision each ask to be read differently. Follow their sources,
          dates and limits as you explore.
        </p>
        <details>
          <summary>About this exploration</summary>
          <p>
            This no-index design study gathers sourced editorial drafts for
            review. Historical evidence, Scripture, interpretation, reception
            and legend retain their own identities. Existing Scripture and
            release-review gates remain in force.
          </p>
        </details>
      </section>
    </HumanStoryFrame>
  );
}
