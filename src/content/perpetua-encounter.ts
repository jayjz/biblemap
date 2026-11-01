/** Original editorial summaries for PR #36; not the words of the historical people. */
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
    id: "child",
    name: "The child",
    title: "A child in the prison.",
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §3; attribution introduced in §2",
    sourceId: "passion-perpetua",
    text: [
      "The prison is crowded and hot. In the account attributed to her, Perpetua fears its darkness. Her account keeps returning to someone else: her nursing child.",
      "The deacons obtain a respite. She nurses the hungry child. Later, he is allowed to stay with her. A place of confinement becomes, in her telling, a palace.",
    ],
    evidence:
      "Section 3 describes the heat, crowding, soldiers and concern for the infant. Two deacons obtain a respite; she nurses him. His later presence in prison brings relief. This is her account's description, received within an edited work.",
    limit:
      "We possess the transmitted composite work, not an inspected autograph or the child's account. Its editor attributes §§3–10 to Perpetua. That attribution is part of what the source asks us to examine.",
    visualDescription:
      "Two nested forms stand for Perpetua and her child, with a continuous line for the contact narrated in section 3.",
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
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §§5–6",
    sourceId: "passion-perpetua",
    text: [
      "Her father asks her to consider her family. At the hearing, he appears with her son; the official also invokes the child and asks her to sacrifice.",
      "She continues to identify as Christian. The account reports condemnation to the beasts, and her sorrow when her father is struck.",
    ],
    evidence:
      "Section 5 gives the father's appeal and her response; §6 places father, infant and official at the tribunal. All their words reach us within the account attributed to Perpetua, rather than as three independently preserved statements.",
    limit:
      "The Passion is a Christian martyr narrative, not a surviving official transcript. The father's motives cannot be reconstructed beyond what this account says about him.",
    visualDescription:
      "The mother and child forms are held within a wider contour, representing family and authority entering the same narrated encounter.",
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
    voice: "account",
    voiceLabel: "Account attributed to Perpetua",
    locator: "Passion §6, after the sentence",
    sourceId: "passion-perpetua",
    text: [
      "Back in the prison, she sends Pomponius to ask her father for the child. Her father will not give him back.",
      "The account then describes relief from nursing and gives it a divine explanation. The separation and the meaning she finds in it are different kinds of claim.",
    ],
    evidence:
      "The last part of §6 records the request, refusal, the child's no longer needing to nurse and Perpetua's bodily relief. The account presents the relief as God's will.",
    limit:
      "That theological explanation belongs to the attributed account. This paragraph does not tell us the child's later life; the experience leaves that absence open.",
    visualDescription:
      "The smaller form has moved outside the mother's contour. The line between them is interrupted, marking the narrated refusal to return the child.",
    relationships: [
      {
        id: "child",
        name: "Her child",
        position: "Withheld after the hearing",
        observation:
          "The text records her unsuccessful request. It does not provide the child's later story. The empty interval in the drawing marks a limit in the account, not a new event.",
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
    id: "vision",
    name: "The vision",
    title: "The account changes register.",
    voice: "vision",
    voiceLabel: "A vision reported by Perpetua",
    locator: "Passion §10; an earlier vision appears in §4",
    sourceId: "passion-perpetua",
    text: [
      "Before the games, she recounts a vision of a contest in an arena. On waking, she understands the struggle as a fight against the devil.",
      "A vision of victory and the account of her death will occupy different parts of the work. One must not quietly become footage of the other.",
    ],
    evidence:
      "Section 10 explicitly identifies the episode as a vision, describes the contest and gives her waking interpretation. The attributed account ends after this section, before the games themselves.",
    limit:
      "A reported vision is evidence of what the work says she experienced and understood. It does not independently establish the vision's events or a universal interpretation of its imagery.",
    visualDescription:
      "An open ring surrounds the inner form. It marks a reported vision's separate narrative register, without depicting its scene as an external event.",
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
    id: "felicity",
    name: "Felicity",
    title: "Another mother. Another voice.",
    voice: "narrator",
    voiceLabel: "Felicity described by the narrator",
    locator: "Passion §15",
    sourceId: "passion-perpetua",
    text: [
      "The narrator describes the pregnant Felicity among the prisoners. Her companions pray; she gives birth, and another Christian woman takes the daughter to rear.",
      "Felicity does not leave a corresponding first-person account in this text. Her reported words and experience come through the narrator's telling.",
    ],
    evidence:
      "Section 15 presents Felicity's situation, prayer, childbirth, reported answer to a prison attendant and the daughter's care. The account attributed to Saturus is separate: his vision occupies §§11–13; the narrator resumes in §14.",
    limit:
      "The absence of a first-person segment here does not mean Felicity had no voice or never wrote. It limits our access through this particular work. Its legal remarks are not treated here as a complete statement of Roman law.",
    visualDescription:
      "Two forms for Felicity and her newborn are linked through a wider outer contour, marking that a narrator mediates their story.",
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
    id: "handover",
    name: "The ending",
    title: "Someone else finishes.",
    voice: "narrator",
    voiceLabel: "The narrator carries the account onward",
    locator: "End of Passion §10; §§14, 18–21",
    sourceId: "passion-perpetua",
    text: [
      "The writing attributed to Perpetua stops before the games. The final narrator describes Perpetua and Felicity in the arena and their deaths.",
      "The work understands their martyrdom as victory. That ending is not Perpetua reporting her own death. A different voice has brought us here.",
    ],
    evidence:
      "The end of §10 leaves the games for someone else to recount. After Saturus's vision, the narrator resumes in §14 and narrates the final events in §§18–21. The present experience summarizes that outcome without a graphic reenactment.",
    limit:
      "The source preserves a Christian interpretation of these deaths. Its composite form gives access to a life while also placing limits on whose words, perspective and experience we can recover.",
    visualDescription:
      "The central form is now an unfilled outline beside a continuing outer line: the attributed writing has ended and the narrator continues.",
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
