"use client";

import {
  isInterpretiveClass,
  laterCreationDisclaimer,
  mediaClassLabel,
  type CuratedMediaAsset,
} from "@/domain/media";

export function MediaProvenancePlate({ asset }: { asset: CuratedMediaAsset }) {
  const interpretive = isInterpretiveClass(asset.class);

  return (
    <section
      className="rounded-[4px] border border-stone-200 bg-[#faf6ee] px-3.5 py-3"
      aria-label="Artwork provenance"
    >
      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-800/80 mb-1.5">
        {mediaClassLabel(asset.class)}
        {interpretive ? " · not archaeological evidence" : ""}
      </div>
      <h3 className="text-[13px] font-medium text-stone-800 [font-family:'Playfair_Display',Georgia,serif] leading-snug">
        {asset.title}
      </h3>
      <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
        {asset.creator}, {asset.creationDate}
        <br />
        {asset.sourceInstitution}
      </p>
      {laterCreationDisclaimer(asset) && (
        <p className="mt-2 text-[11px] leading-relaxed text-stone-700">
          {laterCreationDisclaimer(asset)}
        </p>
      )}
      <p className="mt-2 text-[11.5px] leading-relaxed text-stone-700">{asset.caption}</p>
      <p className="mt-2 text-[10.5px] leading-relaxed text-stone-500 italic">{asset.historicalFit}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]">
        <a
          href={asset.sourceRecordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline underline-offset-2 hover:text-amber-950"
        >
          Source record
        </a>
        <span className="text-stone-500">{asset.license}</span>
      </div>
      <p className="mt-1.5 text-[10px] leading-relaxed text-stone-500">{asset.requiredAttribution}</p>
    </section>
  );
}
