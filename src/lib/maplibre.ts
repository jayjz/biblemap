import * as maplibre from "maplibre-gl";

// MapLibre 6 requires an explicit bundler worker URL. Webpack emits this pinned
// package asset locally; the Atlas never fetches executable workers from a CDN.
maplibre.setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);

export { maplibre };
