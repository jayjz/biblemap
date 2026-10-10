/** Editorial research layer. Summaries are not direct quotations or author narrative. */
type Note = { lens: string; voice: string; source: string; url: string; locator: string; summary: string };
const NOTES: Record<string, readonly Note[]> = {
  "jonah-1-escape": [{
    lens: "Patristic interpretation", voice: "John Chrysostom", source: "Homilies on the Statues, Homily 5", locator: "§18",
    url: "https://www.newadvent.org/fathers/190105.htm",
    summary: "Chrysostom reads Jonah’s attempted flight as unable to escape divine accountability; the voyage endangers the other sailors. This is a late-antique Christian moral reading, not a historical report about Jonah."
  }],
  "jonah-1-storm-wind": [{
    lens: "Catholic pastoral interpretation", voice: "Pope Francis", source: "General Audience: Christian Hope — Jonah: Hope and Prayer", locator: "18 January 2017",
    url: "https://www.vatican.va/content/francesco/en/audiences/2017/documents/papa-francesco_20170118_udienza-generale.html",
    summary: "Francis attends to the sailors’ prayer and hope amid the storm, then connects their deliverance to the wider story of Nineveh. This is pastoral theology, not a claim about the storm’s historical location."
  }],
  "jonah-1-storm-sea": [{
    lens: "Patristic interpretation", voice: "John Chrysostom", source: "Homilies on the Statues, Homily 5", locator: "§18",
    url: "https://www.newadvent.org/fathers/190105.htm",
    summary: "Chrysostom contrasts the reluctant sailors with the prophet’s disobedience. His attention to those caught up in Jonah’s flight opens a moral reading of the storm."
  }],
  "jonah-1-depths": [{
    lens: "Christian typological interpretation", voice: "Augustine of Hippo", source: "Letter 102", locator: "§34",
    url: "https://www.newadvent.org/fathers/1102102.htm",
    summary: "Augustine interprets Jonah’s deliverance from the sea creature through Matthew 12:39–40, as a sign anticipating Christ’s death and resurrection. This is Christian typology, not an assertion that the image proves an ancient event."
  }]
};
export function InterpretationNotes({ sceneId }: { sceneId: string }) {
  const notes = NOTES[sceneId];
  if (!notes?.length) return null;
  return <details className="story-disclosure" data-interpretation-layer="optional">
    <summary>Voices across time <span>Optional · interpretation, not Scripture</span></summary>
    <div className="story-disclosure-body">
      <p>Later readers have understood Jonah in different ways. These are attributed research summaries, not direct quotations or BibleMap’s authorial narrative.</p>
      {notes.map(note => <section key={`${note.voice}-${note.locator}`} aria-label={`${note.voice} interpretation`}>
        <h4>{note.voice}</h4>
        <p><small>{note.lens}</small></p>
        <p>{note.summary}</p>
        <a href={note.url} target="_blank" rel="noopener noreferrer">Read source: {note.source}, {note.locator} ↗</a>
      </section>)}
    </div>
  </details>;
}
