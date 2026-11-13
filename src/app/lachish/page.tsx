import type { Metadata } from "next";
import { LachishEncounter } from "@/features/lachish/LachishEncounter";
import "@/features/lachish/lachish.css";

export const metadata: Metadata = {
  title: "Lachish: Before the Walls Fell | BibleMap",
  description: "A city caught between an empire and its king. Encounter Lachish in 701 BC through Scripture, Assyrian reliefs and archaeological remains.",
  robots: { index: false, follow: false },
};

export default function LachishPage() { return <LachishEncounter />; }
