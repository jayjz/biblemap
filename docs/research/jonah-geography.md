# Jonah — geography archive

Retrieval date: **2026-10-10**. Research baseline: `feat/jonah-reader` at `bd0d948ecee642f6adfc89a9c380b95290ee1e3b`.

No itinerary is reconstructed. No sailing date is given. Coordinates appear only for places an opened gazetteer or excavation page actually locates, and they are labeled as locations of those sites, not of Jonah's ship or of a disputed city.

Categories:

1. Named by Scripture
2. Independently attested historical place
3. Disputed identification
4. Artistic or narrative reconstruction, including ancient retellings that add a route

## Purpose and scope

Separate Joppa, Tarshish, Nineveh, Assyria, and the Mediterranean crossing into those four kinds of statement. The reader prototype already refuses invented coordinates. This note is the evidence file behind that refusal. Interpretation of the flight and of 4:11 is in [jonah-theology.md](jonah-theology.md). Exact lines are in [jonah-quotations.md](jonah-quotations.md).

## Compact findings

| Place or claim | Cat. | What an opened source supports | What it does not support | Source opened |
|---|---|---|---|---|
| Joppa as the port where Jonah finds a ship for Tarshish | 1 | WEB Jonah 1:3, pinned in the repo. He goes down to Joppa, finds a ship going to Tarshish, pays the fare, goes down into it. | No quay, season, heading, or harbor plan | Pinned `web-jonah-1.json`; [eBible JON01](https://ebible.org/engwebp/JON01.htm) is the stated source of that snapshot |
| Tel Yafo / ancient Jaffa | 2 | A real mound on the south side of Tel Aviv, about 60 km northwest of Jerusalem. JCHP gives **32°01′ N, 34°45′ E** for **the tell** (map reference 162.127), about 3 ha, on a kurkar ridge more than 30 m above sea level. | Not the spot Jonah boarded | [JCHP site page](http://jaffa.nelc.ucla.edu/site.html) |
| Same city in a classical gazetteer | 2 | Pleiades 687931, "Ioppe (Jaffa) is an ancient port city in Iudaea." Representative point **32.053079 N, 34.7499295 E** (JSON order is longitude, latitude: `[34.7499295, 32.053079]`). Names include Ioppe, Yafo, Jaffa, Japho. | Not a more precise point than the gazetteer's representative point. It does not match JCHP's minute-level figure exactly (see below). | [Pleiades 687931 JSON](https://pleiades.stoa.org/places/687931/json), fetched 2026-10-10. Data license CC BY 3.0 |
| Ancient harbor of Jaffa | 3 | JCHP's Ioppa Maritima project is trying to **locate** it, "which is thought to lie to the east of Jaffa," using cores and a remote vehicle. | A known quay. The page does not mention Jonah. | [Ioppa Maritima](http://jaffa.nelc.ucla.edu/research/ioppa_maritima.html) |
| Tarshish in Jonah | 1 and 3 | A destination reached by ship from Joppa (Jonah 1:3). Ezekiel 27:12, WEB: Tarshish traded with Tyre in silver, iron, tin, and lead. | A determined map point. The verse does not say "west." | [JON01](https://ebible.org/engwebp/JON01.htm); [EZK27](https://ebible.org/engwebp/EZK27.htm) |
| Tarshish = Tarsus | 3 | Josephus says Jonah sailed "to Tarsus, in Cilicia" (Q11). Ibn Ezra reports "the gaon" saying Tarshish is Tarsus (Q12). | The Hebrew text of Jonah. An excavation that proves the names are the same. | Perseus; Sefaria Hebrew |
| Tarshish = Tunis | 3 | Ibn Ezra reports Rabbi Mevasser: Tunis in Africa. | A demonstration | Sefaria Hebrew |
| Tartessos as a classical place | 2 for the Greek toponym; 3 if equated with Tarshish | Herodotus 4.152 (Godley, Perseus): a Samian ship, driven through the Pillars of Heracles, "came providentially to Tartessus," then "an untapped market." | Any mention of Tarshish, Jonah, or Phoenician scripture. Herodotus does not make the biblical identification. | [Perseus Herodotus 4.152](https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0126:book=4:chapter=152) |
| Pleiades "Tartessos" | 3, and easy to misuse | Place [261259](https://pleiades.stoa.org/places/261259) is an **unlocated river** ("Tartessos fl."), "known only from Avienus." | A coordinate for biblical Tarshish, or even a secure point for the city Strabo describes | Pleiades page as indexed 2026-10-10 |
| Nineveh the city | 2 | Pleiades 874621, "Nineveh/Ninos": on the eastern edge of the Tigris flood plain, opposite modern Mosul. Representative point **36.360762 N, 43.159937 E** (JSON `[43.159936889690734, 36.36076152375775]`). Capital from **704 B.C.** under Sennacherib until destroyed in **612 B.C.** Visible remains: Kuyunjik, Nebi Yunus, and a wall about **twelve kilometers** long. | A date for the book of Jonah. A tomb of the prophet. | [Pleiades 874621 JSON](https://pleiades.stoa.org/places/874621/json) |
| Nineveh in the British Museum | 2 | "Capital of the powerful ancient Assyrian empire, located in modern-day northern Iraq." Sennacherib, **704–681 BC**. Southwest Palace reliefs in Room 9. | Jonah, a population figure, or a latitude | [BM gallery](https://www.britishmuseum.org/collection/galleries/assyria-nineveh) |
| "Three days' journey" and the measured city | 1 against 2 | WEB Jonah 3, opened: Nineveh is a "great city, three days' journey across," and Jonah walks "a day's journey." Julia M. O'Brien, Bible Odyssey: at its greatest extent Nineveh "was 3 miles in width and 7 miles in circumference, far smaller than suggested by Jonah 2." She dates the capital **705–612 B.C.E.** | A settled measurement (Pleiades says a twelve-kilometer wall, about 7.5 miles; O'Brien says 7 miles around and cites **Jonah 2**, which is the psalm in the fish, not 3:3). No choice is made here. | [JON03](https://ebible.org/engwebp/JON03.htm); [Bible Odyssey](https://www.bibleodyssey.org/articles/nineveh/) |
| 120,000 who cannot tell right from left | 1 | WEB 4:11. The verse does not say whether this is children, the whole population, or a moral description. | A census of excavated Nineveh | [JON04](https://ebible.org/engwebp/JON04.htm) |
| Jonah son of Amittai under Jeroboam II | 1 | WEB 2 Kings 14:25: Jeroboam "restored the border of Israel from the entrance of Hamath to the sea of the Arabah, according to the LORD, the God of Israel's word, which he spoke by his servant Jonah the son of Amittai, the prophet, who was from Gath Hepher." | A date for a voyage to Nineveh, and a date for when Nineveh had a twelve-kilometer wall | [2KI14](https://ebible.org/engwebp/2KI14.htm) |
| Josephus's route | 4 | Joppa to Tarsus; the fish casts him up on the Euxine; then he walks to Nineveh and leaves. | The book of Jonah, which does not name Tarsus or the Black Sea | Perseus, Whiston 9.10.2 |
| Nimrud / Kalhu | 2, contextual | Met *lamassu* 32.143.1: Assyrian, Nimrud (ancient Kalhu), ca. 883–859 BCE, Ashurnasirpal II's palace. | Nineveh. Jonah. | [Met 32.143.1](https://www.metmuseum.org/art/collection/search/322608) |
| Phoenician trade as a general pattern | 2 for the trade; 4 if drawn as Jonah's track | Not used. A Met essay on Phoenicians was not opened in this pass. | A route from Joppa to Tarshish | — |

## Joppa

Scripture (category 1), WEB, pinned Jonah 1:3: he goes **down** to Joppa and **down** into a ship that is going to Tarshish. Joshua 19:46, 2 Chronicles 2:16, and Acts 9–10 also name the town. Those chapters were not re-copied in this pass; they are not needed to show that Jonah 1 names Joppa, and they were not treated as evidence for Jonah's berth.

The tell (category 2) is excavated. The Jaffa Cultural Heritage Project, a UCLA / Israel Antiquities Authority collaboration, locates **Tel Yafo** at 32°01′ N, 34°45′ E. The page describes the mound; it does not mention Jonah. Research excavations on the tell, including Jacob Kaplan's areas, are summarized at [the excavations page](http://jaffa.nelc.ucla.edu/research/excavations.html) (Kaplan's Area A from 1955–1974 and later JCHP seasons). That page likewise does not mention Jonah.

Pleiades' representative point for Ioppe is about two minutes of latitude farther north (32.053 N versus 32°01′ N). Both are published locations for the ancient city or its tell. They are not the same pin. Neither is a claim about where a hull was moored. Ioppa Maritima says the ancient harbor is only **thought** to lie east of Jaffa. Category 3 for the harbor; category 2 for the mound.

Do not draw a dot labeled "Jonah boards here."

## Tarshish

Category 1 is the name in Jonah 1:3 and the trade list in Ezekiel 27:12 (silver, iron, tin, lead). Category 3 is every modern or ancient attempt to point at a coast.

Opened, and still a dispute:

- **Tarsus.** Josephus, in so many words, sends the ship there. Ibn Ezra records the gaon saying the same, and records Rabbi Mevasser saying **Tunis** instead. Two medieval options in one Hebrew comment, plus a first-century retelling. That is the opposite of a settled identification.
- **Tartessos.** Herodotus 4.152 attests a far western market beyond the Pillars, reached by accident, rich for Greek traders. He does not mention Tarshish. Equating the names is a later scholarly habit. It was not re-proven from Herodotus, and it is not adopted here.
- **Pleiades 261259** must not be used as "the coordinates of Tartessos." The record is an unlocated river.

A "ships of Tarshish" phrase that might mean a kind of ship rather than a port (1 Kings 10:22 and parallels) was not opened verse by verse beyond Ezekiel 27:12. Do not decide that question from this file.

No coordinate for Tarshish is stated, because none was verified.

## Nineveh and Assyria

Category 2, from Pleiades' own description, fetched as JSON:

> This important Mesopotamian city flanks the eastern edge of the Tigris flood plain, opposite modern Mosul, of which it is now a suburb. … it was not until 704 B.C. that Nineveh became the administrative capital of Assyria when the Neo-Assyrian king Sennacherib moved the royal family and court there. … Nineveh remained Assyria’s capital until 612 B.C., when it was captured and destroyed by a Babylonian-Median coalition. … The visible remains of the (7th-century) Assyrian city include the citadel mound Kuyunjik, the smaller mound of Nebi Yunus, and the twelve-kilometer-long city wall.

The British Museum's current gallery page agrees on the region and on Sennacherib's dates (704–681 BC) and shows Southwest Palace reliefs in Room 9, including military campaigns and the moving of colossal guardian figures. It does not mention Jonah.

**Nebi Yunus** in that Pleiades sentence is the name of a mound. This pass did not open a report on the shrine, on 2014 damage, or on whether anyone was buried there. Those claims are a gap, not a finding. Calling the mound "Jonah's tomb" would be category 4.

**Kalhu / Nimrud** is a different Assyrian capital, ninth century, and the home of the Met *lamassu*. Using that sculpture as "Nineveh" would be a false place.

**The size problem is real and unresolved.** Scripture, in the WEB, calls Nineveh a great city of three days' journey and speaks of more than 120,000 people who cannot tell their right hand from their left. O'Brien, on a Society of Biblical Literature site, says the city at its greatest extent was about 3 by 7 miles and "far smaller than suggested by Jonah 2." Her verse number does not match the three-days sentence (that is 3:3; Jonah 2 is the prayer). Pleiades' twelve-kilometer wall is about seven and a half miles, close to her circumference but not the same sentence. None of these opened pages defines the 120,000. An editor can show the tension. An editor cannot pick a population.

**The date problem is also unresolved.** 2 Kings 14:25 attaches Jonah son of Amittai, from Gath Hepher, to Jeroboam II's restoration of Israel's border. Pleiades and the British Museum attach the great capital on the Tigris to Sennacherib, from 704 or, in O'Brien, 705, until 612. This file does not decide whether the book is set in the eighth century, looks back from later, or uses "Nineveh" as a literary city. It does not invent a year.

## The sea

Jonah 1:4–16, in the pinned chapter, is a storm: the sailors cry out, throw cargo overboard, cast lots, and are told by Jonah to throw him into the sea. That is category 1. A plotted track would be category 4.

Josephus's track — Joppa, Tarsus, storm, whale, Euxine shore, Nineveh — is his narrative. Whiston's footnote speculates about currents. The footnote is not evidence. The Euxine is not in the book of Jonah. Do not draw it.

Mediterranean trade in the early first millennium is real. This pass did not open a museum essay long enough to quote one, and would not have used it as Jonah's route even if it had. Ezekiel's metals list is a text about Tyre's trade partners, not a chart of this voyage.

## Coordinates, only as labeled

| Point | Numbers | Refers to | License / source |
|---|---|---|---|
| Tel Yafo | 32°01′ N, 34°45′ E | The archaeological mound, JCHP | [site page](http://jaffa.nelc.ucla.edu/site.html) |
| Ioppe representative point | 32.053079 N, 34.7499295 E | Pleiades' point for the ancient port city, not a harbor survey | [687931](https://pleiades.stoa.org/places/687931/json), CC BY 3.0 |
| Nineveh representative point | 36.360762 N, 43.159937 E | Pleiades' point for the ancient city opposite Mosul | [874621](https://pleiades.stoa.org/places/874621/json), CC BY 3.0 |

Tarshish, Tartessos-as-Tarshish, the Jaffa quay, the fish's path, and the Euxine landing have **no** coordinates in this archive.

## Copyright and reuse

Pleiades text and coordinates are CC BY 3.0 (Ancient World Mapping Center and ISAW). Attribution is required if the figures are republished. WEB verses are public domain. JCHP and Bible Odyssey pages were read for facts; their prose is not reprinted beyond the short phrases above. British Museum object photography is not cleared (see the artwork file).

## Editorial opportunities (nonbinding)

- Show Joppa as a known coast and a mound, and show the harbor as an open archaeological question (Ioppa Maritima's own wording).
- Show Nineveh as Kuyunjik and Nebi Yunus opposite Mosul, with the 704–612 capital dates visible, and with 2 Kings 14:25 visible beside them, unresolved.
- Refuse a Tarshish pin. If a note is needed, Q12 (Tarsus versus Tunis) plus Herodotus's Tartessus, clearly unlabeled as a decision, is enough.
- Do not illustrate "the route" with the Met *lamassu* and call it Nineveh. Nimrud is a different city. A Nineveh palace relief, if rights are ever cleared, is context for Assyria, not a picture of the prophet.
- Josephus can be a "another ancient telling" card. He should not be the base map.

## Gaps

- Strabo's description of a city called Tartessus was not opened. Herodotus was.
- The Nora Stone, lead-isotope arguments, Bochart, and the Jewish Encyclopedia's survey of Tarshish theories were not opened. They are real lines of research and are omitted rather than half-reported.
- A British Museum or UNESCO page stating the twelve-kilometer wall was not the page opened; the figure used here is Pleiades'. O'Brien's "7 miles" is a second, not identical, description.
- Nebi Yunus as a shrine, and reports of its modern destruction, were not opened.
- Gath Hepher was not given a coordinate.
- Phoenician navigation was not documented from a museum label in this pass.
- Acts, Joshua, and Chronicles were not re-quoted; they are not required for the Jonah 1 claim and were not used to locate the ship.
