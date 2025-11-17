/**
 * MENU.JS - Funcionalidade do Menu Mobile
 * Rota Certa - GPS da Requalificação Profissional
 * 
 * Este arquivo gerencia a abertura e fechamento do menu hambúrguer
 * em dispositivos móveis, garantindo uma navegação acessível.
 */

// Espera o DOM estar completamente carregado antes de executar
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SELEÇÃO DE ELEMENTOS =====
    // Pega os elementos do DOM que vamos manipular
    const botaoMenu = document.getElementById('botaoMenu');
    const menuNavegacao = document.getElementById('menuNavegacao');
    
    // Verifica se os elementos existem antes de continuar
    if (!botaoMenu || !menuNavegacao) {
        console.warn('Elementos do menu não encontrados!');
        return; // Para a execução se não encontrar
    }
    
    // ===== FUNÇÃO: TOGGLE DO MENU =====
    /**
     * Abre ou fecha o menu mobile
     * Adiciona/remove a classe 'ativo' que controla a visibilidade
     */
    function toggleMenu() {
        // Alterna a classe 'ativo' no botão (para animação do X)
        botaoMenu.classList.toggle('ativo');
        
        // Alterna a classe 'ativo' no menu (para mostrar/esconder)
        menuNavegacao.classList.toggle('ativo');
        
        // Atualiza o atributo ARIA para acessibilidade
        const estaAberto = menuNavegacao.classList.contains('ativo');
        botaoMenu.setAttribute('aria-expanded', estaAberto);
        
        // Previne scroll do body quando menu está aberto (só no mobile)
        if (window.innerWidth < 768) {
            document.body.style.overflow = estaAberto ? 'hidden' : '';
        }
    }
    
    // ===== EVENT LISTENER: CLICK NO BOTÃO =====
    // Quando clicar no botão hambúrguer, abre/fecha o menu
    botaoMenu.addEventListener('click', function(e) {
        e.preventDefault(); // Previne comportamento padrão
        toggleMenu();
    });
    
    // ===== EVENT LISTENER: CLICK NOS LINKS DO MENU =====
    // Fecha o menu quando clicar em um link (melhora UX)
    const linksMenu = menuNavegacao.querySelectorAll('a');
    linksMenu.forEach(function(link) {
        link.addEventListener('click', function() {
            // Só fecha se o menu estiver aberto
            if (menuNavegacao.classList.contains('ativo')) {
                toggleMenu();
            }
        });
    });
    
    // ===== EVENT LISTENER: REDIMENSIONAMENTO DA TELA =====
    // Fecha o menu automaticamente se a tela ficar maior que 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            // Remove as classes ativas
            botaoMenu.classList.remove('ativo');
            menuNavegacao.classList.remove('ativo');
            // Restaura o scroll do body
            document.body.style.overflow = '';
            // Atualiza ARIA
            botaoMenu.setAttribute('aria-expanded', 'false');
        }
    });
    
    // ===== EVENT LISTENER: TECLA ESC FECHA O MENU =====
    // Acessibilidade: permite fechar com a tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuNavegacao.classList.contains('ativo')) {
            toggleMenu();
        }
    });
    
    // ===== EVENT LISTENER: CLICK FORA DO MENU =====
    // Fecha o menu se clicar fora dele (comportamento esperado)
    document.addEventListener('click', function(e) {
        // Verifica se o clique foi fora do menu e do botão
        const clicouNoMenu = menuNavegacao.contains(e.target);
        const clicouNoBotao = botaoMenu.contains(e.target);
        
        // Se não clicou em nenhum dos dois E o menu está aberto
        if (!clicouNoMenu && !clicouNoBotao && menuNavegacao.classList.contains('ativo')) {
            toggleMenu();
        }
    });
    
    console.log('Menu mobile inicializado com sucesso! 🧭');
});

/**
 * SCROLL SUAVE PARA ÂNCORAS
 * Quando clicar em links com #, rola suavemente até a seção
 */
document.addEventListener('DOMContentLoaded', function() {
    // Pega todos os links que começam com #
    const linksAncora = document.querySelectorAll('a[href^="#"]');
    
    linksAncora.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Pega o href do link (ex: #diagnostico)
            const destino = this.getAttribute('href');
            
            // Se for só #, não faz nada
            if (destino === '#') return;
            
            // Tenta encontrar o elemento com esse ID
            const elemento = document.querySelector(destino);
            
            // Se encontrou, rola até ele suavemente
            if (elemento) {
                e.preventDefault(); // Previne o scroll padrão
                elemento.scrollIntoView({
                    behavior: 'smooth', // Scroll suave
                    block: 'start' // Alinha no topo
                });
            }
        });
    });
});

/**
 * ANIMAÇÃO AO SCROLL (Intersection Observer)
 * Anima elementos quando eles entram na viewport
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do observer
    const opcoes = {
        threshold: 0.1, // Ativa quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem inferior negativa
    };
    
    // Cria o observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            // Se o elemento entrou na tela
            if (entry.isIntersecting) {
                // Adiciona classe de animação
                entry.target.classList.add('animar-entrada');
                // Para de observar (anima só uma vez)
                observer.unobserve(entry.target);
            }
        });
    }, opcoes);
    
    // Seleciona elementos para animar
    const elementosAnimar = document.querySelectorAll(
        '.passo-tempo, .cartao-diferencial, .cartao-barreira, .cartao-ods, .cartao-depoimento'
    );
    
    // Observa cada elemento
    elementosAnimar.forEach(function(elemento) {
        observer.observe(elemento);
    });
});

/**
 * DIAGNÓSTICO INTERATIVO COM BARRA DE RISCO
 * Atualiza a barra de risco conforme a profissão selecionada
 */
document.addEventListener('DOMContentLoaded', function() {
    // Pega os elementos
    const seletorProfissao = document.getElementById('seletorProfissao');
    const resultadoDiagnostico = document.getElementById('resultadoDiagnostico');
    const mensagemInicial = document.getElementById('mensagemInicial');
    const preenchimentoBarra = document.getElementById('preenchimentoBarra');
    const numeroPercentual = document.getElementById('numeroPercentual');
    const descricaoRisco = document.getElementById('descricaoRisco');
    
    // Verifica se os elementos existem
    if (!seletorProfissao || !resultadoDiagnostico) {
        console.warn('Elementos do diagnóstico não encontrados!');
        return;
    }
    
    /**
     * Função que atualiza a barra de risco
     * @param {number} porcentagem - Valor de 0 a 100
     */
    function atualizarBarraRisco(porcentagem) {
        // Esconde a mensagem inicial
        if (mensagemInicial) {
            mensagemInicial.style.display = 'none';
        }
        
        // Mostra o resultado removendo display:none
        resultadoDiagnostico.style.display = 'block';
        
        // Atualiza o número do percentual
        numeroPercentual.textContent = porcentagem;
        
        // Atualiza a largura da barra (com delay para animação)
        setTimeout(function() {
            preenchimentoBarra.style.width = porcentagem + '%';
        }, 100);
        
        // Remove todas as classes de risco
        preenchimentoBarra.classList.remove('risco-baixo', 'risco-medio', 'risco-alto', 'risco-critico');
        
        // Define a cor e texto conforme o nível de risco
        if (porcentagem <= 40) {
            preenchimentoBarra.classList.add('risco-baixo');
            descricaoRisco.textContent = '✅ Sua profissão tem baixo risco de automação. Continue desenvolvendo suas habilidades!';
            descricaoRisco.style.color = 'var(--cor-verde-folha)';
        } else if (porcentagem <= 70) {
            preenchimentoBarra.classList.add('risco-medio');
            descricaoRisco.textContent = '⚠️ Risco médio. É hora de considerar desenvolver novas competências digitais.';
            descricaoRisco.style.color = '#f39c12';
        } else {
            preenchimentoBarra.classList.add('risco-alto');
            descricaoRisco.textContent = '🚨 Alto risco de automação! Recomendamos iniciar sua transição de carreira agora.';
            descricaoRisco.style.color = '#e74c3c';
        }
    }
    
    /**
     * Event Listener: Quando seleciona uma profissão
     */
    seletorProfissao.addEventListener('change', function() {
        // Pega a opção selecionada
        const opcaoSelecionada = this.options[this.selectedIndex];
        
        // Se for a opção padrão ("Selecione..."), esconde o resultado e mostra mensagem
        if (this.value === '') {
            resultadoDiagnostico.style.display = 'none';
            if (mensagemInicial) {
                mensagemInicial.style.display = 'block';
            }
            return;
        }
        
        // Pega o valor do atributo data-risco
        const riscoAutomacao = parseInt(opcaoSelecionada.getAttribute('data-risco'));
        
        // Atualiza a barra com o valor
        atualizarBarraRisco(riscoAutomacao);
        
        // Log para debug
        console.log('Profissão:', opcaoSelecionada.textContent, '- Risco:', riscoAutomacao + '%');
    });
    
    console.log('Diagnóstico interativo inicializado! 📊');
});

/**
 * TABS INTERATIVAS - COMO FUNCIONA
 * Sistema de navegação por tabs com animação
 */
document.addEventListener('DOMContentLoaded', function() {
    // Pega todos os botões das tabs
    const tabBotoes = document.querySelectorAll('.tab-botao');
    const tabPaineis = document.querySelectorAll('.tab-painel');
    
    // Verifica se existem tabs
    if (tabBotoes.length === 0) {
        return;
    }
    
    // Função para trocar de tab
    function trocarTab(numeroTab) {
        // Remove classe ativo de todos os botões
        tabBotoes.forEach(function(botao) {
            botao.classList.remove('ativo');
        });
        
        // Remove classe ativo de todos os painéis
        tabPaineis.forEach(function(painel) {
            painel.classList.remove('ativo');
        });
        
        // Adiciona classe ativo no botão clicado
        const botaoAtivo = document.querySelector(`[data-tab="${numeroTab}"]`);
        if (botaoAtivo) {
            botaoAtivo.classList.add('ativo');
        }
        
        // Adiciona classe ativo no painel correspondente
        const painelAtivo = document.getElementById(`tab-${numeroTab}`);
        if (painelAtivo) {
            painelAtivo.classList.add('ativo');
        }
    }
    
    // Adiciona evento de click em cada botão
    tabBotoes.forEach(function(botao) {
        botao.addEventListener('click', function() {
            const numeroTab = this.getAttribute('data-tab');
            trocarTab(numeroTab);
        });
    });
    
    console.log('Tabs interativas inicializadas! 🎯');
});
