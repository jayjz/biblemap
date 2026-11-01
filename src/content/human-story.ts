import type { HumanGraph, HumanSource, HumanEntry, HumanEntity, HumanConnection } from "../domain/human-story.ts";
import { validateHumanGraph } from "../domain/human-story.ts";
import { WITNESS_SOURCES, WITNESS_ENTITIES, WITNESS_ENTRIES, WITNESS_CONNECTIONS } from "./human-story-witnesses.ts";

// Sourced no-index editorial drafts, requested for PR review. No human approval implied.
const checkedAt = "2026-11-01";
const scriptureSource = (id: string, title: string, path: string, locator: string): HumanSource => ({
  id, title, url: `https://ebible.org/engwebp/${path}.htm`, locator,
  edition: "World English Bible, updated 66-book edition (engwebp). Read 2026-11-01; summaries are editorial, not quotations.",
  kind: "scripture", checkedAt, rights: "World English Bible: public domain. No new Scripture quotation reproduced here.",
  limits: "A biblical narrative is read as Scripture. The summary does not independently establish dates, locations or archaeological corroboration.",
});

export const HUMAN_SOURCES: readonly HumanSource[] = [
  ...WITNESS_SOURCES,
  scriptureSource("web-genesis", "Genesis 1", "GEN01", "1:1–31, especially 1:26–31"),
  scriptureSource("web-exodus", "Exodus 14", "EXO14", "14:10–31"),
  { ...scriptureSource("web-jonah", "The book of Jonah", "JON01", "Jonah 1–4; especially 3:10–4:11"), edition: "World English Bible engwebp, pinned publisher snapshot 2026-10-10. All 48 verses validated by the existing pipeline." },
  scriptureSource("web-luke", "Luke 24", "LUK24", "24:13–35"),
  scriptureSource("web-acts", "Acts 9", "ACT09", "9:1–22"),
  { id: "cma-jonah", title: "Jonah Under the Gourd Vine", url: "https://www.clevelandart.org/art/1965.239", locator: "Details, medium, date, culture, Public Domain", edition: "Cleveland Museum of Art, 1965.239. Unknown sculptor, Anatolia, 280–290 CE.", kind: "reception", checkedAt, rights: "CC0; exact institutional Public Domain statement rechecked. Existing local image and rights manifest reused.", limits: "Later Christian artistic reception, not a portrait of Jonah or evidence of Assyrian appearance. Exact original findspot is not established here." },
  { id: "bm-tablet", title: "The Flood Tablet, K.3375", url: "https://www.britishmuseum.org/collection/object/W_K-3375", locator: "Production date, findspot, description; existing verified Nineveh dossier", edition: "British Museum collection record K.3375; source and image provenance retained in the existing Nineveh depth manifest.", kind: "artifact", checkedAt, rights: "Object record linked, not reproduced. Existing photograph by Fæ: CC BY-SA 3.0; local derivative retains the same license.", limits: "Evidence of literary culture at seventh-century BCE Nineveh. Does not date Jonah, establish a visit, or demonstrate literary dependence. Live record returned only its shell on November 1; rely on the retained verified dossier for these fields." },
];

export const HUMAN_ENTITIES: readonly HumanEntity[] = [
  ...WITNESS_ENTITIES,
  { id: "person-jonah", type: "person", name: "Jonah", sourceIds: ["web-jonah"] },
  { id: "person-moses", type: "person", name: "Moses", sourceIds: ["web-exodus"] },
  { id: "person-jesus", type: "person", name: "Jesus", sourceIds: ["web-luke", "web-acts"] },
  { id: "person-paul", type: "person", name: "Saul / Paul", sourceIds: ["web-acts"] },
  { id: "person-ananias", type: "person", name: "Ananias of Damascus", sourceIds: ["web-acts"] },
  { id: "person-cleopas", type: "person", name: "Cleopas", sourceIds: ["web-luke"] },
  { id: "place-nineveh", type: "place", name: "Nineveh", sourceIds: ["web-jonah", "bm-tablet"] },
  { id: "place-joppa", type: "place", name: "Joppa", sourceIds: ["web-jonah"] },
  { id: "place-egypt", type: "place", name: "Egypt", sourceIds: ["web-exodus"] },
  { id: "place-jerusalem", type: "place", name: "Jerusalem", sourceIds: ["web-luke", "web-acts"] },
  { id: "place-damascus", type: "place", name: "Damascus", sourceIds: ["web-acts"] },
];

export const HUMAN_ENTRIES: readonly HumanEntry[] = [
  ...WITNESS_ENTRIES,
  {
    id: "genesis", title: "In the beginning", subtitle: "Humanity within a created world", worlds: ["stories"], kind: "scripture", era: "Genesis 1 · no historical date assigned", entityIds: [],
    introduction: "Before an individual biography, Genesis places human life within a world of light, water, plants and living creatures.",
    sections: [
      { id: "creation", title: "A world before a life", text: "Genesis 1 unfolds through acts of speaking, separating, naming and blessing. Human beings arrive within that ordered world. Read the sequence before selecting one image or one sentence to stand for the whole chapter.", sourceIds: ["web-genesis"] },
      { id: "image", title: "An image, a responsibility", text: "Verses 26–28 place male and female together within the language of God's image, blessing and rule. The chapter also speaks about food, other creatures and the goodness of what is made. These are features of the biblical text; this reading room does not settle competing accounts of creation's chronology.", sourceIds: ["web-genesis"] },
    ], question: "What changes when a human life is read as part of a larger creation?", sourceIds: ["web-genesis"], reading: { label: "Read Genesis 1 · World English Bible", href: "https://ebible.org/engwebp/GEN01.htm" }, reviewStatus: "draft",
  },
  {
    id: "exodus", title: "Between an army and the sea", subtitle: "Moses and a people on the move", worlds: ["stories", "atlas"], kind: "scripture", era: "Exodus 14 · historical dating and route not fixed here", entityIds: ["person-moses", "place-egypt"],
    introduction: "An army approaches. The people cry out. The sea in front of them becomes the passage through which the story continues.",
    sections: [
      { id: "shore", title: "Hear the people first", text: "In Exodus 14:10–12, the Israelites see the approaching Egyptians and challenge Moses about bringing them into the wilderness. The narrator gives their speech room before the crossing. Their words should not disappear behind a triumphant image of the outcome.", sourceIds: ["web-exodus"] },
      { id: "crossing", title: "A crossing and its cost", text: "The text attributes the divided sea to the LORD, narrates Israel's passage on dry ground and describes the destruction of the pursuing army. Keep liberation, danger and death together when reading the chapter. A map can orient a reader, but the text alone does not resolve a modern crossing location or supply an uncontested date.", sourceIds: ["web-exodus"] },
    ], question: "What do you notice by remaining at the shore before reading the outcome?", sourceIds: ["web-exodus"], reading: { label: "Read Exodus 14 · World English Bible", href: "https://ebible.org/engwebp/EXO14.htm" }, atlas: { label: "Open Exodus & Conquest in the Atlas", href: "/explore/#exodus", note: "The Atlas uses its existing chronology and route model. Locations and dates are interpretive; this reading room does not validate one crossing site." }, reviewStatus: "draft",
  },
  {
    id: "jonah", title: "The prophet and the city", subtitle: "A story that ends with a question", worlds: ["stories"], kind: "scripture", era: "Jonah 1–4 · narrative date not established here", entityIds: ["person-jonah", "place-joppa", "place-nineveh"],
    introduction: "A command sends Jonah toward Nineveh. He boards a ship going elsewhere. The book gives space to sailors, a city, a plant and a final unanswered question.",
    sections: [
      { id: "whole-story", title: "Begin before the familiar image", text: "Read Jonah from 1:1. The sailors act and speak before the fish appears. Nineveh responds to the warning in chapter 3. The story then follows Jonah outside the city. Starting with the whole book preserves those changes of scene and attention.", sourceIds: ["web-jonah"] },
      { id: "ending", title: "Stay with the ending", text: "Jonah 3:10 and 4:1 place divine relenting beside Jonah's anger. His stated objection follows in 4:2. The plant, the worm and the heat lead into God's final question in 4:11; the narrator records no reply. Later readers and artists enter this space without supplying the book's missing answer for it.", sourceIds: ["web-jonah"] },
    ], question: "Who has come into view by the time the book asks its last question?", sourceIds: ["web-jonah"], reading: { label: "Read the complete Jonah · pinned WEB text", href: "/jonah/#jonah-1-calling" }, atlas: { label: "Find Nineveh in the Atlas", href: "/explore/?place=nineveh&from=jonah-3-mercy", note: "City location is distinguished from a proposed journey. Archaeology does not establish the date of Jonah's visit." }, imageId: "jonah-vine", reviewStatus: "draft",
  },
  {
    id: "emmaus", title: "The stranger on the road", subtitle: "Cleopas, a companion and a reading of Scripture", worlds: ["stories"], kind: "scripture", era: "Luke 24:13–35 · resurrection narrative", entityIds: ["person-jesus", "person-cleopas", "place-jerusalem"],
    introduction: "Two travelers discuss what has happened in Jerusalem. In Luke's account, Jesus joins them before they recognize him.",
    sections: [
      { id: "conversation", title: "A conversation before recognition", text: "The travelers describe Jesus, his death and the reports of the women at the tomb. Cleopas names the hope they had held. Jesus responds by interpreting Moses and the prophets. The sequence matters: a conversation and a reading of Scripture precede the recognition at the table.", sourceIds: ["web-luke"] },
      { id: "return", title: "The road turns back", text: "Luke says they recognize Jesus in the breaking of bread, then return to Jerusalem and recount the encounter. This is the Gospel's resurrection testimony. It should be read on its own terms before comparing it with a Roman historian's much later account of Christians.", sourceIds: ["web-luke"] },
    ], question: "What does Luke allow the reader to see before the travelers can see it?", sourceIds: ["web-luke"], reading: { label: "Read Luke 24 · World English Bible", href: "https://ebible.org/engwebp/LUK24.htm#V13" }, reviewStatus: "draft",
  },
  {
    id: "paul", title: "Led by the hand", subtitle: "Saul and Ananias in Damascus", worlds: ["stories", "saints"], kind: "scripture", era: "Acts 9:1–22 · early Christian narrative", entityIds: ["person-paul", "person-ananias", "person-jesus", "place-damascus"],
    introduction: "Saul approaches Damascus with authority to arrest. After the encounter on the road, other people must lead him into the city.",
    sections: [
      { id: "road", title: "A changed position", text: "Acts 9 introduces Saul through threats and letters of authority. After the light and the voice, he cannot see. The people with him bring him to Damascus by the hand. Attend to these changes before importing the imagery of later conversion paintings.", sourceIds: ["web-acts"] },
      { id: "ananias", title: "Another person must answer", text: "The narrative turns to Ananias, who objects that he has heard of Saul's violence. He nevertheless goes to the house, addresses Saul as a brother and lays hands on him. Sight, baptism, food and a community follow. Ananias belongs to the story as more than a supporting detail.", sourceIds: ["web-acts"] },
    ], question: "How does the story change when Ananias is allowed to remain in the frame?", sourceIds: ["web-acts"], reading: { label: "Read Acts 9 · World English Bible", href: "https://ebible.org/engwebp/ACT09.htm" }, reviewStatus: "draft",
  },
  {
    id: "nineveh", title: "A city beyond its name", subtitle: "Nineveh, writing and a surviving tablet", worlds: ["atlas"], kind: "artifact", era: "Seventh century BCE · tablet; biblical visit not dated", entityIds: ["place-nineveh"],
    introduction: "The city named in Jonah also has a material history. A surviving literary tablet opens one window onto it, without proving the events of the book.",
    sections: [
      { id: "tablet", title: "What survives", text: "The British Museum's K.3375 is a seventh-century BCE clay tablet from Nineveh containing part of the Epic of Gilgamesh's flood narrative. It is evidence of writing and literary preservation in the city. Its survival should widen our attention to a human world beyond an abstract place-name.", sourceIds: ["bm-tablet"] },
      { id: "limits", title: "What it cannot tell us", text: "This tablet does not name Jonah or date his visit. Nor does putting it beside a biblical story demonstrate that one narrative borrowed from another. The connection here is the place: Nineveh belongs both to the biblical account and to the documented history of this object.", sourceIds: ["bm-tablet", "web-jonah"] },
    ], question: "What can an object establish, and what must remain a different kind of question?", sourceIds: ["bm-tablet", "web-jonah"], atlas: { label: "Locate Nineveh in the Atlas", href: "/explore/?place=nineveh&from=jonah-3-mercy", note: "An orientation to the city, not a verified route or date for Jonah." }, reviewStatus: "draft",
  },
  {
    id: "jonah-in-marble", title: "A story takes another body", subtitle: "Jonah in late Roman Christian art", worlds: ["voices"], kind: "reception", era: "280–290 CE · artwork, not the narrated period", entityIds: ["person-jonah"],
    introduction: "A reclining body and a broad-leaved plant make Jonah recognizable in marble. This is a later Christian encounter with the story.",
    sections: [
      { id: "look", title: "Look before explaining", text: "The Cleveland Museum of Art dates this Anatolian marble sculpture to 280–290 CE. The body lies beneath the plant, one arm lifted above the face. Compare what the sculptor holds still with the sequence of shade, loss and questioning in Jonah 4.", sourceIds: ["cma-jonah", "web-jonah"] },
      { id: "reception", title: "A later work, a different question", text: "The sculpture helps us see how a biblical story could acquire a visible form in a later culture. It cannot establish Jonah's likeness, ancient Assyrian dress or the species of the plant. Those boundaries allow the artwork to remain an interpretation rather than a substitute for the text.", sourceIds: ["cma-jonah", "web-jonah"] },
    ], question: "What does a still image select from a story that keeps moving?", sourceIds: ["cma-jonah", "web-jonah"], imageId: "jonah-vine", reading: { label: "Return to Jonah 4:5–11", href: "/jonah/#jonah-4-shade" }, reviewStatus: "draft",
  },
];

export const HUMAN_CONNECTIONS: readonly HumanConnection[] = [
  ...WITNESS_CONNECTIONS,
  { id: "jonah-nineveh", from: "jonah", to: "nineveh", label: "The city in the story and the city of an object", kind: "context", note: "The place-name joins the readings. The tablet does not corroborate Jonah's visit.", sourceIds: ["web-jonah", "bm-tablet"], reviewStatus: "draft" },
  { id: "jonah-marble", from: "jonah", to: "jonah-in-marble", label: "The plant becomes a sculpted shelter", kind: "reception", note: "A documented later depiction of Jonah; not an ancient portrait or a settled botanical identification.", sourceIds: ["web-jonah", "cma-jonah"], reviewStatus: "draft" },
  { id: "jonah-exodus", from: "jonah", to: "exodus", label: "Two stories at sea", kind: "comparison", note: "An editorial comparison of danger and passage through water. It does not establish literary dependence or identical theology.", sourceIds: ["web-jonah", "web-exodus"], reviewStatus: "draft" },
  { id: "genesis-exodus", from: "genesis", to: "exodus", label: "Water, land and a way through", kind: "comparison", note: "Compare what the two biblical narratives do with water and dry land; no historical chronology is inferred.", sourceIds: ["web-genesis", "web-exodus"], reviewStatus: "draft" },
  { id: "emmaus-paul", from: "emmaus", to: "paul", label: "An encounter on a road", kind: "comparison", note: "Two passages in Luke and Acts, with different people, settings and narrative sequences. A thematic connection, not a claim that the events are interchangeable.", sourceIds: ["web-luke", "web-acts"], reviewStatus: "draft" },
  { id: "paul-jonah", from: "paul", to: "jonah", label: "A sending and an unexpected response", kind: "comparison", note: "An editorial invitation to compare the narratives; it supplies neither character's unspoken motives.", sourceIds: ["web-acts", "web-jonah"], reviewStatus: "draft" },
];

export const HUMAN_GRAPH: HumanGraph = { entries: HUMAN_ENTRIES, sources: HUMAN_SOURCES, entities: HUMAN_ENTITIES, connections: HUMAN_CONNECTIONS };
const errors = validateHumanGraph(HUMAN_GRAPH);
if (errors.length) throw new Error(`Invalid Human Story graph:\n${errors.join("\n")}`);
