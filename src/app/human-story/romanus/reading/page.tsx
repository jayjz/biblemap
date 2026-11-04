import type { Metadata } from "next";
import { RomanusEncounter } from "@/features/human-story/romanus/RomanusEncounter";

export const metadata: Metadata = {
  title: "Romanus · simple reading — BibleMap",
  robots: { index: false, follow: false },
};

export default function RomanusReadingPage() {
  return <RomanusEncounter reading />;
}
