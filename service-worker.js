const staticCacheName = 'coleta-simples-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/dados.html',
    '/dados.js',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});