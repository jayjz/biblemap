import type { HumanSource } from "../domain/human-story.ts";

/** Sourced editorial preview. New connective prose awaits human review.
 * The original 1887 printed edition, not New Advent's revised translation,
 * governs these two excerpts. Full paragraph contexts are pinned separately.
 */
export const JONAH_LETTER_REVIEW = { status: "draft", checkedAt: "2026-11-14" } as const;

export const JONAH_LETTER_SOURCES: readonly HumanSource[] = [
  {
    id: "augustine-jerome",
    title: "Augustine to Jerome · Letter 71",
    url: "https://www.ccel.org/ccel/schaff/npnf101.vii.1.LXXI.html",
    locator: "Chapter III, §5, printed p. 327; Letter 104 in Jerome's collection",
    edition: "Dated 403 in the edition. J. G. Cunningham translation, Nicene and Post-Nicene Fathers, Series I, Volume I (Buffalo: Christian Literature Publishing Co., 1887). Excerpt checked against the printed page, not New Advent's modern revision.",
    kind: "interpretation",
    checkedAt: JONAH_LETTER_REVIEW.checkedAt,
    rights: "The 1887 English translation is public domain in the United States. Only historical text is excerpted, with author, translator and edition credited; no modern CCEL introduction, annotations, site design or audio is reproduced. Reuse outside the US requires the applicable local assessment.",
    limits: "Later Christian reception of Jonah. Augustine reports an incident in Oea; this is neither a transcript of the gathering nor independent evidence for Jonah's narrated events. He does not identify the disputed plant-word in this letter. His hostile characterization of Jewish readers is his polemic, not BibleMap's judgment.",
  },
  {
    id: "jerome-augustine",
    title: "Jerome to Augustine · Letter 112 / 75",
    url: "https://www.ccel.org/ccel/schaff/npnf101.vii.1.LXXV.html",
    locator: "Chapter VII, §22, printed p. 342; Letter 75 in Augustine's collection, 112 in Jerome's",
    edition: "Dated 404 in the edition. J. G. Cunningham translation, Nicene and Post-Nicene Fathers, Series I, Volume I (1887). Excerpt checked against the printed page. The English plant-names translate a discussion of Jerome's Latin rendering of Hebrew.",
    kind: "interpretation",
    checkedAt: JONAH_LETTER_REVIEW.checkedAt,
    rights: "Public-domain 1887 English translation; credited historical excerpt only. No modern editorial additions or digitized scan are republished. Reuse basis is US public domain, not a blanket license over the hosting website.",
    limits: "Jerome identifies the unnamed-word complaint with the older gourd/ivy dispute. His reply quotes Augustine's report; the two letters are not independent witnesses to the Oea incident. His botanical explanation is an argument in the letter, not a settled identification of Jonah's plant. His polemic against Jewish readers is not endorsed.",
  },
];

export const JONAH_LETTERS = [
  {
    id: "augustine-report",
    sourceId: "augustine-jerome",
    author: "Augustine",
    year: "403",
    action: "Hear Augustine’s report",
    concern: "A congregation may leave.",
    bridge: "Augustine writes to Jerome about a fellow bishop whose congregation in Oea resisted a changed reading of Jonah. He does not name the disputed word.",
    quote: "The man was compelled to correct your version in that passage as if it had been falsely translated, as he desired not to be left without a congregation,—a calamity which he narrowly escaped.",
    locator: "Letter 71 · III.5 · p. 327",
    boundary: "One writer’s report, not a transcript of the gathering.",
    scanUrl: "https://ccel.org/ccel/schaff/npnf101/png/0335=327.png",
  },
  {
    id: "jerome-translation",
    sourceId: "jerome-augustine",
    author: "Jerome",
    year: "404",
    action: "Read Jerome’s reply",
    concern: "An unfamiliar word needs a name.",
    bridge: "Jerome, the translator, identifies the complaint with the older dispute over gourd and ivy. He explains the difficulty of making the Hebrew plant-name intelligible to his readers.",
    quote: "If, therefore, in translating word for word, I had put the word “ciceia,” no one would know what it meant; if I had used the word “gourd,” I would have said what is not found in the Hebrew. I therefore put down “ivy,” that I might not differ from all other translators.",
    locator: "Letter 112 / 75 · VII.22 · p. 342",
    boundary: "The translator’s defense, not a botanical verdict.",
    scanUrl: "https://ccel.org/ccel/schaff/npnf101/png/0350=342.png",
  },
] as const;
