"use client";

import { useEffect, useRef, useState } from "react";
import { isProductionReadyMedia, type CuratedMediaAsset } from "@/domain/media";
import { MediaProvenancePlate } from "@/features/media/MediaProvenancePlate";

export function StoryArtwork({ asset }: { asset?: CuratedMediaAsset }) {
  const [failed, setFailed] = useState(false);
  if (!asset || !isProductionReadyMedia(asset) || failed) return (
    <div className="story-atmosphere" aria-label="Artwork placeholder">
      <div className="story-horizon" aria-hidden="true" />
      <span className="story-atmosphere-label">{failed ? "Artwork unavailable · reading continues" : "An open canvas"}</span>
      <span className="story-atmosphere-note">{failed ? "The passage remains available below." : "Artwork awaits the author’s selection"}</span>
    </div>
  );
  return <figure className="story-artwork">
    {/* Local, rights-reviewed asset only. No remote substitution on failure. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={asset.localPath} alt={asset.altText} onError={() => setFailed(true)} />
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
