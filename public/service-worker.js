const cacheName = 'js13kPWA-v1';
const contentToCache = ['./build/bundle.css', './index.html'];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  const preCache = async () => {
    const cache = await caches.open(cacheName);
    return;
  };

  event.waitUntil(preCache);
});

self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);

      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
