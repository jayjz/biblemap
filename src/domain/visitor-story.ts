import { approvedAuthoredText, type StoryDocument, type StoryScene, type Geography, type Claim, type EvidenceRef } from "./story.ts";
import { projectVisitorMedia, type VisitorMedia } from "./visitor-media.ts";

/** A render contract, never an editorial document or a publication approval. */
export interface VisitorScene {
  id: string;
  sectionId: string;
  chapter: number;
  title: string | null;
  narrative: string | null;
  passageIds: readonly string[];
  reflections: readonly { id: string; prompt: string | null }[];
  claimIds: readonly string[];
  geographyIds: readonly string[];
  artworkIds: readonly string[];
  narration?: { mediaId: string; transcript: string };
  soundscapeId?: string;
  transition: StoryScene["transition"];
  readingGuide?: StoryScene["readingGuide"];
}
export interface VisitorGeography {
  placeId: string;
  label: string;
  status: Geography["status"];
  explanation: string | null;
  candidates: Geography["candidates"];
}
export interface VisitorClaim {
  id: string;
  statement: string;
  basis: Claim["basis"];
  certainty: Claim["certainty"];
  interpretiveLens?: string;
  evidence: Claim["evidence"];
  uncertainty?: string;
}
export interface VisitorStory {
  id: string;
  title: string;
  subtitle: string;
  sections: StoryDocument["sections"];
  scenes: readonly VisitorScene[];
  passages: StoryDocument["passages"];
  sources: StoryDocument["sources"];
  claims: readonly VisitorClaim[];
  geography: readonly VisitorGeography[];
  media: readonly VisitorMedia[];
}

/**
 * Run before either Server or Client Component rendering. Explicit fields prevent
 * author slots, identities, decisions and future private fields reaching HTML/RSC.
 * Existing companions are intentionally visible review copy, qualified in the UI.
 * Media manifests retain their existing visible provenance/rights disclosures.
 */
export function projectVisitorStory(story: StoryDocument): VisitorStory {
  const evidence = (refs: readonly EvidenceRef[]) => refs.map(({ sourceId, locator, supports, doesNotEstablish }) => ({ sourceId, locator, supports, doesNotEstablish }));
  const claims = story.claims.flatMap(claim => {
    const statement = approvedAuthoredText(claim.statement);
    return statement === null ? [] : [{
      id: claim.id, statement, basis: claim.basis, certainty: claim.certainty,
      interpretiveLens: claim.interpretiveLens, evidence: evidence(claim.evidence),
      uncertainty: claim.uncertainty,
    }];
  });
  return {
    id: story.id, title: story.title, subtitle: story.subtitle,
    sections: story.sections.map(({ id, label, reference, available }) => ({ id, label, reference, available })),
    scenes: story.scenes.map(scene => {
      const transcript = scene.narration ? approvedAuthoredText(scene.narration.transcript) : null;
      return {
        id: scene.id, sectionId: scene.sectionId, chapter: scene.chapter,
        title: approvedAuthoredText(scene.title), narrative: approvedAuthoredText(scene.narrative),
        passageIds: [...scene.passageIds],
        reflections: scene.reflections.map(reflection => ({ id: reflection.id, prompt: approvedAuthoredText(reflection.prompt) })),
        claimIds: scene.claimIds.filter(id => claims.some(claim => claim.id === id)),
        geographyIds: [...scene.geographyIds], artworkIds: [...scene.artworkIds],
        ...(scene.narration && transcript !== null ? {
          narration: { mediaId: scene.narration.mediaId, transcript },
        } : {}),
        ...(scene.soundscapeId ? { soundscapeId: scene.soundscapeId } : {}),
        transition: { nextSceneId: scene.transition.nextSceneId, advance: scene.transition.advance, visual: scene.transition.visual },
        ...(scene.readingGuide ? { readingGuide: {
          title: scene.readingGuide.title, question: scene.readingGuide.question,
          context: scene.readingGuide.context, sourceId: scene.readingGuide.sourceId,
          locator: scene.readingGuide.locator, status: scene.readingGuide.status,
        } } : {}),
      };
    }),
    passages: story.passages.map(p => ({
      id: p.id, book: p.book, chapter: p.chapter, firstVerse: p.firstVerse, lastVerse: p.lastVerse,
      translationId: p.translationId, sourceId: p.sourceId, sourceVersion: p.sourceVersion,
      retrievedAt: p.retrievedAt, checksum: p.checksum, rightsStatement: p.rightsStatement,
      rightsUrl: p.rightsUrl, verses: p.verses.map(({ number, text }) => ({ number, text })),
      notes: p.notes.map(({ verse, text }) => ({ verse, text })),
    })),
    sources: story.sources.map(({ id, title, author, institution, url, sourceType, supports }) => ({ id, title, author, institution, url, sourceType, supports })),
    claims,
    geography: story.geography.map(place => ({
      placeId: place.placeId, label: place.label, status: place.status,
      explanation: approvedAuthoredText(place.explanation), candidates: place.candidates.map(candidate => ({
        id: candidate.id, label: candidate.label,
        ...(candidate.position ? { position: { longitude: candidate.position.longitude, latitude: candidate.position.latitude, radiusKm: candidate.position.radiusKm } } : {}),
        evidence: evidence(candidate.evidence),
      })),
    })),
    media: story.media.map(projectVisitorMedia),
  };
}
