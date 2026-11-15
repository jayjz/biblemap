import type { HumanSource } from "../domain/human-story.ts";

/** Sourced literary experiment for the requested no-index preview, not human approval. */
export const PLINY_V3_REVIEW = { status: "draft", checkedAt: "2026-11-15", baseline: "064a17ac3e7511ccb42323e436b6442f661be2cd" } as const;
export const PLINY_V3_TITLE = "A kind of commonwealth";
export const PLINY_V3_DESCRIPTION = "Pliny writes about deaths in his household, a proposed company of firemen, and people brought before him as Christians. A reading across his letters.";

const edition = "William Melmoth, revised F. C. T. Bosanquet; Project Gutenberg 2811. Historical English, public domain in the United States. Footnote callouts removed and whitespace collapsed; no wording modernized.";
export const PLINY_V3_SOURCES: readonly HumanSource[] = [
  {
    id: "pliny-household", title: "Pliny to Paternus · the household letter",
    url: "https://www.gutenberg.org/files/2811/2811-h/2811-h.htm#link2H_4_0090",
    locator: "Letters 8.16; XC, To Paternus, in this edition's selected letters", edition,
    kind: "testimony", checkedAt: PLINY_V3_REVIEW.checkedAt,
    rights: "Ancient work and historical translation in the public domain in the United States. Verified passage retained locally; no modern site commentary or branding reproduced.",
    limits: "Pliny's literary self-presentation to a friend, transmitted in a letter collection. It supports what he writes about grief, manumission and quasi-testamentary requests; it does not independently establish his feelings or supply a psychological explanation for 10.96. His condition restricts beneficiaries to the household. The two letters do not describe the same enslaved people.",
  },
  {
    id: "pliny-firemen", title: "Pliny and Trajan · a proposed association of firemen",
    url: "https://www.gutenberg.org/files/2811/2811-h/2811-h.htm#link2H_4_0153",
    locator: "Letters 10.33–34; XLII–XLIII in this edition's Correspondence with Trajan", edition,
    kind: "testimony", checkedAt: PLINY_V3_REVIEW.checkedAt,
    rights: "Ancient work and historical translation in the public domain in the United States. Complete letters retained locally; edition numbering explicitly distinguished from modern numbering.",
    limits: "Administrative correspondence reporting a fire and proposed organization at Nicomedia. Trajan's stated concern about associations supplies context, not a demonstrated cause or complete legal explanation of the Christian proceedings. Translation of the public building's function varies; that detail is not used in the narrative. The 10.96 proceedings are not located in a reconstructed Nicomedia hearing.",
  },
];

export const PLINY_V3_EXCERPTS = {
  commands: { text: "I receive and obey their last requests and injunctions as so many authoritative commands,", letter: "household", locator: "8.16", sourceId: "pliny-household", speaker: "Pliny to Paternus" },
  household: { text: "for to slaves the house they are in is a kind of state and commonwealth, so to speak.", letter: "household", locator: "8.16", sourceId: "pliny-household", speaker: "Pliny to Paternus" },
  association: { text: "Whatever name we give them, and for whatever purposes they may be founded, they will not fail to form themselves into factious assemblies, however short their meetings may be.", letter: "association", locator: "10.34", sourceId: "pliny-firemen", speaker: "Trajan to Pliny" },
  meal: { text: "to eat in common a harmless meal.", letter: "pliny", locator: "10.96.7", sourceId: "pliny-encounter-melmoth", speaker: "Pliny, reporting the account given to him" },
  women: { text: "putting two female slaves to the torture", letter: "pliny", locator: "10.96.8", sourceId: "pliny-encounter-melmoth", speaker: "Pliny to Trajan" },
  temples: { text: "The temples, at least, which were once almost deserted, begin now to be frequented;", letter: "pliny", locator: "10.96.10", sourceId: "pliny-encounter-melmoth", speaker: "Pliny to Trajan" },
  pardon: { text: "by invoking our gods, let him (notwithstanding any former suspicion) be pardoned upon his repentance.", letter: "trajan", locator: "10.97", sourceId: "pliny-encounter-melmoth", speaker: "Trajan to Pliny" },
} as const;
export type PlinyV3ExcerptId = keyof typeof PLINY_V3_EXCERPTS;

function prose(text: string, sourceIds: readonly string[], locator: string, evidenceClass = "Editorial account of Roman testimony") {
  return { text, sourceIds, locator, evidenceClass };
}

/** Every authored paragraph has its own source and locator; prose is never a quotation. */
export const PLINY_V3_PROSE = {
  lead: prose("There have been deaths in the household.", ["pliny-household"], "8.16"),
  losses: prose("Pliny writes to his friend Paternus about them. Some of those who died were young. He says the losses have been a great affliction to him.", ["pliny-household"], "8.16"),
  orientation: prose("Pliny the Younger, Roman governor of Bithynia-Pontus in the early second century, is known here through his letters. This one concerns people in his own household.", ["pliny-household", "pliny-encounter-comparison"], "8.16; 10.96; Georgetown introduction"),
  consolations: prose("They include people he enslaves. He has two consolations. He has readily granted freedom, so that some have lived long enough to die free. And he allows enslaved household members to make a kind of will. He says he honors their requests as though they had the standing of legal testaments.", ["pliny-household"], "8.16"),
  condition: prose("They may leave their possessions to whomever they choose, on one condition: the beneficiary must belong to his household.", ["pliny-household"], "8.16"),
  grief: prose("These concessions do not settle his grief. He writes that he does not wish to become harder. Other people, he says, treat such deaths as a loss of property and call their indifference philosophy. He will not dispute their philosophy. He disputes their humanity.", ["pliny-household"], "8.16"),
  province: prose("Elsewhere in the collection, his correspondent is the emperor Trajan. Pliny is reporting on the province he governs.", ["pliny-firemen", "pliny-encounter-melmoth"], "10.33–34; 10.96–97"),
  fire: prose("At Nicomedia, a fire has destroyed private houses and public buildings. The city lacked equipment to fight it, Pliny reports. He has ordered equipment prepared. He asks to form a company of 150 firemen: genuine workers, a number small enough to supervise.", ["pliny-firemen"], "10.33"),
  refusal: prose("Trajan refuses the association. Provide equipment instead, he says. Require property owners to help. Call on the crowd if necessary.", ["pliny-firemen"], "10.34"),
  associationLimit: prose("This is one exchange about one proposed association. It does not supply a complete explanation of the proceedings in another letter.", ["pliny-firemen", "pliny-encounter-melmoth"], "10.33–34; 10.96", "Editorial limit on the comparison"),
  accused: prose("People have been brought before Pliny as Christians. He asks Trajan whether the name alone should be punished without another offense. Should age make a difference? Can someone who has ceased to be Christian receive pardon?", ["pliny-encounter-melmoth"], "10.96.1–2"),
  procedure: prose("He has already acted. He reports asking whether the accused are Christians, repeating the question, and threatening punishment. Those who persist are ordered away to execution. Roman citizens are marked for transfer to Rome.", ["pliny-encounter-melmoth", "pliny-encounter-comparison", "pliny-latin"], "10.96.3–4; execution rendering compared with Melmoth's punished"),
  certainty: prose("Whatever the nature of their opinions, he writes, their obstinacy certainly deserves punishment.", ["pliny-encounter-melmoth"], "10.96.3"),
  denial: prose("An anonymous list introduces more names. Some people deny that they are or have been Christians. Following words he supplies, they invoke the gods. They offer wine and incense before the emperor's image, brought in for this purpose with images of the gods. They curse Christ. He says he releases them.", ["pliny-encounter-melmoth"], "10.96.5"),
  former: prose("Others say that they once belonged but have ceased to belong. They perform the same acts. The letter does not give us the convictions behind them.", ["pliny-encounter-melmoth"], "10.96.6", "Reported testimony and a bounded textual limit"),
  gathering: prose("From people he has questioned, Pliny relays an account of a fixed day and a gathering before daylight. They address Christ as divine. They bind themselves against wrongdoing: fraud, theft, adultery, breaking their word, refusing to return property entrusted to them. They disperse and meet again for food.", ["pliny-encounter-melmoth"], "10.96.7; their reported practices, not a direct recording"),
  stopped: prose("They say they have stopped the latter gathering since his edict against assemblies, issued under the emperor's instructions. Their account of food, worship and obligations reaches us through his investigation.", ["pliny-encounter-melmoth"], "10.96.7; no universal change in Christian practice inferred"),
  turn: prose("Pliny writes that receiving this account made further inquiry more necessary. He describes seeking the truth by", ["pliny-encounter-melmoth"], "10.96.8"),
  women: prose("The two enslaved women were called ministrae. The word indicates a ministering role; the letter does not explain their duties. Neither woman speaks directly here. Their subsequent fate is not given.", ["pliny-encounter-melmoth", "pliny-latin"], "10.96.8; complete 10.96–97 for bounded absences"),
  after: prose("He reports finding only what he calls an absurd and extravagant superstition. He suspends the proceedings and asks Trajan for instructions.", ["pliny-encounter-melmoth"], "10.96.8–9; judgment attributed to Pliny"),
  reach: prose("He writes of people of every age and rank, of both sexes, in cities, villages and the countryside. Many are at risk, and more will be.", ["pliny-encounter-melmoth"], "10.96.9; extent as reported, not independently counted"),
  trade: prose("Sacred rites are being renewed. Demand has returned for sacrificial offerings that had found few buyers. From this he conjectures how many people might be reclaimed if they are allowed to repent.", ["pliny-encounter-melmoth"], "10.96.10; sacrificial commerce, without settling the textual variant concerning flesh or victims"),
  recoveryLimit: prose("This is Pliny's account of a change in the province. His letter does not independently establish its extent, or the reasons for every return.", ["pliny-encounter-melmoth"], "10.96.9–10", "Editorial limit on the report"),
  reply: prose("Trajan approves the course he has taken. He declines to make a general rule for every case. Christians are not to be sought out. If brought forward and proved, they are to be punished. Anonymous accusations are not to be admitted.", ["pliny-encounter-melmoth"], "10.97, complete reply"),
  pardon: prose("To obtain pardon, someone must deny being Christian and demonstrate the denial through worship of the Roman gods. Past suspicion need not prevent release. Trajan gives the condition:", ["pliny-encounter-melmoth"], "10.97"),
  reception: prose("Tertullian later objects to the combination of forbidding a search and retaining punishment when Christians are brought forward. This is later Christian advocacy interpreting the Roman exchange, not testimony from the accused or evidence that he was present.", ["pliny-tertullian"], "Apology II.6–9", "Later Christian reception, outside the narrative ending"),
} as const;
export type PlinyV3ProseId = keyof typeof PLINY_V3_PROSE;

export const PLINY_V3_TRANSLATION_NOTE = "The historical English says punished in 10.96.3; the inspected Georgetown rendering makes execution explicit. No method or number is supplied. Ministrae is rendered variously as ministers, deaconesses, or women said to officiate. These letters do not explain their duties. The spelling and stray apostrophe in officiate' remain in the complete historical English. Multiple translations are one ancient record family, not independent witnesses.";
