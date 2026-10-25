import { KNOWN_LICENSES } from "./media.ts";

/** The local experiment is deliberately stricter than unresolved-rights review. */
export function mayReviewDepthImage(asset: {
  rightsStatus: string; license: string; rightsVerifiedBy: string;
  sourceRecordUrl: string; requiredAttribution: string;
}) {
  return asset.rightsStatus === "verified"
    && KNOWN_LICENSES.some(license => license === asset.license)
    && Boolean(asset.rightsVerifiedBy.trim() && asset.requiredAttribution.trim())
    && asset.sourceRecordUrl.startsWith("https://");
}
