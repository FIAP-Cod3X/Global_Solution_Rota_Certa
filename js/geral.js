
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