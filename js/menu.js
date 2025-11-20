/**
 * MENU.JS - Funcionalidade do Menu Mobile
 * Barra Interativa termometro
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