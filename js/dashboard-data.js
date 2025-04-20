/**
 * Dashboard Data Module - Versão com Rastreamento de Uso Real
 * Fornece dados para o dashboard baseados no uso real do aplicativo
 */
export default class DashboardData {
  constructor() {
    this.storagePrefix = 'farmalearn_';
    this.initializeData();
  }

  /**
   * Inicializa os dados do dashboard com valores mínimos
   */
  initializeData() {
    // Verificar se os dados já existem no localStorage
    if (!localStorage.getItem(`${this.storagePrefix}dashboard_initialized`)) {
      // Dados iniciais mínimos para o dashboard
      const initialData = {
        user: {
          name: 'Juliano',
          role: 'Balconista',
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          progress: 0,
          streak: 0,
          personalRecord: 0
        },
        stats: {
          flashcardsStudied: 0,
          simulationsCompleted: 0,
          correctAnswers: 0,
          ticketAverage: 0
        },
        categories: {
          respiratorios: 0,
          dermatologicos: 0,
          digestivos: 0,
          dores: 0,
          outros: 0
        },
        progress: {
          days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          flashcards: [0, 0, 0, 0, 0, 0, 0],
          simulations: [0, 0, 0, 0, 0, 0, 0]
        },
        activities: [],
        challenges: [
          {
            type: 'flashcard',
            title: 'Estudar 5 flashcards',
            progress: 0,
            total: 5
          },
          {
            type: 'simulation',
            title: 'Completar 1 simulação',
            progress: 0,
            total: 1
          }
        ],
        flashcards: {
          learned: 0,
          toReview: 0,
          difficult: 0,
          mastery: 0
        },
        lastUpdate: new Date().toISOString()
      };

      // Salvar dados no localStorage
      localStorage.setItem(`${this.storagePrefix}user_data`, JSON.stringify(initialData.user));
      localStorage.setItem(`${this.storagePrefix}stats_data`, JSON.stringify(initialData.stats));
      localStorage.setItem(`${this.storagePrefix}categories_data`, JSON.stringify(initialData.categories));
      localStorage.setItem(`${this.storagePrefix}progress_data`, JSON.stringify(initialData.progress));
      localStorage.setItem(`${this.storagePrefix}activities_data`, JSON.stringify(initialData.activities));
      localStorage.setItem(`${this.storagePrefix}challenges_data`, JSON.stringify(initialData.challenges));
      localStorage.setItem(`${this.storagePrefix}flashcards_data`, JSON.stringify(initialData.flashcards));
      
      // Marcar como inicializado
      localStorage.setItem(`${this.storagePrefix}dashboard_initialized`, 'true');
    }
  }

  /**
   * Obtém os dados do usuário
   * @returns {Object} Dados do usuário
   */
  getUserData() {
    const userData = localStorage.getItem(`${this.storagePrefix}user_data`);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Obtém as estatísticas gerais
   * @returns {Object} Estatísticas gerais
   */
  getStatsData() {
    const statsData = localStorage.getItem(`${this.storagePrefix}stats_data`);
    return statsData ? JSON.parse(statsData) : null;
  }

  /**
   * Obtém os dados de categorias
   * @returns {Object} Dados de categorias
   */
  getCategoriesData() {
    const categoriesData = localStorage.getItem(`${this.storagePrefix}categories_data`);
    return categoriesData ? JSON.parse(categoriesData) : null;
  }

  /**
   * Obtém os dados de progresso
   * @returns {Object} Dados de progresso
   */
  getProgressData() {
    const progressData = localStorage.getItem(`${this.storagePrefix}progress_data`);
    return progressData ? JSON.parse(progressData) : null;
  }

  /**
   * Obtém as atividades recentes
   * @returns {Array} Atividades recentes
   */
  getActivitiesData() {
    const activitiesData = localStorage.getItem(`${this.storagePrefix}activities_data`);
    return activitiesData ? JSON.parse(activitiesData) : [];
  }

  /**
   * Obtém os desafios diários
   * @returns {Array} Desafios diários
   */
  getChallengesData() {
    const challengesData = localStorage.getItem(`${this.storagePrefix}challenges_data`);
    return challengesData ? JSON.parse(challengesData) : [];
  }

  /**
   * Obtém os dados de flashcards
   * @returns {Object} Dados de flashcards
   */
  getFlashcardsData() {
    const flashcardsData = localStorage.getItem(`${this.storagePrefix}flashcards_data`);
    return flashcardsData ? JSON.parse(flashcardsData) : null;
  }

  /**
   * Registra um flashcard estudado
   * @param {string} category Categoria do flashcard
   * @param {string} difficulty Dificuldade do flashcard (easy, medium, hard)
   */
  recordFlashcardStudied(category, difficulty) {
    // Atualizar estatísticas gerais
    const statsData = this.getStatsData();
    statsData.flashcardsStudied += 1;
    
    // Atualizar dados de categorias
    const categoriesData = this.getCategoriesData();
    if (categoriesData[category]) {
      // Aumentar domínio da categoria (máximo 100)
      categoriesData[category] = Math.min(100, categoriesData[category] + 2);
    }
    
    // Atualizar dados de progresso
    const progressData = this.getProgressData();
    const today = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ...
    const dayIndex = today === 0 ? 6 : today - 1; // Converter para nosso array (0 = Segunda, ..., 6 = Domingo)
    progressData.flashcards[dayIndex] += 1;
    
    // Atualizar dados de flashcards
    const flashcardsData = this.getFlashcardsData();
    if (difficulty === 'easy') {
      flashcardsData.learned += 1;
    } else if (difficulty === 'medium') {
      flashcardsData.toReview += 1;
    } else if (difficulty === 'hard') {
      flashcardsData.difficult += 1;
    }
    
    // Calcular domínio geral
    const totalCards = flashcardsData.learned + flashcardsData.toReview + flashcardsData.difficult;
    if (totalCards > 0) {
      flashcardsData.mastery = Math.round((flashcardsData.learned / totalCards) * 100);
    }
    
    // Atualizar XP e nível do usuário
    const userData = this.getUserData();
    const xpGained = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
    userData.xp += xpGained;
    
    // Verificar se subiu de nível
    if (userData.xp >= userData.xpToNextLevel) {
      userData.level += 1;
      userData.xp = userData.xp - userData.xpToNextLevel;
      userData.xpToNextLevel = Math.round(userData.xpToNextLevel * 1.5);
      
      // Adicionar atividade de nível
      this.addActivity({
        type: 'level',
        title: `Nível ${userData.level} alcançado!`,
        subtitle: 'Continue estudando para avançar mais',
        time: this.formatTime(new Date())
      });
    }
    
    // Calcular progresso percentual para o próximo nível
    userData.progress = Math.round((userData.xp / userData.xpToNextLevel) * 100);
    
    // Atualizar desafios
    const challengesData = this.getChallengesData();
    const flashcardChallenge = challengesData.find(c => c.type === 'flashcard');
    if (flashcardChallenge && flashcardChallenge.progress < flashcardChallenge.total) {
      flashcardChallenge.progress += 1;
      
      // Verificar se completou o desafio
      if (flashcardChallenge.progress >= flashcardChallenge.total) {
        // Adicionar atividade de desafio completado
        this.addActivity({
          type: 'achievement',
          title: 'Desafio completado!',
          subtitle: flashcardChallenge.title,
          time: this.formatTime(new Date())
        });
        
        // Criar novo desafio com meta maior
        const newTotal = flashcardChallenge.total + 5;
        flashcardChallenge.progress = 0;
        flashcardChallenge.total = newTotal;
        flashcardChallenge.title = `Estudar ${newTotal} flashcards`;
      }
    }
    
    // Adicionar atividade
    this.addActivity({
      type: 'flashcard',
      title: 'Flashcard estudado',
      subtitle: `Categoria: ${this.getCategoryName(category)}`,
      time: this.formatTime(new Date())
    });
    
    // Salvar dados atualizados
    localStorage.setItem(`${this.storagePrefix}stats_data`, JSON.stringify(statsData));
    localStorage.setItem(`${this.storagePrefix}categories_data`, JSON.stringify(categoriesData));
    localStorage.setItem(`${this.storagePrefix}progress_data`, JSON.stringify(progressData));
    localStorage.setItem(`${this.storagePrefix}flashcards_data`, JSON.stringify(flashcardsData));
    localStorage.setItem(`${this.storagePrefix}user_data`, JSON.stringify(userData));
    localStorage.setItem(`${this.storagePrefix}challenges_data`, JSON.stringify(challengesData));
  }

  /**
   * Registra uma simulação completada
   * @param {string} scenarioTitle Título do cenário
   * @param {number} score Pontuação obtida (0-100)
   * @param {number} ticketValue Valor do ticket médio
   */
  recordSimulationCompleted(scenarioTitle, score, ticketValue) {
    // Atualizar estatísticas gerais
    const statsData = this.getStatsData();
    statsData.simulationsCompleted += 1;
    
    // Atualizar taxa de acerto
    const totalCorrect = statsData.correctAnswers * (statsData.simulationsCompleted - 1);
    statsData.correctAnswers = Math.round((totalCorrect + score) / statsData.simulationsCompleted);
    
    // Atualizar ticket médio
    const totalTicket = statsData.ticketAverage * (statsData.simulationsCompleted - 1);
    statsData.ticketAverage = ((totalTicket + ticketValue) / statsData.simulationsCompleted).toFixed(2);
    
    // Atualizar dados de progresso
    const progressData = this.getProgressData();
    const today = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ...
    const dayIndex = today === 0 ? 6 : today - 1; // Converter para nosso array (0 = Segunda, ..., 6 = Domingo)
    progressData.simulations[dayIndex] += 1;
    
    // Atualizar XP e nível do usuário
    const userData = this.getUserData();
    const xpGained = Math.round(score / 5); // 20 XP para pontuação 100
    userData.xp += xpGained;
    
    // Verificar se subiu de nível
    if (userData.xp >= userData.xpToNextLevel) {
      userData.level += 1;
      userData.xp = userData.xp - userData.xpToNextLevel;
      userData.xpToNextLevel = Math.round(userData.xpToNextLevel * 1.5);
      
      // Adicionar atividade de nível
      this.addActivity({
        type: 'level',
        title: `Nível ${userData.level} alcançado!`,
        subtitle: 'Continue estudando para avançar mais',
        time: this.formatTime(new Date())
      });
    }
    
    // Calcular progresso percentual para o próximo nível
    userData.progress = Math.round((userData.xp / userData.xpToNextLevel) * 100);
    
    // Atualizar desafios
    const challengesData = this.getChallengesData();
    const simulationChallenge = challengesData.find(c => c.type === 'simulation');
    if (simulationChallenge && simulationChallenge.progress < simulationChallenge.total) {
      simulationChallenge.progress += 1;
      
      // Verificar se completou o desafio
      if (simulationChallenge.progress >= simulationChallenge.total) {
        // Adicionar atividade de desafio completado
        this.addActivity({
          type: 'achievement',
          title: 'Desafio completado!',
          subtitle: simulationChallenge.title,
          time: this.formatTime(new Date())
        });
        
        // Criar novo desafio com meta maior
        const newTotal = simulationChallenge.total + 1;
        simulationChallenge.progress = 0;
        simulationChallenge.total = newTotal;
        simulationChallenge.title = `Completar ${newTotal} simulações`;
      }
    }
    
    // Adicionar atividade
    this.addActivity({
      type: 'simulation',
      title: 'Simulação concluída',
      subtitle: `Cenário: ${scenarioTitle}`,
      time: this.formatTime(new Date())
    });
    
    // Salvar dados atualizados
    localStorage.setItem(`${this.storagePrefix}stats_data`, JSON.stringify(statsData));
    localStorage.setItem(`${this.storagePrefix}progress_data`, JSON.stringify(progressData));
    localStorage.setItem(`${this.storagePrefix}user_data`, JSON.stringify(userData));
    localStorage.setItem(`${this.storagePrefix}challenges_data`, JSON.stringify(challengesData));
  }

  /**
   * Atualiza a sequência de dias de estudo
   */
  updateStreak() {
    const userData = this.getUserData();
    const lastUpdate = localStorage.getItem(`${this.storagePrefix}last_login_date`);
    const today = new Date().toDateString();
    
    if (lastUpdate) {
      const lastDate = new Date(lastUpdate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Usuário acessou ontem, aumentar sequência
        userData.streak += 1;
        
        // Atualizar recorde pessoal se necessário
        if (userData.streak > userData.personalRecord) {
          userData.personalRecord = userData.streak;
        }
        
        // Adicionar atividade de sequência
        this.addActivity({
          type: 'streak',
          title: `Sequência de ${userData.streak} dias`,
          subtitle: 'Continue estudando para aumentar sua sequência!',
          time: this.formatTime(new Date())
        });
      } else if (lastDate.toDateString() !== today) {
        // Usuário não acessou ontem e não é a primeira vez hoje, resetar sequência
        userData.streak = 1;
      }
    } else {
      // Primeiro acesso, iniciar sequência
      userData.streak = 1;
    }
    
    // Salvar data de hoje
    localStorage.setItem(`${this.storagePrefix}last_login_date`, today);
    
    // Salvar dados atualizados
    localStorage.setItem(`${this.storagePrefix}user_data`, JSON.stringify(userData));
  }

  /**
   * Adiciona uma nova atividade
   * @param {Object} activity Nova atividade
   */
  addActivity(activity) {
    const activities = this.getActivitiesData();
    activities.unshift(activity); // Adicionar no início
    
    // Manter apenas as 10 atividades mais recentes
    if (activities.length > 10) {
      activities.pop();
    }
    
    localStorage.setItem(`${this.storagePrefix}activities_data`, JSON.stringify(activities));
  }

  /**
   * Formata a hora atual para exibição
   * @param {Date} date Data a ser formatada
   * @returns {string} Hora formatada
   */
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Hoje, ${hours}:${minutes}`;
  }

  /**
   * Obtém o nome da categoria
   * @param {string} category Código da categoria
   * @returns {string} Nome da categoria
   */
  getCategoryName(category) {
    const categoryMap = {
      'respiratorios': 'Respiratórios',
      'dermatologicos': 'Dermatológicos',
      'digestivos': 'Digestivos',
      'dores': 'Dores',
      'outros': 'Outros'
    };
    
    return categoryMap[category] || 'Geral';
  }

  /**
   * Reseta todos os dados do dashboard
   */
  resetData() {
    localStorage.removeItem(`${this.storagePrefix}dashboard_initialized`);
    localStorage.removeItem(`${this.storagePrefix}user_data`);
    localStorage.removeItem(`${this.storagePrefix}stats_data`);
    localStorage.removeItem(`${this.storagePrefix}categories_data`);
    localStorage.removeItem(`${this.storagePrefix}progress_data`);
    localStorage.removeItem(`${this.storagePrefix}activities_data`);
    localStorage.removeItem(`${this.storagePrefix}challenges_data`);
    localStorage.removeItem(`${this.storagePrefix}flashcards_data`);
    localStorage.removeItem(`${this.storagePrefix}last_login_date`);
    
    // Reinicializar dados
    this.initializeData();
  }
}
