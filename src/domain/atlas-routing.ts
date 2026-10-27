import epochManifest from "./epochs.json" with { type: "json" };

// Compatibility is based on atlas intent, never the presence of arbitrary URL state.
// Keep the pre-manifest #creation alias as well as the canonical epoch hashes.
export function isLegacyAtlasLink(search: string, hash: string): boolean {
  const params = new URLSearchParams(search);
  if (params.get("explore") === "1") return true;
  if (params.getAll("event").some(value => value.trim() !== "")) return true;
  if (params.getAll("place").some(value => value === "joppa" || value === "nineveh")) return true;

  const camera = ["lat", "lng", "zoom"].map(key => params.get(key));
  if (camera.every(value => value !== null && value.trim() !== "" && Number.isFinite(Number(value)))) {
    const [lat, lng, zoom] = camera.map(Number);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && zoom >= 0 && zoom <= 24) return true;
  }

  const epochHash = hash.split("&")[0];
  return epochHash === "#creation" || epochManifest.epochs.some(epoch => epoch.hash === epochHash);
}
