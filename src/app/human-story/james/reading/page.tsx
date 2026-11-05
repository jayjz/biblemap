import type { Metadata } from "next";
import { JamesEncounter } from "@/features/human-story/james/JamesEncounter";

export const metadata: Metadata = { title: "James — simple reading — BibleMap", robots: { index: false, follow: false } };
export default function JamesReading() { return <JamesEncounter reading />; }
