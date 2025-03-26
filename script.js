if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Erro ao registrar Service Worker:', error);
            });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar App';
    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário instalou o app');
            } else {
                console.log('Usuário cancelou a instalação');
            }
            deferredPrompt = null;
            hideInstallButton();
        });
    });
    document.body.appendChild(installButton);
}

function hideInstallButton() {
    const installButton = document.querySelector('button');
    if (installButton) {
        installButton.style.display = 'none';
    }
}

// Chama showInstallButton() quando a página é carregada
window.addEventListener('load', () => {
    if (deferredPrompt) {
        showInstallButton();
    }
});