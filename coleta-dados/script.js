function salvarDados() {
    const localidade = document.getElementById('localidade').value;
    const quarteirao = document.getElementById('quarteirao').value;
    const nomeRua = document.getElementById('nomeRua').value;
    const numeroImovel = document.getElementById('numeroImovel').value;
    const tipoImovel = document.getElementById('tipoImovel').value;
    const tipoVisita = document.getElementById('tipoVisita').value;
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

    dadosColetados.push(novoDado);
    localStorage.setItem('dadosColetados', JSON.stringify(dadosColetados));
    alert('Dados salvos com sucesso!');
    window.location.href = '../lista-dados/index.html'; // Redireciona para a lista de dados
}