/**
 * Sistema de Rastreamento de Progresso
 * Integra dados de flashcards e simulações para personalizar o aprendizado
 */

import FlashcardSystem from './flashcards.js';
import SimuladorSystem from './simulador.js';

class ProgressTracker {
  constructor() {
    this.flashcardSystem = new FlashcardSystem();
    this.simuladorSystem = new SimuladorSystem();
    this.userProfile = {
      nivel: 1,
      xp: 0,
      xpProximoNivel: 100,
      ultimoLogin: null,
      sequenciaDias: 0,
      conquistas: [],
      desafiosDiarios: {
        atual: null,
        completados: 0
      }
    };
    this.loadUserProfile();
  }

  /**
   * Carrega o perfil do usuário do localStorage
   */
  loadUserProfile() {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      this.userProfile = JSON.parse(savedProfile);
    } else {
      // Inicializa o perfil com valores padrão
      this.userProfile = {
        nivel: 1,
        xp: 0,
        xpProximoNivel: 100,
        ultimoLogin: null,
        sequenciaDias: 0,
        conquistas: [],
        desafiosDiarios: {
          atual: null,
          completados: 0
        }
      };
      this.saveUserProfile();
    }
    
    // Verifica sequência de dias e gera desafio diário
    this.verificarLoginDiario();
    if (!this.userProfile.desafiosDiarios.atual) {
      this.gerarDesafioDiario();
    }
  }

  /**
   * Salva o perfil do usuário no localStorage
   */
  saveUserProfile() {
    localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
  }

  /**
   * Verifica se o usuário fez login hoje e atualiza a sequência de dias
   */
  verificarLoginDiario() {
    const hoje = new Date().toDateString();
    const ultimoLogin = this.userProfile.ultimoLogin;
    
    if (!ultimoLogin) {
      // Primeiro login
      this.userProfile.ultimoLogin = hoje;
      this.userProfile.sequenciaDias = 1;
      this.verificarConquistaSequencia();
      this.saveUserProfile();
      return;
    }
    
    if (ultimoLogin === hoje) {
      // Já fez login hoje
      return;
    }
    
    // Verifica se o último login foi ontem
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemString = ontem.toDateString();
    
    if (ultimoLogin === ontemString) {
      // Login em dias consecutivos
      this.userProfile.sequenciaDias++;
      this.verificarConquistaSequencia();
    } else {
      // Quebrou a sequência
      this.userProfile.sequenciaDias = 1;
    }
    
    this.userProfile.ultimoLogin = hoje;
    this.saveUserProfile();
  }

  /**
   * Gera um novo desafio diário
   */
  gerarDesafioDiario() {
    const tiposDesafio = [
      { tipo: 'flashcards', descricao: 'Estude {n} flashcards', min: 5, max: 15 },
      { tipo: 'simulacao', descricao: 'Complete {n} simulação de atendimento', min: 1, max: 3 },
      { tipo: 'categoria', descricao: 'Estude {n} flashcards da categoria {categoria}', min: 3, max: 10 }
    ];
    
    // Escolhe um tipo de desafio aleatoriamente
    const tipoDesafio = tiposDesafio[Math.floor(Math.random() * tiposDesafio.length)];
    
    // Gera o desafio
    const desafio = {
      tipo: tipoDesafio.tipo,
      quantidade: Math.floor(Math.random() * (tipoDesafio.max - tipoDesafio.min + 1)) + tipoDesafio.min,
      descricao: '',
      progresso: 0,
      concluido: false,
      recompensaXP: 0
    };
    
    // Adiciona categoria se necessário
    if (tipoDesafio.tipo === 'categoria') {
      const categorias = this.flashcardSystem.getCategories();
      desafio.categoria = categorias[Math.floor(Math.random() * categorias.length)];
    }
    
    // Define a descrição
    desafio.descricao = tipoDesafio.descricao.replace('{n}', desafio.quantidade);
    if (desafio.categoria) {
      desafio.descricao = desafio.descricao.replace('{categoria}', desafio.categoria);
    }
    
    // Define a recompensa de XP baseada na dificuldade
    desafio.recompensaXP = desafio.quantidade * 5;
    
    this.userProfile.desafiosDiarios.atual = desafio;
    this.saveUserProfile();
    
    return desafio;
  }

  /**
   * Atualiza o progresso do desafio diário
   * @param {string} tipo - Tipo de atividade ('flashcards', 'simulacao')
   * @param {Object} dados - Dados adicionais da atividade
   */
  atualizarDesafioDiario(tipo, dados = {}) {
    const desafio = this.userProfile.desafiosDiarios.atual;
    if (!desafio || desafio.concluido) return;
    
    if (tipo === desafio.tipo) {
      // Desafio de flashcards ou simulação genérico
      desafio.progresso++;
    } else if (tipo === 'flashcards' && desafio.tipo === 'categoria' && dados.categoria === desafio.categoria) {
      // Desafio de categoria específica
      desafio.progresso++;
    }
    
    // Verifica se o desafio foi concluído
    if (desafio.progresso >= desafio.quantidade) {
      desafio.concluido = true;
      this.adicionarXP(desafio.recompensaXP);
      this.userProfile.desafiosDiarios.completados++;
      this.verificarConquistaDesafios();
    }
    
    this.saveUserProfile();
  }

  /**
   * Adiciona pontos de experiência ao usuário
   * @param {number} xp - Quantidade de XP a adicionar
   */
  adicionarXP(xp) {
    this.userProfile.xp += xp;
    
    // Verifica se subiu de nível
    while (this.userProfile.xp >= this.userProfile.xpProximoNivel) {
      this.userProfile.xp -= this.userProfile.xpProximoNivel;
      this.userProfile.nivel++;
      
      // Aumenta o XP necessário para o próximo nível
      this.userProfile.xpProximoNivel = Math.floor(this.userProfile.xpProximoNivel * 1.5);
      
      // Verifica conquistas de nível
      this.verificarConquistaNivel();
    }
    
    this.saveUserProfile();
  }

  /**
   * Verifica e adiciona conquistas relacionadas ao nível
   */
  verificarConquistaNivel() {
    const nivel = this.userProfile.nivel;
    const conquistas = [
      { id: 'nivel-5', nivel: 5, nome: 'Aprendiz', descricao: 'Atingiu o nível 5' },
      { id: 'nivel-10', nivel: 10, nome: 'Balconista Experiente', descricao: 'Atingiu o nível 10' },
      { id: 'nivel-20', nivel: 20, nome: 'Especialista em Medicamentos', descricao: 'Atingiu o nível 20' }
    ];
    
    conquistas.forEach(conquista => {
      if (nivel >= conquista.nivel && !this.temConquista(conquista.id)) {
        this.adicionarConquista(conquista);
      }
    });
  }

  /**
   * Verifica e adiciona conquistas relacionadas à sequência de dias
   */
  verificarConquistaSequencia() {
    const sequencia = this.userProfile.sequenciaDias;
    const conquistas = [
      { id: 'sequencia-3', sequencia: 3, nome: 'Consistência', descricao: 'Acessou o sistema por 3 dias consecutivos' },
      { id: 'sequencia-7', sequencia: 7, nome: 'Dedicação Semanal', descricao: 'Acessou o sistema por 7 dias consecutivos' },
      { id: 'sequencia-30', sequencia: 30, nome: 'Hábito Mensal', descricao: 'Acessou o sistema por 30 dias consecutivos' }
    ];
    
    conquistas.forEach(conquista => {
      if (sequencia >= conquista.sequencia && !this.temConquista(conquista.id)) {
        this.adicionarConquista(conquista);
      }
    });
  }

  /**
   * Verifica e adiciona conquistas relacionadas aos desafios diários
   */
  verificarConquistaDesafios() {
    const desafiosCompletados = this.userProfile.desafiosDiarios.completados;
    const conquistas = [
      { id: 'desafios-5', quantidade: 5, nome: 'Desafiador', descricao: 'Completou 5 desafios diários' },
      { id: 'desafios-20', quantidade: 20, nome: 'Mestre dos Desafios', descricao: 'Completou 20 desafios diários' },
      { id: 'desafios-50', quantidade: 50, nome: 'Lendário', descricao: 'Completou 50 desafios diários' }
    ];
    
    conquistas.forEach(conquista => {
      if (desafiosCompletados >= conquista.quantidade && !this.temConquista(conquista.id)) {
        this.adicionarConquista(conquista);
      }
    });
  }

  /**
   * Verifica se o usuário já tem uma conquista específica
   * @param {string} id - ID da conquista
   * @returns {boolean} - Se o usuário tem a conquista
   */
  temConquista(id) {
    return this.userProfile.conquistas.some(c => c.id === id);
  }

  /**
   * Adiciona uma nova conquista ao perfil do usuário
   * @param {Object} conquista - Dados da conquista
   */
  adicionarConquista(conquista) {
    conquista.data = new Date().toISOString();
    this.userProfile.conquistas.push(conquista);
    this.saveUserProfile();
  }

  /**
   * Obtém recomendações personalizadas com base no desempenho
   * @returns {Object} - Recomendações personalizadas
   */
  getRecomendacoesPersonalizadas() {
    // Obtém estatísticas dos sistemas
    const flashcardStats = this.flashcardSystem.getUserStats();
    const simuladorStats = this.simuladorSystem.getUserStats();
    
    // Obtém recomendações específicas de cada sistema
    const flashcardRecommendations = this.flashcardSystem.getStudyRecommendations();
    const simuladorRecommendations = this.simuladorSystem.getRecomendacoes();
    
    // Identifica áreas de dificuldade comuns
    const categoriasProblematicas = new Set();
    
    // Adiciona categorias fracas de flashcards
    flashcardRecommendations.weakCategories.forEach(cat => {
      categoriasProblematicas.add(cat.name);
    });
    
    // Adiciona categorias fracas de simulações
    simuladorRecommendations.categoriasParaMelhorar.forEach(cat => {
      categoriasProblematicas.add(cat.nome);
    });
    
    // Gera recomendações personalizadas
    const recomendacoes = {
      categoriasParaMelhorar: Array.from(categoriasProblematicas),
      flashcardsRecomendados: flashcardRecommendations.recommendedCards.slice(0, 3),
      simulacoesRecomendadas: simuladorRecommendations.simulacoesRecomendadas.slice(0, 2),
      proximosPassos: []
    };
    
    // Gera sugestões de próximos passos
    if (flashcardStats.dueToday > 0) {
      recomendacoes.proximosPassos.push({
        tipo: 'flashcards',
        descricao: `Revisar ${flashcardStats.dueToday} flashcards pendentes para hoje`,
        prioridade: 'alta'
      });
    }
    
    if (this.userProfile.desafiosDiarios.atual && !this.userProfile.desafiosDiarios.atual.concluido) {
      recomendacoes.proximosPassos.push({
        tipo: 'desafio',
        descricao: `Completar o desafio diário: ${this.userProfile.desafiosDiarios.atual.descricao}`,
        prioridade: 'media'
      });
    }
    
    if (categoriasProblematicas.size > 0) {
      const categoria = Array.from(categoriasProblematicas)[0];
      recomendacoes.proximosPassos.push({
        tipo: 'estudo',
        descricao: `Focar no estudo da categoria ${categoria}`,
        prioridade: 'media'
      });
    }
    
    return recomendacoes;
  }

  /**
   * Obtém o perfil completo do usuário com estatísticas
   * @returns {Object} - Perfil do usuário com estatísticas
   */
  getUserProfile() {
    // Obtém estatísticas dos sistemas
    const flashcardStats = this.flashcardSystem.getUserStats();
    const simuladorStats = this.simuladorSystem.getUserStats();
    
    // Calcula progresso para o próximo nível
    const progressoNivel = Math.floor((this.userProfile.xp / this.userProfile.xpProximoNivel) * 100);
    
    // Retorna o perfil completo
    return {
      ...this.userProfile,
      progressoNivel,
      estatisticas: {
        flashcards: {
          estudados: flashcardStats.cardsStudied,
          precisaoGeral: flashcardStats.overallAccuracy,
          pendentesHoje: flashcardStats.dueToday
        },
        simulacoes: {
          completadas: simuladorStats.simulacoesCompletas,
          taxaSucesso: simuladorStats.taxaSucesso,
          taxaTicketMedio: simuladorStats.taxaTicketMedio
        }
      },
      conquistasRecentes: this.userProfile.conquistas
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 3)
    };
  }

  /**
   * Registra a conclusão de uma atividade e atualiza o progresso
   * @param {string} tipo - Tipo de atividade ('flashcard', 'simulacao')
   * @param {Object} dados - Dados da atividade
   */
  registrarAtividade(tipo, dados = {}) {
    // Adiciona XP com base no tipo de atividade
    if (tipo === 'flashcard') {
      // XP baseado na dificuldade
      const xpPorDificuldade = {
        'facil': 1,
        'media': 2,
        'dificil': 3
      };
      const xp = xpPorDificuldade[dados.dificuldade] || 1;
      this.adicionarXP(xp);
    } else if (tipo === 'simulacao') {
      // XP baseado no sucesso e percentual de acerto
      const xpBase = dados.sucesso ? 10 : 5;
      const xpBonus = Math.floor(dados.percentualAcerto / 10);
      const xpTicket = dados.aumentouTicket ? 5 : 0;
      this.adicionarXP(xpBase + xpBonus + xpTicket);
    }
    
    // Atualiza o progresso do desafio diário
    this.atualizarDesafioDiario(tipo, dados);
    
    // Verifica conquistas específicas
    if (tipo === 'simulacao' && dados.sucesso) {
      const simulacoesCompletadas = this.simuladorSystem.getUserStats().simulacoesCompletas;
      const conquistas = [
        { id: 'simulacoes-5', quantidade: 5, nome: 'Atendente Iniciante', descricao: 'Completou 5 simulações com sucesso' },
        { id: 'simulacoes-20', quantidade: 20, nome: 'Atendente Profissional', descricao: 'Completou 20 simulações com sucesso' },
        { id: 'simulacoes-50', quantidade: 50, nome: 'Atendente Mestre', descricao: 'Completou 50 simulações com sucesso' }
      ];
      
      conquistas.forEach(conquista => {
        if (simulacoesCompletadas >= conquista.quantidade && !this.temConquista(conquista.id)) {
          this.adicionarConquista(conquista);
        }
      });
    }
    
    if (tipo === 'flashcard') {
      const flashcardsEstudados = this.flashcardSystem.getUserStats().cardsStudied;
      const conquistas = [
        { id: 'flashcards-50', quantidade: 50, nome: 'Estudante Dedicado', descricao: 'Estudou 50 flashcards' },
        { id: 'flashcards-200', quantidade: 200, nome: 'Estudante Avançado', descricao: 'Estudou 200 flashcards' },
        { id: 'flashcards-500', quantidade: 500, nome: 'Mestre dos Flashcards', descricao: 'Estudou 500 flashcards' }
      ];
      
      conquistas.forEach(conquista => {
        if (flashcardsEstudados >= conquista.quantidade && !this.temConquista(conquista.id)) {
          this.adicionarConquista(conquista);
        }
      });
    }
    
    this.saveUserProfile();
  }
}

export default ProgressTracker;
