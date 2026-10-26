"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motionTokens } from "@/scenes/motion";
import { usePrefersReducedMotion } from "@/features/media/usePrefersReducedMotion";

// Provenance and the complete generation prompt are retained in artwork.json.
// This component is available only through the opt-in creative review route.
export default function NinevehEnvironment({ beat, paused, mode = "review" }: { beat: string; paused: boolean; mode?: "review" | "published" }) {
  const world = useRef<HTMLDivElement>(null);
  const foreground = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  // 2026-10-25: Published Nineveh uses a self-contained illustrative skyline, not the unapproved local matte painting.
  const published = mode === "published";
  const [imageState, setImageState] = useState<"loading" | "ready" | "error">(published ? "ready" : "loading");
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
    <div ref={world} className="nineveh-world" aria-hidden="true" data-environment={published ? "ready" : imageState}>
      {published ? (
        // Original SVG, deliberately nonspecific: no palace, gate, or topographic claim is implied.
        <svg className="nineveh-city-mass nineveh-illustration" viewBox="0 0 1440 850" preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">
          <defs>
            <linearGradient id="nineveh-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#203b47" />
              <stop offset="52%" stopColor="#607574" />
              <stop offset="83%" stopColor="#b49e78" />
              <stop offset="100%" stopColor="#b1a07f" />
            </linearGradient>
            <linearGradient id="nineveh-earth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9a8260" />
              <stop offset="100%" stopColor="#34423e" />
            </linearGradient>
            <linearGradient id="nineveh-water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#719191" />
              <stop offset="100%" stopColor="#294847" />
            </linearGradient>
          </defs>
          <rect width="1440" height="850" fill="url(#nineveh-sky)" />
          <path d="M0 465 Q220 441 421 465 T812 458 T1440 466 L1440 850 H0Z" fill="#8e8a71" opacity=".58" />
          <path d="M0 528 Q252 483 480 499 Q789 481 1440 511 L1440 850 H0Z" fill="url(#nineveh-earth)" />
          <g fill="#776951" opacity=".95">
            <path d="M171 481 L201 481 L201 457 L225 457 L225 475 L280 475 L280 446 L310 446 L310 471 L344 471 L344 457 L367 457 L367 479 L465 479 L465 465 L498 465 L498 491 L530 491 L530 507 L152 507 Z" />
            <path d="M182 497 L182 479 L516 479 L516 497 Z" fill="#afa080" opacity=".75" />
            <path d="M216 462 L216 435 L234 435 L234 457 L254 457 L254 466 M389 464 L389 442 L407 442 L407 478 M440 460 L440 451 L457 451 L457 480" fill="#7e7059" />
          </g>
          <g fill="#615b4b" opacity=".65">
            <rect x="264" y="434" width="43" height="43" />
            <rect x="313" y="451" width="44" height="27" />
            <rect x="358" y="462" width="37" height="20" />
            <rect x="418" y="447" width="43" height="34" />
            <rect x="475" y="463" width="48" height="29" />
          </g>
          <path d="M-50 694 Q180 574 336 601 Q545 635 652 710 Q740 769 1061 784 Q1250 799 1480 764 L1480 850 H-50 Z" fill="#7b7860" opacity=".84" />
          <path d="M-80 653 Q178 627 347 664 Q490 707 682 731 Q840 750 1032 768 Q1252 777 1470 711 L1480 781 Q1182 840 982 806 Q635 793 432 741 Q220 693 -80 735Z" fill="url(#nineveh-water)" opacity=".85" />
          <path d="M-40 782 Q165 735 365 769 Q600 811 815 804 L1440 775 L1440 850 H0Z" fill="#384c47" opacity=".94" />
          <path d="M720 756 Q887 740 1052 760 T1470 737 M66 667 Q241 646 369 682" stroke="#d2c19a" strokeWidth="3" fill="none" opacity=".22" />
        </svg>
      ) : imageState !== "error" ? (
        <Image className="nineveh-city-mass" src="/review-assets/nineveh-landscape.webp" width={1536} height={1024} alt="" priority unoptimized onLoad={() => setImageState("ready")} onError={() => setImageState("error")} />
      ) : null}
    </div>
    <div ref={foreground} className="nineveh-foreground" aria-hidden="true" />
    {!published && imageState !== "ready" && <p className="nineveh-visual-status" role="status">{imageState === "error" ? "The landscape is unavailable. Nineveh remains our place; the full passage is available below." : "Preparing the landscape. You can begin reading."}</p>}
  </>;
}
