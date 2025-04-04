let dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];

function renderTable(dadosFiltrados) {
    const tableBody = document.querySelector('#dadosTable tbody');
    const tableFooter = document.querySelector('#dadosTable tfoot');
    tableBody.innerHTML = '';
    let somaA1 = 0, somaA2 = 0, somaB = 0, somaC = 0, somaD1 = 0, somaD2 = 0, somaE = 0, somaEliminados = 0, somaQuantidadeAmostras = 0, somaQuantidadeLarvicida = 0, somaQuantidadeDepositosTratados = 0;
    let inspecionados = 0, amostrasColetadas = 0, tratados = 0;

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
            <td>${item.inspecionado ? 'Sim' : 'Não'}</td>
            <td>${item.a1 || '-'}</td>
            <td>${item.a2 || '-'}</td>
            <td>${item.b || '-'}</td>
            <td>${item.c || '-'}</td>
            <td>${item.d1 || '-'}</td>
            <td>${item.d2 || '-'}</td>
            <td>${item.e || '-'}</td>
            <td>${item.eliminados || '-'}</td>
            <td>${item.amostraColetada ? 'Sim' : 'Não'}</td>
            <td>${item.quantidadeAmostras || '-'}</td>
            <td>${item.numeroAmostraInicial || '-'}</td>
            <td>${item.numeroAmostraFinal || '-'}</td>
            <td>${item.tratado ? 'Sim' : 'Não'}</td>
            <td>${item.quantidadeLarvicida || '-'}</td>
            <td>${item.quantidadeDepositosTratados || '-'}</td>
            <td><button class="button" onclick="editarItem(${item.id})">Editar</button></td>
        `;
        tableBody.appendChild(row);

        // Soma dos campos numéricos
        somaA1 += parseFloat(item.a1) || 0;
        somaA2 += parseFloat(item.a2) || 0;
        somaB += parseFloat(item.b) || 0;
        somaC += parseFloat(item.c) || 0;
        somaD1 += parseFloat(item.d1) || 0;
        somaD2 += parseFloat(item.d2) || 0;
        somaE += parseFloat(item.e) || 0;
        somaEliminados += parseFloat(item.eliminados) || 0;
        somaQuantidadeAmostras += parseFloat(item.quantidadeAmostras) || 0;
        somaQuantidadeLarvicida += parseFloat(item.quantidadeLarvicida) || 0;
        somaQuantidadeDepositosTratados += parseFloat(item.quantidadeDepositosTratados) || 0;

        // Contagem dos campos booleanos
        if (item.inspecionado) inspecionados++;
        if (item.amostraColetada) amostrasColetadas++;
        if (item.tratado) tratados++;
    });

    // Adicionar linha de soma no rodapé
    tableFooter.innerHTML = `
        <tr>
            <td colspan="7">Total</td>
            <td>${inspecionados}</td>
            <td>${somaA1}</td>
            <td>${somaA2}</td>
            <td>${somaB}</td>
            <td>${somaC}</td>
            <td>${somaD1}</td>
            <td>${somaD2}</td>
            <td>${somaE}</td>
            <td>${somaEliminados}</td>
            <td>${amostrasColetadas}</td>
            <td>${somaQuantidadeAmostras}</td>
            <td colspan="2"></td>
            <td>${tratados}</td>
            <td>${somaQuantidadeLarvicida}</td>
            <td>${somaQuantidadeDepositosTratados}</td>
            <td></td>
        </tr>
    `;
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

function excluirItem(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        let dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
        dados = dados.filter(item => item.id !== id);
        localStorage.setItem('dadosColetados', JSON.stringify(dados));
        aplicarFiltros(); // Atualiza a tabela com os dados filtrados após a exclusão
    }
}

function gerarPdf() {
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    if (!nomeResponsavel) {
        alert('O nome do responsável é obrigatório.');
        return;
    }

    const dadosCheckin = JSON.parse(localStorage.getItem('dadosCheckin'));
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
    });
    let y = 20;

    doc.text(`Relatório de Dados Coletados - Responsável: ${nomeResponsavel}`, 10, y);
    y += 10;

    const tableHeaders = [
        'Localidade', 'Data', 'Qua.', 'Rua', 'Nº', 'Tipo', 'Visita',
        'Insp,', 'A1', 'A2', 'B', 'C', 'D1', 'D2', 'E', 'Elim.',
        'Amostra', 'Qtd. Amostras', 'N A. Ini', 'N A. Fin', 'Trat.', 'Qtd Larv.', 'Qtd Dep. Trat.'
    ];

    const tableData = dados.map(item => [
        item.localidade || '-',
        item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-',
        item.quarteirao || '-',
        item.nomeRua || '-',
        item.numeroImovel || '-',
        item.tipoImovel || '-',
        item.tipoVisita || '-',
        item.inspecionado ? 'Sim' : 'Não',
        item.a1 || '-',
        item.a2 || '-',
        item.b || '-',
        item.c || '-',
        item.d1 || '-',
        item.d2 || '-',
        item.e || '-',
        item.eliminados || '-',
        item.amostraColetada ? 'Sim' : 'Não',
        item.quantidadeAmostras || '-',
        item.numeroAmostraInicial || '-',
        item.numeroAmostraFinal || '-',
        item.tratado ? 'Sim' : 'Não',
        item.quantidadeLarvicida || '-',
        item.quantidadeDepositosTratados || '-'
    ]);

    // Calcular totais
    let somaA1 = 0, somaA2 = 0, somaB = 0, somaC = 0, somaD1 = 0, somaD2 = 0, somaE = 0, somaEliminados = 0, somaQuantidadeAmostras = 0, somaQuantidadeLarvicida = 0, somaQuantidadeDepositosTratados = 0;
    let inspecionados = 0, amostrasColetadas = 0, tratados = 0;

    dados.forEach(item => {
        somaA1 += parseFloat(item.a1) || 0;
        somaA2 += parseFloat(item.a2) || 0;
        somaB += parseFloat(item.b) || 0;
        somaC += parseFloat(item.c) || 0;
        somaD1 += parseFloat(item.d1) || 0;
        somaD2 += parseFloat(item.d2) || 0;
        somaE += parseFloat(item.e) || 0;
        somaEliminados += parseFloat(item.eliminados) || 0;
        somaQuantidadeAmostras += parseFloat(item.quantidadeAmostras) || 0;
        somaQuantidadeLarvicida += parseFloat(item.quantidadeLarvicida) || 0;
        somaQuantidadeDepositosTratados += parseFloat(item.quantidadeDepositosTratados) || 0;

        if (item.inspecionado) inspecionados++;
        if (item.amostraColetada) amostrasColetadas++;
        if (item.tratado) tratados++;
    });

    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: y + 10,
        styles: {
            fontSize: 8,
        },
        foot: [
            ['Total', '', '', '', '', '', '', inspecionados, somaA1, somaA2, somaB, somaC, somaD1, somaD2, somaE, somaEliminados, amostrasColetadas, somaQuantidadeAmostras, '', '', tratados, somaQuantidadeLarvicida, somaQuantidadeDepositosTratados]
        ]
    });

    y = doc.autoTable.previous.finalY + 20;

    if (dadosCheckin) {
        doc.text(`Localização do Check-in:`, 10, y);
        doc.text(dadosCheckin.gmapsLink, 10, y + 10, {
            link: dadosCheckin.gmapsLink,
            textColor: [0, 0, 255]
        });
    }

    doc.save('dados-coletados.pdf');
}

aplicarFiltros(); // Renderiza a tabela com os dados iniciais