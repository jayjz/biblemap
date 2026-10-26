"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motionTokens } from "@/scenes/motion";
import { usePrefersReducedMotion } from "@/features/media/usePrefersReducedMotion";

// Provenance and the complete generation prompt are retained in artwork.json.
// This component is available only through the opt-in creative review route.
export default function NinevehEnvironment({ beat, paused }: { beat: string; paused: boolean }) {
  const world = useRef<HTMLDivElement>(null);
  const foreground = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const [imageState, setImageState] = useState<"loading" | "ready" | "error">("loading");
  const reduce = usePrefersReducedMotion();
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
    animations.current.forEach(animation => { if (paused) animation.pause(); else animation.play(); });
  }, [paused]);
  useEffect(() => {
    const targets = [
      [world.current, beat === "city" ? "scale(1) translate(0, 0)" : beat === "mercy" ? "scale(1.045) translate(-1%, 1%)" : "scale(1.015) translate(-2%, 0)"],
      [foreground.current, beat === "city" ? "translate(0, 0)" : beat === "mercy" ? "translate(2%, 2%)" : "translate(-3%, -1%)"],
    ] as const;
    const starts = targets.map(([element]) => element ? getComputedStyle(element).transform : "none");
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    targets.forEach(([element, target], index) => {
      if (!element) return;
      element.style.transform = target;
      if (!reduce && typeof element.animate === "function") {
        const animation = element.animate([{ transform: starts[index] }, { transform: target }], {
          duration: motionTokens(false).cameraMs, easing: motionTokens(false).easeCinematic,
        });
        if (pausedRef.current) animation.pause();
        animations.current.push(animation);
      }
    });
    return () => { animations.current.forEach(animation => animation.cancel()); animations.current = []; };
  }, [beat, reduce]);

  return <>
    <div ref={world} className="nineveh-world" aria-hidden="true" data-environment={imageState}>
      {imageState !== "error" && <Image className="nineveh-city-mass" src="/review-assets/nineveh-landscape.webp" width={1536} height={1024} alt="" priority unoptimized onLoad={() => setImageState("ready")} onError={() => setImageState("error")} />}
    </div>
    <div ref={foreground} className="nineveh-foreground" aria-hidden="true" />
    {imageState !== "ready" && <p className="nineveh-visual-status" role="status">{imageState === "error" ? "The landscape is unavailable. Nineveh remains our place; the full passage is available below." : "Preparing the landscape. You can begin reading."}</p>}
  </>;
}
