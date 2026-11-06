import type { Metadata } from 'next';
import { ThomasEncounter } from '@/features/human-story/thomas/ThomasEncounter';
export const metadata: Metadata = { title: 'Thomas · The space between doubt and belief · BibleMap', description: 'A five-movement encounter with John 20:24–29. A working editorial prototype.', robots: { index: false, follow: false } };
export default function ThomasPage() { return <ThomasEncounter />; }
