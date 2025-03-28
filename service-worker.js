self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open('app-cache-v2').then((cache) => {
            console.log('Service Worker: Adicionando arquivos ao cache');
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
                '/nao-dengue.jpg',
                '/service-worker.js',
                '/coleta-dados/index.html',
                '/coleta-dados/script.js',
                '/coleta-dados/styles.css',
                '/editar-dados/index.html',
                '/editar-dados/script.js',
                '/editar-dados/styles.css',
                '/Home/index.html',
                '/Home/script.js',
                '/Home/style.css',
                '/lista-dados/index.html',
                '/lista-dados/script.js',
                '/lista-dados/styles.css',
            ]).catch((error) => {
                console.error('Erro ao adicionar ao cache:', error);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativando...');
    // Remover caches antigos
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== 'app-cache-v2') {
                        console.log('Service Worker: Removendo cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Buscando recurso:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch((error) => {
                console.error('Erro ao buscar recurso da rede:', error);
                // Opcional: exibir uma página de erro offline
                return caches.match('/offline.html');
            });
        })
    );
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);

        // Verifica atualizações
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Nova versão do Service Worker encontrada');

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('Nova versão instalada. Atualize para aplicar mudanças.');
                    // Notifica o usuário sobre a atualização
                    showUpdateNotification();
                }
            });
        });
    }).catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
    });
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.textContent = 'Uma nova versão do aplicativo está disponível. Clique para atualizar.';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.background = '#007bff';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.cursor = 'pointer';
    notification.addEventListener('click', () => {
        window.location.reload();
    });
    document.body.appendChild(notification);
}