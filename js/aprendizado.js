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

// ========================================
// SISTEMA DE FILTROS E BUSCA
// ========================================

function inicializarFiltros() {
    const campoBusca = document.getElementById('campoBusca');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroNivel = document.getElementById('filtroNivel');
    
    if (campoBusca) {
        campoBusca.addEventListener('input', aplicarFiltros);
    }
    
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', aplicarFiltros);
    }
    
    if (filtroNivel) {
        filtroNivel.addEventListener('change', aplicarFiltros);
    }
}

function aplicarFiltros() {
    const textoBusca = document.getElementById('campoBusca')?.value.toLowerCase() || '';
    const categoriaSelecionada = document.getElementById('filtroCategoria')?.value || '';
    const nivelSelecionado = document.getElementById('filtroNivel')?.value || '';
    
    const modulos = document.querySelectorAll('.card-modulo');
    
    modulos.forEach(modulo => {
        const titulo = modulo.querySelector('.card-modulo-titulo')?.textContent.toLowerCase() || '';
        const descricao = modulo.querySelector('.card-modulo-descricao')?.textContent.toLowerCase() || '';
        const categoria = modulo.dataset.categoria || '';
        const nivel = modulo.dataset.nivel || '';
        
        // Verifica se passa nos filtros
        const passaBusca = !textoBusca || titulo.includes(textoBusca) || descricao.includes(textoBusca);
        const passaCategoria = !categoriaSelecionada || categoria === categoriaSelecionada;
        const passaNivel = !nivelSelecionado || nivel === nivelSelecionado;
        
        // Mostra ou esconde
        if (passaBusca && passaCategoria && passaNivel) {
            modulo.style.display = '';
            modulo.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            modulo.style.display = 'none';
        }
    });
}
