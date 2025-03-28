if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
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

// app.js

const checkinButton = document.getElementById('checkinButton');

checkinButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const dataAtual = new Date();
                const dataFormatada = dataAtual.toLocaleString();

                const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                const dadosCheckin = {
                    latitude: latitude,
                    longitude: longitude,
                    data: dataFormatada,
                    gmapsLink: gmapsLink
                };

                // Armazena os dados no localStorage
                localStorage.setItem('dadosCheckin', JSON.stringify(dadosCheckin));

                alert(`Check-in realizado em ${dataFormatada}! Localização: ${gmapsLink}`);
            },
            (error) => {
                alert('Erro ao obter localização: ' + error.message);
            }
        );
    } else {
        alert('Geolocalização não suportada neste navegador.');
    }
});