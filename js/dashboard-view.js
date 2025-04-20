/**
 * Componente de visualização do dashboard
 * Atualiza a interface do dashboard com dados reais de uso
 */
export default class DashboardView {
  constructor(dashboardData) {
    this.dashboardData = dashboardData;
  }

  /**
   * Atualiza todos os componentes do dashboard
   */
  updateAll() {
    this.updateUserInfo();
    this.updateStats();
    this.updateProgress();
    this.updateActivities();
    this.updateChallenges();
    this.updateCharts();
  }

  /**
   * Atualiza as informações do usuário
   */
  updateUserInfo() {
    const userData = this.dashboardData.getUserData();
    if (!userData) return;

    // Atualizar nome e avatar
    const userNameEl = document.getElementById('user-name');
    const userAvatarEl = document.getElementById('user-avatar');
    
    if (userNameEl) userNameEl.textContent = userData.name;
    if (userAvatarEl) userAvatarEl.textContent = userData.name.charAt(0);
    
    // Atualizar nível e progresso
    const levelEl = document.querySelector('.progress-label');
    if (levelEl) levelEl.textContent = `Nível ${userData.level}`;
    
    const progressPercentageEl = document.querySelector('.progress-percentage');
    if (progressPercentageEl) progressPercentageEl.textContent = `${userData.progress}%`;
    
    const progressValueEl = document.querySelector('.progress-value');
    if (progressValueEl) progressValueEl.style.width = `${userData.progress}%`;
  }

  /**
   * Atualiza as estatísticas gerais
   */
  updateStats() {
    const userData = this.dashboardData.getUserData();
    const statsData = this.dashboardData.getStatsData();
    if (!userData || !statsData) return;

    const statsValues = document.querySelectorAll('.stats-value');
    if (statsValues.length >= 4) {
      // Progresso geral
      statsValues[0].textContent = `${userData.progress}%`;
      statsValues[0].parentElement.querySelector('.stats-change').textContent = 
        userData.level > 1 ? `↑ Nível ${userData.level}` : '';
      
      // Flashcards estudados
      statsValues[1].textContent = statsData.flashcardsStudied;
      
      // Simulações completadas
      statsValues[2].textContent = statsData.simulationsCompleted;
      
      // Sequência de dias
      statsValues[3].textContent = userData.streak;
      statsValues[3].parentElement.querySelector('.stats-subtitle').textContent = 
        `Meta: ${userData.personalRecord}`;
    }
  }

  /**
   * Atualiza as barras de progresso
   */
  updateProgress() {
    const userData = this.dashboardData.getUserData();
    const statsData = this.dashboardData.getStatsData();
    if (!userData || !statsData) return;

    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length >= 4) {
      // Progresso para próximo nível
      const levelProgress = progressBars[0];
      levelProgress.querySelector('.progress-percentage').textContent = `${userData.progress}%`;
      levelProgress.querySelector('.progress-value').style.width = `${userData.progress}%`;
      
      // Flashcards estudados
      const flashcardsProgress = progressBars[1];
      const flashcardsPercentage = Math.min(100, Math.round(statsData.flashcardsStudied / 50 * 100));
      flashcardsProgress.querySelector('.progress-percentage').textContent = `${flashcardsPercentage}%`;
      flashcardsProgress.querySelector('.progress-value').style.width = `${flashcardsPercentage}%`;
      
      // Taxa de acerto
      const correctAnswersProgress = progressBars[2];
      correctAnswersProgress.querySelector('.progress-percentage').textContent = `${statsData.correctAnswers}%`;
      correctAnswersProgress.querySelector('.progress-value').style.width = `${statsData.correctAnswers}%`;
      
      // Sequência de dias
      const streakProgress = progressBars[3];
      const streakPercentage = userData.personalRecord > 0 
        ? Math.round((userData.streak / userData.personalRecord) * 100)
        : 0;
      streakProgress.querySelector('.progress-percentage').textContent = `${streakPercentage}%`;
      streakProgress.querySelector('.progress-value').style.width = `${streakPercentage}%`;
    }
  }

  /**
   * Atualiza a lista de atividades recentes
   */
  updateActivities() {
    const activitiesData = this.dashboardData.getActivitiesData();
    if (!activitiesData) return;

    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Limpar lista atual
    activityList.innerHTML = '';
    
    // Verificar se há atividades
    if (activitiesData.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <p>Nenhuma atividade registrada ainda. Comece a estudar flashcards ou fazer simulações para ver seu progresso aqui.</p>
      `;
      activityList.appendChild(emptyMessage);
      return;
    }
    
    // Adicionar atividades
    activitiesData.forEach(activity => {
      let iconClass = '';
      switch(activity.type) {
        case 'flashcard': iconClass = 'primary'; break;
        case 'simulation': iconClass = 'accent'; break;
        case 'achievement': iconClass = 'success'; break;
        case 'streak': iconClass = 'warning'; break;
        case 'level': iconClass = 'info'; break;
      }
      
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.innerHTML = `
        <div class="activity-icon ${iconClass}">
          <i class="fas ${activity.type === 'flashcard' ? 'fa-clone' : 
                        activity.type === 'simulation' ? 'fa-comments' : 
                        activity.type === 'achievement' ? 'fa-trophy' : 
                        activity.type === 'level' ? 'fa-level-up-alt' : 'fa-fire'}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-subtitle">${activity.subtitle}</div>
        </div>
        <div class="activity-time">${activity.time}</div>
      `;
      
      activityList.appendChild(activityItem);
    });
  }

  /**
   * Atualiza os desafios diários
   */
  updateChallenges() {
    const challengesData = this.dashboardData.getChallengesData();
    if (!challengesData) return;

    const quickActions = document.querySelector('.quick-actions');
    if (!quickActions) return;
    
    // Limpar lista atual
    quickActions.innerHTML = '';
    
    // Adicionar desafios
    challengesData.forEach(challenge => {
      let iconClass = '';
      switch(challenge.type) {
        case 'flashcard': iconClass = 'primary'; break;
        case 'simulation': iconClass = 'accent'; break;
        case 'category': iconClass = 'success'; break;
        case 'review': iconClass = 'warning'; break;
      }
      
      const progressPercentage = Math.round((challenge.progress / challenge.total) * 100);
      
      const quickAction = document.createElement('div');
      quickAction.className = 'quick-action';
      quickAction.innerHTML = `
        <div class="quick-action-icon ${iconClass}">
          <i class="fas ${challenge.type === 'flashcard' ? 'fa-clone' : 
                        challenge.type === 'simulation' ? 'fa-comments' : 
                        challenge.type === 'category' ? 'fa-th-large' : 'fa-star'}"></i>
        </div>
        <div class="quick-action-content">
          <div class="quick-action-title">${challenge.title}</div>
          <div class="quick-action-subtitle">Progresso: ${challenge.progress}/${challenge.total}</div>
          <div class="progress-bar">
            <div class="progress-value" style="width: ${progressPercentage}%"></div>
          </div>
        </div>
      `;
      
      quickActions.appendChild(quickAction);
    });
  }

  /**
   * Atualiza os gráficos do dashboard
   */
  updateCharts() {
    const categoriesData = this.dashboardData.getCategoriesData();
    const progressData = this.dashboardData.getProgressData();
    if (!categoriesData || !progressData) return;

    // Atualizar gráfico de categorias
    const categoriasCtx = document.getElementById('categoriasChart');
    if (categoriasCtx && window.Chart) {
      const categoriasChart = Chart.getChart(categoriasCtx);
      if (categoriasChart) {
        categoriasChart.data.datasets[0].data = [
          categoriesData.respiratorios,
          categoriesData.dermatologicos,
          categoriesData.digestivos,
          categoriesData.dores,
          categoriesData.outros
        ];
        categoriasChart.update();
      }
    }
    
    // Atualizar gráfico de progresso
    const progressoCtx = document.getElementById('progressoChart');
    if (progressoCtx && window.Chart) {
      const progressoChart = Chart.getChart(progressoCtx);
      if (progressoChart) {
        progressoChart.data.labels = progressData.days;
        progressoChart.data.datasets[0].data = progressData.flashcards;
        progressoChart.data.datasets[1].data = progressData.simulations;
        progressoChart.update();
      }
    }
  }
}
