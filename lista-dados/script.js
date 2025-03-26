let dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];

function renderTable(dadosFiltrados) {
    const tableBody = document.querySelector('#dadosTable tbody');
    tableBody.innerHTML = '';
    dadosFiltrados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.localidade || '-'}</td>
            <td>${item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-'}</td>
            <td>${item.quarteirao || '-'}</td>
            <td>${item.nomeRua || '-'}</td>
            <td>${item.numeroImovel || '-'}</td>
            <td>${item.tipoImovel || '-'}</td>
            <td>${item.tipoVisita || '-'}</td>
            <td><button class="button" onclick="editarItem(${item.id})">Editar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function aplicarFiltros() {
    let dadosFiltrados = [...dados];
    const localidadeFilter = document.getElementById('localidadeFilter').value;
    const quarteiraoFilter = document.getElementById('quarteiraoFilter').value;
    const tipoImovelFilter = document.getElementById('tipoImovelFilter').value;
    const tipoVisitaFilter = document.getElementById('tipoVisitaFilter').value;
    const dataInicialFilter = document.getElementById('dataInicialFilter').value;
    const dataFinalFilter = document.getElementById('dataFinalFilter').value;

    if (localidadeFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.localidade.includes(localidadeFilter));
    }
    if (quarteiraoFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.quarteirao.includes(quarteiraoFilter));
    }
    if (tipoImovelFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipoImovel === tipoImovelFilter);
    }
    if (tipoVisitaFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipoVisita === tipoVisitaFilter);
    }
    if (dataInicialFilter && dataFinalFilter) {
        const dataInicial = new Date(dataInicialFilter + 'T00:00:00-03:00').getTime();
        const dataFinal = new Date(dataFinalFilter + 'T23:59:59-03:00').getTime() + 86399999;
        dadosFiltrados = dadosFiltrados.filter(item => {
            if (item.data){
                const dataItem = new Date(item.data).getTime();
                return dataItem >= dataInicial && dataItem <= dataFinal;
            }
            return false;
        });
    }
    renderTable(dadosFiltrados);
}

function limparFiltros() {
    document.getElementById('localidadeFilter').value = '';
    document.getElementById('quarteiraoFilter').value = '';
    document.getElementById('tipoImovelFilter').value = '';
    document.getElementById('tipoVisitaFilter').value = '';
    document.getElementById('dataInicialFilter').value = '';
    document.getElementById('dataFinalFilter').value = '';
    aplicarFiltros();
}

function editarItem(id) {
    window.location.href = `../editar-dados/index.html?id=${id}`;
}

function gerarPdf() {
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    if (!nomeResponsavel) {
        alert('O nome do responsável é obrigatório.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.text(`Relatório de Dados Coletados - Responsável: ${nomeResponsavel}`, 10, y);
    y += 10;

    const tableHeaders = ['Localidade', 'Data', 'Quarteirão', 'Rua', 'Número', 'Tipo de Imóvel', 'Tipo de Visita'];
    const tableData = dados.map(item => [
        item.localidade || '-',
        item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-',
        item.quarteirao || '-',
        item.nomeRua || '-',
        item.numeroImovel || '-',
        item.tipoImovel || '-',
        item.tipoVisita || '-'
    ]);

    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: y + 10,
    });

    doc.save('dados-coletados.pdf');
}


aplicarFiltros(); // Renderiza a tabela com os dados iniciais