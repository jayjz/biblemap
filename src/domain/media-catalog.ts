import {
  approvedMediaForEvent,
  approvedMediaForJourney,
  type CuratedMediaAsset,
  isProductionReadyMedia,
  validateMediaAsset,
} from "@/domain/media";

/**
 * Editorial media catalog.
 *
 * Only assets with verified reusable rights and reviewStatus "approved"
 * may render. Creation date is always distinguished from the depicted period.
 * These works illuminate reception history and material culture; they do not
 * establish the appearance of ancient events.
 */
export const MEDIA_CATALOG: readonly CuratedMediaAsset[] = [
  {
    id: "michelangelo-creation-of-adam",
    eventIds: ["creation"],
    journeyIds: [],
    class: "artistic-depiction",
    title: "The Creation of Adam",
    creator: "Michelangelo Buonarroti",
    creationDate: "c. 1511",
    depictedPeriod: "Primordial creation, as imagined in Renaissance Italy — not a historical date",
    sourceInstitution: "Vatican Museums (Sistine Chapel, Vatican City)",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Creaci%C3%B3n_de_Ad%C3%A1n.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Creaci%C3%B3n_de_Ad%C3%A1n.jpg/1280px-Creaci%C3%B3n_de_Ad%C3%A1n.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful photographic reproduction of a two-dimensional public-domain work of art. Michelangelo died in 1564. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Michelangelo Buonarroti, The Creation of Adam, c. 1511, Sistine Chapel. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:f3dc7d3d1b63acfc1f4902fe52f2d2896835c1fc6b2c9153b667ac22f0b759c0",
    localPath: "/media/approved/michelangelo-creation-of-adam.jpg",
    altText:
      "Fresco of God reaching toward Adam, their fingers nearly touching, painted on the Sistine Chapel ceiling.",
    caption:
      "Michelangelo's ceiling fresco is a High Renaissance meditation on Genesis, painted more than two millennia after the text it interprets. It tells us how sixteenth-century Rome pictured creation, not what the event looked like.",
    historicalFit:
      "Reception history of Genesis 1–2 in Catholic Italy. Anatomical naturalism and a bearded Creator are later artistic conventions, not ancient Near Eastern imagery.",
    editorialReason:
      "The image is among the most widely recognized visual companions to the creation narrative, and its fame lets us teach the difference between art and evidence at the first beat of the journey.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "poussin-crossing-red-sea",
    eventIds: ["exodus-red-sea"],
    journeyIds: ["exodus"],
    class: "artistic-depiction",
    title: "The Crossing of the Red Sea",
    creator: "Nicolas Poussin",
    creationDate: "1633–1634",
    depictedPeriod: "The Exodus, traditionally placed in the Late Bronze Age",
    sourceInstitution: "National Gallery of Victoria, Melbourne",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Poussin_-_The_Crossing_of_the_Red_Sea,_1632-1634,_1843-4.jpg",
    originalAssetUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Poussin_-_The_Crossing_of_the_Red_Sea,_1632-1634,_1843-4.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Poussin died in 1665. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Nicolas Poussin, The Crossing of the Red Sea, 1633–1634, National Gallery of Victoria. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:c95f1dc97146fb43de410ad0f98dc9b977171d476f78b451c639a78ce4ea9064",
    localPath: "/media/approved/poussin-crossing-red-sea.jpg",
    altText:
      "Baroque painting of Israelites gathering on a shore while Egyptian chariots founder in returning waters.",
    caption:
      "Poussin stages the sea crossing as a composed classical drama. Egyptian armor, drapery, and landscape belong to seventeenth-century European painting, not to New Kingdom Egypt.",
    historicalFit:
      "The route, dating, and even the body of water in Exodus 14 remain debated. This canvas is theological theatre, not a reconstruction of a verified crossing site.",
    editorialReason:
      "Pairs with the Exodus journey's Red Sea waypoint so the map's geography and the painting's emotion can be held together without conflating them.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "rembrandt-moses-tablets",
    eventIds: ["sinai-covenant"],
    journeyIds: ["exodus"],
    class: "artistic-depiction",
    title: "Moses with the Tablets of the Law",
    creator: "Rembrandt van Rijn",
    creationDate: "1659",
    depictedPeriod: "The Sinai covenant, as narrated in Exodus 19–34",
    sourceInstitution: "Gemäldegalerie, Staatliche Museen zu Berlin",
    sourceRecordUrl:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg/1024px-Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Rembrandt died in 1669. Wikimedia Commons PD-Art / Google Art Project.",
    requiredAttribution:
      "Rembrandt van Rijn, Moses with the Tablets of the Law, 1659, Gemäldegalerie, Berlin. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:63200b860f9633f0c0cb3bb0ed7a51008ba8ba0da74ee53f18bbf9d6f4ae0c1d",
    localPath: "/media/approved/rembrandt-moses-tablets.jpg",
    altText:
      "Moses stands holding two large inscribed stone tablets above his head, lit against a dark ground.",
    caption:
      "Rembrandt paints Moses as a single human figure under strain, the tablets raised as if they might be dashed. The Hebrew lettering is a seventeenth-century painter's encounter with the Law, not a facsimile of an ancient inscription.",
    historicalFit:
      "Mount Sinai's location is disputed (southern Sinai peninsula, northwest Arabia, and other identifications are proposed). The painting cannot settle the geography.",
    editorialReason:
      "The intimacy of Rembrandt's light matches Sinai's narrative of a holy God meeting a people, without pretending to photograph the mountain.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "caravaggio-david-goliath",
    eventIds: ["david-goliath"],
    journeyIds: [],
    class: "artistic-depiction",
    title: "David with the Head of Goliath",
    creator: "Michelangelo Merisi da Caravaggio",
    creationDate: "c. 1610",
    depictedPeriod: "The contest in the Valley of Elah, as narrated in 1 Samuel 17",
    sourceInstitution: "Galleria Borghese, Rome",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Caravaggio_-_David_con_la_testa_di_Golia.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Caravaggio_-_David_con_la_testa_di_Golia.jpg/800px-Caravaggio_-_David_con_la_testa_di_Golia.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Caravaggio died in 1610. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Caravaggio, David with the Head of Goliath, c. 1610, Galleria Borghese. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:7b9dd671d32623cf626cd32e16f74511fac33d4824d78e41d783dfdc7c38536f",
    localPath: "/media/approved/caravaggio-david-goliath.jpg",
    altText:
      "A young David holds a sword and the severed head of Goliath, both faces caught in Caravaggio's raking light.",
    caption:
      "Caravaggio is said to have given Goliath his own face. The painting is a meditation on victory and self-judgment, not a field report from the Shephelah.",
    historicalFit:
      "The Valley of Elah is a real landscape west of Bethlehem; the historic David is debated in scope. This canvas is Baroque theology, not Iron Age ethnography.",
    editorialReason:
      "The moral gravity of the picture resists the 'underdog sports story' reading and returns the scene to consequence and mortality.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "met-lamassu-nimrud",
    eventIds: ["babylonian-exile"],
    journeyIds: [],
    class: "historical-artifact",
    title: "Human-headed winged lion (lamassu)",
    creator: "Unknown Assyrian sculptors, palace of Ashurnasirpal II",
    creationDate: "c. 883–859 BC",
    depictedPeriod: "Neo-Assyrian empire, contemporary with the later kings of Israel and Judah",
    sourceInstitution: "The Metropolitan Museum of Art, New York",
    sourceRecordUrl: "https://www.metmuseum.org/art/collection/search/322609",
    originalAssetUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Human-headed_winged_lion_(lamassu)_MET_DP252320.jpeg",
    license: "CC0-1.0",
    rightsStatement:
      "Metropolitan Museum of Art Open Access. Object 32.143.2 released under CC0 1.0 Universal.",
    requiredAttribution:
      "Human-headed winged lion (lamassu), Assyrian, c. 883–859 BC. The Metropolitan Museum of Art, Gift of John D. Rockefeller Jr., 1932 (32.143.2). CC0.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:903a3129921e57914d2f2019a5d131fee1c796dbdbe190b11c06fd79828d3d9b",
    localPath: "/media/approved/met-lamassu.jpg",
    altText:
      "Colossal gypsum alabaster sculpture of a human-headed winged lion that once guarded an Assyrian palace gate.",
    caption:
      "This guardian figure stood at a palace threshold in Nimrud. It is a real imperial object from the world that later swallowed Samaria and pressed Judah — not a depiction of the Babylonian exile itself.",
    historicalFit:
      "Assyria, not Babylon, produced this sculpture. It belongs beside the exile narrative as evidence of Mesopotamian imperial power in the centuries around Israel's fall, and must not be labeled as a scene of 586 BC Jerusalem.",
    editorialReason:
      "Gives the exile beat a physical artifact from the imperial world of the biblical historians, clearly classified as historical-artifact rather than illustration.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "giotto-nativity-scrovegni",
    eventIds: ["birth-of-jesus"],
    journeyIds: ["jesus_ministry"],
    class: "artistic-depiction",
    title: "Nativity",
    creator: "Giotto di Bondone",
    creationDate: "c. 1305",
    depictedPeriod: "The birth of Jesus, as narrated in Luke 2 and Matthew 2",
    sourceInstitution: "Scrovegni Chapel, Padua",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Giotto_-_Scrovegni_-_-17-_-_Nativity,_Birth_of_Jesus.jpg",
    originalAssetUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Giotto_-_Scrovegni_-_-17-_-_Nativity,_Birth_of_Jesus.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain fresco. Giotto died in 1337. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Giotto di Bondone, Nativity, c. 1305, Scrovegni Chapel, Padua. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:10646087f8a791a0b358fe089517a0c4a90c9e9bb3fef4442aaa5129a80d4ed3",
    localPath: "/media/approved/giotto-nativity.jpg",
    altText:
      "Fresco of Mary reclining beside the infant Jesus in a rocky shelter, with ox, ass, and attending women.",
    caption:
      "Giotto's Padua fresco is among the earliest surviving large-scale Christian narrative cycles in Italian painting. The rocky lean-to, ox, and ass are medieval visual theology, not a reconstructed first-century cave in Bethlehem.",
    historicalFit:
      "Luke names Bethlehem; the precise building is unknown. First-century Judean birthing practice does not look like a fourteenth-century Italian fresco.",
    editorialReason:
      "The tenderness of Giotto's figures serves the incarnation beat without Hollywood spectacle.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "tintoretto-last-supper",
    eventIds: ["last-supper"],
    journeyIds: ["jesus_ministry"],
    class: "artistic-depiction",
    title: "The Last Supper",
    creator: "Jacopo Tintoretto",
    creationDate: "1592–1594",
    depictedPeriod: "The Passover meal in Jerusalem, as narrated in the Synoptic Gospels and 1 Corinthians 11",
    sourceInstitution: "Basilica di San Giorgio Maggiore, Venice",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg/1280px-Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Tintoretto died in 1594. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Jacopo Tintoretto, The Last Supper, 1592–1594, San Giorgio Maggiore, Venice. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:09ba0214c1a0a1659933e76d1e41bc31ffed116caa0be513ff16cabc9a86a0f4",
    localPath: "/media/approved/tintoretto-last-supper.jpg",
    altText:
      "A diagonally receding supper table in a dark Venetian hall, with angels in the rafters and servants at work.",
    caption:
      "Tintoretto places the meal in a working kitchen-hall rather than a calm Cenacle. Angels and servants share the space — a Counter-Reformation vision of Eucharist in the midst of ordinary labor.",
    historicalFit:
      "A first-century Passover in Jerusalem would not resemble a late-Renaissance Venetian refectory. The painting interprets the meal's meaning, not its floor plan.",
    editorialReason:
      "Offers a less familiar Last Supper than Leonardo's, so the scene can feel encountered rather than quoted.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "velazquez-christ-crucified",
    eventIds: ["crucifixion"],
    journeyIds: ["jesus_ministry"],
    class: "artistic-depiction",
    title: "Christ Crucified",
    creator: "Diego Velázquez",
    creationDate: "c. 1632",
    depictedPeriod: "The crucifixion of Jesus outside Jerusalem, as narrated in the four Gospels",
    sourceInstitution: "Museo Nacional del Prado, Madrid",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Diego_Vel%C3%A1zquez_012.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Diego_Vel%C3%A1zquez_012.jpg/800px-Diego_Vel%C3%A1zquez_012.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Velázquez died in 1660. Wikimedia Commons PD-Art / Prado.",
    requiredAttribution:
      "Diego Velázquez, Christ Crucified, c. 1632, Museo Nacional del Prado. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:1bac9eff947514915e554fac9ba30b916a6994562fdd6cf40184f98c6360b14d",
    localPath: "/media/approved/velazquez-christ-crucified.jpg",
    altText:
      "Christ alone on a cross against a dark ground, head bowed, painted with quiet Spanish naturalism.",
    caption:
      "Velázquez strips the scene to one body and a night-black field. There is no crowd, no landscape of Golgotha — only the claim of the Gospels, held still.",
    historicalFit:
      "Roman crucifixion is archaeologically attested; the precise spot of Jesus' cross is traditionally the Church of the Holy Sepulchre and is also argued at Gordon's Calvary. This painting does not locate it.",
    editorialReason:
      "Restraint matches the product's cinematic language: darkness, a single illuminated form, and silence before commentary.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "piero-resurrection",
    eventIds: ["resurrection"],
    journeyIds: ["jesus_ministry"],
    class: "artistic-depiction",
    title: "The Resurrection",
    creator: "Piero della Francesca",
    creationDate: "c. 1463–1465",
    depictedPeriod: "The resurrection of Jesus, as narrated in the four Gospels",
    sourceInstitution: "Museo Civico di Sansepolcro",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Piero_della_Francesca_021.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Piero_della_Francesca_021.jpg/1024px-Piero_della_Francesca_021.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain fresco. Piero died in 1492. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Piero della Francesca, The Resurrection, c. 1463–1465, Museo Civico, Sansepolcro. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:e09592efb93ce6eb5d2d3bbcd275565b145aaa946f869e7ed3a516832326dfe3",
    localPath: "/media/approved/piero-resurrection.jpg",
    altText:
      "The risen Christ stands in a stone sarcophagus above sleeping soldiers, holding a banner, landscape split between winter and spring.",
    caption:
      "Piero's Christ looks directly out. The landscape behind him turns from winter to spring — a painter's symbol of new creation, not a meteorological record of a Sunday in Jerusalem.",
    historicalFit:
      "The empty tomb tradition is central to Christian confession and historically debated in its details. The fresco is a fifteenth-century civic and theological statement from Sansepolcro, a town named for the Holy Sepulchre.",
    editorialReason:
      "Stillness and frontality let the resurrection beat arrive as presence rather than motion graphics.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "caravaggio-conversion-damascus",
    eventIds: ["pauls-conversion"],
    journeyIds: ["paul1"],
    class: "artistic-depiction",
    title: "Conversion on the Way to Damascus",
    creator: "Michelangelo Merisi da Caravaggio",
    creationDate: "1601",
    depictedPeriod: "Saul's encounter on the Damascus road, as narrated in Acts 9, 22, and 26",
    sourceInstitution: "Cerasi Chapel, Santa Maria del Popolo, Rome",
    sourceRecordUrl:
      "https://commons.wikimedia.org/wiki/File:Caravaggio_-_La_conversione_di_San_Paolo.jpg",
    originalAssetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Conversion_on_the_Way_to_Damascus-Caravaggio_%28c.1600-1%29.jpg/1024px-Conversion_on_the_Way_to_Damascus-Caravaggio_%28c.1600-1%29.jpg",
    license: "PD-Art",
    rightsStatement:
      "Faithful reproduction of a two-dimensional public-domain painting. Caravaggio died in 1610. Wikimedia Commons PD-Art.",
    requiredAttribution:
      "Caravaggio, Conversion on the Way to Damascus, 1601, Santa Maria del Popolo, Rome. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:bf5644b230a19cc32c6154e4133cbd3b31ed4301a2e79ab5f06f854825d1973d",
    localPath: "/media/approved/caravaggio-conversion-damascus.jpg",
    altText:
      "Saul lies on his back in a pool of light beneath a horse, arms open, the rest of the canvas in deep shadow.",
    caption:
      "Caravaggio gives almost no road and no city. The conversion is a body falling into light. Damascus remains on the map; this painting stays with the man.",
    historicalFit:
      "Acts describes a journey from Jerusalem toward Damascus. The precise spot is unknown. The painting is Roman Baroque theology, not a Syrian landscape survey.",
    editorialReason:
      "Opens Paul's missionary journey with an encounter rather than a route sketch, then lets the map carry the miles.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "woodward-jerusalem-from-mount-of-olives",
    eventIds: ["ascension", "triumphal-entry"],
    journeyIds: ["jesus_ministry"],
    class: "historical-landscape",
    title: "Jerusalem from the Mount of Olives",
    creator: "John Douglas Woodward (engraved by Charles Cousen)",
    creationDate: "1881–1883",
    depictedPeriod: "Ottoman Jerusalem as published in Picturesque Palestine, Sinai and Egypt — not first-century Jerusalem",
    sourceInstitution: "Published in Picturesque Palestine, Sinai and Egypt; Wikimedia Commons",
    sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Jerusalem_from_the_Mount_of_Olives.jpg",
    originalAssetUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem_from_the_Mount_of_Olives.jpg",
    license: "PD-US",
    rightsStatement:
      "Published 1881–1883. Woodward died in 1924; Cousen died in 1889. Public domain in the United States as a work published before 1930.",
    requiredAttribution:
      "John Douglas Woodward, engraved by Charles Cousen, Jerusalem from the Mount of Olives, 1881–1883, from Picturesque Palestine, Sinai and Egypt. Public domain.",
    downloadedAt: "2026-09-08",
    checksum: "sha256:fe8c05978b0d0d5540e04fee9c41041e8424c255e96123a54ee1c0f927898325",
    localPath: "/media/approved/roberts-jerusalem-olives.jpg",
    altText:
      "Nineteenth-century engraving looking west from the Mount of Olives across the Kidron to the walled city of Jerusalem.",
    caption:
      "Woodward drew the city published in the early 1880s: Ottoman walls, the Dome of the Rock, villages on the ridge. Useful for standing on the Mount of Olives; it is not a view Jesus saw.",
    historicalFit:
      "The ridge and Kidron valley are the same landforms. Herodian architecture, the Second Temple, and the first-century skyline are gone. Treat this as landscape continuity, not period reconstruction.",
    editorialReason:
      "Gives the ascension and triumphal-entry beats a real topographic counterpart to the map camera without inventing a digital Temple.",
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
] as const satisfies readonly CuratedMediaAsset[];

const catalogErrors = MEDIA_CATALOG.flatMap((asset) => validateMediaAsset(asset).errors);

if (catalogErrors.length > 0 && process.env.NODE_ENV !== "production") {
  console.error("[biblemap:media] catalog failed provenance validation:\n", catalogErrors.join("\n"));
}

export const APPROVED_MEDIA: readonly CuratedMediaAsset[] = MEDIA_CATALOG.filter(isProductionReadyMedia);

export function mediaForEvent(eventId: string): CuratedMediaAsset[] {
  return approvedMediaForEvent(APPROVED_MEDIA, eventId);
}

export function mediaForJourney(journeyId: string): CuratedMediaAsset[] {
  return approvedMediaForJourney(APPROVED_MEDIA, journeyId);
}

export function mediaById(id: string): CuratedMediaAsset | undefined {
  return APPROVED_MEDIA.find((asset) => asset.id === id);
}
