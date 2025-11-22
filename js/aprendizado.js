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

// ========================================
// INTERAÇÃO COM MÓDULOS
// ========================================

function inicializarModulos() {
    const botoesIniciar = document.querySelectorAll('.botao-iniciar');
    
    botoesIniciar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const modulo = botao.closest('.card-modulo');
            const numeroModulo = modulo.dataset.modulo;
            const tituloModulo = modulo.querySelector('.card-modulo-titulo').textContent;
            
            iniciarModulo(numeroModulo, tituloModulo);
        });
    });
}

function iniciarModulo(numero, titulo) {
    // Mostra modal de confirmação ou redireciona para o módulo
    if (confirm(`Deseja iniciar o módulo "${titulo}"?`)) {
        // Em produção, redirecionaria para a página do módulo
        console.log(`Iniciando módulo ${numero}: ${titulo}`);
        
        // Atualiza estado do módulo
        const modulo = document.querySelector(`[data-modulo="${numero}"]`);
        if (modulo) {
            modulo.classList.remove('disponivel');
            modulo.classList.add('em-andamento');
            
            const botao = modulo.querySelector('.botao-modulo');
            botao.textContent = 'Continuar Módulo';
            botao.classList.remove('botao-iniciar');
            botao.classList.add('botao-continuar');
            botao.innerHTML = '<i class="fas fa-play-circle"></i> Continuar Módulo';
            
            // Adiciona listener para completar o módulo
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                continuarModulo(numero, titulo);
            });
        }
        
        // Desbloqueia próximo módulo (simulação)
        desbloquearProximoModulo(parseInt(numero));
    }
}

function continuarModulo(numero, titulo) {
    const modulo = document.querySelector(`[data-modulo="${numero}"]`);
    if (!modulo) return;
    
    // Marca módulo como concluído
    modulo.classList.remove('em-andamento');
    modulo.classList.add('concluido');
    
    // Atualiza botão para verde e desabilitado
    const botao = modulo.querySelector('.botao-modulo');
    botao.innerHTML = '<i class="fas fa-check-circle"></i> Concluído';
    botao.style.background = 'linear-gradient(135deg, #52c9b3, #45b597)';
    botao.style.cursor = 'not-allowed';
    botao.disabled = true;
    
    console.log(`Módulo ${numero} concluído!`);
    
    // Atualiza progresso da fase
    atualizarProgressoFase();
    
    // Verifica conquistas
    verificarConquistas();
    
    // Atualiza o botão "Continuar Aprendendo"
    atualizarTextoBotaoContinuar();
}

function desbloquearProximoModulo(numeroAtual) {
    const proximoNumero = numeroAtual + 1;
    const proximoModulo = document.querySelector(`[data-modulo="${proximoNumero}"]`);
    
    if (proximoModulo && proximoModulo.classList.contains('bloqueado')) {
        setTimeout(() => {
            proximoModulo.classList.remove('bloqueado');
            proximoModulo.classList.add('disponivel');
            
            // Anima desbloqueio
            proximoModulo.style.animation = 'pulsoSuave 0.6s ease';
            
            // Atualiza footer
            const footer = proximoModulo.querySelector('.card-modulo-footer');
            footer.innerHTML = `
                <button class="botao-modulo botao-iniciar">
                    <i class="fas fa-play"></i> Iniciar Módulo
                </button>
            `;
            
            // Reaplica event listener
            const botao = footer.querySelector('.botao-iniciar');
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                const titulo = proximoModulo.querySelector('.card-modulo-titulo').textContent;
                iniciarModulo(proximoNumero, titulo);
            });
            
            // ===== ANIMAÇÃO DE MUDANÇA DE ÍCONE =====
            const icone = proximoModulo.querySelector('.card-modulo-icone');
            
            // Remove classe de bloqueado
            icone.classList.remove('bloqueado-icone');
            
            // Adiciona classe de animação de desbloqueio
            icone.classList.add('desbloqueando');
            
            // Muda o ícone de cadeado para o ícone específico do módulo
            const iconElemento = icone.querySelector('i');
            if (iconElemento) {
                // Animação de fade out do cadeado
                iconElemento.style.transition = 'all 0.3s ease';
                iconElemento.style.opacity = '0';
                iconElemento.style.transform = 'scale(0.5) rotate(180deg)';
                
                setTimeout(() => {
                    // Troca o ícone baseado no número do módulo
                    const novosIcones = {
                        2: 'fa-code', // HTML & CSS
                        3: 'fa-brands fa-square-js', // JavaScript
                        4: 'fa-code-branch', // Git
                        5: 'fa-mobile-alt', // Design Responsivo
                        6: 'fa-project-diagram' // Projeto Prático
                    };
                    
                    // Define o novo ícone ou usa o padrão
                    const novoIcone = novosIcones[proximoNumero] || 'fa-book-open';
                    iconElemento.className = `fas ${novoIcone}`;
                    
                    // Animação de fade in do novo ícone
                    iconElemento.style.opacity = '0';
                    iconElemento.style.transform = 'scale(0.5) rotate(-180deg)';
                    
                    setTimeout(() => {
                        iconElemento.style.opacity = '1';
                        iconElemento.style.transform = 'scale(1) rotate(0deg)';
                    }, 50);
                }, 300);
            }
            
            // Remove classe de animação após completar
            setTimeout(() => {
                icone.classList.remove('desbloqueando');
            }, 600);
            
            // Atualiza o botão "Continuar Aprendendo"
            atualizarTextoBotaoContinuar();
        }, 1500);
    }
}
