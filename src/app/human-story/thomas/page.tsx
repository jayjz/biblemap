import type { Metadata } from 'next';
import { ThomasEncounter } from '@/features/human-story/thomas/ThomasEncounter';
export const metadata: Metadata = { title: 'Thomas · The human encounter · BibleMap', description: 'Meet Thomas in John 11 and 14, then follow the encounter and written testimony in John 20:24–31. An editorial draft for review.', robots: { index: false, follow: false } };
export default function ThomasPage() { return <ThomasEncounter />; }
