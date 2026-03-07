"use client";

import dynamic from "next/dynamic";

// Next.js 16 requires dynamic imports with ssr:false to be executed 
// inside a Client Component (which we declared at line 1).
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

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <DataLoader />
    </main>
  );
}