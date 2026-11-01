export const WORLD_IDS = ["stories", "witnesses", "saints", "atlas", "voices"] as const;
export type WorldId = typeof WORLD_IDS[number];

export const EVIDENCE_LABELS = {
  scripture: "Scripture",
  artifact: "Material evidence",
  testimony: "Historical testimony",
  autobiography: "Autobiography & memory",
  interpretation: "Interpretation",
  reception: "Art & reception",
  legend: "Later tradition & legend",
} as const;
export type EvidenceKind = keyof typeof EVIDENCE_LABELS;

export interface HumanSource {
  id: string;
  title: string;
  url: string;
  locator: string;
  edition: string;
  kind: EvidenceKind | "scholarship";
  limits: string;
  checkedAt: string;
  rights: string;
}

export interface HumanEntity {
  id: string;
  type: "person" | "place";
  name: string;
  sourceIds: readonly string[];
}

export interface HumanSection {
  id: string;
  title: string;
  text: string;
  sourceIds: readonly string[];
  kind?: EvidenceKind;
}

export interface HumanEntry {
  id: string;
  title: string;
  subtitle: string;
  worlds: readonly WorldId[];
  kind: EvidenceKind;
  era: string;
  entityIds: readonly string[];
  introduction: string;
  sections: readonly HumanSection[];
  question: string;
  sourceIds: readonly string[];
  reading?: { label: string; href: string };
  atlas?: { label: string; href: string; note: string };
  imageId?: string;
  reviewStatus: "draft";
}

export const CONNECTION_LABELS = {
  textual: "In the text",
  context: "Historical context",
  reception: "Later reception",
  comparison: "Editorial comparison",
  disputed: "Disputed connection",
} as const;

export interface HumanConnection {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: keyof typeof CONNECTION_LABELS;
  note: string;
  sourceIds: readonly string[];
  reviewStatus: "draft";
}

export interface HumanGraph {
  entries: readonly HumanEntry[];
  sources: readonly HumanSource[];
  entities: readonly HumanEntity[];
  connections: readonly HumanConnection[];
}

/** Build-time integrity, not a claim that the editorial drafts are approved. */
export function validateHumanGraph(graph: HumanGraph): string[] {
  const errors: string[] = [];
  for (const [kind, records] of Object.entries(graph)) {
    const ids = new Set<string>();
    for (const record of records) {
      if (!/^[a-z][a-z0-9-]+$/.test(record.id) || ids.has(record.id)) errors.push(`${kind}: invalid or duplicate ID ${record.id}`);
      ids.add(record.id);
    }
  }
  const entries = new Set(graph.entries.map(entry => entry.id));
  const entities = new Set(graph.entities.map(entity => entity.id));
  const sources = new Set(graph.sources.map(source => source.id));
  const sourced = (id: string, sourceIds: readonly string[]) => {
    if (!sourceIds.length) errors.push(`${id}: missing source`);
    for (const sourceId of sourceIds) if (!sources.has(sourceId)) errors.push(`${id}: unknown source ${sourceId}`);
  };
  for (const source of graph.sources) {
    if (!source.url.startsWith("https://") || !source.locator || !source.edition || !source.limits || !source.rights || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)) errors.push(`${source.id}: incomplete provenance`);
  }
  for (const entity of graph.entities) sourced(entity.id, entity.sourceIds);
  for (const entry of graph.entries) {
    sourced(entry.id, entry.sourceIds);
    if (!entry.worlds.length || entry.worlds.some(world => !WORLD_IDS.includes(world))) errors.push(`${entry.id}: invalid world`);
    if (!entry.era || !entry.introduction || !entry.question || !entry.sections.length) errors.push(`${entry.id}: incomplete reading room`);
    const sectionIds = new Set<string>();
    for (const section of entry.sections) {
      sourced(`${entry.id}/${section.id}`, section.sourceIds);
      if (sectionIds.has(section.id) || !section.text) errors.push(`${entry.id}: invalid section ${section.id}`);
      sectionIds.add(section.id);
    }
    for (const id of entry.entityIds) if (!entities.has(id)) errors.push(`${entry.id}: unknown entity ${id}`);
    for (const link of [entry.reading, entry.atlas]) {
      if (link && !/^(https:\/\/|\/(?!\/))/.test(link.href)) errors.push(`${entry.id}: invalid reading link`);
    }
  }
  for (const connection of graph.connections) {
    if (!entries.has(connection.from) || !entries.has(connection.to) || connection.from === connection.to) errors.push(`${connection.id}: broken endpoints`);
    sourced(connection.id, connection.sourceIds);
    if (!connection.note || !connection.label) errors.push(`${connection.id}: unexplained connection`);
  }
  return errors;
}

export function connectionsFor(graph: HumanGraph, id: string) {
  return graph.connections.flatMap(connection => {
    const otherId = connection.from === id ? connection.to : connection.to === id ? connection.from : undefined;
    const entry = graph.entries.find(candidate => candidate.id === otherId);
    return entry ? [{ connection, entry }] : [];
  });
}
