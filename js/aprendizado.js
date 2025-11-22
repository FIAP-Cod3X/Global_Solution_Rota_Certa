/* ========================================
   APRENDIZADO.JS
   JavaScript para Página de Aprendizado Gamificada
   ======================================== */

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarProgresso();
    inicializarAbas();
    inicializarFiltros();
    inicializarModulos();
    animarCirculoProgresso();
    carregarDadosUsuario();
    inicializarBotoesComunidade();
    inicializarBotaoContinuar();
});

// ========================================
// GERENCIAMENTO DE PROGRESSO
// ========================================

function inicializarProgresso() {
    // Simula dados de progresso do usuário (em produção, viriam de um backend)
    const progressoUsuario = {
        percentual: 15,
        modulosConcluidos: 2,
        diasSequencia: 5,
        certificados: 1
    };
    
    // Atualiza estatísticas
    document.getElementById('progressoNumero').textContent = progressoUsuario.percentual;
    document.getElementById('modulosConcluidos').textContent = progressoUsuario.modulosConcluidos;
    document.getElementById('diasSequencia').textContent = progressoUsuario.diasSequencia;
    document.getElementById('certificados').textContent = progressoUsuario.certificados;
}

function animarCirculoProgresso() {
    const circulo = document.getElementById('circuloProgresso');
    const numeroProgresso = document.getElementById('progressoNumero');
    
    if (!circulo || !numeroProgresso) return;
    
    const percentual = parseInt(numeroProgresso.textContent);
    const circunferencia = 2 * Math.PI * 90; // raio = 90
    const offset = circunferencia - (percentual / 100) * circunferencia;
    
    // Animação suave
    setTimeout(() => {
        circulo.style.strokeDashoffset = offset;
    }, 500);
    
    // Anima o número
    animarNumero(numeroProgresso, 0, percentual, 1500);
}

function animarNumero(elemento, inicio, fim, duracao) {
    const range = fim - inicio;
    const incremento = range / (duracao / 16); // 60fps
    let atual = inicio;
    
    const timer = setInterval(() => {
        atual += incremento;
        if (atual >= fim) {
            atual = fim;
            clearInterval(timer);
        }
        elemento.textContent = Math.floor(atual);
    }, 16);
}

// ========================================
// SISTEMA DE ABAS
// ========================================

function inicializarAbas() {
    const abas = document.querySelectorAll('.aba-aprendizado');
    
    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            // Remove ativo de todas
            abas.forEach(a => {
                a.classList.remove('ativo');
                a.setAttribute('aria-selected', 'false');
            });
            
            // Ativa a clicada
            aba.classList.add('ativo');
            aba.setAttribute('aria-selected', 'true');
            
            // Filtra conteúdo baseado na aba
            const tipoAba = aba.dataset.aba;
            filtrarPorAba(tipoAba);
        });
    });
}

function filtrarPorAba(tipo) {
    const modulos = document.querySelectorAll('.card-modulo');
    
    modulos.forEach(modulo => {
        switch(tipo) {
            case 'trilha':
                // Mostra apenas módulos da trilha personalizada
                modulo.style.display = '';
                break;
            case 'todos':
                // Mostra todos os módulos
                modulo.style.display = '';
                break;
            case 'em-andamento':
                // Mostra apenas módulos em andamento
                if (modulo.classList.contains('em-andamento')) {
                    modulo.style.display = '';
                } else {
                    modulo.style.display = 'none';
                }
                break;
            case 'concluidos':
                // Mostra apenas módulos concluídos
                if (modulo.classList.contains('concluido')) {
                    modulo.style.display = '';
                } else {
                    modulo.style.display = 'none';
                }
                break;
        }
    });
}
