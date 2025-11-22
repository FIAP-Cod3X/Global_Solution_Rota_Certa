// ===================================
// FAQ - INTERAÇÕES E VALIDAÇÕES
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ACORDEON FAQ ==========
    const itensAcordeon = document.querySelectorAll('.item-acordeon');
    
    itensAcordeon.forEach(item => {
        const header = item.querySelector('.acordeon-header');
        
        header.addEventListener('click', () => {
            // Fechar outros itens abertos
            const itemAtivo = document.querySelector('.item-acordeon.ativo');
            if (itemAtivo && itemAtivo !== item) {
                itemAtivo.classList.remove('ativo');
            }
            
            // Toggle no item clicado
            item.classList.toggle('ativo');
        });
    });

    // ========== FILTRO POR CATEGORIA ==========
    const botoesCategoria = document.querySelectorAll('.categoria-btn');
    const semResultados = document.querySelector('.sem-resultados');
    
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            botoesCategoria.forEach(btn => btn.classList.remove('ativa'));
            
            // Adicionar classe ativa ao botão clicado
            botao.classList.add('ativa');
            
            const categoria = botao.dataset.categoria;
            let itensVisiveis = 0;
            
            // Filtrar itens
            itensAcordeon.forEach(item => {
                if (categoria === 'todas' || item.dataset.categoria === categoria) {
                    item.style.display = 'block';
                    itensVisiveis++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('ativo');
                }
            });
            
            // Mostrar mensagem se não houver resultados
            if (itensVisiveis === 0) {
                semResultados.style.display = 'block';
            } else {
                semResultados.style.display = 'none';
            }
        });
    });

    // ========== PESQUISA FAQ ==========
    const inputPesquisa = document.getElementById('inputPesquisaFaq');
    
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', function() {
            const termoPesquisa = this.value.toLowerCase().trim();
            let itensVisiveis = 0;
            
            // Resetar filtro de categoria
            botoesCategoria.forEach(btn => btn.classList.remove('ativa'));
            document.querySelector('[data-categoria="todas"]').classList.add('ativa');
            
            itensAcordeon.forEach(item => {
                const titulo = item.querySelector('.acordeon-titulo').textContent.toLowerCase();
                const conteudo = item.querySelector('.acordeon-conteudo p').textContent.toLowerCase();
                
                if (titulo.includes(termoPesquisa) || conteudo.includes(termoPesquisa)) {
                    item.style.display = 'block';
                    itensVisiveis++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('ativo');
                }
            });
            
            // Mostrar mensagem se não houver resultados
            if (termoPesquisa !== '' && itensVisiveis === 0) {
                semResultados.style.display = 'block';
            } else {
                semResultados.style.display = 'none';
            }
        });
    }

    // ========== VALIDAÇÃO DO FORMULÁRIO ==========
    const form = document.getElementById('formDuvidas');
    const campoNome = document.getElementById('nome');
    const campoEmail = document.getElementById('email');
    const campoTelefone = document.getElementById('telefone');
    const campoCategoria = document.getElementById('categoria');
    const campoAssunto = document.getElementById('assunto');
    const campoMensagem = document.getElementById('mensagem');
    const campoAceite = document.getElementById('aceiteTermos');
    const contadorAtual = document.getElementById('contadorAtual');
    const modalSucesso = document.getElementById('modalSucesso');
    const btnFecharModal = document.getElementById('btnFecharModal');

    // Contador de caracteres
    if (campoMensagem && contadorAtual) {
        campoMensagem.addEventListener('input', function() {
            const tamanho = this.value.length;
            contadorAtual.textContent = tamanho;
            
            if (tamanho > 500) {
                this.value = this.value.substring(0, 500);
                contadorAtual.textContent = 500;
            }
        });
    }

    // Máscara de telefone
    if (campoTelefone) {
        campoTelefone.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }
            
            if (valor.length > 6) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (valor.length > 0) {
                valor = valor.replace(/^(\d*)/, '($1');
            }
            
            this.value = valor;
        });
    }

    // Funções de validação
    function validarNome(nome) {
        return nome.trim().length >= 3;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefone(telefone) {
        if (telefone === '') return true; // Campo opcional
        const numeros = telefone.replace(/\D/g, '');
        return numeros.length === 10 || numeros.length === 11;
    }

    function validarAssunto(assunto) {
        return assunto.trim().length >= 5;
    }

    function validarMensagem(mensagem) {
        return mensagem.trim().length >= 20;
    }

    function mostrarErro(campo, mensagem) {
        const formGroup = campo.closest('.form-group') || campo.closest('.form-group-checkbox');
        const mensagemErro = formGroup.querySelector('.mensagem-erro');
        
        formGroup.classList.add('erro');
        formGroup.classList.remove('sucesso');
        mensagemErro.textContent = mensagem;
        
        // Scroll suave até o campo com erro
        campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function mostrarSucesso(campo) {
        const formGroup = campo.closest('.form-group');
        formGroup.classList.remove('erro');
        formGroup.classList.add('sucesso');
    }

    function limparErro(campo) {
        const formGroup = campo.closest('.form-group') || campo.closest('.form-group-checkbox');
        formGroup.classList.remove('erro');
    }

    // Validação em tempo real
    if (campoNome) {
        campoNome.addEventListener('blur', function() {
            if (!validarNome(this.value)) {
                mostrarErro(this, 'Nome deve ter pelo menos 3 caracteres');
            } else {
                mostrarSucesso(this);
            }
        });

        campoNome.addEventListener('input', function() {
            if (this.value.length > 0) {
                limparErro(this);
            }
        });
    }

    if (campoEmail) {
        campoEmail.addEventListener('blur', function() {
            if (!validarEmail(this.value)) {
                mostrarErro(this, 'E-mail inválido');
            } else {
                mostrarSucesso(this);
            }
        });

        campoEmail.addEventListener('input', function() {
            if (this.value.length > 0) {
                limparErro(this);
            }
        });
    }

    if (campoTelefone) {
        campoTelefone.addEventListener('blur', function() {
            if (this.value && !validarTelefone(this.value)) {
                mostrarErro(this, 'Telefone inválido (mín. 10 dígitos)');
            } else if (this.value) {
                mostrarSucesso(this);
            }
        });
    }

    if (campoCategoria) {
        campoCategoria.addEventListener('change', function() {
            if (this.value === '') {
                mostrarErro(this, 'Selecione uma categoria');
            } else {
                mostrarSucesso(this);
            }
        });
    }

    if (campoAssunto) {
        campoAssunto.addEventListener('blur', function() {
            if (!validarAssunto(this.value)) {
                mostrarErro(this, 'Assunto deve ter pelo menos 5 caracteres');
            } else {
                mostrarSucesso(this);
            }
        });

        campoAssunto.addEventListener('input', function() {
            if (this.value.length > 0) {
                limparErro(this);
            }
        });
    }

    if (campoMensagem) {
        campoMensagem.addEventListener('blur', function() {
            if (!validarMensagem(this.value)) {
                mostrarErro(this, 'Mensagem deve ter pelo menos 20 caracteres');
            } else {
                mostrarSucesso(this);
            }
        });

        campoMensagem.addEventListener('input', function() {
            if (this.value.length > 0) {
                limparErro(this);
            }
        });
    }

    if (campoAceite) {
        campoAceite.addEventListener('change', function() {
            limparErro(this);
        });
    }

    // Submissão do formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let formularioValido = true;
            
            // Validar todos os campos
            if (!validarNome(campoNome.value)) {
                mostrarErro(campoNome, 'Nome deve ter pelo menos 3 caracteres');
                formularioValido = false;
            }
            
            if (!validarEmail(campoEmail.value)) {
                mostrarErro(campoEmail, 'E-mail inválido');
                formularioValido = false;
            }
            
            if (campoTelefone.value && !validarTelefone(campoTelefone.value)) {
                mostrarErro(campoTelefone, 'Telefone inválido (mín. 10 dígitos)');
                formularioValido = false;
            }
            
            if (campoCategoria.value === '') {
                mostrarErro(campoCategoria, 'Selecione uma categoria');
                formularioValido = false;
            }
            
            if (!validarAssunto(campoAssunto.value)) {
                mostrarErro(campoAssunto, 'Assunto deve ter pelo menos 5 caracteres');
                formularioValido = false;
            }
            
            if (!validarMensagem(campoMensagem.value)) {
                mostrarErro(campoMensagem, 'Mensagem deve ter pelo menos 20 caracteres');
                formularioValido = false;
            }
            
            if (!campoAceite.checked) {
                mostrarErro(campoAceite, 'Você deve aceitar os termos de privacidade');
                formularioValido = false;
            }
            
            if (formularioValido) {
                // Simular envio (adicionar loading)
                const botaoEnviar = form.querySelector('.botao-enviar-form');
                const textoOriginal = botaoEnviar.innerHTML;
                
                botaoEnviar.classList.add('loading');
                botaoEnviar.innerHTML = '<i class="fas fa-spinner"></i> Enviando...';
                botaoEnviar.disabled = true;
                
                // Simular delay de envio
                setTimeout(() => {
                    // Resetar formulário
                    form.reset();
                    
                    // Remover classes de validação
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('sucesso', 'erro');
                    });
                    
                    // Resetar contador
                    if (contadorAtual) {
                        contadorAtual.textContent = '0';
                    }
                    
                    // Restaurar botão
                    botaoEnviar.classList.remove('loading');
                    botaoEnviar.innerHTML = textoOriginal;
                    botaoEnviar.disabled = false;
                    
                    // Mostrar modal de sucesso
                    modalSucesso.classList.add('ativo');
                    
                    // Scroll para o topo suavemente
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 2000);
            }
        });
    }

    // Fechar modal
    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', function() {
            modalSucesso.classList.remove('ativo');
        });
    }

    // Fechar modal clicando fora
    if (modalSucesso) {
        modalSucesso.addEventListener('click', function(e) {
            if (e.target === modalSucesso) {
                modalSucesso.classList.remove('ativo');
            }
        });
    }

    // Prevenir link de termos (simulação)
    const linkTermos = document.querySelector('.link-termos');
    if (linkTermos) {
        linkTermos.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Página de Termos de Privacidade em desenvolvimento.');
        });
    }
});
