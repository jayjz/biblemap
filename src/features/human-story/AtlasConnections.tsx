import Link from "next/link";
import styles from "./human-story.module.css";

export function AtlasConnections() {
  return (
    <section
      className={styles.atlasConnections}
      aria-labelledby="atlas-connections-title"
    >
      <div>
        <h2 id="atlas-connections-title">
          The same ground.
          <br />
          Different human worlds.
        </h2>
        <p>
          Start with a city, then choose a time and an account. These are
          city-scale orientations, not reconstructed historical routes.
        </p>
      </div>
      <div className={styles.cityLinks}>
        <article>
          <h3>Nineveh</h3>
          <p>A biblical city. A surviving tablet. A later artist’s Jonah.</p>
          <Link prefetch={false} href="/human-story/nineveh/">
            Read the city and its sources
          </Link>
          <Link
            prefetch={false}
            href="/explore/?place=nineveh&from=jonah-3-mercy"
          >
            Locate Nineveh
          </Link>
        </article>
        <article>
          <h3>Rome</h3>
          <p>Tacitus’s imperial account and a chapel ceiling in another age.</p>
          <Link prefetch={false} href="/human-story/mediterranean/">
            Read across the centuries
          </Link>
          <Link
            prefetch={false}
            href="/explore/?lat=41.88987&lng=12.49169&zoom=6"
          >
            Orient to Rome
          </Link>
        </article>
        <article>
          <h3>Carthage</h3>
          <p>Perpetua’s Passion and Augustine’s remembered city.</p>
          <Link prefetch={false} href="/human-story/perpetua/">
            Read Perpetua & Felicity
          </Link>
          <Link
            prefetch={false}
            href="/explore/?lat=36.85306&lng=10.32306&zoom=6"
          >
            Orient to Carthage
          </Link>
        </article>
      </div>
      <p className={styles.atlasCredits}>
        Rome and Carthage coordinates:{" "}
        <a href="https://pleiades.stoa.org/places/423025">
          Roma, Pleiades 423025
        </a>{" "}
        (L. Quilici, S. Quilici Gigli and contributors);{" "}
        <a href="https://pleiades.stoa.org/places/314921">
          Carthago, Pleiades 314921
        </a>{" "}
        (R. B. Hitchner and contributors). CC BY 3.0; representative points
        rounded for orientation. Nineveh retains the existing sourced Atlas
        location.
      </p>
    </section>
  );
}
