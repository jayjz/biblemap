import {
  isProductionReadyContext,
  validateHistoricalContext,
  type HistoricalContext,
} from "@/domain/historical-context";
import { historicalSourceById } from "@/content/historical-sources";

/**
 * Authored human-world context for the three existing journey families.
 * Sparse on purpose. Production rendering requires reviewStatus "approved".
 */
export const HISTORICAL_CONTEXTS: readonly HistoricalContext[] = [
  {
    id: "world-exodus-egypt",
    sceneIds: ["exodus-egypt"],
    eventIds: ["moses-birth"],
    journeyIds: ["exodus"],
    region: "Nile Delta / Egyptian empire",
    periodLabel: "Late Bronze Age New Kingdom — date disputed",
    displayYear: -1446,
    chronologyNote:
      "The map's year follows a traditional early chronology. Many historians place any historical memory of an exodus in the Ramesside thirteenth century BCE. Neither date is independently verified by Egyptian royal inscriptions.",
    narrative:
      "The biblical story opens inside an empire, not in empty desert. New Kingdom Egypt ruled the Nile and projected power into Canaan. Exodus describes a Hebrew population under forced labor, a child hidden among reeds, and a name drawn from water. Egyptian archives, meticulous as they are, do not mention Moses or this departure. The earliest extra-biblical word 'Israel' appears later, on Merneptah's stela, as a people already in Canaan — not as a travelogue of the wilderness.",
    beats: [
      {
        kind: "people",
        claimKind: "biblical-text",
        text: "Exodus speaks of a growing Hebrew community in Egypt, midwives, and a royal order against sons — a portrait of a subject people, not of pharaohs as stage villains without a world of their own.",
      },
      {
        kind: "power",
        claimKind: "scholarly-inference",
        text: "Whoever sat on the throne, the political reality around any such story is imperial Egypt. Store-cities named Pithom and Rameses (Exodus 1:11) are often linked by scholars to Ramesside building in the eastern Delta; that link is inference, not a field tag on the biblical page.",
      },
      {
        kind: "evidence",
        claimKind: "contemporary-text",
        text: "The Merneptah Stela (c. 1208 BCE) is the earliest extra-biblical mention of Israel. It locates a people in Canaan and is silent on an exodus.",
      },
    ],
    uncertainty:
      "No Egyptian inscription confirms the Exodus narrative. Dating proposals (fifteenth versus thirteenth century) and the scale of any movement remain disputed. This scene is told as Scripture moving through a real imperial landscape, not as a reconstructed census of the Delta.",
    confidence: "disputed",
    sourceIds: ["exodus-1-15", "bible-odyssey-egypt", "bible-odyssey-origins"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-exodus-sea",
    sceneIds: ["exodus-sea"],
    eventIds: ["exodus-red-sea"],
    journeyIds: ["exodus"],
    region: "Eastern Nile frontier / northern Sinai waters",
    periodLabel: "The crossing — body of water unidentified",
    displayYear: -1446,
    chronologyNote:
      "The Hebrew yam suf is traditionally rendered Red Sea; many scholars read a reed sea or lagoon on the eastern Delta. The map must choose a shore. That choice is not a verified waypoint.",
    narrative:
      "The story pins a people between chariot power and water. Geography here is a constraint: Egypt's military roads ran the northern Sinai; wetlands and lakes sat on the eastern edge of the Delta. The biblical text gives a deliverance at the sea. It does not give a modern grid reference. Later paintings, including the one this journey may show, are reception — how Europe imagined the scene centuries afterward — not evidence of a particular beach.",
    beats: [
      {
        kind: "movement",
        claimKind: "scholarly-inference",
        text: "Egyptian military and trade routes crossed northern Sinai. A fleeing group would have had to leave the Nile corridor; which water they met is not settled.",
      },
      {
        kind: "evidence",
        claimKind: "disputed",
        text: "Proposed identifications (Bitter Lakes, Lake Sirbonis, Gulf of Suez, Gulf of Aqaba) remain competing scholarly reconstructions. None is archaeologically tagged as the crossing.",
      },
    ],
    change:
      "The narrative leaves the irrigated imperial center for a threshold landscape — water, wind, and an army's reach — without a verified campsite.",
    uncertainty:
      "Route, body of water, and date are all disputed. The camera is a storytelling choice. It is not a survey peg.",
    confidence: "disputed",
    sourceIds: ["exodus-1-15", "bible-odyssey-origins"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-exodus-sinai",
    sceneIds: ["exodus-sinai"],
    eventIds: ["sinai-covenant"],
    journeyIds: ["exodus"],
    region: "Sinai / north-west Arabia (identification unsettled)",
    periodLabel: "Covenant at a mountain — peak unnamed by modern survey",
    displayYear: -1446,
    narrative:
      "The biblical scene is a people at a mountain, asked to belong. Exodus does not supply a modern peak name. Christian pilgrimage later fastened on Jebel Musa in the south of the peninsula; other proposals exist. The covenant claim in the text does not wait on our camera. What we can say about the human world is modest: this is remembered as a wilderness treaty, not as a city foundation, in a landscape of pastoral movement rather than Nile irrigation.",
    beats: [
      {
        kind: "religion",
        claimKind: "biblical-text",
        text: "Exodus 19 frames the mountain as a holy boundary — fire, smoke, and a people standing at a distance — a ritual geography, not a temple plan we can excavate.",
      },
      {
        kind: "people",
        claimKind: "scholarly-inference",
        text: "If a historical group moved through this wilderness, daily life would have been pastoral and mobile. That is a cautious inference from environment, not a reconstructed encampment.",
      },
    ],
    uncertainty:
      "Jebel Musa is a traditional Christian identification from late antiquity. It is not an archaeologically demonstrated Sinai of Exodus. Other mountains have been proposed. This product does not choose one as fact.",
    confidence: "traditional",
    sourceIds: ["exodus-19", "bible-odyssey-origins"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-exodus-kadesh",
    sceneIds: ["exodus-kadesh"],
    eventIds: [],
    journeyIds: ["exodus"],
    region: "Northern Sinai / southern Negev fringe",
    periodLabel: "Kadesh Barnea — site proposed, not proven",
    displayYear: -1445,
    narrative:
      "Numbers makes Kadesh a long pause: spies, refusal, and years in the wilderness. Modern maps often drop a pin at ʿAin el-Qudeirat, a spring with later fortress remains. That identification is a scholarly proposal, not a field label from the biblical writers. We show a region because a courtyard would pretend too much.",
    beats: [
      {
        kind: "people",
        claimKind: "biblical-text",
        text: "The text describes a community in tension — wanting the land, fearing it, delayed at the edge of promise.",
      },
      {
        kind: "evidence",
        claimKind: "disputed",
        text: "ʿAin el-Qudeirat (Tell el-Qudeirat) is the most common modern candidate after Woolley, Lawrence, and Cohen's excavations. The published remains are Iron Age fortresses. Occupation in the Late Bronze Age — the conventional setting of the wilderness itinerary — is not demonstrated.",
      },
    ],
    uncertainty:
      "The biblical Kadesh Barnea has not been identified with archaeological certainty. The camera is regional on purpose.",
    confidence: "disputed",
    sourceIds: ["numbers-13-20", "bible-odyssey-origins", "aja-kadesh-barnea"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-exodus-moab",
    sceneIds: ["exodus-moab"],
    eventIds: [],
    journeyIds: ["exodus"],
    region: "Plains east of the Jordan, opposite Jericho",
    periodLabel: "Moab in the biblical itinerary",
    displayYear: -1406,
    narrative:
      "Deuteronomy places Moses on Moabite ground, looking west across the Jordan at a land he will not enter. Moab is a real highland east of the Dead Sea, with its own later kings and gods. The ninth-century Mesha Stela speaks of Moab and Israel in a different century; it is evidence of the region and of later conflict, not a witness to Moses. The human meaning of this beat is an ending on someone else's frontier.",
    beats: [
      {
        kind: "people",
        claimKind: "biblical-text",
        text: "The plains of Moab are where the wilderness generation stands in sight of the river, as guests or trespassers on a neighbor's land.",
      },
      {
        kind: "change",
        claimKind: "biblical-text",
        text: "The story turns from road to inheritance. Geography becomes a threshold: a short descent, a border, a death on the east bank.",
      },
    ],
    uncertainty:
      "The Mesha Stela is centuries later than any proposed Exodus date and must not be read as a caption on this scene. Precise encampment sites on the Moabite plateau are not settled.",
    confidence: "scholarly-inference",
    sourceIds: ["deuteronomy-34", "mesha-stela-odyssey"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-paul-antioch",
    sceneIds: ["paul-antioch"],
    eventIds: ["pauls-conversion"],
    journeyIds: ["paul1"],
    region: "Antioch on the Orontes, Roman Syria",
    periodLabel: "Mid-first century CE",
    displayYear: 46,
    chronologyNote:
      "Acts places the sending after a famine-relief visit. Absolute years in this application are approximate display chronology, not a proven consular date.",
    narrative:
      "Antioch was not a quiet church basement. It was one of the great cities of the eastern Roman world, a Seleucid foundation on the Orontes with access to the sea at Seleucia. Jews had lived there for centuries; Josephus claims civic privileges going back to Seleucus I. Greeks, Syrians, and Romans shared streets, crafts, and cults. Acts says the disciples were first called Christians here, and that the church sent Barnabas and Saul. The conversion on the Damascus road is a different geography; the mission begins in this mixed city.",
    beats: [
      {
        kind: "people",
        claimKind: "contemporary-text",
        text: "Josephus describes a substantial Jewish community in Antioch. Acts names a mixed leadership (including Simeon called Niger, Lucius of Cyrene, Manaen) around a congregation that already included Gentiles.",
      },
      {
        kind: "movement",
        claimKind: "scholarly-inference",
        text: "Roads ran south toward Palestine and west toward the ports. Greek was the urban shared language; Aramaic remained common in the Syrian countryside.",
      },
      {
        kind: "power",
        claimKind: "contemporary-text",
        text: "Since 64/63 BCE Syria had been a Roman province. Antioch was a seat of imperial administration, not a free-floating holy city.",
      },
    ],
    change:
      "From a Jewish movement centered on Jerusalem toward a congregation that commissions travel across the Greek-speaking eastern Mediterranean.",
    uncertainty:
      "No first-century synagogue building has been excavated at Antioch. Population figures circulating in modern handbooks are estimates and are not used here.",
    confidence: "scholarly-inference",
    sourceIds: ["acts-11-26", "acts-13-14", "strabo-geography-16", "josephus-ant-12"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-paul-cyprus",
    sceneIds: ["paul-cyprus"],
    eventIds: [],
    journeyIds: ["paul1"],
    region: "Cyprus, a Roman province in the eastern sea",
    periodLabel: "First missionary crossing",
    displayYear: 46,
    narrative:
      "Cyprus sits in the shipping lanes that tied Syria, Asia Minor, and the Aegean. Acts takes Barnabas (a Cypriot) and Saul across to Salamis and then to Paphos, where a proconsul named Sergius Paulus hears them. A Roman province was administered by a governor, not a client king. The island's Jewish communities and its pagan civic cults shared the same ports. We fly because the story moves by sea; we do not rebuild the praetorium.",
    beats: [
      {
        kind: "power",
        claimKind: "biblical-text",
        text: "Acts 13:7 names Sergius Paulus as proconsul (anthypatos), the title of a senatorial governor. Strabo, writing in the early first century, treats Cyprus as a Roman province (he calls it praetorian). Linking the named man to a particular inscription remains debated and is not treated as proven here.",
      },
      {
        kind: "movement",
        claimKind: "scholarly-inference",
        text: "Eastern Mediterranean travel in this period was seasonal, coastal, and commercial. An island stop is a human network, not a miracle of logistics.",
      },
    ],
    change:
      "The mission leaves a continental metropolis for an island on Rome's sea roads.",
    uncertainty:
      "Inscriptions naming Sergii Paulli exist in the wider Roman world; identification with the Acts proconsul is not certain.",
    confidence: "scholarly-inference",
    sourceIds: ["acts-13-14", "strabo-cyprus-14-6"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-paul-pisidian",
    sceneIds: ["paul-pisidian"],
    eventIds: [],
    journeyIds: ["paul1"],
    region: "Pisidian Antioch (colonia Caesarea), Anatolian plateau",
    periodLabel: "Augustan colony in the mid-first century CE",
    displayYear: 47,
    narrative:
      "This Antioch is not the Syrian one. Augustus planted a veteran colony here in 25 BCE — colonia Caesarea — with settlers from Italy, a grid of streets, and an imperial sanctuary. It sat high on the plateau, a 'little Rome' in Phrygia-Pisidia, looking down toward the Via Sebaste. Acts takes Paul into the synagogue on the Sabbath, among Jews and God-fearers, then into an argument that will not stay inside one people. A Roman colony with a Jewish congregation is the whole point: empire and diaspora in the same town.",
    beats: [
      {
        kind: "power",
        claimKind: "contemporary-text",
        text: "Pliny lists colonia Caesarea among Pisidian communities. Archaeology (Michigan/Kelsey work) documents Augustan and Julio-Claudian public building, including imperial cult architecture.",
      },
      {
        kind: "religion",
        claimKind: "archaeological",
        text: "The extra-mural sanctuary of Men Askaenos shows a living local cult beside the colony's Roman temples. Jewish presence is attested by Acts; a later church is traditionally — not demonstrably — sited over a synagogue.",
      },
      {
        kind: "people",
        claimKind: "biblical-text",
        text: "Acts describes Jews, converts, and Gentiles in the same Sabbath audience. The colony's Latin veterans and the plateau's older Anatolian population are the civic world around that room.",
      },
    ],
    change:
      "From Cypriot ports to a highland Roman colony whose streets were laid for veterans and whose Sabbath gathering was a diaspora synagogue.",
    uncertainty:
      "No first-century synagogue fabric has been securely published at the site. Ramsay's identification of a later church with Paul's synagogue is a tradition of excavation, not a proven floor.",
    confidence: "scholarly-inference",
    sourceIds: ["acts-13-14", "pliny-nh-5", "gazda-pisidian-antioch", "bmcr-mitchell-antioch"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-paul-iconium",
    sceneIds: ["paul-iconium"],
    eventIds: [],
    journeyIds: ["paul1"],
    region: "Iconium, Lycaonian / Phrygian borderland",
    periodLabel: "First-century civic center on the plateau road",
    displayYear: 47,
    narrative:
      "Iconium (modern Konya) sat on the route that tied the Pisidian colony to Lycaonia. Acts 14:1–6 describes a synagogue, a divided city, and a plot that drives Paul and Barnabas on to Lystra and Derbe. The human fact is ordinary and sharp: a town where Jewish hearers, Greek-speaking Gentiles, and civic authorities share one street, and a message splits them.",
    beats: [
      {
        kind: "movement",
        claimKind: "biblical-text",
        text: "Acts treats Iconium as a stage on a land road, not a sea crossing — the mission is now walking the plateau.",
      },
      {
        kind: "people",
        claimKind: "biblical-text",
        text: "Jews and Greeks are both named as hearers. We should not reduce either group to a single reaction.",
      },
    ],
    uncertainty:
      "First-century urban layout at Iconium is poorly recovered compared with Pisidian Antioch. This beat stays close to Acts and to the road.",
    confidence: "biblical-text",
    sourceIds: ["acts-13-14"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-paul-lystra",
    sceneIds: ["paul-lystra"],
    eventIds: [],
    journeyIds: ["paul1"],
    region: "Lystra, Lycaonian country south of Iconium",
    periodLabel: "Roman colony among Lycaonian speakers",
    displayYear: 47,
    narrative:
      "Lystra was a Roman colony, but the crowd in Acts 14 does not shout in Latin. They cry out in Lycaonian that the gods have come down, naming Barnabas Zeus and Paul Hermes because he is the speaker. That is not rustic stupidity. It is a local religious world in which a father-god and a messenger-god were already paired, under Greek names, in the highlands. Inscriptions from the valley later dedicate Hermes in a Zeus context. Ovid's tale of gods in disguise is a Latin literary cousin set in Phrygia — a parallel scholars discuss, not a script the villagers are reciting.",
    beats: [
      {
        kind: "language",
        claimKind: "biblical-text",
        text: "Acts 14:11 is unusual in noting a local language. Educated civic life on the plateau used Greek; Lycaonian still belonged to native speech.",
      },
      {
        kind: "religion",
        claimKind: "archaeological",
        text: "Calder and later studies published Zeus–Hermes dedications near Lystra. They illuminate a local pairing. They are not a photograph of the priest of Zeus in Acts, and some stones are later than the first century.",
      },
      {
        kind: "people",
        claimKind: "scholarly-inference",
        text: "The colony's veterans, Greek-speakers, a Jewish household (Timothy's, in Acts 16), and Lycaonian-speaking country people shared one landscape. The crowd's theology fails; they remain people with a cult, not a caricature.",
      },
    ],
    change:
      "From a Roman colony's synagogue argument to a highland crowd whose first language is not Greek and whose gods already travel in pairs.",
    uncertainty:
      "The surviving Zeus/Hermes inscriptions are not all first-century. Ovid does not name Lystra. We use them as regional religious context, not as a reconstruction of the sacrifice at the gate.",
    confidence: "scholarly-inference",
    sourceIds: ["acts-13-14", "calder-lystra-zeus", "nts-lystra", "ovid-met-8"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-jesus-nazareth",
    sceneIds: ["jesus-nazareth"],
    eventIds: ["birth-of-jesus"],
    journeyIds: ["jesus_ministry"],
    region: "Nazareth, Lower Galilee",
    periodLabel: "Early first century CE, tetrarchy of Herod Antipas",
    displayYear: 27,
    chronologyNote:
      "Ministry years in this journey are conventional display dates. Birth at Bethlehem is a separate place in the Gospels; this beat is the hometown of the adult ministry.",
    narrative:
      "Nazareth was a Jewish village in the hills of Lower Galilee, unmentioned in the Hebrew Bible, living under Herod Antipas, a client tetrarch of Rome. This is not empty countryside waiting for a story. It is a Jewish world of households, kinship, Sabbath, and the pull of larger towns. Luke has the adult Jesus rejected here. The nativity image this journey may show is Paduan, not Galilean — reception history, not a house plan.",
    beats: [
      {
        kind: "power",
        claimKind: "contemporary-text",
        text: "Galilee after Herod the Great belonged to Antipas (4 BCE–39 CE), a client tetrarch of Rome, according to Josephus. Local life ran through village elders and, on feast days, toward Jerusalem.",
      },
      {
        kind: "language",
        claimKind: "scholarly-inference",
        text: "Aramaic is widely reconstructed as the spoken language of Galilean Jews; Hebrew belonged to Scripture and liturgy; Greek was present in the wider urban network. That map is inference, not a surviving street sign.",
      },
      {
        kind: "religion",
        claimKind: "biblical-text",
        text: "The Gospels place Jesus in synagogues and in debate within Judaism. First-century Jews are the living religious world of this scene, not scenery for a later church.",
      },
    ],
    uncertainty:
      "First-century Nazareth is archaeologically modest. We do not invent a population figure or a street grid. Bethlehem remains a different place on this map.",
    confidence: "scholarly-inference",
    sourceIds: ["luke-4-8", "josephus-ant-17-188", "bible-odyssey-antipas"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-jesus-capernaum",
    sceneIds: ["jesus-capernaum"],
    eventIds: [],
    journeyIds: ["jesus_ministry"],
    region: "Capernaum, north shore of the Sea of Galilee",
    periodLabel: "Jewish fishing village, early Roman Galilee",
    displayYear: 27,
    narrative:
      "Capernaum (Kfar Nahum) sat on the lake's north shore, a Jewish village of basalt houses in insulae, with fishing, some farming, and traffic along the shore road toward the Jordan and Damascus. The Gospels make it a ministry base: a synagogue, a tax booth at the frontier of Antipas's territory, a centurion, and the homes of fishers. The white limestone synagogue visitors see today is later — fourth or fifth century. Under it, Franciscan excavators found a basalt pavement from an earlier public building. That earlier floor is a candidate, not a captioned 'synagogue of Jesus.'",
    beats: [
      {
        kind: "daily-life",
        claimKind: "archaeological",
        text: "Excavated houses are clustered basalt rooms around courtyards. Occupations in the Gospels and the setting match a lakeside working village, not an aristocratic city.",
      },
      {
        kind: "evidence",
        claimKind: "archaeological",
        text: "Studium Biblicum Franciscanum (Corbo, Loffreda): the standing synagogue is late. A first-century pavement beneath the nave may belong to a public building; identification remains open.",
      },
      {
        kind: "power",
        claimKind: "scholarly-inference",
        text: "A lakeside tax booth in the Gospels sits on a frontier of Antipas's Galilee. The Gentile 'centurion' of Matthew 8 / Luke 7 is widely read as an officer in Antipas's forces, not as proof of a Roman garrison. Permanent Roman troops are not securely attested in Galilee until later.",
      },
    ],
    change:
      "From a hill village (Nazareth) to a lakeside working town where fish, taxes, and Sabbath assembly meet.",
    uncertainty:
      "The first-century synagogue of the Gospels has not been identified with certainty. Traditional 'house of Peter' claims combine archaeology with later Christian memory and should be read as tradition layered on a real village, not as a labeled first-century door.",
    confidence: "archaeological",
    sourceIds: ["luke-4-8", "custodia-capernaum", "bar-jesus-synagogue", "bible-odyssey-capernaum"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-jesus-galilee",
    sceneIds: ["jesus-galilee"],
    eventIds: [],
    journeyIds: ["jesus_ministry"],
    region: "Sea of Galilee (Lake Kinneret)",
    periodLabel: "A working lake in the early Roman period",
    displayYear: 28,
    narrative:
      "The lake was a workplace. Magdala, just west along the shore, was known in Greek as Taricheae — the place where fish are salted. Strabo praises its pickled fish. Israel Antiquities Authority and Franciscan work have uncovered a first-century synagogue, shops, and harbor remains there. Other harbors ringed the Kinneret. When the Gospels put fishers in boats, they are describing a regional economy, not a pastoral metaphor. Storms on this lake are still a fact of wind over water in a basin.",
    beats: [
      {
        kind: "daily-life",
        claimKind: "contemporary-text",
        text: "Strabo (Geography 16.2.45) says Taricheae supplies excellent fish for pickling. Josephus later treats the town as a Jewish center on the western shore.",
      },
      {
        kind: "evidence",
        claimKind: "archaeological",
        text: "Magdala's Early Roman synagogue (IAA, Avshalom-Gorni and Najar) is among the securely first-century synagogue buildings of the region — a material counterpart to the Gospel picture of Sabbath assembly near the lake.",
      },
      {
        kind: "movement",
        claimKind: "archaeological",
        text: "Harbors and a shore road tied villages together. Travel here is boat, foot, and pack, inside a small sea, not an empire-crossing voyage.",
      },
    ],
    change:
      "The camera pulls from a single village to the lake as a shared human system — work, weather, and neighboring towns.",
    uncertainty:
      "We do not assign a Gospel storm to a modern wind log. Magdala is evidence of the lake economy; it is not automatically the unnamed shoreline of every pericope.",
    confidence: "archaeological",
    sourceIds: ["luke-4-8", "strabo-geography-16", "iaa-magdala-atiqot"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-jesus-caesarea-philippi",
    sceneIds: ["jesus-caesarea-philippi"],
    eventIds: [],
    journeyIds: ["jesus_ministry"],
    region: "Caesarea Philippi (Panias / Banias), Jordan headwaters",
    periodLabel: "Herodian city beside a sanctuary of Pan",
    displayYear: 29,
    narrative:
      "At the springs of the Jordan a Hellenistic shrine of Pan (the Panion) had stood since the third century BCE. Herod built a temple to Augustus here. His son Philip founded a city in 2/1 BCE and named it Caesarea — Caesarea Philippi in the Gospels, Paneas in other sources. This is not Galilean village Judaism. It is a Herodian-Roman capital at a pagan grotto, on the edge of Philip's tetrarchy, where imperial loyalty, Greek cult, and the landscape of the spring meet. Matthew and Mark place Peter's confession here. The contrast is the point: a claim about Israel's Messiah spoken at a city named for Caesar, beside a cave of Pan.",
    beats: [
      {
        kind: "religion",
        claimKind: "archaeological",
        text: "Andrea Berlin's study of the Pan sanctuary traces a rural shrine that becomes the urban cult of Philip's city. Niches, courts, and later temples accumulated on the cliff.",
      },
      {
        kind: "power",
        claimKind: "contemporary-text",
        text: "Josephus: Philip founded Caesarea at Panias and named it after Caesar. The Gospels' place-name is a political sentence — a Herodian city honoring Augustus.",
      },
      {
        kind: "people",
        claimKind: "scholarly-inference",
        text: "The city's population mixed the cult's older local worshippers with the new urban foundation. Jews and pagans both belonged to the wider Herodian north; neither group is a foil invented by the camera.",
      },
    ],
    change:
      "From Jewish lakeside Galilee under Antipas to a Herodian city at a Greek sanctuary, still inside the family's client-king world, now named for the emperor.",
    uncertainty:
      "The Gospel writers do not describe the Pan cave. We place the confession in the city's landscape because they name the city, not because a pulpit has been excavated.",
    confidence: "archaeological",
    sourceIds: ["matthew-16-17", "bible-odyssey-caesarea-philippi", "berlin-pan-sanctuary", "josephus-ant-18-philip"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
  {
    id: "world-jesus-transfiguration",
    sceneIds: ["jesus-transfiguration"],
    eventIds: ["transfiguration"],
    journeyIds: ["jesus_ministry"],
    region: "An unnamed high mountain in the Gospel narrative",
    periodLabel: "Immediately after Caesarea Philippi in Matthew and Mark",
    displayYear: 29,
    narrative:
      "The Gospels do not name the mountain. Christian pilgrimage from late antiquity favored Tabor; some modern scholars, following the narrative sequence after Caesarea Philippi, argue for Hermon. This product does not settle it. The human content is not a peak but a pattern: a small group climbs, sees glory, and is sent back down toward the same disputed, occupied land.",
    beats: [
      {
        kind: "religion",
        claimKind: "biblical-text",
        text: "The scene is told with Moses and Elijah present and a voice from a cloud — a Jewish theophany pattern, not a Greco-Roman epiphany at Pan's cave.",
      },
      {
        kind: "evidence",
        claimKind: "traditional",
        text: "Tabor is a traditional Christian identification. Hermon is a geographic inference from the preceding scene. Neither is labeled in the text.",
      },
    ],
    uncertainty:
      "No approved artwork is attached, on purpose. The unnamed mountain is left unnamed. Traditional Tabor and argued Hermon both remain possibilities.",
    confidence: "disputed",
    sourceIds: ["matthew-16-17"],
    reviewStatus: "approved",
    reviewedBy: "biblemap-editorial",
  },
];

const byId = new Map(HISTORICAL_CONTEXTS.map((context) => [context.id, context]));
const byScene = new Map<string, HistoricalContext>();
const byEvent = new Map<string, HistoricalContext>();

for (const context of HISTORICAL_CONTEXTS) {
  const result = validateHistoricalContext(context);
  if (!result.ok) {
    throw new Error(`Historical context "${context.id}" invalid:\n${result.errors.join("\n")}`);
  }
  for (const sourceId of context.sourceIds) {
    if (!historicalSourceById(sourceId)) {
      throw new Error(`Historical context "${context.id}" references unknown source "${sourceId}"`);
    }
  }
  for (const sceneId of context.sceneIds) {
    if (byScene.has(sceneId)) {
      throw new Error(`Scene "${sceneId}" is claimed by more than one context`);
    }
    byScene.set(sceneId, context);
  }
  for (const eventId of context.eventIds) {
    if (!byEvent.has(eventId)) byEvent.set(eventId, context);
  }
}

/** Authored journey scenes that this milestone is required to cover. */
const REQUIRED_JOURNEY_SCENES = [
  "exodus-egypt",
  "exodus-sea",
  "exodus-sinai",
  "exodus-kadesh",
  "exodus-moab",
  "paul-antioch",
  "paul-cyprus",
  "paul-pisidian",
  "paul-iconium",
  "paul-lystra",
  "jesus-nazareth",
  "jesus-capernaum",
  "jesus-galilee",
  "jesus-caesarea-philippi",
  "jesus-transfiguration",
] as const;

for (const sceneId of REQUIRED_JOURNEY_SCENES) {
  const context = byScene.get(sceneId);
  if (!context || !isProductionReadyContext(context)) {
    throw new Error(`Journey scene "${sceneId}" lacks an approved historical context`);
  }
}

export function historicalContextById(id: string | undefined | null): HistoricalContext | null {
  if (!id) return null;
  const context = byId.get(id);
  return context && isProductionReadyContext(context) ? context : null;
}

export function historicalContextForScene(sceneId: string | undefined | null): HistoricalContext | null {
  if (!sceneId) return null;
  const context = byScene.get(sceneId);
  return context && isProductionReadyContext(context) ? context : null;
}

export function historicalContextForEvent(eventId: string | undefined | null): HistoricalContext | null {
  if (!eventId) return null;
  const context = byEvent.get(eventId);
  return context && isProductionReadyContext(context) ? context : null;
}

export function historicalContextForBeat(beat: {
  contextId?: string;
  sceneId?: string;
  eventId?: string;
}): HistoricalContext | null {
  return (
    historicalContextById(beat.contextId) ??
    historicalContextForScene(beat.sceneId) ??
    historicalContextForEvent(beat.eventId)
  );
}
