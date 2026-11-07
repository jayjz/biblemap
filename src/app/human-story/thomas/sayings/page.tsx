import type { Metadata } from 'next';
import { THOMAS_SAYING, THOMAS_SAYINGS, THOMAS_SAYING_13_EXCERPT } from '@/content/thomas';
import { ThomasShell } from '@/features/human-story/thomas/ThomasShell';
import { SourceLinks, ThomasSources } from '@/features/human-story/thomas/ThomasSources';
import { Verse } from '@/features/human-story/thomas/ThomasEncounter';
import styles from '@/features/human-story/thomas/thomas.module.css';
import manuscript from '@/features/human-story/thomas/manuscripts.module.css';
import { ManuscriptWitnesses } from '@/features/human-story/thomas/ManuscriptWitnesses';
export const metadata: Metadata = { title: 'The Gospel of Thomas · physical witnesses and two sayings · BibleMap', robots: { index: false, follow: false } };

export default function ThomasSayingsPage() {
  return <ThomasShell sayings><div className={`${styles.sayings} ${manuscript.documentary}`}>
    <header className={styles.sayingsOpening}><p className={styles.locator}>A separate source exploration</p><h1>The Gospel{' '}<br />of Thomas</h1><p className={styles.intro}>A name in the prologue.<br />A collection in surviving copies.</p>
      <p>A noncanonical collection conventionally divided into 114 sayings attributed to Jesus. Its prologue names Didymos Judas Thomas. That attribution is part of the text’s claim, not proof of apostolic authorship.</p>
      <p>Here we leave John’s narrative. These manuscripts do not continue the encounter in the room.</p><a className={styles.primary} href="#witnesses">Meet the manuscript witnesses</a><SourceLinks ids={['thomas-mattison','thomas-nhc']} /></header>
    <section className={styles.witnesses} id="witnesses" tabIndex={-1} aria-labelledby="witness-title"><h2 id="witness-title">Copies survive.<br />The origin remains debated.</h2>
      <p>A physical copy has a date. The composition it preserves may be older. Neither date authenticates an apostle’s handwriting.</p>
      <p className={manuscript.deskInvitation}>Choose an object. Notice its form, then ask how much of either saying it actually preserves.</p>
      <ManuscriptWitnesses />
      <details><summary>Why do the manuscript dates differ between catalogues?</summary><p>The ranges here follow DCLP for the Greek witnesses. NASSCAL lists narrower or different estimates for P.Oxy. 1 and 654; the Smithsonian exhibition describes P.Oxy. 1 as third century. For the Coptic codex, SCRIPTORIUM gives 301–400, while the linked Mattison inventory allows the fourth or fifth century. These estimates concern physical copies, not a settled date for composing the collection.</p><SourceLinks ids={['thomas-nasscal','thomas-smithsonian','thomas-scriptorium']} /></details>
      <details><summary>See the manuscript photograph at its institution</summary><p>Claremont’s record shows the beginning of Thomas on codex page 32 together with page 111, which belongs to another text. Its photograph dates to 1975; that is not the date of the papyrus. Copyright is retained, so we link to the image rather than reproduce it.</p><SourceLinks ids={['thomas-claremont']} /></details>
      <details><summary>Why the Greek and Coptic cannot be collapsed</summary><p>The Greek fragments differ from the Coptic in wording and arrangement. Material alongside saying 30 in P.Oxy. 1 appears with saying 77 in the Coptic collection. They witness transmission, not an unchanged recording.</p><SourceLinks ids={['thomas-hurtado','thomas-oxy1']} /></details>
    </section>
    <section id="comparison" className={`${styles.comparison} ${manuscript.comparison}`} tabIndex={-1} aria-labelledby="comparison-title"><p className={styles.locator}>Two texts beside one another · saying 26</p><h2 id="comparison-title">A speck.<br />A beam.<br />A shared image.</h2><p>Read two texts beside one another. Resemblance is visible; its historical explanation remains a separate question.</p>
      <div className={styles.comparisonTexts}><figure data-thomas-saying="26"><h3>Gospel of Thomas · saying 26</h3><blockquote>{THOMAS_SAYING.text}</blockquote><figcaption><a href={THOMAS_SAYING.sourceUrl}>Mark M. Mattison · public-domain translation</a><br />Based on the Coptic NHC II,2, not the fragmentary Greek leaf.</figcaption></figure>
        <div><h3>Luke · 6:41–42</h3><Verse id="luk06-41" /><Verse id="luk06-42" /></div></div>
      <details><summary>What does the surviving Greek actually preserve?</summary><p>P.Oxy. 1, verso lines 1–4, retains the ending about seeing clearly to remove the speck. The full Coptic saying printed above does not survive on this leaf. The catalogue transcription marks damage and editorial interventions.</p><SourceLinks ids={['thomas-oxy1']} /></details>
      <p className={styles.comparisonLimit}>Shared imagery does not by itself establish literary dependence, its direction, or independent authentication as words of the historical Jesus.</p>
      <details><summary>Two approaches to the collection’s history</summary><p>April DeConick argues for a developing collection that includes early traditions. A later-dating approach, presented by Simeon Burke in discussion of Goodacre and Gathercole, sees knowledge of the Synoptic Gospels. These are competing explanations, not verdicts supplied by this comparison.</p><SourceLinks ids={['thomas-deconick','thomas-dating']} /></details>
    </section>
    <section id="saying-13" className={manuscript.thirteen} tabIndex={-1} aria-labelledby="thirteen-title"><p className={styles.locator}>A different portrayal · saying 13</p><h2 id="thirteen-title">Thomas speaks.<br />The texts differ.</h2>
      <p>In John, Thomas’s answer is spoken to Jesus in the gathered encounter. Saying 13 begins with a request for comparison: Peter and Matthew offer images; Thomas says he cannot. Its private exchange is part of this separate text’s portrayal, not additional testimony about John’s room.</p>
      <div className={`${styles.comparisonTexts} ${manuscript.portraits}`}>
        <figure data-thomas-saying="13"><h3>Gospel of Thomas · saying 13, excerpt</h3><blockquote>{THOMAS_SAYING_13_EXCERPT}</blockquote><figcaption><a href={THOMAS_SAYINGS[13].sourceUrl}>Mark M. Mattison · public-domain translation</a><br />Coptic NHC II,2. Not preserved in P.Oxy. 1, 654 or 655.</figcaption></figure>
        <div><h3>John · 20:28</h3><Verse id="jhn20-28" /></div>
      </div>
      <details><summary>Read the whole preserved saying 13</summary><figure data-thomas-full-saying="13"><blockquote>{THOMAS_SAYINGS[13].text}</blockquote><figcaption>Gospel of Thomas 13 · Mattison · public domain · based on NHC II,2</figcaption></figure></details>
      <p className={manuscript.criticalNote}>The saying reports three things spoken aside but does not give their content. Nothing here reveals or reconstructs those unreported words.</p>
      <details><summary>What can this contrast establish?</summary><p>It shows different ways these texts portray Thomas’s speech. It does not establish which author knew the other, the historical apostle’s authorship, or independently authenticated speech. Mattison notes that “three things” can also be translated “three words.” Neither rendering supplies them.</p><SourceLinks ids={['thomas-mattison','thomas-john20','thomas-nhc']} /></details>
    </section>
    </div><ThomasSources sayings /></ThomasShell>;
}
