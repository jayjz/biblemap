const CACHE_NAME = 'biblemap-v1';
const urlsToCache = [
  '/',
  '/data/creation.parquet',
  '/data/exodus.parquet',
  '/data/kings.parquet',
  '/data/exile.parquet',
  '/data/intertestamental.parquet',
  '/data/gospels.parquet',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache install failed:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // Return offline fallback if available
        return caches.match('/');
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});