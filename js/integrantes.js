/* ========================================
   INTEGRANTES.JS - Interatividade dos Cards
   Flip em Mobile via Clique + Animações ao Scroll
   ======================================== */

/**
 * Aguarda o DOM carregar completamente antes de executar
 * Garante que todos os elementos estejam disponíveis
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona todos os cards de integrantes
    const cardsIntegrantes = document.querySelectorAll('.card-integrante');
    
    // Adiciona evento de clique para cada card
    cardsIntegrantes.forEach(card => {
        const cardInner = card.querySelector('.card-integrante-inner');
        let isFlipped = false;
        
        // Em dispositivos móveis, adiciona clique para flip
        if (window.innerWidth <= 768) {
            card.addEventListener('click', function(e) {
                // Previne propagação se clicar em links
                if (e.target.tagName === 'A') {
                    return;
                }
                
                // Toggle flip
                isFlipped = !isFlipped;
                
                if (isFlipped) {
                    cardInner.style.transform = 'rotateY(180deg)';
                } else {
                    cardInner.style.transform = 'rotateY(0deg)';
                }
            });
        }
        
        // Permite que links funcionem normalmente
        const links = card.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
    
    // Reseta flip em resize (se passar de mobile para desktop)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                cardsIntegrantes.forEach(card => {
                    const cardInner = card.querySelector('.card-integrante-inner');
                    cardInner.style.transform = 'rotateY(0deg)';
                });
            }
        }, 250);
    });
});
