import type { Metadata } from "next";
import { LachishEncounter } from "@/features/lachish/LachishEncounter";
import { routeMetadata } from "@/lib/seo";
import "@/features/lachish/lachish.css";

export const metadata: Metadata = routeMetadata(
  "/lachish/",
  "Lachish: Before the Walls Fell | BibleMap",
  "A city caught between an empire and its king. Encounter Lachish in 701 BC through Scripture, Assyrian reliefs and archaeological remains.",
);

export default function LachishPage() { return <LachishEncounter />; }
