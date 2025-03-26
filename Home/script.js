let loading = false;

function registrarLocalizacao() {
    if (loading) return;
    loading = true;
    document.getElementById('loading').style.display = 'block';

    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador.');
        loading = false;
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const geoOptions = {
        enableHighAccuracy: true, // Melhor precisão
        timeout: 10000, // Tempo limite de 10 segundos
        maximumAge: 0, // Não usar localização em cache
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toLocaleString('pt-BR');

            const dadosLocalizacao = {
                latitude,
                longitude,
                accuracy,
                timestamp: dataAtual.getTime(),
                data: dataFormatada,
            };

            if (accuracy && accuracy > 50) {
                alert(`Atenção: A precisão da localização é baixa (${accuracy} metros).`);
            }

            localStorage.setItem('localizacaoAtual', JSON.stringify(dadosLocalizacao));
            alert(`Localização e data registradas com sucesso:\nLatitude: ${latitude}\nLongitude: ${longitude}\nData: ${dataFormatada}`);
            loading = false;
            document.getElementById('loading').style.display = 'none';
        },
        (error) => {
            let errorMessage = 'Erro ao registrar localização.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Permissão de localização negada.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Informação de localização indisponível.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Tempo limite para obter localização excedido.';
                    break;
                case error.UNKNOWN_ERROR:
                    errorMessage = 'Erro desconhecido ao obter localização.';
                    break;
            }
            alert(errorMessage);
            console.error('Erro ao registrar localização:', error);
            loading = false;
            document.getElementById('loading').style.display = 'none';
        },
        geoOptions
    );
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Acesso à localização concedido
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
        },
        function(error) {
            // Acesso à localização negado
            console.error('Erro ao obter localização:', error);
            if (error.code === error.PERMISSION_DENIED) {
                console.log('Permissão de localização negada.');
            }
        }
    );
} else {
    console.error('Geolocalização não suportada.');
}