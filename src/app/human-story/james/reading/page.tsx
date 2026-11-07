import { routeMetadata } from "@/lib/seo";
import { JamesEncounter } from "@/features/human-story/james/JamesEncounter";

export const metadata = routeMetadata("/human-story/james/reading/", "James — simple reading — BibleMap", "Read the accounts of James with source notes and distinctions between ancient testimony and later tradition in a simple reading.");
export default function JamesReading() { return <JamesEncounter reading />; }
