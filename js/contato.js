// ===================================
// CONTATO - INTERAÇÕES E ANIMAÇÕES
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * ANIMAÇÃO AO SCROLL (Intersection Observer)
     * Anima elementos quando entram na viewport para melhor UX
     * Configuração otimizada para performance
     */
    const observerOptions = {
        threshold: 0.2, // Ativa quando 20% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem inferior negativa
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
                // Não remove observer pois queremos manter a classe 'animado'
            }
        });
    }, observerOptions);

    // Observar blocos de trajeto
    const blocosTrajeto = document.querySelectorAll('.bloco-trajeto');
    blocosTrajeto.forEach((bloco, index) => {
        bloco.style.opacity = '0';
        bloco.style.transform = 'translateY(30px)';
        bloco.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(bloco);
    });

    // Observar mapa
    const mapaDestaque = document.querySelector('.mapa-destaque');
    if (mapaDestaque) {
        mapaDestaque.style.opacity = '0';
        mapaDestaque.style.transform = 'scale(0.95)';
        mapaDestaque.style.transition = 'all 0.8s ease';
        observer.observe(mapaDestaque);
    }

    // Adicionar estilos para elementos animados
    const style = document.createElement('style');
    style.textContent = `
        .animado {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
        }
    `;
    document.head.appendChild(style);

    // Scroll suave para seção "Como Chegar"
    const linkVerMapa = document.querySelector('a[href="#secao-como-chegar"]');
    if (linkVerMapa) {
        linkVerMapa.addEventListener('click', function(e) {
            e.preventDefault();
            const secao = document.getElementById('secao-como-chegar');
            if (secao) {
                const offset = 100;
                const elementPosition = secao.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Copiar email/telefone ao clicar e manter feedback visual
    const linksContato = document.querySelectorAll('.link-contato');
    linksContato.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extrair o texto do email ou telefone
            const texto = this.textContent.trim();
            
            // Copiar para o clipboard (compatível com desktop e mobile)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // Método moderno
                navigator.clipboard.writeText(texto).catch(err => {
                    console.error('Erro ao copiar:', err);
                });
            } else {
                // Fallback para dispositivos mais antigos
                const input = document.createElement('input');
                input.value = texto;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.select();
                input.setSelectionRange(0, 99999); // Para mobile
                document.execCommand('copy');
                document.body.removeChild(input);
            }
            
            // animação visual do link
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    console.log('📍 Página de Contato carregada com sucesso!');
});
