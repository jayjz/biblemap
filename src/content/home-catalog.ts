import { HUMAN_GRAPH } from "./human-story.ts";
import { THOMAS_ROUTES } from "./thomas.ts";
import type { HomeDestination } from "../domain/home-curation.ts";

/** Route registration is independent of feature selection and publication authorization. */
export const HOME_CATALOG: readonly HomeDestination[] = [
  ...HUMAN_GRAPH.entries.map(entry => ({
    id: entry.id, title: entry.title, subtitle: entry.subtitle, kind: entry.kind,
    worlds: entry.worlds, era: entry.era, scopeEntryId: entry.id,
    href: entry.id === "jonah" ? "/jonah/#jonah-1-calling" : `/human-story/${entry.id}/`,
    searchText: [entry.title, entry.subtitle, entry.introduction,
      ...entry.entityIds.map(id => HUMAN_GRAPH.entities.find(entity => entity.id === id)?.name ?? ""),
    ].join(" "),
  })),
  {
    id: "thomas", title: "Thomas: The Witness", subtitle: "John’s account of absence, testimony and encounter",
    href: THOMAS_ROUTES.encounter, kind: "scripture", worlds: ["stories"], era: "John 20:24–31",
    searchText: "Thomas witness John 20 absence testimony doubt encounter confession Gospel of Thomas sayings manuscripts",
  },
  {
    id: "lachish", title: "Lachish: Before the Walls Fell", subtitle: "Scripture, Assyrian reliefs and archaeological remains",
    href: "/lachish/", kind: "artifact", worlds: ["stories", "atlas"], era: "701 BCE · Assyrian siege of Lachish",
    searchText: "Lachish Judah Assyria Sennacherib siege households reliefs archaeology 701",
  },
];
