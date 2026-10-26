export const NINEVEH_BEATS = [
  { id: "city", label: "The city", reference: "Jonah 3:10–4:4" },
  { id: "mercy", label: "Mercy", reference: "Jonah 3:10" },
  { id: "anger", label: "Anger", reference: "Jonah 4:1–4" },
  { id: "question", label: "The question", reference: "Jonah 4:4" },
] as const;
export const NINEVEH_DISCOVERIES = ["world", "art", "voices"] as const;
export type NinevehDiscovery = typeof NINEVEH_DISCOVERIES[number];
export function parseNinevehHash(hash: string | null) {
  const [beatId, discoveryId, extra] = (hash ?? "").split("/");
  const beat = NINEVEH_BEATS.find(item => item.id === beatId) ?? NINEVEH_BEATS[0];
  const discovery = beat.id === beatId && extra === undefined
    ? NINEVEH_DISCOVERIES.find(id => id === discoveryId) ?? null : null;
  return { beat, discovery };
}
