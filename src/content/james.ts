import type { HumanEntry, HumanSource } from "../domain/human-story.ts";

export const JAMES_REVIEW = {
  status: "draft",
  authorship: "AI-assisted editorial summaries, transitions and symbolic SVG/CSS artwork",
  humanReview: "Historical, theological, literary and artistic review pending",
} as const;

const scripture = (id: string, title: string, chapter: string, locator: string, limits: string): HumanSource => ({
  id, title, url: `https://ebible.org/engwebp/${chapter}.htm`, locator, kind: "scripture",
  edition: "World English Bible, updated 66-book edition (engwebp). Checked 4 November 2026. Ancient writings transmitted through later manuscripts; no autograph is claimed.",
  checkedAt: "2026-11-04", rights: "Public-domain WEB text. Summaries are modern editorial work, separate from quotations.", limits,
});

export const JAMES_SOURCES: readonly HumanSource[] = [
  scripture("james-mark", "Mark · the family named", "MRK06", "6:1–6, especially 6:3; compare Mark 1:9 for Nazareth in Galilee", "Gospel narrative. Names James as a brother; does not give his childhood, appearance or personal reaction in this scene."),
  scripture("james-galatians-one", "Paul · a person he met", "GAL01", "1:18–20", "First-person report of meeting James in Jerusalem. Paul does not describe their conversation or say he witnessed the appearance to James."),
  scripture("james-corinthians", "Paul · the appearance to James", "1CO15", "15:3–8, especially 15:7", "Paul transmits resurrection testimony. James does not narrate the appearance here. Its place, date and words are not supplied; identification with the Jerusalem leader is a historical reading."),
  scripture("james-galatians-two", "Paul · fellowship and disagreement", "GAL02", "2:1–14, especially 2:9–12", "A participant's argument. People came from James; the text does not state that James ordered Peter to withdraw from Gentile meals. Peter and Cephas name the same person."),
  scripture("james-acts-twelve", "Acts · news for James", "ACT12", "12:2 and 12:17", "The James killed in verse 2 is John's brother, the son of Zebedee. The James to be informed in verse 17 is another person, normally identified with the Jerusalem leader."),
  scripture("james-acts-fifteen", "Acts · a decision in Jerusalem", "ACT15", "15:1–29, especially 15:13–21", "Narrative portrayal of deliberation and a speech, not a recovered transcript. Its relationship to the meetings in Galatians is debated; no precise harmonization is imposed."),
  { ...scripture("james-acts-twentyone", "Acts · James and the elders", "ACT21", "21:17–26", "Acts places James with the elders receiving Paul. It does not give a complete constitution of the community or James's private motives."), edition: "WEB. Acts 21 inspected in historical-evidence repository snapshot 00f96e5f9df5197225aa405f411ce2aad5cdd136; publisher page was unavailable through the research browser. Summary only; no new quotation." },
  {
    id: "james-josephus", title: "Josephus · the death record", kind: "testimony",
    url: "https://penelope.uchicago.edu/josephus/ant-20.html", locator: "Antiquities 20.197–203, especially 20.200; Whiston 20.9.1",
    edition: "William Whiston's 1737 translation, Project Penelope. Antiquities was written around 93/94 CE. Modern notes and bracketed dates are not Josephus's words.",
    rights: "Public-domain historical translation. Short identifying phrase quoted; original summary of the episode.", checkedAt: "2026-11-04",
    limits: "A later historical report, not a trial deposition. It does not verify resurrection beliefs, a refusal to recant, last words or the temple-fall tradition. Authenticity of the received identification has been challenged; see the scholarly source below.",
  },
  {
    id: "james-eusebius", title: "Hegesippus through Eusebius · later memory", kind: "legend",
    url: "https://www.newadvent.org/fathers/250102.htm", locator: "Church History 2.1.2–5; 2.23.1–25; Hegesippus extract 2.23.4–18",
    edition: "Arthur Cushman McGiffert, NPNF, second series, vol. 1 (1890). Early fourth-century Eusebius quotes the second-century Memoirs of Hegesippus, a work no longer extant in full.",
    rights: "Public-domain historical translation, linked and summarized; no reconstructed speech.", checkedAt: "2026-11-04",
    limits: "One author preserving another, not two independent eyewitnesses. Ascetic practices, temple fall and the fuller's blow belong to later tradition. Eusebius's attribution of Jerusalem's catastrophe to James's death is absent from extant Antiquities 20.200.",
  },
  {
    id: "james-jerome", title: "Jerome · interpretations of brotherhood", kind: "interpretation",
    url: "https://www.newadvent.org/fathers/2708.htm", locator: "On Illustrious Men 2",
    edition: "Ernest Cushing Richardson, NPNF, second series, vol. 3 (1892). Jerome writes in the late fourth century.",
    rights: "Public-domain historical translation, linked and summarized.", checkedAt: "2026-11-04",
    limits: "Preserves a stepbrother interpretation and favors a cousin interpretation. This is later theological interpretation, not a resolution of the family genealogy. Also acknowledges disputed authorship of the epistle attributed to James.",
  },
  {
    id: "james-transmission", title: "T. C. Schmidt · assessing Josephus", kind: "scholarship",
    url: "https://academic.oup.com/book/60034/chapter/513641505", locator: "Josephus and Jesus (2025), Appendix 2, pp. 231–248",
    edition: "Scholarly discussion inspected, including Origen and the Greek/Latin transmission. Defends authenticity; compare Nicholas P. L. Allen (2017), DOI 10.1080/2222582X.2017.1317008, publisher abstract only, arguing interpolation.",
    rights: "Modern scholarship linked and briefly paraphrased, no translated passage reproduced.", checkedAt: "2026-11-04",
    limits: "A defended interpretation, not an ancient witness. Around 62 CE is inferred from the succession of governors. Manuscripts and quotations transmit the text; we have not independently collated them.",
  },
];

export const JAMES_QUOTES = {
  family: { text: "Isn’t this the carpenter, the son of Mary and brother of James, Joses, Judah, and Simon? Aren’t his sisters here with us?” So they were offended at him.", reference: "Mark 6:3", sourceId: "james-mark" },
  meeting: { text: "But of the other apostles I saw no one except James, the Lord’s brother.", reference: "Galatians 1:19", sourceId: "james-galatians-one" },
  appearance: { text: "Then he appeared to James, then to all the apostles,", reference: "1 Corinthians 15:7", sourceId: "james-corinthians" },
} as const;

export type JamesMovementId = "brother" | "appearance" | "jerusalem" | "record" | "remained";
export type JamesWitnessId = "mark" | "paul" | "acts" | "josephus" | "memory";
export interface JamesParagraph { text: string; sourceIds: readonly string[]; locator: string }
export interface JamesMovement {
  id: JamesMovementId; label: string; title: string; place: string; art: string;
  paragraphs: readonly JamesParagraph[]; quote?: keyof typeof JAMES_QUOTES;
}

export const JAMES_MOVEMENTS: readonly JamesMovement[] = [
  {
    id: "brother", label: "The brother", title: "Before a title, a relationship.", place: "Galilee · the family setting", art: "A name among other names",
    quote: "meeting",
    paragraphs: [
      { text: "James was a Jewish member of Jesus’s family who became a leading figure in the community of Jesus’s followers in Jerusalem. Mark names him among Jesus’s brothers. Paul, writing about a visit to Jerusalem, calls him the Lord’s brother. Later Christian memory knows him as James the Just.", sourceIds: ["james-mark", "james-galatians-one", "james-eusebius"], locator: "Mark 6:3; Galatians 1:18–19; Eusebius 2.23.4–7" },
      { text: "Mark places Jesus’s origins in Nazareth in Galilee. But a named family is not a recovered childhood. These passages give us no scene of the two growing up, no private conversation, and no likeness of James. Christian traditions have also understood the family relationship differently: as a sibling, a stepbrother or a cousin.", sourceIds: ["james-mark", "james-jerome"], locator: "Mark 1:9; 6:3; Jerome, On Illustrious Men 2" },
      { text: "Paul brings us closer to a person he says he met. He gives us a name and a relationship. In another letter, he preserves something more extraordinary—and far more brief than a scene.", sourceIds: ["james-galatians-one", "james-corinthians"], locator: "Galatians 1:18–20; 1 Corinthians 15:7" },
    ],
  },
  {
    id: "appearance", label: "The appearance", title: "One line. No scene survives.", place: "Place unrecorded", art: "Space left for what is not described", quote: "appearance",
    paragraphs: [
      { text: "In a letter to the Corinthians, Paul sets out testimony that Christ died, was buried, was raised, and appeared to others. He names an appearance to James. This James is usually understood as the Jerusalem leader, though this verse does not identify him by family.", sourceIds: ["james-corinthians", "james-galatians-one"], locator: "1 Corinthians 15:3–8; compare Galatians 1:19" },
      { text: "Paul is reporting an appearance to someone else; he speaks of the appearance to himself in the next verse. James’s own account is not given here. There is no place, no conversation, no description of what he saw. The words make a resurrection claim without supplying an encounter we can reconstruct.", sourceIds: ["james-corinthians"], locator: "1 Corinthians 15:7–8" },
      { text: "The sources do not tell us how that reported appearance led to James’s role in Jerusalem. When Paul next describes their relationships, James is already a figure whose recognition matters.", sourceIds: ["james-corinthians", "james-galatians-two"], locator: "1 Corinthians 15:7; Galatians 2:1–10" },
    ],
  },
  {
    id: "jerusalem", label: "Jerusalem", title: "A community. A difficult fellowship.", place: "Jerusalem · and a dispute in Antioch", art: "Separate voices gather, without becoming one",
    paragraphs: [
      { text: "Paul names James, Cephas—Peter—and John as reputed pillars. They extend fellowship to Paul and Barnabas and ask them to remember the poor. The question is not only who leads, but how Jewish and Gentile believers will belong together.", sourceIds: ["james-galatians-two"], locator: "Galatians 2:1–10" },
      { text: "Fellowship does not remove disagreement. In Antioch, Paul says Peter withdraws from eating with Gentiles after people arrive from James. Paul opposes him. He does not say that James ordered Peter’s withdrawal; we should not put that instruction into James’s mouth.", sourceIds: ["james-galatians-two"], locator: "Galatians 2:11–14" },
      { text: "Acts offers another narrative perspective. Peter asks that news be brought to James. Later, James speaks in a Jerusalem debate about Gentile believers; still later, Paul visits him with the elders present. Together these scenes portray a consequential leader. They do not turn Acts into James’s autobiography, or settle how every meeting aligns with Paul’s letters.", sourceIds: ["james-acts-twelve", "james-acts-fifteen", "james-acts-twentyone"], locator: "Acts 12:17; 15:13–21; 21:17–26" },
    ],
  },
  {
    id: "record", label: "The record", title: "His death enters another history.", place: "Jerusalem · around 62 CE, inferred", art: "A break in the record",
    paragraphs: [
      { text: "Josephus, a Jewish historian writing decades later, records a crisis between Roman governors. Festus has died; Albinus has not yet arrived. The high priest Ananus brings James and others before a council of judges, accuses them of breaking the law, and delivers them to be stoned.", sourceIds: ["james-josephus", "james-transmission"], locator: "Antiquities 20.197–200; Schmidt, Appendix 2" },
      { text: "In the received text, James is identified as the brother of Jesus who was called Christ. Citizens object to Ananus’s actions. Albinus threatens punishment, and King Agrippa removes Ananus from the high priesthood. Josephus’s concern is also with authority and its abuse; the account includes people who opposed the action.", sourceIds: ["james-josephus"], locator: "Antiquities 20.200–203" },
      { text: "The notice is brief. It does not specify the alleged offense, give James’s last words, or say that he was offered life if he denied the resurrection. Around 62 CE is inferred from the succession of governors. The received passage and its transmission remain open to historical examination.", sourceIds: ["james-josephus", "james-transmission"], locator: "Antiquities 20.200; Schmidt, Appendix 2" },
    ],
  },
  {
    id: "remained", label: "What remained", title: "The life ends. The telling grows.", place: "Later Christian memory", art: "Memory adds layers to a surviving name",
    paragraphs: [
      { text: "Hegesippus, a second-century Christian writer preserved by the fourth-century historian Eusebius, gives a fuller portrait: James the Just, devoted to prayer and ascetic practice. His account tells of a fall from the temple, stoning, and a final blow from a fuller. These are later traditions, not details supplied by Paul or confirmed by Josephus.", sourceIds: ["james-eusebius"], locator: "Eusebius, Church History 2.23.4–18" },
      { text: "We encounter Hegesippus through Eusebius’s quotation; the complete Memoirs do not survive. Their two names do not give us two independent eyewitnesses. Nor can the longer martyrdom story simply be laid over Josephus’s account as the missing footage.", sourceIds: ["james-eusebius", "james-josephus"], locator: "Eusebius 2.23.3–25; Antiquities 20.200" },
      { text: "A brother named. An appearance reported. A leader encountered. A death recorded. A just man remembered. James reaches us through these different voices. The spaces between them remain part of what has survived.", sourceIds: ["james-mark", "james-corinthians", "james-galatians-two", "james-josephus", "james-eusebius"], locator: "Mark 6:3; 1 Corinthians 15:7; Galatians 2:9; Antiquities 20.200; Eusebius 2.23" },
    ],
  },
];

export interface JamesWitness {
  id: JamesWitnessId; name: string; genre: string; period: string; transmission: string;
  layers: Partial<Record<JamesMovementId, { text: string; limit: string; sourceIds: readonly string[] }>>;
}
export const JAMES_WITNESSES: readonly JamesWitness[] = [
  { id: "mark", name: "Mark", genre: "Gospel narrative", period: "First-century Christian writing", transmission: "A narrative about Jesus; not a memoir written by James.", layers: {
    brother: { text: "James is named among Jesus’s brothers in the hometown scene.", limit: "The audience’s reaction is not a recorded personal response from James.", sourceIds: ["james-mark"] },
    remained: { text: "A name in a family survives in the Gospel narrative.", limit: "Mark does not narrate this James’s later leadership or death.", sourceIds: ["james-mark"] },
  } },
  { id: "paul", name: "Paul", genre: "Participant’s letters · resurrection testimony", period: "First-century Christian writing", transmission: "Paul reports his own meetings, but transmits the appearance to James as a report about another person.", layers: {
    brother: { text: "Paul says he saw James in Jerusalem and calls him the Lord’s brother.", limit: "He preserves no conversation from that meeting.", sourceIds: ["james-galatians-one"] },
    appearance: { text: "Paul names an appearance of the risen Christ to James in 1 Corinthians 15:7.", limit: "No location or dialogue; this is not James’s own account or Paul’s claim to have watched it.", sourceIds: ["james-corinthians"] },
    jerusalem: { text: "James, Cephas and John extend fellowship. Later, people from James arrive before Peter withdraws from Gentile meals.", limit: "Paul does not say that James ordered the withdrawal.", sourceIds: ["james-galatians-two"] },
    remained: { text: "Paul preserves both recognition and disagreement within the early movement.", limit: "These letters do not narrate James’s death.", sourceIds: ["james-galatians-one", "james-galatians-two"] },
  } },
  { id: "acts", name: "Acts", genre: "Biblical narrative of the early movement", period: "Early Christian writing · dating debated", transmission: "A literary narrative with speeches and scenes. Its alignment with Galatians is not assumed.", layers: {
    jerusalem: { text: "News is to reach James; he speaks in the Gentile debate; he receives Paul with the elders.", limit: "Acts 12:2 concerns James son of Zebedee, a different James from the leader in 12:17.", sourceIds: ["james-acts-twelve", "james-acts-fifteen", "james-acts-twentyone"] },
    remained: { text: "The Jerusalem leader remains visible through several scenes of community life.", limit: "Acts does not give this James’s death or a personal autobiography.", sourceIds: ["james-acts-twelve", "james-acts-fifteen", "james-acts-twentyone"] },
  } },
  { id: "josephus", name: "Josephus", genre: "Jewish historical writing", period: "Antiquities · around 93/94 CE", transmission: "A report written after the event and preserved through textual transmission; not a court transcript.", layers: {
    brother: { text: "The received death notice identifies James as brother of Jesus who was called Christ.", limit: "A brief identification, not a family history. The wording’s authenticity has been challenged.", sourceIds: ["james-josephus", "james-transmission"] },
    record: { text: "Ananus accuses James and others of lawbreaking and delivers them for stoning. Citizens object; Ananus loses office.", limit: "No specified offense, resurrection confession, temple fall, or last words.", sourceIds: ["james-josephus"] },
    remained: { text: "A short death notice survives within a political history.", limit: "This is independent authorship, not independent verification of every Christian tradition about James.", sourceIds: ["james-josephus"] },
  } },
  { id: "memory", name: "Later memory", genre: "Christian remembrance · transmitted tradition", period: "Hegesippus, second century → Eusebius, fourth century", transmission: "Eusebius quotes Hegesippus. Two authors in a chain of transmission do not equal two independent eyewitnesses.", layers: {
    brother: { text: "Later Christian writers preserve the title “the Just” and differing readings of his family relationship.", limit: "Jerome discusses stepbrother and cousin readings; neither is a recovered genealogy.", sourceIds: ["james-eusebius", "james-jerome"] },
    jerusalem: { text: "Later writers remember James as the first bishop of Jerusalem.", limit: "This later title should not silently determine the institutional structure of the earliest community.", sourceIds: ["james-eusebius"] },
    record: { text: "Hegesippus’s account adds a temple fall, stoning and a fuller’s final blow.", limit: "The expanded account cannot be presented as details corroborated by Josephus.", sourceIds: ["james-eusebius"] },
    remained: { text: "Prayer, asceticism and martyrdom shape the remembered James the Just.", limit: "These traditions illuminate Christian memory without giving us an uncontested physical likeness or authenticated last words.", sourceIds: ["james-eusebius"] },
  } },
];

export const JAMES_ENTRY: HumanEntry = {
  id: "james", title: "James: The Brother Who Remained", subtitle: "A brother of Jesus. A leader in Jerusalem. A life in surviving voices.",
  worlds: ["saints", "witnesses", "stories"], kind: "testimony", era: "First-century Jerusalem; death around 62 CE (inferred); later Christian memory",
  entityIds: ["person-james", "person-jesus", "person-paul", "place-jerusalem"],
  introduction: "Meet James through Paul’s letters, biblical narratives, Josephus’s history and later Christian memory. Each preserves something different.",
  sections: JAMES_MOVEMENTS.map(m => ({ id: m.id, title: m.title, text: m.paragraphs.map(p => p.text).join(" "), sourceIds: [...new Set(m.paragraphs.flatMap(p => p.sourceIds))] })),
  question: "What changes when we let each witness keep its own limits?", sourceIds: JAMES_SOURCES.map(s => s.id), reviewStatus: "draft",
  reading: { label: "Read James’s story without the visual staging", href: "/human-story/james/reading/" },
};
