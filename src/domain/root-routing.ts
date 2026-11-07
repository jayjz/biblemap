import { isLegacyAtlasLink } from "./atlas-routing.ts";
import { NINEVEH_BEATS, NINEVEH_DISCOVERIES } from "./nineveh-navigation.ts";

export function isLegacyRootLink(search: string, hash: string): boolean {
  if (isLegacyAtlasLink(search, hash)) return true;
  if (["#main-content", "#nineveh-heading", "#nineveh-reading"].includes(hash)) return true;
  const [beat, discovery, extra] = hash.slice(1).split("/");
  return extra === undefined && NINEVEH_BEATS.some(item => item.id === beat)
    && (discovery === undefined || NINEVEH_DISCOVERIES.some(id => id === discovery));
}
