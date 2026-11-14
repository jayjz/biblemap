import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JONAH_LETTERS, JONAH_LETTER_REVIEW, JONAH_LETTER_SOURCES } from "../content/jonah-letters.ts";

test("each displayed letter excerpt is verbatim in the frozen, scan-checked historical context", () => {
  const bytes = readFileSync(new URL("../content/scripture/jonah-letters-cunningham.json", import.meta.url));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "7fd9e1c81f39fd698a9e05f0a28a24d3224ab34175f7edd74e25e534ba6b15a2");
  const snapshot = JSON.parse(bytes.toString("utf8"));
  for (const letter of JONAH_LETTERS) {
    const paragraph = snapshot.paragraphs.find((item: { sourceId: string }) => item.sourceId === letter.sourceId);
    assert.ok(paragraph, letter.sourceId);
    assert.ok(paragraph.context.includes(letter.quote), `${letter.author}: altered quotation`);
    assert.equal(paragraph.scanUrl, letter.scanUrl);
    assert.equal(paragraph.author, letter.author);
    assert.match(paragraph.scanSha256, /^[a-f0-9]{64}$/);
    assert.ok(letter.locator.includes(paragraph.locator.includes("327") ? "327" : "342"));
  }
});

test("reception retains its evidence class, edition, rights, limitations and draft review boundary", () => {
  assert.equal(JONAH_LETTER_REVIEW.status, "draft");
  assert.equal(new Set(JONAH_LETTERS.map((letter) => letter.id)).size, 2);
  for (const letter of JONAH_LETTERS) {
    const source = JONAH_LETTER_SOURCES.find((item) => item.id === letter.sourceId);
    assert.ok(source);
    assert.equal(source.kind, "interpretation");
    assert.match(source.edition, /Cunningham/);
    assert.match(source.edition, /1887/);
    assert.match(source.rights, /[Pp]ublic.domain/);
    assert.match(source.limits, /not|neither/);
    assert.match(source.url, /^https:\/\/www\.ccel\.org\//);
  }
  assert.match(JONAH_LETTER_SOURCES[1].limits, /not independent witnesses/);
  assert.match(JONAH_LETTER_SOURCES[0].limits, /does not identify/);
});
