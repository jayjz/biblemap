"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { isLegacyAtlasLink } from "@/domain/atlas-routing";
import { NinevehEncounter } from "@/features/nineveh/NinevehEncounter";
import "@/features/nineveh/nineveh.css";

// Shared by /nineveh/ and recognized legacy root links.
// The dedicated /explore/ route remains the canonical entry for new map links.
const Atlas = dynamic(() => import("@/features/explorer/ExploreClient"), { ssr: false });
const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
};
function legacyAtlasLink() {
  return isLegacyAtlasLink(window.location.search, window.location.hash);
}

export function NinevehHome() {
  const legacyAtlas = useSyncExternalStore(subscribe, legacyAtlasLink, () => false);
  return legacyAtlas ? <Atlas /> : <NinevehEncounter published />;
}
