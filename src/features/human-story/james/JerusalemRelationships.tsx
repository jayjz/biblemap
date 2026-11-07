"use client";

import { useState, useSyncExternalStore } from "react";
import { JAMES_MOVEMENTS } from "@/content/james";
import { SourceLinks } from "./JamesSources";
import styles from "./cinematic.module.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const perspectives = [
  { id: "fellowship", title: "Jerusalem · fellowship", voice: "Paul’s letter · Galatians 2:1–10", people: ["James · Cephas · John", "Fellowship", "Paul · Barnabas"], limit: "Paul is a participant describing recognition and fellowship. This is not a transcript of their meeting.", relation: "Remembering the poor belongs to this account of fellowship." },
  { id: "dispute", title: "Antioch · disagreement", voice: "Paul’s letter · Galatians 2:11–14", people: ["Peter · Gentile believers", "Withdrawal from meals", "Paul opposes Peter"], limit: "People came from James. Paul does not say that James ordered Peter’s withdrawal. This dispute takes place in Antioch, not Jerusalem.", relation: "A change of place, within the same letter. No instruction from James is recorded here." },
  { id: "acts", title: "Jerusalem · Acts", voice: "Acts 12:17 · 15:13–21 · 21:17–26", people: ["James · elders · assembly", "Deliberation", "Gentile believers · Paul"], limit: "Acts is another narrative perspective. Its meetings are not automatically identical with those in Galatians; the relationship is debated.", relation: "A different work and narrative voice, rather than the missing transcript of Paul’s account." },
] as const;

export function JerusalemRelationships() {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [selected, setSelected] = useState("fellowship");
  const movement = JAMES_MOVEMENTS.find(m => m.id === "jerusalem");
  if (!movement) throw new Error("Missing Jerusalem movement");
  return <div className={styles.relationships}>
    <div className={styles.relationshipIntro}><h3>Who belongs at the table?</h3><p>Follow the relationships in each account. Changing the setting changes what the text tells us.</p></div>
    {ready && <div className={styles.perspectiveButtons} role="group" aria-label="Explore fellowship and disagreement">{perspectives.map(p => <button key={p.id} aria-pressed={p.id === selected} aria-controls={`relationship-${p.id}`} onClick={() => setSelected(p.id)}>{p.title}</button>)}</div>}
    {perspectives.map((p, index) => <div id={`relationship-${p.id}`} key={p.id} hidden={ready && selected !== p.id} className={styles.relationshipPanel}>
      <p className={styles.voice}>{p.voice}</p>
      <div className={styles.people} aria-label="Relationships described in this account"><span>{p.people[0]}</span><span>{p.people[1]}</span><span>{p.people[2]}</span></div>
      <p className={styles.relationNote}>Textual relationships, not a map or seating plan.</p>
      <div className={styles.relationshipText}><p>{movement.paragraphs[index].text}</p><div className={styles.boundary}><h4>Where this account stops</h4><p>{p.limit}</p><p>{p.relation}</p><SourceLinks ids={movement.paragraphs[index].sourceIds} /></div></div>
    </div>)}
  </div>;
}
