
// ===================================
// GERAL.JS - Funcionalidades Globais
// ===================================
// Scripts compartilhados entre todas as páginas

/**
 * ========== SCROLL SUAVE PARA ÂNCORAS ==========
 * 
 * Implementa navegação suave quando usuário clica em links internos (#)
 * Melhora UX: ao invés de salto brusco, rola de forma elegante
 * 
 * Funcionamento:
 * 1. Detecta todos os links que começam com #
 * 2. Intercepta o clique (preventDefault)
 * 3. Usa scrollIntoView com behavior: smooth
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SELEÇÃO DE LINKS ÂNCORA ==========
    // Selector: a[href^="#"] = tag <a> cujo href COMEÇA com #
    const linksAncora = document.querySelectorAll('a[href^="#"]');
    
    console.log(`🔗 ${linksAncora.length} links âncora detectados`);
    
    // ========== EVENT LISTENER: CLICK EM CADA LINK ==========
    linksAncora.forEach(function(link) {
        link.addEventListener('click', function(e) {
            
            // Extrai destino (ex: "#sobre", "#contato")
            const destino = this.getAttribute('href');
            
            // Guard clause: se for apenas #, não faz nada
            if (destino === '#') return;
            
            // ========== BUSCA ELEMENTO ALVO ==========
            // querySelector busca elemento com id = destino
            // Ex: destino="#sobre" busca <section id="sobre">
            const elemento = document.querySelector(destino);
            
            // ========== SCROLL SUAVE ==========
            if (elemento) {
                // Previne comportamento padrão (scroll instantâneo)
                e.preventDefault();
                
                // Rola até elemento de forma animada
                elemento.scrollIntoView({
                    behavior: 'smooth',  // Animação suave (CSS scroll-behavior)
                    block: 'start'       // Alinha topo do elemento com topo da janela
                });
                
                console.log(`🎯 Navegando para ${destino}`);
            }
        });
    });
    
    console.log('✅ Scroll suave ativado para navegação interna');
});

// Botão Voltar ao Topo
    (function() {
        const botaoTopo = document.querySelector('.botao-voltar-topo');
            
        // Mostra/esconde botão baseado no scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                botaoTopo.classList.add('visivel');
            } else {
                botaoTopo.classList.remove('visivel');
            }
        });
            
        // Clique no botão: rola suavemente para o topo
        botaoTopo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    })();

    
// ========================================
// VALIDAÇÃO E POPUP DE NEWSLETTER
// ========================================
/**
 * Sistema de validação do formulário de newsletter com popup de confirmação
 * Funcionalidades:
 * - Valida formato do email
 * - Previne envio de emails duplicados
 * - Mostra popup animado de sucesso
 * - Armazena emails inscritos (localStorage)
 * - Totalmente responsivo
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SELEÇÃO DE ELEMENTOS ==========
    const formularioNewsletter = document.querySelector('.formulario-newsletter');
    const inputEmail = document.getElementById('newsletter-email');
    
    // Verifica se elementos existem
    if (!formularioNewsletter || !inputEmail) {
        console.warn('⚠️ Formulário de newsletter não encontrado');
        return;
    }
    
    // ========== CRIA ESTRUTURA DO POPUP ==========
    const popupHTML = `
        <div class="popup-overlay" id="popupNewsletter" role="dialog" aria-modal="true" aria-labelledby="popup-titulo">
            <div class="popup-modal">
                <button class="popup-fechar" aria-label="Fechar popup" id="fecharPopup">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-icone">
                    <i class="fas fa-check"></i>
                </div>
                
                <h3 class="popup-titulo" id="popup-titulo">Inscrição Confirmada! 🎉</h3>
                
                <p class="popup-texto">
                    Obrigado por se inscrever na nossa newsletter! Você receberá novidades, 
                    dicas de carreira e oportunidades diretamente no seu email.
                </p>
                
                <div class="popup-email" id="emailInscrito"></div>
                
                <button class="popup-botao" id="botaoOk">
                    <i class="fas fa-thumbs-up"></i>
                    Entendi
                </button>
            </div>
        </div>
    `;
    
    // Insere popup no final do body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // ========== REFERÊNCIAS AOS ELEMENTOS DO POPUP ==========
    const popupOverlay = document.getElementById('popupNewsletter');
    const botaoFechar = document.getElementById('fecharPopup');
    const botaoOk = document.getElementById('botaoOk');
    const emailInscritoElement = document.getElementById('emailInscrito');
    
    // ========== FUNÇÃO: VALIDAR EMAIL ==========
    /**
     * Valida formato do email usando regex
     * @param {string} email - Email a ser validado
     * @returns {boolean} - True se válido
     */
    function validarEmail(email) {
        // Regex: verifica formato básico (usuario@dominio.com)
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // ========== FUNÇÃO: VERIFICAR SE JÁ ESTÁ INSCRITO ==========
    /**
     * Verifica no localStorage se email já foi cadastrado
     * @param {string} email - Email a verificar
     * @returns {boolean} - True se já inscrito
     */
    function jaInscrito(email) {
        // Recupera lista de emails do localStorage
        const emailsInscritos = JSON.parse(localStorage.getItem('emailsNewsletter')) || [];
        return emailsInscritos.includes(email.toLowerCase());
    }
    
    // ========== FUNÇÃO: SALVAR EMAIL ==========
    /**
     * Salva email no localStorage
     * @param {string} email - Email a salvar
     */
    function salvarEmail(email) {
        const emailsInscritos = JSON.parse(localStorage.getItem('emailsNewsletter')) || [];
        emailsInscritos.push(email.toLowerCase());
        localStorage.setItem('emailsNewsletter', JSON.stringify(emailsInscritos));
    }
    
    // ========== FUNÇÃO: MOSTRAR POPUP ==========
    /**
     * Exibe popup com animação
     * @param {string} email - Email inscrito para mostrar
     */
    function mostrarPopup(email) {
        emailInscritoElement.textContent = email;
        popupOverlay.classList.add('ativo');
        document.body.style.overflow = 'hidden'; // Previne scroll
    }
    
    // ========== FUNÇÃO: FECHAR POPUP ==========
    /**
     * Fecha popup com animação
     */
    function fecharPopup() {
        popupOverlay.classList.remove('ativo');
        document.body.style.overflow = ''; // Restaura scroll
    }
    
    // ========== FUNÇÃO: MOSTRAR ERRO ==========
    /**
     * Mostra mensagem de erro temporária
     * @param {string} mensagem - Mensagem de erro
     */
    function mostrarErro(mensagem) {
        // Remove erro anterior se existir
        const erroExistente = formularioNewsletter.querySelector('.erro-newsletter');
        if (erroExistente) erroExistente.remove();
        
        // Cria elemento de erro
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-newsletter';
        erroDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 4px;
            border-left: 3px solid #e74c3c;
        `;
        erroDiv.textContent = mensagem;
        
        // Insere após o formulário
        formularioNewsletter.parentNode.insertBefore(erroDiv, formularioNewsletter.nextSibling);
        
        // Remove erro após 4 segundos
        setTimeout(() => erroDiv.remove(), 4000);
    }
    
    // ========== EVENT LISTENER: SUBMIT DO FORMULÁRIO ==========
    formularioNewsletter.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne envio padrão
        
        const email = inputEmail.value.trim();
        
        // ========== VALIDAÇÕES ==========
        
        // 1. Verifica se email está vazio
        if (!email) {
            mostrarErro('❌ Por favor, digite seu email.');
            inputEmail.focus();
            return;
        }
        
        // 2. Valida formato do email
        if (!validarEmail(email)) {
            mostrarErro('❌ Por favor, digite um email válido.');
            inputEmail.focus();
            return;
        }
        
        // 3. Verifica se já está inscrito
        if (jaInscrito(email)) {
            mostrarErro('ℹ️ Este email já está inscrito em nossa newsletter!');
            return;
        }
        
        // ========== SUCESSO: SALVA E MOSTRA POPUP ==========
        salvarEmail(email);
        mostrarPopup(email);
        
        // Limpa campo após sucesso
        inputEmail.value = '';
        
        // Log para debug
        console.log('✅ Email inscrito com sucesso:', email);
    });
    
    // ========== EVENT LISTENERS: FECHAR POPUP ==========
    
    // Botão X
    botaoFechar.addEventListener('click', fecharPopup);
    
    // Botão OK
    botaoOk.addEventListener('click', fecharPopup);
    
    // Clique fora do popup (no overlay)
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            fecharPopup();
        }
    });
    
    // Tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.classList.contains('ativo')) {
            fecharPopup();
        }
    });
    
    console.log('📧 Sistema de newsletter inicializado!');
});
