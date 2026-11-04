import type { PrisonScene } from "../content/perpetua-encounter.ts";

export type VisitorPrisonScene = Pick<PrisonScene,
  "id" | "name" | "title" | "voice" | "voiceLabel" | "locator" | "sourceId" |
  "text" | "evidence" | "limit" | "visualDescription" | "relationships"
>;

/** Intentional sourced review copy, without the internal editorial record. */
export function projectVisitorPrison(scenes: readonly PrisonScene[]): VisitorPrisonScene[] {
  return scenes.map(scene => ({
    id: scene.id, name: scene.name, title: scene.title, voice: scene.voice,
    voiceLabel: scene.voiceLabel, locator: scene.locator, sourceId: scene.sourceId,
    text: [...scene.text], evidence: scene.evidence, limit: scene.limit,
    visualDescription: scene.visualDescription,
    relationships: scene.relationships.map(({ id, name, position, observation }) => ({ id, name, position, observation })),
  }));
}

/** Unknown/foreign fragments fail safely; IDs are never array positions. */
export const PRISON_SOURCE_FRAGMENTS = ["#source-passion-perpetua", "#source-passion-wallis", "#source-felicity-art", "#source-vision-art", "#source-cassatt-art", "#source-perpetua-art", "#beyond-prison", "#comparison", "#ending-research"] as const;

export function visitorPrisonView(hash: string | null, scenes: readonly VisitorPrisonScene[]) {
  const legacy: Record<string, string> = { "#prison": "child", "#visions": "vision", "#felicity": "felicity" };
  const id = hash ? (PRISON_SOURCE_FRAGMENTS.some(fragment => fragment === hash) ? "handover" : Object.hasOwn(legacy, hash) ? legacy[hash] : hash.replace(/^#perpetua-/, "")) : undefined;
  return { enhanced: hash !== null, all: id === "all", scene: scenes.find(scene => scene.id === id) ?? scenes[0] };
}
