/**
 * Aplicativo principal FarmaLearn
 * Integra todos os módulos e gerencia o fluxo da aplicação
 */

import DashboardManager from './dashboard.js';
import FlashcardManager from './flashcards.js';
import LoginSystem from './login.js';
import ThemeManager from './theme.js';

class FarmaLearnApp {
  constructor() {
    // Inicializar gerenciadores
    this.loginSystem = new LoginSystem();
    this.themeManager = new ThemeManager();
    this.dashboardManager = new DashboardManager();
    this.flashcardManager = new FlashcardManager(this.dashboardManager);
    
    // Verificar login
    this.loginSystem.requireLogin();
    
    // Inicializar interface
    this.initializeUI();
  }
  
  /**
   * Inicializa a interface do usuário
   */
  initializeUI() {
    // Atualizar informações do usuário
    this.loginSystem.updateUserInterface();
    
    // Inicializar tema
    this.themeManager.initThemeToggle();
    
    // Inicializar navegação
    this.initializeNavigation();
    
    // Inicializar página atual
    this.initializeCurrentPage();
  }
  
  /**
   * Inicializa a navegação entre páginas
   */
  initializeNavigation() {
    // Toggle da sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
      });
    }
    
    // Toggle do menu mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
      });
    }
    
    // Submenu toggle
    const menuItemsWithSubmenu = document.querySelectorAll('.menu-item[data-toggle]');
    
    menuItemsWithSubmenu.forEach(item => {
      item.addEventListener('click', function() {
        const submenuId = this.getAttribute('data-toggle');
        const submenu = document.getElementById(submenuId);
        
        this.classList.toggle('expanded');
      });
    });
    
    // Navegação entre páginas
    const menuItems = document.querySelectorAll('.menu-item[data-page], .mobile-nav-item[data-page]');
    
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        
        if (page === 'dashboard') {
          window.location.href = 'index.html';
        } else if (page === 'flashcards') {
          window.location.href = 'flashcards.html';
        } else if (page === 'simulator') {
          window.location.href = 'simulador.html';
        }
      });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.loginSystem.logout();
      });
    }
  }
  
  /**
   * Inicializa a página atual com base no URL
   */
  initializeCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
      this.initializeDashboard();
    } else if (path.includes('flashcards.html')) {
      this.initializeFlashcards();
    } else if (path.includes('simulador.html')) {
      this.initializeSimulator();
    }
  }
  
  /**
   * Inicializa a página de dashboard
   */
  initializeDashboard() {
    // Atualizar dashboard com dados do usuário
    this.dashboardManager.updateDashboard();
    
    // Inicializar gráficos (se Chart.js estiver disponível)
    this.initializeCharts();
  }
  
  /**
   * Inicializa os gráficos do dashboard
   */
  initializeCharts() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não está disponível. Os gráficos não serão exibidos.');
      return;
    }
    
    // Inicializar gráfico de categorias
    const categoriasChart = document.getElementById('categoriasChart');
    if (categoriasChart) {
      new Chart(categoriasChart, {
        type: 'radar',
        data: {
          labels: ['Respiratórios', 'Dermatológicos', 'Digestivos', 'Dores'],
          datasets: [{
            label: 'Domínio por Categoria',
            data: [
              this.dashboardManager.userData.categorias.respiratorios,
              this.dashboardManager.userData.categorias.dermatologicos,
              this.dashboardManager.userData.categorias.digestivos,
              this.dashboardManager.userData.categorias.dores
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              pointLabels: {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              ticks: {
                backdropColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }
      });
    }
    
    // Inicializar gráfico de progresso
    const progressoChart = document.getElementById('progressoChart');
    if (progressoChart) {
      new Chart(progressoChart, {
        type: 'line',
        data: {
          labels: this.dashboardManager.userData.progressoRecente.datas,
          datasets: [{
            label: 'Progresso Diário',
            data: this.dashboardManager.userData.progressoRecente.valores,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }
      });
    }
  }
  
  /**
   * Inicializa a página de flashcards
   */
  initializeFlashcards() {
    // Obter elementos da interface
    const flashcardsContainer = document.getElementById('flashcards-container');
    const currentCardEl = document.getElementById('current-card');
    const totalCardsEl = document.getElementById('total-cards');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const categoryPills = document.querySelectorAll('.category-pill');
    
    if (!flashcardsContainer) return;
    
    // Variáveis de estado
    let currentCategory = 'all';
    let currentIndex = 0;
    let filteredCards = [];
    
    // Dados de exemplo para flashcards
    const flashcardsData = [
      {
        id: 1,
        category: 'respiratorios',
        front: 'Loratadina',
        back: 'Anti-histamínico não sedativo indicado para alergias, rinite alérgica e urticária.',
        difficulty: 'easy'
      },
      {
        id: 2,
        category: 'respiratorios',
        front: 'Dexclorfeniramina',
        back: 'Anti-histamínico de primeira geração para alergias, rinite e sintomas de resfriado comum.',
        difficulty: 'medium'
      },
      {
        id: 3,
        category: 'respiratorios',
        front: 'Fenilefrina',
        back: 'Descongestionante nasal que alivia a congestão associada a resfriados, sinusite e rinite alérgica.',
        difficulty: 'hard'
      },
      {
        id: 4,
        category: 'dermatologicos',
        front: 'Dexpantenol',
        back: 'Hidratante e cicatrizante para pele seca, irritada ou com pequenas lesões.',
        difficulty: 'easy'
      },
      {
        id: 5,
        category: 'dermatologicos',
        front: 'Cetoconazol',
        back: 'Antifúngico para tratamento de micoses cutâneas, dermatite seborreica e caspa.',
        difficulty: 'medium'
      },
      {
        id: 6,
        category: 'digestivos',
        front: 'Simeticona',
        back: 'Antiespumante que alivia gases, distensão abdominal e flatulência.',
        difficulty: 'easy'
      },
      {
        id: 7,
        category: 'digestivos',
        front: 'Omeprazol',
        back: 'Inibidor da bomba de prótons para azia, refluxo gastroesofágico e úlceras gástricas.',
        difficulty: 'medium'
      },
      {
        id: 8,
        category: 'dores',
        front: 'Paracetamol',
        back: 'Analgésico e antitérmico para dores leves a moderadas e febre.',
        difficulty: 'easy'
      },
      {
        id: 9,
        category: 'dores',
        front: 'Ibuprofeno',
        back: 'Anti-inflamatório não esteroidal (AINE) para dores, inflamação e febre.',
        difficulty: 'medium'
      },
      {
        id: 10,
        category: 'dores',
        front: 'Dipirona',
        back: 'Analgésico e antitérmico potente para dores intensas e febre alta.',
        difficulty: 'medium'
      }
    ];
    
    // Carregar flashcards no gerenciador
    this.flashcardManager.loadFlashcards(flashcardsData);
    
    // Atualizar estatísticas
    this.flashcardManager.updateStatsUI();
    
    // Função para criar um flashcard
    const createFlashcard = (data) => {
      const flashcard = document.createElement('div');
      flashcard.className = 'flashcard';
      flashcard.dataset.id = data.id;
      flashcard.dataset.category = data.category;
      flashcard.dataset.difficulty = data.difficulty;
      
      // Obter progresso do flashcard
      const cardProgress = this.flashcardManager.userProgress.cards[data.id];
      const cardState = cardProgress ? cardProgress.estado : 'novo';
      
      // Adicionar classe baseada no estado
      flashcard.classList.add(`card-state-${cardState}`);
      
      flashcard.innerHTML = `
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div class="flashcard-category">${getCategoryName(data.category)}</div>
            <div class="flashcard-title">${data.front}</div>
            <div class="flashcard-footer">Clique para ver a resposta</div>
          </div>
          <div class="flashcard-back">
            <div class="flashcard-category">${getCategoryName(data.category)}</div>
            <div class="flashcard-content">${data.back}</div>
            <div class="flashcard-footer">
              <div class="flashcard-rating">
                <span class="rating-label">Dificuldade:</span>
                <div class="rating-buttons">
                  <button class="rating-btn" data-rating="1" title="Muito difícil">1</button>
                  <button class="rating-btn" data-rating="2" title="Difícil">2</button>
                  <button class="rating-btn" data-rating="3" title="Médio">3</button>
                  <button class="rating-btn" data-rating="4" title="Fácil">4</button>
                  <button class="rating-btn" data-rating="5" title="Muito fácil">5</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Evento de clique para virar o flashcard
      flashcard.addEventListener('click', function(e) {
        // Ignorar clique se for nos botões de avaliação
        if (e.target.classList.contains('rating-btn')) {
          return;
        }
        
        this.classList.toggle('flipped');
      });
      
      // Eventos para botões de avaliação
      const ratingButtons = flashcard.querySelectorAll('.rating-btn');
      ratingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation(); // Evitar que o card vire de volta
          
          const rating = parseInt(button.getAttribute('data-rating'));
          const cardId = data.id;
          
          // Processar resposta
          this.flashcardManager.processarResposta(cardId, rating);
          
          // Atualizar estatísticas
          this.flashcardManager.updateStatsUI();
          
          // Avançar para o próximo card após um breve delay
          setTimeout(() => {
            if (currentIndex < filteredCards.length - 1) {
              currentIndex++;
              updateFlashcardDisplay();
            } else {
              // Mostrar mensagem de conclusão
              flashcardsContainer.innerHTML = `
                <div class="completion-message">
                  <i class="fas fa-check-circle"></i>
                  <h3>Parabéns!</h3>
                  <p>Você completou todos os flashcards desta categoria.</p>
                  <button class="btn btn-primary" id="restart-btn">
                    Estudar Novamente
                  </button>
                </div>
              `;
              
              // Evento para o botão de reiniciar
              const restartBtn = document.getElementById('restart-btn');
              if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                  currentIndex = 0;
                  updateFlashcardDisplay();
                });
              }
            }
          }, 500);
        });
      });
      
      return flashcard;
    };
    
    // Função para obter o nome da categoria
    function getCategoryName(category) {
      const categoryMap = {
        'respiratorios': 'Respiratórios',
        'dermatologicos': 'Dermatológicos',
        'digestivos': 'Digestivos',
        'dores': 'Dores'
      };
      
      return categoryMap[category] || 'Geral';
    }
    
    // Função para atualizar a exibição dos flashcards
    const updateFlashcardDisplay = () => {
      // Limpar container
      flashcardsContainer.innerHTML = '';
      
      // Obter cards para estudo hoje
      const cardsParaEstudo = this.flashcardManager.getFlashcardsParaEstudoHoje(currentCategory);
      
      // Filtrar cards pela categoria selecionada
      filteredCards = currentCategory === 'all' 
        ? cardsParaEstudo 
        : cardsParaEstudo.filter(card => card.category === currentCategory);
      
      // Atualizar contadores
      if (currentCardEl) currentCardEl.textContent = filteredCards.length > 0 ? currentIndex + 1 : 0;
      if (totalCardsEl) totalCardsEl.textContent = filteredCards.length;
      
      // Verificar se há cards para exibir
      if (filteredCards.length === 0) {
        const noCards = document.createElement('div');
        noCards.className = 'no-cards-message';
        noCards.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Nenhum flashcard para revisar nesta categoria hoje.</p>';
        flashcardsContainer.appendChild(noCards);
        
        // Desabilitar botões de navegação
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
      }
      
      // Ajustar índice atual se necessário
      if (currentIndex >= filteredCards.length) {
        currentIndex = filteredCards.length - 1;
      }
      
      // Criar e adicionar o flashcard atual
      const currentCard = filteredCards[currentIndex];
      const flashcardElement = createFlashcard.call(this, currentCard);
      flashcardsContainer.appendChild(flashcardElement);
      
      // Atualizar estado dos botões de navegação
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === filteredCards.length - 1;
    };
    
    // Inicializar exibição
    updateFlashcardDisplay();
    
    // Eventos para botões de navegação
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          updateFlashcardDisplay();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (currentIndex < filteredCards.length - 1) {
          currentIndex++;
          updateFlashcardDisplay();
        }
      });
    }
    
    // Eventos para filtros de categoria
    categoryPills.forEach(pill => {
      pill.addEventListener('click', function() {
        // Atualizar UI
        categoryPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        
        // Atualizar categoria atual
        currentCategory = this.dataset.category;
        currentIndex = 0;
        
        // Atualizar exibição
        updateFlashcardDisplay();
      });
    });
    
    // Suporte a gestos de swipe para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    flashcardsContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    flashcardsContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe para esquerda (próximo)
        if (currentIndex < filteredCards.length - 1) {
          currentIndex++;
          updateFlashcardDisplay();
        }
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe para direita (anterior)
        if (currentIndex > 0) {
          currentIndex--;
          updateFlashcardDisplay();
        }
      }
    }
  }
  
  /**
   * Inicializa a página do simulador
   */
  initializeSimulator() {
    // Implementação básica do simulador
    console.log('Inicializando simulador...');
  }
}

// Função auxiliar para obter o nome da categoria
function getCategoryName(category) {
  const categoryMap = {
    'respiratorios': 'Respiratórios',
    'dermatologicos': 'Dermatológicos',
    'digestivos': 'Digestivos',
    'dores': 'Dores'
  };
  
  return categoryMap[category] || 'Geral';
}

// Inicializar aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  window.farmaLearnApp = new FarmaLearnApp();
});

export default FarmaLearnApp;
