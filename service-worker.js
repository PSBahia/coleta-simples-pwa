self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        '/manifest.json'
      ]);
    }).catch((err) => {
      console.error('Erro ao adicionar arquivos ao cache:', err);
    })
  );
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch((err) => {
      console.error('Erro ao buscar recurso:', err);
    })
  );
});