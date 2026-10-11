/** A related theological argument, not Aquinas’s commentary on Jonah or creator-authored narration. */
export function AquinasMercyPerspective({ sceneId }: { sceneId: string }) {
  if (sceneId !== "jonah-4-anger") return null;
  return <details className="story-disclosure story-mercy-perspective">
    <summary>Can mercy and justice coexist? <span>Optional · Thomas Aquinas</span></summary>
    <div className="story-disclosure-body">
      <p>In <em>Summa Theologiae</em>, Aquinas argues that God’s mercy does not act against justice. Mercy can give more than strict justice alone requires.</p>
      <p>This is Aquinas’s argument about divine mercy, not his commentary on Jonah. It does not settle Jonah’s response or the book’s final question.</p>
      <a href="https://www.newadvent.org/summa/1021.htm" target="_blank" rel="noopener noreferrer">Read Thomas Aquinas, <em>Summa Theologiae</em> I, question 21, article 3, reply to objection 2 ↗</a>
      <p><small>The English translation is hosted by New Advent; the link is offered as an optional related perspective.</small></p>
    </div>
  </details>;
}
