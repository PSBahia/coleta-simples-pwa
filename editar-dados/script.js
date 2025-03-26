const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));
const dados = JSON.parse(localStorage.getItem('dadosColetados')) || [];
const item = dados.find(item => item.id === id);

if (item) {
    document.getElementById('id').value = item.id;
    document.getElementById('localidade').value = item.localidade;
    document.getElementById('quarteirao').value = item.quarteirao;
    document.getElementById('nomeRua').value = item.nomeRua;
    document.getElementById('numeroImovel').value = item.numeroImovel;
    document.getElementById('tipoImovel').value = item.tipoImovel;
    document.getElementById('tipoVisita').value = item.tipoVisita;
    document.getElementById('inspecionado').checked = item.inspecionado;
    document.getElementById('a1').value = item.a1;
    document.getElementById('a2').value = item.a2;
    document.getElementById('b').value = item.b;
    document.getElementById('c').value = item.c;
    document.getElementById('d1').value = item.d1;
    document.getElementById('d2').value = item.d2;
    document.getElementById('e').value = item.e;
    document.getElementById('eliminados').value = item.eliminados;
    document.getElementById('quantidadeAmostras').value = item.quantidadeAmostras;
    document.getElementById('numeroAmostraInicial').value = item.numeroAmostraInicial;
    document.getElementById('numeroAmostraFinal').value = item.numeroAmostraFinal;
    document.getElementById('tratado').checked = item.tratado;
    document.getElementById('quantidadeLarvicida').value = item.quantidadeLarvicida;
    document.getElementById('quantidadeDepositosTratados').value = item.quantidadeDepositosTratados;
}

function salvarAlteracoes() {
    if (item) {
        item.localidade = document.getElementById('localidade').value;
        item.quarteirao = document.getElementById('quarteirao').value;
        item.nomeRua = document.getElementById('nomeRua').value;
        item.numeroImovel = document.getElementById('numeroImovel').value;
        item.tipoImovel = document.getElementById('tipoImovel').value;
        item.tipoVisita = document.getElementById('tipoVisita').value;
        item.inspecionado = document.getElementById('inspecionado').checked;
        item.a1 = document.getElementById('a1').value;
        item.a2 = document.getElementById('a2').value;
        item.b = document.getElementById('b').value;
        item.c = document.getElementById('c').value;
        item.d1 = document.getElementById('d1').value;
        item.d2 = document.getElementById('d2').value;
        item.e = document.getElementById('e').value;
        item.eliminados = document.getElementById('eliminados').value;
        item.quantidadeAmostras = document.getElementById('quantidadeAmostras').value;
        item.numeroAmostraInicial = document.getElementById('numeroAmostraInicial').value;
        item.numeroAmostraFinal = document.getElementById('numeroAmostraFinal').value;
        item.tratado = document.getElementById('tratado').checked;
        item.quantidadeLarvicida = document.getElementById('quantidadeLarvicida').value;
        item.quantidadeDepositosTratados = document.getElementById('quantidadeDepositosTratados').value;

        localStorage.setItem('dadosColetados', JSON.stringify(dados));
        alert('Dados atualizados com sucesso!');
        window.location.href = '../lista-dados/index.html';
    }
}