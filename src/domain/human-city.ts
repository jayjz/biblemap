export const HUMAN_CITY_PANELS = ['house', 'voices'] as const;
export type HumanCityPanel = typeof HUMAN_CITY_PANELS[number];
export const HUMAN_CITY_QUERY = 'jonah411';

/** Preserve the reader's canonical scene hash; reject unrelated/invalid panel state. */
export function humanCityPanel(search: string, hash: string): HumanCityPanel | null {
  if (hash !== '#jonah-4-question') return null;
  const value = new URLSearchParams(search).get(HUMAN_CITY_QUERY);
  return HUMAN_CITY_PANELS.find(panel => panel === value) ?? null;
}
