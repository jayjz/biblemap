/** Sourced editorial preview, 2026-10-11. Human editorial approval is not claimed.
 * Scripture remains in the pinned StoryDocument; these are connections and place records.
 */
export const DISCOVERY_SOURCES = {
  pascal: { title: 'Pascal, Pensées · Diversion, §139 (Brunschvicg)', url: 'https://www.gutenberg.org/cache/epub/18269/pg18269-images.html#p_139' },
  joppa: { title: 'Pleiades · Ioppe (Jaffa)', url: 'https://pleiades.stoa.org/places/687931' },
  nineveh: { title: 'Pleiades · Nineveh', url: 'https://pleiades.stoa.org/places/874621' },
  empire: { title: 'British Museum · Assyria: Nineveh', url: 'https://www.britishmuseum.org/collection/galleries/assyria-nineveh' },
  library: { title: 'British Museum · What was Ashurbanipal’s Library?', url: 'https://www.britishmuseum.org/research/projects/what-was-ashurbanipals-library' },
  floodTablet: { title: 'British Museum · The Flood Tablet (K.3375)', url: 'https://www.britishmuseum.org/collection/search?keyword=K.3375' },
  sculpture: { title: 'Cleveland Museum of Art · Jonah Under the Gourd Vine, 1965.239', url: 'https://www.clevelandart.org/art/1965.239' },
  jerwan: { title: 'ORACC · Sennacherib 226 (Q004031)', url: 'https://oracc.museum.upenn.edu/rinap/rinap3/Q004031' },
  jerwanStudy: { title: 'University of Chicago · Sennacherib’s Aqueduct at Jerwan', url: 'https://isac.uchicago.edu/publications/sennacheribs-aqueduct-jerwan' },
} as const;

export const STORY_PLACES = {
  joppa: {
    id: 'joppa', name: 'Joppa', modernName: 'Jaffa · Mediterranean coast',
    longitude: 34.7499295, latitude: 32.053079,
    sourceId: 'joppa', returnScene: 'jonah-1-escape',
    introduction: 'A port makes departure possible. Jonah’s decision takes physical form here: a ship, a fare, a place on board.',
    geography: 'Joppa is identified with Jaffa, an ancient port on the Mediterranean coast. This point locates the city; the passage does not identify a quay or a sailing route.',
  },
  nineveh: {
    id: 'nineveh', name: 'Nineveh', modernName: 'Opposite Mosul · Tigris valley',
    longitude: 43.159936889690734, latitude: 36.36076152375775,
    sourceId: 'nineveh', returnScene: 'jonah-3-mercy',
    introduction: 'The city in the story belongs to a wider world of palaces, conquest, gardens, and books written in clay.',
    geography: 'Nineveh stood beside the Tigris, opposite modern Mosul in northern Iraq. The marker locates the ancient city, not Jonah’s movements within it.',
  },
} as const;
export type StoryPlace = typeof STORY_PLACES[keyof typeof STORY_PLACES];
export function storyPlaceFromParam(value: unknown): StoryPlace | undefined {
  return value === 'joppa' || value === 'nineveh' ? STORY_PLACES[value] : undefined;
}
export function storyPlaceHref(id: keyof typeof STORY_PLACES, from?: string) {
  const place = STORY_PLACES[id];
  return `/explore/?place=${place.id}&from=${from ?? place.returnScene}`;
}
