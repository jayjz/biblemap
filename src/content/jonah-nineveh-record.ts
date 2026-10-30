/** Documentary study for the opt-in, no-index reader. No human approval implied.
 * Original edition reopened 2026-10-30; see docs/research/jonah-human-sources.md.
 * Adapted documentary text: CC BY-SA 3.0, following the ORACC edition.
 */
export const NINEVEH_RECORD = {
  id: 'saa6-142',
  review: { status: 'draft', reviewedBy: null },
  date: '692 BCE',
  identifier: 'SAA 6 142 / P335268 / K.294',
  source: {
    id: 'oracc-saa6-142',
    title: 'An Egyptian Scribe Buys a House in Nineveh',
    url: 'https://oracc.museum.upenn.edu/saao/saa06/P335268/html',
    editors: 'Theodore Kwasman and Simo Parpola, State Archives of Assyria 6 (1991); annotation by Melanie Groß (2010–11).',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    objectUrl: 'https://cdli.earth/artifacts/335268',
    dateLocator: 'Edge 1–2; edition heading: 692-III-16',
    accessed: '2026-10-30',
  },
  owner: { name: 'Amat-Su’la', role: 'One of three named owners', locator: 'Obverse 1–5' },
  buyer: { name: 'Ṣilli-Aššur', role: 'Buyer, described as an Egyptian scribe', locator: 'Obverse 11–13; reverse 1–3' },
  transfer: [
    { id: 'owners', title: 'Three owners', text: 'Šarru-lu-dari, Atar-suru and Amat-Su’la sell the property.', locator: 'Obverse 1–5; reverse 1–3' },
    { id: 'property', title: 'Beams, doors, a yard', text: 'The sale includes the built house and these parts of it.', locator: 'Obverse 6–10' },
    { id: 'boundaries', title: 'Two houses and a street', text: 'The adjoining properties are named for Mannu-ki-ahhe and Ilu-issiya. The street is also a boundary.', locator: 'Obverse 6–10' },
    { id: 'payment', title: 'A payment in silver', text: 'The price is one mina by the king’s standard. The document records payment in full.', locator: 'Obverse 11–13; reverse 4–6' },
    { id: 'witnesses', title: 'People who witnessed', text: 'The witnesses include Rasu’, a chief boatman, and Nabû-duru-uṣur, a horse raiser.', locator: 'Reverse 14–15' },
  ],
  limitation: 'A seventh-century legal record, not an account of Jonah or evidence of the city’s repentance. Its court-connected parties do not represent everyone in Nineveh.',
} as const;

export const NINEVEH_READING = {
  status: 'draft', reviewedBy: null,
  title: 'What did God see?',
  tradition: 'Rabbinic Jewish interpretation',
  locator: 'Babylonian Talmud, Taanit 16a:10',
  url: 'https://www.sefaria.org/Taanit.16a.10?lang=bi',
  paraphrase: 'This discussion of public fasting attends to Jonah 3:10: the decisive change is in the people’s deeds, rather than sackcloth and fasting alone.',
  limitation: 'A later interpretation of the verse, not a record from ancient Nineveh. Study paraphrase; no translated quotation is reproduced.',
} as const;
