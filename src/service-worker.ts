/* eslint-disable @typescript-eslint/no-misused-new */
/**
 * Copyright (c) 2016, Tiernan Cridland
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
 * IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 *
 * Typings for Service Worker
 * @author Tiernan Cridland
 * @email tiernanc@gmail.com
 * @license: ISC
 */

interface Navigator {
  serviceWorker: ServiceWorkerContainer;
}

interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface ServiceWorker extends Worker {
  scriptURL: string;
  state: ServiceWorkerState;
}

interface ServiceWorkerContainer {
  controller?: ServiceWorker;
  oncontrollerchange?: (event?: Event) => any;
  onerror?: (event?: Event) => any;
  onmessage?: (event?: Event) => any;
  ready: Promise<ServiceWorkerRegistration>;
  getRegistration(scope?: string): Promise<ServiceWorkerRegistration>;
  getRegistrations(): Promise<Array<ServiceWorkerRegistration>>;
  register(url: string, options?: ServiceWorkerRegistrationOptions): Promise<ServiceWorkerRegistration>;
}

interface ServiceWorkerNotificationOptions {
  tag?: string;
}

interface ServiceWorkerRegistration {
  active?: ServiceWorker;
  installing?: ServiceWorker;
  onupdatefound?: (event?: Event) => any;
  pushManager: PushManager;
  scope: string;
  waiting?: ServiceWorker;
  getNotifications(options?: ServiceWorkerNotificationOptions): Promise<Array<Notification>>;
  update(): void;
  unregister(): Promise<boolean>;
}

interface ServiceWorkerRegistrationOptions {
  scope?: string;
}

type ServiceWorkerState = 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';

// CacheStorage API

interface Cache {
  add(request: Request): Promise<void>;
  addAll(requestArray: Array<Request> | Array<string>): Promise<void>;
  'delete'(request: Request, options?: CacheStorageOptions): Promise<boolean>;
  keys(request?: Request, options?: CacheStorageOptions): Promise<Array<string>>;
  match(request: Request, options?: CacheStorageOptions): Promise<Response>;
  matchAll(request: Request, options?: CacheStorageOptions): Promise<Array<Response>>;
  put(request: Request | string, response: Response): Promise<void>;
}

interface CacheStorage {
  'delete'(cacheName: string): Promise<boolean>;
  has(cacheName: string): Promise<boolean>;
  keys(): Promise<Array<string>>;
  match(request: Request, options?: CacheStorageOptions): Promise<Response>;
  open(cacheName: string): Promise<Cache>;
}

interface CacheStorageOptions {
  cacheName?: string;
  ignoreMethod?: boolean;
  ignoreSearch?: boolean;
  ignoreVary?: boolean;
}

// Client API

interface Client {
  frameType: ClientFrameType;
  id: string;
  url: string;
}

interface Clients {
  claim(): Promise<any>;
  get(id: string): Promise<Client>;
  matchAll(options?: ClientMatchOptions): Promise<Array<Client>>;
  openWindow(url: string): Promise<WindowClient>;
}

interface ClientMatchOptions {
  includeUncontrolled?: boolean;
  type?: ClientMatchTypes;
}

interface WindowClient {
  focused: boolean;
  visibilityState: WindowClientState;
  focus(): Promise<WindowClient>;
  navigate(url: string): Promise<WindowClient>;
}

type ClientFrameType = 'auxiliary' | 'top-level' | 'nested' | 'none';
type ClientMatchTypes = 'window' | 'worker' | 'sharedworker' | 'all';
type WindowClientState = 'hidden' | 'visible' | 'prerender' | 'unloaded';

// Fetch API

interface Body {
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

interface InstallEvent extends ExtendableEvent {
  activeWorker: ServiceWorker;
}

type ActivateEvent = ExtendableEvent;

interface Headers {
  new (init?: any): Headers;
  append(name: string, value: string): void;
  'delete'(name: string): void;
  entries(): Array<Array<string>>;
  get(name: string): string;
  getAll(name: string): Array<string>;
  has(name: string): boolean;
  keys(): Array<string>;
  set(name: string, value: string): void;
  values(): Array<string>;
}

interface Request extends Body {
  new (
    url: string,
    init?: {
      method?: string;
      url?: string;
      referrer?: string;
      mode?: 'cors' | 'no-cors' | 'same-origin' | 'navigate';
      credentials?: 'omit' | 'same-origin' | 'include';
      redirect?: 'follow' | 'error' | 'manual';
      integrity?: string;
      cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
      headers?: Headers;
    }
  ): Request;
  cache: RequestCache;
  credentials: RequestCredentials;
  headers: Headers;
  integrity: string;
  method: string;
  mode: RequestMode;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  redirect: RequestRedirect;
  url: string;
  clone(): Request;
}

interface Response extends Body {
  new (url: string): Response;
  new (
    body: Blob | BufferSource | FormData | string,
    init: {
      status?: number;
      statusText?: string;
      headers?: Headers | {[k: string]: string};
    }
  ): Response;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  useFinalURL: boolean;
  clone(): Response;
  error(): Response;
  redirect(): Response;
}

type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin-only'
  | 'origin-when-cross-origin'
  | 'unsafe-url';
type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
type RequestCredentials = 'omit' | 'same-origin' | 'include';
type RequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate';
type RequestRedirect = 'follow' | 'error' | 'manual';
type ResponseType = 'basic' | 'cores' | 'error' | 'opaque';

// Notification API

interface Notification {
  body: string;
  data: any;
  icon: string;
  lang: string;
  requireInteraction: boolean;
  silent: boolean;
  tag: string;
  timestamp: number;
  title: string;
  close(): void;
  requestPermission(): Promise<string>;
}

interface NotificationEvent {
  action: string;
  notification: Notification;
}

// Push API

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface PushManager {
  getSubscription(): Promise<PushSubscription>;
  permissionState(): Promise<string>;
  subscribe(): Promise<PushSubscription>;
}

interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  json(): any;
  text(): string;
}

interface PushSubscription {
  endpoint: string;
  getKey(method: string): ArrayBuffer;
  toJSON(): string;
  unsubscribe(): Promise<boolean>;
}

// Sync API

interface SyncEvent extends Event {
  lastChance: boolean;
  tag: string;
}

// ServiceWorkerGlobalScope

declare let Headers: Headers;
declare let Response: Response;
declare let Request: Request;
declare let caches: CacheStorage;
declare let clients: Clients;
declare let onactivate: (event?: ExtendableEvent) => any;
declare let onfetch: (event?: FetchEvent) => any;
declare let oninstall: (event?: ExtendableEvent) => any;
declare let onmessage: (event: MessageEvent) => any;
declare let onnotificationclick: (event?: NotificationEvent) => any;
declare let onnotificationclose: (event?: NotificationEvent) => any;
declare let onpush: (event?: PushEvent) => any;
declare let onpushsubscriptionchange: () => any;
declare let onsync: (event?: SyncEvent) => any;
declare let registration: ServiceWorkerRegistration;

declare function fetch(request: Request | string): Promise<Response>;
declare function skipWaiting(): void;

const cacheName = 'js13kPWA-v1';
const contentToCache = [
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

self.addEventListener('install', function (event: ExtendableEvent) {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(contentToCache);
      })
      .catch(e => {
        console.log(e);
      })
  );
});

self.addEventListener('fetch', (e: FetchEvent) => {
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

export {};
