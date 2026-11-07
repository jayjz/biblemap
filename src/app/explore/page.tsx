import Link from "next/link";
import { routeMetadata } from "@/lib/seo";
import ExploreClient from "@/features/explorer/ExploreClient";

export const metadata = routeMetadata("/explore/", "Biblical atlas — places and journeys — BibleMap", "Explore biblical places, events and journeys in BibleMap’s interactive atlas, with a separate Scripture reader for Jonah.");
export default function ExplorePage() {
  return <><noscript><section><h1>Biblical atlas</h1><p>The interactive map requires JavaScript. <Link prefetch={false} href="/jonah/">Read all four chapters of Jonah</Link> or <Link prefetch={false} href="/">explore the human stories and their sources</Link>.</p></section></noscript><ExploreClient /></>;
}
