/** Sourced editorial treatment for draft review; never ancient speech or human approval. */
export const PERPETUA_CONTEXT_SOURCES = {
  carthage: {
    title: "UNESCO · Archaeological Site of Carthage",
    url: "https://whc.unesco.org/en/list/37/",
    locator: "Outstanding Universal Value; Integrity (2009)",
    limit: "Supports the Roman provincial capital, ports, forum, baths and urban life. It does not identify the prison, hearing site or this story’s route.",
  },
  sacrifice: {
    title: "Tertullian · Apology 29–32",
    url: "https://www.newadvent.org/fathers/0301.htm",
    locator: "Chapters 29–32 · S. Thelwall translation, ANF III (1885), New Advent revision",
    limit: "A Christian defense distinguishing prayer for emperors from sacrifice to gods. Context for the conflict, not testimony to Perpetua’s hearing or her private reasoning.",
  },
  latin: {
    title: "The Passion · Shewring’s Latin edition (1931)",
    url: "https://archive.org/stream/passionofssperpe00perp/passionofssperpe00perp_djvu.txt",
    locator: "Latin §2 · Felicitas conserva eius; Perpetua’s introduction",
    limit: "The Latin describes Felicity as Revocatus’s fellow slave. Archive OCR is an edition witness, not an autograph or a new manuscript collation; it does not identify Perpetua as her owner.",
  },
} as const;

export interface PrisonRelationship {
  id: string;
  name: string;
  position: string;
  observation: string;
}

export interface PrisonScene {
  id: string;
  name: string;
  title: string;
  setting: string;
  transition: string;
  contextSourceIds: readonly (keyof typeof PERPETUA_CONTEXT_SOURCES)[];
  voice: "account" | "vision" | "narrator";
  voiceLabel: string;
  locator: string;
  sourceId: "passion-perpetua";
  text: readonly string[];
  evidence: string;
  limit: string;
  visualDescription: string;
  relationships: readonly PrisonRelationship[];
  reviewStatus: "draft";
}

export const PRISON_SCENES: readonly PrisonScene[] = [
  {
    id: "carthage",
    name: "Carthage",
    title: "A life before the prison.",
    setting: "Roman North Africa · before the hearing",
    transition: "The account begins with an arrest. Soon the city gives way to a room Perpetua has never known.",
    contextSourceIds: ["carthage", "latin"],
    voice: "narrator",
    voiceLabel: "Historical setting & the Passion’s introduction",
    locator: "Passion §§2–3; UNESCO, Carthage",
    sourceId: "passion-perpetua",
    text: [
      "Carthage stands on the North African shore of the Mediterranean, in what is now Tunisia. Under Roman rule it is a provincial capital: a city of ports, baths, temples and a public forum. The prisoners’ story unfolds inside this civic world.",
      "The surviving account introduces Vibia Perpetua as about twenty-two, educated, well-born and married, with a son still nursing. Felicity is pregnant and enslaved, named alongside her fellow servant Revocatus. It does not say that Perpetua owns her. They enter this story from different social positions.",
      "They are arrested with other catechumens: people preparing for Christian baptism. Perpetua describes being baptized while in custody. The account does not tell us who denounced them or establish a particular imperial decree as the cause of their arrest.",
      "Their Christian identity will become the question at a public hearing. For now, Perpetua’s father is already trying to make her turn back. She answers with the example of a small vessel: a thing cannot be called something other than what it is. She cannot call herself anything other than Christian.",
    ],
    evidence: "Passion §2 introduces the catechumens, family, age and social descriptions; §3 gives the vessel exchange, baptism and transfer to prison. The Latin description of Felicity and Revocatus as fellow slaves is often rendered ‘fellow servants’ in the older translations. UNESCO documents Roman Carthage’s provincial and urban setting.",
    limit: "The immediate trigger and legal basis of the arrests are not established by this account. The traditional 203 CE setting is not an independently verified composition date. An imagined city cannot supply the appearance of a specific street or building.",
    visualDescription: "An original, disclosed AI-generated painting opens the city to the sea; no precise ancient topography or route is asserted.",
    relationships: [
      { id: "perpetua", name: "Perpetua", position: "A young mother preparing for baptism", observation: "The opening identifies her as married, but her husband does not appear as a speaking participant. We cannot fill that silence with a biography." },
      { id: "felicity", name: "Felicity", position: "Pregnant, enslaved, imprisoned with the group", observation: "She is introduced alongside Revocatus, her fellow servant. The text does not identify Perpetua as her owner. Her childbirth and reported words come through the narrator in §15." },
      { id: "companions", name: "Their companions", position: "Revocatus, Saturninus, Secundulus and Saturus", observation: "The first three are named among the arrested catechumens. Saturus later joins them voluntarily according to §4. Secundulus dies in prison (§14); the others face the games." },
    ],
    reviewStatus: "draft",
  },
  {
    id: "child",
    name: "The child",
    title: "A child in the prison.",
    setting: "Inside the prison · before the sentence",
    transition: "The child can stay for now. But news comes that the prisoners will be heard, and her father returns.",
    contextSourceIds: [],
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §3; attribution introduced in §2",
    sourceId: "passion-perpetua",
    text: [
      "The city falls away. In the writing attributed to Perpetua, the prison is a darkness she has never experienced, crowded and hot, with harsh treatment from soldiers. Her immediate anxiety is for her nursing child.",
      "Two deacons from the Christian community, Tertius and Pomponius, pay to obtain a few hours in a better part of the prison. She nurses her hungry son, speaks to her mother and brother, and entrusts him to their care. The account preserves a family trying to keep a child fed while his mother is confined.",
      "After days of anxiety, she obtains permission for him to remain with her. She describes growing strong again. The prison becomes, in her words, a palace. The place has not opened; her child has been allowed inside.",
    ],
    evidence:
      "Section 3 describes the heat, crowding, soldiers and concern for the infant. Two deacons obtain a respite; she nurses him. His later presence in prison brings relief. This is her account's description, received within an edited work.",
    limit:
      "We possess the transmitted composite work, not an inspected autograph or the child's account. Its editor attributes §§3–10 to Perpetua. That attribution is part of what the source asks us to examine.",
    visualDescription:
      "An original, disclosed painting of an imagined room carries the contrast between daylight outside and confinement; it does not reconstruct the prison.",
    relationships: [
      {
        id: "child",
        name: "Her child",
        position: "A nursing infant",
        observation:
          "Her care for him gives the prison account its immediate bodily stakes. His hunger and presence are described by her; his own experience does not reach us in a separate voice.",
      },
      {
        id: "family",
        name: "Her family",
        position: "Mother and brother",
        observation:
          "She describes speaking to her mother and strengthening her brother while commending the child to them. This network of care exists inside the account; it is not a recovered family testimony.",
      },
      {
        id: "deacons",
        name: "The deacons",
        position: "Tertius and Pomponius",
        observation:
          "The account names two deacons who obtain, with money, a short respite in a better part of the prison. Their help changes access within confinement, not the sentence that comes later.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    id: "tribunal",
    name: "The hearing",
    title: "Her father brings the child.",
    setting: "The public hearing · Passion §§5–6",
    transition: "The sentence sends her back to prison. This time, the child does not return with her.",
    contextSourceIds: ["sacrifice"],
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §§5–6",
    sourceId: "passion-perpetua",
    text: [
      "Before the hearing, her father pleads for the family’s standing, for her mother and brothers, and for the son who depends on her. In her telling, he kisses her hands and falls at her feet. His appeal is for her life and for the people her death would leave behind.",
      "Then the prisoners are brought before Hilarianus, the Roman official. A crowd gathers. Her father appears with her son. Both father and official invoke the child; the official asks her to offer sacrifice for the emperors’ well-being.",
      "That demand joins worship to public allegiance. In a separate Christian defense, Tertullian argues that Christians pray for emperors but refuse sacrifice to the gods. It helps explain the religious conflict here, without giving us Perpetua’s private thoughts: she presents Christian identity as something she cannot renounce.",
    ],
    evidence:
      "Section 5 gives the father's appeal and her response; §6 places father, infant and official at the tribunal. All their words reach us within the account attributed to Perpetua, rather than as three independently preserved statements.",
    limit:
      "The Passion is a Christian martyr narrative, not a surviving official transcript. The father's motives cannot be reconstructed beyond what this account says about him.",
    visualDescription:
      "Reported appeals occupy one typographic field; Perpetua’s account of her father’s beating follows her reply, preventing it from becoming an uncomplicated climax.",
    relationships: [
      {
        id: "father",
        name: "Her father",
        position: "As reported by Perpetua",
        observation:
          "His appeal names family ties. She describes his grief and her own sorrow for him. Reading him only as an obstacle would erase part of what her account preserves.",
      },
      {
        id: "official",
        name: "The official",
        position: "As reported by Perpetua",
        observation:
          "Hilarian's demand for sacrifice and his sentence are reported here. The interface has no separate deposition from him to set beside hers.",
      },
      {
        id: "child",
        name: "Her child",
        position: "Present at the hearing",
        observation:
          "Her son appears with her father and in the appeal to sacrifice. We are told how others invoke him, not what he understands.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    id: "separation",
    name: "The separation",
    title: "She asks for her child.",
    setting: "Back in prison · after the sentence",
    transition: "Her son’s later life disappears from this account. Another child is about to be born inside the prison.",
    contextSourceIds: [],
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §6, after the sentence",
    sourceId: "passion-perpetua",
    text: [
      "Condemned to the beasts, Perpetua sends Pomponius to ask her father for her son. Her father will not give him back. His reason is not given.",
      "Earlier, his presence relieved her. Now the account describes the child no longer needing to nurse and her breasts causing no pain. She understands this relief as God’s will. Relief is not a reunion; this paragraph does not tell us the child’s later life.",
    ],
    evidence:
      "The last part of §6 records the request, refusal, the child's no longer needing to nurse and Perpetua's bodily relief. The account presents the relief as God's will.",
    limit:
      "That theological explanation belongs to the attributed account. This paragraph does not tell us the child's later life; the experience leaves that absence open.",
    visualDescription:
      "A later devotional mosaic shows mother and child together. It is placed beside the passage of separation as reception history, not a reconstruction.",
    relationships: [
      {
        id: "child",
        name: "Her child",
        position: "Withheld after the hearing",
        observation:
          "The text records her unsuccessful request. It does not provide the child's later story. The later mosaic holds mother and child together in an image; it cannot supply that missing history.",
      },
      {
        id: "father",
        name: "Her father",
        position: "The request is refused",
        observation:
          "His refusal is reported in the same paragraph as her relief. The text does not give a fresh explanation in his own voice; we cannot supply one.",
      },
      {
        id: "meaning",
        name: "Her interpretation",
        position: "Relief understood through faith",
        observation:
          "The account interprets relief from bodily distress as God's will. Keeping that interpretation visible lets us hear her faith without treating its causation as independently verified history.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    id: "felicity",
    name: "Felicity",
    title: "She fears being left behind.",
    setting: "As the games approach · the narrator turns to Felicity",
    transition: "A daughter is entrusted to another woman. The games approach. We return to the final vision attributed to Perpetua.",
    contextSourceIds: [],
    voice: "narrator",
    voiceLabel: "Felicity described by the narrator",
    locator: "Passion §15",
    sourceId: "passion-perpetua",
    text: [
      "Felicity, arrested while pregnant, is now described as eight months along. The narrator says pregnant women cannot be executed. For her, that protection means being left behind when her companions die, and later facing death among other condemned prisoners. She fears that separation; her companions grieve at leaving her alone.",
      "According to the narrator, they pray together three days before the games. Then her labour begins. An attendant hears her pain and asks how she will bear the beasts if childbirth hurts so much. Her reported answer places her hope in Christ suffering with her.",
      "She gives birth to a daughter. Another Christian woman takes the child to raise as her own. Felicity will go to the arena with her companions; her daughter’s life will continue in someone else’s care.",
      "Felicity does not leave a corresponding first-person account in this text. Her reported words and experience come through the narrator's telling.",
    ],
    evidence:
      "Section 15 presents Felicity's situation, prayer, childbirth, reported answer to a prison attendant and the daughter's care. The account attributed to Saturus is separate: his vision occupies §§11–13; the narrator resumes in §14.",
    limit:
      "The absence of a first-person segment here does not mean Felicity had no voice or never wrote. It limits our access through this particular work. Its legal remarks are not treated here as a complete statement of Roman law.",
    visualDescription:
      "Kollwitz’s The Mothers offers a twentieth-century artistic parallel of gathering bodies beside the narrator’s description of companionship, childbirth and a daughter’s care.",
    relationships: [
      {
        id: "felicity",
        name: "Felicity",
        position: "Through the narrator",
        observation:
          "Her speech is represented by another voice. The interface keeps that mediation explicit rather than giving her an invented diary or interior monologue.",
      },
      {
        id: "daughter",
        name: "Her daughter",
        position: "Care reported in §15",
        observation:
          "The narrator says another woman takes Felicity's daughter to rear. This is a reported act of care, not a separate account from either woman or from the child.",
      },
      {
        id: "companions",
        name: "The companions",
        position: "Prayer in the narrator's account",
        observation:
          "The narrator presents her companions praying on her behalf. This is part of the Passion's Christian understanding of community and suffering, not a neutral recording of the room.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    id: "vision",
    name: "The vision",
    title: "A vision before the games.",
    setting: "A reported vision · before the public games",
    transition: "She wakes expecting victory in a spiritual struggle. Her writing stops before we can follow her into the arena.",
    contextSourceIds: [],
    voice: "vision",
    voiceLabel: "A vision reported by Perpetua",
    locator: "Passion §10; an earlier vision appears in §4",
    sourceId: "passion-perpetua",
    text: [
      "How can she face what is coming? The attributed account preserves visions and her own interpretations of them. Earlier, she describes a dangerous ladder leading to a garden; she and her brother understand it as a sign of coming martyrdom, rather than release. She also tells of praying for her dead younger brother, Dinocrates, and seeing his distress change to relief.",
      "In the final vision, she reaches an arena. She expects beasts, but an opponent appears. Her body changes; she fights, wins and receives a branch with golden fruit. On waking, she understands the struggle as a fight against the devil. The vision gives her an expectation of victory even as execution approaches.",
      "These are reported visionary experiences, not the events of the public games. Her own writing stops here. Another narrator will describe what happens there. The work does not preserve Felicity’s own written account alongside hers.",
    ],
    evidence:
      "Section 10 explicitly identifies the episode as a vision, describes the contest and gives her waking interpretation. The attributed account ends after this section, before the games themselves.",
    limit:
      "A reported vision is evidence of what the work says she experienced and understood. It does not independently establish the vision's events or a universal interpretation of its imagery.",
    visualDescription:
      "A disclosed AI-generated interpretation accompanies three source moments: expected beasts, a changed body and waking interpretation. It does not reconstruct an external event.",
    relationships: [
      {
        id: "vision",
        name: "What is seen",
        position: "The reported vision",
        observation:
          "The text describes an arena contest with an opponent and a victor's reward. It is presented as a vision, not as the public games that the later narrator describes.",
      },
      {
        id: "meaning",
        name: "What it means to her",
        position: "The waking interpretation",
        observation:
          "On waking she identifies the struggle as against the devil and understands herself as victorious. The interpretation is hers within this account; the visitor is not asked to verify a supernatural scene.",
      },
      {
        id: "earlier",
        name: "The earlier vision",
        position: "Return to §4",
        observation:
          "An earlier vision describes a ladder, a serpent and a garden. She and her brother interpret it in relation to the coming passion. It is another passage in the same source family, not independent corroboration.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    id: "handover",
    name: "The ending",
    title: "Someone else finishes.",
    setting: "The arena & the surviving work · another narrator",
    transition: "Two women die. Their children remain beyond the ending this work chooses to tell.",
    contextSourceIds: [],
    voice: "narrator",
    voiceLabel: "The narrator carries the account onward",
    locator: "End of Passion §10; §§7, 14, 16, 18–21",
    sourceId: "passion-perpetua",
    text: [
      "The narrator describes games held for an imperial birthday. The prisoners are brought into the amphitheatre. Perpetua and Felicity are exposed to a wild cow and thrown down. Perpetua gets up, reaches for Felicity and helps her stand. The text holds the two women together in that small action.",
      "The surviving prisoners are then killed with the sword. The narrator describes Perpetua guiding the inexperienced swordsman’s hand to her throat. This is the ending’s account of her death, not Perpetua reporting her own death.",
      "The work calls these deaths martyrdom: witness to Christian faith, understood by its narrator as victory. That religious meaning belongs to the account. The physical outcome remains the death of the prisoners and the separation of two mothers from their children.",
    ],
    evidence:
      "The end of §10 leaves the games for someone else to recount. After Saturus's vision, the narrator resumes in §14 and narrates the final events in §§18–21. The present experience summarizes that outcome without a graphic reenactment.",
    limit:
      "The source preserves a Christian interpretation of these deaths. Its composite form gives access to a life while also placing limits on whose words, perspective and experience we can recover.",
    visualDescription:
      "The last attributed sentence gives way to a limestone field for the narrator’s arena. The account of one woman raising another stands beside the narrated deaths. Historical reflection and optional sources precede a final question, with no footer afterward.",
    relationships: [
      {
        id: "perpetua",
        name: "Perpetua's writing",
        position: "The attributed account has ended",
        observation:
          "The work itself marks the limit of her writing before the games. The final scene must not be presented as another entry in her diary.",
      },
      {
        id: "narrator",
        name: "The narrator",
        position: "The ending's speaking position",
        observation:
          "The narrator supplies the final account and its language of victory. That voice is part of the surviving work, with its own religious purpose.",
      },
      {
        id: "absent",
        name: "The voices we lack",
        position: "A question left open",
        observation:
          "Her infant has no first-person account here. Felicity's experience is mediated by the narrator. A coherent story does not remove those absences.",
      },
    ],
    reviewStatus: "draft",
  },
];

/** Unknown/foreign fragments fail safely to the opening; IDs are never array positions. */
export function prisonView(hash: string | null) {
  const previousFragments: Record<string, string> = {
    "#prison": "child",
    "#visions": "vision",
    "#felicity": "felicity",
  };
  const id = hash
    ? (previousFragments[hash] ?? hash.replace(/^#perpetua-/, ""))
    : undefined;
  return {
    enhanced: hash !== null,
    all: id === "all",
    scene: PRISON_SCENES.find((scene) => scene.id === id) ?? PRISON_SCENES[0],
  };
}
