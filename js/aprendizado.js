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

function atualizarProgressoFase() {
    const fases = document.querySelectorAll('.fase-trilha');
    
    fases.forEach(fase => {
        if (fase.classList.contains('bloqueada')) return;
        
        const modulosDaFase = fase.querySelectorAll('.card-modulo');
        const modulosConcluidos = fase.querySelectorAll('.card-modulo.concluido').length;
        const totalModulos = modulosDaFase.length;
        
        const percentual = (modulosConcluidos / totalModulos) * 100;
        
        const barraProgresso = fase.querySelector('.fase-progresso-preenchimento');
        const textoProgresso = fase.querySelector('.fase-progresso-texto');
        
        if (barraProgresso) {
            barraProgresso.style.width = `${percentual}%`;
        }
        
        if (textoProgresso) {
            textoProgresso.textContent = `${modulosConcluidos} de ${totalModulos} módulos`;
        }
        
        // Se completou fase 1, desbloqueia conquista
        if (percentual === 100) {
            const numeroFase = parseInt(fase.dataset.fase);
            
            if (numeroFase === 1) {
                desbloquearConquista('Fase Completa', 6, 6);
            }
        }
    });
}

function desbloquearProximaFase(numeroAtual) {
    const proximoNumero = numeroAtual + 1;
    const proximaFase = document.querySelector(`[data-fase="${proximoNumero}"]`);
    
    if (proximaFase && proximaFase.classList.contains('bloqueada')) {
        setTimeout(() => {
            proximaFase.classList.remove('bloqueada');
            
            const textoStatus = proximaFase.querySelector('.fase-progresso-texto');
            if (textoStatus) {
                textoStatus.innerHTML = '0 de X módulos';
            }
            
            // Remove blur dos módulos
            const gradeModulos = proximaFase.querySelector('.grade-modulos-blur');
            if (gradeModulos) {
                gradeModulos.classList.remove('grade-modulos-blur');
                // Aqui você adicionaria os módulos reais da próxima fase
            }
            
            // Scroll suave até a nova fase
            proximaFase.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
    }
}

function verificarConquistas() {
    const modulosConcluidos = document.querySelectorAll('.card-modulo.concluido').length;
    const modulosFase1Concluidos = document.querySelectorAll('[data-fase="1"] .card-modulo.concluido').length;
    
    // Primeira Linha: Complete o primeiro módulo
    if (modulosConcluidos === 1) {
        desbloquearConquista('Primeira Linha', 1, 1);
    }
}

function desbloquearConquista(tituloConquista, progresso, total) {
    const conquistas = document.querySelectorAll('.card-conquista');
    
    conquistas.forEach(card => {
        const titulo = card.querySelector('.conquista-titulo')?.textContent;
        
        if (titulo === tituloConquista && card.classList.contains('bloqueada')) {
            card.classList.remove('bloqueada');
            card.classList.add('desbloqueada');
            
            // Atualiza barra de progresso
            const preenchimento = card.querySelector('.conquista-preenchimento');
            const textoProgresso = card.querySelector('.conquista-progresso span');
            
            if (preenchimento) {
                preenchimento.style.width = '100%';
            }
            
            if (textoProgresso) {
                textoProgresso.textContent = `${progresso}/${total}`;
            }
            
            // Animação de desbloqueio
            card.style.animation = 'pulsoSuave 0.8s ease';
            
            console.log(`🏆 Conquista desbloqueada: ${tituloConquista}`);
        }
    });
}

// ========================================
// SISTEMA DE NOTIFICAÇÕES
// ========================================

function mostrarNotificacao(mensagem, tipo = 'info') {
    // Não exibe notificações em dispositivos menores que 1024px
    if (window.innerWidth < 1024) return;
    
    // Cria elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

// ========================================
// BOTÕES DE COMUNIDADE
// ========================================

function inicializarBotoesComunidade() {
    const botoesComunidade = document.querySelectorAll('.secao-comunidade .botao-secundario, .secao-comunidade .botao-principal');
    
    botoesComunidade.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarPopupDesenvolvimento();
        });
    });
}

function mostrarPopupDesenvolvimento() {
    // Cria overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // Cria popup
    const popup = document.createElement('div');
    popup.className = 'popup-desenvolvimento';
    popup.innerHTML = `
        <div class="popup-iconedev">
            <i class="fas fa-tools"></i>
        </div>
        <h3 class="popup-titulo">Funcionalidade em Desenvolvimento</h3>
        <p class="popup-texto">
            Esta funcionalidade estará disponível em breve. Estamos trabalhando para trazer a melhor experiência para você!
        </p>
        <button class="popup-botao-fechar">
            <i class="fas fa-times"></i> Fechar
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Anima entrada
    setTimeout(() => {
        overlay.classList.add('ativo');
        popup.classList.add('ativo');
    }, 10);
    
    // Botão fechar
    const botaoFechar = popup.querySelector('.popup-botao-fechar');
    botaoFechar.addEventListener('click', () => fecharPopup(overlay, popup));
    
    // Clique no overlay fecha
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            fecharPopup(overlay, popup);
        }
    });
    
    // ESC fecha
    document.addEventListener('keydown', function fecharComEsc(e) {
        if (e.key === 'Escape') {
            fecharPopup(overlay, popup);
            document.removeEventListener('keydown', fecharComEsc);
        }
    });
}

function fecharPopup(overlay, popup) {
    popup.classList.remove('ativo');
    overlay.classList.remove('ativo');
    
    setTimeout(() => {
        overlay.remove();
    }, 300);
}

// ========================================
// CARREGAMENTO DE DADOS DO USUÁRIO
// ========================================

function carregarDadosUsuario() {
    // Em produção, estes dados viriam de uma API/localStorage
    // Aqui simulamos dados baseados no questionário anterior
    
    // Tenta pegar dados do localStorage (se vieram da página rota.html)
    const perfilArmazenado = localStorage.getItem('perfilUsuario');
    
    if (perfilArmazenado) {
        try {
            const perfil = JSON.parse(perfilArmazenado);
            
            // Atualiza informações do perfil
            if (perfil.profissaoAtual) {
                document.getElementById('perfilAtual').textContent = 
                    formatarProfissao(perfil.profissaoAtual);
            }
            
            if (perfil.novaCarreira) {
                document.getElementById('novaRota').textContent = perfil.novaCarreira;
            }
            
            if (perfil.duracaoEstimada) {
                document.getElementById('duracaoEstimada').textContent = perfil.duracaoEstimada;
            }
        } catch (e) {
            console.error('Erro ao carregar perfil:', e);
        }
    }
}

function formatarProfissao(profissao) {
    const mapa = {
        'caixa': 'Operador de Caixa',
        'telemarketing': 'Operador de Telemarketing',
        'recepcionista': 'Recepcionista',
        'assistente-admin': 'Assistente Administrativo',
        'atendente': 'Atendente',
        'motorista': 'Motorista',
        'operador-maquina': 'Operador de Máquinas',
        'faxineiro': 'Auxiliar de Limpeza',
        'bancario': 'Bancário',
        'vendedor': 'Vendedor'
    };
    
    return mapa[profissao] || profissao;
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

// Observer para animar elementos ao scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observa cards de módulos
document.querySelectorAll('.card-modulo').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Observa cards de conquistas
document.querySelectorAll('.card-conquista').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Mensagem motivacional aleatória ao carregar
const mensagensMotivacionais = [
    '💪 Você está no caminho certo!',
    '🎯 Foco e determinação!',
    '🚀 Cada dia é um passo mais perto!',
    '⭐ Acredite no seu potencial!',
    '🔥 Continue firme na jornada!'
];

setTimeout(() => {
    const mensagemAleatoria = mensagensMotivacionais[
        Math.floor(Math.random() * mensagensMotivacionais.length)
    ];
    mostrarNotificacao(mensagemAleatoria, 'info');
}, 2000);

// ========================================
// BOTÃO CONTINUAR APRENDENDO
// ========================================

function inicializarBotaoContinuar() {
    const botaoContinuar = document.querySelector('.botao-completo');
    
    if (botaoContinuar) {
        botaoContinuar.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Busca o próximo módulo disponível ou em andamento
            const moduloEmAndamento = document.querySelector('.card-modulo.em-andamento');
            const moduloDisponivel = document.querySelector('.card-modulo.disponivel');
            
            const proximoModulo = moduloEmAndamento || moduloDisponivel;
            
            if (proximoModulo) {
                // Scroll suave até o módulo
                proximoModulo.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Adiciona efeito visual de destaque
                proximoModulo.style.animation = 'none';
                setTimeout(() => {
                    proximoModulo.style.animation = 'destacarModulo 1.2s ease-in-out';
                }, 10);
                
                // Remove a animação após completar
                setTimeout(() => {
                    proximoModulo.style.animation = '';
                }, 1200);
        }   });
        
        // Atualiza texto do botão dinamicamente
        atualizarTextoBotaoContinuar();
    }
}

function atualizarTextoBotaoContinuar() {
    const botaoContinuar = document.querySelector('.botao-completo');
    if (!botaoContinuar) return;
    
    const moduloEmAndamento = document.querySelector('.card-modulo.em-andamento');
    const modulosDisponiveis = document.querySelectorAll('.card-modulo.disponivel');
    const modulosConcluidos = document.querySelectorAll('.card-modulo.concluido').length;
    
    if (moduloEmAndamento) {
        botaoContinuar.innerHTML = '<i class="fas fa-play-circle"></i> Continuar de Onde Parei';
    } else if (modulosDisponiveis.length > 0) {
        if (modulosConcluidos === 0) {
            botaoContinuar.innerHTML = '<i class="fas fa-rocket"></i> Começar Minha Jornada';
        } else {
            botaoContinuar.innerHTML = '<i class="fas fa-arrow-right"></i> Próximo Módulo';
        }
    } else {
        botaoContinuar.innerHTML = '<i class="fas fa-trophy"></i> Todos os Módulos Concluídos';
        botaoContinuar.style.background = 'linear-gradient(135deg, #52c9b3, #45b597)';
    }
}

console.log('🎓 Sistema de Aprendizado Gamificado carregado com sucesso!');
