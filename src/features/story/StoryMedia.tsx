"use client";

import { useEffect, useRef, useState } from "react";
import { isProductionReadyMedia, type CuratedMediaAsset } from "@/domain/media";
import { MediaProvenancePlate } from "@/features/media/MediaProvenancePlate";

const ATMOSPHERES: Record<string, { label: string; reference: string }> = {
  "jonah-1-calling": { label: "Warm light and a still horizon", reference: "Jonah 1:1–2" },
  "jonah-1-escape": { label: "An open horizon over dark water", reference: "Jonah 1:3" },
  "jonah-1-storm-wind": { label: "Crossing lines of wind and water", reference: "Jonah 1:4–6" },
  "jonah-1-storm-lots": { label: "Dark water beneath a narrowing light", reference: "Jonah 1:7–10" },
  "jonah-1-storm-sea": { label: "Layered waves beneath a dark sky", reference: "Jonah 1:11–16" },
  "jonah-1-depths": { label: "Fading light in deep water", reference: "Jonah 1:17" },
};

export function StoryArtwork({ asset, sceneId }: { asset?: CuratedMediaAsset; sceneId?: string }) {
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const failed = Boolean(asset && failedPath === asset.localPath);
  const atmosphere = ATMOSPHERES[sceneId ?? ""];
  if (!asset || !isProductionReadyMedia(asset) || failed) return <figure className="story-atmosphere-frame">
    <div className={`story-atmosphere story-atmosphere--${sceneId?.replace(/^jonah-1-/, "") ?? "default"}`} role="img" aria-label={`${atmosphere?.label ?? "Atmospheric visual composition"}. Abstract study, not a historical reconstruction.`}>
      <div className="story-horizon" aria-hidden="true" />
      <svg className="story-water-lines" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-40 236 Q100 204 260 236 T640 231 M-30 266 Q120 235 290 269 T650 260 M-40 304 Q100 273 280 310 T650 295 M-40 347 Q110 307 300 353 T650 336" />
      </svg>
      {failed && <span className="story-atmosphere-note">Artwork unavailable. The passage remains readable.</span>}
    </div>
    <figcaption>{atmosphere?.reference && <span>{atmosphere.reference} <span aria-hidden="true">·</span> </span>}Atmospheric study</figcaption>
  </figure>;
  return <figure className="story-artwork">
    {/* Local, rights-reviewed asset only. No remote substitution on failure. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={asset.localPath} alt={asset.altText} loading="lazy" decoding="async" onError={() => setFailedPath(asset.localPath)} />
    <figcaption><MediaProvenancePlate asset={asset} /></figcaption>
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
