"use client";

import { useId, useState, type ReactNode } from "react";
import { Pause, Play, X } from "lucide-react";
import {
  isEvidenceClass,
  isInterpretiveClass,
  laterCreationDisclaimer,
  mediaClassLabel,
  resolveMediaSrc,
  type CuratedMediaAsset,
} from "@/domain/media";
import type { FocusPhase } from "@/scenes/motion";
import { MOTION, motionTokens } from "@/scenes/motion";
import { usePrefersReducedMotion } from "@/features/media/usePrefersReducedMotion";
import "./cinematic.css";

export interface RelatedMoment {
  name: string;
  ussher_year: number;
}

export interface CinematicCanvasProps {
  open: boolean;
  phase: FocusPhase;
  media: CuratedMediaAsset | null;
  eventName: string;
  eventPlace?: string;
  eventYear?: number;
  eventType?: string;
  scripture?: { text: string; reference: string };
  /** Curated editorial summary. Preferred over the raw database description. */
  summary?: string;
  /** Raw parquet / database description. Never rendered in full. */
  rawDescription?: string;
  whyItMatters?: string;
  filmGrain?: boolean;
  parchmentMode?: boolean;
  onClose: () => void;
  isPlayingAudio?: boolean;
  narrationReady?: boolean;
  audioVolume?: number;
  onPlayNarration?: () => void;
  onStopNarration?: () => void;
  onVolumeChange?: (volume: number) => void;
  relatedEvents?: readonly RelatedMoment[];
  onSelectRelated?: (moment: RelatedMoment) => void;
}

const TITLE_MAX = 72;
const SUMMARY_MAX_SENTENCES = 2;
const SUMMARY_MAX_CHARS = 280;
const CURATED_MAX_CHARS = 520;

/**
 * Clamp a database field that is sometimes a paragraph posing as a title.
 * Real titles pass through; walls of text become a single short heading.
 */
export function displayHeading(name: string, maxChars = TITLE_MAX): string {
  const cleaned = name.replace(/\s+/g, " ").trim();
  if (!cleaned) return "Biblical moment";
  const looksLikeParagraph =
    cleaned.length > maxChars || /[.!?]/.test(cleaned.slice(0, Math.min(cleaned.length, maxChars)));
  if (!looksLikeParagraph) return cleaned;
  const firstClause = cleaned.match(/^[\s\S]{1,90}?(?=[.!?;]|[,:—–-] |\s+\(|$)/)?.[0] ?? cleaned.slice(0, maxChars);
  const trimmed = firstClause.replace(/[,;:.\-–—\s]+$/g, "").trim();
  if (trimmed.length >= 12 && trimmed.length < cleaned.length) {
    return trimmed.length > maxChars ? `${trimmed.slice(0, maxChars - 1).trimEnd()}…` : `${trimmed}…`;
  }
  if (cleaned.length <= maxChars) return cleaned;
  const slice = cleaned.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 24 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

/**
 * Aggressive editorial truncation for raw database copy.
 * Curated summaries may be slightly longer; raw descriptions are capped at two sentences.
 */
export function truncateEditorial(
  text: string,
  maxSentences = SUMMARY_MAX_SENTENCES,
  maxChars = SUMMARY_MAX_CHARS
): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  const clipped = sentences && sentences.length > 0
    ? sentences.slice(0, maxSentences).join(" ").trim()
    : cleaned;
  if (clipped.length <= maxChars) return clipped;
  const slice = clipped.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

export function editorialCopy(summary?: string, rawDescription?: string): string {
  const curated = summary?.replace(/\s+/g, " ").trim();
  if (curated) {
    if (curated.length <= CURATED_MAX_CHARS) return curated;
    return truncateEditorial(curated, 4, CURATED_MAX_CHARS);
  }
  return truncateEditorial(rawDescription ?? "", SUMMARY_MAX_SENTENCES, SUMMARY_MAX_CHARS);
}

function formatYear(year?: number): string | null {
  if (typeof year !== "number" || !Number.isFinite(year)) return null;
  const rounded = Math.round(year);
  return rounded < 0 ? `${Math.abs(rounded)} BC` : `${rounded} AD`;
}

export function CinematicCanvas({
  open,
  phase,
  media,
  eventName,
  eventPlace,
  eventYear,
  eventType,
  scripture,
  summary,
  rawDescription,
  whyItMatters,
  filmGrain = false,
  parchmentMode = false,
  onClose,
  isPlayingAudio = false,
  narrationReady = false,
  audioVolume = 0.7,
  onPlayNarration,
  onStopNarration,
  onVolumeChange,
  relatedEvents = [],
  onSelectRelated,
}: CinematicCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const tokens = motionTokens(reducedMotion);
  const captionId = useId();
  const titleId = useId();

  if (!open && phase === "idle") return null;

  const visiblePhase: FocusPhase =
    open && phase === "idle" ? "dimming" : phase;

  const interpretive = media ? isInterpretiveClass(media.class) : false;
  const evidence = media ? isEvidenceClass(media.class) : false;
  const heading = displayHeading(eventName);
  const story = editorialCopy(summary, rawDescription);
  const verseText = scripture?.text ? truncateEditorial(scripture.text, 2, 240) : "";
  const year = formatYear(eventYear);
  const related = uniqueRelated(relatedEvents).slice(0, 5);

  return (
    <div
      className="cinematic-root"
      data-open={open ? "true" : "false"}
      data-phase={visiblePhase}
      data-reduced={reducedMotion ? "true" : "false"}
      data-grain={filmGrain ? "true" : "false"}
      data-parchment={parchmentMode ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        ["--cinematic-dim-ms" as string]: `${tokens.dimMs}ms`,
        ["--cinematic-reveal-ms" as string]: `${tokens.revealMs}ms`,
        ["--cinematic-caption-delay" as string]: `${tokens.captionDelayMs}ms`,
        ["--cinematic-kenburns-ms" as string]: `${MOTION.kenBurnsMs}ms`,
      }}
    >
      <div
        className="cinematic-dim cinematic-dim-interactive"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="cinematic-stage">
        <button
          type="button"
          className="cinematic-close"
          onClick={onClose}
          aria-label="Close focus mode"
        >
          <X className="cinematic-close-icon" aria-hidden="true" />
        </button>

        <figure className="cinematic-frame" aria-labelledby={captionId}>
          <div className="cinematic-mat">
            {media ? (
              <ArtworkImage
                key={media.id}
                asset={media}
                fallback={
                  <TypographicFallback
                    eventPlace={eventPlace}
                    scripture={verseText ? { text: verseText, reference: scripture?.reference ?? "" } : undefined}
                  />
                }
              />
            ) : (
              <TypographicFallback
                eventPlace={eventPlace}
                scripture={verseText ? { text: verseText, reference: scripture?.reference ?? "" } : undefined}
              />
            )}
          </div>

          {media && (
            <figcaption id={captionId} className="cinematic-caption">
              <div className="cinematic-badge-row">
                <span
                  className="cinematic-badge"
                  data-kind={evidence ? "evidence" : interpretive ? "interpretive" : "other"}
                >
                  {mediaClassLabel(media.class)}
                </span>
                {interpretive && (
                  <span className="cinematic-badge" data-kind="interpretive">
                    Not archaeological evidence
                  </span>
                )}
              </div>
              <h2 className="cinematic-title">{media.title}</h2>
              <p className="cinematic-meta">
                {media.creator}, {media.creationDate}
                <br />
                {media.sourceInstitution}
              </p>
              {laterCreationDisclaimer(media) && (
                <p className="cinematic-disclaimer">{laterCreationDisclaimer(media)}</p>
              )}
              <p className="cinematic-body">{media.caption}</p>
              <div className="cinematic-source-row">
                <a
                  href={media.sourceRecordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source record
                </a>
                <span className="cinematic-license">{media.license}</span>
                <span className="cinematic-license">{media.requiredAttribution}</span>
              </div>
            </figcaption>
          )}
        </figure>

        <aside className="cinematic-story" aria-label="Event story">
          <header className="cinematic-story-header">
            <h2 id={titleId} className="cinematic-story-title">{heading}</h2>
            <div className="cinematic-story-meta">
              {year && <span>{year}</span>}
              {eventPlace && (
                <>
                  {year && <span aria-hidden="true">·</span>}
                  <span>{eventPlace}</span>
                </>
              )}
              {eventType && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{eventType}</span>
                </>
              )}
            </div>
          </header>

          {(onPlayNarration || onStopNarration) && (
            <div className="cinematic-listen-row">
              <button
                type="button"
                className="cinematic-listen"
                data-ready={narrationReady && !isPlayingAudio ? "true" : "false"}
                onClick={() => (isPlayingAudio ? onStopNarration?.() : onPlayNarration?.())}
                aria-label={isPlayingAudio ? "Pause narration" : "Play narration"}
              >
                {isPlayingAudio ? (
                  <Pause className="cinematic-listen-icon" aria-hidden="true" />
                ) : (
                  <Play className="cinematic-listen-icon" aria-hidden="true" />
                )}
                <span>{isPlayingAudio ? "Pause" : "Listen"}</span>
              </button>
              {onVolumeChange && (
                <label className="cinematic-volume">
                  <span className="cinematic-volume-label">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioVolume}
                    onChange={(event) => onVolumeChange(Number(event.target.value))}
                    aria-label="Narration volume"
                  />
                </label>
              )}
            </div>
          )}

          {verseText && (
            <blockquote className="cinematic-verse">
              <p>“{verseText}”</p>
              {scripture?.reference && <cite>— {scripture.reference}</cite>}
            </blockquote>
          )}

          {story && (
            <div className="cinematic-story-copy">
              <div className="cinematic-story-label">
                {summary?.trim() ? "Summary" : "Account"}
              </div>
              <p>{story}</p>
            </div>
          )}

          {whyItMatters?.trim() && (
            <div className="cinematic-matters">
              <div className="cinematic-story-label">Why this matters</div>
              <p>{truncateEditorial(whyItMatters, 3, 320)}</p>
            </div>
          )}

          {related.length > 0 && (
            <div className="cinematic-related">
              <div className="cinematic-story-label">Related events</div>
              <div className="cinematic-related-row">
                {related.map((moment) => (
                  <button
                    key={moment.name}
                    type="button"
                    className="cinematic-related-card"
                    onClick={() => onSelectRelated?.(moment)}
                  >
                    <span className="cinematic-related-name">{displayHeading(moment.name, 42)}</span>
                    <span className="cinematic-related-year">{formatYear(moment.ussher_year)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function uniqueRelated(events: readonly RelatedMoment[]): RelatedMoment[] {
  const seen = new Set<string>();
  const unique: RelatedMoment[] = [];
  for (const event of events) {
    if (!event?.name || seen.has(event.name)) continue;
    seen.add(event.name);
    unique.push(event);
  }
  return unique;
}

function ArtworkImage({
  asset,
  fallback,
}: {
  asset: CuratedMediaAsset;
  fallback: ReactNode;
}) {
  const [status, setStatus] = useState<"pending" | "loaded" | "missing">("pending");
  const src = resolveMediaSrc(asset);
  const remoteFallback = asset.originalAssetUrl;

  if (status === "missing") return <>{fallback}</>;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`cinematic-image${status === "loaded" ? " is-loaded" : ""}`}
        src={src}
        alt={asset.altText}
        onLoad={() => setStatus("loaded")}
        onError={(event) => {
          if (remoteFallback && event.currentTarget.src !== remoteFallback) {
            event.currentTarget.src = remoteFallback;
            return;
          }
          setStatus("missing");
        }}
      />
      <div className="cinematic-grain" aria-hidden="true" />
    </>
  );
}

function TypographicFallback({
  eventPlace,
  scripture,
}: {
  eventPlace?: string;
  scripture?: { text: string; reference: string };
}) {
  return (
    <div className="cinematic-fallback">
      <div className="cinematic-fallback-kicker">
        {eventPlace || "Biblical lands"} · no reviewed visual
      </div>
      {scripture?.text ? (
        <>
          <p className="cinematic-fallback-verse">“{scripture.text}”</p>
          {scripture.reference && (
            <div className="cinematic-fallback-ref">— {scripture.reference}</div>
          )}
        </>
      ) : (
        <p className="cinematic-fallback-note">
          No approved artwork or artifact has been attached to this moment. The
          map and the biblical text remain the primary witnesses.
        </p>
      )}
      <p className="cinematic-fallback-note">
        Missing media is left empty on purpose. An unrelated image is never
        substituted.
      </p>
    </div>
  );
}

export function pickPrimaryMedia(media: readonly CuratedMediaAsset[] | undefined): CuratedMediaAsset | null {
  if (!media || media.length === 0) return null;
  const evidence = media.find((asset) => isEvidenceClass(asset.class));
  return evidence ?? media[0] ?? null;
}
