// Test-only entry, bundled in memory by esbuild. Never imported by the app.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { AudioTrack, StoryArtwork } from "../src/features/story/StoryMedia";
import type { CuratedMediaAsset } from "../src/domain/media";

const fixture: CuratedMediaAsset = {
  id: "test-audio", eventIds: [], journeyIds: [], class: "narration", title: "Test-only silence",
  creator: "Automated test fixture", creationDate: "2026", depictedPeriod: "None",
  sourceInstitution: "Test harness", sourceRecordUrl: "https://example.test/fixture",
  originalAssetUrl: "https://example.test/fixture.wav", license: "CC0-1.0",
  rightsStatement: "Programmatically generated silence for testing only", requiredAttribution: "Test fixture",
  downloadedAt: "2026-10-10", checksum: `sha256:${"0".repeat(64)}`, localPath: "/media/test-silence.wav",
  altText: "Test", caption: "Test transcript", historicalFit: "No historical claim",
  editorialReason: "Automated testing only", reviewStatus: "approved", reviewedBy: "test-fixture-only",
};
function Harness() {
  const [mounted, setMounted] = useState(true);
  return <main><button onClick={() => setMounted(false)}>Leave scene</button>
    {mounted && <AudioTrack asset={fixture} label="Narration" transcript="Test transcript" />}
    <StoryArtwork asset={{ ...fixture, id: "test-image", class: "artistic-depiction", localPath: "/media/test-missing.jpg" }} />
  </main>;
}
const root = document.getElementById("test-root");
if (!root) throw new Error("Test root missing");
createRoot(root).render(<Harness />);
