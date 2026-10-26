// Sourced editorial draft. Only the existing no-index, opt-in Nineveh route uses it.
// Human historical, theological and creative approval remains required.
export const NINEVEH_DEPTH_REVIEW = { status: "draft", reviewedBy: null } as const;
export const depthSources = {
  tablet: { title: "British Museum · K.3375", url: "https://www.britishmuseum.org/collection/object/W_K-3375", locator: "Description; Production date; Findspot; Curator’s comments" },
  library: { title: "Jonathan Taylor · What is the Library? (2022)", url: "https://oracc.museum.upenn.edu/asbp/whatisthelibrary/index.html", locator: "Opening paragraph; A royal collection" },
  art: { title: "Cleveland Museum of Art · 1965.239", url: "https://www.clevelandart.org/art/1965.239", locator: "Details; Visual description; Public Domain" },
  augustine: { title: "Augustine · The City of God, XXI.24", url: "https://www.newadvent.org/fathers/120121.htm", locator: "Chapter 24, paragraph beginning ‘As for those who find an empty threat’" },
  francis: { title: "Francis · Mercy first and foremost", url: "https://www.vatican.va/content/francesco/en/cotidie/2015/documents/papa-francesco-cotidie_20151006_mercy-first-and-foremost.html", locator: "6 October 2015; paragraph beginning ‘Finally’" },
} as const;
export const depthVoices = [
  {
    id: "augustine", author: "Augustine", era: "Early fifth century · Latin Christian interpretation",
    title: "What was overthrown?",
    quote: "the wicked Nineveh was overthrown, and a good Nineveh built up.",
    paraphrase: "Augustine reads the threatened overthrow as fulfilled in the people’s changed conduct: the city’s buildings survive. His argument concerns what a divine warning accomplishes, even when Jonah is angry that destruction has not followed.",
    context: "This passage belongs to an argument about judgment and repentance in this life. It is not a claim that Augustine rejects judgment, or an archaeological account of Nineveh.",
    edition: "The City of God, book XXI, chapter 24. Marcus Dods, translator; Nicene and Post-Nicene Fathers, First Series, vol. 2, Philip Schaff, ed. (Buffalo: Christian Literature Publishing Co., 1887). New Advent revision by Kevin Knight. Brief excerpt from the English translation of the Latin work.",
    rights: "Dods’s 1887 translation is public domain; New Advent’s edited presentation carries its own copyright. Only the short identified excerpt is reproduced.",
  },
  {
    id: "francis", author: "Pope Francis", era: "2015 · Catholic pastoral interpretation",
    title: "What resists mercy?",
    quote: "hardness that does not allow God’s mercy to enter",
    paraphrase: "Francis turns attention to the prophet: Jonah has obeyed the call to preach but resists the mercy that follows. In this homily, attachment to his own preaching becomes an obstacle to receiving God’s action.",
    context: "This is a pastoral reading of Jonah’s resistance, not a diagnosis supplied by the biblical narrator. It asks a different question from Augustine’s account of the warning’s fulfillment; the two are not staged as opponents.",
    edition: "Mercy first and foremost, morning meditation, 6 October 2015. L’Osservatore Romano, Weekly edition in English, no. 41, 9 October 2015, hosted by the Holy See. Official English report, not a verbatim transcript; no individual translator is identified.",
    rights: "© Dicastery for Communication. Nine-word excerpt for attributed discussion; no open license asserted. Publication review remains required.",
  },
] as const;
