import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BibleMap · 20s demo",
  description: "A twenty-second look at BibleMap journeys and the world around the story.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-[#f4ead3] flex flex-col items-center px-5 py-10">
      <p className="text-[11px] tracking-[0.22em] uppercase text-[#c5d4e8] mb-3">
        Product demo
      </p>
      <h1
        className="text-4xl md:text-5xl font-medium mb-2 text-center"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        BibleMap
      </h1>
      <p className="text-[#d6c7a6] text-sm md:text-base mb-8 text-center max-w-xl">
        Twenty seconds through the night atlas, the Exodus, Paul at Antioch, and Nazareth.
      </p>

      <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-[#c4a574]/30 shadow-[0_0_80px_rgba(0,0,0,0.55)] bg-black">
        <video
          controls
          playsInline
          preload="auto"
          poster="/media/demo/poster.jpg"
          className="w-full aspect-video bg-black"
        >
          <source src="/media/demo/biblemap-demo-20s.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <a
          href="/media/demo/biblemap-demo-20s.mp4"
          download="biblemap-demo-20s.mp4"
          className="px-5 py-2.5 rounded-full bg-[#c4a574] text-[#07090f] text-sm font-semibold tracking-wide hover:bg-[#e0c48a]"
        >
          Download 720p
        </a>
        <a
          href="/media/demo/biblemap-demo-20s-1080p.mp4"
          download="biblemap-demo-20s-1080p.mp4"
          className="px-5 py-2.5 rounded-full border border-[#c4a574]/50 text-[#f4ead3] text-sm font-semibold tracking-wide hover:border-[#c4a574]"
        >
          Download 1080p
        </a>
        <a
          href="/"
          className="px-5 py-2.5 rounded-full text-[#c5d4e8] text-sm tracking-wide hover:text-[#f4ead3]"
        >
          Back to the map
        </a>
      </div>
    </main>
  );
}
