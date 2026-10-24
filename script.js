// Variável global para controlar o modo
let modoAtual = 'gravitacional';

// Seleção dos botões e do container do equipo
const btnGravitacional = document.getElementById('btn-gravitacional');
const btnBic = document.getElementById('btn-bic');
const grupoEquipo = document.getElementById('grupo-equipo');

// Alterna para Equip. Gravitacional
btnGravitacional.addEventListener('click', function () {
    modoAtual = 'gravitacional';
    btnGravitacional.classList.add('active');
    btnBic.classList.remove('active');
    grupoEquipo.classList.remove('hidden');
});

// Alterna para Bomba de Infusão (BIC)
btnBic.addEventListener('click', function () {
    modoAtual = 'bic';
    btnBic.classList.add('active');
    btnGravitacional.classList.remove('active');
    grupoEquipo.classList.add('hidden');
});

// Manipulação do Formulário
document.getElementById('calc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const volume = parseFloat(document.getElementById('volume').value) || 0;
    const horas = parseFloat(document.getElementById('tempo-horas').value) || 0;
    const minutos = parseFloat(document.getElementById('tempo-minutos').value) || 0;
    const equipo = document.getElementById('equipo').value;
    const horaInicio = document.getElementById('hora-inicio').value;
    const intervalo = parseInt(document.getElementById('intervalo').value) || 0;

    const tempoTotalMinutos = (horas * 60) + minutos;

    if (tempoTotalMinutos <= 0) {
        alert('Por favor, informe um tempo de infusão válido (maior que 0 minutos).');
        return;
    }

    let resultadoCalculado = 0;
    let textoUnidade = '';

    if (modoAtual === 'bic') {
        resultadoCalculado = volume / (tempoTotalMinutos / 60);
        textoUnidade = 'mL / hora (BIC)';
    } else {
        if (equipo === 'macrogotas') {
            resultadoCalculado = (volume * 20) / tempoTotalMinutos;
            textoUnidade = 'gotas / minuto';
        } else {
            resultadoCalculado = (volume * 60) / tempoTotalMinutos;
            textoUnidade = 'microgotas / minuto';
        }
    }

    const resultadoArredondado = Math.round(resultadoCalculado);

    document.getElementById('valor-gotejamento').textContent = resultadoArredondado;
    document.getElementById('unidade-gotejamento').textContent = textoUnidade;

    const secaoAprazamento = document.getElementById('secao-aprazamento');
    const listaHorarios = document.getElementById('lista-horarios');
    listaHorarios.innerHTML = '';

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

    document.getElementById('resultado').classList.remove('hidden');
});

function gerarAprazamento(horarioInicial, intervaloHoras) {
    const horarios = [];
    let [horas, minutos] = horarioInicial.split(':').map(Number);
    const totalDoses = 24 / intervaloHoras;

    for (let i = 0; i < totalDoses; i++) {
        const horaFormatada = String(horas).padStart(2, '0');
        const minutoFormatado = String(minutos).padStart(2, '0');
        horarios.push(`${horaFormatada}:${minutoFormatado}h`);

        horas = (horas + intervaloHoras) % 24;
    }

    return horarios;
}
