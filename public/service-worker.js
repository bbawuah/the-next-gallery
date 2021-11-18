const cacheName = 'js13kPWA-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        './static/map.jpg',
        '/fonts/helvetica.fnt',
        '/fonts/helvetica.png',
        '/fonts/HelveticaNeue-Bold-02.ttf',
        '/fonts/HelveticaNeue-Light-08.ttf',
        '/fonts/HelveticaNeue-01.ttf',
        './static/gallery.glb',
        './static/photos/dalis.jpg',
        './static/photos/jamil.jpg',
        './static/photos/porchia.jpg',
        './static/photos/junior.jpg',
        './static/photos/kwame.jpg',
        './static/photos/soraja.jpg',
        './static/photos/samantha.jpg',
        './static/photos/darryl.jpg',
        './static/photos/les.jpg',
        './static/photos/terry-afram.jpg',
        './static/photos/tonny.jpg',
        './static/photos/kenneth.jpg',
        './static/photos/mirella.jpg',
        './static/photos/crystalina.jpg',
        './static/photos/bonsu.jpg',
        './static/photos/eben.jpg',
        './static/photos/jaysi.jpg',
        './static/photos/ronald.jpg',
        './static/photos/eoboafo.jpg',
        './static/photos/shaneequa.jpg',
        './static/photos/churchbwoygram.jpg',
        './static/photos/othnell.jpg',
        './static/photos/branco.jpg',
        './static/photos/emmanuel.jpg',
        './static/photos/denitio.jpg',
        './static/photos/dalis-meta.png',
        './static/photos/jamil-meta.png',
        './static/photos/porchia-meta.png',
        './static/photos/junior-meta.png',
        './static/photos/kwame-meta.png',
        './static/photos/soraja-meta.png',
        './static/photos/samantha-meta.png',
        './static/photos/darryl-meta.png',
        './static/photos/les-meta.png',
        './static/photos/terry-afram-meta.png',
        './static/photos/tonny-meta.png',
        './static/photos/kenneth-meta.png',
        './static/photos/mirella-meta.png',
        './static/photos/crystalina-meta.png',
        './static/photos/bonsu-meta.png',
        './static/photos/eben-meta.png',
        './static/photos/jaysi-meta.png',
        './static/photos/meester-kwame-meta.png',
        './static/photos/ronald-meta.png',
        './static/photos/eoboafo-meta.png',
        './static/photos/shaneequa-meta.png',
        './static/photos/churchbwoygram-meta.png',
        './static/photos/othnell-meta.png',
        './static/photos/branco-meta.png',
        './static/photos/emmanuel-meta.png',
        './static/photos/denitio-meta.png',
        './static/sound/ambient-sound.mp3',
        '/build/bundle.js',
        '/build/bundle.css',
        './index.html'
      ]);
    })
  );
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
