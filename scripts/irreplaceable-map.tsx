import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { STORY_PLACES } from '../src/content/jonah-discoveries';

const place = STORY_PLACES.nineveh;
// No prophet marker or conjectured route. The same site survives every verse change.
export default function Geography() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [regional, setRegional] = useState(false);
  useEffect(() => {
    if (!enabled || !container.current) return;
    let instance: MapLibreMap | undefined;
    let disposed = false;
    let timer: number | undefined;
    async function load() {
      try {
      const { default: maplibregl } = await import('maplibre-gl');
      if (disposed || !container.current) return;
      instance = new maplibregl.Map({ container: container.current, style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', center: [place.longitude, place.latitude], zoom: 9, attributionControl: { compact: true }, interactive: false, renderWorldCopies: false });
      map.current = instance;
      new maplibregl.Marker({ color: '#efcc88' }).setLngLat([place.longitude, place.latitude]).addTo(instance);
      instance.on('load', () => setState('ready'));
      instance.on('error', () => setState('error'));
      timer = window.setTimeout(() => { if (instance && !instance.isStyleLoaded()) setState('error'); }, 15000);
      } catch {
      // WebGL may be unavailable; the geographic schematic and Scripture remain usable.
        if (!disposed) setState('error');
      }
    }
    void load();
    return () => { disposed = true; clearTimeout(timer); instance?.remove(); map.current = null; };
  }, [enabled]);
  function extent(wide: boolean) {
    setRegional(wide);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    map.current?.easeTo({ center: [place.longitude, place.latitude], zoom: wide ? 4.5 : 9, duration: reduce ? 0 : 650 });
  }
  return <section className="place" aria-label="Nineveh remains in view" data-map-state={state}>
    <div className="place-title"><h2>Nineveh</h2><p>Tigris valley · opposite modern Mosul</p></div>
    <div className="place-window">
      <svg className="place-schematic" viewBox="0 0 600 390" role="img" aria-labelledby="place-title place-description">
        <title id="place-title">Nineveh beside the Tigris</title><desc id="place-description">Interpretive geographic schematic, north up, not to scale. Nineveh is east of the Tigris, opposite modern Mosul. Jonah is not located.</desc>
        <defs><pattern id="contours" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M0 45 Q30 5 60 45" fill="none" stroke="#33494b" strokeWidth="1" /></pattern></defs>
        <rect width="600" height="390" fill="#172b2d" /><rect width="600" height="390" fill="url(#contours)" />
        <path d="M205 -20 C120 70 265 110 185 190 S265 290 195 410" fill="none" stroke="#769ca3" strokeWidth="12" />
        <text x="72" y="110">Tigris</text><text x="30" y="293" className="map-small">Modern Mosul</text>
        <circle cx="267" cy="160" r="6" fill="#efcc88"/><circle cx="267" cy="160" r="18" fill="none" stroke="#efcc88"/>
        <text x="304" y="167" className="map-city">Nineveh</text><path d="M550 78 V30 M542 42 L550 30 L558 42" stroke="#d9d8c7" fill="none"/><text x="544" y="103" className="map-small">N</text>
      </svg>
      {enabled && state !== 'error' && <div ref={container} className={`live-map ${state === 'ready' ? 'loaded' : ''}`} aria-label="Modern geographic context map" />}
      <span className="map-caption">{state === 'ready' ? 'Modern basemap · ancient site marker' : 'Interpretive schematic · not to scale'}</span>
    </div>
    <div className="place-controls">
      <button aria-pressed={enabled} onClick={() => { setEnabled(!enabled); setState(enabled ? 'idle' : 'loading'); setRegional(false); }}>{enabled ? 'Use schematic' : 'Open geographic map'}</button>
      {enabled && state === 'ready' && <button aria-pressed={regional} onClick={() => extent(!regional)}>{regional ? 'Return to the city' : 'See the wider region'}</button>}
    </div>
    <p className="caption" role="status">{state === 'error' ? 'Map unavailable. The schematic retains the place; reading is unaffected.' : state === 'loading' ? 'Loading the optional map…' : 'Ancient site, not Jonah’s position. No route is reconstructed.'}</p>
  </section>;
}
