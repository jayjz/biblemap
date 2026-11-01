/** An authored reading sequence, never a claimed historical itinerary. */
export interface HumanPath {
  id: string;
  title: string;
  description: string;
  worlds: string;
  stops: readonly { entryId: string; invitation: string }[];
}

export const HUMAN_PATHS: readonly HumanPath[] = [
  {
    id: "a-word-crosses-centuries",
    title: "A word crosses centuries",
    description:
      "From a city and a biblical story to marble, translation and two Jewish readings. Watch one story acquire new forms without losing its own ending.",
    worlds: "Stories / Atlas / Voices",
    stops: [
      {
        entryId: "nineveh",
        invitation:
          "Start with what an object can—and cannot—tell us about the city.",
      },
      {
        entryId: "jonah",
        invitation: "Read the narrative before turning to its interpreters.",
      },
      {
        entryId: "jonah-in-marble",
        invitation: "Notice what a sculptor makes visible and holds still.",
      },
      {
        entryId: "jerome",
        invitation: "Listen as a familiar plant-name becomes contested.",
      },
      {
        entryId: "rashi-radak",
        invitation:
          "Return to the final question with two different Jewish readings.",
      },
    ],
  },
  {
    id: "a-name-under-pressure",
    title: "A name under pressure",
    description:
      "Move from Gospel testimony to a Roman historian, a governor's letters and a prison account. Keep asking who speaks, who is described and what each source can establish.",
    worlds: "Stories / Witnesses / Saints / Atlas",
    stops: [
      {
        entryId: "emmaus",
        invitation:
          "Begin with Luke's resurrection narrative on its own terms.",
      },
      {
        entryId: "tacitus",
        invitation: "Change the genre: a hostile Roman account written later.",
      },
      {
        entryId: "pliny",
        invitation: "Change the question: a governor asks for instructions.",
      },
      {
        entryId: "perpetua",
        invitation: "Enter a Christian account with more than one narrator.",
      },
      {
        entryId: "mediterranean",
        invitation: "Place these accounts in different cities and centuries.",
      },
    ],
  },
  {
    id: "a-life-in-another-life",
    title: "A life in another life",
    description:
      "A painted beginning leads back to Genesis, into Augustine's Confessions and onward to Teresa, who tells us she read him.",
    worlds: "Stories / Saints / Voices / Atlas",
    stops: [
      {
        entryId: "genesis-in-paint",
        invitation:
          "Start with a familiar gesture in an unfamiliar architectural frame.",
      },
      {
        entryId: "genesis",
        invitation: "Return to the biblical chapter beyond the painted scene.",
      },
      {
        entryId: "augustine",
        invitation: "Meet a writer who reads his life and reads creation.",
      },
      {
        entryId: "teresa",
        invitation: "Follow a connection the later reader explicitly names.",
      },
    ],
  },
];
