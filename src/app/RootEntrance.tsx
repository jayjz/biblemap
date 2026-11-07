"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, type ReactNode } from "react";
import { isLegacyRootLink } from "@/domain/root-routing";

const LegacyHome = dynamic(() => import("./NinevehHome").then(module => module.NinevehHome));
const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
};
const snapshot = () => isLegacyRootLink(window.location.search, window.location.hash);

// Fragments never reach the static server. Retain the existing in-place legacy
// experience for recognized links, including Back/Forward, without redirects.
// The ordinary entrance is server-rendered, including when JavaScript is absent.
export function RootEntrance({ children }: { children: ReactNode }) {
  const legacy = useSyncExternalStore(subscribe, snapshot, () => false);
  return legacy ? <LegacyHome /> : children;
}
