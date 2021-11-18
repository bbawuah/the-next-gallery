const cacheName = 'js13kPWA-v1';
const contentToCache = ['./static/map.jpg', './build/bundle.js', './build/bundle.css', './index.html'];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  const preCache = async () => {
    const cache = await caches.open(cacheName);

    try {
      return cache.addAll(contentToCache);
    } catch (e) {
      return;
    }
  };

  event.waitUntil(preCache());
});

self.addEventListener('fetch', e => {
  e.respondWith(async function () {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) {
      return r;
    }

    return fetch(e.request);
  });
});
