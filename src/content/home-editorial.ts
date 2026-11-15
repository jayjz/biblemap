/** Homepage invitations: sourced AI-authored editorial draft for creator review. */
export const HOME_EDITORIAL_REVIEW = { status: "draft", humanReview: "Pending creator literary, historical and artistic review", baseline: "ae4dc1c8f5b3d585ecaa75832cf0e735a150ada9" } as const;

export const HOME_INTRO = {
  title: "The living archive.",
  description: "Explore Scripture through human lives, places and the things they leave behind.",
} as const;

export const HOME_INVITATIONS = {
  pliny: {
    name: "Pliny", title: "A kind of commonwealth.", setting: "Bithynia-Pontus · early second century",
    text: "In one letter, he writes of deaths in his household. In another, he reports on people accused as Christians. Read the words of a Roman governor, and the silences around them.",
    action: "Enter Pliny’s world", sourceIds: ["pliny-household", "pliny-encounter-melmoth"],
    locator: "Letters 8.16 and 10.96–97", kind: "Roman testimony",
  },
  perpetua: {
    name: "Perpetua & Felicity", title: "A mother. A child. A prison.", setting: "Carthage · traditionally dated 203 CE",
    text: "A father pleads. A child is brought to prison. A work that preserves Perpetua’s first-person account also speaks in other voices.",
    action: "Meet Perpetua & Felicity", sourceIds: ["passion-perpetua"], locator: "The Passion · §§3–6", kind: "A transmitted prison account",
  },
  jonah: {
    name: "Jonah", title: "Beyond the familiar story.", setting: "Jonah 1–4 · the biblical narrative",
    text: "A ship going the other way. Sailors who speak. A city that turns. Read the whole book, all the way to its unanswered question.",
    action: "Read the book of Jonah", sourceIds: ["web-jonah"], locator: "Jonah 1–4 · World English Bible", kind: "Scripture",
  },
  thomas: {
    name: "Thomas", title: "What if you weren’t there?", setting: "John 20:24–31 · the Gospel’s account",
    text: "An encounter he missed. Words from those who were there. Enter John’s account of Thomas.",
    action: "Enter Thomas’s story", sourceIds: ["thomas-john20"], locator: "John 20:24–31 · World English Bible", kind: "Scripture",
  },
} as const;
export type HomeInvitationId = keyof typeof HOME_INVITATIONS;

export function homeInvitation(id: string) {
  if (!(id in HOME_INVITATIONS)) throw new Error(`No reviewed homepage invitation registered for ${id}`);
  return HOME_INVITATIONS[id as HomeInvitationId];
}
