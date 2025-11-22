/* ============================================================================
   TABS INTERATIVAS - Seção "Como Funciona"
   ============================================================================
   
   O que faz:
   - Sistema de navegação por abas (tabs) com 5 etapas
   - Mostra/esconde conteúdo ao clicar nos botões
   - Mantém apenas 1 tab ativa por vez (mutual exclusion)
   
   Estrutura HTML necessária:
   - Botões com classe .tab-botao e atributo data-tab="1", data-tab="2", etc
   - Painéis com classe .tab-painel e id="tab-1", id="tab-2", etc
   - Classe .ativo controla visibilidade via CSS (display: none/block)
   
   Pattern usado: Progressive Disclosure
   - Esconde informação até ser necessária
   - Reduz sobrecarga cognitiva do usuário
   - Melhora performance (menos DOM renderizado)
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SELECIONA ELEMENTOS DAS TABS ==========
    // querySelectorAll() retorna NodeList (similar a array)
    const tabBotoes = document.querySelectorAll('.tab-botao');
    const tabPaineis = document.querySelectorAll('.tab-painel');
    
    // ========== VALIDAÇÃO: Verifica se tabs existem na página ==========
    // length = 0 significa que não encontrou elementos
    // return = sai da função (previne erros se tabs não existirem)
    if (tabBotoes.length === 0) {
        console.warn('⚠️ Tabs não encontradas nesta página');
        return; // Early return pattern
    }
    
    // ========== FUNÇÃO: Trocar de Tab ==========
    /**
     * Ativa uma tab específica e desativa as outras
     * @param {string} numeroTab - Número da tab (1, 2, 3, 4, 5)
     */
    function trocarTab(numeroTab) {
        
        // PASSO 1: Desativa todos os botões
        tabBotoes.forEach(function(botao) {
            botao.classList.remove('ativo');
            // Atualiza ARIA para acessibilidade
            botao.setAttribute('aria-selected', 'false');
        });
        
        // PASSO 2: Desativa todos os painéis (esconde conteúdo)
        tabPaineis.forEach(function(painel) {
            painel.classList.remove('ativo');
        });
        
        // PASSO 3: Ativa botão clicado
        // Template literal: `texto ${variavel}` = "texto valor"
        // [data-tab="1"] = seletor de atributo
        const botaoAtivo = document.querySelector(`[data-tab="${numeroTab}"]`);
        if (botaoAtivo) {
            botaoAtivo.classList.add('ativo');
            botaoAtivo.setAttribute('aria-selected', 'true');
        }
        
        // PASSO 4: Ativa painel correspondente (mostra conteúdo)
        // getElementById() = busca por ID (mais rápido que querySelector)
        const painelAtivo = document.getElementById(`tab-${numeroTab}`);
        if (painelAtivo) {
            painelAtivo.classList.add('ativo');
        }
        
        // Log para debug
        console.log('🎯 Tab ativada:', numeroTab);
    }
    
    // ========== EVENT LISTENERS: Click nos botões ==========
    tabBotoes.forEach(function(botao) {
        // addEventListener() = registra evento de click
        botao.addEventListener('click', function() {
            // this = o botão que foi clicado
            // getAttribute() = pega valor do atributo HTML
            const numeroTab = this.getAttribute('data-tab');
            
            // Chama função que troca a tab
            trocarTab(numeroTab);
        });
    });
    
    console.log('🎯 Sistema de tabs inicializado!', tabBotoes.length, 'tabs encontradas');
});
