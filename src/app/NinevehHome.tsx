"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { NINEVEH_BEATS, NINEVEH_DISCOVERIES } from "@/domain/nineveh-navigation";
import { NinevehEncounter } from "@/features/nineveh/NinevehEncounter";

// 2026-10-25: Preserve legacy root atlas deep links while giving plain "/" to Nineveh.
// The dedicated /explore/ route remains the canonical entry for new map links.
const Atlas = dynamic(() => import("./explore/page"), { ssr: false });
const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
};
function legacyAtlasLink() {
  if (window.location.search) return true;
  const fragment = window.location.hash.slice(1);
  if (!fragment || fragment === "main-content" || fragment === "nineveh-reading") return false;
  const [beat, discovery, extra] = fragment.split("/");
  const validBeat = NINEVEH_BEATS.some(item => item.id === beat);
  const validDiscovery = discovery === undefined || (extra === undefined && NINEVEH_DISCOVERIES.some(id => id === discovery));
  return !(validBeat && validDiscovery);
}

export function NinevehHome() {
  const legacyAtlas = useSyncExternalStore(subscribe, legacyAtlasLink, () => false);
  return legacyAtlas ? <Atlas /> : <NinevehEncounter published />;
}
