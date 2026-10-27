/** Source-led draft for the no-index Jonah reader. No human editorial approval. */
interface InquirySource {
  id: string;
  kind: 'biblical-text' | 'historical-document' | 'theological-interpretation' | 'object-record';
  title: string;
  author: string;
  url: string;
  locator: string;
  accessed: string;
  edition: string;
  rights: string;
  limitation: string;
  evidence: 'SUPPORTED';
}

export const HUMAN_CITY_REVIEW = { status: 'draft', reviewedBy: null, sceneId: 'jonah-4-question', reference: '4:11' } as const;

export const HUMAN_CITY_SOURCES = {
  scripture: {
    id: 'jonah-411-web', kind: 'biblical-text', title: 'Jonah 4 · World English Bible',
    author: 'World English Bible translators', url: 'https://ebible.org/engwebp/JON04.htm',
    locator: 'Jonah 4:5–11; surrounding chapter 4', accessed: '2026-10-27',
    edition: 'engwebp, pinned snapshot 2026-10-10', rights: 'Public domain. Unchanged text in the reader.',
    limitation: 'No reply by Jonah follows verse 11. The passage does not identify a king or date the visit.', evidence: 'SUPPORTED',
  },
  sale: {
    id: 'nineveh-saa6-142', kind: 'historical-document', title: 'ORACC · SAA 6 142 / P335268',
    author: 'Theodore Kwasman and Simo Parpola; annotated edition lemmatized by Melanie Groß',
    url: 'https://oracc.museum.upenn.edu/saao/saa06/P335268/html',
    locator: 'Obverse 1–13; reverse 1–17; edge 1–3. Date: 692-III-16.', accessed: '2026-10-27',
    edition: 'Legal Transactions of the Royal Court of Nineveh, Part I, State Archives of Assyria 6 (1991); ORACC annotation, 2010–11.',
    rights: 'Adapted from the ORACC annotated edition, CC BY-SA 3.0. These documentary paraphrases are shared under the same license.',
    limitation: 'A seventh-century record, distinct from Jonah’s traditional eighth-century setting. It does not attest his visit or identify his audience. This court-linked archive is not a census of city life.', evidence: 'SUPPORTED',
  },
  object: {
    id: 'nineveh-cdli-p335268', kind: 'object-record', title: 'CDLI · the clay tablet P335268',
    author: 'Cuneiform Digital Library Initiative', url: 'https://cdli.earth/artifacts/335268',
    locator: 'Physical information; Collections; External resources; Photo rights', accessed: '2026-10-27',
    edition: 'ADD 0324 / P335268; British Museum K 00294 (K.294); Akkadian legal clay tablet from Nineveh/Kuyunjik.',
    rights: 'Photo © Trustees of the British Museum, CC BY-NC-SA 4.0. Not reproduced in BibleMap.',
    limitation: 'Cross-identifies the same tablet as SAA 6 142. It is not an independent witness to a second transaction.', evidence: 'SUPPORTED',
  },
  rashi: {
    id: 'jonah-411-rashi', kind: 'theological-interpretation', title: 'Rashi · Commentary on Jonah 4:11',
    author: 'Solomon ben Isaac (Rashi)', url: 'https://www.sefaria.org/Rashi_on_Jonah.4.11',
    locator: 'Jonah 4:11, comments 1–2', accessed: '2026-10-27',
    edition: 'Sefaria Vocalized Edition, Hebrew; compared with ALHaTorah Mikraot Gedolot, Yonah 4:11, Rashi. A. J. Rosenberg’s Judaica Press English was consulted, not reproduced.',
    rights: 'Sefaria Hebrew: CC0. Rosenberg English listed CC-BY without license version. The English here is an original study paraphrase, not a quotation.',
    limitation: 'A medieval interpretation. It does not settle the biblical author’s intended referents. Human editorial review is pending.', evidence: 'SUPPORTED',
  },
  radak: {
    id: 'jonah-411-radak', kind: 'theological-interpretation', title: 'Radak · Commentary on Jonah 4:11',
    author: 'David Kimhi (Radak)', url: 'https://www.sefaria.org/Radak_on_Jonah.4.11.3',
    locator: 'Jonah 4:11, comment 3, beginning אשר לא ידע', accessed: '2026-10-27',
    edition: 'Sefaria, Radak on Nach, Hebrew. Core reading compared with Hebrew and English on ALHaTorah Mikraot Gedolot, Yonah 4:11, Radak.',
    rights: 'Sefaria electronic Hebrew license unknown; no English at this passage. ALHaTorah English translator and reuse rights unresolved. Neither translation nor substantial Hebrew is reproduced.',
    limitation: 'The English here is an original study paraphrase. Specialist translation approval remains unresolved; no approved English quotation is supplied.', evidence: 'SUPPORTED',
  },
} as const satisfies Record<string, InquirySource>;

export const HUMAN_CITY_DOCUMENT = {
  id: 'nineveh-house-sale-692', sourceId: 'sale', date: '692 BCE', identifier: 'SAA 6 142 · P335268 · K.294',
  title: 'A house sale in Nineveh',
  owners: 'Šarru-lu-dari, Atar-suru and Amat-Su’la',
  buyer: 'Ṣilli-Aššur', buyerRole: 'Identified in the document as an Egyptian scribe',
  nameInThreshold: 'Amat-Su’la', nameRole: 'One of the named owners',
  details: [
    { id: 'property', title: 'The property', text: 'A built house, with beams, doors and a yard, in Nineveh.', locator: 'Obverse 6–10' },
    { id: 'neighbors', title: 'The boundaries', text: 'The houses of Mannu-ki-ahhe and Ilu-issiya, and the street.', locator: 'Obverse 6–10' },
    { id: 'payment', title: 'The transaction', text: 'One mina of silver, by the king’s standard. The payment is recorded as complete.', locator: 'Obverse 11–13; reverse 1–6' },
    { id: 'witnesses', title: 'The witnesses', text: 'The list includes a king’s brother-in-law, chief boatmen and a horse raiser.', locator: 'Reverse 12–17' },
  ],
} as const;

export const HUMAN_CITY_VOICES = [
  { id: 'rashi', author: 'Rashi', name: 'Solomon ben Isaac', era: '1040–1105', tradition: 'Medieval Jewish interpretation',
    title: 'A figurative reading',
    reading: 'Rashi identifies those who cannot distinguish right from left as children. He reads “many beasts” as adults who do not recognize their Creator.',
    concern: 'His explanation brings the adults, as well as the children, into the description of the city.',
  },
  { id: 'radak', author: 'Radak', name: 'David Kimhi', era: 'c. 1160–1235', tradition: 'Medieval Jewish interpretation',
    title: 'A literal reading',
    reading: 'Radak also identifies children. He includes literal animals, which have neither punishment nor merit, among those for whom pity is fitting.',
    concern: 'He connects the children’s reprieve with their parents’ repentance, and explicitly extends pity to the animals.',
  },
] as const;

export const HUMAN_CITY_COMPARISON_URL = 'https://mg.alhatorah.org/Full/Yonah/4.11';
