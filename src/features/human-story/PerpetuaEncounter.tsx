import Link from "next/link";
import { VISITOR_HUMAN_GRAPH as HUMAN_GRAPH } from "@/content/visitor-human-story";
import { INTERIOR_SOURCES, INTERIOR_PASSAGES } from "@/content/human-story-interiors";
import { PRISON_SCENES, PERPETUA_CONTEXT_SOURCES } from "@/content/perpetua-encounter";
import { projectVisitorPrison } from "@/domain/visitor-prison";
import { HumanStoryFrame } from "./HumanStoryFrame";
import { PrisonStage } from "./PrisonStage";
import { ArtworkImage } from "./ArtworkImage";
import { InteriorArtwork } from "./InteriorArtwork";
import { SeparationPassage } from "./InteriorEncounters";
import { SourcePassage } from "./SourcePassage";
import { SeparationReading } from "./SeparationReading";
import { separationReadingText } from "@/domain/separation-reading";
import styles from "./prison.module.css";

export function PerpetuaEncounter() {
  const source = HUMAN_GRAPH.sources.find(
    (item) => item.id === "passion-perpetua",
  );
  if (!source) throw new Error("Perpetua encounter requires its source record");
  const endingResearch = <details className={styles.researchDesk} id="ending-research"><summary>Sources, place & further reading</summary>
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
            <summary>About the imagery and this encounter</summary>
            <p>
              The vision’s image is original AI-generated interpretive artwork,
              directed by Codex for BibleMap in 2026. Its arena, shifting shadows,
              light and golden fruit respond to §10. It is not an authentic artifact,
              likeness, prison plan or verified view of a vision. The hearing’s
              typography places reported appeals across one field; it does not
              reconstruct an official transcript.
            </p>
            <p>The separation reading places an opaque reading surface across Cassatt’s intact print when the request is refused. It remains there when the attributed account describes relief. This is a modern artistic composition, not a reconstruction of events or evidence of the child’s later life.</p>
            <p>
              Original editorial summaries and transitions remain drafts, pending
              human historical and theological review. Credited Wallis translation
              excerpts, artistic parallels and the later devotional mosaic
              retain their own source details. The final movement distinguishes
              the end of the attributed writing from the narrator’s ending.
              No audio or synthesized voices
              are used.
            </p>
          </details>
          <details id="source-carthage-art"><summary>Carthage · an imagined city</summary><InteriorArtwork id="perpetua-carthage" /><p>The city painting is AI-generated, directed by Codex for BibleMap in 2026. Its streets, harbour, buildings and light are invented. It supplies atmosphere, not archaeological evidence or an exact ancient plan.</p></details>
          <details id="source-prison-art"><summary>Confinement · an imagined room</summary><InteriorArtwork id="perpetua-room" /><p>This AI-generated painting is a modern visual metaphor for confinement. The room, window, vessel and cloth do not recover the location or appearance of Perpetua’s prison.</p></details>
          <details id="source-perpetua-context"><summary>Carthage, social status & sacrifice</summary>{Object.entries(PERPETUA_CONTEXT_SOURCES).map(([id, context]) => <div key={id}><p><a href={context.url}>{context.title}</a></p><p>{context.locator}</p><p>{context.limit}</p></div>)}</details>
          <details id="source-felicity-art"><summary>Kollwitz · the print’s own world</summary><InteriorArtwork id="kollwitz-mothers" /><p>This twentieth-century work is an artistic parallel to the gathering of companions and care for a child. It is not a depiction of Felicity or evidence of the prison. Its place in Kollwitz’s War imagery belongs to its own historical world, not to Christian martyr reception.</p><a href="https://www.kollwitz.de/sammlung/krieg/blatt-6">Kollwitz Museum Köln · The Mothers, sheet 6 of War</a></details>
          <details id="source-vision-art"><summary>A contest before waking · generated artwork and limits</summary><InteriorArtwork id="perpetua-vision" /><p>Generated with OpenAI’s built-in image tool. No third-party reference image was supplied. The architecture is invented; the shadows do not identify an ethnicity or recover Perpetua’s appearance. The composition interprets reported imagery rather than supplying evidence that it occurred.</p></details>
          <details id="source-cassatt-art"><summary>Cassatt · image, rights & artistic comparison</summary><InteriorArtwork id="cassatt-kiss" /><p>The moving reading surface is an original interface composition by Codex. It covers the whole print without editing either figure. This pairing awaits human editorial review.</p></details>
          <details id="source-perpetua-art">
            <summary>The mosaic · provenance and artistic interpretation</summary>
            <InteriorArtwork id="perpetua-mosaic" />
            <p>The complete image is retained. Changing its scale and surrounding space is an interface composition; no person has been removed from or added to the artwork.</p>
          </details>
        </section>
  </details>;
  return (
    <HumanStoryFrame activeWorld="saints" immersive footer={false}>
      <article className={styles.encounter} data-entry="perpetua">
        <header className={styles.entrance}>
          <div className={styles.entranceArt}><ArtworkImage src="/media/human-story/perpetua-carthage.webp" width={1536} height={1024} priority alt="An imagined Roman North African city beside the Mediterranean at dusk. AI-generated interpretive artwork, not an archaeological reconstruction of Carthage." /></div>
          <div className={styles.entranceCopy}>
            <h1>Perpetua <span>&</span><br />{" "}Felicity</h1>
            <p className={styles.entrancePlace}>Carthage · traditionally dated 203 CE</p>
            <p className={styles.entranceSubtitle}>Two women imprisoned for their Christian faith. One is nursing a son. The other is expecting a child.</p>
            <p className={styles.entranceStakes}>At their hearing, they will be asked to sacrifice.<br />Their refusal will lead to a sentence of death.</p>
            <a className={styles.enterStory} href="#perpetua-carthage">Begin in Carthage <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg></a>
            <p className={styles.readingTime}>A reading in seven movements · at your own pace</p>
          </div>
        <p className={styles.entranceCredit}>An imagined city · AI-generated artwork.<br />Not an archaeological reconstruction. <a href="#source-carthage-art">Image & source</a></p>
        </header>
        <div className={styles.accountThreshold}><p>We know them through <cite>The Passion of Perpetua and Felicity</cite>, a Christian account of imprisonment and death. It attributes a first-person narrative to Perpetua. A different narrator tells Felicity’s story and the ending. No original diary survives here; who composed these voices remains debated.</p><a href="#source-passion-perpetua">Meet the surviving source</a></div>
        <details className={styles.reviewNotice}><summary>About this encounter</summary><p>The source-backed editorial summaries and transitions are provisional, awaiting human historical and theological review. Ancient translated words are identified separately. Paintings of the city and room are disclosed AI-generated interpretations; later artworks are artistic parallels, not historical likenesses. No audio is used.</p></details>
        <PrisonStage endingResearch={endingResearch} scenes={projectVisitorPrison(PRISON_SCENES)} separationArtwork={<InteriorArtwork id="perpetua-mosaic" />} separationPassage={
          <SeparationReading text={separationReadingText(INTERIOR_PASSAGES.childEarlier.text, INTERIOR_PASSAGES.childSeparation.text)}>
            <SourcePassage id="childEarlier" />
            <SeparationPassage />
            <p>First, relief comes when the child can stay. Later, the account places relief after separation and attributes it to God’s will. The father’s reason for refusing the request is not given.</p>
            <p>Reading note · provisional commentary. This paragraph does not tell us the child’s later life.</p>
          </SeparationReading>
        } />
      </article>
    </HumanStoryFrame>
  );
}
