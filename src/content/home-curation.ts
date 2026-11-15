import type { HomeCuration } from "../domain/home-curation.ts";

/** Creator selection, 2026-11-15. Changes require an explicit editorial decision. */
export const HOME_CURATION = {
  hero: "pliny",
  featured: ["perpetua", "jonah", "thomas"],
  discovery: "all-visitor-eligible",
} as const satisfies HomeCuration;
