// Local-only entry, bundled in memory by review-jonah.mjs. Never imported by Next.
import { createRoot } from "react-dom/client";
import { JONAH } from "../src/content/jonah";
import { JONAH_VISUAL_REVIEW } from "../src/content/jonah-visual-review";
import { StoryReader } from "../src/features/story/StoryReader";

const previewMedia = JONAH_VISUAL_REVIEW.map(entry => ({
  sceneIds: entry.sceneIds,
  asset: { ...entry.asset, localPath: `/review-assets/${entry.asset.localPath.split("/").at(-1)}` },
}));
const root = document.getElementById("review-root");
if (!root) throw new Error("Missing review root");
createRoot(root).render(<><div className="local-review-banner">LOCAL VISUAL REVIEW · Open images are on the public reader. Two scenes use rights-unresolved files that stay off the public site. <a href="/gallery">Inspect supplied originals →</a></div><StoryReader story={JONAH} localReview previewMedia={previewMedia} /></>);