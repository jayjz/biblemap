import type { Metadata } from "next";
import { NinevehHome } from "../NinevehHome";

export const metadata: Metadata = {
  title: "Nineveh — The City Remains | BibleMap",
  description: "Enter Jonah's world through Scripture, the Assyrian past, later art, and enduring questions. Begin at Nineveh or read Jonah from the beginning.",
  alternates: { canonical: "https://biblemap-pink.vercel.app/nineveh/" },
  openGraph: {
    title: "Nineveh — The City Remains | BibleMap",
    description: "An encounter with Jonah, Nineveh, mercy and the stories that outlive a city.",
    type: "website",
    url: "https://biblemap-pink.vercel.app/nineveh/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nineveh — The City Remains | BibleMap",
    description: "An encounter with Jonah, Nineveh, mercy and the stories that outlive a city.",
  },
};

export default function NinevehPage() {
  return <NinevehHome />;
}
