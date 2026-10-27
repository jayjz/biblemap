import test from 'node:test';
import assert from 'node:assert/strict';
import { humanCityPanel } from './human-city.ts';
import { HUMAN_CITY_DOCUMENT, HUMAN_CITY_REVIEW, HUMAN_CITY_SOURCES, HUMAN_CITY_VOICES } from '../content/jonah-human-city.ts';

test('human-city deep links only open allowlisted discoveries at the final scene', () => {
  assert.equal(humanCityPanel('?utm_source=review&jonah411=house', '#jonah-4-question'), 'house');
  assert.equal(humanCityPanel('?jonah411=voices', '#jonah-4-question'), 'voices');
  for (const search of ['', '?jonah411=unknown', '?jonah411=%3Cscript%3E']) assert.equal(humanCityPanel(search, '#jonah-4-question'), null);
  assert.equal(humanCityPanel('?jonah411=house', '#jonah-4-shade'), null);
});

test('documentary and theological evidence retain locators, rights, limits and draft status', () => {
  const sources = Object.values(HUMAN_CITY_SOURCES);
  assert.equal(new Set(sources.map(source => source.id)).size, sources.length);
  for (const source of sources) {
    assert.equal(new URL(source.url).protocol, 'https:');
    for (const key of ['author', 'locator', 'edition', 'rights', 'limitation', 'accessed'] as const) assert.ok(source[key].trim(), `${source.id}: ${key}`);
  }
  assert.equal(HUMAN_CITY_REVIEW.status, 'draft');
  assert.equal(HUMAN_CITY_REVIEW.reviewedBy, null);
  assert.equal(HUMAN_CITY_DOCUMENT.date, '692 BCE');
  assert.match(HUMAN_CITY_SOURCES.sale.limitation, /distinct from Jonah’s traditional eighth-century/);
  assert.match(HUMAN_CITY_SOURCES.object.rights, /Not reproduced/);
  for (const voice of HUMAN_CITY_VOICES) assert.equal(HUMAN_CITY_SOURCES[voice.id].kind, 'theological-interpretation');
  assert.match(HUMAN_CITY_SOURCES.radak.limitation, /unresolved/);
});
