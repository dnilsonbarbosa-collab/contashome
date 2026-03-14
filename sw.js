const CACHE_NAME = 'orcamento-v1';
const urlsToCache = [
  '/contashome/',
  '/contashome/index.html',
  '/contashome/manifest.json',
  '/contashome/icon-48x48.png',
  '/contashome/icon-72x72.png',
  '/contashome/icon-96x96.png',
  '/contashome/icon-128x128.png',
  '/contashome/icon-144x144.png',
  '/contashome/icon-152x152.png',
  '/contashome/icon-192x192.png',
  '/contashome/icon-256x256.png',
  '/contashome/icon-384x384.png',
  '/contashome/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
