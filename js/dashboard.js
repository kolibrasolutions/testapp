/**
 * Dashboard Manager para FarmaLearn
 * Gerencia os dados e estatísticas do dashboard
 */

class DashboardManager {
  constructor() {
    this.storagePrefix = 'farmalearn_';
    this.userData = this.loadUserData();
    
    // Inicializar dados do usuário se não existirem
    if (!this.userData) {
      this.initializeUserData();
    }
  }
  
  /**
   * Carrega os dados do usuário do localStorage
   * @returns {Object} Dados do usuário ou null se não existirem
   */
  loadUserData() {
    const userData = localStorage.getItem(`${this.storagePrefix}user_data`);
    return userData ? JSON.parse(userData) : null;
  }
  
  /**
   * Salva os dados do usuário no localStorage
   */
  saveUserData() {
    localStorage.setItem(`${this.storagePrefix}user_data`, JSON.stringify(this.userData));
  }
  
  /**
   * Inicializa os dados do usuário com valores zerados
   */
  initializeUserData() {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    this.userData = {
      progresso: {
        geral: 0,
        nivel: 1,
        ultimaAtualizacao: today
      },
      flashcards: {
        estudados: 0,
        aprendidos: 0,
        paraRevisar: 0,
        dificeis: 0,
        dominio: 0,
        metaDiaria: 15,
        progressoMeta: 0
      },
      simulacoes: {
        completadas: 0,
        taxaAcerto: 0,
        novasHoje: 0
      },
      sequencia: {
        dias: 0,
        recorde: 0
      },
      categorias: {
        respiratorios: 0,
        dermatologicos: 0,
        digestivos: 0,
        dores: 0
      },
      progressoRecente: {
        datas: [today],
        valores: [0]
      },
      atividades: []
    };
    
    this.saveUserData();
  }
  
  /**
   * Atualiza o dashboard com os dados atuais do usuário
   */
  updateDashboard() {
    // Atualizar estatísticas gerais
    this.updateProgressoGeral();
    this.updateFlashcardsEstudados();
    this.updateSimulacoesCompletadas();
    this.updateSequenciaDias();
    
    // Atualizar gráficos
    this.updateCategoriasChart();
    this.updateProgressoChart();
    
    // Atualizar lista de atividades
    this.updateAtividadesRecentes();
    
    // Atualizar desafios diários
    this.updateDesafiosDiarios();
  }
  
  /**
   * Atualiza a seção de progresso geral
   */
  updateProgressoGeral() {
    const progressoValue = document.querySelector('.stats-card:nth-child(1) .stats-value');
    const progressoPercentage = document.querySelector('.stats-card:nth-child(1) .progress-percentage');
    const progressoBar = document.querySelector('.stats-card:nth-child(1) .progress-value');
    const progressoNivel = document.querySelector('.stats-card:nth-child(1) .progress-label');
    const progressoChange = document.querySelector('.stats-card:nth-child(1) .stats-change');
    
    if (progressoValue) progressoValue.textContent = `${this.userData.progresso.geral}%`;
    if (progressoPercentage) progressoPercentage.textContent = `${this.userData.progresso.geral}%`;
    if (progressoBar) progressoBar.style.width = `${this.userData.progresso.geral}%`;
    if (progressoNivel) progressoNivel.textContent = `Nível ${this.userData.progresso.nivel}`;
    
    // Verificar se houve progresso desde ontem
    const today = new Date().toISOString().split('T')[0];
    if (this.userData.progresso.ultimaAtualizacao !== today && progressoChange) {
      progressoChange.innerHTML = '<i class="fas fa-arrow-up"></i> Comece a estudar hoje!';
    }
  }
  
  /**
   * Atualiza a seção de flashcards estudados
   */
  updateFlashcardsEstudados() {
    const flashcardsValue = document.querySelector('.stats-card:nth-child(2) .stats-value');
    const flashcardsPercentage = document.querySelector('.stats-card:nth-child(2) .progress-percentage');
    const flashcardsBar = document.querySelector('.stats-card:nth-child(2) .progress-value');
    const flashcardsChange = document.querySelector('.stats-card:nth-child(2) .stats-change');
    
    if (flashcardsValue) flashcardsValue.textContent = this.userData.flashcards.estudados;
    
    // Calcular progresso da meta diária
    const progressoMeta = Math.min(100, Math.round((this.userData.flashcards.progressoMeta / this.userData.flashcards.metaDiaria) * 100));
    
    if (flashcardsPercentage) flashcardsPercentage.textContent = `${progressoMeta}%`;
    if (flashcardsBar) flashcardsBar.style.width = `${progressoMeta}%`;
    
    if (flashcardsChange) {
      const novosHoje = this.getFlashcardsHoje();
      flashcardsChange.innerHTML = novosHoje > 0 ? 
        `<i class="fas fa-arrow-up"></i> ${novosHoje} novos hoje` : 
        `<i class="fas fa-info-circle"></i> Nenhum estudado hoje`;
    }
  }
  
  /**
   * Retorna o número de flashcards estudados hoje
   * @returns {number} Número de flashcards estudados hoje
   */
  getFlashcardsHoje() {
    // Implementação simplificada - em uma versão real, isso seria baseado em registros de atividade
    return this.userData.flashcards.progressoMeta;
  }
  
  /**
   * Atualiza a seção de simulações completadas
   */
  updateSimulacoesCompletadas() {
    const simulacoesValue = document.querySelector('.stats-card:nth-child(3) .stats-value');
    const simulacoesPercentage = document.querySelector('.stats-card:nth-child(3) .progress-percentage');
    const simulacoesBar = document.querySelector('.stats-card:nth-child(3) .progress-value');
    const simulacoesChange = document.querySelector('.stats-card:nth-child(3) .stats-change');
    
    if (simulacoesValue) simulacoesValue.textContent = this.userData.simulacoes.completadas;
    if (simulacoesPercentage) simulacoesPercentage.textContent = `${this.userData.simulacoes.taxaAcerto}%`;
    if (simulacoesBar) simulacoesBar.style.width = `${this.userData.simulacoes.taxaAcerto}%`;
    
    if (simulacoesChange) {
      simulacoesChange.innerHTML = this.userData.simulacoes.novasHoje > 0 ? 
        `<i class="fas fa-arrow-up"></i> ${this.userData.simulacoes.novasHoje} novas hoje` : 
        `<i class="fas fa-info-circle"></i> Nenhuma hoje`;
    }
  }
  
  /**
   * Atualiza a seção de sequência de dias
   */
  updateSequenciaDias() {
    const sequenciaValue = document.querySelector('.stats-card:nth-child(4) .stats-value');
    const sequenciaPercentage = document.querySelector('.stats-card:nth-child(4) .progress-percentage');
    const sequenciaBar = document.querySelector('.stats-card:nth-child(4) .progress-value');
    const sequenciaChange = document.querySelector('.stats-card:nth-child(4) .stats-change');
    
    if (sequenciaValue) sequenciaValue.textContent = this.userData.sequencia.dias;
    
    // Calcular progresso em relação ao recorde
    const recordeProgresso = this.userData.sequencia.recorde > 0 ? 
      Math.round((this.userData.sequencia.dias / this.userData.sequencia.recorde) * 100) : 0;
    
    if (sequenciaPercentage) sequenciaPercentage.textContent = `${recordeProgresso}%`;
    if (sequenciaBar) sequenciaBar.style.width = `${recordeProgresso}%`;
    
    if (sequenciaChange) {
      if (this.userData.sequencia.dias > 0) {
        sequenciaChange.innerHTML = `<i class="fas fa-fire"></i> Mantenha o ritmo!`;
      } else {
        sequenciaChange.innerHTML = `<i class="fas fa-calendar-check"></i> Comece hoje!`;
      }
    }
  }
  
  /**
   * Atualiza o gráfico de categorias
   */
  updateCategoriasChart() {
    // Esta função seria implementada com uma biblioteca de gráficos como Chart.js
    // Por enquanto, apenas verificamos se o elemento existe
    const categoriasChart = document.getElementById('categoriasChart');
    if (!categoriasChart) return;
    
    // Aqui seria implementada a lógica para atualizar o gráfico com os dados do usuário
    console.log('Atualizando gráfico de categorias...');
  }
  
  /**
   * Atualiza o gráfico de progresso recente
   */
  updateProgressoChart() {
    // Esta função seria implementada com uma biblioteca de gráficos como Chart.js
    // Por enquanto, apenas verificamos se o elemento existe
    const progressoChart = document.getElementById('progressoChart');
    if (!progressoChart) return;
    
    // Aqui seria implementada a lógica para atualizar o gráfico com os dados do usuário
    console.log('Atualizando gráfico de progresso...');
  }
  
  /**
   * Atualiza a lista de atividades recentes
   */
  updateAtividadesRecentes() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Limpar lista atual
    activityList.innerHTML = '';
    
    // Se não houver atividades, mostrar mensagem
    if (this.userData.atividades.length === 0) {
      const noActivity = document.createElement('div');
      noActivity.className = 'no-activity-message';
      noActivity.innerHTML = '<i class="fas fa-info-circle"></i><p>Nenhuma atividade recente. Comece a estudar!</p>';
      activityList.appendChild(noActivity);
      return;
    }
    
    // Adicionar atividades à lista (limitado às 4 mais recentes)
    const recentActivities = this.userData.atividades.slice(0, 4);
    
    recentActivities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      
      activityItem.innerHTML = `
        <div class="activity-icon ${activity.iconColor}">
          <i class="fas ${activity.icon}"></i>
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
   * Atualiza a seção de desafios diários
   */
  updateDesafiosDiarios() {
    const quickActions = document.querySelector('.quick-actions');
    if (!quickActions) return;
    
    // Atualizar progresso do desafio de flashcards
    const flashcardAction = quickActions.querySelector('.quick-action:nth-child(1)');
    if (flashcardAction) {
      const subtitle = flashcardAction.querySelector('.quick-action-subtitle');
      if (subtitle) {
        subtitle.textContent = `Progresso: ${this.userData.flashcards.progressoMeta}/${this.userData.flashcards.metaDiaria}`;
      }
    }
  }
  
  /**
   * Registra uma nova atividade
   * @param {Object} activity - Dados da atividade
   */
  registrarAtividade(activity) {
    // Adicionar timestamp à atividade
    const now = new Date();
    const timeString = now.getHours() < 12 ? 
      `Hoje, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}` : 
      `Hoje, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const novaAtividade = {
      ...activity,
      time: timeString
    };
    
    // Adicionar ao início da lista
    this.userData.atividades.unshift(novaAtividade);
    
    // Limitar a 20 atividades
    if (this.userData.atividades.length > 20) {
      this.userData.atividades.pop();
    }
    
    // Salvar dados atualizados
    this.saveUserData();
  }
  
  /**
   * Registra um flashcard estudado
   * @param {string} categoria - Categoria do flashcard
   * @param {string} dificuldade - Dificuldade do flashcard ('easy', 'medium', 'hard')
   */
  registrarFlashcardEstudado(categoria, dificuldade) {
    // Incrementar contadores
    this.userData.flashcards.estudados++;
    this.userData.flashcards.progressoMeta = Math.min(this.userData.flashcards.metaDiaria, this.userData.flashcards.progressoMeta + 1);
    
    // Atualizar domínio da categoria
    if (this.userData.categorias[categoria] !== undefined) {
      this.userData.categorias[categoria]++;
    }
    
    // Atualizar contadores baseados na dificuldade
    if (dificuldade === 'easy') {
      this.userData.flashcards.aprendidos++;
    } else if (dificuldade === 'medium') {
      this.userData.flashcards.paraRevisar++;
    } else if (dificuldade === 'hard') {
      this.userData.flashcards.dificeis++;
    }
    
    // Recalcular domínio geral
    const total = this.userData.flashcards.aprendidos + this.userData.flashcards.paraRevisar + this.userData.flashcards.dificeis;
    this.userData.flashcards.dominio = total > 0 ? 
      Math.round((this.userData.flashcards.aprendidos / total) * 100) : 0;
    
    // Atualizar progresso geral
    this.atualizarProgressoGeral();
    
    // Registrar atividade
    this.registrarAtividade({
      icon: 'fa-clone',
      iconColor: 'primary',
      title: `Completou um flashcard`,
      subtitle: `Categoria: ${getCategoryName(categoria)}`
    });
    
    // Salvar dados atualizados
    this.saveUserData();
  }
  
  /**
   * Registra uma simulação completada
   * @param {string} cenario - Cenário da simulação
   * @param {number} acertos - Número de acertos
   * @param {number} total - Total de questões
   */
  registrarSimulacaoCompletada(cenario, acertos, total) {
    // Incrementar contadores
    this.userData.simulacoes.completadas++;
    this.userData.simulacoes.novasHoje++;
    
    // Calcular taxa de acerto
    const taxaAcerto = Math.round((acertos / total) * 100);
    this.userData.simulacoes.taxaAcerto = Math.round(
      (this.userData.simulacoes.taxaAcerto * (this.userData.simulacoes.completadas - 1) + taxaAcerto) / 
      this.userData.simulacoes.completadas
    );
    
    // Atualizar progresso geral
    this.atualizarProgressoGeral();
    
    // Registrar atividade
    this.registrarAtividade({
      icon: 'fa-comments',
      iconColor: 'accent',
      title: `Simulação concluída com sucesso`,
      subtitle: `Cenário: ${cenario}`
    });
    
    // Salvar dados atualizados
    this.saveUserData();
  }
  
  /**
   * Atualiza o progresso geral com base nas atividades
   */
  atualizarProgressoGeral() {
    // Fórmula simplificada: (flashcards estudados + simulações * 5) / meta para nível atual
    const metaNivel = this.userData.progresso.nivel * 100;
    const pontos = this.userData.flashcards.estudados + (this.userData.simulacoes.completadas * 5);
    
    this.userData.progresso.geral = Math.min(100, Math.round((pontos / metaNivel) * 100));
    
    // Verificar se passou de nível
    if (this.userData.progresso.geral >= 100) {
      this.userData.progresso.nivel++;
      this.userData.progresso.geral = 0;
      
      // Registrar atividade de novo nível
      this.registrarAtividade({
        icon: 'fa-trophy',
        iconColor: 'success',
        title: `Nível ${this.userData.progresso.nivel} alcançado!`,
        subtitle: `Parabéns pelo seu progresso!`
      });
    }
    
    // Atualizar data da última atualização
    this.userData.progresso.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    
    // Atualizar progresso recente
    this.atualizarProgressoRecente();
    
    // Atualizar sequência de dias
    this.atualizarSequenciaDias();
  }
  
  /**
   * Atualiza o progresso recente
   */
  atualizarProgressoRecente() {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já temos uma entrada para hoje
    if (this.userData.progressoRecente.datas[0] === today) {
      // Atualizar o valor de hoje
      this.userData.progressoRecente.valores[0] = this.userData.progresso.geral;
    } else {
      // Adicionar nova entrada para hoje
      this.userData.progressoRecente.datas.unshift(today);
      this.userData.progressoRecente.valores.unshift(this.userData.progresso.geral);
      
      // Limitar a 7 dias
      if (this.userData.progressoRecente.datas.length > 7) {
        this.userData.progressoRecente.datas.pop();
        this.userData.progressoRecente.valores.pop();
      }
    }
  }
  
  /**
   * Atualiza a sequência de dias
   */
  atualizarSequenciaDias() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    // Se já estudou hoje e a última atualização foi ontem, incrementar sequência
    if (this.getFlashcardsHoje() > 0 && this.userData.progresso.ultimaAtualizacao === yesterdayString) {
      this.userData.sequencia.dias++;
      
      // Atualizar recorde se necessário
      if (this.userData.sequencia.dias > this.userData.sequencia.recorde) {
        this.userData.sequencia.recorde = this.userData.sequencia.dias;
      }
      
      // Registrar atividade de sequência a cada 5 dias
      if (this.userData.sequencia.dias % 5 === 0) {
        this.registrarAtividade({
          icon: 'fa-fire',
          iconColor: 'warning',
          title: `Sequência de ${this.userData.sequencia.dias} dias!`,
          subtitle: `Continue estudando para aumentar sua sequência!`
        });
      }
    } 
    // Se não estudou ontem e não é o primeiro dia, resetar sequência
    else if (this.userData.progresso.ultimaAtualizacao !== yesterdayString && 
             this.userData.progresso.ultimaAtualizacao !== today &&
             this.userData.sequencia.dias > 0) {
      this.userData.sequencia.dias = 0;
    }
  }
  
  /**
   * Reseta todos os dados do usuário
   */
  resetarDados() {
    this.initializeUserData();
    this.updateDashboard();
  }
}

/**
 * Função auxiliar para obter o nome da categoria
 * @param {string} category - Código da categoria
 * @returns {string} Nome formatado da categoria
 */
function getCategoryName(category) {
  const categoryMap = {
    'respiratorios': 'Problemas Respiratórios',
    'dermatologicos': 'Problemas Dermatológicos',
    'digestivos': 'Problemas Digestivos',
    'dores': 'Dores'
  };
  
  return categoryMap[category] || 'Geral';
}

export default DashboardManager;
