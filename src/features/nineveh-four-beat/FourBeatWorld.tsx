"use client";
import Image from "next/image";
import { useState } from "react";

export function FourBeatWorld({ treatment }: { treatment: "a" | "b" | "c" }) {
  const [imageState, setImageState] = useState("loading");
  return <figure className="fb-world">
    {treatment === "a" ? <>
      <div className="fb-panorama" data-image-state={imageState}>
        <Image src="/review-assets/four-beat-panorama.webp" width={1672} height={941} alt="" unoptimized priority onLoad={() => setImageState("ready")} onError={() => setImageState("error")} />
      </div>
      <figcaption>AI-generated interpretive reconstruction. City, river course and viewpoint are imagined.</figcaption>
      {imageState !== "ready" && <p className="fb-image-status" role="status">{imageState === "error" ? "The landscape is unavailable. All Scripture and discoveries remain readable." : "Preparing the landscape. You can begin reading."}</p>}
    </> : treatment === "b" ? <>
      <Image className="fb-illuminated" src="/media/nineveh-depth/jonah-vine.webp" width={749} height={579} alt="Marble Jonah reclining under a vine; later Christian artistic reception." unoptimized priority />
      <figcaption>Jonah Under the Gourd Vine, 280–290 CE. Unknown sculptor, Anatolia. Cleveland Museum of Art, 1965.239. CC0. Later Christian reception, not ancient Nineveh.</figcaption>
    </> : <>
      <svg className="fb-map" viewBox="0 0 800 800" role="img" aria-labelledby="fb-map-title fb-map-desc">
        <title id="fb-map-title">Nineveh beside the Tigris flood plain</title>
        <desc id="fb-map-desc">A schematic locator places Nineveh east of the Tigris flood plain, opposite modern Mosul. Not a surveyed river course or ancient city plan.</desc>
        <defs><pattern id="fb-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#718d8980" /></pattern></defs>
        <rect width="800" height="800" fill="#243a3c" /><rect x="30" y="30" width="740" height="740" fill="url(#fb-grid)" />
        <path d="M270 -20C420 140 210 250 300 400S490 580 360 830" fill="none" stroke="#719c9d" strokeWidth="40" />
        <path d="M270 -20C420 140 210 250 300 400S490 580 360 830" fill="none" stroke="#c1d2c4" strokeWidth="2" />
        <circle cx="470" cy="355" r="55" fill="none" stroke="#e7d1a1" strokeDasharray="3 7" />
        <a href="/explore/?place=nineveh&amp;from=jonah-3-mercy" aria-label="Explore Nineveh in the existing atlas"><circle cx="470" cy="355" r="7" fill="#f2d9a4" /><path d="M482 355H660" stroke="#f2d9a4" />
        <text x="490" y="325" fill="#f6ebd4" fontSize="36" fontFamily="Georgia,serif">Nineveh</text>
        <text x="490" y="385" fill="#d6d9c9" fontSize="17">36.36° N · 43.16° E</text>
        </a>
        <text x="100" y="450" fill="#e3e5d8" fontSize="26" fontFamily="Georgia,serif">Tigris</text>
        <text x="78" y="540" fill="#d6d9c9" fontSize="18">Modern Mosul</text>
        <path d="M700 145V65m-10 17 10-17 10 17" stroke="#e7d1a1" fill="none" strokeWidth="2" /><text x="692" y="48" fill="#e7d1a1" fontSize="18">N</text>
      </svg>
      <figcaption>Schematic geography, not a measured city plan. Representative point and spatial relationship: Pleiades 874621, contributors, CC BY 3.0. River geometry is illustrative.</figcaption>
    </>}
  </figure>;
}
