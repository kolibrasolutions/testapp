/**
 * Módulo para rastreamento de uso do simulador
 * Integra com o dashboard para registrar dados reais de uso
 */
export default class SimulatorTracker {
  constructor(dashboardData) {
    this.dashboardData = dashboardData;
    this.completedToday = 0;
  }

  /**
   * Registra uma simulação completada
   * @param {string} scenarioTitle Título do cenário
   * @param {number} score Pontuação obtida (0-100)
   * @param {number} ticketValue Valor do ticket médio
   */
  recordSimulationCompleted(scenarioTitle, score, ticketValue) {
    // Incrementar contador local
    this.completedToday++;
    
    // Registrar no dashboard
    this.dashboardData.recordSimulationCompleted(
      scenarioTitle,
      score,
      ticketValue
    );
    
    // Atualizar contador na interface se existir
    const completedCountEl = document.getElementById('completed-count');
    if (completedCountEl) {
      completedCountEl.textContent = this.completedToday;
    }
    
    // Atualizar meta diária se existir
    const dailyGoalEl = document.getElementById('daily-goal-simulations');
    if (dailyGoalEl) {
      const goalValue = parseInt(dailyGoalEl.dataset.goal || 2);
      const percentage = Math.min(100, Math.round((this.completedToday / goalValue) * 100));
      
      const progressEl = dailyGoalEl.querySelector('.progress-value');
      if (progressEl) {
        progressEl.style.width = `${percentage}%`;
      }
      
      const percentageEl = dailyGoalEl.querySelector('.progress-percentage');
      if (percentageEl) {
        percentageEl.textContent = `${percentage}%`;
      }
    }
    
    return this.completedToday;
  }
  
  /**
   * Obtém o número de simulações completadas hoje
   * @returns {number} Número de simulações completadas
   */
  getCompletedToday() {
    return this.completedToday;
  }
}
