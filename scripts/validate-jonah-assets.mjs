import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import catalog from "../docs/research/jonah-asset-candidates.json" with { type: "json" };
import rightsChecks from "../docs/research/jonah-rights-verification.json" with { type: "json" };

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
const OPEN_LICENSES = new Set(["CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0", "CC-BY-SA-3.0", "CC-BY-3.0", "Public Domain", "PD-Art", "PD-US"]);
const RIGHTS_REVIEWED = new Set(["rights-verified", "historically-reviewed", "theologically-reviewed", "approved"]);
const publicDir = new URL("public/media/jonah/", root);
if (existsSync(publicDir)) {
  for (const filename of readdirSync(publicDir)) {
    const file = catalog.publicationFiles.find(file => file.filename === filename);
    const candidate = catalog.assets.find(asset => asset.id === file?.assetId);
    if (!candidate || candidate.rightsUse === "restricted" || candidate.rightsUse === "unresolved" || !OPEN_LICENSES.has(candidate.license) || !candidate.sourceRecordUrl || !RIGHTS_REVIEWED.has(candidate.productionReviewStatus) || !candidate.reviewedBy?.trim() || !candidate.rightsEvidence) {
      errors.push(`${filename}: unverified, unresolved or restricted file would be published by static export`);
      continue;
    }
    if (!candidate.creator?.trim()) errors.push(`${filename}: missing attribution`);
    if (candidate.productionReviewStatus !== "approved") {
      const check = rightsChecks.find(check => check.assetId === candidate.id);
      if (!check || check.sourceUrl !== candidate.rightsEvidence || !/^[a-f0-9]{64}$/.test(check.responseSha256) || !Number.isFinite(Date.parse(check.checkedAt))) errors.push(`${filename}: missing source verification evidence`);
    }
    const bytes = readFileSync(new URL(filename, publicDir));
    const size = dimensions(bytes);
    if (createHash("sha256").update(bytes).digest("hex") !== file.checksumSha256 || bytes.length !== file.bytes || size.width !== file.width || size.height !== file.height) errors.push(`${filename}: publication checksum/dimensions mismatch`);
    if (file.sourceUrl !== candidate.originalAssetUrl || !Number.isFinite(Date.parse(file.downloadedAt)) || !/^[a-f0-9]{64}$/.test(file.sourceChecksumSha256)) errors.push(`${filename}: missing verifiable acquisition metadata`);
  }
}
for (const file of catalog.publicationFiles) {
  if (!existsSync(new URL(`public${file.localPath}`, root))) errors.push(`${file.filename}: approved publication file missing`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`✓ ${checksums.size} distinct Jonah acquisition records; available originals and held copies verified; public files require verified image rights separately from editorial approval`);
