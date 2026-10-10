import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { JONAH } from "../src/content/jonah.ts";
import { validateStory } from "../src/domain/story.ts";
import scripture from "../src/content/scripture/web-jonah-1.json" with { type: "json" };

const errors = validateStory(JONAH, process.argv.includes("--release") ? "release" : JONAH.mode);
const snapshot = readFileSync(new URL("../src/content/scripture/web-jonah-1.html", import.meta.url));
const checksum = `sha256:${createHash("sha256").update(snapshot).digest("hex")}`;
for (const p of JONAH.passages) {
  if (p.checksum !== checksum) errors.push(`${p.id}: source checksum mismatch`);
  const verses = scripture.verses.filter(v => v.number >= p.firstVerse && v.number <= p.lastVerse);
  const notes = scripture.notes.filter(n => n.verse >= p.firstVerse && n.verse <= p.lastVerse);
  if (JSON.stringify(p.verses) !== JSON.stringify(verses) || JSON.stringify(p.notes) !== JSON.stringify(notes)) errors.push(`${p.id}: displayed text differs from pinned scripture`);
  if (p.translationId !== "WEB-engwebp" || p.sourceVersion !== scripture.sourceVersion || p.sourceId !== "web-jonah-1") errors.push(`${p.id}: translation provenance mismatch`);
}
const verseNumbers = JONAH.passages.flatMap(p => p.verses.map(v => v.number));
if (verseNumbers.length !== 17 || verseNumbers.some((v, i) => v !== i + 1)) errors.push("Jonah 1 must contain each verse exactly once");
for (const asset of JONAH.media) {
  const file = readFileSync(new URL(`../public${asset.localPath}`, import.meta.url));
  if (asset.checksum !== `sha256:${createHash("sha256").update(file).digest("hex")}`) errors.push(`${asset.id}: media checksum mismatch`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`✓ Jonah content validates in ${JONAH.mode} mode; release requires human authorship and approval`);
