export const WORLDS = [
  { id: "stories", name: "Stories", description: "Scripture, from the first garden to the early Church. Lives encountered through the biblical text.", invitation: "Begin with Scripture", href: "/jonah/#jonah-1-calling" },
  { id: "witnesses", name: "Witnesses", description: "Jesus and the biblical world in other people's records. Friendly, hostile, fragmentary and disputed.", invitation: "Read Pliny's letters", href: "https://faculty.georgetown.edu/jod/texts/pliny.html" },
  { id: "saints", name: "Saints", description: "Faith lived in particular bodies and places. First-person accounts, later memories and the making of legends.", invitation: "Read Augustine", href: "https://www.gutenberg.org/ebooks/3296" },
  { id: "atlas", name: "Atlas", description: "The ground beneath the stories. Places, civilizations, journeys and the material things that remain.", invitation: "Open the Atlas", href: "/explore/" },
  { id: "voices", name: "Voices", description: "People reading, translating, questioning and making. Theology, philosophy, language and art in conversation.", invitation: "Read Augustine to Jerome", href: "https://www.newadvent.org/fathers/1102071.htm" },
] as const;

export type WorldId = typeof WORLDS[number]["id"];
