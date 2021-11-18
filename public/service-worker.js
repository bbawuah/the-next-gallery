'use strict';

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
exports.__esModule = true;
var cacheName = 'js13kPWA-v1';
var contentToCache = [
  './static/',
  './static/map.jpg',
  './fonts/',
  './fonts/helvetica.fnt',
  './fonts/helvetica.png',
  './fonts/HelveticaNeue-Bold-02.ttf',
  './fonts/HelveticaNeue-Light-08.ttf',
  './fonts/HelveticaNeue-01.ttf',
  './static/gallery.glb',
  './static/photos',
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
  './build/bundle.js',
  './build/bundle.css',
  './index.html'
];
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches
      .open(cacheName)
      .then(function (cache) {
        cache.addAll(contentToCache);
      })
      ['catch'](function (e) {
        console.log(e);
      })
  );
});
self.addEventListener('fetch', function (e) {
  e.respondWith(
    (function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var r, response, cache;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, caches.match(e.request)];
            case 1:
              r = _a.sent();
              console.log('[Service Worker] Fetching resource: ' + e.request.url);
              if (r) {
                return [2 /*return*/, r];
              }
              return [4 /*yield*/, fetch(e.request)];
            case 2:
              response = _a.sent();
              return [4 /*yield*/, caches.open(cacheName)];
            case 3:
              cache = _a.sent();
              console.log('[Service Worker] Caching new resource: ' + e.request.url);
              cache.put(e.request, response.clone());
              return [2 /*return*/, response];
          }
        });
      });
    })()
  );
});
