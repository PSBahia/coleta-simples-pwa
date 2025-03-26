if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker registrado com sucesso:', registration);
  }).catch((error) => {
    console.error('Falha ao registrar o Service Worker:', error);
  });
}

let deferredPrompt;

// Escuta o evento `beforeinstallprompt` para mostrar o botão
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Evita a exibição padrão do banner de instalação do navegador
  deferredPrompt = e; // Armazena o evento para uso posterior

  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'block'; // Mostra o botão de instalação

    installButton.addEventListener('click', () => {
      installButton.style.display = 'none'; // Oculta o botão após o clique
      if (deferredPrompt) {
        deferredPrompt.prompt(); // Mostra o prompt de instalação

        // Lida com a escolha do usuário
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
          } else {
            console.log('Usuário recusou a instalação');
          }
          deferredPrompt = null; // Reseta o deferredPrompt
        });
      }
    });
  } else {
    console.error('Botão de instalação não encontrado');
  }
});

// Mensagem caso a instalação já esteja feita
window.addEventListener('appinstalled', () => {
  console.log('App instalado com sucesso!');
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'none'; // Oculta o botão após a instalação
  }
});