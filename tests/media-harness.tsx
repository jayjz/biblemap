// Test-only entry, bundled in memory by esbuild. Never imported by the app.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { AudioTrack, StoryArtwork } from "../src/features/story/StoryMedia";
import type { CuratedMediaAsset } from "../src/domain/media";
import { JONAH_MEDIA_REVIEW } from "../src/content/jonah-media";

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
  const [portrait, setPortrait] = useState(false);
  // Synthetic harness URL and approval identity; real scoped approval is tested on /jonah/.
  const testPortrait: CuratedMediaAsset = { ...JONAH_MEDIA_REVIEW[0], reviewStatus: "approved", reviewedBy: "test-fixture-only", downloadedAt: "2026-10-10", localPath: "/media/test-reviewed-portrait.jpg" };
  return <main><button onClick={() => setMounted(false)}>Leave scene</button>
    <button onClick={() => setPortrait(true)}>Show test-approved portrait</button>
    {mounted && <AudioTrack asset={fixture} label="Narration" transcript="Test transcript" />}
    <div className="story-root" style={{ maxWidth: 520, margin: "2rem auto" }}><StoryArtwork sceneId="jonah-1-calling" asset={portrait ? testPortrait : { ...fixture, id: "test-image", class: "artistic-depiction", localPath: "/media/test-missing.jpg" }} /></div>
    <div data-testid="unapproved-art"><StoryArtwork asset={{ ...testPortrait, reviewStatus: "rights-verified", reviewedBy: "", localPath: "/media/test-unapproved.jpg", rightsUse: "restricted", license: "In Copyright" }} /></div>
    <div data-testid="unresolved-art"><StoryArtwork asset={{ ...testPortrait, rightsUse: "unresolved", localPath: "/media/test-unresolved.jpg" }} /></div>
    <div data-testid="license-claim-art"><StoryArtwork asset={{ ...testPortrait, reviewStatus: "candidate", reviewedBy: "", rightsUse: "open", localPath: "/media/test-license-claim.jpg" }} /></div>
  </main>;
}
const root = document.getElementById("test-root");
if (!root) throw new Error("Test root missing");
createRoot(root).render(<Harness />);
