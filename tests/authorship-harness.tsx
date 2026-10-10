// Test-only workspace. This entry is never imported by an application route.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { JONAH } from "../src/content/jonah";
import { StoryReader } from "../src/features/story/StoryReader";
import type { AuthoredText } from "../src/domain/story";

const draft = (text: string): AuthoredText => ({ status: "written", text, authorId: "test-fixture-only", review: { status: "draft" } });
const story = structuredClone(JONAH);
story.scenes[0].title = draft("Unapproved title fixture");
story.scenes[0].narrative = draft("Unapproved narrative fixture");
story.scenes[0].reflections[0].prompt = draft("Unapproved reflection fixture");
story.geography[0].explanation = draft("Unapproved geography fixture");
story.claims = [{ id: "draft-claim", statement: draft("Unapproved claim fixture"), basis: "scholarly-inference", certainty: "unknown", evidence: [] }];
story.scenes[0].claimIds = ["draft-claim"];

function Harness() {
  const [authorReview, setAuthorReview] = useState(false);
  return <><button onClick={() => setAuthorReview(value => !value)}>Toggle author workspace</button><StoryReader story={story} authorReview={authorReview} /></>;
}
const root = document.getElementById("test-root");
if (!root) throw new Error("Test root missing");
createRoot(root).render(<Harness />);
