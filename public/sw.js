const CACHE_NAME = 'biblemap-v1';
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
  if (event.request.url.includes('.parquet')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => 
            cache.put(event.request, clone)
          );
          return response;
        });
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