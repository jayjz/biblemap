import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JONAH } from "../src/content/jonah.ts";
import { HUMAN_GRAPH } from "../src/content/human-story.ts";
import { PRISON_SCENES } from "../src/content/perpetua-encounter.ts";
import { validateStory, type AuthoredText, type StoryDocument } from "../src/domain/story.ts";

/** Diagnostic evidence, never a scoped release gate or a publication decision. */
export const GROUPS = {
  "scene-authorship": {
    category: "creator-authored content",
    rule: "checkCopy: unfinished author slot in release mode",
    markup: "Visitor projection omits private author slots and written drafts before rendering. Provisional companion titles remain qualified review copy.",
    blocks: "Full editorial release. Private source records are excluded by the visitor projection; validate:export verifies the generated boundary.",
    authority: "Creator writes the material; human editorial reviewer approves the exact revision.",
    closure: "Creator-supplied text with author identity and genuine review decision; rerun validate:release and inspect the export.",
  },
  "geography-authorship": {
    category: "geography",
    rule: "checkCopy: unfinished author slot in release mode",
    markup: "Placeholder explanation withheld. StoryEvidence uses separate Pleiades notes for Nineveh/Joppa and an uncertainty fallback for Tarshish.",
    blocks: "Full editorial release. Private source records are excluded by the visitor projection; validate:export verifies the generated boundary.",
    authority: "Creator/editor authors explanation; qualified geographic/historical reviewer verifies evidence and uncertainty.",
    closure: "Sourced explanation with limitations, approved exact text and genuine reviewer/date; no inferred route or location.",
  },
  "scene-approval": {
    category: "internal metadata governing public scenes",
    rule: "checkReview: human approval required in release mode",
    markup: "Scripture, rights-cleared media and explicitly provisional companions remain visible review content; scene approval records are omitted before rendering.",
    blocks: "Full editorial publication. A publicly reachable review export and technical checks do not establish approval.",
    authority: "Human editorial reviewer and creator publication authority.",
    closure: "Traceable decision covering the exact scene revision, reviewer identity, date and scope; a nonempty string is not proof of a decision.",
  },
  "companion-approval": {
    category: "provisional commentary",
    rule: "readingGuide: reading companion requires human approval in release mode",
    markup: "Companion title, context and selected questions remain visible; the introduction, standalone questions and companion disclosures qualify them as provisional commentary separate from Scripture.",
    blocks: "Full editorial publication. A publicly reachable review export and technical checks do not establish approval.",
    authority: "Human theological/editorial reviewer and creator publication authority.",
    closure: "Review each title/question/context against its passage and record the real decision. ReadingGuide currently only supports provisional: a separately reviewed schema change would be needed to represent approval.",
  },
} as const;

type Group = keyof typeof GROUPS;
interface InventoryItem {
  id: string;
  sourceFile: string;
  sourcePath: string;
  validatorId: string;
  validationError: string;
  group: Group;
  route: string;
  payloadProbe: string;
}

/** Preserve duplicate validator IDs by identifying the precise authored field. */
export function classifyReleaseErrors(story: StoryDocument): InventoryItem[] {
  const remaining = validateStory(story, "release");
  const items: InventoryItem[] = [];
  const add = (validatorId: string, path: string, group: Group, message: string, payloadProbe: string, route: string) => {
    const validationError = `${validatorId}: ${message}`;
    const index = remaining.indexOf(validationError);
    if (index < 0) throw new Error(`Inventory has no matching validation failure: ${path}`);
    remaining.splice(index, 1);
    items.push({ id: path, sourceFile: "src/content/jonah.ts", sourcePath: `JONAH.${path}`, validatorId, validationError, group, route, payloadProbe });
  };
  const copy = (id: string, path: string, value: AuthoredText, group: Group, route: string) => {
    if (value.status === "placeholder") add(id, path, group, "unfinished author slot", value.slot, route);
  };
  for (const place of story.geography) copy(place.placeId, `geography[${place.placeId}].explanation`, place.explanation, "geography-authorship", "/jonah/");
  for (const scene of story.scenes) {
    const path = `scenes[${scene.id}]`;
    const route = `/jonah/#${scene.id}`;
    if (scene.readingGuide) add(scene.id, `${path}.readingGuide`, "companion-approval", "reading companion requires human approval", scene.readingGuide.context, route);
    if (scene.review.status === "draft") add(scene.id, `${path}.review`, "scene-approval", "human approval required", `"review":${JSON.stringify(scene.review)}`, route);
    copy(scene.id, `${path}.title`, scene.title, "scene-authorship", route);
    copy(scene.id, `${path}.narrative`, scene.narrative, "scene-authorship", route);
    for (const reflection of scene.reflections) copy(reflection.id, `${path}.reflections[${reflection.id}].prompt`, reflection.prompt, "scene-authorship", route);
  }
  // New failures cannot silently disappear from this bounded triage inventory.
  if (remaining.length) throw new Error(`Unclassified release failures:\n${remaining.join("\n")}`);
  return items;
}

export interface PublicArtifact { path: string; text: string }

/** Inspect all text artifacts, including alternate routes, JSON, RSC and JS. */
export function artifactMatches(artifacts: readonly PublicArtifact[], probe: string): string[] {
  if (!probe.trim()) throw new Error("An empty probe cannot establish publication exposure");
  const escaped = JSON.stringify(probe).slice(1, -1);
  const html = probe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  return artifacts.filter(artifact => [probe, escaped, html].some(value => artifact.text.includes(value))).map(artifact => artifact.path);
}

export function readPublicArtifacts(directory: string): PublicArtifact[] {
  const root = resolve(directory);
  const artifacts = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(?:html|txt|json|js|map|xml|svg)$/i.test(entry.name))
    .map(entry => {
      const path = join(entry.parentPath, entry.name);
      return { path: relative(root, path).replaceAll("\\", "/"), text: readFileSync(path, "utf8") };
    }).sort((a, b) => a.path.localeCompare(b.path));
  if (!artifacts.some(artifact => artifact.path === "index.html")) throw new Error("Build the ordinary static export first: index.html is missing");
  return artifacts;
}

export function createInventory(artifacts: readonly PublicArtifact[]) {
  const errors = classifyReleaseErrors(JONAH);
  const groups = Object.fromEntries(Object.entries(GROUPS).map(([id, group]) => [id, { ...group, count: errors.filter(item => item.group === id).length }]));
  return {
    schemaVersion: 1,
    purpose: "Evidence inventory only. Does not authorize publication or replace validate:release. All group details apply to each referenced item.",
    publicationDecision: "BLOCKED — HUMAN APPROVAL REQUIRED",
    fullReleaseErrors: errors.length,
    groups,
    items: errors.map(item => ({ ...item, exportedArtifacts: artifactMatches(artifacts, item.payloadProbe) })),
    humanStory: {
      status: "Every entry/connection and prison scene remains draft. No approval is inferred from provenance fields or technical CI.",
      entries: HUMAN_GRAPH.entries.map(entry => ({ id: entry.id, reviewStatus: entry.reviewStatus, category: entry.kind, sourceIds: entry.sourceIds, route: `/human-story/${entry.id}/`, exportedRoute: artifacts.some(artifact => artifact.path === `human-story/${entry.id}/index.html`) })),
      connections: HUMAN_GRAPH.connections.map(connection => ({ id: connection.id, from: connection.from, to: connection.to, reviewStatus: connection.reviewStatus, category: connection.kind, sourceIds: connection.sourceIds })),
      prisonScenes: PRISON_SCENES.map(scene => ({ id: scene.id, reviewStatus: scene.reviewStatus, locator: scene.locator, voice: scene.voice })),
    },
    privateCreatorProbes: [
      "No one dies for a lie.", "purefaith", "The father is mourning",
      "Felicity's dedication to the Spirit of God", "When I read historical accounts",
      "authorship in progress",
    ].map(probe => ({ probe, exportedArtifacts: artifactMatches(artifacts, probe) })),
    limitations: [
      "Exact-string artifact matches establish exposure, not human visibility. Encoded/compressed/binary content and changed wording require separate inspection.",
      "Approval authenticity and historical truth require accountable human review; current validators only check structured metadata.",
      "This inventory is deliberately bounded to the reproduced Jonah failures and Human Story review scope; unclassified Jonah failures abort generation.",
    ],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const destination = "docs/editorial/evidence/release-gate-inventory.json";
  const inventory = {
    ...createInventory(readPublicArtifacts("out")),
    inspectedBuildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
    sourceChecksums: Object.fromEntries([
      "src/content/jonah.ts", "src/domain/story.ts", "scripts/validate-story.ts",
      "src/content/human-story.ts", "src/content/human-story-saints.ts",
      "src/content/human-story-witnesses.ts", "src/content/human-story-culture.ts",
      "src/content/human-story-interiors.ts", "src/content/perpetua-encounter.ts",
    ].map(path => [path, `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`])),
  };
  writeFileSync(destination, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(`${destination}: ${inventory.fullReleaseErrors} full-release failures; ${inventory.humanStory.entries.length} draft reading routes. Diagnostic complete; publication remains BLOCKED.`);
}
