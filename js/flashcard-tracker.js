/**
 * Módulo para rastreamento de uso de flashcards
 * Integra com o dashboard para registrar dados reais de uso
 */
export default class FlashcardTracker {
  constructor(dashboardData) {
    this.dashboardData = dashboardData;
    this.studiedToday = 0;
  }

  /**
   * Registra um flashcard estudado
   * @param {Object} flashcard Dados do flashcard estudado
   */
  recordStudied(flashcard) {
    // Incrementar contador local
    this.studiedToday++;
    
    // Registrar no dashboard
    this.dashboardData.recordFlashcardStudied(
      flashcard.category,
      flashcard.difficulty
    );
    
    // Atualizar contador na interface se existir
    const studiedCountEl = document.getElementById('studied-count');
    if (studiedCountEl) {
      studiedCountEl.textContent = this.studiedToday;
    }
    
    // Atualizar meta diária se existir
    const dailyGoalEl = document.getElementById('daily-goal');
    if (dailyGoalEl) {
      const goalValue = parseInt(dailyGoalEl.dataset.goal || 5);
      const percentage = Math.min(100, Math.round((this.studiedToday / goalValue) * 100));
      
      const progressEl = dailyGoalEl.querySelector('.progress-value');
      if (progressEl) {
        progressEl.style.width = `${percentage}%`;
      }
      
      const percentageEl = dailyGoalEl.querySelector('.progress-percentage');
      if (percentageEl) {
        percentageEl.textContent = `${percentage}%`;
      }
    }
    
    return this.studiedToday;
  }
  
  /**
   * Registra uma dificuldade para um flashcard
   * @param {Object} flashcard Dados do flashcard
   * @param {string} difficulty Nova dificuldade (easy, medium, hard)
   */
  recordDifficulty(flashcard, difficulty) {
    // Atualizar dificuldade no objeto do flashcard
    flashcard.difficulty = difficulty;
    
    // Registrar no dashboard (implementação futura)
    // this.dashboardData.updateFlashcardDifficulty(flashcard.id, difficulty);
    
    return flashcard;
  }
  
  /**
   * Obtém o número de flashcards estudados hoje
   * @returns {number} Número de flashcards estudados
   */
  getStudiedToday() {
    return this.studiedToday;
  }
}
