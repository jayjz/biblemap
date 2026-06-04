"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";

// Dynamic import with aggressive isolation for the WebGL-heavy component
const DataLoader = dynamic(
  () => import("@/components/DataLoader"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-screen h-screen bg-[#002b36] text-[#586e75] font-mono text-lg">
        Initializing Bible3D WebGL Context...
      </div>
    ),
  }
);

export default function Home() {
  const searchParams = useSearchParams();

  // Convert URLSearchParams to plain object (memoized)
  const initialParams = useMemo(() => {
    const obj: Record<string, string | string[] | undefined> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen bg-[#002b36] text-[#586e75]">
          Loading Bible Map...
        </div>
      }
    >
      <main className="w-screen h-screen overflow-hidden">
        <ErrorBoundary>
          <DataLoader initialParams={initialParams} />
        </ErrorBoundary>
      </main>
    </Suspense>
  );
}