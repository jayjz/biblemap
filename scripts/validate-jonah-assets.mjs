import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import catalog from "../docs/research/jonah-asset-candidates.json" with { type: "json" };

const root = new URL("../", import.meta.url);
const errors = [];
const checksums = new Set();
const suppliedSums = readFileSync(new URL("artifacts/jonah-image-review/SHA256SUMS", root), "utf8");
function dimensions(bytes) {
  if (bytes.readUInt16BE(0) !== 0xffd8) throw new Error("Not a JPEG");
  let offset = 2;
  while (offset + 4 < bytes.length) {
    if (bytes[offset++] !== 0xff) throw new Error("Invalid JPEG marker");
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) throw new Error("Invalid JPEG segment");
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    offset += length;
  }
  throw new Error("Missing JPEG dimensions");
}
for (const file of catalog.acquiredFiles) {
  if (!suppliedSums.split("\n").includes(`${file.checksumSha256}  ${file.stagingPath}`)) errors.push(`${file.filename}: catalog differs from supplied SHA256SUMS`);
  if (!/^[a-f0-9]{64}$/.test(file.checksumSha256) || checksums.has(file.checksumSha256)) errors.push(`${file.filename}: invalid or duplicate checksum`);
  checksums.add(file.checksumSha256);
  for (const path of [file.stagingPath, file.publicationHoldPath]) {
    const url = new URL(path, root);
    if (!existsSync(url)) {
      // Unknown-rights originals and duplicate held copies are deliberately local-only.
      if (path === file.stagingPath && file.matchedCandidateId) errors.push(`${path}: required research original missing`);
      continue;
    }
    const bytes = readFileSync(url);
    if (createHash("sha256").update(bytes).digest("hex") !== file.checksumSha256) errors.push(`${path}: checksum mismatch`);
    const size = dimensions(bytes);
    if (size.width !== file.originalDimensions.width || size.height !== file.originalDimensions.height || bytes.length !== file.bytes) errors.push(`${path}: dimensions or byte length mismatch`);
  }
}
const publicDir = new URL("public/media/jonah/", root);
if (existsSync(publicDir)) {
  for (const filename of readdirSync(publicDir)) {
    const file = catalog.acquiredFiles.find(file => file.filename === filename);
    const candidate = catalog.assets.find(asset => asset.id === file?.matchedCandidateId);
    if (!candidate || candidate.productionReviewStatus !== "approved" || !candidate.reviewedBy || !candidate.downloadedAt || !candidate.approvedSceneIds.length) errors.push(`${filename}: unapproved file would be published by static export`);
  }
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`✓ ${checksums.size} distinct Jonah acquisition records; available originals and held copies verified; publication approval enforced`);
