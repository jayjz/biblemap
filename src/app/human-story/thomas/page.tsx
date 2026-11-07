import { routeMetadata } from "@/lib/seo";
import { ThomasEncounter } from '@/features/human-story/thomas/ThomasEncounter';
export const metadata = routeMetadata("/human-story/thomas/", "Thomas · The human encounter — BibleMap", "Meet Thomas in John 11 and 14, then follow the encounter and written testimony in John 20:24–31. An editorial draft for review.");
export default function ThomasPage() { return <ThomasEncounter />; }
