/** Exact public-domain Wallis excerpts, checked against the linked ANF transcription
 * on 2026-11-04. Section numbers follow the Passion, not ANF's chapter divisions.
 * Selection and artistic juxtaposition are draft editorial choices for PR #36.
 */
const edition = "https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/";
export const PERPETUA_PASSAGES = {
  fatherHands: {
    text: "These things said my father in his affection, kissing my hands, and throwing himself at my feet; and with tears he called me not Daughter, but Lady.",
    speaker: "Perpetua describes her father",
    locator: "Passion §5 · ANF II.1",
    url: `${edition}Argument_II`,
  },
  grief: {
    text: "And my father’s misfortune grieved me as if I myself had been beaten, I so grieved for his wretched old age.",
    speaker: "Account attributed to Perpetua",
    locator: "Passion §6 · ANF II.2",
    url: `${edition}Argument_II`,
  },
  expected: {
    text: "And because I knew that I was given to the wild beasts, I marvelled that the wild beasts were not let loose upon me.",
    speaker: "Within the reported vision",
    locator: "Passion §10 · ANF III.2",
    url: `${edition}Argument_III`,
  },
  changed: {
    text: "And there came to me, as my helpers and encouragers, handsome youths; and I was stripped, and became a man.",
    speaker: "Within the reported vision",
    locator: "Passion §10 · ANF III.2",
    url: `${edition}Argument_III`,
  },
  standing: {
    text: "So she rose up; and when she saw Felicitas crushed, she approached and gave her her hand, and lifted her up. And both of them stood together;",
    speaker: "The narrator describes Perpetua and Felicity",
    locator: "Passion §20 · ANF VI.3",
    url: `${edition}Argument_VI`,
  },
  father: {
    text: "Have pity my daughter, on my grey hairs.",
    speaker: "Her father, as reported by Perpetua",
    locator: "Passion §5 · ANF II.1",
    url: `${edition}Argument_II`,
  },
  official: {
    text: "Spare the grey hairs of your father, spare the infancy of your boy, offer sacrifice for the well-being of the emperors.",
    speaker: "Hilarianus, as reported by Perpetua",
    locator: "Passion §6 · ANF II.2",
    url: `${edition}Argument_II`,
  },
  reply: {
    text: "I am a Christian.",
    speaker: "Perpetua’s reply in the attributed account",
    locator: "Passion §6 · ANF II.2",
    url: `${edition}Argument_II`,
  },
  waking: {
    text: "Then I awoke, and perceived that I was not to fight with beasts, but against the devil.",
    speaker: "Perpetua’s interpretation of her vision",
    locator: "Passion §10 · ANF III.2",
    url: `${edition}Argument_III`,
  },
  felicity: {
    text: "Now it is I that suffer what I suffer; but then there will be another in me, who will suffer for me, because I also am about to suffer for Him.",
    speaker: "Felicity’s reply, as reported by the narrator",
    locator: "Passion §15 · ANF V.2",
    url: `${edition}Argument_V`,
  },
  daughter: {
    text: "Thus she brought forth a little girl, which a certain sister brought up as her daughter.",
    speaker: "The narrator",
    locator: "Passion §15 · ANF V.2",
    url: `${edition}Argument_V`,
  },
  last: {
    text: "This, so far, I have completed several days before the exhibition; but what passed at the exhibition itself let who will write.",
    speaker: "The end of the writing attributed to Perpetua",
    locator: "Passion §10 · ANF III.2",
    url: `${edition}Argument_III`,
  },
} as const;
