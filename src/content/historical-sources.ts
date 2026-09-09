import {
  validateHistoricalSource,
  type HistoricalSource,
} from "@/domain/historical-context";

/**
 * Auditable source registry for human-world context.
 * Wikipedia is not used as a final authority. Each entry must be followable.
 */
export const HISTORICAL_SOURCES: readonly HistoricalSource[] = [
  {
    id: "exodus-1-15",
    title: "Exodus 1–15",
    author: "Hebrew Bible / Old Testament",
    url: "https://www.biblegateway.com/passage/?search=Exodus+1-15&version=KJV",
    sourceType: "biblical-text",
    supports: "The biblical narrative of Israel in Egypt, forced labor, departure, and the sea crossing.",
  },
  {
    id: "exodus-19",
    title: "Exodus 19",
    author: "Hebrew Bible / Old Testament",
    url: "https://www.biblegateway.com/passage/?search=Exodus+19&version=KJV",
    sourceType: "biblical-text",
    supports: "The biblical setting of the Sinai covenant as a mountain encounter, without naming a modern peak.",
  },
  {
    id: "numbers-13-20",
    title: "Numbers 13–20",
    author: "Hebrew Bible / Old Testament",
    url: "https://www.biblegateway.com/passage/?search=Numbers+13-20&version=KJV",
    sourceType: "biblical-text",
    supports: "The biblical placement of Kadesh (Barnea) as a long wilderness encampment and turning point.",
  },
  {
    id: "deuteronomy-34",
    title: "Deuteronomy 34",
    author: "Hebrew Bible / Old Testament",
    url: "https://www.biblegateway.com/passage/?search=Deuteronomy+34&version=KJV",
    sourceType: "biblical-text",
    supports: "Moses views the land from Moab and dies east of the Jordan, according to the biblical text.",
  },
  {
    id: "bible-odyssey-egypt",
    title: "Egypt",
    author: "Bible Odyssey / Society of Biblical Literature",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/articles/egypt/",
    sourceType: "academic-reference",
    published: "2017",
    supports:
      "Egyptian records do not mention the Exodus events or Moses; the Merneptah Stela (c. 1208 BCE) is the earliest extra-biblical reference to Israel, as a people in Canaan, not as an account of an exodus.",
  },
  {
    id: "bible-odyssey-origins",
    title: "Origins of the Israelites (video conversation)",
    author: "Bible Odyssey / Society of Biblical Literature",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/video-gallery/origins-of-the-israelites/",
    sourceType: "academic-reference",
    published: "2022",
    supports:
      "Scholarly disagreement over 15th- versus 13th-century settings, the limits of the Merneptah Stela, and archaeological difficulties with a large-scale conquest model.",
  },
  {
    id: "acts-11-26",
    title: "Acts 11:19–26",
    author: "New Testament",
    url: "https://www.biblegateway.com/passage/?search=Acts+11.19-26&version=KJV",
    sourceType: "biblical-text",
    supports: "Gentile mission at Antioch and the note that the disciples were first called Christians there.",
  },
  {
    id: "mesha-stela-odyssey",
    title: "The Mesha Stela",
    author: "Bible Odyssey / Society of Biblical Literature",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/articles/the-mesha-stela/",
    sourceType: "inscription",
    published: "2017",
    supports:
      "Ninth-century BCE Moabite royal inscription mentioning Moab, Israel, and Omri. Evidence for later Moabite-Israelite history, not for the Exodus itinerary.",
  },
  {
    id: "acts-13-14",
    title: "Acts 13–14",
    author: "New Testament",
    url: "https://www.biblegateway.com/passage/?search=Acts+13-14&version=KJV",
    sourceType: "biblical-text",
    supports:
      "The sending from Antioch, Cyprus and Sergius Paulus, the synagogue sermon at Pisidian Antioch, and the Lystra episode including Lycaonian speech and the names Zeus and Hermes.",
  },
  {
    id: "strabo-geography-16",
    title: "Geography 16.2",
    author: "Strabo",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=Strab.+16.2",
    sourceType: "ancient-author",
    published: "early 1st century CE",
    supports:
      "Antioch on the Orontes as a major Syrian city; Taricheae (Magdala) as a place supplying excellent pickled fish from the lake.",
  },
  {
    id: "josephus-ant-12",
    title: "Jewish Antiquities 12.119–124",
    author: "Flavius Josephus",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=J.+AJ+12.119",
    sourceType: "ancient-author",
    published: "late 1st century CE",
    supports:
      "Josephus's claim that Seleucus I granted Jews civic rights in Antioch comparable to those of Macedonians, and that a substantial Jewish community lived there.",
  },
  {
    id: "pliny-nh-5",
    title: "Natural History 5.24",
    author: "Pliny the Elder",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=Plin.+Nat.+5.24",
    sourceType: "ancient-author",
    published: "1st century CE",
    supports: "Antioch in Pisidia as colonia Caesarea, listed among Pisidian communities.",
  },
  {
    id: "gazda-pisidian-antioch",
    title: "Building a New Rome: The Imperial Colony of Pisidian Antioch (25 BC–AD 700)",
    author: "Elaine K. Gazda and Diana Y. Ng, eds.",
    institution: "Kelsey Museum of Archaeology, University of Michigan",
    url: "https://toc.library.ethz.ch/objects/pdf/z01_978-0-9741873-4-1_01.pdf",
    sourceType: "academic-reference",
    published: "2011",
    supports:
      "Pisidian Antioch as an Augustan veteran colony with imperial cult architecture, urban infrastructure, and a later church tradition associated with Paul.",
  },
  {
    id: "bmcr-mitchell-antioch",
    title: "Review of Pisidian Antioch: The Site and its Monuments",
    author: "Stephen Mitchell, reviewed in Bryn Mawr Classical Review",
    institution: "Bryn Mawr Classical Review",
    url: "https://bmcr.brynmawr.edu/1999/1999.07.10/",
    sourceType: "academic-reference",
    published: "1999",
    supports:
      "Foundation as a Hellenistic colony, Roman colony of 25 BCE with Italian veterans, Augustan building boom, and the extra-mural sanctuary of Men Askaenos.",
  },
  {
    id: "calder-lystra-zeus",
    title: "Discussion of Calder's Lystra Zeus/Hermes inscriptions in Conrad Gempf, “The Gods of Lystra”",
    author: "Conrad Gempf, citing W. M. Calder, “The ‘Priest’ of Zeus at Lystra,” Expositor 7.10 (1910)",
    institution: "Missiology.org.uk (Festschrift essay with citations)",
    url: "https://missiology.org.uk/pdf/cotterell-fs/05_gempf.pdf",
    sourceType: "academic-reference",
    published: "essay collecting Calder 1910 and later inscriptions",
    supports:
      "Inscriptions from the Lystra valley associate Zeus and Hermes; Gempf and Calder treat them as a local Anatolian pairing under Greek names, not as proof of a first-century temple photograph.",
  },
  {
    id: "nts-lystra",
    title: "Gods or Ambassadors of God? Barnabas and Paul in Lystra",
    author: "New Testament Studies 41 (discussion of Acts 14, Calder, and Breytenbach)",
    institution: "Cambridge University Press",
    url: "https://www.cambridge.org/core/journals/new-testament-studies/article/abs/gods-or-ambassadors-of-god-barnabas-and-paul-in-lystra/5C2C9F728251821EFC3DE7CA74836F5A",
    sourceType: "peer-reviewed",
    published: "1995",
    supports:
      "The Acts crowd is the indigenous Lycaonian population; later inscriptions and Ovid's Philemon story are discussed as background, not as first-century eyewitnesses.",
  },
  {
    id: "ovid-met-8",
    title: "Metamorphoses 8.626–724 (Baucis and Philemon)",
    author: "Ovid",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=Ov.+Met.+8.626",
    sourceType: "ancient-author",
    published: "early 1st century CE",
    supports:
      "A Latin literary tale of Jupiter and Mercury visiting Phrygia in disguise. A discussed parallel to Acts 14, not evidence that Lystran villagers had read Ovid.",
  },
  {
    id: "luke-4-8",
    title: "Luke 4–8 and parallels",
    author: "New Testament Gospels",
    url: "https://www.biblegateway.com/passage/?search=Luke+4-8&version=KJV",
    sourceType: "biblical-text",
    supports:
      "Nazareth as hometown, Capernaum as a ministry base with a synagogue, fishing disciples, and a lakeside setting.",
  },
  {
    id: "matthew-16-17",
    title: "Matthew 16–17",
    author: "New Testament",
    url: "https://www.biblegateway.com/passage/?search=Matthew+16-17&version=KJV",
    sourceType: "biblical-text",
    supports:
      "Peter's confession at Caesarea Philippi and the subsequent transfiguration on an unnamed mountain.",
  },
  {
    id: "custodia-capernaum",
    title: "Capernaum sanctuary: synagogue and excavations",
    author: "Studium Biblicum Franciscanum / Custody of the Holy Land",
    institution: "Custody of the Holy Land",
    url: "https://www.custodia.org/en/sanctuaries/capernaum/",
    sourceType: "archaeological-report",
    supports:
      "Franciscan excavations (Corbo, Loffreda): the visible white synagogue is late Roman/Byzantine; a first-century basalt pavement under the nave is a possible earlier public building, not a settled identification of Jesus' synagogue.",
  },
  {
    id: "bar-jesus-synagogue",
    title: "Jesus in the Synagogue",
    author: "Biblical Archaeology Society",
    institution: "Biblical Archaeology Society",
    url: "https://www.biblicalarchaeology.org/magazine/jesus-in-the-synagogue/",
    sourceType: "academic-reference",
    published: "2023",
    supports:
      "The Capernaum white synagogue dates to the fourth century CE; earlier basalt remains beneath it are only a candidate for a first-century public synagogue, and some scholars question the identification.",
  },
  {
    id: "iaa-magdala-atiqot",
    title: "Excavations at Magdala",
    author: "Israel Antiquities Authority / Magdala Project",
    institution: "Israel Antiquities Authority",
    url: "https://publications.iaa.org.il/cgi/viewcontent.cgi?article=1829&context=atiqot",
    sourceType: "archaeological-report",
    supports:
      "Magdala/Taricheae as a Jewish town on the western shore of the lake with Early Roman strata, a first-century synagogue excavated by the IAA, and harbor remains.",
  },
  {
    id: "bible-odyssey-caesarea-philippi",
    title: "Caesarea Philippi",
    author: "Bible Odyssey / Society of Biblical Literature",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/articles/caesarea-philippi/",
    sourceType: "academic-reference",
    published: "2019",
    supports:
      "Hellenistic Panion; Herod's temple to Augustus; Philip the tetrarch founds Caesarea (Philippi) in 2/1 BCE beside the sanctuary of Pan at Banias.",
  },
  {
    id: "berlin-pan-sanctuary",
    title: "The Archaeology of Ritual: The Sanctuary of Pan at Banias/Caesarea Philippi",
    author: "Andrea M. Berlin",
    institution: "Bulletin of the American Schools of Oriental Research",
    url: "https://www.jstor.org/stable/1357531",
    sourceType: "peer-reviewed",
    published: "1999",
    supports:
      "A sanctuary of Pan at the Jordan headwaters from the third century BCE, later absorbed into Philip's city; rural shrine becoming an urban cult.",
  },
  {
    id: "josephus-ant-18-philip",
    title: "Jewish Antiquities 18.28",
    author: "Flavius Josephus",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=J.+AJ+18.28",
    sourceType: "ancient-author",
    supports:
      "Philip the tetrarch founds Caesarea at Panias and names it after Caesar, and founds Julias in Gaulanitis.",
  },
  {
    id: "josephus-ant-17-188",
    title: "Jewish Antiquities 17.188–189",
    author: "Flavius Josephus",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=J.+AJ+17.188",
    sourceType: "ancient-author",
    supports:
      "After Herod the Great, Antipas is made tetrarch of Galilee and Perea; Philip receives Gaulanitis, Trachonitis, and Paneas.",
  },
  {
    id: "bible-odyssey-antipas",
    title: "Herod Antipas",
    author: "Morten Hørning Jensen / Bible Odyssey",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/articles/herod-antipas/",
    sourceType: "academic-reference",
    published: "2018",
    supports:
      "Antipas ruled Galilee and Perea as tetrarch from 4 BCE to 39 CE, a client of Rome rather than an independent king.",
  },
  {
    id: "bible-odyssey-capernaum",
    title: "Capernaum",
    author: "Mark A. Chancey / Bible Odyssey",
    institution: "Society of Biblical Literature",
    url: "https://www.bibleodyssey.org/articles/capernaum/",
    sourceType: "academic-reference",
    published: "2017",
    supports:
      "Capernaum as a Jewish fishing and agricultural village; the standing limestone synagogue is late fourth/fifth century; the Gospel 'centurion' is likely an officer of Antipas, not evidence of a Roman garrison.",
  },
  {
    id: "strabo-cyprus-14-6",
    title: "Geography 14.6.6",
    author: "Strabo",
    url: "https://www.perseus.tufts.edu/hopper/text?doc=Strab.+14.6.6",
    sourceType: "ancient-author",
    published: "early 1st century CE",
    supports:
      "Strabo treats Cyprus as a Roman province in his own day (he calls it praetorian). He does not name Sergius Paulus.",
  },
  {
    id: "aja-kadesh-barnea",
    title: "Review of Excavations at Kadesh Barnea (Tell el-Qudeirat) 1976–1982",
    author: "Avraham Faust, reviewing Rudolph Cohen and Hannah Bernick-Greenberg",
    institution: "American Journal of Archaeology",
    url: "https://ajaonline.org/book-review/608/",
    sourceType: "academic-reference",
    published: "2009",
    supports:
      "Tell el-Qudeirat is the widely proposed identification of biblical Kadesh Barnea. Excavated remains are Iron Age fortresses; the identification and fortress chronology remain debated, and the site is not a demonstrated Late Bronze Israelite camp.",
  },
];

const byId = new Map(HISTORICAL_SOURCES.map((source) => [source.id, source]));
if (byId.size !== HISTORICAL_SOURCES.length) {
  throw new Error("Historical source registry contains duplicate ids");
}

const sourceErrors = HISTORICAL_SOURCES.flatMap((source) => validateHistoricalSource(source).errors);
if (sourceErrors.length > 0) {
  throw new Error(`Historical source registry invalid:\n${sourceErrors.join("\n")}`);
}

export function historicalSourceById(id: string): HistoricalSource | undefined {
  return byId.get(id);
}

export function historicalSourcesByIds(ids: readonly string[]): HistoricalSource[] {
  return ids
    .map((id) => byId.get(id))
    .filter((source): source is HistoricalSource => Boolean(source));
}
