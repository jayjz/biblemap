import type { HumanSource } from "../domain/human-story.ts";

// Fixed excerpts for the no-index PR review. Historical voices, not creator notes.
export const INTERIOR_SOURCES: readonly HumanSource[] = [
  {
    id: "pliny-melmoth",
    title: "Pliny and Trajan: the letters",
    url: "https://www.gutenberg.org/files/2811/2811-h/2811-h.htm",
    locator:
      "Letters 10.96–97; numbered XCVII–XCVIII in this edition’s Correspondence with Trajan",
    edition:
      "William Melmoth, revised by F. C. T. Bosanquet. Historical English translation, Project Gutenberg 2811. Selected excerpts retain its wording.",
    kind: "testimony",
    limits:
      "Roman officials writing about Christians in Bithynia, early second century. Their descriptions are interested testimony, not neutral transcripts or a record of Perpetua’s later trial in Carthage.",
    rights:
      "Historical translation in the public domain in the United States. Short credited excerpts; Project Gutenberg trademark and license boilerplate not reproduced.",
    checkedAt: "2026-11-01",
  },
  {
    id: "passion-wallis",
    title: "The Passion: Wallis translation",
    url: "https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_II",
    locator: "Passion §§3 and 6; ANF Argument I.2 and II.2",
    edition:
      "R. E. Wallis, Ante-Nicene Fathers III (1885). The electronic transcription’s ‘no long’ is corrected to ‘no [longer]’. Other displayed wording retained.",
    kind: "testimony",
    limits:
      "The transmitted work attributes this first-person account to Perpetua. Translation, transmission and editorial framing stand between the reader and the events; the father’s reason for refusing the child is not stated.",
    rights:
      "Public-domain historical English translation. Exact excerpts credited separately from the modernized Fordham edition.",
    checkedAt: "2026-11-01",
  },
];

export const INTERIOR_PASSAGES = {
  pliny: {
    text: "In the meanwhile, the method I have observed towards those who have been brought before me as Christians is this: I asked them whether they were Christians; if they admitted it, I repeated the question twice, and threatened them with punishment; if they persisted, I ordered them to be at once punished:",
    sourceId: "pliny-melmoth",
    locator: "Pliny to Trajan · Letters 10.96",
  },
  trajan: {
    text: "It is not possible to lay down any general rule for all such cases. Do not go out of your way to look for them. If indeed they should be brought before you, and the crime is proved, they must be punished;",
    sourceId: "pliny-melmoth",
    locator: "Trajan to Pliny · Letters 10.97",
  },
  trajanRepentance: {
    text: "with the restriction, however, that where the party denies he is a Christian, and shall make it evident that he is not, by invoking our gods, let him (notwithstanding any former suspicion) be pardoned upon his repentance. Anonymous informations ought not to be received in any sort of prosecution.",
    sourceId: "pliny-melmoth",
    locator: "Trajan’s reply, continued",
  },
  augustine: {
    text: "Thou awakest us to delight in Thy praise; for Thou madest us for Thyself, and our heart is restless, until it repose in Thee. Grant me, Lord, to know and understand which is first, to call on Thee or to praise Thee? and, again, to know Thee or to call on Thee?",
    sourceId: "augustine-confessions",
    locator: "Augustine · Confessions I.1 · E. B. Pusey translation",
  },
  childEarlier: {
    text: "Such solicitude I suffered for many days, and I obtained for my infant to remain in the dungeon with me; and forthwith I grew strong and was relieved from distress and anxiety about my infant; and the dungeon became to me as it were a palace, so that I preferred being there to being elsewhere.",
    sourceId: "passion-wallis",
    locator: "Earlier: Passion §3 · ANF Argument I.2",
  },
  childSeparation: {
    text: "Then, because my child had been used to receive suck from me, and to stay with me in the prison, I send Pomponius the deacon to my father to ask for the infant, but my father would not give it him. And even as God willed it, the child no [longer] desired the breast, nor did my breast cause me uneasiness, lest I should be tormented by care for my babe and by the pain of my breasts at once.",
    sourceId: "passion-wallis",
    locator: "After the sentence: Passion §6 · ANF Argument II.2",
  },
} as const;

export type InteriorPassageId = keyof typeof INTERIOR_PASSAGES;
