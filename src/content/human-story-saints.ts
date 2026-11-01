import type {
  HumanSource,
  HumanEntity,
  HumanEntry,
  HumanConnection,
} from "../domain/human-story.ts";

const checkedAt = "2026-11-01";
export const SAINT_SOURCES: readonly HumanSource[] = [
  {
    id: "passion-perpetua",
    title: "The Passion of Perpetua and Felicity",
    url: "https://sourcebooks.web.fordham.edu/source/perpetua.asp",
    locator:
      "Prologue §§1–2; Perpetua's attributed account §§3–10; Saturus §§11–13; Felicity §15; narrative ending §§16–21",
    edition:
      "W. H. Shewring translation (1931), modernized for Fordham's Internet History Sourcebooks with reference to Peter Dronke. Read the site's section headings as well as the narrative.",
    kind: "autobiography",
    checkedAt,
    rights:
      "Modernized translation linked; original editorial paraphrase only, no translated speech reproduced.",
    limits:
      "A composite Passion, not a surviving autograph. The editor attributes §§3–10 to Perpetua; Saturus's vision and the third-person ending are distinct layers. Visions are reported experiences, not externally verified events.",
  },
  {
    id: "augustine-confessions",
    title: "Augustine · Confessions",
    url: "https://www.gutenberg.org/files/3296/3296-h/3296-h.htm",
    locator:
      "Book I opening; VIII.12 (garden); IX (Monica and singing); XI–XIII (time and Genesis)",
    edition:
      "E. B. Pusey translation, Project Gutenberg eBook 3296. Work composed around 400 CE; the remembered events precede the writing.",
    kind: "autobiography",
    checkedAt,
    rights:
      "Historical public-domain translation linked; editorial paraphrase only.",
    limits:
      "Retrospective Christian confession addressed to God, not an unmediated diary or a neutral transcript. Theological self-interpretation belongs to the work's form.",
  },
  {
    id: "teresa-life",
    title: "Teresa of Ávila · The Life",
    url: "https://www.gutenberg.org/files/8120/8120-h/8120-h.htm",
    locator:
      "9.8–10 (reading Augustine); 11.6–12 (garden and four ways of watering); prologue",
    edition:
      "David Lewis translation, third edition with introduction/notes by Benedict Zimmerman, 1904; Project Gutenberg eBook 8120. Distinguish Teresa's chapters from later editorial notes.",
    kind: "autobiography",
    checkedAt,
    rights:
      "Historical translation linked; no translated quotation reproduced.",
    limits:
      "A sixteenth-century Carmelite Catholic account of prayer and spiritual experience, written in obedience to requests to describe it. Later notes are not Teresa's words. Her account of divine action is her theological testimony.",
  },
  {
    id: "francis-flowers",
    title: "Little Flowers · chapter XVI",
    url: "https://www.ccel.org/ccel/ugolino/flowers.iii.xvi.html",
    locator:
      "Chapter XVI, especially the address to the birds; CCEL work introduction for the later collection",
    edition:
      "Little Flowers of St Francis of Assisi, English text hosted by CCEL and traditionally associated with Brother Ugolino. The collection belongs to the later Franciscan tradition, not Francis's autobiography.",
    kind: "legend",
    checkedAt,
    rights:
      "Linked text; original paraphrase only. No rights claim for CCEL's modern introduction or audio.",
    limits:
      "Hagiographic storytelling, including legendary material. This chapter cannot by itself establish a verbatim sermon or an independently verified response by birds.",
  },
  {
    id: "francis-collection",
    title: "CCEL · Little Flowers work introduction",
    url: "https://www.ccel.org/ccel/ugolino/flowers.html",
    locator: "Summary by Emmalon Davis; collection and literary character",
    edition:
      "Modern CCEL work introduction. It places the collection in the early 1300s and discusses its folk-literary character.",
    kind: "scholarship",
    checkedAt,
    rights: "© CCEL; linked and briefly summarized, not reproduced.",
    limits:
      "A modern library introduction, not an eyewitness source or a critical edition establishing each tale's historicity.",
  },
];

export const SAINT_ENTITIES: readonly HumanEntity[] = [
  {
    id: "person-perpetua",
    type: "person",
    name: "Perpetua",
    sourceIds: ["passion-perpetua"],
  },
  {
    id: "person-felicity",
    type: "person",
    name: "Felicity",
    sourceIds: ["passion-perpetua"],
  },
  {
    id: "person-augustine",
    type: "person",
    name: "Augustine of Hippo",
    sourceIds: ["augustine-confessions"],
  },
  {
    id: "person-monica",
    type: "person",
    name: "Monica",
    sourceIds: ["augustine-confessions"],
  },
  {
    id: "person-teresa",
    type: "person",
    name: "Teresa of Ávila",
    sourceIds: ["teresa-life"],
  },
  {
    id: "person-francis",
    type: "person",
    name: "Francis of Assisi",
    sourceIds: ["francis-flowers"],
  },
  {
    id: "place-carthage",
    type: "place",
    name: "Carthage",
    sourceIds: ["passion-perpetua", "augustine-confessions"],
  },
  {
    id: "place-milan",
    type: "place",
    name: "Milan",
    sourceIds: ["augustine-confessions"],
  },
];

export const SAINT_ENTRIES: readonly HumanEntry[] = [
  {
    id: "perpetua",
    title: "Perpetua & Felicity",
    subtitle: "A prison, two mothers and a layered account",
    worlds: ["saints", "witnesses"],
    kind: "autobiography",
    era: "Carthage, 203 CE · composite Christian Passion",
    entityIds: ["person-perpetua", "person-felicity", "place-carthage"],
    introduction:
      "Perpetua's first-person voice reaches us inside a text that someone else completed. Felicity's story is told by that narrator. Reading the two together means noticing who gets to speak.",
    sections: [
      {
        id: "prison",
        title: "A life inside the prison",
        text: "The editor introduces Perpetua as a young woman with a nursing child, then presents her own account. It describes darkness, heat, anxiety for the child and assistance from fellow Christians. Her father repeatedly tries to persuade her to change course. These details make the account particular without requiring us to invent her unrecorded thoughts.",
        sourceIds: ["passion-perpetua"],
      },
      {
        id: "visions",
        title: "An account within an account",
        text: "Sections 3–10 are attributed to Perpetua; her narrated visions belong within them. The text next includes a vision attributed to Saturus, before another narrator carries the story onward. We possess the transmitted composite work, not the handwritten original the editor describes. Its claims about authorship and divine meaning should remain identifiable as claims within that work.",
        sourceIds: ["passion-perpetua"],
      },
      {
        id: "felicity",
        title: "Keep Felicity in view",
        text: "The third-person narrator describes Felicity as enslaved and pregnant, recounts her childbirth in prison and carries both women's stories toward death in the arena. Felicity does not leave a corresponding first-person account in this text. Her words and experiences reach us through the narrator's presentation.",
        sourceIds: ["passion-perpetua"],
      },
      {
        id: "comparison",
        title: "Beside the governor's letter",
        text: "Read this Passion beside Pliny's correspondence while keeping their different times, places and purposes in view. One is a Christian martyr narrative; the other is a Roman official's report and request for instructions. Their comparison opens questions about authority and naming, not a claim that Pliny's procedure directly caused these events.",
        sourceIds: ["passion-perpetua", "pliny-letters"],
      },
    ],
    question:
      "Whose account survives, and whose life must be approached through someone else's words?",
    sourceIds: ["passion-perpetua"],
    reading: {
      label: "Read the Passion · Fordham source edition",
      href: "https://sourcebooks.web.fordham.edu/source/perpetua.asp",
    },
    reviewStatus: "draft",
  },
  {
    id: "augustine",
    title: "Augustine: a life reread",
    subtitle: "Memory becomes an address to God",
    worlds: ["saints", "voices"],
    kind: "autobiography",
    era: "Around 400 CE · retrospective Latin Christian confession",
    entityIds: [
      "person-augustine",
      "person-monica",
      "place-carthage",
      "place-milan",
    ],
    introduction:
      "The Confessions tells a life, but its listener is God. Memory, other people's stories and the reading of Scripture become part of Augustine's account of change.",
    sections: [
      {
        id: "address",
        title: "Who is being addressed?",
        text: "The opening is prayer before it is a chronological account. Augustine narrates his remembered actions and desires while asking about God, knowledge and praise. A reader is listening in on that address. His confession offers a theological interpretation of a life, not a detached record of every event in it.",
        sourceIds: ["augustine-confessions"],
      },
      {
        id: "garden",
        title: "A reading in a garden",
        text: "In book VIII, Augustine recounts hearing a child's repeated words and taking them as a command to read. He opens an apostolic book and reads a passage associated with Romans. Preserve the difference between his recollection of a sound, the action he takes and the divine significance he gives it.",
        sourceIds: ["augustine-confessions"],
      },
      {
        id: "creation",
        title: "The life opens back into Scripture",
        text: "The work continues beyond the conversion narrative. Its later books turn to memory, time and the opening of Genesis. Augustine's reading of creation is therefore an actual part of this work, not an association added merely because both subjects feel profound. Read Genesis alongside him, while keeping his interpretation distinct from its text.",
        sourceIds: ["augustine-confessions", "web-genesis"],
        kind: "interpretation",
      },
      {
        id: "reader",
        title: "Another reader, centuries later",
        text: "In chapter 9 of her own Life, Teresa of Ávila explicitly recalls receiving and reading Augustine's Confessions, including his account of conversion in the garden. This is a documented connection between two works: Teresa herself tells us that she read him. What she makes of the encounter remains her own spiritual testimony.",
        sourceIds: ["teresa-life", "augustine-confessions"],
      },
    ],
    question:
      "How does the act of remembering become part of the life being told?",
    sourceIds: ["augustine-confessions"],
    reading: {
      label: "Read the Confessions · Pusey translation",
      href: "https://www.gutenberg.org/files/3296/3296-h/3296-h.htm",
    },
    reviewStatus: "draft",
  },
  {
    id: "teresa",
    title: "Teresa: another reader in the garden",
    subtitle: "A book, a life and a language for prayer",
    worlds: ["saints", "voices"],
    kind: "autobiography",
    era: "Sixteenth-century Spain · Carmelite Catholic autobiography",
    entityIds: ["person-teresa", "person-augustine"],
    introduction:
      "Teresa describes reading a life written centuries before her own. Later in the same book, she makes the work of prayer visible through a garden and the water it needs.",
    sections: [
      {
        id: "reading",
        title: "A connection she names",
        text: "Life 9.8–10 recounts Teresa receiving Augustine's Confessions. She describes her response to his conversion story and understands it within her own relationship with God. We need not infer literary contact from a shared image: she explicitly identifies the book she read.",
        sourceIds: ["teresa-life", "augustine-confessions"],
      },
      {
        id: "water",
        title: "Four ways to water a garden",
        text: "In chapter 11, Teresa compares forms of prayer with drawing water from a well, raising it by a device, receiving it from a stream and receiving rain. The changing effort of the gardener makes her spiritual teaching imaginable. These are her metaphors within a particular Christian tradition, not a universal psychological scale or an archaeological description of a garden.",
        sourceIds: ["teresa-life"],
        kind: "interpretation",
      },
      {
        id: "edition",
        title: "Notice the layers of the edition",
        text: "The linked English edition includes a translator's preface, a later introduction and notes. Those materials are valuable reception and scholarship, but they are not Teresa's own sixteenth-century speech. Start with her numbered chapters, then inspect the later voices around them.",
        sourceIds: ["teresa-life"],
      },
    ],
    question:
      "What happens when a reader finds words for her own life in someone else's book?",
    sourceIds: ["teresa-life", "augustine-confessions"],
    reading: {
      label: "Read Teresa's Life, chapter 9 · Lewis translation",
      href: "https://www.gutenberg.org/files/8120/8120-h/8120-h.htm#l9.0",
    },
    reviewStatus: "draft",
  },
  {
    id: "francis",
    title: "Francis & the birds",
    subtitle: "A remembered life becomes a Franciscan story",
    worlds: ["saints", "voices"],
    kind: "legend",
    era: "Fourteenth-century collection · remembering the earlier Francis",
    entityIds: ["person-francis"],
    introduction:
      "The Little Flowers tells of Francis preaching to birds. This is later Franciscan hagiography and legendary tradition, not Francis's own record of the encounter.",
    sections: [
      {
        id: "story",
        title: "Enter the tale as a tale",
        text: "Chapter XVI describes Francis seeking counsel about prayer and preaching, then addresses the birds as creatures who owe praise to their creator. The narrative makes them listeners and describes their response. Its form invites a reader into a Franciscan vision of creation and preaching.",
        sourceIds: ["francis-flowers"],
        kind: "legend",
      },
      {
        id: "distance",
        title: "Keep the distance visible",
        text: "The collection comes from the later tradition associated with Brother Ugolino. It should not be treated as a diary, a verbatim sermon transcript or independent verification that birds behaved as narrated. Calling it later tradition preserves the difference between the historical Francis and the literary life remembered around him.",
        sourceIds: ["francis-flowers", "francis-collection"],
      },
      {
        id: "genesis",
        title: "Return to the creatures in Genesis",
        text: "Genesis 1 also brings birds and other creatures into view. Put the chapter beside this tale as an editorial comparison of creaturely life and praise. This comparison does not establish that chapter XVI directly interprets Genesis 1 or that its legendary scene occurred as written.",
        sourceIds: ["francis-flowers", "web-genesis"],
        kind: "interpretation",
      },
    ],
    question:
      "What can a later story reveal about the community that keeps telling it?",
    sourceIds: ["francis-flowers", "francis-collection"],
    reading: {
      label: "Read Little Flowers, chapter XVI · CCEL",
      href: "https://www.ccel.org/ccel/ugolino/flowers.iii.xvi.html",
    },
    reviewStatus: "draft",
  },
];

export const SAINT_CONNECTIONS: readonly HumanConnection[] = [
  {
    id: "pliny-perpetua",
    from: "pliny",
    to: "perpetua",
    label: "An official's report beside a prison account",
    kind: "comparison",
    note: "Different regions, dates and genres. No direct causal connection between Pliny's letter and Perpetua's trial is claimed.",
    sourceIds: ["pliny-letters", "passion-perpetua"],
    reviewStatus: "draft",
  },
  {
    id: "perpetua-augustine",
    from: "perpetua",
    to: "augustine",
    label: "A first-person voice inside a shaped work",
    kind: "comparison",
    note: "An editorial comparison of Christian life-writing, not a claim that the Confessions depends on this Passion.",
    sourceIds: ["passion-perpetua", "augustine-confessions"],
    reviewStatus: "draft",
  },
  {
    id: "augustine-teresa",
    from: "augustine",
    to: "teresa",
    label: "Teresa names the book she read",
    kind: "reception",
    note: "Directly attested literary reception in Life 9.8–10. Her interpretation of that reading remains her theological testimony.",
    sourceIds: ["teresa-life", "augustine-confessions"],
    reviewStatus: "draft",
  },
  {
    id: "augustine-genesis",
    from: "augustine",
    to: "genesis",
    label: "The Confessions returns to creation",
    kind: "reception",
    note: "Books XI–XIII engage Genesis. Augustine's interpretation is identified as a later Latin Christian reading, not equivalent to the biblical text.",
    sourceIds: ["augustine-confessions", "web-genesis"],
    reviewStatus: "draft",
  },
  {
    id: "francis-genesis",
    from: "francis",
    to: "genesis",
    label: "Human beings among other creatures",
    kind: "comparison",
    note: "A thematic comparison with a later Franciscan tale; neither documentary influence nor the tale's historicity is asserted.",
    sourceIds: ["francis-flowers", "web-genesis"],
    reviewStatus: "draft",
  },
];
