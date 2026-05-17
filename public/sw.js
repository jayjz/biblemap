const CACHE_VERSION = 'v2'; // Increment when data changes
const CACHE_NAME = `biblemap-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',
  '/data/epoch-0-creation.parquet',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Add cache busting for Parquet files with stale-while-revalidate
  if (event.request.url.includes('.parquet')) {
    const url = new URL(event.request.url);
    // Add cache-busting param based on build time
    url.searchParams.set('v', CACHE_VERSION);
    
    event.respondWith(
      caches.match(event.request).then(cached => {
        // Always try network first for Parquet (stale-while-revalidate)
        return fetch(url.toString()).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        }).catch(() => cached); // Fallback to cache on network failure
      })
    );
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => 
      caches.match(event.request)
    )
  );
});