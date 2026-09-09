import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  beatKindLabel,
  claimKindLabel,
  isProductionReadyContext,
  validateHistoricalContext,
  type HistoricalContext,
} from "./historical-context.ts";

function validDraft(overrides: Partial<HistoricalContext> = {}): HistoricalContext {
  return {
    id: "test-context",
    sceneIds: ["test-scene"],
    eventIds: [],
    journeyIds: ["test"],
    region: "Test region",
    periodLabel: "Test period",
    narrative: "A short human-world paragraph.",
    beats: [{ kind: "people", text: "A community.", claimKind: "biblical-text" }],
    confidence: "biblical-text",
    sourceIds: ["src-1"],
    reviewStatus: "approved",
    reviewedBy: "test",
    ...overrides,
  };
}

describe("historical context validation", () => {
  it("accepts a sparse approved record", () => {
    const result = validateHistoricalContext(validDraft());
    assert.equal(result.ok, true);
    assert.equal(isProductionReadyContext(validDraft()), true);
  });

  it("requires uncertainty when confidence is disputed", () => {
    const result = validateHistoricalContext(validDraft({ confidence: "disputed" }));
    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /uncertainty/);
  });

  it("requires uncertainty when confidence is traditional", () => {
    const result = validateHistoricalContext(validDraft({ confidence: "traditional" }));
    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /uncertainty/);
  });

  it("rejects an unsourced record", () => {
    const result = validateHistoricalContext(validDraft({ sourceIds: [] }));
    assert.equal(result.ok, false);
  });

  it("rejects a draft from production rendering", () => {
    assert.equal(isProductionReadyContext(validDraft({ reviewStatus: "draft" })), false);
  });

  it("rejects a missing narrative or empty scene list", () => {
    assert.equal(validateHistoricalContext(validDraft({ narrative: "   " })).ok, false);
    assert.equal(validateHistoricalContext(validDraft({ sceneIds: [] })).ok, false);
  });

  it("rejects an oversized narrative and too many beats", () => {
    assert.equal(validateHistoricalContext(validDraft({ narrative: "x".repeat(901) })).ok, false);
    assert.equal(
      validateHistoricalContext(
        validDraft({
          beats: Array.from({ length: 5 }, () => ({
            kind: "people" as const,
            text: "A community.",
            claimKind: "biblical-text" as const,
          })),
        })
      ).ok,
      false
    );
  });

  it("labels claim kinds for the UI", () => {
    assert.equal(claimKindLabel("archaeological"), "Archaeological evidence");
    assert.equal(claimKindLabel("disputed"), "Disputed");
    assert.equal(claimKindLabel("biblical-text"), "Biblical text");
  });

  it("labels beat kinds for the UI", () => {
    assert.equal(beatKindLabel("people"), "Who lives here");
    assert.equal(beatKindLabel("power"), "Who holds power");
    assert.equal(beatKindLabel("change"), "What changed");
    assert.equal(beatKindLabel("evidence"), "What survives");
  });
});
