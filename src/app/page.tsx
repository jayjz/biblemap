"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";

// Next.js 16 requires dynamic imports with ssr:false to be executed 
// inside a Client Component.
const DataLoader = dynamic(
  () => import("@/components/DataLoader"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width:          "100vw",
          height:         "100vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "#002b36",
          color:          "#586e75",
          fontFamily:     "system-ui, sans-serif",
          fontSize:       "1.1rem",
        }}
      >
        Initializing Bible3D WebGL Context...
      </div>
    ),
  }
);

function HomeContent() {
  const searchParams = useSearchParams();
  
  // Convert URLSearchParams to plain object for DataLoader
  const params = useMemo(() => {
    const obj: { [key: string]: string | string[] | undefined } = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ErrorBoundary>
        <DataLoader initialParams={params} />
      </ErrorBoundary>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#002b36",
        color: "#586e75"
      }}>
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}