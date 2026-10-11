"use client";

import { useEffect, useRef, useState } from "react";
import { canRenderMedia, mayPublishMedia, isInterpretiveClass, isProductionReadyMedia, mediaClassLabel, publicationFlags, type CuratedMediaAsset } from "@/domain/media";
import { MediaProvenancePlate } from "@/features/media/MediaProvenancePlate";

const ATMOSPHERES: Record<string, { label: string; reference: string }> = {
  "jonah-1-calling": { label: "Warm light and a still horizon", reference: "Jonah 1:1–2" },
  "jonah-1-escape": { label: "An open horizon over dark water", reference: "Jonah 1:3" },
  "jonah-1-storm-wind": { label: "Crossing lines of wind and water", reference: "Jonah 1:4–6" },
  "jonah-1-storm-lots": { label: "Dark water beneath a narrowing light", reference: "Jonah 1:7–10" },
  "jonah-1-storm-sea": { label: "Layered waves beneath a dark sky", reference: "Jonah 1:11–16" },
  "jonah-1-depths": { label: "Fading light in deep water", reference: "Jonah 1:17" },
  "jonah-2-prayer": { label: "A narrow shaft of light in deep blue water", reference: "Jonah 2:1–9" },
  "jonah-2-shore": { label: "A pale horizon where water meets land", reference: "Jonah 2:10" },
  "jonah-3-return": { label: "Warm earth and an opening in the distance", reference: "Jonah 3:1–4" },
  "jonah-3-mercy": { label: "A widening circle of light over warm earth", reference: "Jonah 3:5–10" },
  "jonah-4-anger": { label: "A harsh sun over a dry horizon", reference: "Jonah 4:1–4" },
  "jonah-4-shade": { label: "A fading patch of shade on warm earth", reference: "Jonah 4:5–10" },
  "jonah-4-question": { label: "An open horizon beneath a quiet sky", reference: "Jonah 4:11" },
};

export function StoryArtwork({ asset, sceneId, reviewOnly = false }: { asset?: CuratedMediaAsset; sceneId?: string; reviewOnly?: boolean }) {
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const failed = Boolean(asset && failedPath === asset.localPath);
  const atmosphere = ATMOSPHERES[sceneId ?? ""];
  const visible = Boolean(asset && (reviewOnly ? canRenderMedia(asset) : mayPublishMedia(asset)) && !failed);
  if (!visible) {
    if ((sceneId === "jonah-4-question" || sceneId === "jonah-1-storm-lots") && !asset) return null;
    return <figure className="story-atmosphere-frame">
      <div className={`story-atmosphere story-atmosphere--${sceneId?.replace(/^jonah-\d-/, "") ?? "default"}`} role="img" aria-label={`${atmosphere?.label ?? "Atmospheric visual composition"}. Abstract study, not a historical reconstruction.`}>
        <div className="story-horizon" aria-hidden="true" />
        <svg className="story-water-lines" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-40 236 Q100 204 260 236 T640 231 M-30 266 Q120 235 290 269 T650 260 M-40 304 Q100 273 280 310 T650 295 M-40 347 Q110 307 300 353 T650 336" />
        </svg>
        {failed && <span className="story-atmosphere-note">Artwork unavailable. The passage remains readable.</span>}
      </div>
      <figcaption>{atmosphere?.reference && <span>{atmosphere.reference} <span aria-hidden="true">·</span> </span>}Atmospheric study</figcaption>
    </figure>;
  }
  const ready = isProductionReadyMedia(asset!);
  const unresolved = publicationFlags(asset!).includes("unresolved-rights");
  const kind = isInterpretiveClass(asset!.class) ? "not archaeological evidence" : "contextual image, not a depiction of Jonah";
  return <figure className={`story-artwork${ready ? "" : " story-artwork--provisional"}${sceneId === "jonah-4-question" ? " story-artwork--quiet" : ""}`}>
    {/* Local file only. No remote substitution on failure. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img ref={image => {
      // A server-rendered image can fail before hydration attaches onError.
      if (image?.complete && image.naturalWidth === 0) setFailedPath(asset!.localPath);
    }} src={asset!.localPath} alt={asset!.altText || asset!.title} loading="lazy" decoding="async" onError={() => setFailedPath(asset!.localPath)} />
    <figcaption>
      <p className="story-artwork-caption">{asset!.title}<br /><small>{asset!.creator?.trim() || "Maker not recorded"} · {asset!.creationDate?.trim() || "Date not recorded"}</small></p>
      <details className="story-artwork-credits"><summary>About this artwork & rights</summary>
        <p>{asset!.caption}</p>
        <p><small>{mediaClassLabel(asset!.class)} · {kind}</small></p>
        {!ready && <p className="story-preview-note">{unresolved ? "Visual review · rights unresolved · not for publication" : reviewOnly ? "Visual review · not approved for publication" : "Provisional placement · image rights verified · editorial review pending"}</p>}
        <MediaProvenancePlate asset={asset!} />
      </details>
    </figcaption>
  </figure>;
}

export function AudioTrack({ asset, label, transcript }: { asset: CuratedMediaAsset; label: string; transcript?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    const pause = () => audio?.pause();
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pause);
    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pause);
    };
  }, []);
  if (!isProductionReadyMedia(asset)) return null;
  const play = async (replay = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (replay) audio.currentTime = 0;
    audio.volume = volume;
    audio.muted = muted;
    try { await audio.play(); setFailed(false); }
    catch { setFailed(true); setPlaying(false); }
  };
  return <section className="story-audio" aria-label={label}>
    <audio ref={audioRef} src={asset.localPath} preload="none"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />
    <p className="story-eyebrow">{label}</p>
    <div className="story-audio-controls">
      <button type="button" onClick={() => playing ? audioRef.current?.pause() : void play()}>{playing ? "Pause" : "Play"} {label.toLowerCase()}</button>
      <button type="button" onClick={() => void play(true)}>Replay {label.toLowerCase()}</button>
      <button type="button" aria-pressed={muted} onClick={() => { setMuted(!muted); if (audioRef.current) audioRef.current.muted = !muted; }}>Mute {label.toLowerCase()}</button>
      <label>{label} volume <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => { const v = Number(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v; }} /></label>
    </div>
    {failed && <p role="status">Audio unavailable. You can continue reading or try Play again.</p>}
    {transcript && <details><summary>Narration transcript</summary><p>{transcript}</p></details>}
    <details><summary>{label} credits and rights</summary><MediaProvenancePlate asset={asset} /></details>
  </section>;
}
