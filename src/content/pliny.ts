import type { HumanSource } from "../domain/human-story.ts";
import { INTERIOR_SOURCES } from "./human-story-interiors.ts";

// Sourced editorial experiment for the requested draft PR. Human review pending.
export const PLINY_REVIEW = { status: "draft", checkedAt: "2026-11-14" } as const;
const melmoth = INTERIOR_SOURCES.find(source => source.id === "pliny-melmoth");
if (!melmoth) throw new Error("The Pliny encounter requires the historical Melmoth source record");

export const PLINY_SOURCES: readonly HumanSource[] = [
  {
    ...melmoth,
    id: "pliny-encounter-melmoth",
    url: "https://www.gutenberg.org/files/2811/2811-h/2811-h.htm#link2H_4_0209",
    locator: "Letters 10.96.1–10 and 10.97; XCVII–XCVIII in this edition’s Correspondence with Trajan",
    checkedAt: PLINY_REVIEW.checkedAt,
    rights: "Historical English translation in the public domain in the United States. Complete letters and credited excerpts retained locally; Project Gutenberg trademark and license boilerplate are not reproduced.",
    limits: "Roman administrative testimony, preserved in a transmitted literary text, not an original document or neutral trial transcript. Pliny reports the questioning and torture. Neither letter preserves the two women’s names, testimony or subsequent fate. Melmoth’s ‘punished’ in 10.96.3 is compared with the explicit execution rendering in the Georgetown English text. The electronic text’s stray apostrophe in officiate' and spelling Secundtis are retained in the complete reading.",
  },
  {
    id: "pliny-latin",
    title: "Pliny 10.96–97 · Latin comparison",
    url: "https://www.uvm.edu/~jbailly/commentaries/letters/PlinyX.96and97.html",
    locator: "10.96.3–8 and 10.97; Latin above Jacques Bailly’s commentary",
    edition: "University of Vermont faculty-hosted Latin presentation with Jacques Bailly’s commentary. Underlying critical edition not identified on the page. Short Latin phrases only are reproduced.",
    kind: "testimony",
    rights: "Ancient Latin is public domain. Modern commentary is linked and paraphrased, not reproduced.",
    checkedAt: PLINY_REVIEW.checkedAt,
    limits: "A presentation of the same transmitted letters, not another ancient witness. Ministrae indicates a ministering role but does not explain these women’s duties or establish a later form of church office. The page’s commentary treats duci as technical legal language; compare the full English renderings rather than deriving an execution method from it.",
  },
  {
    id: "pliny-encounter-comparison",
    title: "Pliny & Trajan · English comparison",
    url: "https://faculty.georgetown.edu/jod/texts/pliny.html",
    locator: "Pliny to Trajan, paragraphs on persistent confessors and the two enslaved women; Trajan’s complete reply",
    edition: "Georgetown faculty-hosted English text. Translator unnamed on the retrieved page; no translator assigned.",
    kind: "testimony",
    rights: "Linked and paraphrased only; no translation wording reproduced.",
    checkedAt: PLINY_REVIEW.checkedAt,
    limits: "Same ancient record, not independent corroboration. Its execution and deaconesses renderings clarify differences from Melmoth, without settling the women’s exact office or recovering their own testimony.",
  },
  {
    id: "pliny-tertullian",
    title: "Tertullian · Apology II",
    url: "https://www.tertullian.org/anf/anf03/anf03-05.htm",
    locator: "Chapter II.6–9, the discussion of Pliny and Trajan",
    edition: "S. Thelwall translation, Ante-Nicene Fathers III. Translator credited above the work on the linked page.",
    kind: "interpretation",
    rights: "Historical public-domain translation linked; original editorial paraphrase only. No modern site material reproduced.",
    checkedAt: PLINY_REVIEW.checkedAt,
    limits: "Later Christian advocacy interpreting the Roman exchange. It is not testimony from the two women or independent confirmation of their interrogation. Its broader claims about legal practice are not adopted here.",
  },
];

export const PLINY_MOVEMENTS = [
  { id: "pliny-desk", short: "Desk", title: "The governor’s desk", number: "I" },
  { id: "pliny-accused", short: "Accused", title: "The accused", number: "II" },
  { id: "pliny-women", short: "Women", title: "The two women", number: "III" },
  { id: "pliny-reply", short: "Reply", title: "The emperor replies", number: "IV" },
  { id: "pliny-survives", short: "Record", title: "What survives", number: "V" },
] as const;

export const PLINY_PASSAGES = {
  doubt: { text: "IT is my invariable rule, Sir, to refer to you in all matters where I feel doubtful;", letter: "pliny", locator: "10.96.1" },
  asked: { text: "I asked them whether they were Christians;", letter: "pliny", locator: "10.96.3" },
  repeated: { text: "I repeated the question twice, and threatened them with punishment;", letter: "pliny", locator: "10.96.3" },
  persisted: { text: "if they persisted, I ordered them to be at once punished:", letter: "pliny", locator: "10.96.3" },
  meal: { text: "to eat in common a harmless meal.", letter: "pliny", locator: "10.96.7" },
  women: { text: "putting two female slaves to the torture", letter: "pliny", locator: "10.96.8" },
  pursuit: { text: "Do not go out of your way to look for them.", letter: "trajan", locator: "10.97" },
  punishment: { text: "If indeed they should be brought before you, and the crime is proved, they must be punished;", letter: "trajan", locator: "10.97" },
  pardon: { text: "with the restriction, however, that where the party denies he is a Christian, and shall make it evident that he is not, by invoking our gods, let him (notwithstanding any former suspicion) be pardoned upon his repentance.", letter: "trajan", locator: "10.97" },
  anonymous: { text: "Anonymous informations ought not to be received in any sort of prosecution.", letter: "trajan", locator: "10.97" },
} as const;
export type PlinyPassageId = keyof typeof PLINY_PASSAGES;

export const PLINY_COPY = {
  introduction: "Pliny the Younger, Roman governor of Bithynia-Pontus, writes to Emperor Trajan about people accused of being Christians. He has already ordered punishments. Now he asks what policy to follow.",
  setting: "Bithynia-Pontus · early second century CE",
  desk: "He asks whether age should matter. Whether repentance should bring pardon. Whether the name Christian is enough to punish, even without another offense. These are questions from a man already exercising the power he wants explained.",
  accused: "In his account, an answer can become a sentence. Pliny questions those brought before him, repeats the question, and threatens punishment. He describes those who persist through the language of obstinacy.",
  execution: "He reports ordering persistent confessors to execution. This translation says ‘punished’; the English comparison makes execution explicit. No method or number is given. Roman citizens, he says, were to be sent to Rome.",
  denial: "An anonymous list brings more names into the proceedings. People who deny being Christians repeat an invocation to the gods, offer wine and incense before the emperor’s image, and curse Christ. Pliny says he releases them. His test requires an act of worship, beyond an answer to a question.",
  gathering: "Those questioned also describe gathering before dawn, addressing Christ as a divinity, binding themselves against wrongdoing, and sharing food. A community appears for a moment through its practices. Even this account reaches us through the governor’s questioning.",
  women: "After relaying that account, Pliny says he sought further information by torturing two enslaved women. He calls them ministrae: women said to have a ministering role. The letter does not explain their duties.",
  womenAfter: "He moves on to his judgment of their religion and his decision to consult the emperor. Neither woman’s name appears. Their words are not recorded. The letters do not tell us what happened to them afterward.",
  womenLimit: "The silence is in this record. It is not the measure of their lives.",
  reply: "Trajan approves the governor’s course, while refusing to set one general rule for every case. His answer restricts pursuit and accusation. It also preserves punishment.",
  replyAfter: "Pardon is conditional: the accused must deny being Christian and demonstrate it by invoking the Roman gods. Trajan also rejects anonymous accusations—the kind of list Pliny has already described using.",
  survives: "The exchange preserves a governor’s questions and an emperor’s answer. It also preserves traces of people who gathered, shared food, denied an accusation, or persisted under threat. The record is fuller about the officials’ decisions than about the people subjected to them.",
  ending: "We can read what Pliny chose to report. We cannot recover the women’s testimony from his account.",
} as const;

// Each bridge's bounded claim, including limits of textual absence, has a locator.
export const PLINY_CLAIMS = [
  { id: "P1", fields: ["introduction", "setting", "desk"], sourceIds: ["pliny-encounter-melmoth", "pliny-encounter-comparison"], locator: "10.96.1–4, 9; Georgetown introduction", evidenceClass: "Roman administrative testimony" },
  { id: "P2", fields: ["accused", "execution"], sourceIds: ["pliny-encounter-melmoth", "pliny-latin", "pliny-encounter-comparison"], locator: "10.96.3–4", evidenceClass: "Roman administrative testimony; translation comparison" },
  { id: "P4", fields: ["denial"], sourceIds: ["pliny-encounter-melmoth"], locator: "10.96.5–6", evidenceClass: "Roman administrative testimony" },
  { id: "P5", fields: ["gathering"], sourceIds: ["pliny-encounter-melmoth"], locator: "10.96.7", evidenceClass: "Reported testimony inside an official account" },
  { id: "P6", fields: ["women", "womenAfter", "womenLimit"], sourceIds: ["pliny-encounter-melmoth", "pliny-latin"], locator: "10.96.8–9; complete 10.96–97 for textual absences", evidenceClass: "Roman administrative testimony; bounded editorial reading" },
  { id: "P9", fields: ["reply", "replyAfter"], sourceIds: ["pliny-encounter-melmoth"], locator: "10.97; compare 10.96.5", evidenceClass: "Roman administrative testimony" },
  { id: "P11", fields: ["survives", "ending"], sourceIds: ["pliny-encounter-melmoth"], locator: "10.96–97", evidenceClass: "Editorial synthesis and limits" },
] as const;
