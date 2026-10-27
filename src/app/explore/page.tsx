"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import Link from "next/link";
import "./explore.css";

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
  return <main className="w-screen h-screen overflow-hidden"><ErrorBoundary><DataLoader key={typeof initialParams.place === "string" ? initialParams.place : "atlas"} initialParams={initialParams} /></ErrorBoundary></main>;
}

export default function ExplorePage() {
  return <>
    <nav className="atlas-navigation" aria-label="Atlas navigation">
      <Link href="/" prefetch={false}>BibleMap home</Link>
      <a href="/jonah/#jonah-1-calling">Read Jonah</a>
    </nav>
    <Suspense fallback={<div role="status" className="flex items-center justify-center w-screen h-screen bg-[#002b36] text-[#a6b7b7]">Loading the biblical atlas…</div>}><Explorer /></Suspense>
  </>;
}
