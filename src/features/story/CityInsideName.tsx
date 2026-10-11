import type { MouseEvent } from 'react';
import { DISCOVERY_SOURCES, storyPlaceHref } from '@/content/jonah-discoveries';

/** Original, deliberately unscaled place study. The verse text stays in StoryReader. */
export function CityInsideName() {
  return <section className="city-encounter" aria-label="The city inside the name">
    <div className="city-name">
      <p className="story-eyebrow">The city inside the name</p>
      <p className="city-word" aria-label="Nineveh">NINEVEH</p>
      <p className="city-invitation">A place beyond the word. What does the passage ask us to see there?</p>
    </div>
    <details className="city-stage city-place">
      <summary>See the place <span aria-hidden="true">↗</span></summary>
      <div className="city-stage-body">
        <p className="story-eyebrow">Later historical context · original schematic</p>
        <h3>A city beside water.</h3>
        <figure className="city-schematic">
          <svg viewBox="0 0 600 330" role="img" aria-labelledby="city-map-title city-map-desc" preserveAspectRatio="xMidYMid meet">
            <title id="city-map-title">Schematic of Nineveh, the Tigris, the Khosr, and separate Jerwan evidence</title>
            <desc id="city-map-desc">Nineveh is shown east of the Tigris, opposite Mosul. The Khosr joins the Tigris near the city. A separate inset marks the later Jerwan aqueduct inscription. No route or city plan is drawn.</desc>
            <path className="city-water" d="M114 -12 C72 55 143 100 103 150 S144 254 104 342" />
            <path className="city-water city-water--minor" d="M610 207 C510 191 448 235 359 227 S216 166 109 192" />
            <text x="18" y="80">Tigris</text>
            <text x="371" y="184">Khosr</text>
            <circle cx="214" cy="142" r="6" className="city-point" />
            <text x="231" y="148" className="city-label">Nineveh</text>
            <text x="19" y="310" className="city-small">Mosul / opposite bank</text>
            <path className="city-inset-line" d="M383 26 H578 V125 H383 Z" />
            <text x="399" y="58" className="city-small">LATER EVIDENCE</text>
            <text x="399" y="88" className="city-label">Jerwan</text>
            <text x="399" y="110" className="city-small">aqueduct inscription</text>
          </svg>
          <figcaption>Interpretive schematic · not to scale. The inset marks separate evidence, not a mapped route or Jonah’s reconstructed city.</figcaption>
        </figure>
        <p>Nineveh stood by the Tigris, opposite modern Mosul. The Khosr is another waterway in its setting. At Jerwan, an inscription of Sennacherib describes an aqueduct and water brought toward Nineveh. ORACC dates the inscription to circa 704–681 BCE. This later royal evidence does not date Jonah’s visit or describe the people in Jonah 3.</p>
        <a className="city-atlas-link" href={storyPlaceHref('nineveh', 'jonah-3-mercy')}>Locate Nineveh in the atlas <span aria-hidden="true">↗</span></a>
        <details className="city-sources"><summary>Sources and limits</summary>
          <ul>
            <li><strong>Biblical text:</strong> Jonah 3:5–10, World English Bible, pinned in this reader. It describes the response, decree, and God’s observation; it does not mention Jerwan.</li>
            <li><strong>Geographic identification:</strong> <a href={DISCOVERY_SOURCES.nineveh.url} target="_blank" rel="noreferrer">{DISCOVERY_SOURCES.nineveh.title} ↗</a> locates Nineveh on the Tigris opposite Mosul.</li>
            <li><strong>Later royal inscription:</strong> <a href={DISCOVERY_SOURCES.jerwan.url} target="_blank" rel="noreferrer">{DISCOVERY_SOURCES.jerwan.title} ↗</a> records the aqueduct and water brought toward Nineveh, dated circa 704–681 BCE. The Khosr context is documented by the <a href={DISCOVERY_SOURCES.jerwanStudy.url} target="_blank" rel="noreferrer">University of Chicago Jerwan study ↗</a>.</li>
            <li><strong>Artistic interpretation:</strong> This original, unscaled schematic shows relationships only. It does not reconstruct the city, waterways’ courses, or the aqueduct’s route.</li>
          </ul>
        </details>
        <details className="city-stage city-return">
          <summary>Return to the passage <span aria-hidden="true">↘</span></summary>
          <div className="city-stage-body">
            <p className="city-return-intro">Notice the order in Jonah 3:5–10. The final line names what God sees.</p>
            <ol className="city-sequence">
              <li><span>3:5</span><strong>The people respond</strong><a href="#jonah-3-mercy" onClick={focusVerse('3:5')}>Read verse 5</a></li>
              <li><span>3:6–9</span><strong>The king issues his decree</strong><a href="#jonah-3-mercy" onClick={focusVerse('3:6')}>Read verses 6–9</a></li>
              <li><span>3:10</span><strong>God sees their conduct</strong><a href="#jonah-3-mercy" onClick={focusVerse('3:10')}>Read verse 10</a></li>
            </ol>
            <p className="city-return-note">These labels summarize the sequence. The complete, unchanged passage remains beside this encounter.</p>
          </div>
        </details>
      </div>
    </details>
  </section>;
}

function focusVerse(reference: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const verse = document.querySelector<HTMLElement>(`[data-scene="jonah-3-mercy"] [data-reference="${reference}"]`);
    verse?.focus({ preventScroll: true });
    verse?.scrollIntoView({ block: 'center', behavior: 'instant' });
  };
}
