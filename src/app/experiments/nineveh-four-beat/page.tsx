import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FourBeatExperience } from "@/features/nineveh-four-beat/FourBeatExperience";
import "@/features/nineveh-four-beat/four-beat.css";

export const metadata: Metadata = {
  title: "Nineveh · Four encounters · BibleMap design study",
  robots: { index: false, follow: false },
};
export default function FourBeatPage() {
  if (process.env.BIBLEMAP_NINEVEH_REVIEW !== "1") notFound();
  return <FourBeatExperience />;
}
