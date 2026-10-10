// Local-only entry, bundled in memory by review-jonah.mjs. Never imported by Next.
import { createRoot } from "react-dom/client";
import { JONAH } from "../src/content/jonah";
import { JONAH_ARTWORK_PLACEMENTS, JONAH_MEDIA_REVIEW } from "../src/content/jonah-media";
import { StoryReader } from "../src/features/story/StoryReader";

const previewMedia = JONAH_ARTWORK_PLACEMENTS.map(placement => {
  const asset = JONAH_MEDIA_REVIEW.find(asset => asset.id === placement.assetId);
  if (!asset) throw new Error(`Missing preview artwork ${placement.assetId}`);
  return { sceneIds: placement.sceneIds, asset: { ...asset, localPath: `/review-assets/${asset.localPath.split("/").at(-1)}` } };
});
const root = document.getElementById("review-root");
if (!root) throw new Error("Missing review root");
createRoot(root).render(<><div className="local-review-banner">LOCAL CREATOR REVIEW · Artwork placements and editorial copy await approval. <a href="/gallery">Inspect all six supplied images →</a></div><StoryReader story={JONAH} localReview previewMedia={previewMedia} /></>);
