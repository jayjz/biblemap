// Local workspace only. Never import this module from an application route.
import { authoredLabel, type StoryDocument } from "../src/domain/story.ts";
import { projectVisitorStory, type VisitorStory } from "../src/domain/visitor-story.ts";

export function projectLocalAuthorStory(story: StoryDocument): VisitorStory {
  const visitor = projectVisitorStory(story);
  return {
    ...visitor,
    scenes: visitor.scenes.map((scene, index) => ({
      ...scene,
      title: authoredLabel(story.scenes[index].title),
      narrative: authoredLabel(story.scenes[index].narrative),
      reflections: story.scenes[index].reflections.map(reflection => ({ id: reflection.id, prompt: authoredLabel(reflection.prompt) })),
      claimIds: story.scenes[index].claimIds,
    })),
    geography: visitor.geography.map((place, index) => ({ ...place, explanation: authoredLabel(story.geography[index].explanation) })),
    claims: story.claims.map(claim => ({
      id: claim.id, statement: authoredLabel(claim.statement), basis: claim.basis,
      certainty: claim.certainty, evidence: claim.evidence,
      interpretiveLens: claim.interpretiveLens, uncertainty: claim.uncertainty,
    })),
  };
}
