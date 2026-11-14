import registry from "@/content/lachish/sources.json";
import scripture from "@/content/lachish/scripture.json";
import manifest from "../../../public/media/lachish/manifest.json";
import { CLAIMS, type ClaimId, type LachishClaim } from "@/content/lachish/narrative";

export function ClaimText({ id, className }: { id: ClaimId; className?: string }) {
  const claim = CLAIMS[id];
  return <p className={className} data-claim={claim.id}>{claim.text}</p>;
}

export function ClaimNotes({ ids }: { ids: readonly ClaimId[] }) {
  return <details className="lachish-disclosure claim-notes"><summary>Follow the evidence</summary>{ids.map(id => {
    const claim: LachishClaim = CLAIMS[id];
    return <div key={id}><p><strong>{claim.category}</strong> · {claim.state === "INFERRED" ? "Editorial interpretation" : claim.state === "CONFLICTED" ? "Accounts differ" : claim.state === "UNRESOLVED" ? "Explanation unresolved" : "Source-supported summary"}</p><p>{claim.locator}</p>{claim.limits && <p>{claim.limits}</p>}<ul>{claim.sourceIds.map(sourceId => <li key={sourceId}><a href={`#source-${sourceId}`}>{registry.sources.find(source => source.id === sourceId)?.title}</a></li>)}</ul></div>;
  })}</details>;
}

export function ScriptureQuotation({ chapter, verse }: { chapter: string; verse: number }) {
  const source = scripture.chapters.find(item => item.id === chapter);
  const text = source?.verses.find(item => item.number === verse)?.text;
  if (!source || !text) throw new Error(`Missing pinned Lachish Scripture ${chapter}:${verse}`);
  return <figure className="lachish-scripture"><blockquote cite={source.sourceUrl}>{text}</blockquote><figcaption><a href={`#passage-${source.id}`}>{source.reference}:{verse}</a> · World English Bible</figcaption></figure>;
}

export function LachishSources() {
  return <section className="lachish-sources" id="sources" aria-labelledby="sources-title">
    <div className="lachish-section-heading"><span>THE SURVIVING RECORD</span><h2 id="sources-title">Look again. Follow a source.</h2><p>The biblical writings, Assyrian royal representations and excavated remains answer different questions. A second edition of an inscription is not a second independent witness.</p></div>
    <div className="source-columns">
      <div><h3>The complete biblical passages</h3><p>World English Bible · public domain. All five chapters are available here without JavaScript. Verse text is pinned to retained publisher snapshots.</p>{scripture.chapters.map(chapter => <details className="lachish-disclosure scripture-chapter" id={`passage-${chapter.id}`} key={chapter.id}><summary>{chapter.reference} <span>{chapter.verses.length} verses</span></summary><p><a href={chapter.sourceUrl}>Publisher text</a> · {chapter.translation}</p><div className="lachish-verses">{chapter.verses.map(verse => <p id={`${chapter.id}-v${verse.number}`} key={verse.number}><a href={`#${chapter.id}-v${verse.number}`} aria-label={`${chapter.reference}:${verse.number}`}>{verse.number}</a>{verse.text}</p>)}</div></details>)}</div>
      <div><h3>Objects, excavation & interpretation</h3>{registry.sources.map(source => <details className="lachish-disclosure" id={`source-${source.id}`} key={source.id}><summary>{source.title}</summary><p className="lachish-small">{source.category}</p><p>{source.institution}</p><p>{source.date}</p><p><strong>Where to look:</strong> {source.locator}</p><p><strong>Limits:</strong> {source.limits}</p><p><a href={source.url}>Open the original source ↗</a></p></details>)}</div>
    </div>
    <details className="lachish-disclosure media-provenance" id="media-provenance"><summary>Image provenance & reconstruction record</summary>{manifest.assets.map(asset => <div id={`asset-${asset.id}`} className="asset-record" key={asset.id}><h3>{asset.title}</h3><p>{asset.sourceInstitution} · {asset.class}</p><p>{asset.creator} · {asset.creationDate}</p><p>{asset.depictedPeriod}</p><p>{asset.requiredAttribution}. {asset.id !== "city" && <a href="https://creativecommons.org/licenses/by-sa/4.0/">License terms</a>}</p><p>{asset.historicalFit}</p><p>{asset.knownUncertainties.join(" ")}</p>{asset.originalAssetUrl && <p><a href={asset.sourceRecordUrl}>Photographer’s original file record ↗</a></p>}</div>)}<div className="asset-record"><h3>Spatial siege schematic</h3><p>Original BibleMap SVG, AI-assisted code, 12 November 2026. An interpretive reconstruction based on BM 124906 and the published discussion of the ramp and counter-ramp. No archaeological geometry or measured dimensions are used. All model shapes, spacing, engine workings and proportions are hypothetical.</p></div></details>
    <details className="lachish-disclosure"><summary>About this encounter</summary><p>This is a sourced editorial draft for human review. Historical summaries and interpretive artwork have not received human editorial approval. No named fictional inhabitants, invented speech, population totals or measured city reconstruction are used. The Lachish Letters belong to the later Babylonian period and are excluded from the 701 BC story.</p><p>The complete experience works in silence. Its transitions follow your choices; reduced-motion preferences remove animated transitions. No external media or data is fetched at runtime.</p><p><a href="/media/lachish/evidence.json">Download the machine-readable evidence ledger</a> · <a href="/media/lachish/manifest.json">Download image provenance</a></p></details>
  </section>;
}
