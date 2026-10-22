document.getElementById('calc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // 1. Captura do volume
    const volume = parseFloat(document.getElementById('volume').value) || 0;

    // 2. Captura das horas e minutos separadamente
    const horas = parseFloat(document.getElementById('tempo-horas').value) || 0;
    const minutos = parseFloat(document.getElementById('tempo-minutos').value) || 0;

    // 3. Captura do equipo, hora de início e intervalo
    const equipo = document.getElementById('equipo').value;
    const horaInicio = document.getElementById('hora-inicio').value;
    const intervalo = parseInt(document.getElementById('intervalo').value) || 0;

    // 4. Conversão do tempo total para minutos
    const tempoTotalMinutos = (horas * 60) + minutos;

    // Validação para evitar divisão por zero ou números negativos
    if (tempoTotalMinutos <= 0) {
        alert('Por favor, informe um tempo de infusão válido (maior que 0 minutos).');
        return;
    }

    // 5. Cálculo do gotejamento baseado no total de minutos
    let gotejamento = 0;

    if (equipo === 'macrogotas') {
        gotejamento = (volume * 20) / tempoTotalMinutos;
    } else {
        gotejamento = (volume * 60) / tempoTotalMinutos;
    }

    // Arredondando para número inteiro (padrão da enfermagem)
    const gotejamentoArredondado = Math.round(gotejamento);

    // 6. Atualiza a tela com os resultados do gotejamento
    document.getElementById('valor-gotejamento').textContent = gotejamentoArredondado;
    document.getElementById('unidade-gotejamento').textContent = 
        equipo === 'macrogotas' ? 'gotas / minuto' : 'microgotas / minuto';

    // 7. Cálculo e exibição do aprazamento
    const secaoAprazamento = document.getElementById('secao-aprazamento');
    const listaHorarios = document.getElementById('lista-horarios');
    listaHorarios.innerHTML = ''; // Limpa os horários da busca anterior

    if (horaInicio && intervalo > 0) {
        const horarios = gerarAprazamento(horaInicio, intervalo);
        horarios.forEach(horario => {
            const li = document.createElement('li');
            li.textContent = horario;
            listaHorarios.appendChild(li);
        });
        secaoAprazamento.classList.remove('hidden');
    } else {
        secaoAprazamento.classList.add('hidden');
    }

    // Exibe o painel geral de resultados removendo a classe 'hidden'
    document.getElementById('resultado').classList.remove('hidden');
});

// Função auxiliar para calcular os horários do aprazamento
function gerarAprazamento(horarioInicial, intervaloHoras) {
    const horarios = [];
    // O horário vem no formato "08:00", portanto dividimos usando o divisor ':'
    let [horas, minutos] = horarioInicial.split(':').map(Number);

    const totalDoses = 24 / intervaloHoras;

    for (let i = 0; i < totalDoses; i++) {
        const horaFormatada = String(horas).padStart(2, '0');
        const minutoFormatado = String(minutos).padStart(2, '0');
        horarios.push(`${horaFormatada}:${minutoFormatado}h`);

        horas = (horas + intervaloHoras) % 24; // Faz o cálculo rotativo das 24 horas
    }

    return horarios;
}