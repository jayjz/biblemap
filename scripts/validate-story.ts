import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { JONAH, JONAH_CHAPTERS } from "../src/content/jonah.ts";
import { validateStory } from "../src/domain/story.ts";


const errors = validateStory(JONAH, process.argv.includes("--release") ? "release" : JONAH.mode);
for (const p of JONAH.passages) {
  const scripture = JONAH_CHAPTERS[p.chapter - 1];
  const snapshot = readFileSync(new URL(`../src/content/scripture/web-jonah-${p.chapter}.html`, import.meta.url));
  const checksum = `sha256:${createHash("sha256").update(snapshot).digest("hex")}`;
  if (p.checksum !== checksum) errors.push(`${p.id}: source checksum mismatch`);
  const verses = scripture.verses.filter(v => v.number >= p.firstVerse && v.number <= p.lastVerse);
  const notes = scripture.notes.filter(n => n.verse >= p.firstVerse && n.verse <= p.lastVerse);
  if (JSON.stringify(p.verses) !== JSON.stringify(verses) || JSON.stringify(p.notes) !== JSON.stringify(notes)) errors.push(`${p.id}: displayed text differs from pinned scripture`);
  if (p.translationId !== "WEB-engwebp" || p.sourceVersion !== scripture.sourceVersion || p.sourceId !== `web-jonah-${p.chapter}`) errors.push(`${p.id}: translation provenance mismatch`);
}
for (const [index, scripture] of JONAH_CHAPTERS.entries()) {
  const verses = JONAH.passages.filter(p => p.chapter === index + 1).flatMap(p => p.verses);
  if (JSON.stringify(verses) !== JSON.stringify(scripture.verses)) errors.push(`Jonah ${index + 1} must contain each verse exactly once, in publisher order`);
}
const usedPassages = JONAH.scenes.flatMap(scene => scene.passageIds);
if (usedPassages.length !== JONAH.passages.length || new Set(usedPassages).size !== usedPassages.length) errors.push("Every passage must occur in exactly one scene");
for (const asset of JONAH.media) {
  const file = readFileSync(new URL(`../public${asset.localPath}`, import.meta.url));
  if (asset.checksum !== `sha256:${createHash("sha256").update(file).digest("hex")}`) errors.push(`${asset.id}: media checksum mismatch`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`✓ Jonah content validates in ${JONAH.mode} mode; release requires human authorship and approval`);
