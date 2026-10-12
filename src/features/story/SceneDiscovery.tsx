import Link from 'next/link';
import { DISCOVERY_SOURCES, storyPlaceHref } from '@/content/jonah-discoveries';
import { FirstEncounter } from './FirstEncounter';
import { AquinasMercyPerspective } from './AquinasMercyPerspective';

export function DiscoverySource({ id }: { id: keyof typeof DISCOVERY_SOURCES }) {
  const source = DISCOVERY_SOURCES[id];
  return <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>;
}

export function SceneDiscovery({ sceneId }: { sceneId: string }) {
  if (sceneId === 'jonah-1-escape') return <section className="scene-discovery discovery-flight" aria-label="Discover the flight">
    <div className="discovery-place"><p className="story-eyebrow">At the water’s edge</p><h3>A way out.</h3>
      <p>Joppa is the port of Jaffa, on the Mediterranean coast. Here, leaving becomes something Jonah can buy: passage on a ship.</p>
      <Link href={storyPlaceHref('joppa')} prefetch={false}>Find Joppa in the atlas <span aria-hidden="true">↗</span></Link>
      <details className="discovery-footnote"><summary>A place, without an invented route</summary><p>The city is identifiable; Tarshish’s location is disputed. The map marks Joppa and leaves the voyage unplotted.</p><DiscoverySource id="joppa" /></details>
    </div>
    <FirstEncounter sceneId={sceneId} />
  </section>;
  if (sceneId === 'jonah-3-mercy' || sceneId === 'jonah-4-anger') return <section className="scene-discovery discovery-mercy" aria-label="Discover mercy and anger">
    {sceneId === 'jonah-3-mercy' ? <div><p className="story-eyebrow">The world beyond the passage</p>
      <h3>More than a wicked city.</h3>
      <p>Nineveh was a real Assyrian city. Its later palaces displayed royal power and conquest; its scribes gathered a library of clay tablets. The people in this passage inhabit a world larger than a single verdict.</p>
    </div> : <div><AquinasMercyPerspective sceneId={sceneId} /></div>}
    <div className="discovery-world-door"><p className="story-eyebrow">Nineveh / Neo-Assyrian world</p><h4>A city of power.<br />A city of readers.</h4><p>Meet the city through its palaces and Ashurbanipal’s library.</p><Link href={storyPlaceHref('nineveh', sceneId)} prefetch={false}>Explore Nineveh <span aria-hidden="true">↗</span></Link><p className="discovery-caption">Seventh-century BCE context; Jonah’s visit is not dated here.</p>
      <details className="discovery-footnote"><summary>Follow the historical sources</summary><DiscoverySource id="empire" /><DiscoverySource id="library" /></details>
    </div>
  </section>;
  if (sceneId === 'jonah-4-shade') return <section className="scene-discovery discovery-shade" aria-label="Discover Jonah in marble">
    <div><p className="story-eyebrow">Looking across centuries / 280–290 CE</p><h3>The artist lets him rest.</h3><p>Look at the reclining body, the raised arm, the leaves overhead. This early Christian sculpture holds Jonah in the moment of shelter. The passage keeps moving: a worm, the heat, and another exchange with God.</p></div>
    <details className="shade-looking"><summary>Stay with the sculpture <span aria-hidden="true">＋</span></summary><div><h4>What can a still image hold?</h4><p>The marble gives lasting form to shade that disappears in the story. Set its resting figure beside the anger in the passage. What changes when you look back at the sculpture?</p><p className="discovery-caption">A visual reading of this artwork, not a claim about its maker’s intention. The carved vine does not establish the plant’s species.</p><DiscoverySource id="sculpture" /></div></details>
  </section>;
  return null;
}
