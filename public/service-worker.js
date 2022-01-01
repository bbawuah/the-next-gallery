const cacheName = 'js13kPWA-v1';
const contentToCache = [
  './fonts/helvetica.fnt',
  './fonts/helvetica.png',
  './fonts/HelveticaNeue-Bold-02.ttf',
  './fonts/HelveticaNeue-Light-08.ttf',
  './fonts/inter.ttf',
  './fonts/muse-italic.ttf',
  './fonts/muse-regular.ttf',
  './fonts/HelveticaNeue-01.ttf',
  './static/gallery.glb',
  './static/interior-base.jpg',
  './static/tessalation-tent.jpg',
  './static/wooden-walls.jpg',
  './static/vases-one.jpg',
  './static/vases-two.jpg',
  './static/floor.jpg',
  './static/photos/dallis.jpg',
  './static/photos/jamil.jpg',
  './static/photos/porchia.jpg',
  './static/photos/junior.jpg',
  './static/photos/kwame.jpg',
  './static/photos/darryl.jpg',
  './static/photos/terry.jpg',
  './static/photos/kenneth.jpg',
  './static/photos/mirella.jpg',
  './static/photos/crystalina.jpg',
  './static/photos/bonsu.jpg',
  './static/photos/eben.jpg',
  './static/photos/ronald.jpg',
  './static/photos/eboafo.jpg',
  './static/photos/churchbwoygram.jpg',
  './static/photos/othnell.jpg',
  './static/photos/branko.jpg',
  './static/photos/emmanuel.jpg',
  './static/photos/denitio.jpg',
  './static/sound/ambient-sound.mp3',
  './build/bundle.js',
  './build/bundle.css',
  './index.html'
];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');

  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(() => {
      return fetch(e.request).then(response => {
        return caches.open(cacheName).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
