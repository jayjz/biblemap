import type { HumanEntry, HumanSource } from "../domain/human-story.ts";

/** No-index review copy requested by the creator. Never an approval record. */
export const ROMANUS_REVIEW = {
  status: "draft",
  authorship: "AI-assisted editorial summaries and modern artistic interpretation",
  humanReview: "Historical, theological and literary review pending",
} as const;

export const ROMANUS_SOURCES: readonly HumanSource[] = [
  {
    id: "romanus-short", title: "Eusebius · Martyrs of Palestine, shorter Greek recension",
    url: "https://www.newadvent.org/fathers/2505.htm", locator: "Introduction; 1.4–5; 2.1–5; 3.1",
    edition: "Arthur Cushman McGiffert, Nicene and Post-Nicene Fathers, second series, vol. 1 (1890), transcribed by New Advent. Early fourth-century Christian commemoration; the shorter recension is a reworking of a longer work.",
    kind: "testimony", checkedAt: "2026-11-04",
    rights: "Historical public-domain translation. Two brief credited excerpts; all other narrative is original editorial summary.",
    limits: "Eusebius lived through the persecution, but this chapter does not say he witnessed the events at Antioch. It reports no speech after the mutilation. Its theological judgments remain the author's. Neither a court transcript nor Romanus's own surviving writing.",
  },
  {
    id: "romanus-syriac", title: "Eusebius · longer account preserved in Syriac",
    url: "https://archive.org/stream/historyofmartyrs00euse/historyofmartyrs00euse_djvu.txt", locator: "Cureton's printed pp. 6–8, especially p. 8, lines 1–23",
    edition: "William Cureton, History of the Martyrs in Palestine (1861), English translation of Syriac. Relevant translation inspected through digitized OCR; the Syriac manuscript was not inspected. No OCR wording quoted.",
    kind: "testimony", checkedAt: "2026-11-04", rights: "Public-domain historical edition; original summaries only.",
    limits: "The longer Greek recension is generally dated around 311; its complete text survives in Syriac translation, including a manuscript dated 411. This is a textual witness to Eusebius, not a separate eyewitness. Translator/redactor expansion is a scholarly possibility; shorter does not automatically mean earlier.",
  },
  {
    id: "romanus-transmission", title: "Sergey Minov · Eusebius and the Syriac transmission",
    url: "https://doi.org/10.25446/oxford.13797260", locator: "CSLA E00295, overview and discussion; companion E00294, doi:10.25446/oxford.13797248",
    edition: "The Cult of Saints in Late Antiquity, University of Oxford. Complete catalog discussions inspected; includes BL Add. 12150 and its November 411 colophon, plus bibliography.",
    kind: "scholarship", checkedAt: "2026-11-04", rights: "Catalog metadata CC0. Original editorial summary; no manuscript reproduction.",
    limits: "A scholarly synthesis, not direct examination of the manuscript here. References to Barnes's proposal about the miracle are mediated through this entry; Barnes's full book was not read.",
  },
  {
    id: "romanus-chrysostom", title: "John Chrysostom · On Romanos",
    url: "https://doi.org/10.25446/oxford.13823093", locator: "CPG 4354; BHG 1601; PG 50.605–612; CSLA E02538, summary §§1–4",
    edition: "Accessed through Efthymios Rizos's full scholarly catalog summary. Critical edition: Rambault and Allen, Sources Chrétiennes 595 (2018); English translation: Wendy Mayer (2006), pp. 227–237. These complete editions were not inspected.",
    kind: "interpretation", checkedAt: "2026-11-04", rights: "CSLA record CC0. Original paraphrase of the identified summary; no translated homily quotation.",
    limits: "Accepted Chrysostom homily, distinct from the second sermon transmitted under his name (PG 50.611–618), generally judged inauthentic. CSLA dates this to 386–407, at Antioch or Constantinople; a narrower Antioch dating is also argued. Christian festival preaching, not eyewitness corroboration.",
  },
  {
    id: "romanus-prudentius", title: "Prudentius · Peristephanon, poem 10",
    url: "https://www.thelatinlibrary.com/prudentius/prud10.shtml", locator: "1–25 (invocation); 31–85 (setting); 891–1010 (mutilation and speech); 1096–1140 (death and records)",
    edition: "Latin text, The Latin Library, inspected alongside CSLA E00947 (doi:10.25446/oxford.13802798), which identifies Cunningham's 1966 edition and dates the poem around 400. Original summaries; one short Latin quotation.",
    kind: "reception", checkedAt: "2026-11-04", rights: "Ancient public-domain Latin text; no modern English translation reproduced.",
    limits: "A Latin Christian poem with extended anti-pagan argument, invocation and literary speeches. Written long after Romanus's death. Its depiction of a heavenly record is theological poetry, not a recovered document. Relationships to earlier passions are debated.",
  },
  {
    id: "romanus-tsartsidis", title: "Thomas Tsartsidis · the sources for Romanus",
    url: "https://hdl.handle.net/1842/25434", locator: "Commentary on Prudentius' Hymn to Romanus 1–650 (Edinburgh PhD, 2017), introduction §5, printed pp. 29–38",
    edition: "Repository PDF downloaded; the introduction's source survey inspected (PDF pp. 39–48), not the full thesis. Distinguishes the accepted and pseudo-Chrysostom sermons and identifies Eusebius of Emesa, De resurrectione, PG 24.1097–1100.",
    kind: "scholarship", checkedAt: "2026-11-04", rights: "Copyright retained by author/university. Linked and briefly paraphrased; no scanned page reproduced.",
    limits: "Eusebius of Emesa's underlying sermon was not directly read. Its attribution and reports of rain and renewed speech are presented here through Tsartsidis, not as newly verified independent testimony. Proposed source relationships and dates are scholarly arguments.",
  },
  {
    id: "romanus-chronology", title: "McGiffert · notes on date, sacrifice and emperor",
    url: "https://www.biblehub.com/library/pamphilius/church_history/chapter_ii_what_occurred_to.htm", locator: "NPNF notes 2627–2632 to Martyrs of Palestine 2",
    edition: "McGiffert's 1890 editorial notes, read separately from Eusebius's text and compared with Tsartsidis (2017), p. 29 n. 57.",
    kind: "scholarship", checkedAt: "2026-11-04", rights: "Historical public-domain commentary, linked and summarized.",
    limits: "An older scholarly interpretation, not consensus. Short Greek leaves the emperor unnamed; Syriac names Diocletian; McGiffert argues for Galerius. Arrest and execution were separated by imprisonment. Exact sequencing and reconciliation remain uncertain; the experience uses c. 303 rather than a precise-day reconstruction.",
  },
  {
    id: "romanus-daphne", title: "The Metropolitan Museum of Art · a floor from Daphne",
    url: "https://www.metmuseum.org/art/collection/search/253565", locator: "Mosaic floor panel, 38.11.12; object description and Open Access API object 253565",
    edition: "Roman, second century CE, stone, tile and glass. Found at Daphne-Harbiye near Antioch in 1937. Purchase, Joseph Pulitzer Bequest, 1938. Object record and image-level public-domain API flag inspected.",
    kind: "artifact", checkedAt: "2026-11-04", rights: "The Met Open Access / CC0. Local optimized derivatives of DP140137.jpg; full composition retained.",
    limits: "The central figure is a personification, traditionally Spring and now described as probably abundance/good living. It is not Romanus, a portrait of someone in his story, or evidence of his arrest. It predates the events.",
  },
  {
    id: "romanus-geography", title: "Cornell Archaeology · Caesarea Maritima",
    url: "https://archaeology.cornell.edu/caesarea-maritima", locator: "Site introduction; compare Eusebius 2.1,5 and the Met's Daphne object record for Antioch",
    edition: "Cornell University Archaeology Program, site description. The diagram uses broad coastal orientation; no ancient itinerary is reconstructed.",
    kind: "geography", checkedAt: "2026-11-04", rights: "Linked site description; original schematic drawing, no institutional map copied.",
    limits: "Modern site orientation cannot establish Romanus's exact village, journey, trial site or prison. Why and when he came to Antioch remain unknown in the short account.",
  },
];

export interface RomanusParagraph { text: string; sourceId: string; locator: string }
export interface RomanusMovement {
  id: string;
  label: string;
  title: string;
  paragraphs: readonly RomanusParagraph[];
}

/** Cohesive narrative spine, composed before visual staging; not Romanus's words. */
export const ROMANUS_MOVEMENTS: readonly RomanusMovement[] = [
  {
    id: "romanus-world", label: "His world", title: "A man from one city, remembered in another.",
    paragraphs: [
      { text: "We meet Romanus in someone else's writing. Eusebius, a Christian historian who lived through the persecution, calls him a deacon and exorcist of the church at Caesarea: a member of its ministry. The longer account places that service in a village around the city. Neither account gives us a childhood or a private life.", sourceId: "romanus-short", locator: "2.1; compare longer Syriac account, Cureton p. 6" },
      { text: "Caesarea lay on the eastern Mediterranean coast. Antioch lay farther north, near the coast in Roman Syria. Romanus was in Antioch when the events began. The shorter account does not explain why he was there. The distance between the cities is part of his story; an itinerary is not something we possess.", sourceId: "romanus-geography", locator: "Cornell site introduction; Eusebius 2.1,5" },
      { text: "Around 303, imperial measures against Christians were changing ordinary life. Eusebius describes church buildings being demolished and sacred books destroyed, followed by orders to imprison church leaders and compel sacrifice. His story of Romanus begins among people going to sacrifice: men, women and children.", sourceId: "romanus-short", locator: "Introduction; 2.1; distinguish the later general decree in 3.1" },
    ],
  },
  {
    id: "romanus-refusal", label: "The confrontation", title: "He raises his voice in public.",
    paragraphs: [
      { text: "Romanus rebukes the people he sees sacrificing. Eusebius describes his religious zeal; he does not preserve the words of this first rebuke in the shorter account. For Romanus, as Eusebius presents him, worship of these gods is incompatible with his Christian allegiance.", sourceId: "romanus-short", locator: "2.1–2" },
      { text: "Sacrifice was a public act as well as a religious one. Under persecution, it could become the act by which authorities measured compliance. Eusebius elsewhere describes people being counted as having sacrificed even while they resisted. Yet his shorter Romanus account does not say that every person in this crowd had been ordered to sacrifice. The longer Syriac version explicitly describes people being compelled.", sourceId: "romanus-short", locator: "1.4; 2.1; compare Cureton pp. 6–7" },
      { text: "His intervention brings arrest. The judge sentences him to burn. He is bound to a stake, with wood around him, while those attending wait for the emperor before lighting the fire. At this point the historian gives Romanus a question.", sourceId: "romanus-short", locator: "2.2" },
    ],
  },
  {
    id: "romanus-wound", label: "The punishment", title: "The fire is not lit.",
    paragraphs: [
      { text: "Romanus is brought before the emperor again. The punishment changes: his tongue is cut out. The shorter account describes him offering it willingly and interprets his endurance as the presence of divine power. That is Eusebius's Christian reading of bodily suffering, not access to everything Romanus felt.", sourceId: "romanus-short", locator: "2.3" },
      { text: "Then he is put in prison. The text does not tell us that he speaks again. It also does not state that renewed speech was impossible. The absence is precise: this account gives us no further words from him.", sourceId: "romanus-short", locator: "2.3–4" },
    ],
  },
  {
    id: "romanus-accounts", label: "The surviving voices", title: "Another text gives him speech.",
    paragraphs: [
      { text: "If we turn to the longer account preserved in Syriac, the story after the wound changes. It says Romanus speaks through God's gift, greeting people, exhorting them and praying. The difference is inside the textual tradition of Eusebius itself.", sourceId: "romanus-syriac", locator: "Cureton p. 8, lines 1–19" },
      { text: "Other writers will make that voice central to his memory. A preacher addresses a Christian congregation; a poet asks the martyr for the ability to write. They are doing different things with the same remembered life. Opening their texts lets us hear their claims without turning them into one continuous eyewitness account.", sourceId: "romanus-chrysostom", locator: "Rizos, summary §§1–4; Prudentius 10.1–25" },
    ],
  },
  {
    id: "romanus-memory", label: "Death and memory", title: "His life ends in prison.",
    paragraphs: [
      { text: "The shorter account returns to a prisoner held for a long time. An imperial anniversary approaches, with a release of prisoners. Romanus is instead stretched in the stocks and strangled. The longer Syriac account also ends in strangulation. Continued speech, in that telling, does not mean escape from death.", sourceId: "romanus-short", locator: "2.4–5; compare Cureton p. 8, lines 19–27" },
      { text: "Eusebius counts him among the Palestinian martyrs even though he died in Antioch. For this Christian historian, his death belongs to a community's remembrance. But the person reaches us through that act of remembrance: selected events, transmitted words, a writer's judgment.", sourceId: "romanus-short", locator: "2.5; compare 2.2–4" },
      { text: "Prudentius ends his poem by imagining two records. The official's papers decay; an angel's record before God endures. That is the poet's theological vision. What we can read is the poem itself, alongside other texts that preserve Romanus differently. We have their writing. We do not have his voice apart from it.", sourceId: "romanus-prudentius", locator: "10.1111–1135" },
    ],
  },
];

export const ROMANUS_LEAVES = [
  {
    id: "romanus-leaf-syriac", title: "Open the longer Syriac account", author: "Eusebius, in Syriac transmission",
    date: "Longer work c. 311; surviving manuscript dated 411", genre: "Martyr narrative · translated textual witness",
    text: "After the tongue is removed, Romanus speaks through God's gift. He greets acquaintances, encourages worship of God, and prays. The account continues with his death by strangulation.",
    observation: "This is not an independent witness added to Eusebius. The long work likely preceded the short reworking, but the surviving Syriac translation may contain expansions. We cannot securely assign this passage to the lost Greek original simply because it appears here.",
    sourceIds: ["romanus-syriac", "romanus-transmission"], locator: "Cureton p. 8; Minov, E00295",
  },
  {
    id: "romanus-leaf-chrysostom", title: "Open the preacher’s remembrance", author: "John Chrysostom",
    date: "Late fourth / early fifth century, 386–407", genre: "Festival homily · Christian theological interpretation",
    text: "In the accepted homily, a doctor cuts out the tongue, yet a stronger spiritual voice sounds. Chrysostom presents the attempted silencing as defeat for the Devil. He begins with love: martyrdom without love has no effect.",
    observation: "This summary follows Efthymios Rizos's catalog account, not a directly inspected complete translation. The accepted homily is distinct from a second, generally inauthentic sermon under Chrysostom's name. Neither is Romanus speaking to us without a preacher between.",
    sourceIds: ["romanus-chrysostom", "romanus-tsartsidis"], locator: "CPG 4354, PG 50.605–612; Rizos §§1–4; Tsartsidis pp. 30–31",
  },
  {
    id: "romanus-leaf-prudentius", title: "Open the poet’s invocation", author: "Prudentius",
    date: "Around 400", genre: "Latin Christian poetry · polemic and invocation",
    text: "The poet addresses Romanus and asks for eloquence. A martyr who spoke without a tongue can, in the poem's logic, help a faltering poet speak. Later, Prudentius gives Romanus a long argument against traditional cults, even after the mutilation.",
    observation: "The poem's speeches are literary composition, not a transcript. Its attacks on other religions belong to Prudentius's polemical Christian perspective. His opening declares the conviction behind the title of this encounter.",
    sourceIds: ["romanus-prudentius"], locator: "10.1–25; 931–1010",
  },
] as const;

export const ROMANUS_ENTRY: HumanEntry = {
  id: "romanus", title: "Romanus: the voice they could not silence",
  subtitle: "A man in Antioch. A life preserved in different words.", worlds: ["saints", "voices"],
  kind: "testimony", era: "Death c. 303 CE; remembrance across later centuries",
  entityIds: [], introduction: "Romanus was a Christian deacon from the church around Caesarea. In Antioch, during the persecution associated with Diocletian, he publicly challenged sacrifice to the gods. Eusebius records his arrest, mutilation and death. Other surviving texts remember a voice that continued after his tongue was removed.",
  sections: ROMANUS_MOVEMENTS.map(m => ({ id: m.id, title: m.title, text: m.paragraphs.map(p => p.text).join(" "), sourceIds: [...new Set(m.paragraphs.map(p => p.sourceId))] })),
  question: "When we keep someone's voice alive, how much of what survives is theirs—and how much is ours?",
  sourceIds: ROMANUS_SOURCES.map(s => s.id), reviewStatus: "draft",
};
