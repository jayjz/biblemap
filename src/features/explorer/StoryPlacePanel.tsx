import Link from 'next/link';
import { DISCOVERY_SOURCES, type StoryPlace } from '@/content/jonah-discoveries';
import './story-place.css';

const returnScenes = ['jonah-1-escape', 'jonah-3-mercy', 'jonah-4-anger'] as const;
export function StoryPlacePanel({ place, from }: { place: StoryPlace; from: unknown }) {
  const returnScene = returnScenes.find(id => id === from) ?? place.returnScene;
  return <section className="story-place-panel" aria-labelledby="place-title" data-story-place={place.id}>
    <Link className="place-return" href={`/jonah/#${returnScene}`} prefetch={false}>← Return to the passage</Link>
    <p className="place-kicker">The world of Jonah</p><h1 id="place-title">{place.name}</h1><p className="place-location">{place.modernName}</p>
    <p>{place.introduction}</p><p>{place.geography}</p>
    {place.id === 'nineveh' && <>
      <h2>A city across time</h2>
      <ol className="place-timeline">
        <li><span>704 BCE</span><h3>An imperial capital</h3><p>Sennacherib makes Nineveh the Assyrian capital. Palace reliefs present a king’s world of building and conquest.</p></li>
        <li><span>Seventh century BCE</span><h3>A library in clay</h3><p>Ashurbanipal’s library brings together cuneiform texts. More than 30,000 tablets and fragments have been found in Nineveh’s ruins.</p></li>
        <li><span>612 BCE</span><h3>The capital falls</h3><p>A Babylonian–Median coalition captures Nineveh. The clay tablets preserve traces of its intellectual life.</p></li>
      </ol>
      <p className="place-uncertainty">This is the city’s history, not a date for Jonah’s visit. The book does not name its king; its relationship to these events remains uncertain.</p>
    </>}
    {place.id === 'joppa' && <p className="place-uncertainty">Tarshish is left unmarked: its identification is disputed. No voyage is reconstructed.</p>}
    <details><summary>Sources & map attribution</summary><p>City point from Pleiades, © the contributors, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0</a>. A representative location, not an exact event site.</p>
      <a href={DISCOVERY_SOURCES[place.sourceId].url} target="_blank" rel="noreferrer">{DISCOVERY_SOURCES[place.sourceId].title} ↗</a>
      {place.id === 'nineveh' && <><a href={DISCOVERY_SOURCES.empire.url} target="_blank" rel="noreferrer">{DISCOVERY_SOURCES.empire.title} ↗</a><a href={DISCOVERY_SOURCES.library.url} target="_blank" rel="noreferrer">{DISCOVERY_SOURCES.library.title} ↗</a></>}
    </details>
    <Link className="place-atlas" href="/explore/" prefetch={false}>Continue into the full atlas ↗</Link>
  </section>;
}
