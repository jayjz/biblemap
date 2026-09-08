"use client";

import { useEffect, useId, useState } from "react";
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

export interface CinematicCanvasProps {
  open: boolean;
  phase: FocusPhase;
  media: CuratedMediaAsset | null;
  eventName: string;
  eventPlace?: string;
  scripture?: { text: string; reference: string };
  filmGrain?: boolean;
  parchmentMode?: boolean;
  onClose: () => void;
}

export function CinematicCanvas({
  open,
  phase,
  media,
  eventName,
  eventPlace,
  scripture,
  filmGrain = false,
  parchmentMode = false,
  onClose,
}: CinematicCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const tokens = motionTokens(reducedMotion);
  const captionId = useId();
  const [imageState, setImageState] = useState<"pending" | "loaded" | "missing">("pending");

  const src = media ? resolveMediaSrc(media) : null;
  const remoteFallback = media?.originalAssetUrl ?? null;

  useEffect(() => {
    setImageState(media ? "pending" : "missing");
  }, [media?.id, src]);

  if (!open && phase === "idle") return null;

  const visiblePhase: FocusPhase =
    open && phase === "idle" ? "dimming" : phase;

  const showArtwork = Boolean(media) && imageState !== "missing";
  const interpretive = media ? isInterpretiveClass(media.class) : false;
  const evidence = media ? isEvidenceClass(media.class) : false;

  return (
    <div
      className="cinematic-root"
      data-open={open ? "true" : "false"}
      data-phase={visiblePhase}
      data-reduced={reducedMotion ? "true" : "false"}
      data-grain={filmGrain ? "true" : "false"}
      data-parchment={parchmentMode ? "true" : "false"}
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
        <figure className="cinematic-frame" aria-labelledby={captionId}>
          <div className="cinematic-mat">
            {showArtwork && media && src ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={`cinematic-image${imageState === "loaded" ? " is-loaded" : ""}`}
                  src={src}
                  alt={media.altText}
                  onLoad={() => setImageState("loaded")}
                  onError={(event) => {
                    if (remoteFallback && event.currentTarget.src !== remoteFallback) {
                      event.currentTarget.src = remoteFallback;
                      return;
                    }
                    setImageState("missing");
                  }}
                />
                <div className="cinematic-grain" aria-hidden="true" />
              </>
            ) : (
              <TypographicFallback
                eventName={eventName}
                eventPlace={eventPlace}
                scripture={scripture}
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
      </div>
    </div>
  );
}

function TypographicFallback({
  eventName,
  eventPlace,
  scripture,
}: {
  eventName: string;
  eventPlace?: string;
  scripture?: { text: string; reference: string };
}) {
  return (
    <div className="cinematic-fallback">
      <div className="cinematic-fallback-kicker">
        {eventPlace || "Biblical lands"} · no reviewed visual
      </div>
      <h2 className="cinematic-fallback-title">{eventName}</h2>
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
