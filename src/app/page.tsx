import type { Metadata } from "next";
import { NinevehHome } from "./NinevehHome";
import "@/features/nineveh/nineveh.css";

// 2026-10-25: The public entrance is Nineveh; route metadata must remain server-rendered for static export.
export const metadata: Metadata = {
  title: "Nineveh — The City Remains | BibleMap",
  description: "Enter Jonah's world through Scripture, the Assyrian past, later art, and enduring questions. Begin at Nineveh or read Jonah from the beginning.",
  openGraph: {
    title: "Nineveh — The City Remains | BibleMap",
    description: "An encounter with Jonah, Nineveh, mercy and the stories that outlive a city.",
    type: "website",
  },
};

export default function HomePage() {
  return <NinevehHome />;
}
