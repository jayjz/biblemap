import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JONAH } from "../src/content/jonah.ts";
import { approvedAuthoredText, type AuthoredText, type StoryDocument } from "../src/domain/story.ts";
import { artifactMatches, readPublicArtifacts, type PublicArtifact } from "./release-gate-inventory.ts";

export function privateStoryProbes(story: StoryDocument): string[] {
  const copy = (value: AuthoredText) => approvedAuthoredText(value) !== null ? [] : [value.status === "placeholder" ? value.slot : value.text];
  return [...new Set([
    ...story.scenes.flatMap(scene => [scene.title, scene.narrative, ...scene.reflections.map(r => r.prompt), ...(scene.narration ? [scene.narration.transcript] : [])].flatMap(copy)),
    ...story.geography.flatMap(place => copy(place.explanation)),
    ...story.claims.flatMap(claim => copy(claim.statement)),
    ...story.scenes.flatMap(scene => scene.readingGuide && ["internal-draft", "excluded-experimental"].includes(scene.readingGuide.status) ? [scene.readingGuide.title, scene.readingGuide.question, scene.readingGuide.context] : []),
    '"review":{"status":"draft"}', '"mode":"author-review"', '"reviewStatus":"draft"',
    "No one dies for a lie.", "purefaith", "The father is mourning",
    "Felicity's dedication to the Spirit of God", "When I read historical accounts", "authorship in progress",
  ])];
}

/** A second boundary check over the bytes visitors can actually retrieve. */
export function visitorExportErrors(artifacts: readonly PublicArtifact[], story = JONAH): string[] {
  const errors = privateStoryProbes(story).flatMap(probe => artifactMatches(artifacts, probe).map(path => `${path}: private editorial data exposed (${probe})`));
  for (const path of ["jonah/index.html", "jonah/index.txt"]) {
    if (!artifacts.some(artifact => artifact.path === path)) errors.push(`Missing required export artifact: ${path}`);
  }
  for (const probe of ['"reviewedBy":', '"reviewStatus":', '"authorId":', '"reviewedAt":']) {
    for (const path of artifactMatches(artifacts.filter(a => a.path.startsWith("jonah/")), probe)) errors.push(`${path}: internal approval metadata exposed (${probe})`);
  }
  if (!artifacts.some(artifact => artifact.path.startsWith("jonah/__next.") && artifact.path.endsWith(".txt"))) errors.push("Missing alternate Jonah RSC artifacts");
  const html = artifacts.filter(artifact => artifact.path === "jonah/index.html");
  for (const passage of story.passages) for (const verse of passage.verses) {
    if (!artifactMatches(html, verse.text).length) errors.push(`No-JS Scripture missing or altered: ${passage.chapter}:${verse.number}`);
  }
  for (const qualification of story.scenes.some(scene => scene.readingGuide?.status === "provisional") ? ["Companion titles, questions and notes are provisional commentary", "Commentary awaiting human review, separate from Scripture"] : ["Companion titles, questions and notes are commentary, separate from the World English Bible text"]) {
    if (!artifactMatches(html, qualification).length) errors.push(`Missing visitor qualification: ${qualification}`);
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const artifacts = readPublicArtifacts("out");
  const errors = visitorExportErrors(artifacts);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Visitor boundary: ${artifacts.length} HTML/RSC/JS/JSON and alternate text artifacts inspected; private editorial probes absent; all 48 WEB verses and provisional qualifications retained. Publication approval is still required.`);
}
