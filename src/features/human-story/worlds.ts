import { WORLD_IDS, type WorldId } from "@/domain/human-story";

const details: Record<WorldId, { name: string; description: string }> = {
  stories: {
    name: "Stories",
    description:
      "Scripture, from the first garden to the early Church. Lives encountered through the biblical text.",
  },
  witnesses: {
    name: "Witnesses",
    description:
      "Jesus and the biblical world in other people's records. Friendly, hostile, fragmentary and disputed.",
  },
  saints: {
    name: "Saints",
    description:
      "Faith lived in particular bodies and places. First-person accounts, later memories and the making of legends.",
  },
  atlas: {
    name: "Atlas",
    description:
      "The ground beneath the stories. Places, civilizations, journeys and the material things that remain.",
  },
  voices: {
    name: "Voices",
    description:
      "People reading, translating, questioning and making. Theology, philosophy, language and art in conversation.",
  },
};

export const WORLDS = WORLD_IDS.map((id) => ({ id, ...details[id] }));
