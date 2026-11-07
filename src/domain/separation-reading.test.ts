import { test } from "node:test";
import assert from "node:assert/strict";
import { INTERIOR_PASSAGES } from "../content/human-story-interiors.ts";
import { separationReadingText } from "./separation-reading.ts";

test("guided moments preserve the established Wallis passage boundaries exactly", () => {
  const text = separationReadingText(INTERIOR_PASSAGES.childEarlier.text, INTERIOR_PASSAGES.childSeparation.text);
  assert.equal(text.presence, INTERIOR_PASSAGES.childEarlier.text);
  assert.equal(`${text.refusal} ${text.relief}`, INTERIOR_PASSAGES.childSeparation.text);
  assert.ok(text.refusal.endsWith("but my father would not give it him."));
  assert.ok(text.relief.startsWith("And even as God willed it,"));
  assert.throws(() => separationReadingText("", INTERIOR_PASSAGES.childSeparation.text));
  assert.throws(() => separationReadingText(INTERIOR_PASSAGES.childEarlier.text, "A changed or incomplete source paragraph"));
});
