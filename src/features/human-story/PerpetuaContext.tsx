import styles from "./prison.module.css";

/** Sourced editorial drafts; neither ancient speech nor creator-authored reflection. */
export function PerpetuaContext({ scene }: { scene: "tribunal" | "vision" | "felicity" | "handover" }) {
  return <details className={styles.culturalContext}>
    <summary>{scene === "tribunal" ? "Why sacrifice? Family, belief and public allegiance" : scene === "vision" ? "How does a vision change what she expects?" : scene === "felicity" ? "Status, companionship and what the narrator preserves" : "Who composed the voice we have been reading?"}</summary>
    <p className={styles.editorialLabel}>Source-backed reading note · editorial draft</p>
    {scene === "tribunal" && <>
      <p>In the hearing as she tells it, the official asks for sacrifice for the emperors’ well-being. Her father appeals through the life he has helped her reach, the family’s standing, and the child who depends on her. These demands meet in one public encounter.</p>
      <p>In a separate Christian defense, Tertullian says Christians pray for emperors’ safety while rejecting sacrifice to the gods. That distinction helps make refusal intelligible within this religious world. It does not make the official’s words a neutral transcript or establish Perpetua’s own reasoning.</p>
      <p>What can a parent ask of an adult child? What does conviction cost the people who depend on someone else’s decision? These are questions raised by this juxtaposition, not answers supplied by the source.</p>
      <p><a href="https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_II">Passion §§5–6 · Wallis, ANF III (1885), II.1–2</a><br /><a href="https://www.newadvent.org/fathers/0301.htm">Tertullian, Apology 29–32 · S. Thelwall, ANF III (1885); New Advent revision</a>. A polemical defense, not testimony to this hearing.</p>
    </>}
    {scene === "vision" && <>
      <p>Earlier, her brother asks whether to expect suffering or release. The ladder, serpent and garden of §4 are interpreted by the siblings as pointing toward martyrdom. Here, in §10, the sentence to the beasts becomes a contest with an opponent, a transformed body and a reward.</p>
      <p>The account itself moves from seeing to waking to interpretation. It offers faith’s explanation without requiring us to mistake the scene for a record of the public games. The phrase “became a man” is retained rather than explained away; this encounter does not settle its gender, athletic or theological meanings.</p>
      <p><a href="https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_I">Passion §4 · Wallis, ANF I.3</a>; <a href="https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_III">§10 · ANF III.2</a>. These are passages of the same transmitted work, not independent corroboration.</p>
    </>}
    {scene === "felicity" && <>
      <p>The opening frame describes Perpetua as well-born and educated, and Felicity as Revocatus’s fellow servant. It does not say Perpetua owned Felicity. Their social positions should not disappear because both are mothers.</p>
      <p>The narrator says Felicity fears being left behind when the others die. Her companions grieve at that possibility and pray with her. After she gives birth, another woman raises her daughter. Childbirth, the wish to remain with the group and the continuing care of a child coexist here; no inner monologue survives to reconcile them for us.</p>
      <p><a href="https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_I">Passion §2 · Wallis, ANF I.1</a>; <a href="https://en.wikisource.org/wiki/Ante-Nicene_Fathers/Volume_III/Ethical/The_Passion_of_the_Holy_Martyrs_Perpetua_and_Felicitas/Argument_V">§15 · ANF V.2</a>. The narrator’s legal remarks are not used here as a general account of Roman law.</p>
    </>}
    {scene === "handover" && <>
      <p>The work attributes §§3–10 to Perpetua’s own hand. That attribution belongs to the transmitted text; this encounter cannot authenticate the voice. Shewring argues for distinct authentic accounts from differences in style and prose rhythm. Ellen Muehlberger proposes reading the first-person voice as a later literary composition in the tradition of speaking in a remembered woman’s character.</p>
      <p>These readings change what we can infer about composition and experience. Neither vividness nor uncertainty alone settles authorship. The traditional 203 CE setting of the narrated events must be distinguished from the disputed date of composition.</p>
      <p><a href="https://archive.org/stream/passionofssperpe00perp/passionofssperpe00perp_djvu.txt">W. H. Shewring, The Passion of SS. Perpetua and Felicity (1931), introduction xviii–xx</a>; <a href="https://works.hcommons.org/records/nykrz-3k844">Ellen Muehlberger, “Perpetual Adjustment,” JECS 30.3 (2022), 313–342, especially 315–318 and 333–342</a>. Full article access is recorded in the repository’s primary-source dossier. This is an argued alternative, not a consensus conclusion.</p>
    </>}
  </details>;
}
