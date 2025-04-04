document.addEventListener('DOMContentLoaded', () => {
    const inspecionadoCheckbox = document.getElementById('inspecionado');
    const amostraCheckbox = document.getElementById('amostraColetada');
    const amostraFields = document.getElementById('amostraFields');
    const tratadoCheckbox = document.getElementById('tratado');
    const tratadoFields = document.getElementById('tratadoFields');
    const group = document.querySelector('.group');

    inspecionadoCheckbox.addEventListener('change', () => {
        group.style.display = inspecionadoCheckbox.checked ? 'flex' : 'none';
    });

    amostraCheckbox.addEventListener('change', () => {
        amostraFields.style.display = amostraCheckbox.checked ? 'block' : 'none';
    });

    tratadoCheckbox.addEventListener('change', () => {
        tratadoFields.style.display = tratadoCheckbox.checked ? 'block' : 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));

    if (itemId) {
        carregarDadosParaEdicao(itemId);
    }

    const inspecionadoCheckbox = document.getElementById('inspecionado');
    const inspecionadoFields = document.getElementById('inspecionadoFields');
    const amostraCheckbox = document.getElementById('amostraColetada');
    const amostraFields = document.getElementById('amostraFields');
    const tratadoCheckbox = document.getElementById('tratado');
    const tratadoFields = document.getElementById('tratadoFields');
    const tipoVisita = document.getElementById('tipoVisita');

    inspecionadoCheckbox.addEventListener('change', () => {
        inspecionadoFields.style.display = inspecionadoCheckbox.checked ? 'flex' : 'none';
    });

    amostraCheckbox.addEventListener('change', () => {
        amostraFields.style.display = amostraCheckbox.checked ? 'block' : 'none';
    });

    tratadoCheckbox.addEventListener('change', () => {
        tratadoFields.style.display = tratadoCheckbox.checked ? 'block' : 'none';
    });

    tipoVisita.addEventListener('change', atualizarVisibilidade);
    atualizarVisibilidade(); // Chama inicialmente

    function atualizarVisibilidade() {
        const visitaSelecionada = tipoVisita.value;
        const inspecionadoLabel = document.querySelector('label[for="inspecionado"]');
        const amostraLabel = document.querySelector('label[for="amostraColetada"]');
        const tratadoLabel = document.querySelector('label[for="tratado"]');

        if (visitaSelecionada === 'F') { // Pendente
            inspecionadoLabel.style.display = 'none';
            inspecionadoFields.style.display = 'none';
            amostraLabel.style.display = 'none';
            amostraFields.style.display = 'none';
            tratadoLabel.style.display = 'none';
            tratadoFields.style.display = 'none';
        } else if (visitaSelecionada === 'N') { // Normal
            inspecionadoLabel.style.display = 'block';
            inspecionadoFields.style.display = 'flex';
            amostraLabel.style.display = 'block';
            amostraFields.style.display = 'block';
            tratadoLabel.style.display = 'block';
            tratadoFields.style.display = 'block';
        } else if (visitaSelecionada === 'R') { // Recuperada
            inspecionadoLabel.style.display = 'none';
            inspecionadoFields.style.display = 'none';
            amostraLabel.style.display = 'none';
            amostraFields.style.display = 'none';
            tratadoLabel.style.display = 'block';
            tratadoFields.style.display = 'block';
        }
    }
});

function carregarDadosParaEdicao(id) {
    const dadosColetados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
    const itemParaEditar = dadosColetados.find(item => item.id === id);

    if (itemParaEditar) {
        document.getElementById('localidade').value = itemParaEditar.localidade || '';
        document.getElementById('quarteirao').value = itemParaEditar.quarteirao || '';
        document.getElementById('nomeRua').value = itemParaEditar.nomeRua || '';
        document.getElementById('numeroImovel').value = itemParaEditar.numeroImovel || '';
        document.getElementById('tipoImovel').value = itemParaEditar.tipoImovel || 'R';
        document.getElementById('tipoVisita').value = itemParaEditar.tipoVisita || 'N';
        document.getElementById('inspecionado').checked = itemParaEditar.inspecionado || false;
        document.getElementById('a1').value = itemParaEditar.a1 || '';
        document.getElementById('a2').value = itemParaEditar.a2 || '';
        document.getElementById('b').value = itemParaEditar.b || '';
        document.getElementById('c').value = itemParaEditar.c || '';
        document.getElementById('d1').value = itemParaEditar.d1 || '';
        document.getElementById('d2').value = itemParaEditar.d2 || '';
        document.getElementById('e').value = itemParaEditar.e || '';
        document.getElementById('eliminados').value = itemParaEditar.eliminados || '';
        document.getElementById('amostraColetada').checked = itemParaEditar.amostraColetada || false;
        document.getElementById('quantidadeAmostras').value = itemParaEditar.quantidadeAmostras || '';
        document.getElementById('numeroAmostraInicial').value = itemParaEditar.numeroAmostraInicial || '';
        document.getElementById('numeroAmostraFinal').value = itemParaEditar.numeroAmostraFinal || '';
        document.getElementById('tratado').checked = itemParaEditar.tratado || false;
        document.getElementById('quantidadeLarvicida').value = itemParaEditar.quantidadeLarvicida || '';
        document.getElementById('quantidadeDepositosTratados').value = itemParaEditar.quantidadeDepositosTratados || '';

        // Força a atualização da visibilidade dos campos dependendo do tipo de visita
        atualizarVisibilidade();
        // Força a atualização da visibilidade dos campos dependendo dos checkboxes
        document.getElementById('inspecionado').dispatchEvent(new Event('change'));
        document.getElementById('amostraColetada').dispatchEvent(new Event('change'));
        document.getElementById('tratado').dispatchEvent(new Event('change'));
    }
}

function salvarAlteracoes() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));

    if (itemId) {
        const dadosColetados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
        const index = dadosColetados.findIndex(item => item.id === itemId);

        if (index !== -1) {
            dadosColetados[index] = {
                id: itemId,
                localidade: document.getElementById('localidade').value,
                quarteirao: document.getElementById('quarteirao').value,
                nomeRua: document.getElementById('nomeRua').value,
                numeroImovel: document.getElementById('numeroImovel').value,
                tipoImovel: document.getElementById('tipoImovel').value,
                tipoVisita: document.getElementById('tipoVisita').value,
                inspecionado: document.getElementById('inspecionado').checked,
                a1: document.getElementById('a1').value,
                a2: document.getElementById('a2').value,
                b: document.getElementById('b').value,
                c: document.getElementById('c').value,
                d1: document.getElementById('d1').value,
                d2: document.getElementById('d2').value,
                e: document.getElementById('e').value,
                eliminados: document.getElementById('eliminados').value,
                amostraColetada: document.getElementById('amostraColetada').checked,
                quantidadeAmostras: document.getElementById('quantidadeAmostras').value,
                numeroAmostraInicial: document.getElementById('numeroAmostraInicial').value,
                numeroAmostraFinal: document.getElementById('numeroAmostraFinal').value,
                tratado: document.getElementById('tratado').checked,
                quantidadeLarvicida: document.getElementById('quantidadeLarvicida').value,
                quantidadeDepositosTratados: document.getElementById('quantidadeDepositosTratados').value,
                data: dadosColetados[index].data // Mantém a data original
            };
            localStorage.setItem('dadosColetados', JSON.stringify(dadosColetados));
            alert('Dados atualizados com sucesso!');
            window.location.href = '../lista-dados/index.html';
        } else {
            alert('Item não encontrado para edição.');
        }
    } else {
        alert('ID do item não fornecido.');
    }
}

function excluirItem() {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = parseInt(urlParams.get('id'));
        let dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
        dados = dados.filter(item => item.id !== itemId);
        localStorage.setItem('dadosColetados', JSON.stringify(dados));
        window.location.href = '../lista-dados/index.html';
    }
}