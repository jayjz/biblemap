import scripture from "./scripture/web-jonah-1.json" with { type: "json" };
import type { AuthoredText, Passage, StoryDocument } from "../domain/story.ts";
import { JONAH_APPROVED_MEDIA, jonahArtworkIds } from "./jonah-media.ts";

const placeholder = (slot: string): AuthoredText => ({ status: "placeholder", slot });
const ranges = [[1, 2], [3, 3], [4, 6], [7, 10], [11, 16], [17, 17]] as const;
const ids = ["jonah-1-calling", "jonah-1-escape", "jonah-1-storm-wind", "jonah-1-storm-lots", "jonah-1-storm-sea", "jonah-1-depths"];
const sections = ["calling", "escape", "storm", "storm", "storm", "depths"];

const passages: Passage[] = ranges.map(([firstVerse, lastVerse]) => ({
  id: `jonah-1-${firstVerse}-${lastVerse}`, book: "JON", chapter: 1, firstVerse, lastVerse,
  translationId: "WEB-engwebp", sourceId: "web-jonah-1", sourceVersion: scripture.sourceVersion,
  retrievedAt: scripture.retrievedAt, checksum: scripture.sourceChecksum,
  rightsStatement: "World English Bible • Public domain. Translation name retained for unaltered text.",
  rightsUrl: "https://ebible.org/engwebp/copyright.htm",
  verses: scripture.verses.filter(v => v.number >= firstVerse && v.number <= lastVerse),
  notes: scripture.notes.filter(n => n.verse >= firstVerse && n.verse <= lastVerse),
}));

/** Owner-proposed section labels; no approval or authored interpretation is inferred. */
export const JONAH: StoryDocument = {
  schemaVersion: 1, id: "jonah", book: "JON", mode: "author-review",
  title: "Jonah", subtitle: "The Man Who Ran",
  sections: [
    { id: "calling", label: "Calling", reference: "1:1–2", available: true },
    { id: "escape", label: "Escape", reference: "1:3", available: true },
    { id: "storm", label: "Storm", reference: "1:4–16", available: true },
    { id: "depths", label: "Depths", reference: "1:17–2:10", available: true },
    { id: "second-chance", label: "Second Chance", reference: "Chapter 3", available: false },
    { id: "unanswered-question", label: "Unanswered Question", reference: "Chapter 4", available: false },
  ],
  scenes: ids.map((id, i) => ({
    id, sectionId: sections[i], chapter: 1,
    title: placeholder(`${id} title`), narrative: placeholder("scene narrative"),
    passageIds: [passages[i].id],
    reflections: [{ id: `${id}-reflection`, prompt: placeholder("reflection prompt") }],
    claimIds: [], geographyIds: i === 0 ? ["nineveh"] : i === 1 ? ["joppa", "tarshish"] : [], artworkIds: jonahArtworkIds(id),
    transition: { nextSceneId: ids[i + 1] ?? null, advance: "reader", visual: "fade" },
    review: { status: "draft" },
  })),
  passages,
  sources: [{
    id: "web-jonah-1", title: "World English Bible — Jonah 1", author: "World English Bible translators",
    institution: "eBible.org", url: scripture.sourceUrl, sourceType: "biblical-text",
    supports: "The exact text and named places of Jonah 1 in this translation; not independent historical or geographic verification.",
  }],
  claims: [],
  geography: ["nineveh", "joppa", "tarshish"].map(placeId => ({
    placeId, label: placeId[0].toUpperCase() + placeId.slice(1), status: "unknown",
    explanation: placeholder(`${placeId}: geographic evidence and uncertainty`), candidates: [],
  })),
  media: JONAH_APPROVED_MEDIA,
};
