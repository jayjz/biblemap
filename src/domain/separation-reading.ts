export interface SeparationReadingText {
  presence: string;
  refusal: string;
  relief: string;
}

/** Exact contiguous boundaries from the established Wallis excerpts. */
export function separationReadingText(earlier: string, later: string): SeparationReadingText {
  const boundary = later.indexOf(" And even as God willed it,");
  if (!earlier.trim() || boundary < 1) throw new Error("The separation reading requires the complete established §3/§6 excerpts");
  return { presence: earlier, refusal: later.slice(0, boundary), relief: later.slice(boundary + 1) };
}
