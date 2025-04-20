/**
 * FlashcardManager para FarmaLearn
 * Gerencia o sistema de flashcards com algoritmo de repetição espaçada
 */

class FlashcardManager {
  constructor(dashboardManager) {
    this.storagePrefix = 'farmalearn_';
    this.dashboardManager = dashboardManager;
    this.flashcardsData = [];
    this.userProgress = this.loadUserProgress();
    
    // Inicializar progresso do usuário se não existir
    if (!this.userProgress) {
      this.initializeUserProgress();
    }
  }
  
  /**
   * Carrega o progresso do usuário do localStorage
   * @returns {Object} Progresso do usuário ou null se não existir
   */
  loadUserProgress() {
    const userProgress = localStorage.getItem(`${this.storagePrefix}flashcards_progress`);
    return userProgress ? JSON.parse(userProgress) : null;
  }
  
  /**
   * Salva o progresso do usuário no localStorage
   */
  saveUserProgress() {
    localStorage.setItem(`${this.storagePrefix}flashcards_progress`, JSON.stringify(this.userProgress));
  }
  
  /**
   * Inicializa o progresso do usuário com valores zerados
   */
  initializeUserProgress() {
    this.userProgress = {
      cards: {},
      stats: {
        aprendidos: 0,
        paraRevisar: 0,
        dificeis: 0,
        dominio: 0
      },
      lastStudyDate: null
    };
    
    this.saveUserProgress();
  }
  
  /**
   * Carrega os flashcards do banco de dados ou fonte externa
   * @param {Array} flashcardsData - Dados dos flashcards
   */
  loadFlashcards(flashcardsData) {
    this.flashcardsData = flashcardsData;
    
    // Inicializar progresso para novos flashcards
    this.flashcardsData.forEach(card => {
      if (!this.userProgress.cards[card.id]) {
        this.userProgress.cards[card.id] = {
          estado: 'novo',          // 'novo', 'aprendendo', 'revisando', 'aprendido'
          fatorEspacamento: 2.5,   // Fator de espaçamento (usado no algoritmo SM-2)
          intervaloDias: 0,        // Intervalo em dias até a próxima revisão
          ultimaRevisao: null,     // Data da última revisão
          proximaRevisao: null,    // Data da próxima revisão
          repeticoes: 0,           // Número de repetições
          facilidade: 0,           // Nível de facilidade (0-5)
          dificuldade: card.difficulty || 'medium' // Dificuldade inicial
        };
      }
    });
    
    this.saveUserProgress();
  }
  
  /**
   * Atualiza as estatísticas de aprendizado
   */
  updateStats() {
    // Resetar contadores
    const stats = {
      aprendidos: 0,
      paraRevisar: 0,
      dificeis: 0,
      total: 0
    };
    
    // Contar cards por estado
    Object.values(this.userProgress.cards).forEach(card => {
      stats.total++;
      
      if (card.estado === 'aprendido') {
        stats.aprendidos++;
      } else if (card.estado === 'revisando') {
        stats.paraRevisar++;
      } else if (card.dificuldade === 'hard') {
        stats.dificeis++;
      }
    });
    
    // Calcular domínio
    this.userProgress.stats.aprendidos = stats.aprendidos;
    this.userProgress.stats.paraRevisar = stats.paraRevisar;
    this.userProgress.stats.dificeis = stats.dificeis;
    this.userProgress.stats.dominio = stats.total > 0 ? 
      Math.round((stats.aprendidos / stats.total) * 100) : 0;
    
    this.saveUserProgress();
    
    return this.userProgress.stats;
  }
  
  /**
   * Atualiza a interface com as estatísticas atuais
   */
  updateStatsUI() {
    const stats = this.updateStats();
    
    // Atualizar elementos da interface
    const aprendidosEl = document.querySelector('.stat-item:nth-child(1) .stat-value');
    const paraRevisarEl = document.querySelector('.stat-item:nth-child(2) .stat-value');
    const dificeisEl = document.querySelector('.stat-item:nth-child(3) .stat-value');
    const dominioEl = document.querySelector('.stat-item:nth-child(4) .stat-value');
    
    if (aprendidosEl) aprendidosEl.textContent = stats.aprendidos;
    if (paraRevisarEl) paraRevisarEl.textContent = stats.paraRevisar;
    if (dificeisEl) dificeisEl.textContent = stats.dificeis;
    if (dominioEl) dominioEl.textContent = `${stats.dominio}%`;
  }
  
  /**
   * Obtém a lista de flashcards para estudo hoje
   * @param {string} categoria - Categoria para filtrar (opcional)
   * @returns {Array} Lista de flashcards para estudo
   */
  getFlashcardsParaEstudoHoje(categoria = 'all') {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Atualizar a data do último estudo
    this.userProgress.lastStudyDate = hoje.toISOString().split('T')[0];
    this.saveUserProgress();
    
    // Filtrar flashcards que precisam ser estudados hoje
    const cardsParaEstudo = this.flashcardsData.filter(card => {
      // Filtrar por categoria se necessário
      if (categoria !== 'all' && card.category !== categoria) {
        return false;
      }
      
      const progresso = this.userProgress.cards[card.id];
      
      // Se o card é novo ou está em aprendizado, incluir
      if (progresso.estado === 'novo' || progresso.estado === 'aprendendo') {
        return true;
      }
      
      // Se tem data de próxima revisão e é hoje ou antes, incluir
      if (progresso.proximaRevisao) {
        const dataRevisao = new Date(progresso.proximaRevisao);
        dataRevisao.setHours(0, 0, 0, 0);
        return dataRevisao <= hoje;
      }
      
      return false;
    });
    
    // Ordenar: primeiro os que estão para revisão, depois os novos
    return cardsParaEstudo.sort((a, b) => {
      const progressoA = this.userProgress.cards[a.id];
      const progressoB = this.userProgress.cards[b.id];
      
      // Priorizar cards para revisão
      if (progressoA.estado === 'revisando' && progressoB.estado !== 'revisando') {
        return -1;
      }
      if (progressoA.estado !== 'revisando' && progressoB.estado === 'revisando') {
        return 1;
      }
      
      // Para cards em revisão, priorizar os mais atrasados
      if (progressoA.estado === 'revisando' && progressoB.estado === 'revisando') {
        const dataA = new Date(progressoA.proximaRevisao);
        const dataB = new Date(progressoB.proximaRevisao);
        return dataA - dataB;
      }
      
      // Para novos cards, priorizar por dificuldade (mais fáceis primeiro)
      const dificuldadeMap = { 'easy': 0, 'medium': 1, 'hard': 2 };
      return dificuldadeMap[a.difficulty] - dificuldadeMap[b.difficulty];
    });
  }
  
  /**
   * Processa a resposta do usuário para um flashcard
   * @param {number} cardId - ID do flashcard
   * @param {number} qualidade - Qualidade da resposta (0-5)
   * @returns {Object} Informações atualizadas do card
   */
  processarResposta(cardId, qualidade) {
    const card = this.userProgress.cards[cardId];
    const hoje = new Date();
    
    // Atualizar estado do card
    card.repeticoes++;
    card.ultimaRevisao = hoje.toISOString().split('T')[0];
    card.facilidade = qualidade;
    
    // Implementação do algoritmo SM-2 (SuperMemo 2)
    if (qualidade >= 3) {
      // Resposta correta
      if (card.repeticoes === 1) {
        card.intervaloDias = 1;
        card.estado = 'aprendendo';
      } else if (card.repeticoes === 2) {
        card.intervaloDias = 6;
        card.estado = 'revisando';
      } else {
        // Calcular novo fator de espaçamento
        card.fatorEspacamento = Math.max(1.3, card.fatorEspacamento + (0.1 - (5 - qualidade) * (0.08 + (5 - qualidade) * 0.02)));
        
        // Calcular novo intervalo
        card.intervaloDias = Math.round(card.intervaloDias * card.fatorEspacamento);
        
        // Limitar o intervalo máximo a 365 dias
        card.intervaloDias = Math.min(365, card.intervaloDias);
        
        card.estado = card.intervaloDias > 30 ? 'aprendido' : 'revisando';
      }
      
      // Atualizar dificuldade com base na facilidade
      if (qualidade >= 4) {
        card.dificuldade = 'easy';
      } else if (qualidade >= 3) {
        card.dificuldade = 'medium';
      }
    } else {
      // Resposta incorreta ou difícil
      card.intervaloDias = 1;
      card.fatorEspacamento = Math.max(1.3, card.fatorEspacamento - 0.2);
      card.estado = 'aprendendo';
      
      // Atualizar dificuldade
      if (qualidade <= 1) {
        card.dificuldade = 'hard';
      } else {
        card.dificuldade = 'medium';
      }
    }
    
    // Calcular próxima data de revisão
    const proximaRevisao = new Date(hoje);
    proximaRevisao.setDate(proximaRevisao.getDate() + card.intervaloDias);
    card.proximaRevisao = proximaRevisao.toISOString().split('T')[0];
    
    // Salvar progresso
    this.saveUserProgress();
    
    // Atualizar estatísticas
    this.updateStats();
    
    // Se o dashboard manager estiver disponível, registrar atividade
    if (this.dashboardManager) {
      // Encontrar o flashcard original para obter a categoria
      const flashcard = this.flashcardsData.find(f => f.id == cardId);
      if (flashcard) {
        this.dashboardManager.registrarFlashcardEstudado(flashcard.category, card.dificuldade);
      }
    }
    
    return card;
  }
  
  /**
   * Obtém as estatísticas de aprendizado
   * @returns {Object} Estatísticas de aprendizado
   */
  getStats() {
    return this.userProgress.stats;
  }
  
  /**
   * Reseta o progresso de todos os flashcards
   */
  resetarProgresso() {
    this.initializeUserProgress();
    
    // Reinicializar progresso para todos os flashcards
    this.flashcardsData.forEach(card => {
      this.userProgress.cards[card.id] = {
        estado: 'novo',
        fatorEspacamento: 2.5,
        intervaloDias: 0,
        ultimaRevisao: null,
        proximaRevisao: null,
        repeticoes: 0,
        facilidade: 0,
        dificuldade: card.difficulty || 'medium'
      };
    });
    
    this.saveUserProgress();
    this.updateStats();
  }
}

export default FlashcardManager;
