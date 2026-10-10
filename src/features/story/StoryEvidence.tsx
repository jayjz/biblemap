import { authoredLabel, type Passage, type StoryDocument, type StoryScene } from "@/domain/story";

export function PassageSource({ passage, story }: { passage: Passage; story: StoryDocument }) {
  const source = story.sources.find(s => s.id === passage.sourceId);
  return <details className="story-disclosure">
    <summary>Translation, sources & notes</summary>
    <div className="story-disclosure-body">
      <p><strong>Scripture · World English Bible</strong></p>
      <p>{passage.rightsStatement} The text is reproduced in full for this passage.</p>
      {source && <><a href={source.url} target="_blank" rel="noreferrer">Read the publisher’s source ↗</a><p>{source.supports}</p></>}
      <a href={passage.rightsUrl} target="_blank" rel="noreferrer">Publisher’s rights statement ↗</a>
      {passage.notes.length > 0 && <><h4>Translator notes</h4><ul>{passage.notes.map((n, i) => <li key={`${n.verse}-${i}`}>Verse {n.verse}: {n.text}</li>)}</ul></>}
      <p className="story-source-version">Pinned edition: {passage.sourceVersion}. Retrieved {passage.retrievedAt}.</p>
    </div>
  </details>;
}

export function StoryEvidence({ story, scene }: { story: StoryDocument; scene: StoryScene }) {
  const places = story.geography.filter(g => scene.geographyIds.includes(g.placeId));
  const claims = story.claims.filter(c => scene.claimIds.includes(c.id));
  return <>
    {places.length > 0 && <details className="story-disclosure">
      <summary>Explore the places in this passage</summary>
      <div className="story-disclosure-body">
        <p className="story-eyebrow">Textual geography</p>
        <p>Names from the passage. This schematic does not locate them or trace a verified journey.</p>
        <svg className="story-place-diagram" viewBox="0 0 640 100" role="img" aria-label={`Places named in this passage: ${places.map(p => p.label).join(", ")}. No geographic scale or route.`}>
          {places.map((place, i) => <g key={place.placeId} transform={`translate(${640 / (places.length + 1) * (i + 1)},48)`}>
            <circle r="7" fill="none" stroke="currentColor" strokeWidth="1" />
            <text y="35" textAnchor="middle" fill="currentColor">{place.label}</text>
          </g>)}
        </svg>
        {places.map(place => <details key={place.placeId} className="story-place">
          <summary>{place.label} · identification {place.status === "unknown" ? "not established here" : place.status}</summary>
          <p className="story-placeholder">{authoredLabel(place.explanation)}</p>
          {place.candidates.map(candidate => <div key={candidate.id}><h4>{candidate.label}</h4>{candidate.evidence.map(ref => <p key={`${ref.sourceId}-${ref.locator}`}>{ref.locator}: {ref.supports} Limits: {ref.doesNotEstablish} <a href={story.sources.find(s => s.id === ref.sourceId)?.url} target="_blank" rel="noreferrer">Source ↗</a></p>)}</div>)}
        </details>)}
      </div>
    </details>}
    <details className="story-disclosure">
      <summary>Historical context & evidence</summary>
      <div className="story-disclosure-body">
        {claims.length === 0 ? <><p>No reviewed historical claims are attached to this scene.</p><p className="story-placeholder">[AUTHOR: historical context and interpretive framing]</p></> : claims.map(claim => <article key={claim.id}>
          <p className="story-eyebrow">{claim.basis.replaceAll("-", " ")} · {claim.certainty}</p>
          <p>{authoredLabel(claim.statement)}</p>
          {claim.interpretiveLens && <p>Interpretive lens: {claim.interpretiveLens}</p>}
          {claim.uncertainty && <p>Uncertainty: {claim.uncertainty}</p>}
          <ul>{claim.evidence.map(ref => <li key={`${ref.sourceId}-${ref.locator}`}><a href={story.sources.find(s => s.id === ref.sourceId)?.url} target="_blank" rel="noreferrer">{ref.locator} ↗</a><p>Supports: {ref.supports}</p><p>Does not establish: {ref.doesNotEstablish}</p></li>)}</ul>
        </article>)}
      </div>
    </details>
  </>;
}
