// ===================================
// QUESTIONÁRIO ROTA - JAVASCRIPT
// ===================================
// Sistema inteligente de recomendação de carreiras
// Usa Intersection Observer para animações suaves

// ========== ANIMAÇÕES DE SCROLL ==========
/**
 * Intersection Observer: Anima elementos quando aparecem na tela
 * Melhora a experiência visual do questionário multi-etapas
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Observer
    const observerConfig = {
        threshold: 0.1, // 10% do elemento visível
        rootMargin: '0px 0px -50px 0px' // Ativa antes de chegar no final
    };
    
    // Callback: o que fazer quando elemento aparece
    const animarNaEntrada = function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Adiciona classe de animação
                entry.target.classList.add('visivel');
                // Para de observar (animação só acontece 1 vez)
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Cria o Observer
    const observer = new IntersectionObserver(animarNaEntrada, observerConfig);
    
    // Elementos para animar (campos, grupos, botões)
    const elementosAnimaveis = document.querySelectorAll('.campo-grupo, .botoes-navegacao, .card-recomendacao');
    
    // Inicia observação
    elementosAnimaveis.forEach(function(elemento) {
        observer.observe(elemento);
    });
    
    console.log(`🎬 Observer ativado: ${elementosAnimaveis.length} elementos`);
});

// ========== ELEMENTOS DO FORMULÁRIO ==========
// Elementos do DOM
const formulario = document.getElementById('formularioRota');
const etapasForm = document.querySelectorAll('.etapa-form');
const indicadoresEtapa = document.querySelectorAll('.etapa-indicador');
const progressoPreenchimento = document.getElementById('progressoPreenchimento');
const telaCarregamento = document.getElementById('telaCarregamento');
const telaResultados = document.getElementById('telaResultados');

// Estado do formulário
let etapaAtual = 1;
const totalEtapas = 5;
let dadosFormulario = {};

// ===================================
// NAVEGAÇÃO ENTRE ETAPAS
// ===================================

// Atualizar progresso visual
function atualizarProgresso() {
    const percentual = (etapaAtual / totalEtapas) * 100;
    progressoPreenchimento.style.width = `${percentual}%`;
    
    // Atualizar indicadores
    indicadoresEtapa.forEach((indicador, index) => {
        const numeroEtapa = index + 1;
        indicador.classList.remove('ativa', 'completa');
        
        if (numeroEtapa < etapaAtual) {
            indicador.classList.add('completa');
        } else if (numeroEtapa === etapaAtual) {
            indicador.classList.add('ativa');
        }
    });
}

// Mostrar etapa específica
function mostrarEtapa(numeroEtapa) {
    etapasForm.forEach(etapa => etapa.classList.remove('ativa'));
    document.getElementById(`etapa-${numeroEtapa}`).classList.add('ativa');
    etapaAtual = numeroEtapa;
    atualizarProgresso();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validação de campos obrigatórios de uma etapa
function validarEtapa(numeroEtapa) {
    const etapa = document.getElementById(`etapa-${numeroEtapa}`);
    let valido = true;
    
    // Etapa 1: Perfil Básico
    if (numeroEtapa === 1) {
        const nome = document.getElementById('nome');
        const idade = document.getElementById('idade');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const escolaridade = document.getElementById('escolaridade');
        const profissaoAtual = document.getElementById('profissaoAtual');
        
        // Validar nome (mínimo 3 caracteres)
        if (!nome.value.trim() || nome.value.trim().length < 3) {
            valido = false;
            mostrarErro(nome.closest('.campo-grupo'), 'Digite seu nome completo (mínimo 3 caracteres)');
        } else {
            limparErro(nome.closest('.campo-grupo'));
        }
        
        // Validar idade (entre 16 e 100)
        const idadeValor = parseInt(idade.value);
        if (!idade.value || idadeValor < 16 || idadeValor > 100) {
            valido = false;
            mostrarErro(idade.closest('.campo-grupo'), 'Digite uma idade válida (entre 16 e 100 anos)');
        } else {
            limparErro(idade.closest('.campo-grupo'));
        }
        
        // Validar e-mail
        if (!email.value.trim() || !validarEmail(email.value)) {
            valido = false;
            mostrarErro(email.closest('.campo-grupo'), 'Digite um e-mail válido');
        } else {
            limparErro(email.closest('.campo-grupo'));
        }
        
        // Validar telefone (opcional, mas se preenchido deve ter formato válido)
        if (telefone.value.trim() && !validarTelefone(telefone.value)) {
            valido = false;
            mostrarErro(telefone.closest('.campo-grupo'), 'Digite um telefone válido (ex: (11) 98765-4321)');
        } else {
            limparErro(telefone.closest('.campo-grupo'));
        }
        
        // Validar escolaridade
        if (!escolaridade.value) {
            valido = false;
            mostrarErro(escolaridade.closest('.campo-grupo'), 'Selecione seu nível de escolaridade');
        } else {
            limparErro(escolaridade.closest('.campo-grupo'));
        }
        
        // Validar profissão atual (mínimo 3 caracteres)
        if (!profissaoAtual.value.trim() || profissaoAtual.value.trim().length < 3) {
            valido = false;
            mostrarErro(profissaoAtual.closest('.campo-grupo'), 'Digite sua profissão atual (mínimo 3 caracteres)');
        } else {
            limparErro(profissaoAtual.closest('.campo-grupo'));
        }
    }
    
    // Etapa 2: Habilidades
    if (numeroEtapa === 2) {
        const habilidadesMarcadas = etapa.querySelectorAll('input[name="habilidades"]:checked');
        if (habilidadesMarcadas.length < 3) {
            valido = false;
            document.getElementById('erroHabilidades').textContent = 'Por favor, selecione pelo menos 3 habilidades';
            document.getElementById('erroHabilidades').style.display = 'block';
        } else {
            document.getElementById('erroHabilidades').style.display = 'none';
        }
    }
    
    // Etapa 3: Experiência Profissional
    if (numeroEtapa === 3) {
        const tempoExperiencia = document.getElementById('tempoExperiencia');
        const experienciaTech = etapa.querySelector('input[name="experienciaTech"]:checked');
        
        // Validar tempo de experiência
        if (!tempoExperiencia.value) {
            valido = false;
            mostrarErro(tempoExperiencia.closest('.campo-grupo'), 'Selecione há quanto tempo trabalha na área atual');
        } else {
            limparErro(tempoExperiencia.closest('.campo-grupo'));
        }
        
        // Validar experiência com tecnologia
        if (!experienciaTech) {
            valido = false;
            const grupoRadio = etapa.querySelector('.opcoes-radio').closest('.campo-grupo');
            mostrarErro(grupoRadio, 'Selecione seu nível de experiência com tecnologia');
        } else {
            const grupoRadio = etapa.querySelector('.opcoes-radio').closest('.campo-grupo');
            limparErro(grupoRadio);
        }
    }
    
    // Etapa 4: Interesses
    if (numeroEtapa === 4) {
        const tipoTrabalho = etapa.querySelector('input[name="tipoTrabalho"]:checked');
        const ritmoTrabalho = etapa.querySelector('input[name="ritmoTrabalho"]:checked');
        
        // Validar tipo de trabalho
        if (!tipoTrabalho) {
            valido = false;
            const grupoRadio = etapa.querySelectorAll('.opcoes-radio')[0].closest('.campo-grupo');
            mostrarErro(grupoRadio, 'Selecione o tipo de trabalho que prefere');
        } else {
            const grupoRadio = etapa.querySelectorAll('.opcoes-radio')[0].closest('.campo-grupo');
            limparErro(grupoRadio);
        }
        
        // Validar ritmo de trabalho
        if (!ritmoTrabalho) {
            valido = false;
            const grupoRadio = etapa.querySelectorAll('.opcoes-radio')[1].closest('.campo-grupo');
            mostrarErro(grupoRadio, 'Selecione o ritmo de trabalho que combina com você');
        } else {
            const grupoRadio = etapa.querySelectorAll('.opcoes-radio')[1].closest('.campo-grupo');
            limparErro(grupoRadio);
        }
    }
    
    // Etapa 5: Objetivos
    if (numeroEtapa === 5) {
        const objetivo = etapa.querySelector('input[name="objetivo"]:checked');
        const tempoDisponivel = document.getElementById('tempoDisponivel');
        const expectativaSalario = document.getElementById('expectativaSalario');
        const termos = document.getElementById('termos');
        
        // Validar objetivo
        if (!objetivo) {
            valido = false;
            const grupoRadio = etapa.querySelector('.opcoes-radio').closest('.campo-grupo');
            mostrarErro(grupoRadio, 'Selecione seu principal objetivo');
        } else {
            const grupoRadio = etapa.querySelector('.opcoes-radio').closest('.campo-grupo');
            limparErro(grupoRadio);
        }
        
        // Validar tempo disponível
        if (!tempoDisponivel.value) {
            valido = false;
            mostrarErro(tempoDisponivel.closest('.campo-grupo'), 'Selecione quanto tempo pode dedicar ao estudo');
        } else {
            limparErro(tempoDisponivel.closest('.campo-grupo'));
        }
        
        // Validar expectativa salarial
        if (!expectativaSalario.value) {
            valido = false;
            mostrarErro(expectativaSalario.closest('.campo-grupo'), 'Selecione sua expectativa salarial');
        } else {
            limparErro(expectativaSalario.closest('.campo-grupo'));
        }
        
        // Validar termos
        if (!termos.checked) {
            valido = false;
            mostrarErro(termos.closest('.campo-grupo'), 'Você precisa concordar com os termos para continuar');
        } else {
            limparErro(termos.closest('.campo-grupo'));
        }
    }
    
    return valido;
}

// Mostrar mensagem de erro
function mostrarErro(grupo, mensagem) {
    if (!grupo) return;
    grupo.classList.add('erro');
    const mensagemErro = grupo.querySelector('.mensagem-erro');
    if (mensagemErro) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = 'block';
    }
}

// Limpar erro
function limparErro(grupo) {
    if (!grupo) return;
    grupo.classList.remove('erro');
    const mensagemErro = grupo.querySelector('.mensagem-erro');
    if (mensagemErro) {
        mensagemErro.style.display = 'none';
    }
}

// Validar formato de e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar formato de telefone
function validarTelefone(telefone) {
    // Remove tudo exceto números
    const numeros = telefone.replace(/\D/g, '');
    // Aceita entre 10 e 11 dígitos (com ou sem DDD)
    return numeros.length >= 10 && numeros.length <= 11;
}

// Coletar dados de uma etapa
function coletarDadosEtapa(numeroEtapa) {
    const etapa = document.getElementById(`etapa-${numeroEtapa}`);
    
    // Inputs text, email, tel, number
    const inputs = etapa.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"]');
    inputs.forEach(input => {
        if (input.value.trim()) {
            dadosFormulario[input.name] = input.value.trim();
        }
    });
    
    // Selects
    const selects = etapa.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value) {
            dadosFormulario[select.name] = select.value;
        }
    });
    
    // Textareas
    const textareas = etapa.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        if (textarea.value.trim()) {
            dadosFormulario[textarea.name] = textarea.value.trim();
        }
    });
    
    // Checkboxes (habilidades e áreas de interesse)
    if (numeroEtapa === 2) {
        const habilidades = Array.from(etapa.querySelectorAll('input[name="habilidades"]:checked'))
            .map(cb => cb.value);
        dadosFormulario.habilidades = habilidades;
    }
    
    if (numeroEtapa === 4) {
        const areasInteresse = Array.from(etapa.querySelectorAll('input[name="areasInteresse"]:checked'))
            .map(cb => cb.value);
        dadosFormulario.areasInteresse = areasInteresse;
    }
    
    // Radio buttons
    const radios = etapa.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        dadosFormulario[radio.name] = radio.value;
    });
}

// ===================================
// EVENT LISTENERS
// ===================================

// Botões "Próxima Etapa"
document.querySelectorAll('.botao-proximo').forEach(botao => {
    botao.addEventListener('click', () => {
        const proximaEtapa = parseInt(botao.dataset.proxima);
        
        if (validarEtapa(etapaAtual)) {
            coletarDadosEtapa(etapaAtual);
            mostrarEtapa(proximaEtapa);
        }
    });
});

// Botões "Voltar"
document.querySelectorAll('.botao-voltar').forEach(botao => {
    botao.addEventListener('click', () => {
        const etapaAnterior = parseInt(botao.dataset.anterior);
        mostrarEtapa(etapaAnterior);
    });
});

// Submissão do formulário
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (validarEtapa(5)) {
        coletarDadosEtapa(5);
        await processarQuestionario();
    }
});

// Validação em tempo real
document.addEventListener('DOMContentLoaded', () => {
    // Validação de nome em tempo real
    const nome = document.getElementById('nome');
    if (nome) {
        nome.addEventListener('blur', () => {
            const grupo = nome.closest('.campo-grupo');
            if (!nome.value.trim() || nome.value.trim().length < 3) {
                mostrarErro(grupo, 'Digite seu nome completo (mínimo 3 caracteres)');
            } else {
                limparErro(grupo);
            }
        });
    }
    
    // Validação de idade em tempo real
    const idade = document.getElementById('idade');
    if (idade) {
        idade.addEventListener('blur', () => {
            const grupo = idade.closest('.campo-grupo');
            const idadeValor = parseInt(idade.value);
            if (!idade.value || idadeValor < 16 || idadeValor > 100) {
                mostrarErro(grupo, 'Digite uma idade válida (entre 16 e 100 anos)');
            } else {
                limparErro(grupo);
            }
        });
    }
    
    // Validação de e-mail em tempo real
    const email = document.getElementById('email');
    if (email) {
        email.addEventListener('blur', () => {
            const grupo = email.closest('.campo-grupo');
            if (!email.value.trim() || !validarEmail(email.value)) {
                mostrarErro(grupo, 'Digite um e-mail válido');
            } else {
                limparErro(grupo);
            }
        });
    }
    
    // Validação de telefone em tempo real
    const telefone = document.getElementById('telefone');
    if (telefone) {
        telefone.addEventListener('blur', () => {
            const grupo = telefone.closest('.campo-grupo');
            if (telefone.value.trim() && !validarTelefone(telefone.value)) {
                mostrarErro(grupo, 'Digite um telefone válido (ex: (11) 98765-4321)');
            } else {
                limparErro(grupo);
            }
        });
        
        // Máscara de telefone
        telefone.addEventListener('input', () => {
            let valor = telefone.value.replace(/\D/g, '');
            if (valor.length <= 11) {
                if (valor.length <= 2) {
                    telefone.value = valor;
                } else if (valor.length <= 6) {
                    telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
                } else if (valor.length <= 10) {
                    telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
                } else {
                    telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
                }
            }
        });
    }
    
    // Validação de profissão em tempo real
    const profissaoAtual = document.getElementById('profissaoAtual');
    if (profissaoAtual) {
        profissaoAtual.addEventListener('blur', () => {
            const grupo = profissaoAtual.closest('.campo-grupo');
            if (!profissaoAtual.value.trim() || profissaoAtual.value.trim().length < 3) {
                mostrarErro(grupo, 'Digite sua profissão atual (mínimo 3 caracteres)');
            } else {
                limparErro(grupo);
            }
        });
    }
});

// ===================================
// PROCESSAMENTO E ANÁLISE
// ===================================

async function processarQuestionario() {
    // Marcar todas as etapas como completas
    indicadoresEtapa.forEach(indicador => {
        indicador.classList.remove('ativa');
        indicador.classList.add('completa');
    });
    progressoPreenchimento.style.width = '100%';
    
    // Esconder formulário e mostrar carregamento
    formulario.style.display = 'none';
    telaCarregamento.style.display = 'block';
    
    // Simular processamento com etapas
    await simularAnalise();
    
    // Gerar recomendações
    const recomendacoes = gerarRecomendacoes();
    
    // Mostrar resultados
    mostrarResultados(recomendacoes);
}

async function simularAnalise() {
    const etapas = ['etapaHabilidades', 'etapaMercado', 'etapaRecomendacoes'];
    const textos = [
        'Processando suas respostas...',
        'Avaliando suas habilidades...',
        'Analisando demanda do mercado...',
        'Calculando compatibilidade...',
        'Gerando recomendações personalizadas...'
    ];
    
    for (let i = 0; i < textos.length; i++) {
        document.getElementById('textoCarregamento').textContent = textos[i];
        
        if (i < 3 && etapas[i]) {
            await aguardar(1000);
            document.getElementById(etapas[i]).classList.add('ativa');
            await aguardar(1500);
            document.getElementById(etapas[i]).classList.remove('ativa');
            document.getElementById(etapas[i]).classList.add('completa');
        } else {
            await aguardar(1200);
        }
    }
}

function aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================
// LÓGICA DE RECOMENDAÇÃO
// ===================================

function gerarRecomendacoes() {
    const recomendacoes = [];
    
    // Base de dados de carreiras
    const carreiras = {
        'customer-success': {
            titulo: 'Customer Success',
            subtitulo: 'Sucesso do Cliente',
            descricao: 'Profissional que garante a satisfação e retenção de clientes através de relacionamento proativo, suporte estratégico e análise de métricas de sucesso.',
            salario: 'R$ 3.500 - R$ 8.000',
            demanda: 'Alta',
            tempo: '4-6 meses',
            modalidade: 'Remoto/Híbrido',
            habilidades: ['comunicacao', 'empatia', 'organizacao', 'analitico'],
            areas: ['atendimento', 'tecnologia', 'vendas'],
            objetivo: ['renda-rapida', 'carreira-longo', 'ambos']
        },
        'analista-dados': {
            titulo: 'Analista de Dados',
            subtitulo: 'Data Analytics',
            descricao: 'Profissional que transforma dados em insights acionáveis, criando relatórios, dashboards e análises que apoiam decisões estratégicas de negócio.',
            salario: 'R$ 4.000 - R$ 10.000',
            demanda: 'Muito Alta',
            tempo: '5-8 meses',
            modalidade: 'Remoto',
            habilidades: ['analitico', 'organizacao', 'atencao-detalhes', 'paciencia'],
            areas: ['tecnologia', 'administracao', 'financas'],
            objetivo: ['carreira-longo', 'ambos']
        },
        'suporte-ti': {
            titulo: 'Suporte de TI',
            subtitulo: 'Técnico de Suporte',
            descricao: 'Profissional que auxilia usuários com problemas técnicos, resolve questões de hardware e software, e mantém sistemas funcionando adequadamente.',
            salario: 'R$ 2.500 - R$ 5.500',
            demanda: 'Alta',
            tempo: '3-5 meses',
            modalidade: 'Remoto/Híbrido',
            habilidades: ['paciencia', 'comunicacao', 'analitico', 'adaptabilidade'],
            areas: ['tecnologia', 'atendimento'],
            objetivo: ['renda-rapida', 'carreira-longo', 'ambos']
        },
        'designer-ui-ux': {
            titulo: 'Designer UI/UX',
            subtitulo: 'Design de Interfaces',
            descricao: 'Profissional que projeta interfaces digitais intuitivas e atraentes, focando na experiência do usuário e na usabilidade de aplicativos e sites.',
            salario: 'R$ 3.500 - R$ 9.000',
            demanda: 'Alta',
            tempo: '6-9 meses',
            modalidade: 'Remoto',
            habilidades: ['criatividade', 'empatia', 'atencao-detalhes', 'organizacao'],
            areas: ['design', 'tecnologia', 'marketing'],
            objetivo: ['carreira-longo', 'ambos']
        },
        'assistente-virtual': {
            titulo: 'Assistente Virtual',
            subtitulo: 'VA - Virtual Assistant',
            descricao: 'Profissional que oferece suporte administrativo remoto, gerenciando agendas, e-mails, redes sociais e outras tarefas operacionais para empresas e empreendedores.',
            salario: 'R$ 2.000 - R$ 5.000',
            demanda: 'Muito Alta',
            tempo: '2-4 meses',
            modalidade: 'Remoto',
            habilidades: ['organizacao', 'comunicacao', 'adaptabilidade', 'atencao-detalhes'],
            areas: ['administracao', 'atendimento', 'marketing'],
            objetivo: ['renda-rapida', 'ambos']
        },
        'desenvolvedor-web': {
            titulo: 'Desenvolvedor Web',
            subtitulo: 'Front-end Developer',
            descricao: 'Profissional que cria e mantém websites e aplicações web, transformando designs em código funcional usando HTML, CSS e JavaScript.',
            salario: 'R$ 4.000 - R$ 12.000',
            demanda: 'Muito Alta',
            tempo: '6-12 meses',
            modalidade: 'Remoto',
            habilidades: ['analitico', 'criatividade', 'paciencia', 'atencao-detalhes'],
            areas: ['tecnologia', 'design'],
            objetivo: ['carreira-longo', 'ambos']
        },
        'gestor-midias-sociais': {
            titulo: 'Gestor de Mídias Sociais',
            subtitulo: 'Social Media Manager',
            descricao: 'Profissional que gerencia a presença digital de empresas, criando conteúdo, engajando com o público e analisando métricas de desempenho nas redes sociais.',
            salario: 'R$ 2.500 - R$ 7.000',
            demanda: 'Alta',
            tempo: '3-6 meses',
            modalidade: 'Remoto/Híbrido',
            habilidades: ['criatividade', 'comunicacao', 'organizacao', 'adaptabilidade'],
            areas: ['marketing', 'vendas', 'design'],
            objetivo: ['renda-rapida', 'carreira-longo', 'ambos']
        },
        'especialista-excel': {
            titulo: 'Especialista em Excel',
            subtitulo: 'Análise e Automação',
            descricao: 'Profissional que domina Excel avançado para criar planilhas complexas, automatizar processos, gerar relatórios e analisar dados financeiros e operacionais.',
            salario: 'R$ 3.000 - R$ 6.500',
            demanda: 'Média-Alta',
            tempo: '2-4 meses',
            modalidade: 'Remoto/Híbrido',
            habilidades: ['analitico', 'organizacao', 'atencao-detalhes', 'paciencia'],
            areas: ['administracao', 'financas'],
            objetivo: ['renda-rapida', 'ambos']
        }
    };
    
    // Calcular compatibilidade para cada carreira
    for (const [id, carreira] of Object.entries(carreiras)) {
        const compatibilidade = calcularCompatibilidade(carreira);
        
        if (compatibilidade >= 40) {
            recomendacoes.push({
                id,
                ...carreira,
                compatibilidade
            });
        }
    }
    
    // Ordenar por compatibilidade
    recomendacoes.sort((a, b) => b.compatibilidade - a.compatibilidade);
    
    // Retornar top 4
    return recomendacoes.slice(0, 4);
}

function calcularCompatibilidade(carreira) {
    let pontos = 0;
    let maxPontos = 0;
    
    // Habilidades (peso: 40%)
    if (dadosFormulario.habilidades) {
        maxPontos += 40;
        const habilidadesMatch = dadosFormulario.habilidades.filter(h => 
            carreira.habilidades.includes(h)
        ).length;
        const percentualHabilidades = (habilidadesMatch / carreira.habilidades.length) * 100;
        pontos += (percentualHabilidades / 100) * 40;
    }
    
    // Áreas de interesse (peso: 30%)
    if (dadosFormulario.areasInteresse && dadosFormulario.areasInteresse.length > 0) {
        maxPontos += 30;
        const areasMatch = dadosFormulario.areasInteresse.filter(a => 
            carreira.areas.includes(a)
        ).length;
        if (areasMatch > 0) {
            pontos += (areasMatch / dadosFormulario.areasInteresse.length) * 30;
        }
    }
    
    // Objetivo (peso: 20%)
    if (dadosFormulario.objetivo) {
        maxPontos += 20;
        if (carreira.objetivo.includes(dadosFormulario.objetivo)) {
            pontos += 20;
        }
    }
    
    // Tipo de trabalho (peso: 10%)
    if (dadosFormulario.tipoTrabalho) {
        maxPontos += 10;
        if (dadosFormulario.tipoTrabalho === 'remoto' && carreira.modalidade.includes('Remoto')) {
            pontos += 10;
        } else if (dadosFormulario.tipoTrabalho === 'tanto-faz') {
            pontos += 5;
        }
    }
    
    // Calcular percentual final
    return maxPontos > 0 ? Math.round((pontos / maxPontos) * 100) : 0;
}

// ===================================
// EXIBIÇÃO DE RESULTADOS
// ===================================

function mostrarResultados(recomendacoes) {
    telaCarregamento.style.display = 'none';
    telaResultados.style.display = 'block';
    
    // Resumo de habilidades
    const resumoHabilidades = document.getElementById('resumoHabilidades');
    resumoHabilidades.innerHTML = '';
    
    if (dadosFormulario.habilidades) {
        dadosFormulario.habilidades.forEach(habilidade => {
            const tag = document.createElement('span');
            tag.className = 'perfil-tag';
            tag.innerHTML = `<i class="fas fa-check-circle"></i> ${formatarHabilidade(habilidade)}`;
            resumoHabilidades.appendChild(tag);
        });
    }
    
    // Compatibilidade geral
    const compatibilidadeMedia = recomendacoes.length > 0 
        ? Math.round(recomendacoes.reduce((acc, r) => acc + r.compatibilidade, 0) / recomendacoes.length)
        : 0;
    document.getElementById('compatibilidadeGeral').textContent = `${compatibilidadeMedia}%`;
    
    // Cards de recomendação
    const container = document.getElementById('recomendacoesContainer');
    container.innerHTML = '';
    
    recomendacoes.forEach((rec, index) => {
        const card = criarCardRecomendacao(rec, index === 0);
        container.appendChild(card);
    });
    
    // Scroll para resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animar barras de compatibilidade
    setTimeout(() => {
        document.querySelectorAll('.compatibilidade-preenchimento').forEach((barra, index) => {
            barra.style.width = `${recomendacoes[index].compatibilidade}%`;
        });
    }, 300);
}

function criarCardRecomendacao(rec, isDestaque) {
    const card = document.createElement('div');
    card.className = `card-recomendacao ${isDestaque ? 'destaque' : ''}`;
    
    const habilidadesMatch = dadosFormulario.habilidades 
        ? dadosFormulario.habilidades.filter(h => rec.habilidades.includes(h))
        : [];
    
    card.innerHTML = `
        <div class="recomendacao-header">
            <div class="recomendacao-info">
                <h3 class="recomendacao-titulo">
                    <i class="fas fa-briefcase"></i>
                    ${rec.titulo}
                </h3>
                <p class="recomendacao-subtitulo">${rec.subtitulo}</p>
            </div>
        </div>
        
        <div class="compatibilidade">
            <span class="compatibilidade-numero">${rec.compatibilidade}%</span>
            <div class="compatibilidade-barra">
                <div class="compatibilidade-preenchimento" style="width: 0%"></div>
            </div>
        </div>
        
        <p class="recomendacao-descricao">${rec.descricao}</p>
        
        <div class="recomendacao-grid">
            <div class="info-item">
                <div class="info-item-label">
                    <i class="fas fa-dollar-sign"></i>
                    Faixa Salarial
                </div>
                <div class="info-item-valor">${rec.salario}</div>
            </div>
            
            <div class="info-item">
                <div class="info-item-label">
                    <i class="fas fa-chart-line"></i>
                    Demanda do Mercado
                </div>
                <div class="info-item-valor">${rec.demanda}</div>
            </div>
            
            <div class="info-item">
                <div class="info-item-label">
                    <i class="fas fa-clock"></i>
                    Tempo de Transição
                </div>
                <div class="info-item-valor">${rec.tempo}</div>
            </div>
            
            <div class="info-item">
                <div class="info-item-label">
                    <i class="fas fa-laptop-house"></i>
                    Modalidade
                </div>
                <div class="info-item-valor">${rec.modalidade}</div>
            </div>
        </div>
        
        <div class="habilidades-match">
            <h4>Suas Habilidades Compatíveis:</h4>
            <div class="habilidades-lista">
                ${habilidadesMatch.map(h => `
                    <span class="habilidade-tag">
                        <i class="fas fa-check"></i>
                        ${formatarHabilidade(h)}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function formatarHabilidade(habilidade) {
    const mapa = {
        'comunicacao': 'Comunicação',
        'empatia': 'Empatia',
        'organizacao': 'Organização',
        'criatividade': 'Criatividade',
        'lideranca': 'Liderança',
        'analitico': 'Pensamento Analítico',
        'adaptabilidade': 'Adaptabilidade',
        'paciencia': 'Paciência',
        'trabalho-equipe': 'Trabalho em Equipe',
        'atencao-detalhes': 'Atenção aos Detalhes'
    };
    return mapa[habilidade] || habilidade;
}

// ===================================
// EXPORTAR PDF
// ===================================

function exportarPDF() {
    // Adicionar classe para impressão
    document.body.classList.add('imprimindo');
    
    // Configurar título da página para o PDF
    const tituloOriginal = document.title;
    document.title = 'Rota Certa - Suas Recomendações Personalizadas';
    
    // Aguardar um frame para aplicar estilos
    setTimeout(() => {
        window.print();
        
        // Restaurar após impressão
        setTimeout(() => {
            document.body.classList.remove('imprimindo');
            document.title = tituloOriginal;
        }, 100);
    }, 100);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    atualizarProgresso();
});
