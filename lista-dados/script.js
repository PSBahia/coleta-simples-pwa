document.addEventListener('DOMContentLoaded', function() {
    const hoje = new Date();

    // Ajustar para o fuso horário de Bahia (-03:00)
    const offset = hoje.getTimezoneOffset(); // Offset em minutos (negativo para leste de UTC)
    const bahiaOffset = -180; // -3 horas em minutos
    const diff = bahiaOffset - offset;
    const hojeBahia = new Date(hoje.getTime() + diff * 60 * 1000);

    const hojeISOBahia = hojeBahia.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const dataInicialFilter = document.getElementById('dataInicialFilter');
    const dataFinalFilter = document.getElementById('dataFinalFilter');

    if (dataInicialFilter) {
        dataInicialFilter.value = hojeISOBahia;
    }
    if (dataFinalFilter) {
        dataFinalFilter.value = hojeISOBahia;
    }

    aplicarFiltros();
});


let dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];

function formatDateInBahia(isoDateString) {
    const originalDate = new Date(isoDateString);
    const offset = originalDate.getTimezoneOffset();
    const bahiaOffset = -180;
    const diff = bahiaOffset - offset;
    const bahiaDate = new Date(originalDate.getTime() + diff * 60 * 1000);
    return bahiaDate.toLocaleDateString('pt-BR');
}

function renderTable(dadosFiltrados) {
    const tableBody = document.querySelector('#dadosTable tbody');
    const tableFooter = document.querySelector('#dadosTable tfoot');
    tableBody.innerHTML = '';
    let contadorRegistros = 0, contadorNormal = 0, somaHabitantes = 0, somaA1 = 0, somaA2 = 0, somaB = 0, somaC = 0, somaD1 = 0, somaD2 = 0, somaE = 0, somaEliminados = 0, somaQuantidadeAmostras = 0, somaQuantidadeLarvicida = 0, somaQuantidadeDepositosTratados = 0;
    let inspecionados = 0, amostrasColetadas = 0, tratados = 0;

    dadosFiltrados.forEach(item => {
        contadorRegistros++;
        if (item.tipoVisita === 'N') {
            contadorNormal++;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.localidade || '-'}</td>
            <td>${item.data ? formatDateInBahia(item.data) : '-'}</td>
            <td>${item.quarteirao || '-'}</td>
            <td>${item.nomeRua || '-'}</td>
            <td>${item.numeroImovel || '-'}</td>
            <td><button class="button" onclick="editarItem(${item.id})"><span class="material-symbols-outlined">edit</span></button></td>
            <td>${item.tipoImovel || '-'}</td>
            <td>${item.tipoVisita || '-'}</td>
            <td>${item.habitantes || '-'}</td>
            <td>${item.inspecionado ? 'X' : '-'}</td>
            <td>${item.a1 || '-'}</td>
            <td>${item.a2 || '-'}</td>
            <td>${item.b || '-'}</td>
            <td>${item.c || '-'}</td>
            <td>${item.d1 || '-'}</td>
            <td>${item.d2 || '-'}</td>
            <td>${item.e || '-'}</td>
            <td>${item.eliminados || '-'}</td>
            <td>${item.amostraColetada ? 'X' : '-'}</td>
            <td>${item.quantidadeAmostras || '-'}</td>
            <td>${item.numeroAmostraInicial || '-'}</td>
            <td>${item.numeroAmostraFinal || '-'}</td>
            <td>${item.tratado ? 'X' : '-'}</td>
            <td>${item.quantidadeLarvicida || '-'}</td>
            <td>${item.quantidadeDepositosTratados || '-'}</td>
            
        `;
        tableBody.appendChild(row);

        // Soma dos campos numéricos
        contadorRegistros || 0;
        contadorNormal || 0;
        somaHabitantes += parseFloat(item.habitantes) || 0;
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
            <td colspan="6">Total</td>
            <td>${contadorRegistros}</td>
            <td>${contadorNormal}</td>
            <td>${somaHabitantes}</td>
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

function aplicarFiltros(filtrarPorDataAtual = false) {
    let dadosFiltrados = Array.isArray(dados) ? [...dados] : [];
    const localidadeFilter = document.getElementById('localidadeFilter').value;
    const quarteiraoFilter = document.getElementById('quarteiraoFilter').value;
    const tipoImovelFilter = document.getElementById('tipoImovelFilter').value;
    const tipoVisitaFilter = document.getElementById('tipoVisitaFilter').value;
    const dataInicialFilter = document.getElementById('dataInicialFilter').value;
    const dataFinalFilter = document.getElementById('dataFinalFilter').value;

    if (filtrarPorDataAtual) {
        const hoje = new Date();
        const dataAtualISO = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        dadosFiltrados = dadosFiltrados.filter(item => {
            if (item.data) {
                const dataItemISO = new Date(item.data).toISOString().split('T')[0];
                return dataItemISO === dataAtualISO;
            }
            return false;
        });
    } else {
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
        } else if (dataInicialFilter) {
            const dataInicial = new Date(dataInicialFilter + 'T00:00:00-03:00').getTime();
            dadosFiltrados = dadosFiltrados.filter(item => item.data && new Date(item.data).getTime() >= dataInicial);
        } else if (dataFinalFilter) {
            const dataFinal = new Date(dataFinalFilter + 'T23:59:59-03:00').getTime() + 86399999;
            dadosFiltrados = dadosFiltrados.filter(item => item.data && new Date(item.data).getTime() <= dataFinal);
        }
    }

    if (localidadeFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.localidade && item.localidade.toLowerCase().includes(localidadeFilter.toLowerCase()));
    }
    if (quarteiraoFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.quarteirao && item.quarteirao.toLowerCase().includes(quarteiraoFilter.toLowerCase()));
    }
    if (tipoImovelFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipoImovel === tipoImovelFilter);
    }
    if (tipoVisitaFilter) {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipoVisita === tipoVisitaFilter);
    }

    renderTable(dadosFiltrados);
    return dadosFiltrados;
}

function limparFiltros() {
    document.getElementById('localidadeFilter').value = '';
    document.getElementById('quarteiraoFilter').value = '';
    document.getElementById('tipoImovelFilter').value = '';
    document.getElementById('tipoVisitaFilter').value = '';
    document.getElementById('dataInicialFilter').value = '';
    document.getElementById('dataFinalFilter').value = '';

    const hoje = new Date();
    const hojeISO = hoje.toISOString().split('T')[0]; // Formato<ctrl3348>-MM-DD

    const dataInicialFilter = document.getElementById('dataInicialFilter');
    const dataFinalFilter = document.getElementById('dataFinalFilter');

    if (dataInicialFilter) {
        dataInicialFilter.value = hojeISO;
    }
    if (dataFinalFilter) {
        dataFinalFilter.value = hojeISO;
    }

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
    let y = 10;

    doc.text(`Boletim Diário - Responsável: ${nomeResponsavel} `, 10, y);
    y += 10;

    const tableHeaders = [
        'Localidade', 'Data', 'Qua.', 'Rua', 'Nº', 'Tipo', 'Visita', 'Hab.',
        'Insp,', 'A1', 'A2', 'B', 'C', 'D1', 'D2', 'E', 'Elim.',
        'Amostra', 'Qtd. Amostras', 'N A. Ini', 'N A. Fin', 'Trat.', 'Qtd Larv.', 'Qtd Dep. Trat.'
    ];

    const dadosFiltradosParaPdf = aplicarFiltros();

    const tableData = dadosFiltradosParaPdf.map(item => [
        item.localidade || '-',
        item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-',
        item.quarteirao || '-',
        item.nomeRua || '-',
        item.numeroImovel || '-',
        item.tipoImovel || '-',
        item.tipoVisita || '-',
        item.habitantes || '-',
        item.inspecionado ? 'X' : '-',
        item.a1 || '-',
        item.a2 || '-',
        item.b || '-',
        item.c || '-',
        item.d1 || '-',
        item.d2 || '-',
        item.e || '-',
        item.eliminados || '-',
        item.amostraColetada ? 'X' : '-',
        item.quantidadeAmostras || '-',
        item.numeroAmostraInicial || '-',
        item.numeroAmostraFinal || '-',
        item.tratado ? 'X' : '-',
        item.quantidadeLarvicida || '-',
        item.quantidadeDepositosTratados || '-'
    ]);

    let totalR = 0, totalC = 0, totalTB = 0, totalPE = 0, totalO = 0, totalPendentes = 0; 


    // Calcular totais
    let contadorRegistros = 0, contadorNormal = 0, somaHabitantes = 0, somaA1 = 0, somaA2 = 0, somaB = 0, somaC = 0, somaD1 = 0, somaD2 = 0, somaE = 0, somaEliminados = 0, somaQuantidadeAmostras = 0, somaQuantidadeLarvicida = 0, somaQuantidadeDepositosTratados = 0;
    let inspecionados = 0, amostrasColetadas = 0, tratados = 0;

    dadosFiltradosParaPdf.forEach(item => {
        contadorRegistros++;

        if(item.tipoVisita === 'N' && item.tipoImovel === 'R'){
            totalR++
        }
        if(item.tipoVisita === 'N' && item.tipoImovel === 'C'){
            totalC++
        }
        if(item.tipoVisita === 'N' && item.tipoImovel === 'TB'){
            totalTB++
        }
        if(item.tipoVisita === 'N' && item.tipoImovel === 'PE'){
            totalPE++
        }
        if(item.tipoVisita === 'N' && item.tipoImovel === 'O'){
            totalO++
        }
        if(item.tipoVisita === 'N'){
            contadorNormal++
        }
        somaHabitantes += parseFloat(item.habitantes) || 0;
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

    totalPendentes = contadorRegistros - contadorNormal;

    doc.text(`R: ${totalR} - C: ${totalC} - TB: ${totalTB} - PE: ${totalPE} - O: ${totalO} - Informados: ${contadorRegistros} - Pendentes: ${totalPendentes}` , 10, y);
    y += 10;

    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: y + 10,
        styles: {
            fontSize: 8,
            rowPageBreak: 'auto',
            lineHeight: 1,
        },
    
        headStyles: {
            fillColor: [41, 128, 185], 
            textColor: 255, 
            lineWidth: 0.1, 
            lineColor: [0, 0, 0],
            cellPadding: 1
        },
        bodyStyles: {
            cellPadding: 1,
            lineWidth: 0.1, 
            lineColor: [0, 0, 0] 
        },
        footStyles: {
            lineWidth: 0.1, 
            lineColor: [0, 0, 0],
            cellPadding: 1
        },

        foot: [
            ['Total', '', '', '', '', contadorRegistros, contadorNormal,somaHabitantes, inspecionados, somaA1, somaA2, somaB, somaC, somaD1, somaD2, somaE, somaEliminados, amostrasColetadas, somaQuantidadeAmostras, '', '', tratados, somaQuantidadeLarvicida, somaQuantidadeDepositosTratados],
        ],
        
    });

    y = doc.autoTable.previous.finalY + 10;

    if (dadosCheckin) {
        doc.text(`Localização do Check-in:`, 10, y);
        doc.text(dadosCheckin.gmapsLink, 10, y + 10, {
            link: dadosCheckin.gmapsLink,
            textColor: [0, 0, 255]
        });
    }

    doc.save('Relatorio-Imoveis.pdf');
}

function gerarPdfResumo() {
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    if (!nomeResponsavel) {
        alert('O nome do responsável é obrigatório para o relatório.');
        return;
    }

    let dadosFiltrados = [...dados];
    const dataInicialFilter = document.getElementById('dataInicialFilter').value;
    const dataFinalFilter = document.getElementById('dataFinalFilter').value;

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
    } else if (dataInicialFilter) {
        const dataInicial = new Date(dataInicialFilter + 'T00:00:00-03:00').getTime();
        dadosFiltrados = dadosFiltrados.filter(item => item.data && new Date(item.data).getTime() >= dataInicial);
    } else if (dataFinalFilter) {
        const dataFinal = new Date(dataFinalFilter + 'T23:59:59-03:00').getTime() + 86399999;
        dadosFiltrados = dadosFiltrados.filter(item => item.data && new Date(item.data).getTime() <= dataFinal);
    }

    let somaHabitantes = 0, somaA1 = 0, somaA2 = 0, somaB = 0, somaC = 0, somaD1 = 0, somaD2 = 0, somaE = 0, somaEliminados = 0, somaQuantidadeAmostras = 0, somaQuantidadeLarvicida = 0, somaQuantidadeDepositosTratados = 0;
    let inspecionados = 0, amostrasColetadas = 0, tratados = 0;

    // Contagem por tipo de imóvel e tipo de visita
    const contagemImoveisPorVisita = {
        N: { R: 0, C: 0, TB: 0, PE: 0, O: 0 },
        F: { R: 0, C: 0, TB: 0, PE: 0, O: 0 },
        R: { R: 0, C: 0, TB: 0, PE: 0, O: 0 },
    };

    dadosFiltrados.forEach(item => {
        somaHabitantes += parseFloat(item.somaHabitantes) || 0;
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

        if (item.tipoImovel && item.tipoVisita && contagemImoveisPorVisita[item.tipoVisita]) {
            contagemImoveisPorVisita[item.tipoVisita][item.tipoImovel]++;
        }
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.text(`Relatório Resumo - Responsável: ${nomeResponsavel}`, 10, y);
    y += 10;

    const dataInicioRelatorio = dataInicialFilter || 'Início';
    const dataFimRelatorio = dataFinalFilter || 'Fim';
    doc.text(`Período: ${dataInicioRelatorio} a ${dataFimRelatorio}`, 10, y);
    y += 10;

    doc.text(`Inspecionados: ${inspecionados}`, 10, y);
    y += 7;
    doc.text(`Amostras: ${amostrasColetadas}`, 10, y);
    y += 7;
    doc.text(`Tratados: ${tratados}`, 10, y);
    y += 10;

    doc.text(`Contagem por Tipo de Imóvel e Tipo de Visita:`, 10, y);
    y += 7;

    doc.text(`N:`, 10, y);
    y += 7;
    doc.text(`R: ${contagemImoveisPorVisita.N.R}`, 15, y);
    y += 7;
    doc.text(`C: ${contagemImoveisPorVisita.N.C}`, 15, y);
    y += 7;
    doc.text(`TB: ${contagemImoveisPorVisita.N.TB}`, 15, y);
    y += 7;
    doc.text(`PE: ${contagemImoveisPorVisita.N.PE}`, 15, y);
    y += 7;
    doc.text(`O: ${contagemImoveisPorVisita.N.O}`, 15, y);
    y += 10;

    doc.text(`Visita Pendente (F):`, 10, y);
    y += 7;
    doc.text(`R: ${contagemImoveisPorVisita.F.R}`, 15, y);
    y += 7;
    doc.text(`C: ${contagemImoveisPorVisita.F.C}`, 15, y);
    y += 7;
    doc.text(`TB: ${contagemImoveisPorVisita.F.TB}`, 15, y);
    y += 7;
    doc.text(`PE: ${contagemImoveisPorVisita.F.PE}`, 15, y);
    y += 7;
    doc.text(`O: ${contagemImoveisPorVisita.F.O}`, 15, y);
    y += 10;

    doc.text(`Visita Recuperada (R):`, 10, y);
    y += 7;
    doc.text(`R: ${contagemImoveisPorVisita.R.R}`, 15, y);
    y += 7;
    doc.text(`C: ${contagemImoveisPorVisita.R.C}`, 15, y);
    y += 7;
    doc.text(`TB: ${contagemImoveisPorVisita.R.TB}`, 15, y);
    y += 7;
    doc.text(`PE: ${contagemImoveisPorVisita.R.PE}`, 15, y);
    y += 7;
    doc.text(`O: ${contagemImoveisPorVisita.R.O}`, 15, y);
    y += 10;

    doc.text(`Outros Totais:`, 10, y);
    y += 7;
    doc.text(`  Habitantes: ${somaHabitantes}`, 15, y);
    y += 7;
    doc.text(`  Soma de A1: ${somaA1}`, 15, y);
    y += 7;
    doc.text(`  Soma de A2: ${somaA2}`, 15, y);
    y += 7;
    doc.text(`  Soma de B: ${somaB}`, 15, y);
    y += 7;
    doc.text(`  Soma de C: ${somaC}`, 15, y);
    y += 7;
    doc.text(`  Soma de D1: ${somaD1}`, 15, y);
    y += 7;
    doc.text(`  Soma de D2: ${somaD2}`, 15, y);
    y += 7;
    doc.text(`  Soma de E: ${somaE}`, 15, y);
    y += 7;
    doc.text(`  Soma de Eliminados: ${somaEliminados}`, 15, y);
    y += 7;
    doc.text(`  Amostras: ${somaQuantidadeAmostras}`, 15, y);
    y += 7;
    doc.text(`  Larvicida: ${somaQuantidadeLarvicida}`, 15, y);
    y += 7;
    doc.text(`  Depósitos Tratados: ${somaQuantidadeDepositosTratados}`, 15, y);

    doc.save(`relatorio-resumo-${dataInicioRelatorio}-a-${dataFimRelatorio}.pdf`);
}

aplicarFiltros(); // Renderiza a tabela com os dados iniciais