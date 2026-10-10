"use client";

import { useId } from "react";
import {
  beatKindLabel,
  claimKindLabel,
  sourceTypeLabel,
  type ClaimKind,
  type HistoricalContext,
} from "@/domain/historical-context";
import { historicalSourcesByIds } from "@/content/historical-sources";
import "./world-around.css";

export function WorldAround({ context }: { context: HistoricalContext | null }) {
  const headingId = useId();
  if (!context) return null;

  const sources = historicalSourcesByIds(context.sourceIds);
  const claimKinds = uniqueClaimKinds(context);

  return (
    <section
      className="world-around"
      aria-labelledby={headingId}
      data-context-id={context.id}
      data-confidence={context.confidence}
    >
      <div className="world-around-kicker">World around this moment</div>
      <h3 id={headingId} className="world-around-heading">
        {context.region}
      </h3>
      <p className="world-around-period">{context.periodLabel}</p>

      <p className="world-around-narrative">{context.narrative}</p>

      {context.beats.length > 0 && (
        <dl className="world-around-beats">
          {context.beats.map((beat) => (
            <div key={`${beat.kind}-${beat.claimKind}`} className="world-around-beat">
              <dt>
                {beatKindLabel(beat.kind)}
                <span className="world-around-claim" data-kind={beat.claimKind}>
                  {claimKindLabel(beat.claimKind)}
                </span>
              </dt>
              <dd>{beat.text}</dd>
            </div>
          ))}
        </dl>
      )}

      {context.change && (
        <p className="world-around-change">
          <span>What changed</span>
          {" "}
          {context.change}
        </p>
      )}

      {context.uncertainty && (
        <p className="world-around-uncertainty" role="note">
          <span>Uncertain</span>
          {" "}
          {context.uncertainty}
        </p>
      )}

      {context.chronologyNote && (
        <p className="world-around-chrono" role="note">
          <span>Chronology</span>
          {" "}
          {context.chronologyNote}
        </p>
      )}

      <div className="world-around-layers" aria-label="Kinds of claim in this note">
        {claimKinds.map((kind) => (
          <span key={kind} className="world-around-layer" data-kind={kind}>
            {claimKindLabel(kind)}
          </span>
        ))}
      </div>

      <details className="world-around-sources">
        <summary>
          Sources <span>({sources.length})</span>
        </summary>
        {sources.length === 0 ? (
          <p className="world-around-sources-empty">No followable sources are attached.</p>
        ) : (
          <ol>
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
                <div className="world-around-source-meta">
                  {source.author}
                  {source.institution ? ` · ${source.institution}` : ""}
                  {source.published ? ` · ${source.published}` : ""}
                  {" · "}
                  {sourceTypeLabel(source.sourceType)}
                </div>
                <p>{source.supports}</p>
              </li>
            ))}
          </ol>
        )}
      </details>
    </section>
  );
}

function uniqueClaimKinds(context: HistoricalContext): ClaimKind[] {
  const seen = new Set<ClaimKind>();
  const kinds: ClaimKind[] = [];
  const consider = (kind: ClaimKind) => {
    if (seen.has(kind)) return;
    seen.add(kind);
    kinds.push(kind);
  };
  consider(context.confidence);
  for (const beat of context.beats) consider(beat.claimKind);
  return kinds;
}
