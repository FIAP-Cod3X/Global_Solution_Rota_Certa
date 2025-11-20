/* ============================================================================
   ANIMAÇÃO AO SCROLL (Intersection Observer API)
   ============================================================================
   
   O que faz:
   - Detecta quando elementos entram na área visível da tela (viewport)
   - Adiciona classe CSS que ativa animações definidas no CSS
   - Melhora a experiência do usuário com animações suaves e profissionais
   
   Por que usar Intersection Observer?
   - Melhor performance que scroll events (não trava a página)
   - API nativa do browser (não precisa de bibliotecas externas)
   - Funciona automaticamente quando o usuário faz scroll
   
   Como funciona:
   1. Define opções de quando ativar (threshold e rootMargin)
   2. Cria um "observador" que fica de olho nos elementos
   3. Quando elemento entra na tela, adiciona classe de animação
   4. Para de observar depois (anima só uma vez para performance)
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CONFIGURAÇÃO DO OBSERVER ==========
    const opcoes = {
        // threshold: Porcentagem do elemento que precisa estar visível
        // 0.1 = 10% do elemento precisa aparecer para ativar
        threshold: 0.1,
        
        // rootMargin: Margem virtual ao redor da viewport
        // Negativo = ativa ANTES do elemento entrar totalmente
        // '0px 0px -50px 0px' = 50px antes de chegar no fim da tela
        rootMargin: '0px 0px -50px 0px'
    };
    
    // ========== CRIA O INTERSECTION OBSERVER ==========
    // Recebe callback (função) que executa quando elemento entra/sai da tela
    const observer = new IntersectionObserver(function(entries) {
        // entries = array com todos os elementos observados
        entries.forEach(function(entry) {
            
            // isIntersecting = true quando elemento entra na viewport
            if (entry.isIntersecting) {
                
                // entry.target = o elemento HTML específico
                // classList.add() = adiciona classe CSS
                entry.target.classList.add('animar-entrada');
                
                // unobserve() = para de observar este elemento
                // Economiza processamento (anima só uma vez)
                observer.unobserve(entry.target);
            }
        });
    }, opcoes);
    
    // ========== SELECIONA ELEMENTOS PARA ANIMAR ==========
    // querySelectorAll() = busca TODOS os elementos que combinam com os seletores
    // Usa vírgula para selecionar múltiplas classes
    const elementosAnimar = document.querySelectorAll(
        '.passo-tempo, .cartao-diferencial, .cartao-barreira, .cartao-ods, .cartao-depoimento'
    );
    
    // ========== INICIA A OBSERVAÇÃO ==========
    // forEach() = percorre array executando função para cada item
    elementosAnimar.forEach(function(elemento) {
        // observe() = começa a observar o elemento
        observer.observe(elemento);
    });
    
    // Log para debug (verificar se script foi carregado)
    console.log('✨ Animações ao scroll ativadas!', elementosAnimar.length, 'elementos observados');
});


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


/* ============================================================================
   TERMÔMETRO DE RISCO - Diagnóstico Interativo
   ============================================================================
   
   O que faz:
   - Calcula risco de automação baseado na profissão selecionada
   - Anima barra de progresso com cores dinâmicas
   - Mostra feedback visual e textual personalizado
   
   Dados técnicos:
   - Percentuais vêm do atributo data-risco de cada <option>
   - Barra usa width + transition CSS para animação suave
   - Classes CSS (.risco-baixo, .risco-medio, .risco-alto) definem cores
   
   UX Design aplicado:
   - Feedback imediato ao selecionar (< 100ms perceived)
   - Cores semafóricas (verde=seguro, amarelo=atenção, vermelho=urgente)
   - Texto descritivo com emoji para reforço visual
   - Animação de entrada (setTimeout) cria micro-interação satisfatória
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SELECIONA ELEMENTOS DO DOM ==========
    // getElementById() = mais rápido que querySelector para IDs
    const seletorProfissao = document.getElementById('seletorProfissao');
    const resultadoDiagnostico = document.getElementById('resultadoDiagnostico');
    const mensagemInicial = document.getElementById('mensagemInicial');
    const preenchimentoBarra = document.getElementById('preenchimentoBarra');
    const numeroPercentual = document.getElementById('numeroPercentual');
    const descricaoRisco = document.getElementById('descricaoRisco');
    
    // ========== VALIDAÇÃO: Guard Clause Pattern ==========
    // Verifica se elementos essenciais existem antes de continuar
    // ! = operador NOT (inverte boolean)
    // || = operador OR (se um OU outro for falsy)
    if (!seletorProfissao || !resultadoDiagnostico) {
        console.warn('⚠️ Elementos do diagnóstico não encontrados!');
        return; // Sai da função para evitar erros
    }
    
    // ========== FUNÇÃO: Atualizar Barra de Risco ==========
    /**
     * Atualiza visual da barra de risco com animação e cores dinâmicas
     * @param {number} porcentagem - Valor de 0 a 100 representando risco
     */
    function atualizarBarraRisco(porcentagem) {
        
        // ========== PASSO 1: Esconde Mensagem Inicial ==========
        // Condicional if: só executa se mensagemInicial existir
        if (mensagemInicial) {
            mensagemInicial.style.display = 'none';
        }
        
        // ========== PASSO 2: Mostra Resultado ==========
        // Remove display:none aplicado no CSS
        resultadoDiagnostico.style.display = 'block';
        
        // ========== PASSO 3: Atualiza Número do Percentual ==========
        // textContent = troca texto interno do elemento
        // Mais seguro que innerHTML (previne XSS)
        numeroPercentual.textContent = porcentagem;
        
        // ========== PASSO 4: Anima Barra de Progresso ==========
        // setTimeout() = executa código depois de X milissegundos
        // Delay de 100ms permite que display:block seja aplicado primeiro
        // Sem delay, transição CSS não funciona (elemento ainda hidden)
        setTimeout(function() {
            // Concatenação de string: porcentagem + '%' = "85%"
            preenchimentoBarra.style.width = porcentagem + '%';
        }, 100);
        
        // ========== PASSO 5: Remove Classes Antigas ==========
        // Limpa estado anterior antes de aplicar novo
        // Previne múltiplas classes de risco ao mesmo tempo
        preenchimentoBarra.classList.remove('risco-baixo', 'risco-medio', 'risco-alto', 'risco-critico');
        
        // ========== PASSO 6: Aplica Estilo Baseado em Faixas de Risco ==========
        // Estrutura: if / else if / else = mutual exclusion
        // Apenas um bloco será executado
        
        // FAIXA 1: Risco Baixo (0-40%)
        if (porcentagem <= 40) {
            preenchimentoBarra.classList.add('risco-baixo');
            descricaoRisco.textContent = '✅ Sua profissão tem baixo risco de automação. Continue desenvolvendo suas habilidades!';
            descricaoRisco.style.color = 'var(--cor-verde-folha)';
            descricaoRisco.style.backgroundColor = 'rgba(243, 255, 238, 0.7)';
            descricaoRisco.style.borderLeft = '4px solid #27ae60';
        } 
        // FAIXA 2: Risco Médio (41-70%)
        else if (porcentagem <= 70) {
            preenchimentoBarra.classList.add('risco-medio');
            descricaoRisco.textContent = '⚠️ Risco médio. É hora de considerar desenvolver novas competências digitais.';
            descricaoRisco.style.color = '#f39c12';
            descricaoRisco.style.backgroundColor = 'rgba(255, 254, 238, 0.7)';
            descricaoRisco.style.borderLeft = '4px solid #f39c12';
        } 
        // FAIXA 3: Risco Alto (71-100%)
        else {
            preenchimentoBarra.classList.add('risco-alto');
            descricaoRisco.textContent = '🚨 Alto risco de automação! Recomendamos iniciar sua transição de carreira agora.';
            descricaoRisco.style.color = '#e74c3c';
            descricaoRisco.style.backgroundColor = 'rgba(255, 238, 238, 0.7)';
            descricaoRisco.style.borderLeft = '4px solid #e74c3c';
        }
    }
    
    // ========== EVENT LISTENER: Mudança no Select ==========
    /**
     * Dispara quando usuário seleciona uma profissão no dropdown
     * Evento 'change' = ativa ao mudar valor do <select>
     */
    seletorProfissao.addEventListener('change', function() {
        
        // ========== CAPTURA DADOS DA OPÇÃO SELECIONADA ==========
        // this = referência ao seletorProfissao
        // this.options = array com todas as <option> do <select>
        // this.selectedIndex = índice (posição) da opção selecionada
        const opcaoSelecionada = this.options[this.selectedIndex];
        
        // ========== VALIDAÇÃO: Opção Padrão ("Selecione...") ==========
        // value === '' = usuário não selecionou profissão válida
        if (this.value === '') {
            // Esconde resultado e volta estado inicial
            resultadoDiagnostico.style.display = 'none';
            if (mensagemInicial) {
                mensagemInicial.style.display = 'block';
            }
            return; // Early return: sai da função
        }
        
        // ========== EXTRAI PERCENTUAL DE RISCO ==========
        // getAttribute() = pega valor de atributo HTML customizado
        // data-risco="85" está definido em cada <option> no HTML
        // parseInt() = converte string "85" para número 85
        const riscoAutomacao = parseInt(opcaoSelecionada.getAttribute('data-risco'));
        
        // ========== ATUALIZA INTERFACE ==========
        // Chama função que anima barra e aplica estilos
        atualizarBarraRisco(riscoAutomacao);
        
        // ========== LOG PARA DEBUG (Console do navegador) ==========
        // Útil para desenvolvimento e troubleshooting
        // .textContent = texto visível da opção
        console.log('📊 Profissão selecionada:', opcaoSelecionada.textContent, '| Risco:', riscoAutomacao + '%');
    });
    
    console.log('📊 Termômetro de risco inicializado com sucesso!');
});
