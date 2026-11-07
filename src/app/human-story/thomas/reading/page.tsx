import { routeMetadata } from "@/lib/seo";
import { ThomasEncounter } from '@/features/human-story/thomas/ThomasEncounter';
export const metadata = routeMetadata("/human-story/thomas/reading/", "Thomas · simple reading — BibleMap", "Read John 20:24–31 with Thomas, the other disciples and the narrator’s testimony in a simple reading with sources.");
export default function ThomasReadingPage() { return <ThomasEncounter reading />; }
