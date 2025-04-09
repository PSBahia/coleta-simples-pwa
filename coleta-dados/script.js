document.addEventListener('DOMContentLoaded', () => {
    const inspecionadoCheckbox = document.getElementById('inspecionado');
    const amostraCheckbox = document.getElementById('amostraColetada');
    const amostraFields = document.getElementById('amostraFields');
    const tratadoCheckbox = document.getElementById('tratado');
    const tratadoFields = document.getElementById('tratadoFields');
    const group = document.querySelector('.group');
    const localidadeInput = document.getElementById('localidade');
    const quarteiraoInput = document.getElementById('quarteirao');
    const nomeRuaInput = document.getElementById('nomeRua');

    // Recupera os valores armazenados no localStorage, se existirem
    const localidadeSalva = localStorage.getItem('localidadeSalva');
    const quarteiraoSalvo = localStorage.getItem('quarteiraoSalvo');
    const nomeRuaSalva = localStorage.getItem('nomeRuaSalva');

    // Preenche os campos com os valores recuperados
    if (localidadeSalva) {
        localidadeInput.value = localidadeSalva;
    }
    if (quarteiraoSalvo) {
        quarteiraoInput.value = quarteiraoSalvo;
    }
    if (nomeRuaSalva) {
        nomeRuaInput.value = nomeRuaSalva;
    }

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


function salvarDados() {
    const localidade = document.getElementById('localidade').value;
    const quarteirao = document.getElementById('quarteirao').value;
    const nomeRua = document.getElementById('nomeRua').value;
    const numeroImovel = document.getElementById('numeroImovel').value;
    const tipoImovel = document.getElementById('tipoImovel').value;
    const tipoVisita = document.getElementById('tipoVisita').value;
    const habitantes = document.getElementById('habitantes').value;
    const inspecionado = document.getElementById('inspecionado').checked;
    const a1 = document.getElementById('a1').value;
    const a2 = document.getElementById('a2').value;
    const b = document.getElementById('b').value;
    const c = document.getElementById('c').value;
    const d1 = document.getElementById('d1').value;
    const d2 = document.getElementById('d2').value;
    const e = document.getElementById('e').value;
    const eliminados = document.getElementById('eliminados').value;
    const quantidadeAmostras = document.getElementById('quantidadeAmostras').value;
    const numeroAmostraInicial = document.getElementById('numeroAmostraInicial').value;
    const numeroAmostraFinal = document.getElementById('numeroAmostraFinal').value;
    const tratado = document.getElementById('tratado').checked;
    const quantidadeLarvicida = document.getElementById('quantidadeLarvicida').value;
    const quantidadeDepositosTratados = document.getElementById('quantidadeDepositosTratados').value;

    const dadosColetados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
    const novoDado = {
        id: Date.now(),
        localidade,
        quarteirao,
        nomeRua,
        numeroImovel,
        tipoImovel,
        tipoVisita,
        habitantes,
        inspecionado,
        a1,
        a2,
        b,
        c,
        d1,
        d2,
        e,
        eliminados,
        quantidadeAmostras,
        numeroAmostraInicial,
        numeroAmostraFinal,
        tratado,
        quantidadeLarvicida,
        quantidadeDepositosTratados,
        data: new Date().toISOString()
    };

    if (localidade == "" || quarteirao == "" || numeroImovel == ""){
        alert("Preencha todos os campos obrigatorios")
        return
    }
    else{
        dadosColetados.push(novoDado);
        localStorage.setItem('dadosColetados', JSON.stringify(dadosColetados));

        // Armazena os valores de localidade, quarteirão e nomeRua no localStorage
        localStorage.setItem('localidadeSalva', localidade);
        localStorage.setItem('quarteiraoSalvo', quarteirao);
        localStorage.setItem('nomeRuaSalva', nomeRua);

        alert('Dados salvos com sucesso!');
        window.location.href = '../lista-dados/index.html'; // Redireciona para a lista de dados
    }

}