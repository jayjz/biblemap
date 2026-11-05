import type { Metadata } from 'next';
import { ThomasEncounter } from '@/features/human-story/thomas/ThomasEncounter';
export const metadata: Metadata = { title: 'Thomas · simple reading · BibleMap', robots: { index: false, follow: false } };
export default function ThomasReadingPage() { return <ThomasEncounter reading />; }
