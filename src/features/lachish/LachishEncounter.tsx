import { CLAIMS, MOVEMENTS } from "@/content/lachish/narrative";
import Link from "next/link";
import { ClaimNotes, ClaimText, LachishSources, ScriptureQuotation } from "./LachishSources";
import { JourneyNavigation } from "./JourneyNavigation";
import { LachishMedia } from "./LachishMedia";
import { ReliefExplorer } from "./ReliefExplorer";
import { SourceNavigation } from "./SourceNavigation";

export function LachishEncounter() {
  return <main className="lachish" id="lachish-top">
    <SourceNavigation />
    <a className="lachish-skip" href="#before-the-siege">Skip to the narrative</a>
    <header className="lachish-header"><Link href="/" prefetch={false} className="lachish-brand">BIBLEMAP</Link><span className="lachish-header-rule"/><span>701 BC · Kingdom of Judah</span><a href="#sources">Sources</a></header>
    <section className="lachish-opening" aria-labelledby="lachish-title">
      <LachishMedia name="city" className="lachish-city" width={1536} height={1024} eager alt="Original AI-generated artistic evocation of a walled Judean hilltop city, with homes rising behind its defenses. Layout and buildings are hypothetical." />
      <div className="lachish-opening-copy"><h1 id="lachish-title">Lachish<span>Before the walls fell</span></h1><p className="lachish-subtitle">A city caught between an empire and its king.</p><span className="lachish-gold-rule"/><ClaimText id="threshold"/><a className="lachish-action" href="#before-the-siege">Enter the city <span aria-hidden="true">→</span></a><a className="lachish-text-link" href="#the-walls">Examine the relief</a></div>
      <a className="lachish-art-label" href="#asset-city">AI-generated interpretive reconstruction · not a measured site model</a>
    </section>
    <div className="lachish-relief-ribbon"><LachishMedia name="prisoners" width={2592} height={3888} alt="Detail from an ancient relief showing the people taken from Lachish. This image preserves their conqueror’s perspective." /><a href="#the-fall">The people preserved in the carving <span aria-hidden="true">↓</span></a></div>
    <JourneyNavigation />
    <section className="lachish-movement lachish-before" id="before-the-siege" aria-labelledby="before-title">
      <div className="lachish-movement-index"><span>I</span><p>BEFORE THE SIEGE</p><span>Judah · 701 BC</span></div>
      <div className="lachish-prose"><h2 id="before-title">{MOVEMENTS[0].title}</h2><ClaimText id="city"/><ClaimText id="people"/></div>
      <figure className="lachish-within"><div className="lachish-rooftops"><LachishMedia name="city" width={1536} height={1024} alt="A closer crop of the original city illustration brings its clustered houses into view. These buildings are imagined, not a reconstruction of an excavated home."/></div><figcaption>Look beyond the wall, toward the homes.<br/><a href="#asset-city">AI-generated artistic evocation</a> · hypothetical buildings and layout; not Building 350.</figcaption></figure>
      <div className="lachish-household-record" aria-label="Traces of an inhabited city">
        <div><h3>Rooms beside a street</h3><ClaimText id="dwelling"/></div>
        <div><h3>Vessels kept inside</h3><ClaimText id="storage"/></div>
        <div><h3>A worked landscape</h3><ClaimText id="cultivation"/></div>
      </div>
      <div className="lachish-before-notes"><ClaimNotes ids={MOVEMENTS[0].claims}/></div>
      <a className="lachish-next" href="#the-empire">Beyond these homes, a king challenges an empire <span aria-hidden="true">↓</span></a>
    </section>
    <section className="lachish-movement lachish-empire" id="the-empire" aria-labelledby="empire-title">
      <div className="lachish-movement-index"><span>II</span><p>THE APPROACHING EMPIRE</p><span>The campaign reaches Judah</span></div>
      <div className="lachish-empire-layout"><div className="lachish-prose"><h2 id="empire-title">{MOVEMENTS[1].title}</h2><ClaimText id="rebellion"/><ClaimText id="campaign"/><ClaimNotes ids={MOVEMENTS[1].claims}/></div>
      <figure className="lachish-geography"><div className="lachish-place-assyria"><span>ASSYRIA</span><strong>Nineveh</strong><p>Sennacherib’s royal capital</p></div><div className="lachish-geography-distance" aria-hidden="true"><span/><span/><span/></div><div className="lachish-place-judah"><span>JUDAH</span><div><strong>Lachish</strong><span>→</span><strong>Jerusalem</strong></div><p>The besieged city · The king’s city</p></div><figcaption>Places connected by the surviving accounts. A relational diagram, not a campaign route or map to scale. <a href="#source-web-kings">2 Kings 18:14–17</a> · <a href="#source-rinap-22">Sennacherib’s annals</a></figcaption></figure></div>
      <div className="lachish-transition-sentence">At the walls, a struggle between kings becomes a threat to everyone inside.</div>
    </section>
    <section className="lachish-movement lachish-walls" id="the-walls" aria-labelledby="walls-title">
      <div className="lachish-movement-index"><span>III</span><p>THE WALLS</p><span>Lachish · The southwest assault area</span></div>
      <div className="lachish-walls-intro"><h2 id="walls-title">{MOVEMENTS[2].title}</h2><div className="lachish-prose"><ClaimText id="walls"/><p>Start with a detail in the ancient carving. Then step out of the image to understand the terrain—and return to see what the artist chose to show.</p></div></div>
      <ReliefExplorer />
      <div className="lachish-beneath-relief"><div><h3>The things left in the ground</h3><ClaimText id="material"/></div><div><h3>Where certainty ends</h3><p>How quickly the ramp was built, exactly how the engines worked, and who started the fire are questions for interpretation. The surviving city is not a complete plan of its last day.</p><ClaimNotes ids={MOVEMENTS[2].claims}/></div></div>
      <p className="lachish-transition-sentence" data-claim="walls">{CLAIMS.walls.bridge}</p>
      <a className="lachish-next" href="#the-fall">Follow the people beyond the breach <span aria-hidden="true">↓</span></a>
    </section>
    <section className="lachish-movement lachish-fall" id="the-fall" aria-labelledby="fall-title">
      <div className="lachish-movement-index"><span>IV</span><p>THE FALL</p><span>From inhabitants to captives</span></div>
      <div className="lachish-fall-layout"><figure className="lachish-captives"><div className="lachish-captive-detail"><LachishMedia name="prisoners" width={2592} height={3888} sizes="(max-width: 760px) 160vw, 75vw" alt="Detail of the actual relief: a cart and animals at left, a line of captives at right, trees above them. These are the conqueror’s depictions, not portraits with known names."/></div><figcaption>People, a cart, animals. A detail enlarged from the photograph.<br/>Nineveh, Room XXXVI, panels 9–10 · British Museum, BM 124908–9. <a href="#asset-prisoners">Mike Peel · CC BY-SA 4.0</a>.</figcaption><details className="lachish-disclosure lachish-whole-photograph"><summary>See the complete museum photograph</summary><LachishMedia name="prisoners" width={2592} height={3888} alt="The complete photograph of the ancient panels in their modern museum corner, including the full cultivated landscape and processions."/></details></figure><div className="lachish-prose"><h2 id="fall-title">{MOVEMENTS[3].title}</h2><ClaimText id="fall"/><div className="lachish-look"><p className="lachish-small">STAY WITH THE PEOPLE</p><p>The cart. The animals. The things carried away.<br/>The relief preserves what moves out of the city. The broken vessels mark what remained behind.</p><p className="lachish-caption">An editorial comparison of <a href="#source-bm-prisoners">royal imagery</a> and <a href="#source-fourth-expedition">excavated rooms</a>; the two cannot identify the same household.</p></div><ClaimText id="aftermath"/><ClaimNotes ids={MOVEMENTS[3].claims}/></div></div>
      <p className="lachish-fall-coda" data-claim="aftermath">{CLAIMS.aftermath.bridge}</p>
    </section>
    <section className="lachish-movement lachish-palace" id="the-kings-account" aria-labelledby="palace-title">
      <div className="lachish-movement-index"><span>V</span><p>THE KING’S ACCOUNT</p><span>Nineveh · Assyria</span></div>
      <div className="lachish-palace-intro"><h2 id="palace-title">{MOVEMENTS[4].title}</h2><div className="lachish-prose"><ClaimText id="palace"/><ClaimText id="inscription"/></div></div>
      <figure className="lachish-king"><LachishMedia name="king" width={6000} height={4000} alt="An actual palace relief showing Sennacherib seated before a procession, attendants behind him and a cuneiform inscription above. His face is damaged."/><figcaption>Royal representation · Sennacherib receives captives and booty · Room XXXVI, panels 11–13. <a href="#asset-king">Photograph: Zunkir · CC BY-SA 4.0</a>.</figcaption></figure>
      <div className="lachish-dates" aria-label="Event and object dates"><div><span>701 BC</span><p>The campaign</p></div><div><span>700–692 BC</span><p>The displayed reliefs</p></div><div><span>691 BC</span><p>The Taylor Prism</p></div></div><div className="lachish-prose palace-dates-note"><ClaimText id="dates"/><ClaimNotes ids={MOVEMENTS[4].claims}/></div>
      <a className="lachish-next" href="#jerusalem">And what of Hezekiah? <span aria-hidden="true">↓</span></a>
    </section>
    <section className="lachish-movement lachish-jerusalem" id="jerusalem" aria-labelledby="jerusalem-title">
      <div className="lachish-movement-index"><span>VI</span><p>JERUSALEM</p><span>The city that remained</span></div>
      <div className="lachish-prose jerusalem-opening"><h2 id="jerusalem-title">{MOVEMENTS[5].title}</h2><ClaimText id="jerusalem"/><ScriptureQuotation chapter="2ki18" verse={17}/><ClaimText id="survival"/></div>
      <div className="lachish-accounts"><div><p className="lachish-small">BIBLICAL WRITINGS</p><h3>A city delivered</h3><p>Kings and Isaiah place the threat, Hezekiah’s prayer and Isaiah’s answer within an account of divine deliverance. Chronicles tells of Hezekiah and Isaiah praying together.</p><p><a href="#passage-2ki19">2 Kings 19</a> · <a href="#passage-isa37">Isaiah 37</a> · <a href="#passage-2ch32">2 Chronicles 32</a></p></div><div><p className="lachish-small">ASSYRIAN ROYAL ANNALS</p><h3>A king brought to submission</h3><p>Sennacherib describes containing Hezekiah in Jerusalem, reducing his territory and receiving tribute. He does not claim to have captured Jerusalem.</p><p><a href="#source-rinap-22">RINAP 22, iii 27–49</a> · <a href="#source-taylor-prism">The Taylor Prism</a></p></div></div>
      <div className="lachish-prose jerusalem-ending"><details className="lachish-disclosure"><summary>One concrete difference: the tribute</summary><ClaimText id="tribute"/><ClaimNotes ids={["survival", "tribute"]}/></details><ClaimText id="ending" className="lachish-ending"/><a className="lachish-action" href="#sources">Examine what survived <span aria-hidden="true">↓</span></a><a className="lachish-text-link" href="#the-fall">Return to the people in the carving</a></div>
    </section>
    <LachishSources />
    <footer className="lachish-footer"><a href="#lachish-top">Return to Lachish ↑</a><Link href="/" prefetch={false}>Continue through BibleMap →</Link><span>701 BC · Three kinds of evidence. Lives beyond the record.</span></footer>
  </main>;
}
