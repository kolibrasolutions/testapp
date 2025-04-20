/**
 * Sistema de Flashcards para Treinamento de Balconistas
 * Implementa a funcionalidade de flashcards com algoritmo de repetição espaçada
 */

import flashcardsDB from '../data/flashcards.js';

class FlashcardSystem {
  constructor() {
    this.flashcards = { ...flashcardsDB };
    this.currentSession = [];
    this.currentIndex = 0;
    this.userStats = {
      cardsStudied: 0,
      cardsCorrect: 0,
      categoryProgress: {}
    };
    this.loadUserProgress();
  }

  /**
   * Carrega o progresso do usuário do localStorage
   */
  loadUserProgress() {
    const savedProgress = localStorage.getItem('flashcard_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      
      // Atualiza as datas de revisão e dificuldade dos flashcards
      Object.keys(progress.cards || {}).forEach(cardId => {
        if (this.flashcards[cardId]) {
          this.flashcards[cardId].dificuldade = progress.cards[cardId].dificuldade;
          this.flashcards[cardId].ultimaRevisao = progress.cards[cardId].ultimaRevisao;
          this.flashcards[cardId].proximaRevisao = progress.cards[cardId].proximaRevisao;
        }
      });
      
      // Carrega estatísticas do usuário
      if (progress.stats) {
        this.userStats = progress.stats;
      }
    }
  }

  /**
   * Salva o progresso do usuário no localStorage
   */
  saveUserProgress() {
    const cardsProgress = {};
    
    Object.keys(this.flashcards).forEach(cardId => {
      cardsProgress[cardId] = {
        dificuldade: this.flashcards[cardId].dificuldade,
        ultimaRevisao: this.flashcards[cardId].ultimaRevisao,
        proximaRevisao: this.flashcards[cardId].proximaRevisao
      };
    });
    
    const progress = {
      cards: cardsProgress,
      stats: this.userStats
    };
    
    localStorage.setItem('flashcard_progress', JSON.stringify(progress));
  }

  /**
   * Cria uma nova sessão de estudo com flashcards que precisam de revisão
   * @param {number} limit - Número máximo de flashcards na sessão
   * @param {string} categoria - Categoria específica (opcional)
   * @param {string} publico - Público específico (opcional)
   * @returns {Array} - Array de flashcards para a sessão
   */
  createStudySession(limit = 10, categoria = null, publico = null) {
    const today = new Date();
    
    // Filtra os flashcards por categoria e público, se especificados
    let availableCards = Object.values(this.flashcards).filter(card => {
      const needsReview = !card.proximaRevisao || new Date(card.proximaRevisao) <= today;
      const matchesCategoria = !categoria || card.categoria === categoria;
      const matchesPublico = !publico || card.publico === publico;
      
      return needsReview && matchesCategoria && matchesPublico;
    });
    
    // Se não houver cards para revisão, inclui novos cards ou cards menos recentes
    if (availableCards.length < limit) {
      const additionalCards = Object.values(this.flashcards)
        .filter(card => {
          const isNew = !card.ultimaRevisao;
          const matchesCategoria = !categoria || card.categoria === categoria;
          const matchesPublico = !publico || card.publico === publico;
          const notInAvailable = !availableCards.find(c => c.id === card.id);
          
          return (isNew || true) && matchesCategoria && matchesPublico && notInAvailable;
        })
        .sort((a, b) => {
          // Prioriza cards novos, depois por data de revisão mais antiga
          if (!a.ultimaRevisao && !b.ultimaRevisao) return 0;
          if (!a.ultimaRevisao) return -1;
          if (!b.ultimaRevisao) return 1;
          return new Date(a.ultimaRevisao) - new Date(b.ultimaRevisao);
        });
      
      availableCards = [...availableCards, ...additionalCards];
    }
    
    // Ordena por prioridade: primeiro os que precisam de revisão, depois por dificuldade
    availableCards.sort((a, b) => {
      // Prioridade por necessidade de revisão
      const aReview = !a.proximaRevisao || new Date(a.proximaRevisao) <= today;
      const bReview = !b.proximaRevisao || new Date(b.proximaRevisao) <= today;
      
      if (aReview && !bReview) return -1;
      if (!aReview && bReview) return 1;
      
      // Depois por dificuldade (difícil > médio > fácil)
      const difficultyOrder = { "dificil": 0, "media": 1, "facil": 2 };
      return difficultyOrder[a.dificuldade] - difficultyOrder[b.dificuldade];
    });
    
    // Limita o número de cards na sessão
    this.currentSession = availableCards.slice(0, limit);
    this.currentIndex = 0;
    
    return this.currentSession;
  }

  /**
   * Obtém o próximo flashcard na sessão atual
   * @returns {Object|null} - Próximo flashcard ou null se não houver mais
   */
  getNextCard() {
    if (this.currentIndex >= this.currentSession.length) {
      return null;
    }
    
    return this.currentSession[this.currentIndex++];
  }

  /**
   * Registra a resposta do usuário para um flashcard
   * @param {string} cardId - ID do flashcard
   * @param {string} resposta - Resposta do usuário ('facil', 'media', 'dificil')
   */
  registerResponse(cardId, resposta) {
    const card = this.flashcards[cardId];
    if (!card) return;
    
    // Atualiza a dificuldade do card
    card.dificuldade = resposta;
    card.ultimaRevisao = new Date().toISOString();
    
    // Calcula a próxima data de revisão baseada na dificuldade
    const hoje = new Date();
    let proximaRevisao = new Date(hoje);
    
    switch (resposta) {
      case 'facil':
        proximaRevisao.setDate(hoje.getDate() + 7); // 7 dias
        break;
      case 'media':
        proximaRevisao.setDate(hoje.getDate() + 3); // 3 dias
        break;
      case 'dificil':
        proximaRevisao.setDate(hoje.getDate() + 1); // 1 dia
        break;
      default:
        proximaRevisao.setDate(hoje.getDate() + 3); // padrão: 3 dias
    }
    
    card.proximaRevisao = proximaRevisao.toISOString();
    
    // Atualiza estatísticas do usuário
    this.userStats.cardsStudied++;
    if (resposta === 'facil' || resposta === 'media') {
      this.userStats.cardsCorrect++;
    }
    
    // Atualiza progresso por categoria
    if (!this.userStats.categoryProgress[card.categoria]) {
      this.userStats.categoryProgress[card.categoria] = {
        total: 0,
        correct: 0
      };
    }
    
    this.userStats.categoryProgress[card.categoria].total++;
    if (resposta === 'facil' || resposta === 'media') {
      this.userStats.categoryProgress[card.categoria].correct++;
    }
    
    // Salva o progresso
    this.saveUserProgress();
  }

  /**
   * Obtém estatísticas de progresso do usuário
   * @returns {Object} - Estatísticas do usuário
   */
  getUserStats() {
    // Calcula porcentagem geral de acertos
    const overallAccuracy = this.userStats.cardsStudied > 0 
      ? (this.userStats.cardsCorrect / this.userStats.cardsStudied * 100).toFixed(1) 
      : 0;
    
    // Calcula porcentagem de acertos por categoria
    const categoryAccuracy = {};
    Object.keys(this.userStats.categoryProgress || {}).forEach(category => {
      const stats = this.userStats.categoryProgress[category];
      categoryAccuracy[category] = stats.total > 0 
        ? (stats.correct / stats.total * 100).toFixed(1) 
        : 0;
    });
    
    // Calcula cards que precisam de revisão hoje
    const today = new Date();
    const dueToday = Object.values(this.flashcards).filter(card => {
      return card.proximaRevisao && new Date(card.proximaRevisao) <= today;
    }).length;
    
    return {
      cardsStudied: this.userStats.cardsStudied,
      overallAccuracy: overallAccuracy,
      categoryAccuracy: categoryAccuracy,
      dueToday: dueToday
    };
  }

  /**
   * Obtém recomendações de estudo baseadas no desempenho
   * @returns {Object} - Recomendações de estudo
   */
  getStudyRecommendations() {
    const recommendations = {
      weakCategories: [],
      recommendedCards: []
    };
    
    // Identifica categorias com baixo desempenho (menos de 70% de acertos)
    Object.keys(this.userStats.categoryProgress || {}).forEach(category => {
      const stats = this.userStats.categoryProgress[category];
      const accuracy = stats.total > 0 ? (stats.correct / stats.total * 100) : 0;
      
      if (accuracy < 70) {
        recommendations.weakCategories.push({
          name: category,
          accuracy: accuracy.toFixed(1)
        });
      }
    });
    
    // Ordena categorias fracas da menor para a maior precisão
    recommendations.weakCategories.sort((a, b) => a.accuracy - b.accuracy);
    
    // Identifica cards difíceis que precisam de mais atenção
    const difficultCards = Object.values(this.flashcards)
      .filter(card => card.dificuldade === 'dificil')
      .slice(0, 5);
    
    recommendations.recommendedCards = difficultCards.map(card => ({
      id: card.id,
      categoria: card.categoria,
      frente: card.frente
    }));
    
    return recommendations;
  }

  /**
   * Obtém todas as categorias disponíveis
   * @returns {Array} - Lista de categorias únicas
   */
  getCategories() {
    const categories = new Set();
    Object.values(this.flashcards).forEach(card => {
      categories.add(card.categoria);
    });
    return [...categories];
  }

  /**
   * Obtém todos os públicos disponíveis
   * @returns {Array} - Lista de públicos únicos
   */
  getPublicos() {
    const publicos = new Set();
    Object.values(this.flashcards).forEach(card => {
      publicos.add(card.publico);
    });
    return [...publicos];
  }
}

export default FlashcardSystem;
