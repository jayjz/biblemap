import type { Metadata } from 'next';
import Link from 'next/link';
import { THOMAS_ROUTES, THOMAS_SAYING } from '@/content/thomas';
import { ThomasShell } from '@/features/human-story/thomas/ThomasShell';
import { SourceLinks, ThomasSources } from '@/features/human-story/thomas/ThomasSources';
import { Verse } from '@/features/human-story/thomas/ThomasEncounter';
import styles from '@/features/human-story/thomas/thomas.module.css';
export const metadata: Metadata = { title: 'The Gospel of Thomas · manuscripts and one saying · BibleMap', robots: { index: false, follow: false } };

export default function ThomasSayingsPage() {
  return <ThomasShell sayings><div className={styles.sayings}>
    <header className={styles.sayingsOpening}><p className={styles.locator}>A separate source exploration</p><h1>The Gospel{' '}<br />of Thomas</h1><p className={styles.intro}>A name in the prologue.<br />A collection in surviving copies.</p>
      <p>A noncanonical collection conventionally divided into 114 sayings attributed to Jesus. Its prologue names Didymos Judas Thomas. That attribution is part of the text’s claim, not proof of apostolic authorship.</p>
      <p>Here we leave John’s narrative. These manuscripts do not continue the encounter in the room.</p><a className={styles.primary} href="#witnesses">Meet the manuscript witnesses</a><SourceLinks ids={['thomas-mattison','thomas-nhc']} /></header>
    <section className={styles.witnesses} id="witnesses" tabIndex={-1} aria-labelledby="witness-title"><h2 id="witness-title">Copies survive.<br />The origin remains debated.</h2>
      <p>A physical copy has a date. The composition it preserves may be older. Neither date authenticates an apostle’s handwriting.</p>
      <dl>{[
        ['Coptic · NHC II,2', 'Fourth century commonly cited; fourth/fifth in the linked inventory', 'Pages 32–51 of Nag Hammadi Codex II preserve essentially the whole collection.', 'thomas-nhc'],
        ['Greek · P.Oxy. 1', 'Catalogue range: 151–300 CE', 'A codex leaf in Oxford. Parts corresponding to sayings 26–30, 77b and 31–33.', 'thomas-oxy1'],
        ['Greek · P.Oxy. 654', 'Catalogue range: 250–299 CE', 'British Library Papyrus 1531 verso. Parts of the prologue and sayings 1–7.', 'thomas-oxy654'],
        ['Greek · P.Oxy. 655', 'Catalogue range: 200–299 CE', 'Harvard Houghton roll fragments. Parts of sayings 36–39, possibly 24.', 'thomas-oxy655'],
      ].map(([title,date,text,id]) => <div key={id}><dt>{title}</dt><dd><p>{date}</p><p>{text}</p><SourceLinks ids={[id]} /></dd></div>)}</dl>
      <details><summary>See the manuscript photograph at its institution</summary><p>Claremont’s record shows the beginning of Thomas on codex page 32 together with page 111, which belongs to another text. Its photograph dates to 1975; that is not the date of the papyrus. Copyright is retained, so we link to the image rather than reproduce it.</p><SourceLinks ids={['thomas-claremont']} /></details>
      <details><summary>Why the Greek and Coptic cannot be collapsed</summary><p>The Greek fragments differ from the Coptic in wording and arrangement. Material alongside saying 30 in P.Oxy. 1 appears with saying 77 in the Coptic collection. They witness transmission, not an unchanged recording.</p><SourceLinks ids={['thomas-hurtado','thomas-oxy1']} /></details>
    </section>
    <section id="comparison" className={styles.comparison} tabIndex={-1} aria-labelledby="comparison-title"><p className={styles.locator}>One limited comparison</p><h2 id="comparison-title">A speck.<br />A beam.<br />A shared image.</h2><p>Read two texts beside one another. Resemblance is visible; its historical explanation remains a separate question.</p>
      <div className={styles.comparisonTexts}><figure data-thomas-saying="26"><h3>Gospel of Thomas · saying 26</h3><blockquote>{THOMAS_SAYING.text}</blockquote><figcaption><a href={THOMAS_SAYING.sourceUrl}>Mark M. Mattison · public-domain translation</a><br />Based on the Coptic NHC II,2, not the fragmentary Greek leaf.</figcaption></figure>
        <div><h3>Luke · 6:41–42</h3><Verse id="luk06-41" /><Verse id="luk06-42" /></div></div>
      <details><summary>What does the surviving Greek actually preserve?</summary><p>P.Oxy. 1, verso lines 1–4, retains the ending about seeing clearly to remove the speck. The full Coptic saying printed above does not survive on this leaf. The catalogue transcription marks damage and editorial interventions.</p><SourceLinks ids={['thomas-oxy1']} /></details>
      <p className={styles.comparisonLimit}>Shared imagery does not by itself establish literary dependence, its direction, or independent authentication as words of the historical Jesus.</p>
      <details><summary>Two approaches to the collection’s history</summary><p>April DeConick argues for a developing collection that includes early traditions. A later-dating approach, presented by Simeon Burke in discussion of Goodacre and Gathercole, sees knowledge of the Synoptic Gospels. These are competing explanations, not verdicts supplied by this comparison.</p><SourceLinks ids={['thomas-deconick','thomas-dating']} /></details>
    </section>
    <section className={styles.laterNames}><h2>A name travels<br />beyond one Gospel.</h2><p>John calls Thomas Didymus, with the sense “Twin,” but does not name his twin. The sayings prologue adds Judas. Eusebius transmits a Parthian mission tradition. The Acts of Thomas tells an India mission and martyrdom story. These later traditions are distinct sources, not missing scenes recovered from John.</p>
      <p>Thomas is not James, the brother of Jesus. The sayings collection itself names James the Just and Thomas separately.</p><SourceLinks ids={['thomas-john20','thomas-mattison','thomas-eusebius','thomas-acts']} /><Link className={styles.primary} href={THOMAS_ROUTES.encounter + '#not-seen'} prefetch={false}>Return to John’s ending</Link></section>
    </div><ThomasSources /></ThomasShell>;
}
