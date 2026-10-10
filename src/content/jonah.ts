import chapter1 from "./scripture/web-jonah-1.json" with { type: "json" };
import chapter2 from "./scripture/web-jonah-2.json" with { type: "json" };
import chapter3 from "./scripture/web-jonah-3.json" with { type: "json" };
import chapter4 from "./scripture/web-jonah-4.json" with { type: "json" };
import type { AuthoredText, Passage, StoryDocument } from "../domain/story.ts";
import { JONAH_APPROVED_MEDIA, jonahArtworkIds } from "./jonah-media.ts";

const placeholder = (slot: string): AuthoredText => ({ status: "placeholder", slot });
export const JONAH_CHAPTERS = [chapter1, chapter2, chapter3, chapter4];
/** Provisional reading companion, sourced to each passage. No creator testimony. */
const sequence = [
  { id: "jonah-1-calling", section: "calling", chapter: 1, first: 1, last: 2,
    title: "Calling", question: "What do we do with a responsibility we did not choose?",
    context: "Nineveh is the city Jonah is told to visit. The opening gives a command, but does not yet tell us what Jonah thinks of it." },
  { id: "jonah-1-escape", section: "escape", chapter: 1, first: 3, last: 3,
    title: "Flight", question: "When is leaving an act of freedom—and when is it avoidance?",
    context: "Watch the repeated movement away: Jonah goes to Joppa, finds a ship, and pays his fare. The verse describes his departure without explaining his motive." },
  { id: "jonah-1-storm-wind", section: "storm", chapter: 1, first: 4, last: 6,
    title: "While Jonah sleeps", question: "Who carries the weight of the things we avoid?",
    context: "The sailors act while Jonah sleeps. Notice how the captain addresses someone who has withdrawn from the danger they share." },
  { id: "jonah-1-storm-lots", section: "storm", chapter: 1, first: 7, last: 10,
    title: "A name in the storm", question: "What happens when our words and our direction disagree?",
    context: "Jonah identifies himself by the God he fears. Read that declaration beside what he has already done." },
  { id: "jonah-1-storm-sea", section: "storm", chapter: 1, first: 11, last: 16,
    title: "The lives beside us", question: "What do we owe someone whose choices have put us in danger?",
    context: "Before throwing Jonah into the sea, the sailors try to row to land. Their hesitation is part of the story too." },
  { id: "jonah-1-depths", section: "depths", chapter: 1, first: 17, last: 17,
    title: "Depths", question: "What remains when there is nowhere left to run?",
    context: "The account moves from the open sea to confinement. Let the change in scale settle before continuing." },
  { id: "jonah-2-prayer", section: "depths", chapter: 2, first: 1, last: 9,
    title: "A voice from below", question: "What do we reach for when control is gone?",
    context: "Jonah’s prayer moves between being overwhelmed and being heard. Read slowly; its images of descent and return belong to the prayer itself." },
  { id: "jonah-2-shore", section: "depths", chapter: 2, first: 10, last: 10,
    title: "Dry land", question: "Does being given another chance make us different?",
    context: "The chapter ends with Jonah on dry land. The verse gives no speech from him. Pause here before the command returns." },
  { id: "jonah-3-return", section: "second-chance", chapter: 3, first: 1, last: 4,
    title: "Nineveh", question: "What changes when we finally go?",
    context: "The command comes a second time. Compare this opening with the first: the destination is the same, but Jonah’s direction changes." },
  { id: "jonah-3-mercy", section: "second-chance", chapter: 3, first: 5, last: 10,
    title: "A city turns", question: "Can we allow people to become more than the harm they have done?",
    context: "The people, the king, and even the animals enter the account. Notice the king’s uncertainty, and what the narrator says God sees." },
  { id: "jonah-4-anger", section: "unanswered-question", chapter: 4, first: 1, last: 4,
    title: "When mercy hurts", question: "Whose second chance is hardest for us to accept?",
    context: "Here Jonah names his reason for fleeing. Read his explanation beside the mercy he has just received and the mercy the city receives." },
  { id: "jonah-4-shade", section: "unanswered-question", chapter: 4, first: 5, last: 10,
    title: "The shade we lose", question: "Why can our own discomfort feel larger than someone else’s life?",
    context: "A vine brings relief, then withers. The conversation turns toward what Jonah cares for, and what he did not bring into being." },
  { id: "jonah-4-question", section: "unanswered-question", chapter: 4, first: 11, last: 11,
    title: "The unanswered question", question: "Where does our concern end?",
    context: "This is the book’s final verse. No reply from Jonah follows. There is room to sit with the question without resolving it." },
];
const passages: Passage[] = sequence.map(scene => {
  const scripture = JONAH_CHAPTERS[scene.chapter - 1];
  return {
    id: `jonah-${scene.chapter}-${scene.first}-${scene.last}`, book: "JON", chapter: scene.chapter,
    firstVerse: scene.first, lastVerse: scene.last, translationId: "WEB-engwebp",
    sourceId: `web-jonah-${scene.chapter}`, sourceVersion: scripture.sourceVersion,
    retrievedAt: scripture.retrievedAt, checksum: scripture.sourceChecksum,
    rightsStatement: "World English Bible • Public domain. Translation name retained for unaltered text.",
    rightsUrl: "https://ebible.org/engwebp/copyright.htm",
    verses: scripture.verses.filter(v => v.number >= scene.first && v.number <= scene.last),
    notes: scripture.notes.filter(n => n.verse >= scene.first && n.verse <= scene.last),
  };
});

/** Owner-proposed section labels; no approval or authored interpretation is inferred. */
export const JONAH: StoryDocument = {
  schemaVersion: 1, id: "jonah", book: "JON", mode: "author-review",
  title: "Jonah", subtitle: "The Man Who Ran",
  sections: [
    { id: "calling", label: "Calling", reference: "1:1–2", available: true },
    { id: "escape", label: "Flight", reference: "1:3", available: true },
    { id: "storm", label: "Storm", reference: "1:4–16", available: true },
    { id: "depths", label: "Depths", reference: "1:17–2:10", available: true },
    { id: "second-chance", label: "Nineveh", reference: "Chapter 3", available: true },
    { id: "unanswered-question", label: "The unanswered question", reference: "Chapter 4", available: true },
  ],
  scenes: sequence.map((scene, i) => ({
    id: scene.id, sectionId: scene.section, chapter: scene.chapter,
    title: placeholder(`${scene.id} creator title`), narrative: placeholder("creator narrative"),
    passageIds: [passages[i].id],
    reflections: [{ id: `${scene.id}-reflection`, prompt: placeholder("creator reflection prompt") }],
    claimIds: [], geographyIds: scene.id === "jonah-1-calling" || scene.chapter === 3 ? ["nineveh"] : scene.id === "jonah-1-escape" ? ["joppa", "tarshish"] : [],
    artworkIds: jonahArtworkIds(scene.id),
    transition: { nextSceneId: sequence[i + 1]?.id ?? null, advance: "reader", visual: "fade" },
    review: { status: "draft" },
    readingGuide: { title: scene.title, question: scene.question, context: scene.context,
      sourceId: `web-jonah-${scene.chapter}`, locator: `Jonah ${scene.chapter}:${scene.first}${scene.last === scene.first ? "" : `–${scene.last}`}`, status: "provisional" },
  })),
  passages,
  sources: JONAH_CHAPTERS.map((scripture, i) => ({
    id: `web-jonah-${i + 1}`, title: `World English Bible — Jonah ${i + 1}`, author: "World English Bible translators",
    institution: "eBible.org", url: scripture.sourceUrl, sourceType: "biblical-text",
    supports: `The exact text and named places of Jonah ${i + 1} in this translation; not independent historical or geographic verification.`,
  })),
  claims: [],
  geography: ["nineveh", "joppa", "tarshish"].map(placeId => ({
    placeId, label: placeId[0].toUpperCase() + placeId.slice(1), status: "unknown",
    explanation: placeholder(`${placeId}: geographic evidence and uncertainty`), candidates: [],
  })),
  media: JONAH_APPROVED_MEDIA,
};
