"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";

// Keep the existing WebGL atlas isolated from server rendering.
const DataLoader = dynamic(() => import("@/components/DataLoader"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center w-screen h-screen bg-[#002b36] text-[#a6b7b7]">Loading the biblical atlas…</div>,
});

function Explorer() {
  const searchParams = useSearchParams();
  const initialParams = useMemo(() => {
    const obj: Record<string, string | string[] | undefined> = {};
    searchParams.forEach((value, key) => { obj[key] = value; });
    return obj;
  }, [searchParams]);
  return <main className="w-screen h-screen overflow-hidden"><ErrorBoundary><DataLoader initialParams={initialParams} /></ErrorBoundary></main>;
}

export default function ExplorePage() {
  return <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen bg-[#002b36] text-[#a6b7b7]">Loading the biblical atlas…</div>}><Explorer /></Suspense>;
}
