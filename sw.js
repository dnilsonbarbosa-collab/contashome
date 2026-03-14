const CACHE_NAME = 'orcamento-v2';
const BASE_PATH = self.location.pathname.replace(/\/[^\/]*$/, '/');

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icon-48x48.png',
  BASE_PATH + 'icon-72x72.png',
  BASE_PATH + 'icon-96x96.png',
  BASE_PATH + 'icon-128x128.png',
  BASE_PATH + 'icon-144x144.png',
  BASE_PATH + 'icon-152x152.png',
  BASE_PATH + 'icon-192x192.png',
  BASE_PATH + 'icon-256x256.png',
  BASE_PATH + 'icon-384x384.png',
  BASE_PATH + 'icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Erro ao cachear:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          });
      })
      .catch(() => {
        // Fallback para offline
        if (event.request.mode === 'navigate') {
          return caches.match(BASE_PATH + 'index.html');
        }
      })
  );
});
